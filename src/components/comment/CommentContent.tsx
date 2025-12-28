"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface CommentContentProps {
  content: string;
  mentions?: {
    mentioned_user_id: string;
    users: {
      id: string;
      nickname: string;
    };
  }[];
}

export function CommentContent({
  content,
  mentions = [],
}: CommentContentProps) {
  // mentions 배열에서 nickname → user_id 매핑 생성
  const mentionMap = new Map<string, string>();
  mentions.forEach((m) => {
    if (m.users) {
      mentionMap.set(m.users.nickname.toLowerCase(), m.users.id);
    }
  });

  // @username 패턴을 찾아서 분리
  const parts = content.split(/(@\w+)/g);

  return (
    <p className="text-gray-800 text-sm whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const nickname = part.slice(1); // @ 제거
          const userId = mentionMap.get(nickname.toLowerCase());

          if (userId) {
            // 유효한 멘션 - 링크로 렌더링
            return (
              <Link
                key={index}
                href={ROUTES.USER_PROFILE(userId)}
                className="text-blue-600 hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </Link>
            );
          } else {
            // 유효하지 않은 멘션 - 스타일만 적용
            return (
              <span key={index} className="text-blue-600 font-medium">
                {part}
              </span>
            );
          }
        }
        return part;
      })}
    </p>
  );
}
