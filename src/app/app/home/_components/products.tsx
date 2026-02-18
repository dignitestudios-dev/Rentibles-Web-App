"use client";
import React from "react";
import SwiperProducts from "./swiper-products";
import { useProducts } from "@/src/lib/api/products";
import { useSearchParams } from "next/navigation";

const Products = () => {
  const searchParams = useSearchParams();

  const { data, isLoading, isError, error } = useProducts({
    categoryId: searchParams?.get("category") || undefined,
  });

  return <SwiperProducts products={data?.data} isLoading={isLoading} />;
};

export default Products;
