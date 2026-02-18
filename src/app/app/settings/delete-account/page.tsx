"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SettingsBackButton from "../_components/SettingsBackButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AlertTriangle, AlertCircle, Eye, EyeOff } from "lucide-react";

const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    setIsLoading(true);
    // TODO: Add account deletion logic
    setTimeout(() => {
      setIsLoading(false);
      setIsDialogOpen(false);
      reset();
      // Redirect to login or home
    }, 1000);
  };

  return (
    <div>
      <SettingsBackButton />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Delete Account
      </h2>
      <p className="text-muted-foreground mb-6">
        Permanently delete your account and all associated data
      </p>

      {/* Warning Box */}
      <div className="border border-destructive/50 bg-destructive/5 rounded-lg p-4 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive mb-1">
            This action cannot be undone
          </h3>
          <p className="text-sm text-foreground">
            Once you delete your account, there is no going back. Please be
            certain. All your data including listings, messages, and payment
            information will be permanently deleted.
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          What happens when you delete your account:
        </h3>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-center gap-2">
            <span className="text-destructive">✕</span> Your profile and all
            listings will be removed
          </li>
          <li className="flex items-center gap-2">
            <span className="text-destructive">✕</span> All messages and chat
            history will be deleted
          </li>
          <li className="flex items-center gap-2">
            <span className="text-destructive">✕</span> Payment methods and
            transaction history will be removed
          </li>
          <li className="flex items-center gap-2">
            <span className="text-destructive">✕</span> You won't be able to
            recover your account
          </li>
        </ul>
      </div>

      {/* Delete Button */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="lg"
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete My Account Permanently
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter your password to confirm:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors pr-10 ${
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
                <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
