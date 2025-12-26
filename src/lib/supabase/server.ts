import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버용 Supabase 클라이언트 생성
 *
 * 사용처:
 * - Server Components (기본 컴포넌트)
 * - Server Actions
 * - Route Handlers (API Routes)
 *
 * 특징:
 * - Next.js의 cookies()를 사용하여 세션 관리
 * - 서버에서만 실행되므로 비공개 환경변수 접근 가능
 * - async 함수로 호출해야 함 (cookies가 async)
 *
 * 예시:
 * ```tsx
 * // Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('posts').select('*');
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출 시 쿠키 설정 불가
            // 이 경우는 무시해도 됨 (읽기 전용)
          }
        },
      },
    }
  );
}
