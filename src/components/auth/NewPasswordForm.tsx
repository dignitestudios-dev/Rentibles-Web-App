"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/src/components/common/InputField";
import { newPassword } from "@/src/lib/query/queryFn";
import { NewPasswordSchema } from "@/src/schema";
import { NewPasswordPayload } from "@/src/types/index.type";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordResetModal from "./PasswordResetModal";
import { useState } from "react";

const NewPasswordForm = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordPayload>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const newPasswordMutation = useMutation({
    mutationFn: newPassword,
    onSuccess: () => {
      redirect("/dashboard/home");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Something went wrong");

      setError("confirmPassword", {
        type: "manual",
        message,
      });
    },
  });

  const onSubmit = (data: NewPasswordPayload) => {
    newPasswordMutation.mutate(data);
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

      <Button
        // type="submit"
        // disabled={newPasswordMutation.isPending}
        onClick={() => setOpen(true)}
        className="w-full h-12.25 bg-[#F85E00] text-white"
      >
        Save
      </Button>
      <PasswordResetModal
        open={open}
        onContinue={() => {
          setOpen(false);
          redirect("/auth/login");
        }}
      />
    </form>
  );
};

export default NewPasswordForm;
