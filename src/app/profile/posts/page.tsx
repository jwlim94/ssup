import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyPosts } from "@/lib/actions/profile";
import { ROUTES } from "@/lib/constants";
import { formatRelativeTime, formatTimeLeft } from "@/lib/utils/time";
import { Alert } from "@/components/ui/Alert";
import { MainLayout } from "@/components/layout";

export default async function MyPostsPage() {
  const { data: posts, error } = await getMyPosts();

  if (error === "Not authenticated") {
    redirect(ROUTES.LOGIN);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.PROFILE}
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
              <h1 className="font-semibold text-gray-900 text-lg">My Posts</h1>
            </div>
          </div>
        </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {error && <Alert message={error} variant="error" />}

        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">
              You haven&apos;t posted anything yet
            </p>
            <Link
              href={ROUTES.POST_NEW}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={ROUTES.POST_DETAIL(post.id)}
                className="block"
              >
                <article className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-800 line-clamp-3 mb-3">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1.5">
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
                        <span className="font-medium">{post.likes_count}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
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
                        <span className="font-medium">
                          {post.comments_count}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{formatRelativeTime(post.created_at)}</span>
                      <span className="text-gray-400">·</span>
                      <span className="font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {formatTimeLeft(post.expires_at)}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
        </main>
      </div>
    </MainLayout>
  );
}
