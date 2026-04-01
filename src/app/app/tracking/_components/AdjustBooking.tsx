"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { useReportBookingDamage } from "@/src/lib/api/booking";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";

export type ModalType = "confirm" | "danger" | "warning" | "info" | "success";

export interface AdjustBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  isDangerous?: boolean;
  showIcon?: boolean;
  iconComponent?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  // ── Required for API call ──────────────────────────────────────────────
  bookingId: any;
}

const AdjustBookingModal: React.FC<AdjustBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "confirm",
  isDangerous = false,
  showIcon = true,
  iconComponent,
  maxWidth = "sm",
  bookingId,
}) => {
  const { mutate: reportDamage, isPending } = useReportBookingDamage();
  const [actionType, setActionType] = React.useState<"adjust" | "skip" | null>(
    null,
  );
  // ── Shared API call — both buttons send adjustBooking: true ───────────
  const callDamageApi = (callback: () => void) => {
    reportDamage(
      { bookingId, adjustBooking: true },
      {
        onSuccess: () => {
          setActionType(null);
          callback();
        },
        onError: (err: any) => {
          setActionType(null);
          console.log(err, "error cheking");
          ErrorToast(err?.message || "Something went wrong. Please try again.");
        },
      },
    );
  };

  const handleAdjust = () => {
    setActionType("adjust");
    callDamageApi(onConfirm);
  };

  const handleSkip = () => {
    setActionType("skip");
    callDamageApi(onClose);
  };

  // ── Icon config ───────────────────────────────────────────────────────
  const getIconConfig = () => {
    if (iconComponent) return { icon: iconComponent, color: "text-gray-600" };
    const configs = {
      confirm: {
        icon: <AlertCircle className="w-10 h-10" />,
        color: "text-blue-500",
      },
      danger: {
        icon: <AlertCircle className="w-10 h-10" />,
        color: "text-red-500",
      },
      warning: {
        icon: <AlertCircle className="w-10 h-10" />,
        color: "text-amber-500",
      },
      info: { icon: <Info className="w-10 h-10" />, color: "text-blue-500" },
      success: {
        icon: <CheckCircle2 className="w-10 h-10" />,
        color: "text-green-500",
      },
    };
    return configs[type] ?? configs.confirm;
  };

  const { icon, color } = getIconConfig();
  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
  }[maxWidth];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v && !isPending) onClose();
      }}
    >
      <DialogContent className={maxWidthClass}>
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {showIcon && (
              <div
                className={`${color} bg-gray-100 dark:bg-gray-800 rounded-full p-3`}
              >
                {icon}
              </div>
            )}
            <DialogTitle className="text-center text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {message && (
          <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <DialogFooter className="gap-3 sm:gap-2 pt-6">
          {/* Adjust Booking — calls API then fires onConfirm */}
          <Button
            type="button"
            onClick={handleAdjust}
            disabled={isPending}
            variant={isDangerous ? "destructive" : "default"}
            className="w-full text-white sm:w-auto"
          >
            {isPending && actionType === "adjust" ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </Button>

          {/* Skip — also calls the same API then fires onClose */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending && actionType === "skip" ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              cancelText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustBookingModal;
