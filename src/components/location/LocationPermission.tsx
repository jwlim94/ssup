"use client";

import { Alert } from "@/components/ui/Alert";

interface LocationPermissionProps {
  onRequestPermission: () => void;
  error?: string | null;
  loading?: boolean;
}

/**
 * 위치 권한 요청 UI
 *
 * 위치 권한이 없거나 거부되었을 때 표시
 */
export function LocationPermission({
  onRequestPermission,
  error,
  loading,
}: LocationPermissionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold mb-2">Location Required</h2>
      <p className="text-gray-600 mb-6 max-w-sm">
        SSUP needs your location to show posts nearby. Your location is only
        used to find posts within 5km of you.
      </p>

      {error && <Alert message={error} variant="error" className="mb-4 max-w-sm" />}

      <button
        onClick={onRequestPermission}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Getting location..." : "Enable Location"}
      </button>

      <p className="mt-4 text-xs text-gray-500 max-w-sm">
        You can change this permission anytime in your browser settings.
      </p>
    </div>
  );
}
