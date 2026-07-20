"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";
import GoogleAuthButton from "@/components/layout/GoogleAuthButton";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("customers").insert({
        user_id: data.user.id,
        full_name: fullName,
        phone,
        email,
      });
    }

    setLoading(false);
    toast.success("Account created! Welcome to Foggy Nook.");
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="container py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <p className="section-eyebrow">Join Us</p>
        <h1 className="section-title">Create Account</h1>
      </div>

      <div className="glass-card p-8 space-y-5">
        <GoogleAuthButton label="Sign up with Google" />

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gold/10" />
          <span className="text-xs text-gray-muted uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gold/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-muted mb-2 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-muted mb-2 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-gold/20 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-gold" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
