import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Foggy Nook | Stay High — Premium Smoke & Vape Store",
    template: "%s | Foggy Nook",
  },
  description:
    "Foggy Nook — Stay High. Premium curated smoke & vape collections, authentic brands, and discreet cash-on-delivery ordering.",
  openGraph: {
    type: "website",
    siteName: "Foggy Nook",
    title: "Foggy Nook | Stay High",
    description: "Premium smoke & vape store — curated collections, authentic brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foggy Nook | Stay High",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-black" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
