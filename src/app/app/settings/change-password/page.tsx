"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import SettingsBackButton from "../_components/SettingsBackButton";
import { useChangePassword } from "@/src/lib/api/auth";
import Loader from "@/src/components/common/Loader";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useDispatch } from "react-redux";
import { logout } from "@/src/lib/store/feature/authSlice";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(8, "Password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const changePasswordMutation = useChangePassword();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        password: data.currentPassword,
        newPassword: data.newPassword,
      });

      SuccessToast("Password changed successfully");
      reset();
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
      // After successful password change, log out the user and redirect to login
      setTimeout(() => {
        try {
          dispatch(logout());
        } catch (e) {
          // ignore
        }
        router.push("/auth/login");
      }, 800);
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to change password");
      ErrorToast(message);
    }
  };

  const isLoading = changePasswordMutation.isPending;

  return (
    <div>
      <Loader show={isLoading} />
      <SettingsBackButton />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Change Password
      </h2>
      <p className="text-muted-foreground mb-6">
        Update your password to keep your account secure
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              placeholder="Enter your current password"
              {...register("currentPassword")}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                errors.currentPassword
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  currentPassword: !prev.currentPassword,
                }))
              }
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {showPasswords.currentPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              placeholder="Enter your new password"
              {...register("newPassword")}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                errors.newPassword
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {showPasswords.newPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.newPassword.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Must contain uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              {...register("confirmPassword")}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 disabled:opacity-50 ${
                errors.confirmPassword
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {showPasswords.confirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 mt-6 text-sm text-orange-400">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600/10 text-orange-500">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-orange-400">You will be logged out from the app after changing the password.</p>
        </div>

          <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
