"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="container py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Reset Password</p>
        <h1 className="section-title">Forgot Password</h1>
      </div>

      <div className="glass-card p-8">
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="text-gold mx-auto mb-4" size={40} />
            <p className="text-white font-medium mb-2">Check your email</p>
            <p className="text-gray-muted text-sm">
              We've sent a password reset link to <span className="text-gold">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-gray-muted text-sm">Enter your email and we'll send you a link to reset your password.</p>
            <div>
              <label className="text-sm text-gray-muted mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-muted mt-6">
          Remember your password? <Link href="/login" className="text-gold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
