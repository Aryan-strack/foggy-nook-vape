import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";
import type { OrderStatus } from "@/types";

const STATUS_TABS: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
const activeStatus: OrderStatus | "all" =
  status && STATUS_TABS.includes(status as OrderStatus | "all")
    ? (status as OrderStatus)
    : "all";

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (activeStatus !== "all") query = query.eq("status", activeStatus);

  const { data: orders } = await query;

  return (
    <div>
      <AdminPageHeader title="Orders" description="Manage and track all customer orders" />

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((status) => (
          <Link
            key={status}
            href={status === "all" ? "/admin/orders" : `/admin/orders?status=${status}`}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors ${
              activeStatus === status ? "bg-gold text-black font-medium" : "bg-white/5 text-gray-muted hover:text-white"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">City</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                <td className="p-4 text-gold font-medium">{order.order_number}</td>
                <td className="p-4 text-white">{order.customer_name}</td>
                <td className="p-4 text-gray-muted">{order.city}</td>
                <td className="p-4 text-white">{formatPrice(order.total)}</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 text-gray-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="inline-flex h-9 w-9 rounded-lg border border-gold/20 items-center justify-center text-gray-muted hover:text-gold">
                    <Eye size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {!orders?.length && (
              <tr><td colSpan={7} className="p-10 text-center text-gray-muted">No orders found for this status.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
