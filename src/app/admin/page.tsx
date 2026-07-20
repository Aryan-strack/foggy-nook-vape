import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { RevenueChart } from "@/components/admin/AnalyticsCharts";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrders },
    { data: allOrders },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("products").select("id, name, stock_quantity, low_stock_threshold").order("stock_quantity", { ascending: true }).limit(5),
  ]);

  const totalRevenue = allOrders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;

  const revenueByDay: Record<string, number> = {};
  [...(allOrders || [])].reverse().forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total);
  });
  const revenueData = Object.entries(revenueByDay).slice(-14).map(([date, revenue]) => ({ date, revenue }));

  const criticalLowStock = lowStockProducts?.filter((p) => p.stock_quantity <= p.low_stock_threshold) || [];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Overview of your store's performance" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} />
        <StatCard label="Total Orders" value={String(totalOrders || 0)} icon={ShoppingCart} />
        <StatCard label="Active Products" value={String(totalProducts || 0)} icon={Package} />
        <StatCard label="Customers" value={String(totalCustomers || 0)} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display text-lg text-white mb-4">Revenue (Last 14 Days)</h2>
          <RevenueChart data={revenueData} />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-400" />
            <h2 className="font-display text-lg text-white">Low Stock Alerts</h2>
          </div>
          <div className="space-y-3">
            {criticalLowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-muted truncate">{p.name}</span>
                <span className="text-yellow-400 font-medium">{p.stock_quantity} left</span>
              </div>
            ))}
            {!criticalLowStock.length && <p className="text-gray-muted text-sm">All products are well stocked.</p>}
          </div>
          <Link href="/admin/inventory" className="text-gold text-sm hover:underline mt-4 inline-flex items-center gap-1">
            View Inventory <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-x-auto">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-display text-lg text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-gold text-sm hover:underline flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders?.map((order) => (
              <tr key={order.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                <td className="p-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-gold font-medium hover:underline">
                    {order.order_number}
                  </Link>
                </td>
                <td className="p-4 text-white">{order.customer_name}</td>
                <td className="p-4 text-white">{formatPrice(order.total)}</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 text-gray-muted">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!recentOrders?.length && (
              <tr><td colSpan={5} className="p-10 text-center text-gray-muted">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
