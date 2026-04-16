// services/notification.ts
import { axiosInstance } from "../axiosInstance";
import { GetNotificationsResponse } from "@/src/types/index.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
// import { fetchNotifications } from "./services/notification";
import { Notification } from "@/src/types/index.type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export interface MarkNotificationAsReadPayload {
  notificationId: string;
}

export interface MarkNotificationAsReadResponse {
  success: boolean;
  message: string;
}

const fetchNotifications = async (
  page: number,
  limit: number,
): Promise<GetNotificationsResponse> => {
  const res = await axiosInstance.get("/notification", {
    params: { page, limit },
  });

  return res.data;
};

const LIMIT = 5;

export const useNotifications = () => {
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const { data, isLoading, isFetching } = useQuery<
    GetNotificationsResponse,
    Error
  >({
    queryKey: ["notifications", page],
    queryFn: () => fetchNotifications(page, LIMIT),
    placeholderData: (prev) => prev,
  });

  const notifications: Notification[] = data?.data ?? [];

  const hasNextPage =
    data?.pagination &&
    data.pagination.currentPage < data.pagination.totalPages;

  return {
    notifications,
    isLoading,
    isFetching,
    hasNextPage,
    loadMore: () => setPage((prev) => prev + 1),
  };
};

export const markNotificationAsRead = async (
  payload: MarkNotificationAsReadPayload,
): Promise<MarkNotificationAsReadResponse> => {
  const { data } = await axiosInstance.post<MarkNotificationAsReadResponse>(
    "/notification/read",
    payload,
  );

  return data;
};

export const usePaginatedNotifications = (page: number, limit: number = 10) => {
  return useQuery<GetNotificationsResponse, Error>({
    queryKey: ["notifications", "paginated", page, limit],
    queryFn: () => fetchNotifications(page, limit),
  });
};
