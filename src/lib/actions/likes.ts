"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "./notifications";

/**
 * 포스트 좋아요 토글
 */
export async function togglePostLike(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to like" };
  }

  // 이미 좋아요 했는지 확인
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // 좋아요 취소
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    return { liked: false };
  } else {
    // 좋아요 추가
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      return { error: error.message };
    }

    // 포스트 작성자에게 알림
    const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();

    if (post) {
      await createNotification({
        userId: post.user_id,
        actorId: user.id,
        type: "post_like",
        postId: postId,
      });
    }

    revalidatePath("/");
    return { liked: true };
  }
}

/**
 * 댓글 좋아요 토글
 */
export async function toggleCommentLike(commentId: string, postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to like" };
  }

  // 이미 좋아요 했는지 확인
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // 좋아요 취소
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath(`/post/${postId}`);
    return { liked: false };
  } else {
    // 좋아요 추가
    const { error } = await supabase.from("likes").insert({
      comment_id: commentId,
      user_id: user.id,
    });

    if (error) {
      return { error: error.message };
    }

    // 댓글 작성자에게 알림
    const { data: comment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (comment) {
      await createNotification({
        userId: comment.user_id,
        actorId: user.id,
        type: "comment_like",
        postId: postId,
        commentId: commentId,
      });
    }

    revalidatePath(`/post/${postId}`);
    return { liked: true };
  }
}

/**
 * 사용자가 포스트를 좋아요 했는지 확인
 */
export async function checkPostLiked(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { liked: false };
  }

  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  return { liked: !!data };
}

/**
 * 사용자가 댓글을 좋아요 했는지 확인
 */
export async function checkCommentLiked(commentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { liked: false };
  }

  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .single();

  return { liked: !!data };
}
