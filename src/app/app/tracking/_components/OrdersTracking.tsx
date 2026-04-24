"use client";

import { useMemo } from "react";
import RentalCard from "./RentalCards";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TrackingBooking } from "@/src/types/index.type";

export const TrackingFilter = [
  { _id: "all", name: "All" },
  { _id: "pending", name: "Pending" },
  { _id: "in-progress", name: "In-Progress" },
  { _id: "incomplete", name: "Incomplete" },
  { _id: "over-due", name: "Over-Due" },
  { _id: "completed", name: "Completed" },
  { _id: "cancelled", name: "Cancelled" },
  { _id: "rejected", name: "Rejected" },
];

const statusMap: Record<
  string,
  | "Completed"
  | "Incomplete"
  | "Pending"
  | "In Progress"
  | "Over Due"
  | "Cancelled"
  | "Rejected"
> = {
  completed: "Completed",
  incomplete: "Incomplete",
  pending: "Pending",
  "in-progress": "In Progress",
  "over-due": "Over Due",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

interface OrdersTrackingProps {
  bookings: TrackingBooking[];
  isLoading: boolean;
  type: "customer_rental" | "my_rentals";
  refetch: () => void;
}

const OrdersTracking: React.FC<OrdersTrackingProps> = ({
  bookings,
  isLoading,
  type,
  refetch,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeFilter = useMemo(() => {
    const state = searchParams.get("state");

    if (state && TrackingFilter.some((filter) => filter._id === state)) {
      return state;
    }

    return "all";
  }, [searchParams]);

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  const handleRedirect = (id: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("type", type);
    const query = params.toString();

    router.push(`/app/tracking/${id}${query ? `?${query}` : ""}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto my-6">
        {TrackingFilter.map((filter) => (
          <button
            key={filter._id}
            onClick={() => {
              const params = new URLSearchParams(
                searchParams?.toString() ?? "",
              );

              params.set("state", filter._id);
              params.set("type", type);

              const query = params.toString();
              const url = query ? `${pathname}?${query}` : pathname;

              router.replace(url);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              ${
                activeFilter === filter._id
                  ? "bg-orange-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredBookings.length
          ? filteredBookings.map((booking) => {
              // ✅ Convert epoch → Date
              const bookingDateObj = new Date(booking.bookingDate * 1000);

              // ✅ Format Date
              const formattedDate = bookingDateObj.toLocaleDateString(
                undefined,
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              );

              // ✅ Format Time
              const formattedTime = bookingDateObj.toLocaleTimeString(
                undefined,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <RentalCard
                  key={booking._id}
                  bookingId={booking._id}
                  userName={
                    type === "customer_rental"
                      ? booking.customer.name
                      : booking?.store
                        ? booking?.store?.name
                        : booking?.user?.name
                  }
                  userAvatar={
                    type === "customer_rental"
                      ? booking.customer.profilePicture
                      : booking?.store
                        ? booking?.store?.profilePicture
                        : booking?.user?.profilePicture
                  }
                  productImage={booking?.product?.cover}
                  title={booking.product.name}
                  price={booking.totalAmount}
                  duration={booking.duration}
                  status={statusMap[booking.status] || "Pending"}
                  qty={booking.quantity}
                  date={formattedDate}
                  time={formattedTime}
                  pickupTime={booking.pickupTime}
                  dropOffTime={booking.dropOffTime}
                  handleRedirect={() => handleRedirect(booking._id)}
                  id={
                    type === "customer_rental"
                      ? booking.customer._id
                      : booking?.store
                        ? booking?.store?._id
                        : booking?.user?._id
                  }
                  type={type}
                  refetch={refetch}
                />
              );
            })
          : null}
      </div>
      {filteredBookings.length === 0 && (
        <p className="text-muted-foreground mt-10 text-center col-span-full">
          No bookings found
        </p>
      )}
    </div>
  );
};

export default OrdersTracking;
