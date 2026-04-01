"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBookingDetails } from "@/src/lib/api/booking";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";

interface PickupCaptchaDialogProps {
  bookingId: string;
  trigger: React.ReactNode;
  disabled?: boolean;
  productInfo: {
    ProductName: any;
    productImg: string;
  };
  refetchBookings: () => void;
}

// ── Success Screen ────────────────────────────────────────────────────────────

const DeliverySuccessView = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col items-center text-center px-2 py-4 gap-0">
    {/* Icon */}
    <div className="mb-5">
       <img src="/images/pickup-icon.png" alt="pickup-icon.png" />
    </div>

    {/* Title */}
    <h2 className="text-xl font-bold text-foreground mb-3">
      Product Delivered Successfully
    </h2>

    {/* Description */}
    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
      Your product has been successfully delivered, and the rental booking time
      has started. Please track the booking from your dashboard. If you need any
      assistance, feel free to reach out to our support team.
    </p>

    {/* CTA */}
    <Button
      onClick={onClose}
      className="w-full rounded-2xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md"
    >
      Okay
    </Button>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const PickupCaptchaDialog: React.FC<PickupCaptchaDialogProps> = ({
  productInfo,
  bookingId,
  trigger,
  disabled,
  refetchBookings
}) => {
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const qrSrc = useMemo(() => {
    const data = encodeURIComponent(bookingId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
  }, [bookingId]);

  const { data: bookingData, refetch, isFetching } = useBookingDetails(bookingId);

  const handleDone = async () => {
    try {
      const res = await refetch();

      const pickupImages = res.data?.data?.detail?.pickupImages || [];
      const pickupVideos = res.data?.data?.detail?.pickupVideos || [];

      if (pickupImages.length === 0 && pickupVideos.length === 0) {
        ErrorToast("Please wait while the buyer uploads the pickup evidence");
        return;
      }

      // SuccessToast("Pickup evidence uploaded successfully");
      refetchBookings()
      setIsSuccess(true); // ← show success screen
    } catch (error: any) {
      ErrorToast(error.message || "Something went wrong");
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    // Reset success state when dialog closes
    if (!val) setIsSuccess(false);
  };

  const handleSuccessClose = () => {
    setOpen(false);
    setIsSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {React.isValidElement(trigger)
          ? React.cloneElement(
              trigger as React.ReactElement<{ disabled?: boolean }>,
              { disabled },
            )
          : trigger}
      </DialogTrigger>

      <DialogContent className="w-[400px]">
        {isSuccess ? (
          // ── Success state ──
          <DeliverySuccessView onClose={handleSuccessClose} />
        ) : (
          // ── QR state ──
          <>
            <DialogHeader>
              <DialogTitle>Ready for Pickup</DialogTitle>
              <DialogDescription>Scan the QR code below.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-1 pt-4 w-full">
              <img
                src={productInfo.productImg}
                className="w-12 h-12 rounded-full object-cover"
                alt={productInfo.ProductName}
              />
              <h4 className="text-base font-semibold">{productInfo.ProductName}</h4>
              <span className="text-primary text-sm">Verify Users</span>
            </div>

            <div className="flex flex-col items-center w-full px-6">
              <img
                src={qrSrc}
                alt={`QR code for booking ${bookingId}`}
                className="w-full aspect-square rounded-md border border-border shadow-sm object-contain"
              />
            </div>

            <DialogFooter className="mt-2">
              <Button
                className="text-white w-full flex items-center justify-center gap-2"
                onClick={handleDone}
                disabled={isFetching}
              >
                {isFetching && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isFetching ? "Processing..." : "Done"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PickupCaptchaDialog;