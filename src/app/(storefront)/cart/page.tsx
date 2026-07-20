"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const total = subtotal();
  const shipping = total > 0 ? 200 : 0;

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <ShoppingBag size={56} className="text-gold mx-auto mb-6" />
        <h1 className="font-display text-3xl text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop" className="btn-gold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="section-title mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.productId} className="glass-card flex gap-5 p-5">
              <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/product/${item.slug}`} className="font-display text-lg text-white hover:text-gold">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-muted hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gold/20 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="h-9 w-9 flex items-center justify-center text-gray-muted hover:text-gold"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-9 text-center text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="h-9 w-9 flex items-center justify-center text-gray-muted hover:text-gold"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-gold font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 h-fit sticky top-24">
          <h2 className="font-display text-xl text-white mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-muted">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-muted">
              <span>Shipping (COD)</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-gold/10 pt-3 flex justify-between text-white font-semibold text-base">
              <span>Estimated Total</span>
              <span className="text-gold">{formatPrice(total + shipping)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-gold w-full">
            Proceed to Checkout <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="block text-center text-sm text-gray-muted hover:text-gold mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
