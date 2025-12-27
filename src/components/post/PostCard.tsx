"use client";

import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime, formatTimeLeft } from "@/lib/utils/time";
import { formatDistance } from "@/lib/utils/distance";
import { ImageWithLoading } from "@/components/ui/ImageWithLoading";

interface PostCardProps {
  post: {
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
  };
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const isOwner = currentUserId === post.user_id;

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
        {/* Header: Avatar, Nickname, Time, Distance */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {post.avatar_url ? (
              <Image
                src={post.avatar_url}
                alt={post.nickname}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-lg">
                {post.nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {post.nickname}
              </span>
              {isOwner && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>·</span>
              <span>{formatDistance(post.distance_meters)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-800 whitespace-pre-wrap wrap-break-word mb-3">
          {post.content}
        </p>

        {/* Image */}
        {post.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden relative aspect-video">
            <ImageWithLoading
              src={post.image_url}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Footer: Likes, Comments, Expiry */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {post.comments_count}
            </span>
          </div>
          <span className="text-xs">{formatTimeLeft(post.expires_at)}</span>
        </div>
      </article>
    </Link>
  );
}
