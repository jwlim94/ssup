"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // 새로고침 트리거 거리 (px)
  enabled?: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || window.scrollY > 0) return;

      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || !enabled || window.scrollY > 0) {
        setPullDistance(0);
        return;
      }

      currentYRef.current = e.touches[0].clientY;
      const distance = Math.max(0, currentYRef.current - startYRef.current);

      // 저항감 적용 (당길수록 느려짐)
      const dampedDistance = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(dampedDistance);

      // 기본 스크롤 동작 방지 (당기는 중일 때만)
      if (dampedDistance > 0) {
        e.preventDefault();
      }
    },
    [isPulling, enabled, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enabled) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold); // 로딩 중 고정

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, enabled, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    progress: Math.min(pullDistance / threshold, 1),
  };
}
