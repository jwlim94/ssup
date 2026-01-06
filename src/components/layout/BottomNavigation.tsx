"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { getUnreadNotificationCount } from "@/lib/actions/notifications";
import { ROUTES } from "@/lib/constants";

/**
 * 네비게이션 아이템 타입
 */
interface NavItem {
  href: string;
  icon: () => React.ReactNode;
  requiresAuth: boolean;
  label: string; // 접근성용
}

/**
 * Bottom Navigation 컴포넌트
 * - 5개 탭: 홈, 채팅, 포스트 작성, 알림, 프로필
 * - 비로그인 시 인증 필요 탭 클릭 → 로그인 페이지로 리다이렉트
 * - 알림 탭에 읽지 않은 알림 배지 표시
 */
export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // 알림 카운트 상태
  const [notificationCount, setNotificationCount] = useState(0);
  const isMounted = useRef(true);

  // 알림 카운트 조회
  const fetchNotificationCount = useCallback(async () => {
    const count = await getUnreadNotificationCount();
    if (isMounted.current) {
      setNotificationCount(count);
    }
  }, []);

  // 초기 로드 및 user 변경 시 갱신
  useEffect(() => {
    isMounted.current = true;

    const loadCount = async () => {
      if (user) {
        const count = await getUnreadNotificationCount();
        if (isMounted.current) {
          setNotificationCount(count);
        }
      } else {
        if (isMounted.current) {
          setNotificationCount(0);
        }
      }
    };

    loadCount();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  // 실시간 알림 구독
  useRealtimeNotifications({
    userId: user?.id || null,
    onNewNotification: fetchNotificationCount,
    enabled: !!user,
  });

  // 네비게이션 아이템 정의
  // 아이콘 모양은 동일하게 유지하고, 색상만 부모 컴포넌트에서 변경
  const navItems: NavItem[] = [
    {
      href: ROUTES.HOME,
      label: "Home",
      requiresAuth: false,
      icon: () => (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: ROUTES.CHAT,
      label: "Chat",
      requiresAuth: true,
      icon: () => (
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      href: ROUTES.POST_NEW,
      label: "New Post",
      requiresAuth: true,
      icon: () => (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      href: ROUTES.NOTIFICATIONS,
      label: "Notifications",
      requiresAuth: true,
      icon: () => (
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
      ),
    },
    {
      href: ROUTES.PROFILE,
      label: "Profile",
      requiresAuth: true,
      icon: () => (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  // 활성 탭 체크
  const isActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 탭 클릭 핸들러 (인증 체크)
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (item.requiresAuth && !user) {
      e.preventDefault();
      router.push(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(item.href)}`);
    }
  };

  // 배지 표시 텍스트
  const getBadgeText = (count: number) => {
    if (count > 99) return "99+";
    return count.toString();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const isNotification = item.href === ROUTES.NOTIFICATIONS;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600 active:bg-gray-100"
                }`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                {item.icon()}

                {/* 알림 배지 */}
                {isNotification && notificationCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {getBadgeText(notificationCount)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
