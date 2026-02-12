"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getCategories,
  getProductById,
  getProductsWithParams,
  getStoresWithParams,
  getSubCategories,
} from "../query/queryFn";
import {
  GetCategoriesResponse,
  GetProductByIdResponse,
  GetProductsParams,
  GetProductsResponse,
  GetStoresParams,
  GetStoresResponse,
  GetSubCategoriesResponse,
} from "@/src/types/index.type";

export const useCategories = (): UseQueryResult<
  GetCategoriesResponse,
  Error
> => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useSubCategories = (
  categoryId: string | null,
): UseQueryResult<GetSubCategoriesResponse, Error> => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubCategories(categoryId!),
    enabled: !!categoryId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useStores = (
  params?: GetStoresParams,
): UseQueryResult<GetStoresResponse, Error> => {
  return useQuery({
    queryKey: ["stores", params], // include params in the key
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetStoresParams?];
      return getStoresWithParams(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProducts = (
  params?: GetProductsParams,
): UseQueryResult<GetProductsResponse, Error> => {
  return useQuery<GetProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetProductsParams?];
      return getProductsWithParams(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProductById = (
  productId: string | null,
): UseQueryResult<GetProductByIdResponse, Error> => {
  return useQuery({
    queryKey: ["productById", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
