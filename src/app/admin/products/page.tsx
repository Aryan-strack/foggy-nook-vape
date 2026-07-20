import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, brand:brands(name), category:categories(name), images:product_images(image_url, is_primary)")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);

  const { data: products } = await query;

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your full product catalog"
        action={
          <Link href="/admin/products/new" className="btn-gold !px-6 !py-2.5 text-sm">
            <Plus size={16} /> Add Product
          </Link>
        }
      />

      <form className="mb-6 max-w-sm">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="w-full bg-white/5 border border-gold/20 rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
        />
      </form>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs tracking-widest">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => {
              const img = p.images?.find((i: any) => i.is_primary)?.image_url || p.images?.[0]?.image_url;
              return (
                <tr key={p.id} className="border-b border-gold/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-white/5">
                        {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-gray-muted text-xs">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-muted">{p.category?.name || "—"}</td>
                  <td className="p-4 text-gold">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span className={p.stock_quantity <= p.low_stock_threshold ? "text-yellow-400" : "text-white"}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-gold"
                      >
                        <Pencil size={14} />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {!products?.length && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-muted">
                  No products found. Click "Add Product" to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
