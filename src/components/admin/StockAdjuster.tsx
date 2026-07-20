"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus, Loader2 } from "lucide-react";
import { adjustStock } from "@/lib/actions/admin-inventory";

export default function StockAdjuster({ productId }: { productId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdjust = async (direction: 1 | -1) => {
    setSaving(true);
    const result = await adjustStock(productId, qty * direction, note || "Manual adjustment");
    setSaving(false);
    if (result.success) {
      toast.success(`Stock ${direction > 0 ? "increased" : "decreased"} by ${qty}`);
      setOpen(false);
      setNote("");
      setQty(1);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to adjust stock");
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-gold hover:underline">
        Adjust Stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="w-16 bg-white/5 border border-gold/20 rounded-lg px-2 py-1 text-xs text-white"
      />
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason"
        className="w-28 bg-white/5 border border-gold/20 rounded-lg px-2 py-1 text-xs text-white"
      />
      <button onClick={() => handleAdjust(1)} disabled={saving} className="h-7 w-7 rounded bg-green-500/15 text-green-400 flex items-center justify-center">
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
      </button>
      <button onClick={() => handleAdjust(-1)} disabled={saving} className="h-7 w-7 rounded bg-red-500/15 text-red-400 flex items-center justify-center">
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Minus size={12} />}
      </button>
      <button onClick={() => setOpen(false)} className="text-xs text-gray-muted hover:text-white">✕</button>
    </div>
  );
}
