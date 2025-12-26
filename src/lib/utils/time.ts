/**
 * 시간을 상대적 형식으로 변환
 *
 * @param date - ISO 8601 형식 날짜 문자열 또는 Date 객체
 * @returns "just now", "5m", "2h", "1d" 등
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  return `${diffDays}d`;
}

/**
 * 남은 시간을 형식화 (포스트 만료 시간용)
 *
 * @param expiresAt - 만료 시간 (ISO 8601)
 * @returns "23h left", "5m left", "expired" 등
 */
export function formatTimeLeft(expiresAt: string | Date): string {
  const now = new Date();
  const target = new Date(expiresAt);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "expired";
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours >= 1) {
    return `${diffHours}h left`;
  }
  return `${diffMinutes}m left`;
}

