import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Proxy (Next.js 16+)
 *
 * 역할:
 * - 모든 요청에서 Supabase 세션을 갱신
 * - 인증 상태를 최신으로 유지
 *
 * 주의:
 * - 이 프록시는 matcher에 정의된 경로에만 실행됨
 * - 정적 파일(이미지, CSS 등)은 제외됨
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
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
