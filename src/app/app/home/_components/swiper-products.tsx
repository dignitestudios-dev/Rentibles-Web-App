"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import StoreCard from "./store-card";
import ProductCard from "./product-card";

const SwiperProducts = ({ storeCount = 8 }) => {
  return (
    <div className="my-5">
      <h2 className="font-semibold text-2xl mb-4">Products</h2>

      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: storeCount }).map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default SwiperProducts;
