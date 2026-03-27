"use client";

import React, { useState } from "react";
import ProductCard from "./product-card";
import Link from "next/link";
import Image from "next/image";
import { NoDataFound } from "@/public/images/export";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";
import { useRequireLogin } from "@/src/hooks/useRequireLogin";

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
  const { requireLogin } = useRequireLogin();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productById"] });
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Failed to update wishlist");
      ErrorToast(message);
    },
  });

  const onWishlist = (productId: string, currentLiked: boolean) => {
    const newValue = !currentLiked;
    requireLogin({
      onAuthenticated: () => {
        wishlistMutation.mutate({
          productId,
          value: newValue,
        });
      },
    });
  };

  const ProductSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border p-3 space-y-3">
      {/* Image */}
      <div className="w-full h-40 bg-gray-200 rounded-lg" />

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4" />

      {/* Category */}
      <div className="h-3 bg-gray-200 rounded w-1/2" />

      {/* Price */}
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
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
       <div className="grid grid-cols-4 gap-5">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
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
