"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useCreateReview } from "@/src/lib/api/booking";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WriteReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: any;
  product: any;
  onSuccess?: () => void;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className="w-8 h-8 transition-colors"
            fill={(hovered || value) >= star ? "#F97316" : "none"}
            stroke={(hovered || value) >= star ? "#F97316" : "#D1D5DB"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const WriteReviewModal = ({
  open,
  onOpenChange,
  bookingId,
  product,
  onSuccess,
}: WriteReviewModalProps) => {
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");

  const { mutate: submitReview, isPending } = useCreateReview();

  const reset = () => {
    setStars(0);
    setDescription("");
  };

  const handleSend = () => {
    if (stars === 0) return;

    submitReview(
      { stars, bookingId, description },
      {
        onSuccess: () => {
          SuccessToast("Review submitted successfully!");
          onOpenChange(false);
          reset();
          onSuccess?.();
        },
        onError: (err: any) => {
          ErrorToast(err?.message || "Failed to submit review. Please try again.");
        },
      },
    );
  };

  const handleSkip = () => {
    onOpenChange(false);
    reset();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };
console.log(product,"product testing")
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl">
        <div className="px-5 pt-6 pb-7 flex flex-col gap-5">
          {/* Header */}
          <h2 className="text-lg font-bold text-foreground">Write Review</h2>

          {/* Product Info */}
          <div className="flex items-center gap-3">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-border"
            />
            <div>
              <p className="font-semibold text-base text-foreground leading-tight">
                {product?.name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Qty:{product?.quantity}{" "}
                <span className="font-semibold text-foreground">
                  ${product?.price}
                </span>
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Your Rating</p>
            <StarRating value={stars} onChange={setStars} />
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={5}
            className="w-full resize-none rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />

          {/* Submit */}
          <Button
            onClick={handleSend}
            disabled={stars === 0 || isPending}
            className="w-full rounded-2xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </Button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            disabled={isPending}
            className="text-sm font-bold text-foreground text-center hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            Skip Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;