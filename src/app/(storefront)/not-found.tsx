import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-32 text-center max-w-lg mx-auto">
      <p className="font-display text-8xl text-gold mb-4">404</p>
      <h1 className="font-display text-3xl text-white mb-3">Page Not Found</h1>
      <p className="text-gray-muted mb-10">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-gold">
          <Home size={16} /> Back to Home
        </Link>
        <Link href="/shop" className="btn-outline-gold">
          <Search size={16} /> Browse Shop
        </Link>
      </div>
    </div>
  );
}
