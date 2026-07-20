import Link from "next/link";
import { Bell, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTopbar() {
  const supabase = await createClient();
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-gold/10 bg-black/40 backdrop-blur sticky top-0 z-30 no-print">
      <p className="text-xs uppercase tracking-widest text-gray-muted">Welcome back, Admin</p>

      <div className="flex items-center gap-5">
        <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 text-sm text-gray-muted hover:text-gold">
          View Store <ExternalLink size={14} />
        </Link>
        <Link href="/admin/notifications" className="relative text-gray-muted hover:text-gold">
          <Bell size={20} />
          {!!unreadCount && (
            <span className="absolute -top-1.5 -right-1.5 bg-gold text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
