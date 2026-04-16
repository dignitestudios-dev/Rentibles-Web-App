"use client";
import { useEffect, useState } from "react";
import SwiperProducts from "./swiper-products";
import { useProducts } from "@/src/lib/api/products";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLocationSuccess } from "@/src/lib/store/feature/locationSlice";
import { RootState } from "@/src/lib/store";
import Pagination from "@/src/components/common/Pagination";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [pageState, setPageState] = useState<{
    category: string | null;
    page: number;
  }>({
    category: searchParams?.get("category") || null,
    page: 1,
  });
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );

  useEffect(() => {
    // only request browser geolocation if we don't already have coordinates
    if (latitude === null || longitude === null) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocationSuccess({ latitude, longitude }));
      });
    }
  }, [dispatch, latitude, longitude]);

  const selectedCategory = searchParams?.get("category") || null;
  const currentPage =
    pageState.category === selectedCategory ? pageState.page : 1;

  const { data, isLoading } = useProducts({
    categoryId: selectedCategory || undefined,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const handlePageChange = (page: number) => {
    setPageState({
      category: selectedCategory,
      page,
    });
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <SwiperProducts
        products={data?.data}
        isLoading={isLoading}
        pagination={data?.pagination}
      />
      {data?.pagination?.totalPages && data.pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Products;
