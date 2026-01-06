"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";

/**
 * Header 컴포넌트 (홈 페이지용)
 * - SSUP 로고
 * - 비로그인 시 로그인 버튼 표시
 */
export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">SSUP</span>

          {/* 로그인 버튼 (비로그인 시만 표시) */}
          {!loading && !user && (
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 py-2 px-3 -my-2 -mr-3"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

