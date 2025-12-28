"use server";

import { createClient } from "@/lib/supabase/server";

interface UserSearchResult {
  id: string;
  nickname: string;
  avatar_url: string | null;
}

/**
 * 사용자 검색 (멘션 자동완성용)
 *
 * 우선순위:
 * 1. 해당 포스트 참여자 (작성자 + 댓글 작성자)
 * 2. 전체 사용자 검색
 *
 * - nickname으로 검색
 * - 현재 사용자 제외
 * - 최대 5명 반환
 */
export async function searchUsers(query: string, postId?: string, limit = 5) {
  // postId가 없고 query도 없으면 빈 배열 반환
  // postId가 있으면 query 없어도 포스트 참여자 반환
  if (!postId && (!query || query.length < 1)) {
    return { data: [], error: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const results: UserSearchResult[] = [];
  const addedIds = new Set<string>();

  // 현재 사용자 ID
  const currentUserId = user?.id;

  // 결과에 추가하는 헬퍼 함수 (중복 방지)
  const addResult = (u: UserSearchResult) => {
    if (
      u &&
      u.id !== currentUserId &&
      !addedIds.has(u.id) &&
      // query가 빈 문자열이면 모두 허용, 아니면 시작 부분 매칭
      (!query || u.nickname.toLowerCase().startsWith(query.toLowerCase()))
    ) {
      results.push(u);
      addedIds.add(u.id);
    }
  };

  // 1순위: 포스트 참여자 검색
  if (postId) {
    // 포스트 작성자 조회
    const { data: post } = await supabase
      .from("posts")
      .select("users:user_id(id, nickname, avatar_url)")
      .eq("id", postId)
      .single();

    if (post?.users) {
      addResult(post.users as unknown as UserSearchResult);
    }

    // 댓글 작성자들 조회
    const { data: comments } = await supabase
      .from("comments")
      .select("users:user_id(id, nickname, avatar_url)")
      .eq("post_id", postId)
      .is("deleted_at", null);

    if (comments) {
      for (const comment of comments) {
        if (comment.users && results.length < limit) {
          addResult(comment.users as unknown as UserSearchResult);
        }
      }
    }
  }

  // 2순위: 전체 사용자 검색 (limit 채우기)
  if (results.length < limit) {
    let queryBuilder = supabase
      .from("users")
      .select("id, nickname, avatar_url")
      .ilike("nickname", `${query}%`)
      .limit(limit - results.length + 5); // 여유분 조회

    if (currentUserId) {
      queryBuilder = queryBuilder.neq("id", currentUserId);
    }

    const { data: otherUsers } = await queryBuilder;

    if (otherUsers) {
      for (const u of otherUsers) {
        if (results.length >= limit) break;
        if (!addedIds.has(u.id)) {
          results.push(u);
          addedIds.add(u.id);
        }
      }
    }
  }

  return { data: results.slice(0, limit), error: null };
}

/**
 * 사용자 ID로 프로필 조회
 */
export async function getUserById(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, avatar_url, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * 사용자의 포스트 목록 조회
 */
export async function getUserPosts(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  // 각 포스트에 좋아요 수와 댓글 수 추가
  const postsWithCounts = await Promise.all(
    (data || []).map(async (post) => {
      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id)
          .is("deleted_at", null),
      ]);

      return {
        ...post,
        likes_count: likesResult.count ?? 0,
        comments_count: commentsResult.count ?? 0,
      };
    })
  );

  return { data: postsWithCounts, error: null };
}
