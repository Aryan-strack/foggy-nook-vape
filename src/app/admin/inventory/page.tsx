import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StockAdjuster from "@/components/admin/StockAdjuster";
import { formatPrice } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: movements }] = await Promise.all([
    supabase.from("products").select("id, name, sku, stock_quantity, low_stock_threshold, purchase_price, price").order("stock_quantity", { ascending: true }),
    supabase
      .from("inventory")
      .select("*, product:products(name, sku)")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const lowStock = products?.filter((p) => p.stock_quantity <= p.low_stock_threshold) || [];

  return (
    <div>
      <AdminPageHeader title="Inventory" description="Track stock levels, adjustments, and purchase history" />

      {lowStock.length > 0 && (
        <div className="glass-card p-5 mb-8 border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-white font-medium mb-1">{lowStock.length} product(s) low on stock</p>
            <p className="text-gray-muted text-sm">{lowStock.map((p) => p.name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-lg text-white mb-4">Stock Levels</h2>
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
                  <th className="p-4">Product</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Profit/Unit</th>
                  <th className="p-4 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <p className="text-white">{p.name}</p>
                      <p className="text-gray-muted text-xs">SKU: {p.sku}</p>
                    </td>
                    <td className="p-4">
                      <span className={p.stock_quantity <= p.low_stock_threshold ? "text-yellow-400 font-medium" : "text-white"}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4 text-gold">
                      {p.purchase_price ? formatPrice(p.price - p.purchase_price) : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <StockAdjuster productId={p.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-white mb-4">Recent Stock Movements</h2>
          <div className="glass-card divide-y divide-gold/5 max-h-[600px] overflow-y-auto">
            {movements?.map((m: any) => (
              <div key={m.id} className="p-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-white">{m.product?.name}</p>
                  <p className="text-gray-muted text-xs capitalize">{m.movement_type} {m.note ? `— ${m.note}` : ""}</p>
                  <p className="text-gray-muted text-xs">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <span className={m.quantity_change > 0 ? "text-green-400" : "text-red-400"}>
                  {m.quantity_change > 0 ? "+" : ""}{m.quantity_change}
                </span>
              </div>
            ))}
            {!movements?.length && <p className="p-6 text-center text-gray-muted text-sm">No stock movements recorded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
