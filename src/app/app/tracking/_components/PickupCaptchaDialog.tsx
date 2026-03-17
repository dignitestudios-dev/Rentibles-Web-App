"use client";

import React, { useMemo } from "react";
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

interface PickupCaptchaDialogProps {
  bookingId: string;
  trigger: React.ReactNode;
  disabled?: boolean;
}

const PickupCaptchaDialog: React.FC<PickupCaptchaDialogProps> = ({
  bookingId,
  trigger,
  disabled,
}) => {
  const qrSrc = useMemo(() => {
    const data = encodeURIComponent(bookingId);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
  }, [bookingId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* allow the caller to control disabled state */}
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger, { disabled })
          : trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready for Pickup</DialogTitle>
          <DialogDescription>
            Scan the QR code below to view the booking ID.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <img
            src={qrSrc}
            alt={`QR code for booking ${bookingId}`}
            className="h-60 w-60 rounded-md border border-border shadow-sm"
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="font-semibold break-all">{bookingId}</p>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(bookingId)}
              className="text-sm"
            >
              Copy Booking ID
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PickupCaptchaDialog;
