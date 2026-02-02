"use client";

import Image from "next/image";
import { OrangeLogo } from "@/public/images/export";
import { Button } from "@/components/ui/button";
import { FiLoader } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import { InputField } from "@/src/components/common/InputField";
import { useMutation } from "@tanstack/react-query";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { redirect } from "next/navigation";
import { loginUser } from "@/src/lib/query/queryFn";
import { useForm } from "react-hook-form";
import { LoginPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/schema";

const Page = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data);
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      redirect("/dashboard/home");
    },
    onError: (err) => {
      console.error("Login Failed", err);
      const message = getAxiosErrorMessage(err || "Login failed");
      setError("email", {
        type: "manual",
        message: "",
      });

      setError("password", {
        type: "manual",
        message,
      });
    },
  });

  return (
    <div className="w-full h-auto flex flex-col items-center p-6 justify-center md:w-125 md:h-137.5 rounded-[19px] bg-white">
      <Image src={OrangeLogo} alt="orange_logo" className="w-37" />
      <div className="w-auto flex flex-col mt-4 justify-center items-center">
        <h2 className="text-[32px] font-bold leading-12">Welcome Back</h2>
        <p className="text-[18px] font-normal text-center leading-12 text-[#3C3C43D9]">
          Please enter your details to continue
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-98.25 mt-5 flex flex-col justify-start items-start gap-4"
      >
        <div className="w-full flex flex-col gap-1">
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="w-full flex flex-col gap-1 relative">
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="w-full flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-black hover:no-underline hover:text-black text-[16px] font-normal leading-[20.4px]"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12.25 bg-[#F85E00] cursor-pointer text-white flex items-center justify-center gap-2"
        >
          <span>Log In</span>
          {false && <FiLoader className="animate-spin text-lg" />}
        </Button>
      </form>
    </div>
  );
};

export default Page;
