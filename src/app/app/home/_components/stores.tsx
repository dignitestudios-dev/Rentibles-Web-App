"use client";
import React from "react";
import SwiperStores from "./swiper-stores";
import { useStores } from "@/src/lib/api/products";

const Stores = () => {
  const { data, isLoading, isError, error } = useStores();

  return <SwiperStores stores={data?.data} isLoading={isLoading} />;
};

export default Stores;
