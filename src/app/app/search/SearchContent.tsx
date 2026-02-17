"use client";

import React, { useState } from "react";
import { ArrowLeft, Search as SearchIcon, X, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../home/_components/product-card";
import StoreCard from "../home/_components/store-card";
import Image from "next/image";
import { useUsers } from "@/src/lib/api/user";
import { useDebounce } from "@/src/utils/helperFunctions";
import { useProducts, useStores } from "@/src/lib/api/products";
import { ProductSearch } from "@/public/images/export";
import { useMutation } from "@tanstack/react-query";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { ErrorToast } from "@/src/components/common/Toaster";
import { createWishlist } from "@/src/lib/query/queryFn";
import Loader from "@/src/components/common/Loader";

type Tab = "all" | "users" | "stores" | "products";

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "users", label: "Users" },
    { id: "stores", label: "Stores" },
    { id: "products", label: "Products" },
  ];

  const debouncedSearch = useDebounce(searchQuery, 500);
  const hasSearch = !!debouncedSearch?.trim();

  const {
    data: userData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMsg,
  } = useUsers({ search: debouncedSearch }, { enabled: hasSearch });

  const { data: productsData, isLoading: productsLoading } = useProducts(
    { search: debouncedSearch },
    { enabled: hasSearch },
  );

  const { data: storesData, isLoading: storesLoading } = useStores(
    { search: debouncedSearch },
    { enabled: hasSearch },
  );

  // Combine all data into a single state
  const combinedData = {
    users: userData?.data || [],
    products: productsData?.data || [],
    stores: storesData?.data || [],
  };

  const isLoading = usersLoading || productsLoading || storesLoading;
  const hasData =
    combinedData.users.length > 0 ||
    combinedData.products.length > 0 ||
    combinedData.stores.length > 0;

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Search</h1>

          <span />
        </div>
      </div>
      {/* Header */}

      <div className="flex-1 flex items-center gap-2 bg-muted px-4 mt-4 mb-2 py-2 rounded-lg">
        <SearchIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-10 bg-transparent outline-none text-foreground placeholder:text-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[calc(var(--navbar-height)+4rem)] z-30 bg-background border-b border-border">
        <div className="flex gap-2 px-4 py-2 md:px-6 overflow-x-auto scrollbar-light">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        // <div className="flex justify-center items-center w-full mt-28">
        //   <div className="text-center">
        //     <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        //     <p className="text-foreground">Loading...</p>
        //   </div>
        // </div>
        <Loader show={isLoading} />
      ) : hasData ? (
        <main className="p-4 md:p-6">
          {(activeTab === "all" || activeTab === "users") && (
            <div className="mb-12">
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Users</h3>
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={() => setActiveTab("users")}
                  >
                    See All
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {activeTab === "users"
                  ? combinedData.users?.map((user) => (
                      <Link
                        key={user._id}
                        href={`/app/users/${user._id}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card transition-colors cursor-pointer"
                      >
                        <div className="relative w-18 h-18 rounded-full">
                          <div className="w-full h-full rounded-full ring-4 ring-primary p-1 bg-white">
                            <Image
                              src={user.profilePicture ?? ""}
                              alt={user.name ?? "profile"}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-xl">
                            {user.name}
                          </h4>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    ))
                  : combinedData.users?.slice(0, 4)?.map((user) => (
                      <Link
                        key={user._id}
                        href={`/app/users/${user._id}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card transition-colors cursor-pointer"
                      >
                        <div className="relative w-18 h-18 rounded-full">
                          <div className="w-full h-full rounded-full ring-4 ring-primary p-1 bg-white">
                            <Image
                              src={user.profilePicture ?? ""}
                              alt={user.name ?? "profile"}
                              width={500}
                              height={500}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-xl">
                            {user.name}
                          </h4>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "stores") && (
            <div className="mb-12">
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Stores</h3>
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={() => setActiveTab("stores")}
                  >
                    See All
                  </button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {activeTab === "stores"
                  ? combinedData.stores?.map((store) => (
                      <StoreCard key={store._id} store={store} />
                    ))
                  : combinedData.stores
                      ?.slice(0, 3)
                      ?.map((store) => (
                        <StoreCard key={store._id} store={store} />
                      ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "products") && (
            <div>
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Products</h3>
                  <button
                    className="text-primary hover:underline text-sm"
                    onClick={() => setActiveTab("products")}
                  >
                    See All
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeTab === "products"
                  ? combinedData.products?.map((p) => (
                      <ProductCard
                        key={p._id}
                        product={p}
                        isLiked={
                          wishlistItems[p._id || ""] ?? p.isLiked ?? false
                        }
                        handleWishlist={() =>
                          onWishlist(
                            p._id || "",
                            wishlistItems[p._id || ""] ?? p.isLiked ?? false,
                          )
                        }
                        isLoading={wishlistMutation.isPending}
                      />
                    ))
                  : combinedData.products
                      ?.slice(0, 8)
                      ?.map((p) => (
                        <ProductCard
                          key={p._id}
                          product={p}
                          isLiked={
                            wishlistItems[p._id || ""] ?? p.isLiked ?? false
                          }
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
            </div>
          )}
        </main>
      ) : (
        <div className="flex justify-center items-center w-full mt-28">
          <div className="flex flex-col justify-center items-center">
            <Image src={ProductSearch} alt="Product_Search" className="w-48" />
            <p className="text-foreground mt-2">Search Here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchContent;
