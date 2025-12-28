import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroupedNotifications } from "@/lib/actions/notifications";
import { ROUTES } from "@/lib/constants";
import NotificationList from "@/components/notification/NotificationList";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { data: notifications, error } = await getGroupedNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 h-[52px] flex items-center justify-between">
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
            <h1 className="font-semibold text-gray-900 text-lg">
              Notifications
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {error ? (
          <div className="p-4">
            <div className="bg-red-50 text-red-600 rounded-xl p-4 text-center">
              Failed to load notifications
            </div>
          </div>
        ) : (
          <NotificationList notifications={notifications || []} />
        )}
      </main>
    </div>
  );
}
