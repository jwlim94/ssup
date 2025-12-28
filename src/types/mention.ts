export interface Mention {
  id: string;
  comment_id: string;
  mentioned_user_id: string;
  created_at: string;
}

// 멘션과 함께 사용자 정보 포함 (표시용)
export interface MentionWithUser extends Mention {
  user: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };
}
