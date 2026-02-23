"use client";

import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { CATEGORIES } from "../home/_components/categories";

import Link from "next/link";
import { useCategories, useSubCategories } from "@/src/lib/api/products";

const CategoriesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

  const { data, isLoading, isError, error } = useCategories();

  // default to HOME & LIVING when no query param
  const defaultCategory = data?.data?.[6]?._id ?? "";
  const selectedCategory = searchParams?.get("category") ?? defaultCategory;

  // Filter out "All" category for the sidebar
  const categoriesList = data?.data?.filter((cat) => cat._id !== "all");
  const {
    data: subCategoriesData,
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
    error: subCategoriesError,
  } = useSubCategories(selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Categories</h1>

          <span />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 md:py-8">
        {/* Left Sidebar - Categories with Orange Background */}
        <div className="md:col-span-1 sticky! top-24">
          <div className="hide-scrollbar bg-card rounded-e-2xl p-4 md:max-h-[calc(100vh-180px)] overflow-y-auto">
            <div className="flex md:flex-col gap-2">
              {categoriesList?.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleSelect(category._id)}
                  className={`shrink-0 md:shrink md:w-full text-left px-4 py-3 rounded-lg transition-all whitespace-nowrap md:whitespace-normal border-l-4 ${
                    selectedCategory === category._id
                      ? "border-l-primary bg-background text-foreground font-semibold"
                      : "border-l-transparent bg-transparent text-gray-700 dark:text-gray-300 hover:bg-orange-200/50 dark:hover:bg-orange-900/40"
                  }`}
                >
                  <span className="text-sm md:text-base line-clamp-2">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Subcategories Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {subCategoriesData?.data?.map((subcategory) => (
              <Link
                key={subcategory._id}
                href={`/app/categories/${selectedCategory}`}
                className="group cursor-pointer transform transition-all hover:scale-105 active:scale-95"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square mb-3 border border-border group-hover:border-primary transition-colors">
                  <img
                    src={subcategory.cover}
                    alt={subcategory.name}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <p className="text-center text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {subcategory.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesContent;
