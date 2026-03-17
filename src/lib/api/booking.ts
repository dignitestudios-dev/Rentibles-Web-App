"use client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { axiosInstance } from "@/src/lib/axiosInstance";
import { getTracking, getBookingById } from "../query/queryFn";
import {
  GetTrackingParams,
  GetTrackingResponse,
  GetBookingDetailsResponse,
} from "@/src/types/index.type";

export interface CreateBookingPayload {
  productId: string;
  quantity: number;
  pickupTime: number; // UTC epoch seconds
  dropOffTime: number; // UTC epoch seconds
  sourceId: string;
  isContracted: boolean;
}

export interface CreateBookingResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> => {
  const { data } = await axiosInstance.post("/booking", payload);
  return data;
};

export const useCreateBooking = (): UseMutationResult<
  CreateBookingResponse,
  Error,
  CreateBookingPayload,
  unknown
> => {
  return useMutation<
    CreateBookingResponse,
    Error,
    CreateBookingPayload,
    unknown
  >({
    mutationFn: createBooking,
  });
};

export const useTracking = (
  params: GetTrackingParams,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<GetTrackingResponse, Error> => {
  return useQuery({
    queryKey: ["tracking", params],
    queryFn: () => getTracking(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true,
  });
};

export const useBookingDetails = (
  id: string,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<GetBookingDetailsResponse, Error> => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? !!id,
  });
};
