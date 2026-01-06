"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { ROUTES } from "@/lib/constants";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {pending && <Spinner size="sm" />}
      {pending ? "Logging in..." : "Log In"}
    </button>
  );
}

interface LoginFormProps {
  /** 로그인 성공 후 리다이렉트할 URL */
  returnUrl?: string;
}

export function LoginForm({ returnUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
    }
    // 성공 시 signIn 함수에서 redirect 처리됨
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Hidden field for redirect URL */}
      {returnUrl && <input type="hidden" name="redirectTo" value={returnUrl} />}

      {/* Error Message */}
      {error && <Alert message={error} variant="error" />}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
          placeholder="••••••••"
        />
      </div>

      {/* Submit Button */}
      <SubmitButton />

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.SIGNUP} className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
