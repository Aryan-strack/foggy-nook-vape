import Link from "next/link";
import { User, Package, Heart } from "lucide-react";
import AccountLogoutButton from "@/components/layout/AccountLogoutButton";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-16">
      <h1 className="section-title mb-12">My Account</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="glass-card p-4 h-fit space-y-1">
          <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-muted hover:bg-white/5 hover:text-gold transition-colors">
            <User size={16} /> Profile
          </Link>
          <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-muted hover:bg-white/5 hover:text-gold transition-colors">
            <Package size={16} /> My Orders
          </Link>
          <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-muted hover:bg-white/5 hover:text-gold transition-colors">
            <Heart size={16} /> Wishlist
          </Link>
          <div className="border-t border-gold/10 pt-1 mt-1">
            <AccountLogoutButton />
          </div>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
