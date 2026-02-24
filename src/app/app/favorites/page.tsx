"use client";
import React, { useState } from "react";
import ProductCard from "../home/_components/product-card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useWishlist } from "@/src/lib/api/products";
import Loader from "@/src/components/common/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";

const FavoritePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: wishlistResponse, isLoading, error } = useWishlist();

  const allProducts = wishlistResponse?.data || [];

  const handleProductClick = (productId: string) => {
    router.push(`/app/products/${productId}`);
  };

  const wishlistMutation = useMutation({
    mutationFn: async (payload: { productId: string; value: boolean }) => {
      const formData = {
        productId: payload.productId,
        value: payload.value,
      };
      return createWishlist(formData);
    },
    onSuccess: (data, variables) => {
      console.log("🚀 ~ FavoritePage ~ variables:", variables);
      console.log("🚀 ~ FavoritePage ~ data:", data);
      // Update local state on success
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

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

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader show={isLoading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load wishlist</p>
          <p className="text-gray-500 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Favorite Page</h1>
          <div></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
            >
              <ProductCard
                product={{
                  ...product,
                  isLiked: product.isLiked,
                }}
                handleWishlist={() =>
                  onWishlist(product._id || "", product.isLiked ?? false)
                }
                isLoading={wishlistMutation.isPending}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No products found in favorites
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
