"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useLocation } from "@/hooks/useLocation";
import { createComment } from "@/lib/actions/comments";
import { searchUsers } from "@/lib/actions/users";
import { APP_CONFIG } from "@/lib/constants";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

interface UserSuggestion {
  id: string;
  nickname: string;
  avatar_url: string | null;
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const { coordinates } = useLocation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 멘션 관련 상태
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > APP_CONFIG.MAX_COMMENT_LENGTH;

  // @ 감지 및 검색
  const handleInputChange = useCallback(
    async (value: string) => {
      setContent(value);

      const cursorPos = inputRef.current?.selectionStart || value.length;
      const textBeforeCursor = value.slice(0, cursorPos);

      // @ 이후 텍스트 찾기
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

      if (mentionMatch) {
        const query = mentionMatch[1];
        setMentionQuery(query);
        setMentionStartIndex(mentionMatch.index!);
        setSelectedIndex(0);
        setIsSearching(true);

        const { data } = await searchUsers(query, postId);
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setIsSearching(false);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    },
    [postId]
  );

  // 사용자 선택
  const selectUser = useCallback(
    (user: UserSuggestion) => {
      const before = content.slice(0, mentionStartIndex);
      const after = content.slice(
        mentionStartIndex + mentionQuery.length + 1 // +1 for @
      );
      const newContent = `${before}@${user.nickname} ${after}`;

      setContent(newContent);
      setShowSuggestions(false);
      setSuggestions([]);
      inputRef.current?.focus();
    },
    [content, mentionStartIndex, mentionQuery]
  );

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && suggestions[selectedIndex]) {
        e.preventDefault();
        selectUser(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [showSuggestions, suggestions, selectedIndex, selectUser]
  );

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!coordinates) {
      setError("Location is required to comment");
      return;
    }

    if (!content.trim() || isOverLimit) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("post_id", postId);
    formData.append("content", content);
    formData.append("latitude", coordinates.latitude.toString());
    formData.append("longitude", coordinates.longitude.toString());

    const result = await createComment(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setContent("");
      setLoading(false);
      onSuccess?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
      {error && <Alert message={error} variant="error" className="mb-3" />}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all"
            disabled={loading}
          />

          {/* 멘션 드롭다운 */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-40 overflow-y-auto z-50"
            >
              {isSearching ? (
                <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                  <Spinner size="sm" />
                  Searching...
                </div>
              ) : (
                suggestions.map((user, index) => (
                  <div
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${index === 0 ? "rounded-t-xl" : ""} ${
                      index === suggestions.length - 1 ? "rounded-b-xl" : ""
                    }`}
                  >
                    {/* 아바타 */}
                    <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.nickname}
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                          {user.nickname[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.nickname}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !content.trim() || isOverLimit}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 min-w-[60px]"
        >
          {loading ? <Spinner size="sm" /> : "Post"}
        </button>
      </div>
      {content.length > 0 && (
        <div className="mt-2 text-right">
          <span
            className={`text-xs font-medium ${
              isOverLimit ? "text-red-600" : "text-gray-400"
            }`}
          >
            {charCount}/{APP_CONFIG.MAX_COMMENT_LENGTH}
          </span>
        </div>
      )}
    </form>
  );
}
