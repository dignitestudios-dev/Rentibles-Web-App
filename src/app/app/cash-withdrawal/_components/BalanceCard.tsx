import React from "react";
import { Wallet, Clock } from "lucide-react";

interface BalanceCardProps {
  title: string;
  amount: number;
  currency: string;
  type: "available" | "pending";
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  currency,
  type,
}) => {
  const isAvailable = type === "available";

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 shadow-md `}>
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {isAvailable ? (
            <Wallet className="w-5 h-5 text-foreground" />
          ) : (
            <Clock className="w-5 h-5 text-foreground" />
          )}
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>

        <p className="text-3xl sm:text-4xl font-bold text-primary">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(amount)}
        </p>

        <p className="text-xs text-white/60 mt-2">
          {isAvailable ? "Ready to withdraw" : "Processing"}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
