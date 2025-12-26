"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/lib/constants";

/**
 * 포스트의 댓글 목록 조회
 */
export async function getComments(postId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      users:user_id (
        id,
        nickname,
        avatar_url
      )
    `
    )
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    return { error: error.message, data: null };
  }

  // 각 댓글의 좋아요 수 가져오기
  const commentsWithLikes = await Promise.all(
    (data || []).map(async (comment) => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", comment.id);

      return {
        ...comment,
        likes_count: count ?? 0,
      };
    })
  );

  return { error: null, data: commentsWithLikes };
}

/**
 * 댓글 작성
 */
export async function createComment(formData: FormData) {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to comment" };
  }

  const postId = formData.get("post_id") as string;
  const content = formData.get("content") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);

  // 유효성 검사
  if (!postId) {
    return { error: "Post ID is required" };
  }

  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  if (content.length > APP_CONFIG.MAX_COMMENT_LENGTH) {
    return {
      error: `Comment must be ${APP_CONFIG.MAX_COMMENT_LENGTH} characters or less`,
    };
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return { error: "Location is required" };
  }

  // PostGIS Point 형식으로 위치 저장
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: content.trim(),
    location: `POINT(${longitude} ${latitude})`,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}

/**
 * 댓글 삭제 (Soft Delete)
 */
export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a comment" };
  }

  // 본인 댓글인지 확인 후 삭제
  const { error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}
