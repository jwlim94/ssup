import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";
import { MainLayout } from "@/components/layout";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="max-w-lg mx-auto px-4 h-[52px] flex items-center">
            <h1 className="font-semibold text-gray-900 text-lg">Chat</h1>
          </div>
        </header>

        {/* Coming Soon Content */}
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Chat Icon */}
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Chat is coming soon!
            </h2>

            {/* Description */}
            <p className="text-gray-500 max-w-xs mb-6 leading-relaxed">
              We&apos;re working on bringing you direct messaging. Stay tuned
              for updates!
            </p>

            {/* Decorative dots animation */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

