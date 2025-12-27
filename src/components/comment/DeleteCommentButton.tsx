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
    <div className="flex items-center h-[44px] -my-2">
      {showConfirm ? (
        <>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 flex items-center justify-center gap-1 h-full px-2"
          >
            {loading ? <Spinner size="sm" className="text-red-600" /> : "Yes"}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="text-xs text-gray-500 hover:text-gray-700 h-full px-2"
          >
            No
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors h-full px-2"
        >
          Delete
        </button>
      )}
    </div>
  );
}

