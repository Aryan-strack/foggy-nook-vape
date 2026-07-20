import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  const orderNumber = order || "N/A";

  return (
    <div className="container py-32 text-center max-w-lg mx-auto">
      <CheckCircle2 size={64} className="text-gold mx-auto mb-6" />
      <h1 className="font-display text-3xl text-white mb-3">Order Placed Successfully!</h1>
      <p className="text-gray-muted mb-2">
        Your order <span className="text-gold font-semibold">#{orderNumber}</span> has been received.
      </p>
      <p className="text-gray-muted mb-10">
        We'll contact you shortly to confirm delivery details. Pay in cash when your order arrives.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders" className="btn-outline-gold">
          <Package size={16} /> Track My Order
        </Link>
        <a
          href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello, I want an update on my order #${orderNumber}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          <WhatsAppIcon size={16} /> Chat on WhatsApp
        </a>
      </div>

      <Link href="/shop" className="block mt-8 text-sm text-gray-muted hover:text-gold">
        Continue Shopping
      </Link>
    </div>
  );
}
