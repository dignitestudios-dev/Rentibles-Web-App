"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/src/components/common/InputField";
import { NewPasswordSchema } from "@/src/schema";
import { NewPasswordPayload } from "@/src/types/index.type";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordResetModal from "./PasswordResetModal";
import { useState } from "react";
import Loader from "../common/Loader";
import { ErrorToast } from "../common/Toaster";
import z from "zod";
import { logout } from "@/src/lib/store/feature/authSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "@/src/lib/axiosInstance";

const NewPasswordForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const postNewPassword = async (payload: { password: string }) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error(
        "Missing reset token. Please restart the password reset flow.",
      );
    }

    const { data } = await axiosInstance.post("/auth/updatePassword", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*",
      },
    });

    return data;
  };

  const newPasswordMutation = useMutation({
    mutationFn: postNewPassword,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      localStorage.removeItem("email");
      setOpen(true);
      // dispatch(logout());
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
        inputType="password"
        label="New Password"
        type="password"
        placeholder="New Password"
        error={errors.password?.message}
        {...register("password")}
      />

      <InputField
        inputType="password"
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
