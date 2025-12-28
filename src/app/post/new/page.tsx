"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocation } from "@/hooks/useLocation";
import { createPost } from "@/lib/actions/posts";
import { uploadPostImage, deletePostImage } from "@/lib/actions/storage";
import { APP_CONFIG, ROUTES } from "@/lib/constants";
import { LocationPermission } from "@/components/location/LocationPermission";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
    permission,
    refresh,
  } = useLocation();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [postCreated, setPostCreated] = useState(false);

  // 페이지 이탈 시 업로드된 이미지 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 이미지가 있고, 포스트가 생성되지 않았다면 삭제 요청
      if (imageUrl && !postCreated) {
        navigator.sendBeacon(
          "/api/cleanup-image",
          JSON.stringify({ imageUrl })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [imageUrl, postCreated]);

  const charCount = content.length;
  const isOverLimit = charCount > APP_CONFIG.MAX_POST_LENGTH;

  // X 버튼 클릭 핸들러 (이미지 정리 후 홈으로 이동)
  async function handleClose() {
    if (imageUrl) {
      await deletePostImage(imageUrl);
    }
    router.push(ROUTES.HOME);
  }

  // 이미지 선택 핸들러
  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 클라이언트 측 검증
    if (file.size > APP_CONFIG.MAX_IMAGE_SIZE_BYTES) {
      setError(`Image must be less than ${APP_CONFIG.MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    const allowedTypes = APP_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid image type. Allowed: JPEG, PNG, GIF, WebP");
      return;
    }

    setImageUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPostImage(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setImageUrl(result.url);
    }

    setImageUploading(false);

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // 이미지 삭제 핸들러
  async function handleImageRemove() {
    if (!imageUrl) return;

    const result = await deletePostImage(imageUrl);

    if (result.error) {
      setError(result.error);
    } else {
      setImageUrl(null);
    }
  }

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
    if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setPostCreated(true);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-900 p-2 -m-2"
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
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                loading || !content.trim() || isOverLimit || imageUploading
              }
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {loading && <Spinner size="sm" />}
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-4">
        {error && <Alert message={error} variant="error" className="mb-4" />}

        {/* Location Notice */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-blue-50 px-3 py-2 rounded-lg">
          <svg
            className="w-4 h-4 text-blue-500"
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
          <span className="text-blue-600">
            Your current location will be attached
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening nearby?"
            className="w-full h-40 resize-none outline-none text-lg text-gray-900 placeholder-gray-400"
            autoFocus
          />

          {/* Image Preview */}
          {imageUrl && (
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>
          )}

          {/* Image Uploading */}
          {imageUploading && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-center gap-2">
              <Spinner size="md" className="text-blue-600" />
              <span className="text-sm text-gray-600">Uploading image...</span>
            </div>
          )}

          {/* Footer: Character Count & Image Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Add Image Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
                disabled={imageUploading || !!imageUrl}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  imageUrl || imageUploading
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                }`}
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium">Add Image</span>
              </label>
            </div>

            {/* Character Count */}
            <span
              className={`text-sm font-medium ${
                isOverLimit ? "text-red-600" : "text-gray-400"
              }`}
            >
              {charCount}/{APP_CONFIG.MAX_POST_LENGTH}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
