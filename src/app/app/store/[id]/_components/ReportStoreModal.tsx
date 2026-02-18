import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface ReportReason {
  id: string;
  label: string;
  description?: string;
}

export interface ReportStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasonId: string) => void | Promise<void>;
  storeId: string;
  storeName?: string;
  reasons?: ReportReason[];
  isLoading?: boolean;
  title?: string;
}

const ReportStoreModal: React.FC<ReportStoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reasons,
  isLoading = false,
  title = "Report Store",
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }
    if (selectedReason === "other" && !otherReason.trim()) {
      setError("Please provide a reason before submitting.");
      return;
    }

    setInternalLoading(true);
    try {
      const result = onSubmit(selectedReason);
      if (result instanceof Promise) {
        await result;
      }
    } finally {
      setInternalLoading(false);
      setSelectedReason("");
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Reasons Section */}
        <div className=" space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please select a reason for reporting this store:
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reasons?.map((reason) => (
              <div
                key={reason.id}
                className="relative flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                onClick={() => {
                  setSelectedReason(reason.id);
                  setError("");
                }}
              >
                <input
                  type="radio"
                  name="report_reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1 w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500 cursor-pointer"
                />
                <div className="flex-1">
                  <label
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer block"
                    onClick={() => setSelectedReason(reason.id)}
                  >
                    {reason.label}
                  </label>
                  {reason.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {reason.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {selectedReason === "other" && (
              <div className="mt-3">
                <textarea
                  value={otherReason}
                  onChange={(e) => {
                    setOtherReason(e.target.value);
                    setError("");
                  }}
                  placeholder="Please provide additional details..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                  rows={4}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Actions */}
        <DialogFooter className="gap-3 sm:gap-2 flex-col-reverse sm:flex-row pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={internalLoading || isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button> */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || internalLoading || isLoading}
            className="w-full sm:w-auto"
          >
            {internalLoading || isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportStoreModal;
