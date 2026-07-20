import LegalLayout from "@/components/layout/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Return Policy" };

export default function ReturnPolicyPage() {
  return (
    <LegalLayout title="Return Policy" updatedAt="July 2026">
      <p>
        We want you to be fully satisfied with your purchase. If something isn't right,
        here's how our return process works.
      </p>

      <h2>Eligibility for Returns</h2>
      <p>
        Items may be returned within 3 days of delivery if they arrive damaged, defective,
        or incorrect. Due to the nature of our products, opened consumable items cannot
        be returned for hygiene and safety reasons.
      </p>

      <h2>How to Request a Return</h2>
      <p>
        Contact us via WhatsApp or our Contact page within 3 days of delivery with your
        order number and photos of the issue. Our team will review and confirm the
        return process.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved returns are refunded via bank transfer or store credit within 5-7
        business days after we receive and inspect the returned item.
      </p>

      <h2>Exchanges</h2>
      <p>
        If you'd prefer an exchange instead of a refund, let us know when requesting your
        return and we'll arrange it based on stock availability.
      </p>

      <h2>Non-Returnable Items</h2>
      <p>
        Flash sale items and opened/used consumables are final sale and not eligible for
        return unless defective.
      </p>
    </LegalLayout>
  );
}
