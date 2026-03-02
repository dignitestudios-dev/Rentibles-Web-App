"use client";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/src/components/common/InputField";
import Loader from "@/src/components/common/Loader";
import { useBank, useWithdraw } from "@/src/lib/api/balance";
import { AlertCircle, Banknote } from "lucide-react";
import { SuccessToast } from "@/src/components/common/Toaster";
import { WithdrawalResponse } from "@/src/types/index.type";
import { useRouter } from "next/navigation";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess?: (data: WithdrawalResponse) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: bankResponse,
    isLoading: bankLoading,
    error: bankError,
  } = useBank();

  const { mutate: withdraw, isPending: isWithdrawPending } = useWithdraw();

  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const bankDetails = bankResponse?.data;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!withdrawAmount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (amount > availableBalance) {
      alert("Withdrawal amount exceeds available balance");
      return;
    }

    withdraw(
      { amount },
      {
        onSuccess: (res) => {
          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess(res);
          }
          // Invalidate balance and payouts queries to refetch updated data
          queryClient.invalidateQueries({ queryKey: ["balance"] });
          queryClient.invalidateQueries({ queryKey: ["payouts"] });

          SuccessToast("Withdrawal initiated successfully");
          setWithdrawAmount("");
          onClose();
        },
        onError: (error) => {
          console.error("Withdrawal failed:", error);
          alert(`Withdrawal failed: ${error?.message || "Please try again."}`);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Withdraw money to your connected bank account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {bankLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-900 px-8 py-6 shadow-xl">
                <div className="flex items-end gap-2 h-8">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-full origin-bottom rounded-full bg-orange-500"
                      style={{
                        animation: "pulseBar 1s ease-in-out infinite",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>

                <p className="text-sm text-zinc-300">loading....</p>
              </div>
            </div>
          ) : bankError || !bankDetails ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold mb-2">
                  No bank account connected
                </p>
                {/* <p className="text-red-700 text-sm mt-1">
                  {bankError?.message || "Please try again later"}
                </p> */}
                <Button
                  variant="outline"
                  onClick={() => router.push("/app/settings/bank-details/add")}
                >
                  Connect Bank Account
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Bank Information Card */}
              <div className="bg-accent border border-accent rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Bank Account</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Country:</span>
                    <span className="font-semibold text-blue-900">
                      {bankDetails.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Currency:</span>
                    <span className="font-semibold text-blue-900">
                      {bankDetails.currency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Account Number:</span>
                    <span className="font-semibold text-blue-900">
                      ****{bankDetails.last4}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Status:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-xs ${
                        bankDetails.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {bankDetails.status.charAt(0).toUpperCase() +
                        bankDetails.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Balance */}
              <div className="bg-card rounded-lg p-4">
                <p className="text-foreground/60 text-sm">Available Balance</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${availableBalance.toFixed(2)}
                </p>
              </div>

              {/* Withdrawal Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Withdrawal Amount (USD)
                </label>
                <InputField
                  inputType="numeric"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={isWithdrawPending}
                  min="0"
                  step="0.01"
                  className="w-full"
                />
                {withdrawAmount && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      Amount: ${parseFloat(withdrawAmount || "0").toFixed(2)}
                    </span>
                    <span>
                      Remaining: $
                      {(
                        availableBalance - parseFloat(withdrawAmount || "0")
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Withdraw Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isWithdrawPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawPending || !withdrawAmount}
                  className="flex-1 bg-primary hover:bg-primary/80"
                >
                  {isWithdrawPending ? "Processing..." : "Withdraw Funds"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
