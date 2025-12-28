"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";
import { ROUTES } from "@/lib/constants";

export default function NotificationBadge() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const isMounted = useRef(true);

  const fetchCount = useCallback(async () => {
    const unreadCount = await getUnreadNotificationCount();
    if (isMounted.current) {
      setCount(unreadCount);
    }
  }, []);

  // 초기 로드 및 user 변경 시 갱신
  useEffect(() => {
    isMounted.current = true;

    const loadCount = async () => {
      if (user) {
        const unreadCount = await getUnreadNotificationCount();
        if (isMounted.current) {
          setCount(unreadCount);
        }
      } else {
        if (isMounted.current) {
          setCount(0);
        }
      }
    };

    loadCount();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  // 새 알림이 오면 카운트 갱신
  const handleNewNotification = useCallback(() => {
    fetchCount();
  }, [fetchCount]);

  // Realtime 구독
  useRealtimeNotifications({
    userId: user?.id || null,
    onNewNotification: handleNewNotification,
    enabled: !!user,
  });

  return (
    <Link
      href={ROUTES.NOTIFICATIONS}
      className="relative text-gray-600 hover:text-gray-900 p-2 -m-2"
    >
      {/* Bell Icon */}
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Badge */}
      {count > 0 && (
        <span className="absolute top-0 right-0 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
