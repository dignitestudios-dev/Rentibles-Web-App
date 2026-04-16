import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void | Promise<void>;
  isLoading?: boolean;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and description.");
      return;
    }

    setInternalLoading(true);
    try {
      const result = onSubmit(title, description);
      if (result instanceof Promise) {
        await result;
      }
    } finally {
      setInternalLoading(false);
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setDescription("");
      setError("");
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
                Report an Issue
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We're here to help! Please provide details about the issue you are experiencing. Your feedback helps us improve our service.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                placeholder="Brief summary of the issue..."
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError("");
                }}
                placeholder="Please provide additional details..."
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                rows={4}
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2 flex-col-reverse sm:flex-row pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || internalLoading || isLoading}
            className="w-full sm:w-auto"
          >
            {internalLoading || isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
