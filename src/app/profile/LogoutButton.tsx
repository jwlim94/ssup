"use client";

import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { Spinner } from "@/components/ui/Spinner";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
        {loading ? (
          <Spinner size="sm" className="text-red-600" />
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
      </div>
      <span className="font-medium">{loading ? "Logging out..." : "Log out"}</span>
    </button>
  );
}
