import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import PrintButton from "@/components/admin/PrintButton";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: settings }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("settings").select("*").eq("id", 1).single(),
  ]);

  if (!order) notFound();

  return (
    <div className="invoice-print min-h-screen bg-white text-black p-10 max-w-3xl mx-auto">
      <div className="no-print flex justify-end mb-6">
        <PrintButton />
      </div>

      <div className="flex items-start justify-between border-b-2 border-black pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{settings?.store_name || "Foggy Nook"}</h1>
          <p className="text-sm text-gray-600 mt-1">{settings?.store_address || "Karachi, Pakistan"}</p>
          <p className="text-sm text-gray-600">{settings?.store_phone || "+92 300 1234567"}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">INVOICE</h2>
          <p className="text-sm text-gray-600">#{order.order_number}</p>
          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs uppercase text-gray-500 mb-2">Bill To</p>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.address}</p>
          <p className="text-sm text-gray-600">{order.city} {order.postal_code}</p>
          <p className="text-sm text-gray-600">{order.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-gray-500 mb-2">Payment Method</p>
          <p className="font-medium uppercase">{order.payment_method}</p>
          <p className="text-xs uppercase text-gray-500 mt-3 mb-2">Order Status</p>
          <p className="font-medium capitalize">{order.status}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-2">Item</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Unit Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} className="border-b border-gray-300">
              <td className="py-2">{item.product_name}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2">{formatPrice(item.unit_price)}</td>
              <td className="py-2 text-right">{formatPrice(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-600">Discount</span><span>-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{formatPrice(order.shipping_fee)}</span></div>
          <div className="flex justify-between font-bold text-base border-t-2 border-black pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-16">Thank you for shopping with {settings?.store_name || "Foggy Nook"}.</p>
    </div>
  );
}
