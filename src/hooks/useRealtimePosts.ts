"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseRealtimePostsOptions {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  onNewPost: (isNearby: boolean) => void;
  enabled?: boolean;
}

export function useRealtimePosts({
  userLocation,
  onNewPost,
  enabled = true,
}: UseRealtimePostsOptions) {
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const handleInsert = useCallback(() => {
    if (!userLocation) return;
    // 모든 새 포스트에 대해 알림 (위치 필터링은 loadPosts에서 처리)
    onNewPost(true);
  }, [userLocation, onNewPost]);

  useEffect(() => {
    if (!enabled || !userLocation) return;

    // 기존 채널 정리
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // 새 채널 생성 및 구독
    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
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
  }, [enabled, userLocation, supabase, handleInsert]);
}
