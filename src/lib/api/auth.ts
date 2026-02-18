"use client";

import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/src/types/index.type";
import { changePassword } from "../query/queryFn";

/**
 * Hook to change user password
 * Handles password change request with proper error handling
 */
export const useChangePassword = (): UseMutationResult<
  ChangePasswordResponse,
  Error,
  ChangePasswordPayload,
  unknown
> => {
  return useMutation({
    mutationFn: changePassword,
  });
};
