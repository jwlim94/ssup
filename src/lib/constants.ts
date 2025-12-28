// ============================================
// App Constants
// ============================================

export const APP_CONFIG = {
  // 포스트 검색 반경 (미터) - 5km
  DEFAULT_RADIUS_METERS:
    Number(process.env.NEXT_PUBLIC_DEFAULT_RADIUS_METERS) || 5000,

  // 포스트 만료 시간 (시간) - 24시간
  POST_EXPIRY_HOURS: Number(process.env.NEXT_PUBLIC_POST_EXPIRY_HOURS) || 24,

  // 포스트/댓글 최대 글자 수
  MAX_POST_LENGTH: Number(process.env.NEXT_PUBLIC_MAX_POST_LENGTH) || 280,
  MAX_COMMENT_LENGTH: 280,

  // 이미지 제한
  MAX_IMAGE_SIZE_MB: Number(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB) || 5,
  MAX_IMAGE_SIZE_BYTES:
    (Number(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB) || 5) * 1024 * 1024,

  // 허용 이미지 타입
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
} as const;

// ============================================
// Sort Options (정렬 옵션)
// ============================================

export const SORT_OPTIONS = {
  RECENT: "recent", // 최신순
  DISTANCE: "distance", // 가까운순
  POPULAR: "popular", // 인기순
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

// ============================================
// Route Paths (라우트 경로)
// ============================================

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  POST_NEW: "/post/new",
  POST_DETAIL: (id: string) => `/post/${id}`,
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_POSTS: "/profile/posts",
  NOTIFICATIONS: "/notifications",
  USER_PROFILE: (id: string) => `/user/${id}`,
} as const;
