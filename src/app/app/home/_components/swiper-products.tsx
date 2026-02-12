"use client";

import React from "react";
import ProductCard from "./product-card";
import Link from "next/link";

type Product = {
  _id: string;
  name?: string;
  cover?: string;
  category?: { _id?: string; name?: string };
  pricePerDay?: number;
  pricePerHour?: number;
  productReview?: number;
  isLiked?: boolean;
};

interface SwiperProductsProps {
  products?: Product[];
  isLoading: boolean;
}

const SwiperProducts: React.FC<SwiperProductsProps> = ({
  products = [],
  isLoading,
}) => {
  const productCount = products.length || 8;

  return (
    <div className="my-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl mb-4">Products</h2>
        <Link href={"/app/products"} className="text-primary hover:underline">
          See All
        </Link>
      </div>

      {isLoading ? (
        <p>loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {products.length > 0
            ? products.map((p) => <ProductCard key={p._id} product={p} />)
            : Array.from({ length: productCount }).map((_, index) => (
                <ProductCard key={index} />
              ))}
        </div>
      )}
    </div>
  );
};

export default SwiperProducts;
