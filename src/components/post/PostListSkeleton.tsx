"use client";

import { PostCardSkeleton } from "./PostCardSkeleton";

interface PostListSkeletonProps {
  count?: number;
}

export function PostListSkeleton({ count = 3 }: PostListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton
          key={index}
          // 두 번째 카드에만 이미지 스켈레톤 표시 (자연스러운 느낌)
          showImage={index === 1}
        />
      ))}
    </div>
  );
}

