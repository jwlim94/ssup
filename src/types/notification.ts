import type { UserProfile } from "./user";

/**
 * 알림 유형
 *
 * - comment: 내 포스트에 댓글
 * - post_like: 내 포스트에 좋아요
 * - comment_like: 내 댓글에 좋아요
 * - mention: 포스트/댓글에서 @멘션
 */
export type NotificationType =
  | "comment"
  | "post_like"
  | "comment_like"
  | "mention";

/**
 * 알림 기본 타입 (notifications 테이블)
 *
 * DB에서 직접 조회했을 때의 형태
 */
export interface Notification {
  id: string;
  user_id: string; // 수신자
  actor_id: string; // 발신자
  type: NotificationType;
  post_id: string | null;
  comment_id: string | null;
  read_at: string | null;
  created_at: string;
}

/**
 * 그룹핑된 알림 (get_grouped_notifications RPC 결과)
 *
 * 사용처:
 * - 알림 페이지 목록
 */
export interface GroupedNotification {
  type: NotificationType;
  post_id: string | null;
  comment_id: string | null;
  total_count: number; // 그룹 내 총 알림 개수
  unread_count: number; // 읽지 않은 알림 개수
  latest_at: string; // 가장 최근 알림 시간
  recent_actors: UserProfile[]; // 최근 3명 정보
  post_content: string | null; // 포스트 내용 미리보기
  comment_content: string | null; // 댓글 내용 미리보기
}

/**
 * 알림 유형별 메시지 생성용
 */
export const NOTIFICATION_MESSAGES: Record<
  NotificationType,
  { icon: string; action: string }
> = {
  comment: { icon: "💬", action: "commented on your post" },
  post_like: { icon: "❤️", action: "liked your post" },
  comment_like: { icon: "❤️", action: "liked your comment" },
  mention: { icon: "📣", action: "mentioned you" },
};
