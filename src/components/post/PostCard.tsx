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
      <article className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header: Avatar, Nickname, Time, Distance */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
            {post.avatar_url ? (
              <Image
                src={post.avatar_url}
                alt={post.nickname}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-semibold text-lg">
                {post.nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 truncate">
                {post.nickname}
              </span>
              {isOwner && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatRelativeTime(post.created_at)}</span>
              <span className="text-gray-400">·</span>
              <svg
                className="w-3.5 h-3.5"
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
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1.5">
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
              <span className="font-medium">{post.likes_count}</span>
            </span>
            <span className="flex items-center gap-1.5">
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
              <span className="font-medium">{post.comments_count}</span>
            </span>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {formatTimeLeft(post.expires_at)}
          </span>
        </div>
      </article>
    </Link>
  );
}
