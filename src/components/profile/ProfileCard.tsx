import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

interface ProfileCardProps {
  profile: {
    id: string;
    nickname: string;
    email?: string;
    avatar_url: string | null;
    created_at: string;
  };
  isOwner?: boolean;
}

export function ProfileCard({ profile, isOwner = false }: ProfileCardProps) {
  const cardContent = (
    <>
      {/* Edit Icon - 본인만 */}
      {isOwner && (
        <div className="absolute top-3 right-3 text-blue-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden mb-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.nickname}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-blue-600 font-bold text-3xl">
              {profile.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Nickname */}
        <h2 className="text-xl font-bold text-gray-900">{profile.nickname}</h2>

        {/* Email - 본인만 */}
        {isOwner && profile.email && (
          <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
        )}

        {/* Join Date */}
        <p className="text-xs text-gray-400 mt-2">
          Joined{" "}
          {new Date(profile.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </p>
      </div>
    </>
  );

  if (isOwner) {
    return (
      <Link
        href={ROUTES.PROFILE_EDIT}
        className="block bg-white rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm relative">
      {cardContent}
    </div>
  );
}
