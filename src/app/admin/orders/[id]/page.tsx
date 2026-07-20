import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import { formatPrice } from "@/lib/utils";
import { Printer } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import Link from "next/link";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: history }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: true }),
  ]);

  if (!order) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`Order ${order.order_number}`}
        description={new Date(order.created_at).toLocaleString()}
        action={
          <div className="flex gap-3">
            <Link href={`/admin/orders/${order.id}/invoice`} target="_blank" className="btn-outline-gold !px-5 !py-2.5 text-sm">
              <Printer size={15} /> Print Invoice
            </Link>
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${order.customer_name}, this is regarding your order ${order.order_number}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold !px-5 !py-2.5 text-sm"
            >
              <WhatsAppIcon size={15} /> WhatsApp Customer
            </a>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-display text-lg text-white mb-4">Order Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-left text-gray-muted uppercase text-xs">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <tr key={item.id} className="border-b border-gold/5">
                    <td className="py-3 text-white">{item.product_name}</td>
                    <td className="py-3 text-gray-muted">{item.quantity}</td>
                    <td className="py-3 text-gray-muted">{formatPrice(item.unit_price)}</td>
                    <td className="py-3 text-right text-gold">{formatPrice(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 space-y-2 text-sm max-w-xs ml-auto">
              <div className="flex justify-between text-gray-muted"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-gray-muted"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-gray-muted"><span>Shipping</span><span>{formatPrice(order.shipping_fee)}</span></div>
              <div className="flex justify-between text-white font-semibold border-t border-gold/10 pt-2"><span>Total</span><span className="text-gold">{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} history={history || []} />
        </div>

        <div className="glass-card p-6 h-fit space-y-4">
          <h2 className="font-display text-lg text-white mb-2">Customer Details</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-gray-muted">Name:</span> <span className="text-white">{order.customer_name}</span></p>
            <p><span className="text-gray-muted">Phone:</span> <span className="text-white">{order.phone}</span></p>
            {order.email && <p><span className="text-gray-muted">Email:</span> <span className="text-white">{order.email}</span></p>}
            <p><span className="text-gray-muted">City:</span> <span className="text-white">{order.city}</span></p>
            <p><span className="text-gray-muted">Address:</span> <span className="text-white">{order.address}</span></p>
            {order.postal_code && <p><span className="text-gray-muted">Postal Code:</span> <span className="text-white">{order.postal_code}</span></p>}
            {order.order_notes && <p><span className="text-gray-muted">Notes:</span> <span className="text-white">{order.order_notes}</span></p>}
            <p><span className="text-gray-muted">Payment:</span> <span className="text-white uppercase">{order.payment_method}</span></p>
            {order.coupon_code && <p><span className="text-gray-muted">Coupon:</span> <span className="text-gold">{order.coupon_code}</span></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
