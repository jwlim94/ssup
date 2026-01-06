import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroupedNotifications } from "@/lib/actions/notifications";
import { ROUTES } from "@/lib/constants";
import NotificationList from "@/components/notification/NotificationList";
import { MainLayout } from "@/components/layout";

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
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="max-w-lg mx-auto px-4 h-[52px] flex items-center">
            <h1 className="font-semibold text-gray-900 text-lg">
              Notifications
            </h1>
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
    </MainLayout>
  );
}
