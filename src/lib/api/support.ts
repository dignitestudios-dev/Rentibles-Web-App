"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createSupportTicket } from "../query/queryFn";
import { SupportTicketPayload, SupportTicketResponse } from "@/src/types/index.type";

/**
 * Hook to create a support ticket
 * Handles support ticket request with proper error handling
 */
export const useSupportTicket = (): UseMutationResult<
  SupportTicketResponse,
  Error,
  SupportTicketPayload,
  unknown
> => {
  return useMutation({
    mutationFn: createSupportTicket,
  });
};
