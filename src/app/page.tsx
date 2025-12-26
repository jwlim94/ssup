"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import { LocationPermission } from "@/components/location/LocationPermission";
import { PostList } from "@/components/post/PostList";
import { getNearbyPosts } from "@/lib/actions/posts";
import { ROUTES } from "@/lib/constants";

type SortOption = "recent" | "distance" | "popular";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  expires_at: string;
  nickname: string;
  avatar_url: string | null;
  distance_meters: number;
  likes_count: number;
  comments_count: number;
  user_id: string;
}

export default function HomePage() {
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
    permission,
    refresh,
  } = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // 위치가 있으면 포스트 로드
  useEffect(() => {
    if (coordinates) {
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, sortBy]);

  async function loadPosts() {
    if (!coordinates) return;

    setPostsLoading(true);
    setPostsError(null);

    const result = await getNearbyPosts(
      coordinates.latitude,
      coordinates.longitude,
      sortBy
    );

    if (result.error) {
      setPostsError(result.error);
    } else {
      setPosts(result.data || []);
    }

    setPostsLoading(false);
  }

  // 위치 로딩 중
  if (locationLoading || authLoading) {
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
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
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
              <span className="font-semibold">SSUP</span>
            </div>
            {user ? (
              <Link
                href={ROUTES.PROFILE}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="text-sm text-blue-600 hover:underline"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sort Options */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="recent">Recent</option>
          <option value="distance">Nearest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Posts */}
      <main className="max-w-lg mx-auto px-4 pb-24">
        {postsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : postsError ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {postsError}
          </div>
        ) : (
          <PostList posts={posts} currentUserId={user?.id} />
        )}
      </main>

      {/* FAB - New Post Button */}
      {user && (
        <Link
          href={ROUTES.POST_NEW}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
