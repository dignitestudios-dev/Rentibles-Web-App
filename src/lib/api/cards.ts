"use client";

import { useMutation, useQuery, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { getCards, addCard, deleteCard } from "../query/queryFn";
import { GetCardsResponse, AddCardPayload, AddCardResponse, DeleteCardResponse } from "@/src/types/index.type";

export const useGetCards = (): UseQueryResult<GetCardsResponse, Error> => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAddCard = (): UseMutationResult<AddCardResponse, Error, AddCardPayload, unknown> => {
  return useMutation({
    mutationFn: addCard,
  });
};

export const useDeleteCard = (): UseMutationResult<DeleteCardResponse, Error, string, unknown> => {
  return useMutation({
    mutationFn: deleteCard,
  });
};
