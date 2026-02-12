"use client";
import React from "react";
import SwiperProducts from "./swiper-products";
import { useProducts } from "@/src/lib/api/products";

const Products = () => {
  const { data, isLoading, isError, error } = useProducts();

  return <SwiperProducts products={data?.data} isLoading={isLoading} />;
};

export default Products;
