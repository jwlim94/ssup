"use client";

import { BottomNavigation } from "./BottomNavigation";

/**
 * MainLayout Props
 */
interface MainLayoutProps {
  children: React.ReactNode;
  /** Bottom Navigation 표시 여부 (기본값: true) */
  showBottomNav?: boolean;
}

/**
 * MainLayout 컴포넌트
 * - Bottom Navigation 조건부 렌더링
 * - 탭 바 높이만큼 하단 패딩 추가 (showBottomNav가 true일 때)
 */
export function MainLayout({
  children,
  showBottomNav = true,
}: MainLayoutProps) {
  return (
    <>
      {/* 메인 컨텐츠 영역 - Bottom Nav가 있을 때 하단 패딩 추가 */}
      <div className={showBottomNav ? "pb-[72px]" : ""}>{children}</div>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </>
  );
}

