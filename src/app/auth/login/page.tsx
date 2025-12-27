import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Log in to see what&apos;s happening nearby
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
