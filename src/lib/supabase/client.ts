import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저(클라이언트)용 Supabase 클라이언트 생성
 *
 * 사용처:
 * - Client Components ('use client')
 * - 브라우저에서 실행되는 모든 코드
 *
 * 특징:
 * - 브라우저 쿠키를 자동으로 관리
 * - NEXT_PUBLIC_ 환경변수만 접근 가능 (공개 키)
 *
 * 예시:
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 *
 * const supabase = createClient();
 * const { data } = await supabase.from('posts').select('*');
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
