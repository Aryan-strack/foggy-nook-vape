import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { RevenueChart, OrderStatusChart, TopProductsChart } from "@/components/admin/AnalyticsCharts";
import { formatPrice } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [{ data: orders }, { data: orderItems }] = await Promise.all([
    supabase.from("orders").select("total, status, created_at").gte("created_at", thirtyDaysAgo.toISOString()),
    supabase.from("order_items").select("product_name, quantity"),
  ]);

  // Revenue by day
  const revenueByDay: Record<string, number> = {};
  orders?.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total);
  });
  const revenueData = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }));

  // Orders by status
  const statusCounts: Record<string, number> = {};
  orders?.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Top products by quantity sold
  const productSales: Record<string, number> = {};
  orderItems?.forEach((item) => {
    productSales[item.product_name] = (productSales[item.product_name] || 0) + item.quantity;
  });
  const topProducts = Object.entries(productSales)
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8);

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const totalOrders = orders?.length || 0;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return (
    <div>
      <AdminPageHeader title="Analytics" description="Last 30 days performance overview" />

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <p className="text-gray-muted text-sm mb-2">Total Revenue</p>
          <p className="font-display text-3xl text-gold">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-muted text-sm mb-2">Total Orders</p>
          <p className="font-display text-3xl text-white">{totalOrders}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-muted text-sm mb-2">Avg Order Value</p>
          <p className="font-display text-3xl text-white">{formatPrice(avgOrderValue)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-4">Revenue Trend</h2>
          <RevenueChart data={revenueData} />
        </div>
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-4">Orders by Status</h2>
          <OrderStatusChart data={statusData} />
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-lg text-white mb-4">Top Selling Products</h2>
        <TopProductsChart data={topProducts} />
      </div>
    </div>
  );
}
