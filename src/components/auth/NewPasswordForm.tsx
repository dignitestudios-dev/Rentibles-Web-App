"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/src/components/common/InputField";
import { newPassword } from "@/src/lib/query/queryFn";
import { NewPasswordSchema } from "@/src/schema";
import { NewPasswordPayload } from "@/src/types/index.type";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordResetModal from "./PasswordResetModal";
import { useState } from "react";
import Loader from "../common/Loader";
import { ErrorToast } from "../common/Toaster";
import z from "zod";

const NewPasswordForm = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const newPasswordMutation = useMutation({
    mutationFn: newPassword,
    onSuccess: () => {
      localStorage.removeItem("email");
      setOpen(true);
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Something went wrong");
      ErrorToast(message);
    },
  });

  const onSubmit = (data: NewPasswordPayload) => {
    newPasswordMutation.mutate({ password: data.password });
  };

  return (
    <form className="w-full mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="New Password"
        type="password"
        placeholder="New Password"
        error={errors.password?.message}
        {...register("password")}
      />

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Loader show={newPasswordMutation.isPending} />
      <Button
        type="submit"
        disabled={newPasswordMutation.isPending}
        className="w-full cursor-pointer h-12.25 bg-[#F85E00] text-white"
      >
        Save
      </Button>
      <PasswordResetModal
        open={open}
        onContinue={() => {
          setOpen(false);
          router.push("/auth/login");
        }}
      />
    </form>
  );
};

export default NewPasswordForm;
