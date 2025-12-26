"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocation } from "@/hooks/useLocation";
import { createPost } from "@/lib/actions/posts";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { LocationPermission } from "@/components/location/LocationPermission";

export default function NewPostPage() {
  const router = useRouter();
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
    permission,
    refresh,
  } = useLocation();

  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charCount = content.length;
  const isOverLimit = charCount > APP_CONFIG.MAX_POST_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!coordinates) {
      setError("Location is required to post");
      return;
    }

    if (!content.trim()) {
      setError("Please write something");
      return;
    }

    if (isOverLimit) {
      setError(
        `Content must be ${APP_CONFIG.MAX_POST_LENGTH} characters or less`
      );
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("latitude", coordinates.latitude.toString());
    formData.append("longitude", coordinates.longitude.toString());

    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(ROUTES.HOME);
    }
  }

  // 위치 로딩 중
  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 위치 권한 필요
  if (!coordinates || permission !== "granted") {
    return (
      <LocationPermission
        onRequestPermission={refresh}
        error={locationError}
        loading={locationLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href={ROUTES.HOME}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim() || isOverLimit}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </header>

      {/* Location Notice */}
      <div className="max-w-lg mx-auto px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Your current location will be attached</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening nearby?"
          className="w-full h-40 resize-none outline-none text-lg placeholder-gray-400"
          autoFocus
        />

        {/* Character Count */}
        <div className="flex justify-end">
          <span
            className={`text-sm ${isOverLimit ? "text-red-600" : "text-gray-400"}`}
          >
            {charCount}/{APP_CONFIG.MAX_POST_LENGTH}
          </span>
        </div>
      </form>
    </div>
  );
}

