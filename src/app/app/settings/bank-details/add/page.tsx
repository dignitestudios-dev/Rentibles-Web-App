"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import SettingsBackButton from "../../_components/SettingsBackButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAddBank } from "@/src/lib/api/bank";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";
import Loader from "@/src/components/common/Loader";
import BankSuccessDialog from "./_components/BankSuccessDialog";
import { useQueryClient } from "@tanstack/react-query";

const bankSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .min(3, "Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d{8,17}$/, "Account number must be 8-17 digits"),
  routingNumber: z
    .string()
    .min(1, "Routing number is required")
    .regex(/^\d{8,9}$/, "Routing number must be 8-9 digits"),
});

type BankFormData = z.infer<typeof bankSchema>;

export default function AddBankPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addBankMutation = useAddBank();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
    },
  });

  const onSubmit = async (data: BankFormData) => {
    try {
      await addBankMutation.mutateAsync({
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
      });
      
      // Invalidate the bank query to fetch updated data
      await queryClient.invalidateQueries({ queryKey: ["bank"] });
      
      setShowSuccessDialog(true);
    } catch (err) {
      ErrorToast(getAxiosErrorMessage(err, "Failed to add bank account"));
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/app/settings/bank-details");
  };

  const isLoading = isSubmitting || addBankMutation.isPending;

  return (
    <div>
      <SettingsBackButton link="/app/settings/bank-details" />
      <Loader show={isLoading} />
      <BankSuccessDialog open={showSuccessDialog} onClose={handleSuccessDialogClose} />

      <Link
        href="/app/settings/bank-details"
        className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Add Bank Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Holder Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            maxLength={50}
            disabled={isLoading}
            {...register("accountHolderName")}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.accountHolderName
                ? "border-destructive focus:ring-destructive/50"
                : "border-input focus:ring-primary/50"
            }`}
          />
          {errors.accountHolderName && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        {/* Routing Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Routing Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter routing number"
            maxLength={9}
            disabled={isLoading}
            {...register("routingNumber")}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.routingNumber
                ? "border-destructive focus:ring-destructive/50"
                : "border-input focus:ring-primary/50"
            }`}
          />
          {errors.routingNumber && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.routingNumber.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter account number"
            maxLength={17}
            disabled={isLoading}
            {...register("accountNumber")}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.accountNumber
                ? "border-destructive focus:ring-destructive/50"
                : "border-input focus:ring-primary/50"
            }`}
          />
          {errors.accountNumber && (
            <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
