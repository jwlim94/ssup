"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/lib/constants";

/**
 * 주변 포스트 조회
 *
 * get_nearby_posts SQL 함수를 호출하여 반경 내 포스트 가져오기
 */
export async function getNearbyPosts(
  latitude: number,
  longitude: number,
  sortBy: "recent" | "distance" | "popular" = "recent"
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_nearby_posts", {
    user_lat: latitude,
    user_lng: longitude,
    radius_meters: APP_CONFIG.DEFAULT_RADIUS_METERS,
    sort_by: sortBy,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data };
}

/**
 * 포스트 상세 조회
 */
export async function getPost(postId: string) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
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
    .eq("id", postId)
    .is("deleted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  // 좋아요 수
  const { count: likesCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  // 댓글 수
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .is("deleted_at", null);

  return {
    error: null,
    data: {
      ...post,
      likes_count: likesCount ?? 0,
      comments_count: commentsCount ?? 0,
    },
  };
}

/**
 * 포스트 작성
 */
export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a post" };
  }

  const content = formData.get("content") as string;
  const imageUrl = formData.get("image_url") as string | null;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);

  // 유효성 검사
  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  if (content.length > APP_CONFIG.MAX_POST_LENGTH) {
    return {
      error: `Content must be ${APP_CONFIG.MAX_POST_LENGTH} characters or less`,
    };
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return { error: "Location is required" };
  }

  // 만료 시간 계산 (24시간 후)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + APP_CONFIG.POST_EXPIRY_HOURS);

  // PostGIS Point 형식으로 위치 저장
  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content: content.trim(),
    image_url: imageUrl || null,
    location: `POINT(${longitude} ${latitude})`,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

/**
 * 포스트 삭제 (Soft Delete)
 */
export async function deletePost(postId: string) {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a post" };
  }

  // 본인 포스트인지 확인 후 삭제
  const { error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
