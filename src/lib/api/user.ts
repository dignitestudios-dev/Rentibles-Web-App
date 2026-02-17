import { GetUserParams, GetUserResponse } from "@/src/types/index.type";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { getUsersWithParams } from "../query/queryFn";

export const useUsers = (
  params?: GetUserParams,
  options?: Omit<
    UseQueryOptions<GetUserResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetUserResponse, Error> => {
  return useQuery({
    queryKey: ["users", params], // include params in the key
    queryFn: ({ queryKey }) => {
      const [, queryParams] = queryKey as [string, GetUserParams?];
      return getUsersWithParams(queryParams);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
