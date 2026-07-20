"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  UserCog,
  Boxes,
  Star,
  Ticket,
  Settings,
  Bell,
  BarChart3,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-black-soft border-r border-gold/10 no-print">
      <div className="px-6 py-7 border-b border-gold/10">
        <Link href="/admin" className="relative h-11 w-36 block">
          <Image src="/logo.png" alt="Foggy Nook" fill className="object-contain object-left" />
        </Link>
        <p className="text-xs text-gray-muted mt-1 tracking-widest uppercase">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors",
                active ? "bg-gold text-black font-medium" : "text-gray-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gold/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-muted hover:bg-white/5 hover:text-red-400 w-full transition-colors"
        >
          <LogOut size={17} /> Log Out
        </button>
      </div>
    </aside>
  );
}
