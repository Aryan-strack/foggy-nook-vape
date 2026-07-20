import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NotificationsList from "@/components/admin/NotificationsList";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data: notifications } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);

  return (
    <div>
      <AdminPageHeader title="Notifications" description="New orders, low stock alerts, and store activity" />
      <NotificationsList notifications={notifications || []} />
    </div>
  );
}
