"use client";

import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to invalidate all cached queries.
 * Use on login/logout to ensure fresh data.
 */
export const useInvalidateAllQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
};
