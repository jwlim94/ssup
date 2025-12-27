"use client";

import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils/time";
import { CommentLikeButton } from "./CommentLikeButton";
import { DeleteCommentButton } from "./DeleteCommentButton";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    users: {
      id: string;
      nickname: string;
      avatar_url: string | null;
    };
    likes_count: number;
  };
  postId: string;
  currentUserId?: string;
  isLiked?: boolean;
}

export function CommentItem({
  comment,
  postId,
  currentUserId,
  isLiked = false,
}: CommentItemProps) {
  const isOwner = currentUserId === comment.users.id;

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {comment.users.avatar_url ? (
            <Image
              src={comment.users.avatar_url}
              alt={comment.users.nickname}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-semibold text-sm">
              {comment.users.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">
                {comment.users.nickname}
              </span>
              {isOwner && (
                <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                  You
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg
                  className="w-3 h-3"
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
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            {isOwner && (
              <DeleteCommentButton commentId={comment.id} postId={postId} />
            )}
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="mt-2.5 flex items-center">
            <CommentLikeButton
              commentId={comment.id}
              postId={postId}
              initialLiked={isLiked}
              initialCount={comment.likes_count}
              disabled={!currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
