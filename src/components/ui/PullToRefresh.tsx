"use client";

interface PullToRefreshProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  progress,
}: PullToRefreshProps) {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-200"
      style={{ top: Math.max(pullDistance - 40, 8) }}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg transition-transform ${
          isRefreshing ? "scale-100" : ""
        }`}
        style={{
          transform: `scale(${0.5 + progress * 0.5}) rotate(${
            progress * 360
          }deg)`,
          opacity: Math.min(progress * 2, 1),
        }}
      >
        {isRefreshing ? (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className={`w-5 h-5 transition-colors ${
              progress >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
