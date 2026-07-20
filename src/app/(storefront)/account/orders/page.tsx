import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { Package, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function MyOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account/orders");

  const { data: orders } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  if (!orders?.length) {
    return (
      <div className="glass-card p-16 text-center">
        <Package size={48} className="text-gold mx-auto mb-5" />
        <p className="text-gray-muted mb-6">You haven't placed any orders yet.</p>
        <Link href="/shop" className="btn-gold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
            <th className="p-4">Order #</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
              <td className="p-4 text-gold font-medium">{order.order_number}</td>
              <td className="p-4 text-white">{formatPrice(order.total)}</td>
              <td className="p-4"><StatusBadge status={order.status} /></td>
              <td className="p-4 text-gray-muted">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="p-4 text-right">
                <Link href={`/account/orders/${order.id}`} className="inline-flex h-9 w-9 rounded-lg border border-gold/20 items-center justify-center text-gray-muted hover:text-gold">
                  <Eye size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
