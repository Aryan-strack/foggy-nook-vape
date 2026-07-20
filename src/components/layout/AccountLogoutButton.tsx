"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-muted hover:bg-white/5 hover:text-red-400 transition-colors w-full"
    >
      <LogOut size={16} /> Log Out
    </button>
  );
}
