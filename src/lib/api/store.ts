import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getStoreById } from "../query/queryFn";
import { GetStoreByIdResponse } from "@/src/types/index.type";

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
