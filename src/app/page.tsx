"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "@/hooks/useLocation";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimePosts } from "@/hooks/useRealtimePosts";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { LocationPermission } from "@/components/location/LocationPermission";
import { PostList } from "@/components/post/PostList";
import { PostListSkeleton } from "@/components/post/PostListSkeleton";
import { MapView } from "@/components/map";
import { Toast } from "@/components/ui/Toast";
import { PullToRefreshIndicator } from "@/components/ui/PullToRefresh";
import { Alert } from "@/components/ui/Alert";
import { MainLayout, Header } from "@/components/layout";
import { getNearbyPosts } from "@/lib/actions/posts";

type SortOption = "recent" | "distance" | "popular";
type ViewMode = "list" | "map";

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
  latitude: number;
  longitude: number;
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
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // 스크롤 & 토스트 상태
  const [isAtTop, setIsAtTop] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [newPostCount, setNewPostCount] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // 스크롤 위치 감지
  useEffect(() => {
    function handleScroll() {
      setIsAtTop(window.scrollY < 100);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 위치가 있으면 포스트 로드
  useEffect(() => {
    if (!coordinates) return;

    const fetchPosts = async () => {
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
      setNewPostCount(0);
      setShowToast(false);
    };

    fetchPosts();
  }, [coordinates, sortBy]);

  // 수동 새로고침용 loadPosts
  const loadPosts = useCallback(async () => {
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
    setNewPostCount(0);
    setShowToast(false);
  }, [coordinates, sortBy]);

  // 새 포스트 알림 핸들러
  const handleNewPost = useCallback(() => {
    if (isAtTop && viewMode === "list") {
      // 맨 위에 있으면 자동 갱신
      loadPosts();
    } else {
      // 스크롤 중이면 토스트 표시
      setNewPostCount((prev) => prev + 1);
      setShowToast(true);
    }
  }, [isAtTop, viewMode, loadPosts]);

  // Realtime 구독
  useRealtimePosts({
    userLocation: coordinates,
    onNewPost: handleNewPost,
    enabled: !!coordinates,
  });

  // Pull-to-refresh
  const { pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: async () => {
      await loadPosts();
    },
    enabled: !!coordinates && viewMode === "list",
  });

  // 토스트 클릭 핸들러
  const handleToastClick = useCallback(() => {
    // 토스트 먼저 숨기기
    setShowToast(false);
    setNewPostCount(0);

    // 맵 뷰면 리스트 뷰로 전환
    if (viewMode === "map") {
      setViewMode("list");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    loadPosts();
  }, [viewMode, loadPosts]);

  // 위치 로딩 중
  if (locationLoading || authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Skeleton Header */}
          <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
            <div className="max-w-lg mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </header>

          {/* Skeleton Controls */}
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="h-9 w-24 bg-white rounded-xl shadow-sm animate-pulse" />
              <div className="h-9 w-20 bg-white rounded-xl shadow-sm animate-pulse" />
            </div>
          </div>

          {/* Skeleton Posts */}
          <main className="max-w-lg mx-auto px-4">
            <PostListSkeleton count={3} />
          </main>
        </div>
      </MainLayout>
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
    <MainLayout>
      <div
        className={`min-h-screen bg-gray-50 ${
          viewMode === "map" ? "overflow-hidden h-screen" : ""
        }`}
        ref={mainRef}
      >
        {/* Pull to Refresh Indicator */}
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          progress={progress}
        />

        {/* Toast */}
        <Toast
          message={
            viewMode === "map"
              ? newPostCount === 1
                ? "새 포스트가 있어요! 탭하여 리스트에서 확인"
                : `${newPostCount}개의 새 포스트! 탭하여 리스트에서 확인`
              : newPostCount === 1
              ? "새 포스트가 있어요!"
              : `${newPostCount}개의 새 포스트가 있어요!`
          }
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          onClick={handleToastClick}
        />

        {/* Header */}
        <Header />

        {/* Controls: Sort + View Toggle */}
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Sort Options (only in list view) */}
            {viewMode === "list" ? (
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none h-9 pl-3 pr-8 text-sm font-medium text-gray-700 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="recent">Recent</option>
                  <option value="distance">Nearest</option>
                  <option value="popular">Popular</option>
                </select>
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ) : (
              <div />
            )}

            {/* View Toggle */}
            <div className="flex items-center h-9 bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  viewMode === "map"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content: List or Map */}
        <main
          className={`max-w-lg mx-auto px-4 ${
            viewMode === "map" ? "pb-4" : ""
          }`}
        >
          {postsLoading ? (
            <PostListSkeleton count={3} />
          ) : postsError ? (
            <Alert message={postsError} variant="error" />
          ) : viewMode === "list" ? (
            <PostList posts={posts} currentUserId={user?.id} />
          ) : (
            <MapView
              posts={posts}
              userLocation={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              }}
            />
          )}
        </main>
      </div>
    </MainLayout>
  );
}
