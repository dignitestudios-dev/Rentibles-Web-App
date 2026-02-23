import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getStoreById } from "../query/queryFn";
import {
  GetStoreByIdResponse,
  ReportStorePayload,
  ReportStoreResponse,
} from "@/src/types/index.type";
import { axiosInstance } from "../axiosInstance";

export const useStoreById = (
  storeId: string | null,
): UseQueryResult<GetStoreByIdResponse, Error> => {
  return useQuery({
    queryKey: ["storeById", storeId],
    queryFn: () => getStoreById(storeId!),
    enabled: !!storeId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const reportStore = async (
  payload: ReportStorePayload,
): Promise<ReportStoreResponse> => {
  const response = await axiosInstance.post<ReportStoreResponse>(
    "/report",
    payload,
  );
  return response.data;
};
