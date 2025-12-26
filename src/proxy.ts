import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// 로그인이 필요한 경로들
const protectedRoutes = ["/post/new", "/profile"];

// 로그인한 사용자가 접근하면 안 되는 경로들
const authRoutes = ["/auth/login", "/auth/signup"];

/**
 * Next.js Proxy (Next.js 16+)
 *
 * 역할:
 * - 모든 요청에서 Supabase 세션을 갱신
 * - 보호된 라우트 접근 시 로그인 페이지로 리다이렉트
 * - 로그인 상태에서 auth 페이지 접근 시 홈으로 리다이렉트
 */
export async function proxy(request: NextRequest) {
  // 세션 갱신
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Supabase 클라이언트 생성하여 사용자 확인
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 라우트 체크 (로그인 필요)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 로그인 상태에서 auth 페이지 접근 시 홈으로
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

/**
 * 프록시가 실행될 경로 설정
 *
 * 제외 경로:
 * - _next/static: Next.js 정적 파일
 * - _next/image: Next.js 이미지 최적화
 * - favicon.ico: 파비콘
 * - 이미지 파일들 (svg, png, jpg 등)
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
