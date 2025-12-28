import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/profile";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ROUTES } from "@/lib/constants";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
  const { data: profile, error } = await getMyProfile();

  if (error || !profile) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.HOME}
                className="text-gray-600 hover:text-gray-900 p-2 -m-2"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="font-semibold text-gray-900 text-lg">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Profile Card */}
        <ProfileCard profile={profile} isOwner={true} />

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
          <Link
            href={ROUTES.PROFILE_POSTS}
            className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">My Posts</span>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
