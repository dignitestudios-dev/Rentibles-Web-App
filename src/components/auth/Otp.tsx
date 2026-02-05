"use client";
import { Button } from "@/components/ui/button";
import { OtpInput } from "../common/OtpInput";
import Loader from "../common/Loader";

interface OtpFormProps {
  otp: string;
  error?: string;
  isLoading: boolean;
  timer: number;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onResendOtp?: () => void;
  isResendingOtp?: boolean;
}

const OtpForm = ({
  otp,
  error,
  isLoading,
  onChange,
  onSubmit,
  onResendOtp,
  isResendingOtp,
  timer,
}: OtpFormProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center md:w-125 rounded-[19px] bg-white">
      <p className="text-orange-400 mt-2 text-lg">
        00:{timer.toString().padStart(2, "0")}
      </p>

      <OtpInput value={otp} onChange={onChange} error={error} />
      <Loader show={isLoading} />

      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full cursor-pointer max-w-md mt-8 h-14 bg-[#F85E00] text-white text-lg"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>

      {onResendOtp && (
        <p className="text-gray-400 mt-6">
          Didn’t receive code?{" "}
          <span
            className={`font-medium cursor-pointer ${
              isResendingOtp || timer > 0
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onClick={onResendOtp}
          >
            {isResendingOtp
              ? "Sending..."
              : timer
                ? `Resend in ${timer}s`
                : "Send again"}
          </span>
        </p>
      )}
    </div>
  );
};

export default OtpForm;
