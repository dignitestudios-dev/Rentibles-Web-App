"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Props {
  open: boolean;
  onContinue: () => void;
}

const PasswordResetModal = ({ open, onContinue }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-[#F85E00] flex items-center justify-center">
              <Check className="text-white h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-black">Password Reset!</h2>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Your password has been successfully reset. Click below to continue
            your access.
          </p>

          <Button
            onClick={onContinue}
            className="mt-6 h-12 cursor-pointer w-full rounded-xl bg-[#F85E00] text-white text-base"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
