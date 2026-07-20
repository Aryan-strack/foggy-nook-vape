import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-[#D4AF37] mb-4">404</p>
        <h1 className="text-2xl text-white mb-3">Page Not Found</h1>
        <p className="text-[#9E9E9E] mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="inline-block bg-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
