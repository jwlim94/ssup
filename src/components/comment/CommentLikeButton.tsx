"use client";

import { useState } from "react";
import { toggleCommentLike } from "@/lib/actions/likes";

interface CommentLikeButtonProps {
  commentId: string;
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
}

export function CommentLikeButton({
  commentId,
  postId,
  initialLiked,
  initialCount,
  disabled,
}: CommentLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading || disabled) return;

    setLoading(true);

    // Optimistic update
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    const result = await toggleCommentLike(commentId, postId);

    if (result.error) {
      // Rollback on error
      setLiked(liked);
      setCount(count);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`flex items-center gap-1 transition-colors ${
        liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <svg
        className="w-4 h-4"
        fill={liked ? "currentColor" : "none"}
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
      <span className="text-xs">{count}</span>
    </button>
  );
}

