"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    const result = await deleteProduct(id);
    setLoading(false);
    if (result.success) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="h-9 w-9 rounded-lg border border-gold/20 flex items-center justify-center text-gray-muted hover:text-red-400 hover:border-red-400/40 disabled:opacity-50"
      aria-label="Delete product"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}
