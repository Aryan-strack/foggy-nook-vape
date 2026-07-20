"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Check, Trash2, Reply, Loader2 } from "lucide-react";
import { approveReview, deleteReview, replyToReview } from "@/lib/actions/admin-reviews";

interface ReviewRow {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  admin_reply: string | null;
  created_at: string;
  product?: { name: string } | null;
}

export default function ReviewItem({ review }: { review: ReviewRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState(review.admin_reply || "");

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveReview(review.id, review.product_id);
    setLoading(false);
    if (result.success) {
      toast.success("Review approved");
      router.refresh();
    } else toast.error(result.error || "Failed");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    setLoading(true);
    const result = await deleteReview(review.id, review.product_id);
    setLoading(false);
    if (result.success) {
      toast.success("Review deleted");
      router.refresh();
    } else toast.error(result.error || "Failed");
  };

  const handleReply = async () => {
    setLoading(true);
    const result = await replyToReview(review.id, reply);
    setLoading(false);
    if (result.success) {
      toast.success("Reply saved");
      setShowReply(false);
      router.refresh();
    } else toast.error(result.error || "Failed");
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-white font-medium">{review.product?.name}</p>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? "fill-gold text-gold" : "text-gray-muted"} />
            ))}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${review.is_approved ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
          {review.is_approved ? "Approved" : "Pending"}
        </span>
      </div>

      {review.title && <p className="text-white text-sm font-medium mb-1">{review.title}</p>}
      <p className="text-gray-muted text-sm mb-3">{review.comment}</p>

      {review.admin_reply && !showReply && (
        <div className="pl-4 border-l-2 border-gold/30 mb-3">
          <p className="text-xs text-gold mb-1">Your reply</p>
          <p className="text-gray-muted text-sm">{review.admin_reply}</p>
        </div>
      )}

      {showReply && (
        <div className="mb-3 space-y-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            placeholder="Write a reply..."
            className="w-full bg-white/5 border border-gold/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
          />
          <button onClick={handleReply} disabled={loading} className="btn-gold !px-4 !py-1.5 text-xs">
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Save Reply"}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {!review.is_approved && (
          <button onClick={handleApprove} disabled={loading} className="text-xs flex items-center gap-1 text-green-400 hover:underline">
            <Check size={12} /> Approve
          </button>
        )}
        <button onClick={() => setShowReply(!showReply)} className="text-xs flex items-center gap-1 text-gold hover:underline">
          <Reply size={12} /> Reply
        </button>
        <button onClick={handleDelete} disabled={loading} className="text-xs flex items-center gap-1 text-red-400 hover:underline">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}
