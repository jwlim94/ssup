"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "@/lib/actions/profile";
import { ROUTES } from "@/lib/constants";
import { Alert } from "@/components/ui/Alert";

interface Profile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
}

interface EditProfileFormProps {
  initialProfile: Profile;
}

export default function EditProfileForm({
  initialProfile,
}: EditProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [nickname, setNickname] = useState(initialProfile.nickname);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSaveNickname(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("nickname", nickname);

    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Nickname updated successfully");
      setProfile((prev) => ({ ...prev, nickname }));
    }

    setSaving(false);
  }

  async function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAvatar(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setSuccess("Avatar updated successfully");
      setProfile((prev) => ({ ...prev, avatar_url: result.url! }));
    }

    setUploadingAvatar(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDeleteAvatar() {
    if (!profile.avatar_url) return;

    setUploadingAvatar(true);
    setError(null);
    setSuccess(null);

    const result = await deleteAvatar();

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Avatar removed successfully");
      setProfile((prev) => ({ ...prev, avatar_url: null }));
    }

    setUploadingAvatar(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.PROFILE}
              className="text-gray-600 hover:text-gray-900"
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
            <h1 className="font-semibold">Edit Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {/* Messages */}
        {error && <Alert message={error} variant="error" className="mb-4" />}
        {success && <Alert message={success} variant="success" className="mb-4" />}

        {/* Avatar Section */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">
            Profile Photo
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {uploadingAvatar ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.nickname}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-2xl">
                  {profile.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarSelect}
                className="hidden"
                id="avatar-upload"
                disabled={uploadingAvatar}
              />
              <label
                htmlFor="avatar-upload"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  uploadingAvatar
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Change Photo
              </label>
              {profile.avatar_url && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nickname Section */}
        <form onSubmit={handleSaveNickname} className="bg-white rounded-lg p-6">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Nickname</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={30}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter nickname"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {nickname.length}/30
              </span>
              <button
                type="submit"
                disabled={
                  saving || nickname === profile.nickname || !nickname.trim()
                }
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>

        {/* Email (Read-only) */}
        <div className="bg-white rounded-lg p-6 mt-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Email</h2>
          <p className="text-gray-900">{profile.email}</p>
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
      </main>
    </div>
  );
}
