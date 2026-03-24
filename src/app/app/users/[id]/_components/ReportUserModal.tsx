import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ReportReason {
  id: string;
  label: string;
  description?: string;
}

export interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasonId: string) => void | Promise<void>;
  userId: string;
  userName?: string;
  reasons?: ReportReason[];
  isLoading?: boolean;
  title?: string;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reasons,
  isLoading = false,
  title = "Report User",
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
                Report Reasons
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Reasons Section */}
        <div className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reasons?.map((reason) => (
              <div key={reason.id}>
                <div
                  className={`relative flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedReason === reason.id
                      ? "bg-card border-2 border-primary"
                      : "bg-card border border-gray-600 hover:bg-card/80"
                  }`}
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
                    className="w-4 h-4 text-primary border-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <label
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1"
                    onClick={() => setSelectedReason(reason.id)}
                  >
                    {reason.label}
                  </label>
                </div>

                {/* Description shown directly under selected reason */}
                {selectedReason === reason.id && reason.description && (
                  <div className="bg-orange-100 rounded-lg p-3 mt-2">
                    <p className="text-sm text-gray-700">
                      {reason.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Other textarea */}
          {selectedReason === "other" && (
            <div className="mt-3">
              <textarea
                value={otherReason}
                onChange={(e) => {
                  setOtherReason(e.target.value);
                  setError("");
                }}
                placeholder="Something else"
                className="w-full p-3 bg-card border border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                rows={4}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <DialogFooter className="gap-3 sm:gap-2 flex-col-reverse sm:flex-row pt-6 border-t border-gray-700">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || internalLoading || isLoading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            {internalLoading || isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserModal;
