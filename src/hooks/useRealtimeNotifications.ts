"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseRealtimeNotificationsOptions {
  userId: string | null;
  onNewNotification: () => void;
  enabled?: boolean;
}

export function useRealtimeNotifications({
  userId,
  onNewNotification,
  enabled = true,
}: UseRealtimeNotificationsOptions) {
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const handleInsert = useCallback(
    (payload: { new: { user_id: string } }) => {
      // 자신에게 온 알림인 경우에만 콜백 호출
      if (payload.new.user_id === userId) {
        onNewNotification();
      }
    },
    [userId, onNewNotification]
  );

  useEffect(() => {
    if (!enabled || !userId) return;

    // 기존 채널 정리
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // 새 채널 생성 및 구독
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        handleInsert
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enabled, userId, supabase, handleInsert]);
}
