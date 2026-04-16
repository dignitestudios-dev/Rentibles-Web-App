"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTracking } from "@/src/lib/api/booking";
import OrdersTracking from "./_components/OrdersTracking";
import RentalsTabs from "./_components/RentalsTabs";

const Tracking = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = useMemo<"customer_rental" | "my_rentals">(() => {
    return searchParams.get("tab") === "my_rentals"
      ? "my_rentals"
      : "customer_rental";
  }, [searchParams]);

  const type = activeTab === "customer_rental" ? "rental" : "own";
  const { data, isLoading, refetch } = useTracking({ type });

  const handleTabChange = (tab: "customer_rental" | "my_rentals") => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", tab);
    params.set("type", tab === "customer_rental" ? "rental" : "own");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
  };

  return (
    <div>
      <RentalsTabs activeTab={activeTab} onChange={handleTabChange} />
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
