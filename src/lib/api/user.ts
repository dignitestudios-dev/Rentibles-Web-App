import {
  GetUserParams,
  GetUserResponse,
  GetUserProfileResponse,
} from "@/src/types/index.type";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { getUsersWithParams, getUserById } from "../query/queryFn";

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

/**
 * Hook to fetch a single user profile by userId
 * @param userId - The user ID to fetch
 * @param options - Optional React Query options
 * @returns User profile data
 */
export const useUser = (
  userId: string,
  options?: Omit<
    UseQueryOptions<GetUserProfileResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetUserProfileResponse, Error> => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // only fetch if userId is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};
