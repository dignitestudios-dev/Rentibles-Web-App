"use client";

import { useMutation, useQuery, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  createProductRequest,
  deleteProductRequest,
  getProductRequestsByUser,
} from "../query/queryFn";
import {
  CreateProductRequestPayload,
  CreateProductRequestResponse,
  DeleteProductRequestPayload,
  DeleteProductRequestResponse,
  GetProductRequestsResponse,
} from "@/src/types/index.type";

export const useProductRequests = (): UseQueryResult<GetProductRequestsResponse, Error> => {
  return useQuery({
    queryKey: ["productRequests"],
    queryFn: getProductRequestsByUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateProductRequest = (): UseMutationResult<
  CreateProductRequestResponse,
  Error,
  CreateProductRequestPayload,
  unknown
> => {
  return useMutation({
    mutationFn: createProductRequest,
  });
};

export const useDeleteProductRequest = (): UseMutationResult<
  DeleteProductRequestResponse,
  Error,
  DeleteProductRequestPayload,
  unknown
> => {
  return useMutation({
    mutationFn: deleteProductRequest,
  });
};
