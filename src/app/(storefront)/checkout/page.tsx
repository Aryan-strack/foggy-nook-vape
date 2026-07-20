"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/checkout";
import { useCartStore } from "@/store/cart-store";
import { placeOrder } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import { Banknote, Loader2 } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const shipping = 200;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitting(true);
    const result = await placeOrder(values, items);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Something went wrong");
      return;
    }

    clearCart();
    router.push(`/checkout/success?order=${result.orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <p className="text-gray-muted">Your cart is empty. Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="section-title mb-12">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 glass-card p-8 space-y-5">
          <h2 className="font-display text-xl text-white mb-2">Delivery Details</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Full Name *</label>
              <input {...register("customer_name")} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
              {errors.customer_name && <p className="text-red-400 text-xs mt-1">{errors.customer_name.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Phone *</label>
              <input {...register("phone")} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Email (optional)</label>
            <input {...register("email")} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-muted mb-2 block">City *</label>
              <input {...register("city")} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Postal Code</label>
              <input {...register("postal_code")} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Full Address *</label>
            <textarea {...register("address")} rows={3} className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Order Notes (optional)</label>
            <textarea {...register("order_notes")} rows={2} placeholder="Any special delivery instructions..." className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Coupon Code (optional)</label>
            <input {...register("coupon_code")} placeholder="e.g. GOLD10" className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold" />
          </div>

          <div className="glass-card p-5 flex items-center gap-3 !bg-white/[0.03]">
            <Banknote className="text-gold shrink-0" size={20} />
            <div>
              <p className="text-white text-sm font-medium">Cash on Delivery</p>
              <p className="text-gray-muted text-xs">Pay in cash when your order arrives. This is currently our only payment method.</p>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-gold w-full mt-4 disabled:opacity-60">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="glass-card p-8 h-fit sticky top-24">
          <h2 className="font-display text-xl text-white mb-6">Order Summary</h2>
          <div className="flex flex-col gap-4 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-muted">
                  {item.name} <span className="text-gray-muted">× {item.quantity}</span>
                </span>
                <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm border-t border-gold/10 pt-4">
            <div className="flex justify-between text-gray-muted">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between text-gray-muted">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-base border-t border-gold/10 pt-3">
              <span>Total</span>
              <span className="text-gold">{formatPrice(subtotal() + shipping)}</span>
            </div>
          </div>

          <a
            href="https://wa.me/923001234567?text=Hello%2C%20I%20have%20a%20question%20about%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-muted hover:text-gold"
          >
            <WhatsAppIcon size={16} /> Questions? Chat with us
          </a>
        </div>
      </div>
    </div>
  );
}
