"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/src/components/common/Loader";
import { useAppSelector } from "@/src/lib/store/hooks";
import { useReportBookings } from "@/src/lib/api/booking";
import ReportDetailsModal from "./_components/ReportDetailsModal";
import { ReportBookingItem } from "@/src/types/index.type";

type ProductIssuesTab = "customer" | "my";

const ProductIssues = () => {
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<ProductIssuesTab>("customer");
  const [selectedReport, setSelectedReport] =
    useState<ReportBookingItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { data: reportData, isLoading, isError, error } = useReportBookings();

  const reports = reportData?.data ?? [];

  const currentTabReports =
    activeTab === "my" && currentUser?._id
      ? reports.filter(
          (report) => report.reportedByUser?.id === currentUser._id,
        )
      : reports.filter(
          (report) => report.reportedByUser?.id !== currentUser?._id,
        );

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

          <h1 className="text-lg font-semibold">Product Issues</h1>
          <div />
        </div>
      </div>

      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Product Issues
            </h1>
            {/* <p className="text-foreground/70 mt-1">
              Submit or view product issue reports in a consistent dashboard
              layout.
            </p> */}
          </div>

          <div className="rounded-lg overflow-hidden bg-background">
            <div className="m-2 border-2 rounded-2xl">
              <div className="flex m-1">
                <button
                  onClick={() => setActiveTab("customer")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "customer"
                      ? "bg-primary text-white rounded-l-xl"
                      : "text-foreground hover:text-foreground/90 hover:bg-foreground/5 rounded-l-xl"
                  }`}
                >
                  Customer Reports
                </button>
                <button
                  onClick={() => setActiveTab("my")}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === "my"
                      ? "bg-primary text-white rounded-r-xl"
                      : "text-foreground hover:text-foreground/90 hover:bg-foreground/5 rounded-r-xl"
                  }`}
                >
                  My Reports
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-lg font-semibold">
                    {activeTab === "customer"
                      ? "Customer Reports"
                      : "My Reports"}
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl ">
                {isLoading ? (
                  <div className="py-12">
                    <Loader show={true} />
                  </div>
                ) : isError ? (
                  <div className="px-4 py-8 text-sm text-destructive">
                    {(error as Error)?.message ?? "Unable to load report data."}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="">
                        <th className="text-left py-4 text-sm font-semibold text-foreground/70">
                          User/Store Profile
                        </th>
                        <th className="text-left py-4 text-sm font-semibold text-foreground/70">
                          Product Name
                        </th>
                        <th className="text-left py-4 text-sm font-semibold text-foreground/70">
                          Issue Title
                        </th>
                        <th className="text-left py-4 text-sm font-semibold text-foreground/70">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTabReports.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-sm text-foreground/70"
                          >
                            No reports available for this tab yet.
                          </td>
                        </tr>
                      ) : (
                        currentTabReports.map((report) => {
                          const profileName =
                            report.reportedByUser?.name ||
                            report.reportedByStore?.name ||
                            report.booking.product.user?.name ||
                            "N/A";

                          return (
                            <tr key={report._id} className="">
                              <td className="py-4 ">
                                <span className="text-sm text-foreground">
                                  {profileName}
                                </span>
                              </td>
                              <td className="py-4 ">
                                <span className="text-sm text-foreground">
                                  {report.booking.product.name}
                                </span>
                              </td>
                              <td className="py-4 ">
                                <span className="text-sm text-foreground">
                                  {report.title}
                                </span>
                              </td>
                              <td className="py-4 ">
                                <span className="text-sm text-foreground">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setIsDetailsOpen(true);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReportDetailsModal
        report={selectedReport}
        open={isDetailsOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedReport(null);
          }
          setIsDetailsOpen(open);
        }}
      />
    </div>
  );
};

export default ProductIssues;
