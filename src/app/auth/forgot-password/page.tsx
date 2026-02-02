"use client";
import { ForgotPassword } from "@/public/images/export";
import ForgotPasswordForm from "@/src/components/auth/ForgotPasswordForm";
import Image from "next/image";

const Page = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center px-6 py-8 md:w-125 rounded-[19px] bg-white">
      <Image src={ForgotPassword} alt="forgot_password" className="w-37" />

      <div className="w-full flex flex-col mt-6 items-center text-center">
        <h2 className="text-[32px] font-bold leading-10">Forgot Password</h2>

        <p className="text-[16px] mt-3 max-w-sm text-[#3C3C43D9] leading-5.5">
          Enter your email address and we’ll send you an OTP to reset your
          password
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default Page;
