"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, ShoppingCart, AlertTriangle, Star, UserPlus, Check, Mail } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/admin-notifications";
import { toast } from "sonner";

const ICONS: Record<string, any> = {
  new_order: ShoppingCart,
  low_stock: AlertTriangle,
  new_review: Star,
  new_customer: UserPlus,
  contact_message: Mail,
};

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    router.refresh();
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    toast.success("All notifications marked as read");
    router.refresh();
  };

  return (
    <div>
      {notifications.some((n) => !n.is_read) && (
        <div className="flex justify-end mb-4">
          <button onClick={handleMarkAll} className="text-sm text-gold hover:underline">
            Mark all as read
          </button>
        </div>
      )}

      <div className="glass-card divide-y divide-gold/5">
        {notifications.map((n) => {
          const Icon = ICONS[n.type] || Bell;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 ${!n.is_read ? "bg-gold/[0.03]" : ""}`}>
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{n.title}</p>
                {n.message && <p className="text-gray-muted text-sm mt-0.5">{n.message}</p>}
                <p className="text-gray-muted text-xs mt-1">{new Date(n.created_at).toLocaleString()}</p>
                {n.link && (
                  <Link href={n.link} className="text-gold text-xs hover:underline mt-1 inline-block">
                    View details
                  </Link>
                )}
              </div>
              {!n.is_read && (
                <button onClick={() => handleMarkRead(n.id)} className="text-gray-muted hover:text-gold" aria-label="Mark as read">
                  <Check size={16} />
                </button>
              )}
            </div>
          );
        })}
        {!notifications.length && <p className="p-10 text-center text-gray-muted">No notifications yet.</p>}
      </div>
    </div>
  );
}
