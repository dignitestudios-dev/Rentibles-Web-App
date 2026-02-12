"use client";
import Image from "next/image";
import { Otp_Icon } from "@/public/images/export";
import OtpForm from "@/src/components/auth/Otp";
import { useForm } from "react-hook-form";
import { OtpPayload, OtpSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PhoneResendOtp, PhoneVerifyOtp } from "@/src/lib/query/queryFn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useDispatch } from "react-redux";
import { setUser } from "@/src/lib/store/feature/authSlice";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const {
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpPayload>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const otp = watch("otp");

  const otpMutation = useMutation({
    mutationFn: PhoneVerifyOtp,
    onSuccess: (response) => {
      SuccessToast(response.message);
      if (user) {
        const updatedUser = { ...user, isPhoneVerified: true };
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      router.push("/auth/select-otp");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  const resendOtp = useMutation({
    mutationFn: PhoneResendOtp,
    onSuccess: (response) => {
      SuccessToast(response.message);
      setTimer(55);
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  return (
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125  rounded-[19px] bg-background">
      <Image src={Otp_Icon} alt="otp" className="w-40" />

      <h2 className="text-3xl font-bold mt-6">Number Verification</h2>

      <p className="text-gray-400 mt-2 text-center">
        Enter the OTP code sent to
        <span className="text-black mx-2">{user?.phone}</span>
      </p>

      <OtpForm
        otp={otp}
        error={errors.otp?.message}
        isLoading={otpMutation.isPending}
        onChange={(val) => setValue("otp", val)}
        onSubmit={handleSubmit((data) => otpMutation.mutate(data))}
        onResendOtp={() => resendOtp.mutate({ phone: user!.phone })}
        isResendingOtp={resendOtp.isPending}
        timer={timer}
      />
    </div>
  );
};

export default Page;
