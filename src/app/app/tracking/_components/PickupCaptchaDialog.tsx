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
  DialogClose,
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
}

const PickupCaptchaDialog: React.FC<PickupCaptchaDialogProps> = ({
  productInfo,
  bookingId,
  trigger,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  const qrSrc = useMemo(() => {
    const data = encodeURIComponent(bookingId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
  }, [bookingId]);
  const { data: bookingData, refetch,isFetching } = useBookingDetails(bookingId);

  const handleDone = async () => {
    try {      
      const res = await refetch();

      const pickupImages = res.data?.data?.detail?.pickupImages || [];
      const pickupVideos = res.data?.data?.detail?.pickupVideos || [];

      if (pickupImages.length === 0 && pickupVideos.length === 0) {
        ErrorToast("Please wait while the buyer uploads the pickup evidence");
        return;
      }

      SuccessToast("Pickup evidence uploaded successfully");
      setOpen(false);
    } catch (error: any) {
      ErrorToast(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {React.isValidElement(trigger)
          ? React.cloneElement(
              trigger as React.ReactElement<{ disabled?: boolean }>,
              { disabled },
            )
          : trigger}
      </DialogTrigger>
      <DialogContent className="w-[400px]">
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
      </DialogContent>
    </Dialog>
  );
};

export default PickupCaptchaDialog;
