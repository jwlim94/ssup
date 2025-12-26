"use server";

import { createClient } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/lib/constants";

/**
 * 포스트 이미지 업로드
 *
 * 파일 경로: post-images/{userId}/{timestamp}.{extension}
 */
export async function uploadPostImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to upload images" };
  }

  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // 파일 크기 검증
  if (file.size > APP_CONFIG.MAX_IMAGE_SIZE_BYTES) {
    return {
      error: `File size must be less than ${APP_CONFIG.MAX_IMAGE_SIZE_MB}MB`,
    };
  }

  // 파일 타입 검증
  const allowedTypes = APP_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" };
  }

  // 고유한 파일명 생성
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const fileName = `${user.id}/${timestamp}.${extension}`;

  const { data, error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);

  if (error) {
    return { error: error.message };
  }

  // 공개 URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(data.path);

  return { url: publicUrl };
}

/**
 * 포스트 이미지 삭제
 */
export async function deletePostImage(imageUrl: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete images" };
  }

  // URL에서 파일 경로 추출
  const path = imageUrl.split("/post-images/")[1];

  if (!path) {
    return { error: "Invalid image URL" };
  }

  // 본인 파일인지 확인
  if (!path.startsWith(user.id)) {
    return { error: "You can only delete your own images" };
  }

  const { error } = await supabase.storage.from("post-images").remove([path]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
