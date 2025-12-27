"use client";

import { useState } from "react";
import { deleteComment } from "@/lib/actions/comments";
import { Spinner } from "@/components/ui/Spinner";

interface DeleteCommentButtonProps {
  commentId: string;
  postId: string;
}

export function DeleteCommentButton({
  commentId,
  postId,
}: DeleteCommentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const result = await deleteComment(commentId, postId);

    if (result.error) {
      alert(result.error);
    }

    setLoading(false);
    setShowConfirm(false);
  }

  return (
    <div className="flex items-center">
      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
          >
            {loading ? (
              <Spinner size="sm" className="text-red-600" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-400 hover:text-red-600 transition-colors p-1"
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

