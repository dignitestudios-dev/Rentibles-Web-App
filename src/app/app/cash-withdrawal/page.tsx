"use client";
import { useState } from "react";
import { ArrowDownToLine, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BalanceCard from "./_components/BalanceCard";
import WithdrawalHistoryTable from "./_components/WithdrawalHistoryTable";
import TransactionHistoryTable from "./_components/TransactionHistoryTable";
import {
  Balance,
  TabType,
  TransactionRecord,
  TransactionStatus,
  WithdrawalDetails,
  WithdrawalRecord,
} from "@/src/types/index.type";
import WithdrawalDetailsModal from "./_components/WithdrawalDetailsModal";

const mockBalance: Balance = {
  available: 5420.5,
  pending: 1250.0,
  currency: "USD",
};

const mockWithdrawals: WithdrawalRecord[] = [
  {
    id: "w1",
    date: "2024-02-05T14:30:00",
    status: TransactionStatus.COMPLETED,
    amount: 500.0,
  },
  {
    id: "w2",
    date: "2024-02-03T10:15:00",
    status: TransactionStatus.PENDING,
    amount: 1000.0,
  },
  {
    id: "w3",
    date: "2024-02-01T16:45:00",
    status: TransactionStatus.COMPLETED,
    amount: 750.0,
  },
];

const mockTransactions: TransactionRecord[] = [
  {
    id: "t1",
    date: "2024-02-06T11:30:00",
    status: TransactionStatus.COMPLETED,
    amount: 150.0,
    type: "credit",
  },
  {
    id: "t2",
    date: "2024-02-05T14:30:00",
    status: TransactionStatus.COMPLETED,
    amount: 500.0,
    type: "debit",
  },
  {
    id: "t3",
    date: "2024-02-04T09:15:00",
    status: TransactionStatus.PROCESSING,
    amount: 1250.0,
    type: "credit",
  },
];

const CashWithdrawalPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WithdrawalDetails | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("withdrawal");
  const [balance] = useState<Balance>(mockBalance);

  const handleWithdraw = () => {
    // Withdrawal logic here
    console.log("Withdraw funds clicked");
    alert(
      `Initiating withdrawal from available balance: $${balance.available}`,
    );
  };

  const handleRowClick = (record: TransactionRecord) => {
    const details: WithdrawalDetails = {
      id: record.id,
      amount: record.amount,
      currency: "USD",
      referenceId: `TXN-${record.id.toUpperCase()}-${Date.now()}`,
      date: record.date,
      description:
        record.type === "credit"
          ? `Payment received from customer #${Math.floor(1000 + Math.random() * 9000)}`
          : `Payment sent to vendor #${Math.floor(1000 + Math.random() * 9000)}`,
      // status: getStatusLabel(record.status),
      status: record.status,
    };

    setSelectedTransaction(details);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Cash Withdrawal Page</h1>
          <div></div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Wallet
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your funds and view transaction history
            </p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <BalanceCard
              title="Available Balance"
              amount={balance.available}
              currency={balance.currency}
              type="available"
            />
            <BalanceCard
              title="Pending Balance"
              amount={balance.pending}
              currency={balance.currency}
              type="pending"
            />
          </div>

          {/* Withdraw Button */}
          {balance.available > 0 && (
            <div className="mb-8">
              <button
                onClick={handleWithdraw}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground
                 text-white rounded-lg hover:bg-primary/80 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                {/* <ArrowDownToLine className="w-5 h-5" /> */}
                Withdraw Funds
              </button>
            </div>
          )}

          {/* Tabs Section */}
          <div className="bg-white rounded-lg overflow-hidden ">
            {/* Tab Headers */}
            <div className="m-2 border-2 rounded-2xl">
              <div className="flex m-1">
                <button
                  onClick={() => setActiveTab("withdrawal")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "withdrawal"
                      ? "bg-primary text-white rounded-l-xl"
                      : "text-foreground hover:text-gray-900 hover:bg-gray-50 rounded-l-xl"
                  }`}
                >
                  Withdrawal History
                </button>
                <button
                  onClick={() => setActiveTab("transaction")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "transaction"
                      ? "bg-primary text-white rounded-r-xl"
                      : "text-foreground hover:text-gray-900 hover:bg-gray-50 rounded-r-xl"
                  }`}
                >
                  Transaction History
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "withdrawal" ? (
                <WithdrawalHistoryTable
                  data={mockWithdrawals}
                  handleRowClick={handleRowClick}
                />
              ) : (
                <TransactionHistoryTable
                  data={mockTransactions}
                  handleRowClick={handleRowClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <WithdrawalDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        details={selectedTransaction}
      />
    </div>
  );
};

export default CashWithdrawalPage;
