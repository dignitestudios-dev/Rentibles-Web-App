"use client";

import { formatDateToMMDDYYYY } from "@/src/utils/helperFunctions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportBookingItem } from "@/src/types/index.type";
import Image from "next/image";
import Link from "next/link";
import { DummyAvatar } from "@/public/images/export";

interface ReportDetailsModalProps {
  report: ReportBookingItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  open,
  onOpenChange,
}) => {
  if (!report) {
    return null;
  }

  const reportBy =
    report.reportedByUser?.name || report.reportedByStore?.name || "Unknown";
  const reportedAt = new Date(report.createdAt);
  const reportDate = formatDateToMMDDYYYY(report.createdAt);
  const reportTime = reportedAt.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const profileHref = report.reportedByUser?.id
    ? `/app/users/${report.reportedByUser.id}`
    : report.reportedByStore?._id
      ? `/app/store/${report.reportedByStore._id}`
      : "#";

  const productImageSrc = report?.booking?.product?.cover
    ? String(report.booking.product.cover)
    : DummyAvatar;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Report Details
          </DialogTitle>
          {/* <DialogDescription>
            View the full report details and metadata for this product issue.
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="border-b-2 border-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={report.reportedByUser?.profilePicture || DummyAvatar}
                  alt={`${reportBy} profile picture`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-sm font-semibold text-foreground">
                  {reportBy}
                </p>
              </div>
              <Link href={profileHref}>
                <Button variant="default" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
          {/* <div className="rounded-xl border border-border bg-muted p-4">
            <p className="text-sm text-foreground/70">Reported User/Store</p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {reportedUserOrStore}
            </p>
          </div> */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <div>
                <Image
                  src={productImageSrc}
                  alt={`${report.booking.product.name} profile picture`}
                  width={100}
                  height={60}
                  className="rounded-md object-cover"
                  unoptimized={
                    typeof productImageSrc === "string" &&
                    productImageSrc.startsWith("https")
                  }
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/70">
                  Product Name:
                </p>
                <p className="mt-2 text-sm text-destructive">
                  {report.booking.product.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="mt-2 text-sm text-foreground/60">
                    {reportDate}
                  </p>
                  <p className="mt-2 text-sm  text-foreground/60">
                    {reportTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-foreground/70">Booking Code</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {report.booking.shortCode}
              </p>
            </div>
          </div> */}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-foreground/70">Issue Title</p>
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {report.title}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-foreground/70">Details</p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {report.description}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
