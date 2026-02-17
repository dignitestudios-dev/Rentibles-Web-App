"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import CategoryCard from "../../../home/_components/category-card";
import ProductCard from "../../../home/_components/product-card";
// import { CATEGORIES } from "../../../home/_components/categories";
import Link from "next/link";
import { useAppSelector } from "@/src/lib/store/hooks";
import { useStoreById } from "@/src/lib/api/store";
import { useCategories, useProducts } from "@/src/lib/api/products";
import { useMutation } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";

const StoreDetailsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const storeId = params.id as string;

  // const { categories } = useAppSelector((state) => state.categories);

  const selectedCategoryId = searchParams?.get("category") ?? "all";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (id === "all") {
      params.delete("category");
    } else {
      if (params.get("category") === id) {
        params.delete("category");
      } else {
        params.set("category", id);
      }
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
  };

  const { data: stores, isLoading, isError, error } = useStoreById(storeId);
  const { data: products, isLoading: productsLoading } = useProducts(
    {
      storeId,
      categoryId: selectedCategoryId !== "all" ? selectedCategoryId : undefined,
    },
    { enabled: true },
  );

  const { data: categories } = useCategories();

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

  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  return (
    <div className="">
      <div className="sticky top-0">
        <div className="relative flex flex-col min-h-72 md:min-h-92 h-fit">
          <div className="absolute inset-0">
            {!coverLoaded && (
              <div className="absolute inset-0 bg-card animate-pulse" />
            )}

            <Image
              src={stores?.data?.coverPicture ?? ""}
              alt="cover"
              width={1000}
              height={1000}
              onLoadingComplete={() => setCoverLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${coverLoaded ? "opacity-100" : "opacity-0"}`}
            />

            {coverLoaded && (
              <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/95" />
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 z-40 bg-white/20 backdrop-blur-sm text-white p-2 rounded-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 top-4 text-white text-xl font-semibold">
            Store Details
          </h2>

          <div className="relative z-20 h-full flex-1 flex flex-col justify-end p-5">
            <div className="flex items-center gap-5 text-white">
              <div className="w-20 h-20 rounded-full p-1 bg-white ring-4 ring-primary relative overflow-hidden">
                {!profileLoaded && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
                )}

                <Image
                  src={stores?.data?.profilePicture ?? ""}
                  alt="profile"
                  width={1000}
                  height={1000}
                  onLoadingComplete={() => setProfileLoaded(true)}
                  className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              <div>
                <div className="text-2xl font-semibold">
                  {stores?.data?.name}
                </div>
                <div className="opacity-90">{stores?.data?.email}</div>
              </div>
            </div>

            <div className="mt-6 mb-12">
              <div className="flex items-center gap-6 text-white text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{stores?.data?.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{stores?.data?.phone}</span>
                </div>
              </div>

              <p className="mt-4 text-gray-300">
                {stores?.data?.description &&
                  (stores?.data?.description?.length > 680
                    ? `${stores?.data?.description.slice(0, 680)}...`
                    : stores?.data?.description)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-10">
        <div className="bg-background rounded-t-[42px] pt-8 pb-12 px-6">
          <h3 className="text-2xl font-semibold mb-4">Categories</h3>

          <div className="flex gap-3 overflow-x-auto py-2 mb-6 scrollbar-light">
            {categories?.data?.map((cat) => (
              <div key={cat._id} className="shrink-0">
                <CategoryCard
                  category={{
                    _id: cat._id,
                    name: cat.name,
                    cover: "",
                    createdAt: "",
                    updatedAt: "",
                  }}
                  selected={cat._id === selectedCategoryId}
                  onClick={() => handleSelect(cat._id)}
                />
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Products</h3>

          <div className="grid grid-cols-4 gap-4">
            {products?.data?.map((p) => (
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsContent;
