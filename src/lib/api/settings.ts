"use client";

import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  GetSettingsResponse,
  UpdateSettingsPayload,
  UpdateSettingsResponse,
} from "@/src/types/index.type";
import { getSettings, updateSettings } from "../query/queryFn";

/**
 * Hook to fetch user/store settings
 * Automatically refetches on component mount and when component becomes focused
 */
export const useGetSettings = (
  options?: Omit<
    UseQueryOptions<GetSettingsResponse, Error>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<GetSettingsResponse, Error> => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...options,
  });
};

/**
 * Hook to update user/store settings
 * Automatically invalidates settings query on success
 */
export const useUpdateSettings = (): UseMutationResult<
  UpdateSettingsResponse,
  Error,
  UpdateSettingsPayload,
  unknown
> => {
  return useMutation({
    mutationFn: updateSettings,
  });
};
