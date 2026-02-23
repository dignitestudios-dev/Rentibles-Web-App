"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ProductCard from "../../home/_components/product-card";
import { useAppSelector } from "@/src/lib/store/hooks";
import { useProducts } from "@/src/lib/api/products";
import Image from "next/image";
import { NoDataFound } from "@/public/images/export";
// import { CATEGORIES } from "../../home/_components/categories";

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const { categories: CATEGORIES } = useAppSelector(
    (state) => state.categories,
  );

  const category = CATEGORIES.find((c) => c._id === id) ?? { name: "Category" };
  const { data, isLoading, isError, error } = useProducts({ categoryId: id });
  console.log("🚀 ~ CategoryDetailsPage ~ data:", data?.data);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold">
            {category.name}
          </h1>

          <div className="w-10" />
        </div>
      </div>

      <main className="p-4 md:p-6">
        <>
          {data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data?.data?.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  handleWishlist={() => {}}
                />
              ))}
            </div>
          ) : (
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
      </main>
    </div>
  );
}
