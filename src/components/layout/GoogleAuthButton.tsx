"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleAuthButton({ label = "Continue with Google" }: { label?: string }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    const supabase = createClient();
    const redirect = searchParams.get("redirect") || "/account";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
    // On success, Supabase redirects the browser to Google — no further action needed here.
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-full border border-gold/20 bg-white/5 px-6 py-3.5 text-sm text-white font-medium transition-colors hover:border-gold hover:bg-white/10 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.8 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.9 5.1 29.8 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 45c5.7 0 10.7-1.9 14.6-5.2l-6.7-5.7C29.7 35.7 27 36.7 24 36.7c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 40.6 16.3 45 24 45z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.7 5.7C41.5 36.4 45 30.8 45 24c0-1.4-.1-2.7-.4-3.5z" />
        </svg>
      )}
      {loading ? "Redirecting..." : label}
    </button>
  );
}
