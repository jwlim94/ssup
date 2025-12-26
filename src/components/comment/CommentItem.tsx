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
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {comment.users.avatar_url ? (
            <Image
              src={comment.users.avatar_url}
              alt={comment.users.nickname}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">
              {comment.users.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {comment.users.nickname}
            </span>
            {isOwner && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                You
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>
          <p className="text-gray-800 text-sm whitespace-pre-wrap wrap-break-word">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-4">
            <CommentLikeButton
              commentId={comment.id}
              postId={postId}
              initialLiked={isLiked}
              initialCount={comment.likes_count}
              disabled={!currentUserId}
            />
            {isOwner && (
              <DeleteCommentButton commentId={comment.id} postId={postId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
