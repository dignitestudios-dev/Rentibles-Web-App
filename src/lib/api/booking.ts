"use client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { axiosInstance } from "@/src/lib/axiosInstance";
import { getTracking, getBookingById, updateBooking } from "../query/queryFn";
import {
  GetTrackingParams,
  GetTrackingResponse,
  GetBookingDetailsResponse,
} from "@/src/types/index.type";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpdateBookingPayload {
  id: string;
  type: "pickup" | "dropOff";
  images?: File[];
  videos?: File[];
}
export interface UpdateBookingResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface CreateBookingPayload {
  productId: string;
  quantity: number;
  pickupTime: number;
  dropOffTime: number;
  sourceId: string;
  isContracted: boolean;
}
export interface CreateBookingResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export interface CancelBookingPayload {
  id: string;
  cancellationReason: string;
}
export interface CancelBookingResponse {
  success: boolean;
  message?: string;
}

export interface CreateReviewPayload {
  stars: number;
  bookingId: string;
  description: string;
}
export interface CreateReviewResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// ─── Damage Types ─────────────────────────────────────────────────────────────

export interface ReportBookingDamagePayload {
  bookingId: string;
  adjustBooking: boolean;
}
export interface ReportBookingDamageResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface ReportIssuePayload {
  bookingId: string;
  title: string;
  description: string;
}

export interface ReportIssueResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> => {
  const { data } = await axiosInstance.post("/booking", payload);
  return data;
};

export const cancelBooking = async (
  payload: CancelBookingPayload,
): Promise<CancelBookingResponse> => {
  const { data } = await axiosInstance.post("/booking/cancel", payload);
  return data;
};

export const createReview = async (
  payload: CreateReviewPayload,
): Promise<CreateReviewResponse> => {
  const { data } = await axiosInstance.post("/review", payload);
  return data;
};

export const reportBookingDamage = async (
  payload: ReportBookingDamagePayload,
): Promise<ReportBookingDamageResponse> => {
  const { data } = await axiosInstance.post("/booking/damage", payload);
  console.log(data, "data---checking");
  return data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCreateBooking = (): UseMutationResult<
  CreateBookingResponse,
  Error,
  CreateBookingPayload,
  unknown
> => useMutation({ mutationFn: createBooking });

export const useTracking = (
  params: GetTrackingParams,
  options?: { enabled?: boolean },
): UseQueryResult<GetTrackingResponse, Error> =>
  useQuery({
    queryKey: ["tracking", params],
    queryFn: () => getTracking(params),
    refetchOnMount: "always",
    staleTime: 0,
    enabled: options?.enabled ?? true,
  });

export const useBookingDetails = (
  id: string,
  options?: { enabled?: boolean },
): UseQueryResult<GetBookingDetailsResponse, Error> =>
  useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? !!id,
  });

export const useCancelBooking = (): UseMutationResult<
  CancelBookingResponse,
  Error,
  CancelBookingPayload,
  unknown
> => useMutation({ mutationFn: cancelBooking });

export const useUpdateBooking = (): UseMutationResult<
  UpdateBookingResponse,
  Error,
  UpdateBookingPayload,
  unknown
> => useMutation({ mutationFn: updateBooking });

export const useCreateReview = (): UseMutationResult<
  CreateReviewResponse,
  Error,
  CreateReviewPayload,
  unknown
> => useMutation({ mutationFn: createReview });

export const useReportBookingDamage = (): UseMutationResult<
  ReportBookingDamageResponse,
  Error,
  ReportBookingDamagePayload,
  unknown
> => useMutation({ mutationFn: reportBookingDamage });

export interface ReportBookingReporter {
  _id: string;
  id?: string;
  email?: string;
  name: string;
  profilePicture?: string | null;
  uid?: string;
}

export interface ReportBookingProductUser {
  _id: string;
  name: string;
  profilePicture?: string | null;
  uid: string;
}

export interface ReportBookingProduct {
  _id: string;
  name: string;
  cover?: string;
  user: ReportBookingProductUser;
}

export interface ReportBookingBooking {
  _id: string;
  shortCode: string;
  chatId: string;
  product: ReportBookingProduct;
}

export interface ReportBookingItem {
  _id: string;
  title: string;
  description: string;
  reportedByUser: ReportBookingReporter | null;
  reportedByStore: {
    _id: string;
    name: string;
  } | null;
  booking: ReportBookingBooking;
  createdAt: string;
  updatedAt: string;
}

export interface GetReportBookingResponse {
  success: boolean;
  message: string;
  data: ReportBookingItem[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getReportBookings =
  async (): Promise<GetReportBookingResponse> => {
    const { data } = await axiosInstance.get("/report/booking");
    return data;
  };

export const useReportBookings = (): UseQueryResult<
  GetReportBookingResponse,
  Error
> =>
  useQuery({
    queryKey: ["reportBookings"],
    queryFn: getReportBookings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const reportIssue = async (
  payload: ReportIssuePayload,
): Promise<ReportIssueResponse> => {
  const { data } = await axiosInstance.post("/report", payload);
  return data;
};

export const useReportIssue = (): UseMutationResult<
  ReportIssueResponse,
  Error,
  ReportIssuePayload,
  unknown
> => useMutation({ mutationFn: reportIssue });
