"use client";

import { CommentItem } from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  users: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };
  likes_count: number;
  isLiked?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  postId: string;
  currentUserId?: string;
}

export function CommentList({
  comments,
  postId,
  currentUserId,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
          isLiked={comment.isLiked}
        />
      ))}
    </div>
  );
}
