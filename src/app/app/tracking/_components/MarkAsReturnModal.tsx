import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Smartphone } from "lucide-react";

type MarkAsReturnModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MarkAsReturnModal = ({ open, onOpenChange }: MarkAsReturnModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Mark As Return
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Smartphone className="w-12 h-12 text-primary" />
          <p className="text-muted-foreground text-sm">
            Please open mobile app to scan captcha
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAsReturnModal;
