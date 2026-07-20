import LegalLayout from "@/components/layout/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="July 2026">
      <p>
        Foggy Nook ("we", "us", "our") respects your privacy. This policy explains what
        information we collect, how we use it, and the choices you have.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name, phone number,
        email address, and shipping address when you create an account or place an order.
        We also collect basic usage data to improve our storefront.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        Your information is used to process orders, provide customer support, send order
        updates via WhatsApp or email, and improve our products and services. We never
        sell your personal information to third parties.
      </p>

      <h2>Data Storage &amp; Security</h2>
      <p>
        Your data is stored securely using Supabase's managed PostgreSQL infrastructure
        with row-level security policies restricting access to authorized personnel only.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you logged in and to remember items in your cart.
        We do not use third-party advertising cookies.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any
        time by contacting us through our Contact page or WhatsApp.
      </p>

      <h2>Contact Us</h2>
      <p>If you have questions about this policy, please reach out via our Contact page.</p>
    </LegalLayout>
  );
}
