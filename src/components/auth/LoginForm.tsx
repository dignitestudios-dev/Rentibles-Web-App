"use client";
import { InputField } from "../common/InputField";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiLoader } from "react-icons/fi";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useRouter } from "next/navigation";
import { LoginPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/src/schema";
import { loginUser } from "@/src/lib/query/queryFn";
import { useMutation } from "@tanstack/react-query";
import { ErrorToast, SuccessToast } from "../common/Toaster";
import Loader from "../common/Loader";
import { useDispatch } from "react-redux";
import { singUp } from "@/src/lib/store/feature/authSlice";
import { useInvalidateAllQueries } from "@/src/hooks/useInvalidateAllQueries";
import { ArrowLeft } from "lucide-react";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { invalidateAll } = useInvalidateAllQueries();
  const {
    register,
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
    loginMutation.mutate({ ...data, role: "user" } as LoginPayload & {
      role: string;
    });
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      invalidateAll();
      const userInfo = response?.data;

      const normalizedUser = {
        ...userInfo.user,
        _id: userInfo.user._id,
      };

      dispatch(
        singUp({
          token: {
            access: userInfo.token,
            refresh: userInfo.token,
          },
          user: normalizedUser,
        }),
      );
      SuccessToast(response?.message);
      if (
        userInfo?.user.isEmailVerified === false ||
        userInfo?.user.isPhoneVerified === false
      ) {
        router.push("/auth/select-otp");
        return;
      }
      switch (userInfo?.user.identityStatus) {
        case "not-provided":
          router.push("/auth/identity-verification");
          return;

        case "pending":
        case "rejected":
          router.push("/auth/profile-status");
          return;

        case "approved":
          router.push("/app/home");
          return;
      }
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Login failed");
      console.log("🚀 ~ LoginForm ~ message:", message);
      ErrorToast("Invalid email or password provided.");
    },
  });
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-98.25 mt-5 flex flex-col justify-start items-start gap-4 "
    >
      <div className=" absolute top-4 left-0 pl-4">
        <button
          type="button"
          onClick={() => router.push("/auth/get-started")}
          className="p-2 hover:bg-muted hover:text-foreground rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5 " />
        </button>
      </div>
      <div className="w-full flex flex-col gap-1">
        <InputField
          inputType="email"
          label="Email Address"
          // type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="w-full flex flex-col gap-1 relative">
        <InputField
          inputType="password"
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
          className=" hover:no-underline  text-[14px] font-normal leading-[20.4px]"
        >
          Forgot Password?
        </Link>
      </div>
      <Loader show={loginMutation.isPending} />
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
        <div className="flex-1 h-px bg-background" />
        <span className="text-[14px]  whitespace-nowrap">OR</span>
        <div className="flex-1 h-px bg-background" />
      </div>
      <p className="w-full text-center text-[16px]  ">
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
