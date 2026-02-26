import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  GetTransactionsResponse,
  GetTransactionsParams,
} from "@/src/types/index.type";
import { getTransactions } from "../query/queryFn";

/**
 * Hook to fetch transactions with optional pagination and date filters.
 * @param params - query parameters including limit, page, startDate and endDate
 */
export const useTransactions = (
  params?: GetTransactionsParams,
): UseQueryResult<GetTransactionsResponse, Error> => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetTransactionsParams?];
      return getTransactions(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: true,
  });
};
