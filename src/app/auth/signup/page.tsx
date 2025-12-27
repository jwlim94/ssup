import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">
            Join SSUP and share what&apos;s happening nearby
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
