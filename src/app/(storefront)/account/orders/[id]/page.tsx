import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import { Check } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import type { OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default async function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/account/orders/${id}`);

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!order) notFound();

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id),
    supabase.from("order_status_history").select("*").eq("order_id", order.id).order("created_at", { ascending: true }),
  ]);

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-gray-muted text-sm">Order</p>
          <p className="font-display text-xl text-gold">{order.order_number}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status !== "cancelled" && (
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-6">Order Tracking</h2>
          <div className="flex items-center justify-between mb-8">
            {STATUS_FLOW.map((status, i) => (
              <div key={status} className="flex-1 flex flex-col items-center relative">
                {i > 0 && <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-gold" : "bg-white/10"}`} />}
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] z-10 ${i <= currentIndex ? "bg-gold text-black" : "bg-white/10 text-gray-muted"}`}>
                  {i < currentIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-[10px] mt-2 capitalize ${i <= currentIndex ? "text-gold" : "text-gray-muted"}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {history?.map((h, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" />
                <div>
                  <p className="text-white capitalize">{h.status}{h.note ? ` — ${h.note}` : ""}</p>
                  <p className="text-gray-muted text-xs">{new Date(h.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <h2 className="font-display text-lg text-white mb-4">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs">
              <th className="pb-3">Product</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} className="border-b border-gold/5">
                <td className="py-3 text-white">{item.product_name}</td>
                <td className="py-3 text-gray-muted">{item.quantity}</td>
                <td className="py-3 text-right text-gold">{formatPrice(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-gray-muted"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-muted"><span>Shipping</span><span>{formatPrice(order.shipping_fee)}</span></div>
          <div className="flex justify-between text-white font-semibold border-t border-gold/10 pt-2"><span>Total</span><span className="text-gold">{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <a
        href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello, I have a question about order ${order.order_number}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline-gold inline-flex"
      >
        <WhatsAppIcon size={16} /> Ask About This Order
      </a>
    </div>
  );
}
