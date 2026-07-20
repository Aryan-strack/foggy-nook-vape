"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import GoogleAuthButton from "@/components/layout/GoogleAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth_failed") {
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    // Figure out where this user actually belongs: admins/staff go straight to
    // the dashboard, everyone else goes to their account (or wherever they were
    // trying to go before being asked to log in).
    const explicitRedirect = searchParams.get("redirect");
    let isAdminOrStaff = false;

    if (data.user) {
      const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
      isAdminOrStaff = !!profile && ["admin", "staff"].includes(profile.role);
    }

    let destination: string;
    if (isAdminOrStaff) {
      destination = explicitRedirect && explicitRedirect.startsWith("/admin") ? explicitRedirect : "/admin";
    } else {
      destination = explicitRedirect && !explicitRedirect.startsWith("/admin") ? explicitRedirect : "/account";
    }

    setLoading(false);
    toast.success("Welcome back!");
    router.push(destination);
    router.refresh();
  };

  return (
    <div className="container py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Welcome Back</p>
        <h1 className="section-title">Login</h1>
      </div>

      <div className="glass-card p-8 space-y-5">
        <GoogleAuthButton label="Continue with Google" />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gold/10" />
          <span className="text-xs text-gray-muted uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gold/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-muted">Password</label>
              <Link href="/forgot-password" className="text-xs text-gold hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-muted">
            Don't have an account?{" "}
            <Link href="/signup" className="text-gold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
