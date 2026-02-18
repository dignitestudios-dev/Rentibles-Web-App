import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  GetBankResponse,
  AddBankPayload,
  AddBankResponse,
  DeleteBankResponse,
} from "@/src/types/index.type";
import { getBank, addBank, deleteBank } from "../query/queryFn";

export const useGetBank = (
  options?: Omit<
    UseQueryOptions<GetBankResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetBankResponse, Error> => {
  return useQuery({
    queryKey: ["bank"],
    queryFn: getBank,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useAddBank = (): UseMutationResult<
  AddBankResponse,
  Error,
  AddBankPayload
> => {
  return useMutation({
    mutationFn: addBank,
  });
};

export const useDeleteBank = (): UseMutationResult<
  DeleteBankResponse,
  Error,
  void
> => {
  return useMutation({
    mutationFn: deleteBank,
  });
};
