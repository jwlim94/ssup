"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import {
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notifications";
import { ROUTES } from "@/lib/constants";
import {
  GroupedNotification,
  NOTIFICATION_MESSAGES,
} from "@/types/notification";
import { formatRelativeTime } from "@/lib/utils/time";
import { Spinner } from "@/components/ui/Spinner";

interface NotificationListProps {
  notifications: GroupedNotification[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasUnread = notifications.some((n) => n.unread_count > 0);

  const handleNotificationClick = async (notification: GroupedNotification) => {
    // 읽음 처리
    await markNotificationsAsRead({
      type: notification.type,
      postId: notification.post_id,
      commentId: notification.comment_id,
    });

    // 포스트로 이동
    if (notification.post_id) {
      router.push(ROUTES.POST_DETAIL(notification.post_id));
    }
  };

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      router.refresh();
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-center">No notifications yet</p>
        <p className="text-gray-400 text-sm text-center mt-1">
          We&apos;ll let you know when there&apos;s new activity
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 모두 읽음 버튼 */}
      {hasUnread && (
        <div className="px-4 py-3 border-b border-gray-100 flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 flex items-center gap-1"
          >
            {isPending && <Spinner size="sm" />}
            Mark all as read
          </button>
        </div>
      )}

      {/* 알림 목록 */}
      <div className="divide-y divide-gray-100">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={`${notification.type}-${notification.post_id}-${notification.comment_id}-${index}`}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: GroupedNotification;
  onClick: () => void;
}) {
  const { icon, action } = NOTIFICATION_MESSAGES[notification.type];
  const isUnread = notification.unread_count > 0;
  const firstActor = notification.recent_actors[0];
  const othersCount = notification.total_count - 1;

  // 미리보기 텍스트
  const previewText =
    notification.type === "comment_like"
      ? notification.comment_content
      : notification.post_content;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
        isUnread ? "bg-blue-50/50" : "bg-white"
      }`}
    >
      <div className="flex gap-3">
        {/* 아바타 */}
        <div className="shrink-0">
          {firstActor?.avatar_url ? (
            <Image
              src={firstActor.avatar_url}
              alt={firstActor.nickname}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">
                {firstActor?.nickname?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {/* 읽지 않음 표시 */}
            {isUnread && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
            )}
            <div className="flex-1">
              {/* 알림 메시지 */}
              <p className="text-gray-900 text-sm">
                <span className="mr-1">{icon}</span>
                <span className="font-semibold">{firstActor?.nickname}</span>
                {othersCount > 0 && (
                  <span className="text-gray-600">
                    {" "}
                    and {othersCount} other{othersCount > 1 ? "s" : ""}
                  </span>
                )}
                <span className="text-gray-600"> {action}</span>
              </p>

              {/* 미리보기 */}
              {previewText && (
                <p className="text-gray-500 text-sm mt-1 truncate">
                  &quot;{previewText}&quot;
                </p>
              )}

              {/* 시간 */}
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatRelativeTime(notification.latest_at)}
                {isUnread && notification.unread_count > 1 && (
                  <span className="text-blue-500 font-medium ml-1">
                    +{notification.unread_count} new
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 화살표 */}
        <div className="shrink-0 text-gray-300 self-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
