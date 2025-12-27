"use client";

interface PostCardSkeletonProps {
  showImage?: boolean;
}

export function PostCardSkeleton({ showImage = false }: PostCardSkeletonProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Header: Avatar, Nickname, Time, Distance */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Nickname skeleton */}
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          {/* Time + Distance skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-10 bg-gray-100 rounded animate-pulse" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="w-3.5 h-3.5 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton - 2~3 lines */}
      <div className="space-y-2 mb-3">
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Image skeleton (optional) */}
      {showImage && (
        <div className="mb-3 rounded-lg overflow-hidden aspect-video bg-gray-100 animate-pulse" />
      )}

      {/* Footer: Likes, Comments, Expiry */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          {/* Likes skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-4 bg-gray-100 rounded animate-pulse" />
          </div>
          {/* Comments skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        {/* Expiry skeleton - badge style */}
        <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
