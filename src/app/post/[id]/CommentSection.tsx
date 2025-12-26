"use client";

import Link from "next/link";
import { CommentForm } from "@/components/comment/CommentForm";
import { ROUTES } from "@/lib/constants";

interface CommentSectionProps {
  postId: string;
  isLoggedIn: boolean;
}

export function CommentSection({ postId, isLoggedIn }: CommentSectionProps) {
  if (!isLoggedIn) {
    return (
      <div className="p-4 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          <Link href={ROUTES.LOGIN} className="text-blue-600 hover:underline">
            Log in
          </Link>{" "}
          to leave a comment
        </p>
      </div>
    );
  }

  return <CommentForm postId={postId} />;
}

