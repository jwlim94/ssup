import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/actions/posts";
import { formatRelativeTime, formatTimeLeft } from "@/lib/utils/time";
import { ROUTES } from "@/lib/constants";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const { data: post, error } = await getPost(id);

  if (error || !post) {
    notFound();
  }

  const user = post.users as {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="font-semibold">Post</h1>
          </div>
        </div>
      </header>

      {/* Post Content */}
      <main className="max-w-lg mx-auto">
        <article className="bg-white border-b border-gray-200 p-4">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.nickname}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-xl">
                  {user.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.nickname}</p>
              <p className="text-sm text-gray-500">
                {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 text-lg whitespace-pre-wrap wrap-break-word mb-4">
            {post.content}
          </p>

          {/* Image */}
          {post.image_url && (
            <div className="mb-4 rounded-lg overflow-hidden relative aspect-video">
              <Image
                src={post.image_url}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {post.likes_count} likes
              </span>
              <span className="flex items-center gap-1">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {post.comments_count} comments
              </span>
            </div>
            <span>{formatTimeLeft(post.expires_at)}</span>
          </div>
        </article>

        {/* Comments Section - Phase 6에서 구현 */}
        <div className="p-4">
          <h2 className="font-semibold text-gray-900 mb-4">
            Comments ({post.comments_count})
          </h2>
          <p className="text-gray-500 text-sm text-center py-8">
            Comments will be available soon
          </p>
        </div>
      </main>
    </div>
  );
}
