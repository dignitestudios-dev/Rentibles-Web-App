"use client";
import { useState } from "react";
import { useTracking } from "@/src/lib/api/booking";
import OrdersTracking from "./_components/OrdersTracking";
import RentalsTabs from "./_components/RentalsTabs";

const Tracking = () => {
  const [activeTab, setActiveTab] = useState<"customer_rental" | "my_rentals">(
    "customer_rental",
  );
  const type = activeTab === "customer_rental" ? "rental" : "own";
  const { data, isLoading,refetch } = useTracking({ type });

  return (
    <div>
      <RentalsTabs activeTab={activeTab} onChange={setActiveTab} />
      <OrdersTracking
        bookings={data?.data || []}
        isLoading={isLoading}
        type={activeTab}
        refetch={refetch}
      />
    </div>
  );
};

export default Tracking;
