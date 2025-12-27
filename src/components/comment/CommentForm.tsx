"use client";

import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import { createComment } from "@/lib/actions/comments";
import { APP_CONFIG } from "@/lib/constants";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

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
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
      {error && <Alert message={error} variant="error" className="mb-3" />}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !content.trim() || isOverLimit}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 min-w-[60px]"
        >
          {loading ? <Spinner size="sm" /> : "Post"}
        </button>
      </div>
      {content.length > 0 && (
        <div className="mt-2 text-right">
          <span
            className={`text-xs font-medium ${
              isOverLimit ? "text-red-600" : "text-gray-400"
            }`}
          >
            {charCount}/{APP_CONFIG.MAX_COMMENT_LENGTH}
          </span>
        </div>
      )}
    </form>
  );
}
