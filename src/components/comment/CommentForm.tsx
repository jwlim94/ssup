"use client";

import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { createComment } from "@/lib/actions/comments";
import { APP_CONFIG } from "@/lib/constants";
import { Alert } from "@/components/ui/Alert";

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const { coordinates } = useLocation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const isOverLimit = charCount > APP_CONFIG.MAX_COMMENT_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!coordinates) {
      setError("Location is required to comment");
      return;
    }

    if (!content.trim() || isOverLimit) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("content", content);
    formData.append("latitude", coordinates.latitude.toString());
    formData.append("longitude", coordinates.longitude.toString());

    const result = await createComment(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setContent("");
      setLoading(false);
      onSuccess?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      {error && <Alert message={error} variant="error" className="mb-3" />}
      <div className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !content.trim() || isOverLimit}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "..." : "Post"}
        </button>
      </div>
      {content.length > 0 && (
        <div className="mt-2 text-right">
          <span
            className={`text-xs ${isOverLimit ? "text-red-600" : "text-gray-400"}`}
          >
            {charCount}/{APP_CONFIG.MAX_COMMENT_LENGTH}
          </span>
        </div>
      )}
    </form>
  );
}

