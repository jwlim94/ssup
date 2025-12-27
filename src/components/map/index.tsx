"use client";

import dynamic from "next/dynamic";

// Leaflet은 SSR을 지원하지 않으므로 동적 import
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-180px)] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export { MapView };
