"use client";
import { useState } from "react";
import { ArrowLeft, FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
import BalanceCard from "./_components/BalanceCard";
import WithdrawalHistoryTable from "./_components/WithdrawalHistoryTable";
import TransactionHistoryTable from "./_components/TransactionHistoryTable";
import {
  TabType,
  TransactionRecord,
  TransactionStatus,
  WithdrawalDetails,
} from "@/src/types/index.type";
import useBalance, { usePayouts } from "@/src/lib/api/balance";
import Loader from "@/src/components/common/Loader";
import WithdrawalDetailsModal from "./_components/WithdrawalDetailsModal";
import DateFilter from "@/src/components/common/DateFilter";
import WithdrawModal from "./_components/WithdrawModal";
import { generatePayoutsPDF } from "./_components/PayoutsPDF";

// balance will be fetched from API via useBalance

const CashWithdrawalPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] =
    useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WithdrawalDetails | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("withdrawal");
  const { data: balanceResponse, isLoading: balanceLoading } = useBalance();

  const [payoutParams, setPayoutParams] = useState<
    | {
        startDate?: number;
        endDate?: number;
        threshold?: number;
      }
    | undefined
  >(undefined);

  const { data: payoutsResponse, isLoading: payoutsLoading } =
    usePayouts(payoutParams);

  const availableAmount = balanceResponse?.data?.availableBalance?.amount ?? 0;
  const pendingAmount = balanceResponse?.data?.pendingBalance?.amount ?? 0;
  const currency = (
    balanceResponse?.data?.availableBalance?.currency ?? "USD"
  ).toUpperCase();

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleRowClick = (record: TransactionRecord) => {
    const details: WithdrawalDetails = {
      id: record.id,
      amount: record.amount,
      currency: "USD",
      referenceId: record.id,
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

  const handleFilterChange = (filterData: {
    startDate: string;
    endDate: string;
  }) => {
    if (filterData.startDate && filterData.endDate) {
      const start = Math.floor(
        new Date(filterData.startDate + "T00:00:00").getTime() / 1000,
      );
      const end = Math.floor(
        new Date(filterData.endDate + "T23:59:59").getTime() / 1000,
      );
      setPayoutParams({
        startDate: start,
        endDate: end,
        threshold: 10,
      });
    } else {
      setPayoutParams(undefined);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const payouts = payoutsResponse?.data || [];
      if (payouts.length === 0) {
        alert("No payout data available to download");
        return;
      }
      await generatePayoutsPDF(payouts, currency);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download payout report");
    }
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
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Wallet
            </h1>
            <p className="text-foreground/70 mt-1">
              Manage your funds and view transaction history
            </p>
          </div>

          {/* Balance Cards */}
          {balanceLoading ? (
            <div className="mb-8">
              <Loader show={true} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <BalanceCard
                title="Available Balance"
                amount={availableAmount}
                currency={currency}
                type="available"
              />
              <BalanceCard
                title="Pending Balance"
                amount={pendingAmount}
                currency={currency}
                type="pending"
              />
            </div>
          )}

          {/* Withdraw Button */}
          {availableAmount > 0 && (
            <div className="mb-8">
              <button
                onClick={handleWithdraw}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-accent rounded-lg hover:bg-primary/80 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                {/* <ArrowDownToLine className="w-5 h-5" /> */}
                Withdraw Funds
              </button>
            </div>
          )}

          {/* Tabs Section */}
          <div className=" rounded-lg overflow-hidden ">
            {/* Tab Headers */}
            <div className="m-2 border-2 rounded-2xl">
              <div className="flex m-1">
                <button
                  onClick={() => setActiveTab("withdrawal")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "withdrawal"
                      ? "bg-primary text-white rounded-l-xl"
                      : "text-foreground hover:text-foreground/90 hover:bg-foreground/5 rounded-l-xl"
                  }`}
                >
                  Withdrawal History
                </button>
                <button
                  onClick={() => setActiveTab("transaction")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "transaction"
                      ? "bg-primary text-white rounded-r-xl"
                      : "text-foreground hover:text-foreground/90 hover:bg-foreground/5 rounded-r-xl"
                  }`}
                >
                  Transaction History
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <div className="flex justify-between items-center w-full px-4">
                  <h1 className="text-lg font-semibold">
                    {activeTab === "withdrawal"
                      ? "Withdrawal History"
                      : "Transaction History"}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={
                        payoutsLoading || !payoutsResponse?.data?.length
                      }
                      className="bg-primary/20 p-1.5 rounded-md hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download payout report as PDF"
                    >
                      <FileDown className="text-primary" />
                    </button>

                    <DateFilter onFilterChange={handleFilterChange} />
                  </div>
                </div>
                {payoutsLoading ? (
                  <div className="py-8">
                    <Loader show={true} />
                  </div>
                ) : (
                  (() => {
                    const payouts = payoutsResponse?.data || [];

                    const mappedWithdrawals = payouts.map((p) => ({
                      id: p._id,
                      date: new Date(p.date * 1000).toISOString(),
                      status: p.status as TransactionStatus,
                      amount: p.amount,
                      type: "debit" as const,
                    }));

                    const mappedTransactions = payouts.map((p) => ({
                      id: p._id,
                      date: new Date(p.date * 1000).toISOString(),
                      status: p.status as TransactionStatus,
                      amount: p.amount,
                      type: "debit" as const,
                    }));

                    return activeTab === "withdrawal" ? (
                      <WithdrawalHistoryTable
                        data={mappedWithdrawals}
                        handleRowClick={handleRowClick}
                        onFilterChange={(val) => {
                          if (val.startDate && val.endDate) {
                            const start = Math.floor(
                              new Date(val.startDate + "T00:00:00").getTime() /
                                1000,
                            );
                            const end = Math.floor(
                              new Date(val.endDate + "T23:59:59").getTime() /
                                1000,
                            );
                            setPayoutParams({
                              startDate: start,
                              endDate: end,
                              threshold: 10,
                            });
                          } else {
                            setPayoutParams(undefined);
                          }
                        }}
                      />
                    ) : (
                      <TransactionHistoryTable
                        data={mappedTransactions}
                        handleRowClick={handleRowClick}
                      />
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WithdrawalDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        details={selectedTransaction}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={availableAmount}
      />
    </div>
  );
};

export default CashWithdrawalPage;
