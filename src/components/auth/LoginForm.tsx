"use client";
import { InputField } from "../common/InputField";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiLoader } from "react-icons/fi";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { redirect } from "next/navigation";
import { LoginPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/src/schema";
import { loginUser } from "@/src/lib/query/queryFn";
import { useMutation } from "@tanstack/react-query";

const LoginForm = () => {
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
      setError("root", {
        type: "manual",
        message,
      });
    },
  });
  return (
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
          href="/auth/forgot-password"
          className="text-black hover:no-underline hover:text-black text-[14px] font-normal leading-[20.4px]"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full h-12.25 bg-[#F85E00] cursor-pointer text-white flex items-center justify-center gap-2"
      >
        <span>Log In</span>
        {loginMutation.isPending && (
          <FiLoader className="animate-spin text-lg" />
        )}
      </Button>
      <div className="w-full flex items-center gap-3 ">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-[14px] text-[#3C3C43D9] whitespace-nowrap">
          OR
        </span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
      <p className="w-full text-center text-[16px] text-[#3C3C43D9] ">
        Don’t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-[#F85E00] font-medium hover:underline"
        >
          Register now
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
