"use client";

import { useState } from "react";
import RentalCard from "./RentalCards";
import { formatDateToMMDDYYYY } from "@/src/utils/helperFunctions";
import { useRouter } from "next/navigation";

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

export const dummyBookings = [
  {
    _id: "1",
    shortCode: "YHZ-224097",
    quantity: 1,
    totalAmount: 20,
    duration: "4 hrs",
    status: "completed",
    bookingDate: 1769598000,
    user: {
      name: "Jason Armstrong",
      profilePicture:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/ba16792f-b635-4fda-a934-cd5b09ab7269.jpg",
    },
    product: {
      name: "Rubik's Cube",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8d51cfe4-e23f-4070-9cf5-58f82cd7d6e9.jpg",
    },
  },
  {
    _id: "2",
    shortCode: "THH-236618",
    quantity: 1,
    totalAmount: 8,
    duration: "4 hrs",
    status: "incomplete",
    bookingDate: 1768557600,
    user: {
      name: "Store Test",
      profilePicture:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
    },
    product: {
      name: "Test Product",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/856978f4-f95e-4f90-a77c-c5cbdb43f924.png",
    },
  },
];

const statusMap: Record<string, "Completed" | "Incomplete" | "Pending"> = {
  completed: "Completed",
  incomplete: "Incomplete",
  pending: "Pending",
  "in-progress": "Pending",
  "over-due": "Incomplete",
};

const OrdersTracking = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredBookings =
    activeFilter === "all"
      ? dummyBookings
      : dummyBookings.filter((booking) => booking.status === activeFilter);

  const handleRedirect = (id: string) => {
    router.push(`/app/tracking/${id}`);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto mb-6">
        {TrackingFilter.map((filter) => (
          <button
            key={filter._id}
            onClick={() => setActiveFilter(filter._id)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBookings.map((booking) => (
          <RentalCard
            key={booking._id}
            userName={booking.user.name}
            userAvatar={booking.user.profilePicture}
            productImage={booking.product.cover}
            title={booking.product.name}
            price={booking.totalAmount}
            hours={parseInt(booking.duration)}
            status={statusMap[booking.status]}
            qty={booking.quantity}
            date={formatDateToMMDDYYYY(booking.bookingDate)}
            handleRedirect={() => handleRedirect(booking._id)}
          />
        ))}
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
