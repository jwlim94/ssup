import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 미들웨어용 Supabase 세션 업데이트 함수
 *
 * 역할:
 * - 모든 요청에서 Supabase 세션(JWT 토큰)을 갱신
 * - 만료된 토큰을 자동으로 리프레시
 * - 쿠키를 요청/응답에 동기화
 *
 * 흐름:
 * 1. 요청이 들어옴
 * 2. 쿠키에서 세션 토큰 읽기
 * 3. supabase.auth.getUser()로 세션 검증 & 갱신
 * 4. 갱신된 쿠키를 응답에 설정
 *
 * 이 함수는 src/middleware.ts에서 호출됨
 */
export async function updateSession(request: NextRequest) {
  // 기본 응답 생성
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 미들웨어용 Supabase 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에서 쿠키 읽기
        getAll() {
          return request.cookies.getAll();
        },
        // 응답에 쿠키 설정
        setAll(cookiesToSet) {
          // 요청 쿠키에도 설정 (다음 미들웨어/핸들러용)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // 새 응답 생성
          supabaseResponse = NextResponse.next({
            request,
          });
          // 응답 쿠키에 설정 (브라우저로 전송)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (중요!)
  // getUser()를 호출하면 토큰이 만료됐을 때 자동으로 리프레시됨
  await supabase.auth.getUser();

  return supabaseResponse;
}
