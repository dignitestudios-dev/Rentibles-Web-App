// components/WithdrawalDetailsModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatDateToMMDDYYYY } from "@/src/utils/helperFunctions";
import { WithdrawalDetails } from "@/src/types/index.type";
import { ErrorToast } from "@/src/components/common/Toaster";
import { generateWithdrawalPDF } from "../_components/PdfWithDrawal";

interface WithdrawalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: WithdrawalDetails | null;
}

const WithdrawalDetailsModal: React.FC<WithdrawalDetailsModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const handleDownloadPDF = async () => {
    if (details) {
      try {
        await generateWithdrawalPDF(details);
      } catch (error) {
        console.error("Failed to download PDF:", error);
        ErrorToast("Failed to generate PDF");
      }
    }
  };

  if (!details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-400 flex items-center justify-center">
              <Check className="w-10 h-10 sm:w-12 sm:h-12 text-green-100" />
            </div>
          </div>

          {/* Modal Title */}
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold text-foreground">
            Withdrawal Successful!
          </DialogTitle>
        </DialogHeader>

        {/* Details Section */}
        <div className="space-y-4 mt-6">
          {/* Withdrawal Amount */}
          <div className="bg-card rounded-lg p-4 text-center">
            <p className=" text-foreground/60 mb-1">Amount Withdraw</p>
            <p className="text-2xl sm:text-3xl text-primary font-semibold">
              USD ${details.amount}
            </p>
          </div>

          {/* Reference ID */}
          <div className=" pb-3 text-center">
            <p className="text-sm text-foreground/60 mb-1">Reference ID</p>
            <p className="text-base font-semibold text-foreground font-mono">
              {details.referenceId}
            </p>
          </div>

          {/* Date */}
          <div className="pb-3 text-center">
            <p className="text-sm text-foreground/60 mb-1">Date</p>
            <p className="text-base font-semibold text-foreground">
              {formatDateToMMDDYYYY(details.date)}
            </p>
          </div>

          {/* Description */}
          <div className="pb-3 text-center">
            <p className="text-sm text-foreground/60 mb-1">Description</p>
            <p className="text-base text-foreground">{details.description}</p>
          </div>

          {/* Download PDF Button */}
          <div className="pt-2">
            <Button
              onClick={handleDownloadPDF}
              className="w-full bg-primary hover:bg-primary/80  font-semibold py-6 rounded-lg transition-all active:scale-95"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDetailsModal;
