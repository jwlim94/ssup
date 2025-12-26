import type { UserProfile } from "./user";
import type { GeoPoint } from "./location";

/**
 * 포스트 기본 타입 (posts 테이블)
 *
 * DB에서 직접 조회했을 때의 형태
 */
export interface Post {
  id: string; // UUID
  user_id: string; // 작성자 ID
  content: string; // 내용 (최대 280자)
  image_url: string | null; // 이미지 URL (선택)
  location: GeoPoint; // 작성 위치 (PostGIS)
  expires_at: string; // 만료 시간 (ISO 8601)
  created_at: string; // 작성 시간 (ISO 8601)
  deleted_at: string | null; // 삭제 시간 (soft delete)
}

/**
 * 포스트 + 추가 정보 (피드에서 사용)
 *
 * get_nearby_posts() 함수에서 반환하는 형태
 * 작성자 정보, 거리, 좋아요/댓글 수 포함
 */
export interface PostWithDetails {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  expires_at: string;

  // 작성자 정보
  user: UserProfile;

  // 계산된 값들
  distance_meters: number; // 현재 위치에서의 거리 (미터)
  likes_count: number; // 좋아요 수
  comments_count: number; // 댓글 수

  // 현재 사용자 관련 (로그인 시)
  is_liked?: boolean; // 내가 좋아요 했는지
  is_mine?: boolean; // 내 포스트인지
}

/**
 * 포스트 작성 입력 데이터
 */
export interface CreatePostData {
  content: string; // 내용 (1-280자)
  image_url?: string | null; // 이미지 URL (선택)
  latitude: number; // 작성 위치 위도
  longitude: number; // 작성 위치 경도
}

/**
 * 포스트 목록 조회 파라미터
 */
export interface GetPostsParams {
  latitude: number; // 사용자 위치 위도
  longitude: number; // 사용자 위치 경도
  radius_meters?: number; // 반경 (기본 5000m)
  sort_by?: "recent" | "distance" | "popular"; // 정렬
  limit?: number; // 개수 제한
  offset?: number; // 페이지네이션 오프셋
}
