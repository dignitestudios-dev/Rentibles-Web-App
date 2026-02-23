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

export type ModalType = "confirm" | "danger" | "warning" | "info" | "success";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ModalType;
  isLoading?: boolean;
  isDangerous?: boolean; // Makes confirm button red/destructive
  showIcon?: boolean;
  iconComponent?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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
}) => {
  // Determine icon and styling based on type
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
      info: {
        icon: <Info className="w-10 h-10" />,
        color: "text-blue-500",
      },
      success: {
        icon: <CheckCircle2 className="w-10 h-10" />,
        color: "text-green-500",
      },
    };

    return configs[type] || configs.confirm;
  };

  const { icon, color } = getIconConfig();

  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
  }[maxWidth];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidthClass}`}>
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

        {/* Details Section */}
        <div className="space-y-3">
          {message && (
            <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}
        </div>

        {/* Footer with Actions */}
        <DialogFooter className="gap-3 sm:gap-2 pt-6 ">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant={isDangerous ? "destructive" : "default"}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
