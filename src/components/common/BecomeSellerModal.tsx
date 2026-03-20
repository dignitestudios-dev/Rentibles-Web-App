"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/src/lib/axiosInstance";
import { ErrorToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";

type BecomeSellerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const BecomeSellerModal = ({ open, onOpenChange }: BecomeSellerModalProps) => {
  const router = useRouter();

  const becomeSellerMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/user/becomeSeller", {
        returnUrl: "https://rentibles-web.vercel.app/app/home",
      });
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        ErrorToast("Failed to retrieve Stripe link");
      }
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  const handleBecomeSeller = () => {
    becomeSellerMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
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
            Become Seller
          </h2>
          <p className="text-base text-muted-foreground">
            You are not currently a seller. Tap &apos;Continue&apos; to start
            the process of becoming a seller.
          </p>
        </div>

        <Button
          className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
          onClick={handleBecomeSeller}
          disabled={becomeSellerMutation.isPending}
        >
          {becomeSellerMutation.isPending ? "Processing..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeSellerModal;
