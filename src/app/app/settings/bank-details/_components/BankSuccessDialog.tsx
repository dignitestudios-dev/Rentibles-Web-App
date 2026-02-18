import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface BankSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function BankSuccessDialog({
  open,
  onClose,
}: BankSuccessDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm bg-card border-border">
        <div className="flex flex-col items-center gap-4 pt-6 pb-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Bank Account Added Successfully!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your bank account has been added and is ready for use.
            </p>
          </div>

          {/* Button */}
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg mt-4"
          >
            OK
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
