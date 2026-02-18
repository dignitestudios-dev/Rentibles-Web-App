"use client";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Categories from "../home/_components/categories";
import ProductCard from "../home/_components/product-card";
import { useProducts } from "@/src/lib/api/products";
import Image from "next/image";
import { NoDataFound } from "@/public/images/export";
import { useMutation } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";
import Loader from "@/src/components/common/Loader";

const ProductsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get selected category from URL params
  const selectedCategory = searchParams?.get("category");

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProducts({
    categoryId: selectedCategory || undefined,
  });

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

  const handleProductClick = (productId: string) => {
    router.push(`/app/products/${productId}`);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Products</h1>

          <button
            onClick={() => router.push("/app/search")}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* Categories Section */}
        <Categories />

        {isLoading ? (
          <Loader show={isLoading} />
        ) : (
          <>
            {/* Products Grid */}
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products?.data?.map((product) => (
                  <div
                    key={product?._id}
                    onClick={() => handleProductClick(product?._id)}
                  >
                    <ProductCard
                      product={product}
                      isLiked={
                        wishlistItems[product?._id || ""] ??
                        product?.isLiked ??
                        false
                      }
                      handleWishlist={() =>
                        onWishlist(
                          product?._id || "",
                          wishlistItems[product?._id || ""] ??
                            product?.isLiked ??
                            false,
                        )
                      }
                      isLoading={wishlistMutation.isPending}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {products?.data?.length === 0 && (
                <div className="flex justify-center items-center w-full mt-10">
                  <div className="flex flex-col justify-center items-center">
                    <Image
                      src={NoDataFound}
                      alt="Product_Search"
                      className="w-48"
                    />
                    <p className="text-foreground mt-2">
                      No Products Available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsContent;
