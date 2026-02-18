"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/store/feature/authSlice";
import SettingsBackButton from "../_components/SettingsBackButton";
import Loader from "@/src/components/common/Loader";
import { deleteAccount } from "@/src/lib/query/queryFn";

const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await deleteAccount({ password: data.password });

      if (response.success) {
        // Logout user after successful deletion
        dispatch(logout());
        router.push("/auth/login");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to delete account. Please try again.";
      setApiError(errorMessage);
      console.error("Failed to delete account:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loader show={isLoading} />
      <div className="">
        <SettingsBackButton />
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Delete Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                <Trash2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Header */}
            <h1 className="text-2xl font-bold text-center text-foreground mb-2">
              Delete Account
            </h1>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Are you sure you want to delete your account
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 ${
                      errors.password
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-input focus:ring-primary/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* API Error */}
              {apiError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
                  <p className="text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {apiError}
                  </p>
                </div>
              )}

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                {isLoading ? "Deleting..." : "Continue"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
