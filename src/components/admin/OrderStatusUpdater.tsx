"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/admin-orders";
import type { OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  history,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  history: { status: string; note: string | null; created_at: string }[];
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");

  const handleUpdate = async (status: OrderStatus) => {
    setUpdating(true);
    const result = await updateOrderStatus(orderId, status, note || undefined);
    setUpdating(false);
    if (result.success) {
      toast.success(`Order marked as ${status}`);
      setNote("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="glass-card p-6">
      <h2 className="font-display text-lg text-white mb-6">Order Status</h2>

      {currentStatus !== "cancelled" && (
        <div className="flex items-center justify-between mb-8">
          {STATUS_FLOW.map((status, i) => (
            <div key={status} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-gold" : "bg-white/10"}`} />
              )}
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] z-10 ${
                  i <= currentIndex ? "bg-gold text-black" : "bg-white/10 text-gray-muted"
                }`}
              >
                {i < currentIndex ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-2 capitalize ${i <= currentIndex ? "text-gold" : "text-gray-muted"}`}>{status}</span>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note for this status update (optional)"
        rows={2}
        className="w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-muted focus:outline-none focus:border-gold mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((status) => (
          <button
            key={status}
            disabled={updating || status === currentStatus}
            onClick={() => handleUpdate(status)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-colors disabled:opacity-40 ${
              status === "cancelled" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-white/5 text-gray-muted hover:text-gold hover:bg-white/10"
            }`}
          >
            {updating ? <Loader2 size={12} className="animate-spin inline" /> : `Mark ${status}`}
          </button>
        ))}
      </div>

      <h3 className="text-sm text-gray-muted uppercase tracking-widest mb-4">Order Timeline</h3>
      <div className="space-y-4">
        {history.map((h, i) => (
          <div key={i} className="flex gap-3 text-sm">
            <div className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" />
            <div>
              <p className="text-white capitalize">{h.status}{h.note ? ` — ${h.note}` : ""}</p>
              <p className="text-gray-muted text-xs">{new Date(h.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
