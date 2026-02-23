"use client";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getBalance,
  getPayouts,
  getBank,
  createWithdrawal,
} from "../query/queryFn";
import {
  GetBalanceResponse,
  GetPayoutsResponse,
  GetBankResponse,
  WithdrawalPayload,
  WithdrawalResponse,
} from "@/src/types/index.type";

export const useBalance = (): UseQueryResult<GetBalanceResponse, Error> => {
  return useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useBalance;

export const usePayouts = (params?: {
  startDate?: number;
  endDate?: number;
  threshold?: number;
}): UseQueryResult<GetPayoutsResponse, Error> => {
  return useQuery({
    queryKey: ["payouts", params],
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, typeof params?];
      return getPayouts(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: true,
  });
};

export const useBank = (): UseQueryResult<GetBankResponse, Error> => {
  return useQuery({
    queryKey: ["bank"],
    queryFn: getBank,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useWithdraw = (): UseMutationResult<
  WithdrawalResponse,
  Error,
  WithdrawalPayload
> => {
  return useMutation({
    mutationFn: createWithdrawal,
  });
};
