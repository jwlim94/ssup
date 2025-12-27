"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

// 지도 로딩 스켈레톤
function MapLoadingSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-180px)] rounded-xl border border-gray-200 overflow-hidden relative bg-gray-100">
      {/* 지도 그리드 패턴 */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-gray-200" />
          ))}
        </div>
      </div>

      {/* 가짜 마커들 */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-gray-300 rounded-full animate-pulse" />

      {/* 중앙 로딩 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" className="text-blue-600" />
        <span className="text-sm text-gray-500 font-medium">Loading map...</span>
      </div>

      {/* 하단 컨트롤 스켈레톤 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Leaflet은 SSR을 지원하지 않으므로 동적 import
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

export { MapView };
