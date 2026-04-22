import React from "react";
import { Fragment } from "react";
import { IProductDetails, TimeSlot } from "@/src/types/index.type";

interface BookingSummaryProps {
  product: IProductDetails; // Replace with proper Product type if available
  quantity: number;
  selectionMode: "day" | "hour" | null;
  dateRange: { from?: Date; to?: Date } | undefined;
  timeSlots: TimeSlot[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  product,
  quantity,
  selectionMode,
  dateRange,
  timeSlots,
}) => {
  console.log("🚀 ~ BookingSummary ~ selectionMode:", selectionMode);
  console.log("🚀 ~ BookingSummary ~ dateRange:", dateRange);
  const totalAmount = (() => {
    if (selectionMode === "day" && dateRange?.from) {
      const from = dateRange.from;
      const to = dateRange.to ?? dateRange.from;
      const days =
        Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return product.pricePerDay * quantity * days;
    } else if (selectionMode === "hour" && timeSlots.length > 0) {
      const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
      const start = new Date(sorted[0].startEpoch * 1000);
      const end = new Date(sorted[sorted.length - 1].endEpoch * 1000);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const durationHours = Math.max(1, Math.ceil(hours));
      return product.pricePerHour * quantity * durationHours;
    }
    return 0;
  })();
  return (
    <>
      {/* Booking Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[
          {
            label: "Subtotal",
            value:
              selectionMode === "day"
                ? `$${product.pricePerDay.toFixed(2)}`
                : `$${product.pricePerHour.toFixed(2)}`,
          },
          {
            label: "Duration",
            value: (() => {
              if (selectionMode === "day" && dateRange?.from) {
                const from = dateRange.from;
                const to = dateRange.to ?? dateRange.from;
                const days =
                  Math.ceil(
                    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
                  ) + 1;
                return `${days} day${days === 1 ? "" : "s"}`;
              }
              if (selectionMode === "hour" && timeSlots.length > 0) {
                const sorted = [...timeSlots].sort(
                  (a, b) => a.startEpoch - b.startEpoch,
                );
                const start = new Date(sorted[0].startEpoch * 1000);
                const end = new Date(sorted[sorted.length - 1].endEpoch * 1000);
                const hours =
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return `${Math.max(1, Math.ceil(hours))} hour${
                  Math.ceil(hours) === 1 ? "" : "s"
                }`;
              }
              return "—";
            })(),
          },
          {
            label: "Date",
            value: (() => {
              if (selectionMode === "day" && dateRange?.from) {
                const from = dateRange.from;
                const to = dateRange.to ?? dateRange.from;
                const format = (date: Date) =>
                  new Intl.DateTimeFormat(undefined, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(date);
                return from.getTime() === to.getTime()
                  ? format(from)
                  : `${format(from)} - ${format(to)}`;
              }
              if (selectionMode === "hour" && timeSlots.length > 0) {
                const sorted = [...timeSlots].sort(
                  (a, b) => a.startEpoch - b.startEpoch,
                );
                const date = new Date(sorted[0].startEpoch * 1000);
                return new Intl.DateTimeFormat(undefined, {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(date);
              }
              return "—";
            })(),
          },
          {
            label: "Time",
            value: (() => {
              if (selectionMode === "hour" && timeSlots.length > 0) {
                const sorted = [...timeSlots].sort(
                  (a, b) => a.startEpoch - b.startEpoch,
                );
                const fmt = (epoch: number) =>
                  new Date(epoch * 1000).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                return `${fmt(sorted[0].startEpoch)} - ${fmt(
                  sorted[sorted.length - 1].endEpoch,
                )}`;
              }
              if (selectionMode === "day" && dateRange?.from) {
                const start = new Date(product.pickupTime * 1000); // convert seconds → ms
                const end = new Date(product.dropOffTime * 1000);

                const fmt = (date: Date) =>
                  date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                return `${fmt(start)} - ${fmt(end)}`;
              }

              return "—";
            })(),
          },
          {
            label: "Total Items",
            value: `${quantity}`,
          },
        ].map((item) => (
          <Fragment key={item.label}>
            <div>
              <p>{item.label}</p>
            </div>
            <div>
              <p className="text-foreground/50 dark:text-foreground/60">
                {item.value}
              </p>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-primary mt-2 font-semibold">
        <div>
          <p>Total Amount</p>
        </div>
        <div className="flex justify-end">
          <p>${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;
