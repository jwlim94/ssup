"use client";

import { LikeButton } from "@/components/ui/LikeButton";
import { togglePostLike } from "@/lib/actions/likes";

interface PostLikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
}

export function PostLikeButton({
  postId,
  initialLiked,
  initialCount,
  disabled,
}: PostLikeButtonProps) {
  async function handleToggle() {
    return await togglePostLike(postId);
  }

  return (
    <LikeButton
      liked={initialLiked}
      count={initialCount}
      onToggle={handleToggle}
      disabled={disabled}
    />
  );
}
