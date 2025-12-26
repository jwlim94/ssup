/**
 * 사용자 전체 정보 (users 테이블)
 *
 * 사용처:
 * - 프로필 페이지
 * - 사용자 정보 수정
 */
export interface User {
  id: string; // UUID
  email: string; // 이메일 (로그인용)
  nickname: string; // 닉네임 (표시용, 유니크)
  avatar_url: string | null; // 프로필 이미지 URL
  created_at: string; // 가입일 (ISO 8601)
  updated_at: string; // 수정일 (ISO 8601)
}

/**
 * 사용자 공개 프로필 (포스트/댓글에 표시)
 *
 * 사용처:
 * - 포스트 카드의 작성자 정보
 * - 댓글의 작성자 정보
 */
export interface UserProfile {
  id: string;
  nickname: string;
  avatar_url: string | null;
}

/**
 * 회원가입 입력 데이터
 */
export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

/**
 * 로그인 입력 데이터
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * 프로필 수정 입력 데이터
 */
export interface UpdateProfileData {
  nickname?: string;
  avatar_url?: string | null;
}
