/**
 * 거리를 사람이 읽기 쉬운 형식으로 변환
 *
 * @param meters - 미터 단위 거리
 * @returns "150m", "1.2km" 등
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 두 지점 사이의 거리 계산 (Haversine 공식)
 *
 * @param lat1 - 첫 번째 지점 위도
 * @param lon1 - 첫 번째 지점 경도
 * @param lat2 - 두 번째 지점 위도
 * @param lon2 - 두 번째 지점 경도
 * @returns 미터 단위 거리
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // 지구 반경 (미터)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
