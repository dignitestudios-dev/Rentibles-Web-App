"use client";
import Image from "next/image";
import { Otp_Icon } from "@/public/images/export";
import { useForm } from "react-hook-form";
import { ForgotOtpSchema, OtpPayload, OtpSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { ForgotResendOtp, ForgotVerifyOtp } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import OtpForm from "@/src/components/auth/Otp";
import { ForgotVerifyOtpPayload } from "@/src/types/index.type";
import { singUp } from "@/src/lib/store/feature/authSlice";

const Page = () => {
  const dispatch = useDispatch();
  const email = localStorage.getItem("email");
  const router = useRouter();
  const [timer, setTimer] = useState(55);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotVerifyOtpPayload>({
    resolver: zodResolver(ForgotOtpSchema),
    defaultValues: { otp: "", email: email || "", role: "user" },
  });

  const otp = watch("otp");

  const otpMutation = useMutation({
    mutationFn: ForgotVerifyOtp,

    onSuccess: (response) => {
      const userInfo = response?.data;

      dispatch(
        singUp({
          token: {
            access: userInfo.token,
            refresh: userInfo.token,
          },
          user: response.data.user,
        }),
      );
      SuccessToast(response.message);
      router.push("/auth/new-password");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      ErrorToast(message);
    },
  });

  const resendOtp = useMutation({
    mutationFn: ForgotResendOtp,
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
    <div className="w-full  flex flex-col items-center p-6 justify-center md:w-125  rounded-[19px] bg-white">
      <Image src={Otp_Icon} alt="otp" className="w-40" />

      <h2 className="text-3xl font-bold mt-6">Verify OTP</h2>

      <p className="text-gray-400 mt-2 text-center">
        The code was sent to{" "}
        <span className="text-black font-normal">{email}</span>
      </p>

      <OtpForm
        otp={otp}
        error={errors.otp?.message}
        isLoading={otpMutation.isPending}
        onChange={(val) => setValue("otp", val)}
        onSubmit={handleSubmit((data) => otpMutation.mutate(data))}
        onResendOtp={() => {
          if (!email) return; // agar email null ho toh call na ho
          resendOtp.mutate({ email, role: "user" } as ForgotVerifyOtpPayload);
        }}
        isResendingOtp={resendOtp.isPending}
        timer={timer}
      />
    </div>
  );
};

export default Page;
