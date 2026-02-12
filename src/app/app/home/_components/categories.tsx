"use client";
import React, { useEffect } from "react";
import CategoryCard from "./category-card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/src/lib/store/hooks";
import {
  setCategoriesError,
  setCategoriesLoading,
  setCategoriesSuccess,
} from "@/src/lib/store/feature/appSlice";
import { useCategories } from "@/src/lib/api/products";

const Categories = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const { data, isLoading, isError, error } = useCategories();

  // Store categories in Redux when data is fetched
  useEffect(() => {
    if (isLoading) {
      dispatch(setCategoriesLoading(true));
    }

    if (data?.data) {
      dispatch(setCategoriesSuccess(data?.data));
    }

    if (isError && error) {
      dispatch(
        setCategoriesError(error.message || "Failed to fetch categories"),
      );
    }
  }, [data, isLoading, isError, error, dispatch]);

  return (
    <div className="my-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Categories</h2>
        <Link href={"/app/categories"} className="text-primary hover:underline">
          See All
        </Link>
      </div>

      <div className="mt-3 relative">
        <div className="flex gap-3 overflow-x-auto py-2 mb-6 scrollbar-light">
          {data?.data?.map((cat) => (
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
      </div>
    </div>
  );
};

export default Categories;
