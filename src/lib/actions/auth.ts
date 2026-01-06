"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

/**
 * 회원가입
 *
 * 1. Supabase Auth에 사용자 생성
 * 2. users 테이블에 프로필 생성 (트리거로 자동 처리됨)
 * 3. 이메일 확인 메일 발송됨
 */
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  // 닉네임 중복 체크
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", nickname)
    .single();

  if (existingUser) {
    return { error: "This nickname is already taken" };
  }

  // Supabase Auth 회원가입
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname, // 메타데이터에 닉네임 저장 (트리거에서 사용)
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // 이메일 확인 안내 메시지 반환
  return { success: "Check your email to confirm your account" };
}

/**
 * 로그인
 * @param formData - email, password, redirectTo (optional)
 */
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || ROUTES.HOME;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.HOME);
}
