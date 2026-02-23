"use client";

import React, { useState } from "react";
import ProductCard from "./product-card";
import Link from "next/link";
import Image from "next/image";
import { NoDataFound } from "@/public/images/export";
import { useMutation } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";

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

  // Track wishlist state locally
  const [wishlistItems, setWishlistItems] = useState<{
    [key: string]: boolean;
  }>({});

  const wishlistMutation = useMutation({
    mutationFn: async (payload: { productId: string; value: boolean }) => {
      const formData = {
        productId: payload.productId,
        value: payload.value,
      };
      return createWishlist(formData);
    },
    onSuccess: (data, variables) => {
      // Update local state on success
      setWishlistItems((prev) => ({
        ...prev,
        [variables.productId]: variables.value,
      }));
      console.log("Wishlist updated successfully");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Failed to update wishlist");
      ErrorToast(message);
    },
  });

  const onWishlist = (productId: string, currentLiked: boolean) => {
    const newValue = !currentLiked;
    wishlistMutation.mutate({
      productId,
      value: newValue,
    });
  };

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
        <>
          <div className="grid grid-cols-4 gap-5">
            {products.length > 0 &&
              products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  isLiked={wishlistItems[p._id || ""] ?? p.isLiked ?? false}
                  handleWishlist={() =>
                    onWishlist(
                      p._id || "",
                      wishlistItems[p._id || ""] ?? p.isLiked ?? false,
                    )
                  }
                  isLoading={wishlistMutation.isPending}
                />
              ))}
          </div>
          {products.length === 0 && (
            <div className="flex justify-center items-center w-full mt-10">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={NoDataFound}
                  alt="Product_Search"
                  className="w-48"
                />
                <p className="text-foreground mt-2">No Products Available</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SwiperProducts;
