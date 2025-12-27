"use client";

import { PostCard } from "./PostCard";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  expires_at: string;
  nickname: string;
  avatar_url: string | null;
  distance_meters: number;
  likes_count: number;
  comments_count: number;
  user_id: string;
}

interface PostListProps {
  posts: Post[];
  currentUserId?: string;
  emptyMessage?: string;
}

export function PostList({
  posts,
  currentUserId,
  emptyMessage = "No posts nearby yet. Be the first to post!",
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  );
}

