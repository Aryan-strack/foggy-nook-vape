import LegalLayout from "@/components/layout/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updatedAt="July 2026">
      <p>
        By accessing or using the Foggy Nook website, you agree to be bound by these
        Terms &amp; Conditions. Please read them carefully before placing an order.
      </p>

      <h2>Eligibility</h2>
      <p>
        Our products are intended for adults only. By placing an order, you confirm that
        you meet the legal age requirement for purchasing smoke &amp; vape products in
        your jurisdiction.
      </p>

      <h2>Orders &amp; Payment</h2>
      <p>
        All orders are subject to product availability. We currently accept Cash on
        Delivery (COD) as the only payment method. Prices are listed in PKR and are
        subject to change without notice.
      </p>

      <h2>Shipping</h2>
      <p>
        Delivery times are estimates and may vary based on your location. A shipping fee
        applies to all orders unless stated otherwise.
      </p>

      <h2>Product Information</h2>
      <p>
        We make every effort to display accurate product descriptions, images, and pricing.
        However, we do not warrant that product descriptions are error-free.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Foggy Nook is not liable for any indirect, incidental, or consequential damages
        arising from the use of our products or website.
      </p>

      <h2>Changes to Terms</h2>
      <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the revised terms.</p>
    </LegalLayout>
  );
}
