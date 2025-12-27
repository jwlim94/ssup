import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageWithLoading } from "@/components/ui/ImageWithLoading";
import { getPost } from "@/lib/actions/posts";
import { getComments } from "@/lib/actions/comments";
import { checkPostLiked, checkCommentLiked } from "@/lib/actions/likes";
import { formatRelativeTime, formatTimeLeft } from "@/lib/utils/time";
import { ROUTES } from "@/lib/constants";
import { CommentList } from "@/components/comment/CommentList";
import { CommentSection } from "./CommentSection";
import { PostLikeButton } from "./PostLikeButton";
import { DeletePostButton } from "./DeletePostButton";
import { createClient } from "@/lib/supabase/server";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  const [postResult, commentsResult, likedResult] = await Promise.all([
    getPost(id),
    getComments(id),
    checkPostLiked(id),
  ]);

  if (postResult.error || !postResult.data) {
    notFound();
  }

  const post = postResult.data;
  const comments = commentsResult.data || [];
  const isLiked = likedResult.liked;

  const user = post.users as {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };

  // 현재 로그인 사용자 확인
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // 각 댓글의 좋아요 상태 확인
  const commentsWithLikeStatus = await Promise.all(
    comments.map(async (comment) => {
      if (!currentUser) {
        return { ...comment, isLiked: false };
      }
      const { liked } = await checkCommentLiked(comment.id);
      return { ...comment, isLiked: liked };
    })
  );

  const isPostOwner = currentUser?.id === post.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
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
              <h1 className="font-semibold">Post</h1>
            </div>
            {isPostOwner && <DeletePostButton postId={id} />}
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
              <ImageWithLoading
                src={post.image_url}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <PostLikeButton
                postId={id}
                initialLiked={isLiked}
                initialCount={post.likes_count}
                disabled={!currentUser}
              />
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
                {post.comments_count}
              </span>
            </div>
            <span>{formatTimeLeft(post.expires_at)}</span>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Comments ({commentsWithLikeStatus.length})
            </h2>
          </div>
          <div className="px-4">
            <CommentList
              comments={commentsWithLikeStatus}
              postId={id}
              currentUserId={currentUser?.id}
            />
          </div>
          <CommentSection postId={id} isLoggedIn={!!currentUser} />
        </div>
      </main>
    </div>
  );
}
