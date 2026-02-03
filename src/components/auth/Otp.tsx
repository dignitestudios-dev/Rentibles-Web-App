"use client";
import { Button } from "@/components/ui/button";
import { verifyOtp } from "@/src/lib/query/queryFn";
import { OtpPayload, OtpSchema } from "@/src/schema";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { OtpInput } from "../common/OtpInput";

const OtpForm = () => {
  const [timer, setTimer] = useState(55);

  const {
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<OtpPayload>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const otp = watch("otp");

  const otpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      redirect("/dashboard/home");
    },
    onError: (err) => {
      console.error("Otp Failed", err);
      const message = getAxiosErrorMessage(err || "Login failed");
      setError("otp", {
        type: "manual",
        message,
      });
    },
  });

  useEffect(() => {
    if (timer === 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);
  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125  rounded-[19px] bg-white">
      <p className="text-orange-400 mt-4 text-lg">
        00:{timer.toString().padStart(2, "0")}
      </p>
      <OtpInput
        value={otp}
        onChange={(val) => setValue("otp", val)}
        error={errors.otp?.message}
      />

      <Button
        onClick={handleSubmit((data) => otpMutation.mutate(data))}
        disabled={otpMutation.isPending}
        className="w-full max-w-md mt-8 h-14 bg-[#F85E00] text-white text-lg"
      >
        Verify
      </Button>

      <p className="text-gray-400 mt-6">
        Didn’t receive code?{" "}
        <span className="text-black font-medium cursor-pointer">
          Send again
        </span>
      </p>
    </div>
  );
};

export default OtpForm;
