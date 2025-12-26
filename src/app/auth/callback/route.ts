import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 인증 콜백 핸들러
 *
 * 이메일 확인 링크 클릭 시:
 * 1. URL에서 code 파라미터 추출
 * 2. code를 세션으로 교환
 * 3. 홈페이지로 리다이렉트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 에러 시 에러 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/error`);
}
