import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserById, getUserPosts } from "@/lib/actions/users";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ROUTES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils/time";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 현재 로그인 사용자 확인
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // 본인 프로필이면 /profile로 리다이렉트
  if (currentUser?.id === id) {
    redirect(ROUTES.PROFILE);
  }

  // 사용자 정보 조회
  const { data: profile, error: profileError } = await getUserById(id);

  if (profileError || !profile) {
    notFound();
  }

  // 사용자 포스트 조회
  const { data: posts } = await getUserPosts(id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 h-[52px]">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.HOME}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="font-semibold text-gray-900 text-lg">
              {profile.nickname}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Profile Card */}
        <ProfileCard profile={profile} isOwner={false} />

        {/* Posts Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Posts by {profile.nickname}
          </h3>

          {posts && posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={ROUTES.POST_DETAIL(post.id)}
                  className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-800 text-sm line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {post.comments_count}
                    </span>
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">No posts yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
