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
import { Spinner } from "@/components/ui/Spinner";
import { MainLayout } from "@/components/layout";

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
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    setConfirmDelete(false);
  }

  return (
    <MainLayout showBottomNav={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.PROFILE}
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
              <h1 className="font-semibold text-gray-900 text-lg">
                Edit Profile
              </h1>
            </div>
          </div>
        </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Messages */}
        {error && <Alert message={error} variant="error" className="mb-4" />}
        {success && (
          <Alert message={success} variant="success" className="mb-4" />
        )}

        {/* Avatar Section - Centered & Prominent */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-linear-to-br from-blue-400 to-blue-600 p-[2px] shadow-lg shadow-blue-200">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {uploadingAvatar ? (
                  <Spinner size="lg" className="text-blue-600" />
                ) : profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.nickname}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-bold text-4xl">
                    {profile.nickname.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            {/* Camera overlay on hover */}
            <label
              htmlFor="avatar-upload"
              className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity ${
                uploadingAvatar ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarSelect}
            className="hidden"
            id="avatar-upload"
            disabled={uploadingAvatar}
          />
          
          {/* Avatar buttons */}
          <div className="flex items-center gap-3 mt-4">
            <label
              htmlFor="avatar-upload"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                uploadingAvatar
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer active:scale-95"
              }`}
            >
              Change Photo
            </label>
            {profile.avatar_url && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={uploadingAvatar}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            {profile.avatar_url && confirmDelete && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteAvatar}
                  disabled={uploadingAvatar}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 active:scale-95"
                >
                  {uploadingAvatar ? (
                    <Spinner size="sm" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={uploadingAvatar}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          {/* Nickname */}
          <form onSubmit={handleSaveNickname}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              Nickname
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 text-base transition-all placeholder-gray-400"
                placeholder="Enter nickname"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400 px-1">
                  {nickname.length}/30
                </span>
                <button
                  type="submit"
                  disabled={
                    saving || nickname === profile.nickname || !nickname.trim()
                  }
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 active:scale-95"
                >
                  {saving && <Spinner size="sm" />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
              Email
            </label>
            <div className="px-4 py-3.5 bg-gray-100 rounded-2xl">
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2 px-1">
              Email cannot be changed
            </p>
          </div>
        </div>
        </main>
      </div>
    </MainLayout>
  );
}
