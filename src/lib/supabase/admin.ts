import { createClient } from "@supabase/supabase-js";

/**
 * Admin용 Supabase 클라이언트 (Service Role)
 *
 * 주의: RLS를 우회하므로 서버에서만 사용!
 * 사용처: 알림 생성 등 시스템 작업
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
