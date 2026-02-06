"use client";
import { InputField } from "../common/InputField";
import { Button } from "@/components/ui/button";
import { ForgotPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotSchema } from "@/src/schema";
import { useMutation } from "@tanstack/react-query";
import { ForgotUser } from "@/src/lib/query/queryFn";
import { redirect } from "next/navigation";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { FiLoader } from "react-icons/fi";
import { ErrorToast } from "../common/Toaster";
import { useRouter } from "next/navigation";
import Loader from "../common/Loader";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPayload>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: ForgotPayload) => {
    loginMutation.mutate({ ...data, role: "user" } as ForgotPayload & {
      role: string;
    });
  };

  const loginMutation = useMutation({
    mutationFn: ForgotUser,
    onSuccess: () => {
      localStorage.setItem("email", loginMutation.variables?.email || "");
      router.push("/auth/otp");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Login failed");
      ErrorToast(message);
    },
  });
  return (
    <form className="w-full mt-6" onSubmit={handleSubmit(onSubmit)} action="">
      <div>
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Loader show={loginMutation.isPending} />
      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full mt-6 h-12.25 cursor-pointer bg-[#F85E00] text-white flex items-center justify-center gap-2"
      >
        <span>{loginMutation.isPending ? "Sending..." : "Send"}</span>
        {loginMutation.isPending && (
          <FiLoader className="animate-spin text-lg" />
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
