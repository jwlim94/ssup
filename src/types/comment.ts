import type { UserProfile } from "./user";
import type { GeoPoint } from "./location";

/**
 * 댓글 기본 타입 (comments 테이블)
 *
 * DB에서 직접 조회했을 때의 형태
 */
export interface Comment {
  id: string; // UUID
  post_id: string; // 포스트 ID
  user_id: string; // 작성자 ID
  content: string; // 내용 (최대 280자)
  location: GeoPoint; // 작성 위치 (PostGIS)
  created_at: string; // 작성 시간 (ISO 8601)
  deleted_at: string | null; // 삭제 시간 (soft delete)
}

/**
 * 댓글 + 추가 정보 (포스트 상세에서 사용)
 *
 * 작성자 정보, 좋아요 수 포함
 */
export interface CommentWithDetails {
  id: string;
  post_id: string;
  content: string;
  created_at: string;

  // 작성자 정보
  user: UserProfile;

  // 계산된 값들
  likes_count: number; // 좋아요 수

  // 현재 사용자 관련 (로그인 시)
  is_liked?: boolean; // 내가 좋아요 했는지
  is_mine?: boolean; // 내 댓글인지
}

/**
 * 댓글 작성 입력 데이터
 */
export interface CreateCommentData {
  post_id: string; // 포스트 ID
  content: string; // 내용 (1-280자)
  latitude: number; // 작성 위치 위도
  longitude: number; // 작성 위치 경도
}
