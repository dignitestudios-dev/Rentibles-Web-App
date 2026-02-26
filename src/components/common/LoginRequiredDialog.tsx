"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LoginRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginNow?: () => void;
  title?: string;
  description?: string;
  actionLabel?: string;
};

const LoginRequiredDialog = ({
  open,
  onOpenChange,
  onLoginNow,
  title = "Login Required",
  description = "Please login in order to access full features of the app.",
  actionLabel = "Login Now",
}: LoginRequiredDialogProps) => {
  const router = useRouter();

  const handleLoginNow = () => {
    if (onLoginNow) {
      onLoginNow();
    } else {
      router.push("/auth/get-started");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-3xl border-0 bg-card px-6 pb-6 pt-14 text-center max-w-sm"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-200">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-5xl font-bold leading-none text-white">
              !
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 text-center pt-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="text-base text-muted-foreground">
            {description}
          </p>
        </div>

        <Button
          className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
          onClick={handleLoginNow}
        >
          {actionLabel}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
