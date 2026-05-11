"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTracking } from "@/src/lib/api/booking";
import OrdersTracking from "./_components/OrdersTracking";
import RentalsTabs from "./_components/RentalsTabs";
import Pagination from "@/src/components/common/Pagination";

export default function TrackingClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const activeTab = useMemo<"customer_rental" | "my_rentals">(
    () =>
      searchParams.get("tab") === "my_rentals"
        ? "my_rentals"
        : "customer_rental",
    [searchParams],
  );

  const type = activeTab === "customer_rental" ? "rental" : "own";
  const { data, isLoading, refetch } = useTracking({
    type,
    page: currentPage,
    limit: 90,
  });

  const handleTabChange = (tab: "customer_rental" | "my_rentals") => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", tab);
    params.set("type", tab === "customer_rental" ? "rental" : "own");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={data.pagination.currentPage}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
