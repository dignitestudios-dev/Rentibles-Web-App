"use client";

import { useGetBank } from "@/src/lib/api/bank";
import SettingsBackButton from "../_components/SettingsBackButton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/src/components/common/Loader";
import { CreditCard, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function BankDetailsPage() {
  const router = useRouter();
  const { data: bankData, isLoading } = useGetBank();
  const bank = bankData?.data;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900";
      case "inactive":
        return "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900";
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-900";
    }
  };

  const statusText = bank?.status
    ? bank.status.charAt(0).toUpperCase() + bank.status.slice(1)
    : "Unknown";

  return (
    <div>
      <SettingsBackButton />
      <Loader show={isLoading} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Bank Accounts
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your bank account information
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {bank ? (
          /* Bank Card - Mobile UI Style */
          <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between">
            {/* Left side - Bank info */}
            <div className="flex items-center gap-4 flex-1">
              {/* Bank Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>

              {/* Bank Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {bank.bank_name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {`••••`.repeat(2)} {bank.last4}
                </p>
              </div>
            </div>

            {/* Right side - Status and Update button */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  bank.status,
                )}`}
              >
                {statusText}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-muted/50" aria-label="bank-menu">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onSelect={() => router.push("/app/settings/bank-details/add")}
                    className="flex items-center gap-3"
                  >
                    Update
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-card border border-border/50 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-64">
            <CreditCard className="w-12 h-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Bank Account
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Add a bank account to enable transfers
            </p>
            <Button
              onClick={() => router.push("/app/settings/bank-details/add")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Bank Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
