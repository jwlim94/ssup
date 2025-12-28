"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GroupedNotification } from "@/types/notification";

/**
 * 알림 생성 (내부용)
 * - 댓글, 좋아요 등의 액션에서 호출
 * - 자기 자신에게는 알림 안 감
 * - Service Role 사용 (RLS 우회)
 */
export async function createNotification({
  userId,
  actorId,
  type,
  postId,
  commentId,
}: {
  userId: string;
  actorId: string;
  type: "comment" | "post_like" | "comment_like" | "mention";
  postId?: string;
  commentId?: string;
}) {
  // 자기 자신에게는 알림 X
  if (userId === actorId) {
    return;
  }

  // Admin Client 사용 (RLS 우회)
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("notifications").upsert(
    {
      user_id: userId,
      actor_id: actorId,
      type,
      post_id: postId || null,
      comment_id: commentId || null,
    },
    {
      onConflict: "user_id,actor_id,type,post_id,comment_id",
      ignoreDuplicates: true,
    }
  );

  if (error) {
    console.error("createNotification error:", error);
  }
}

/**
 * 그룹핑된 알림 목록 조회
 * - 알림 페이지에서 사용
 */
export async function getGroupedNotifications(): Promise<{
  error: string | null;
  data: GroupedNotification[] | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  const { data, error } = await supabase.rpc("get_grouped_notifications", {
    p_user_id: user.id,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: data as GroupedNotification[] };
}

/**
 * 읽지 않은 알림 개수 조회
 * - 헤더 배지에서 사용
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { data } = await supabase.rpc("get_unread_notification_count", {
    p_user_id: user.id,
  });

  return data || 0;
}

/**
 * 알림 읽음 처리 (그룹 단위)
 * - 알림 클릭 시 해당 그룹 전체 읽음 처리
 */
export async function markNotificationsAsRead({
  type,
  postId,
  commentId,
}: {
  type: string;
  postId?: string | null;
  commentId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  let query = supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("type", type)
    .is("read_at", null);

  if (postId) {
    query = query.eq("post_id", postId);
  } else {
    query = query.is("post_id", null);
  }

  if (commentId) {
    query = query.eq("comment_id", commentId);
  } else {
    query = query.is("comment_id", null);
  }

  await query;

  revalidatePath("/notifications");
  return { success: true };
}

/**
 * 모든 알림 읽음 처리
 * - "모두 읽음" 버튼에서 사용
 */
export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  revalidatePath("/notifications");
  return { success: true };
}
