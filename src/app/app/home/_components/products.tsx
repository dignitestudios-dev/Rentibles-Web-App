"use client";
import { useEffect } from "react";
import SwiperProducts from "./swiper-products";
import { useProducts } from "@/src/lib/api/products";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLocationSuccess } from "@/src/lib/store/feature/locationSlice";
import { RootState } from "@/src/lib/store";

const Products = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      dispatch(setLocationSuccess({ latitude, longitude }));
    });
  }, [dispatch]);

  const { data, isLoading } = useProducts({
    categoryId: searchParams?.get("category") || undefined,
    latitude: latitude || undefined,
    longitude: longitude || undefined,
  });

  return <SwiperProducts products={data?.data} isLoading={isLoading} />;
};

export default Products;
