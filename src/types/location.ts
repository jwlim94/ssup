/**
 * 위치 좌표 타입
 *
 * 사용처:
 * - 사용자 현재 위치
 * - 포스트/댓글 작성 위치
 */
export interface Coordinates {
  latitude: number; // 위도 (-90 ~ 90)
  longitude: number; // 경도 (-180 ~ 180)
}

/**
 * 위치 권한 상태
 *
 * - granted: 허용됨
 * - denied: 거부됨
 * - prompt: 아직 물어보지 않음
 */
export type PermissionState = "granted" | "denied" | "prompt";

/**
 * 위치 상태 (useLocation 훅에서 사용)
 */
export interface LocationState {
  coordinates: Coordinates | null; // 현재 좌표 (없으면 null)
  loading: boolean; // 위치 가져오는 중
  error: string | null; // 에러 메시지
  permission: PermissionState | null; // 권한 상태
}

/**
 * PostGIS GEOGRAPHY 타입 (DB에서 반환되는 형태)
 *
 * GeoJSON Point 형식
 * coordinates: [longitude, latitude] 순서 주의!
 */
export interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}
