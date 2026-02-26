"use client";
import React, { Suspense, use, useEffect, useState } from "react";
import SwiperProducts from "./swiper-products";
import { useProducts } from "@/src/lib/api/products";
import { useSearchParams } from "next/navigation";

const Products = () => {
  const searchParams = useSearchParams();
  const [latLong, setLatLong] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setLatLong({ lat: latitude, lng: longitude });
    });
  }, []);

  const { data, isLoading, isError, error } = useProducts({
    categoryId: searchParams?.get("category") || undefined,
    latitude: latLong?.lat,
    longitude: latLong?.lng,
  });

  return <SwiperProducts products={data?.data} isLoading={isLoading} />;
};

export default Products;
