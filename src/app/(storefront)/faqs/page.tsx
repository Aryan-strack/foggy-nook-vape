import FaqAccordion from "@/components/layout/FaqAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about ordering, shipping, and returns at Foggy Nook.",
};

const FAQS = [
  { q: "Do you offer cash on delivery?", a: "Yes, Cash on Delivery (COD) is currently our only payment method. You pay in cash when your order arrives at your doorstep." },
  { q: "How discreet is your packaging?", a: "All orders are shipped in plain, unbranded packaging with no indication of the contents on the outside." },
  { q: "How long does delivery take?", a: "Most orders are delivered within 2-5 business days depending on your city. You'll receive updates via WhatsApp." },
  { q: "Can I return a product?", a: "Yes, please see our Return Policy page for full details on eligibility and the return process." },
  { q: "Are your products authentic?", a: "Absolutely. We source directly from authorized distributors and verified brands only." },
  { q: "How do I track my order?", a: "Once logged in, visit My Account > My Orders to see real-time status updates on your order." },
  { q: "Do you have a minimum order amount?", a: "No minimum order amount is required, though a flat shipping fee applies to all orders." },
  { q: "How can I contact support?", a: "You can reach us anytime via the WhatsApp button on our site, or through our Contact page." },
];

export default function FaqsPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <p className="section-eyebrow">Need Help?</p>
        <h1 className="section-title">Frequently Asked Questions</h1>
      </div>
      <FaqAccordion faqs={FAQS} />
    </div>
  );
}
