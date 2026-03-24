"use client";
import {
  useQuery,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
} from "@tanstack/react-query";
import {
  getCategories,
  getProductById,
  getProductReview,
  getProductsWithParams,
  getStoresWithParams,
  getSubCategories,
  getWishlist,
} from "../query/queryFn";
import { axiosInstance } from "../axiosInstance";
import {
  GetCategoriesResponse,
  GetProductAvailabilityResponse,
  GetProductByIdResponse,
  GetProductReviewResponse,
  GetProductsParams,
  GetProductsResponse,
  GetStoresParams,
  GetStoresResponse,
  GetSubCategoriesResponse,
  GetWishlistResponse,
} from "@/src/types/index.type";
import { useAppSelector } from "@/src/lib/store/hooks";

// Default fallback coordinates (Karachi)
const DEFAULT_LAT = 24.8607;
const DEFAULT_LNG = 67.0011;

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
  options?: Omit<
    UseQueryOptions<GetStoresResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetStoresResponse, Error> => {
  const { isGuestMode } = useAppSelector((state) => state.auth);

  // Inject default location for guest mode
  const enrichedParams: GetStoresParams = {
    ...params,
    ...(isGuestMode && !params?.latitude && !params?.longitude
      ? { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }
      : {}),
  };

  return useQuery({
    queryKey: ["stores", enrichedParams],
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetStoresParams?];
      return getStoresWithParams(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useProducts = (
  params?: GetProductsParams,
  options?: Omit<
    UseQueryOptions<GetProductsResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetProductsResponse, Error> => {
  const { isGuestMode } = useAppSelector((state) => state.auth);

  // Inject default location for guest mode
  const enrichedParams: GetProductsParams = {
    ...params,
    ...(isGuestMode && !params?.latitude && !params?.longitude
      ? { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }
      : {}),
  };

  return useQuery<GetProductsResponse, Error>({
    queryKey: ["products", enrichedParams],
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetProductsParams?];
      return getProductsWithParams(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
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

export const useProductReviewById = (
  productId: string | null,
): UseQueryResult<GetProductReviewResponse, Error> => {
  return useQuery({
    queryKey: ["productReview", productId],
    queryFn: () => getProductReview(productId!),
    enabled: !!productId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useWishlist = (): UseQueryResult<GetWishlistResponse, Error> => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Toggle product activation
export interface ToggleActivationPayload {
  productId: string;
  isActive: boolean;
}

export interface ToggleActivationResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    isActive: boolean;
  };
}

export const useToggleProductActivation = (): UseMutationResult<
  ToggleActivationResponse,
  Error,
  ToggleActivationPayload
> => {
  return useMutation({
    mutationFn: async (payload: ToggleActivationPayload) => {
      const response = await axiosInstance.post<ToggleActivationResponse>(
        "/product/toggleActivation",
        payload,
      );
      return response.data;
    },
  });
};

// -- product deletion -------------------------------------------------------
export interface DeleteProductPayload {
  productId: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export const useDeleteProduct = (): UseMutationResult<
  DeleteProductResponse,
  Error,
  DeleteProductPayload
> => {
  return useMutation({
    mutationFn: async (payload: DeleteProductPayload) => {
      // Axios delete expecting `data` property when body is required
      const response = await axiosInstance.delete<DeleteProductResponse>(
        `/product/${payload?.productId || null}`,
      );
      return response.data;
    },
  });
};

// ---------------------------------------------------------------------------
// availability helper & hook
// ---------------------------------------------------------------------------
export const getProductAvailability = async (
  productId: string,
  date: number,
) => {
  const response = await axiosInstance.get<GetProductAvailabilityResponse>(
    "/product/availability",
    {
      params: {
        productId,
        date,
      },
    },
  );
  return response.data;
};

export const useProductAvailability = (
  productId: string | null,
  date: number | null,
): UseQueryResult<GetProductAvailabilityResponse, Error> => {
  return useQuery({
    queryKey: ["productAvailability", productId, date],
    queryFn: () => getProductAvailability(productId!, date!),
    enabled: !!productId && !!date,
    staleTime: 2 * 60 * 1000,
  });
};
