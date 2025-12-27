"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * 현재 사용자 프로필 조회
 */
export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data: profile };
}

/**
 * 프로필 수정 (닉네임)
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const nickname = formData.get("nickname") as string;

  if (!nickname || nickname.trim().length === 0) {
    return { error: "Nickname is required" };
  }

  if (nickname.length > 30) {
    return { error: "Nickname must be 30 characters or less" };
  }

  // 닉네임 중복 체크 (본인 제외)
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", nickname.trim())
    .neq("id", user.id)
    .single();

  if (existingUser) {
    return { error: "This nickname is already taken" };
  }

  const { error } = await supabase
    .from("users")
    .update({ nickname: nickname.trim(), updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}

/**
 * 아바타 업로드
 */
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // 파일 크기 검증
  if (file.size > MAX_AVATAR_SIZE) {
    return { error: "Avatar must be less than 3MB" };
  }

  // 파일 타입 검증
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" };
  }

  // 기존 아바타 삭제 (있다면)
  const { data: currentProfile } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (currentProfile?.avatar_url) {
    const oldPath = currentProfile.avatar_url.split("/avatars/")[1];
    if (oldPath) {
      await supabase.storage.from("avatars").remove([oldPath]);
    }
  }

  // 새 아바타 업로드
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const fileName = `${user.id}/${timestamp}.${extension}`;

  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  // 공개 URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(data.path);

  // users 테이블 업데이트
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/profile");
  return { url: publicUrl };
}

/**
 * 아바타 삭제
 */
export async function deleteAvatar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // 현재 아바타 URL 가져오기
  const { data: profile } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (profile?.avatar_url) {
    const path = profile.avatar_url.split("/avatars/")[1];
    if (path) {
      await supabase.storage.from("avatars").remove([path]);
    }
  }

  // users 테이블에서 avatar_url 제거
  const { error } = await supabase
    .from("users")
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}

/**
 * 내 포스트 목록 조회
 */
export async function getMyPosts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, data: null };
  }

  // 각 포스트의 좋아요, 댓글 수 가져오기
  const postsWithCounts = await Promise.all(
    (data || []).map(async (post) => {
      const { count: likesCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      const { count: commentsCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)
        .is("deleted_at", null);

      return {
        ...post,
        likes_count: likesCount ?? 0,
        comments_count: commentsCount ?? 0,
      };
    })
  );

  return { error: null, data: postsWithCounts };
}
