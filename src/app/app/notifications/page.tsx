"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  markNotificationAsRead,
  usePaginatedNotifications,
} from "@/src/lib/api/notifications";
import { Notification as TNotification } from "@/src/types/index.type";
import Pagination from "@/src/components/common/Pagination";
import Loader from "@/src/components/common/Loader";

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = usePaginatedNotifications(currentPage, 10);

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  const handleClick = async (n: TNotification) => {
    // mark read if not already
    if (!n.isRead) {
      try {
        await markNotificationAsRead({ notificationId: n._id });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({
          queryKey: ["notifications", "paginated"],
        });
      } catch (e) {
        console.error("failed to mark notification read", e);
      }
    }

    // navigate based on type/metaData
    const metaType = n.metaData?.type;
    if (metaType === "product" && n.metaData?.product?._id) {
      router.push(`/app/products/${n.metaData.product._id}`);
    } else if (metaType === "booking" && n.metaData?.booking?._id) {
      router.push(`/app/tracking/${n.metaData.booking._id}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader show={true} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {notifications.map((n) => {
                  const img =
                    n.metaData?.product?.cover ||
                    n.metaData?.user?.profilePicture;

                  return (
                    <div
                      key={n._id}
                      onClick={() => handleClick(n)}
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        {img ? (
                          <Image
                            src={img}
                            alt={n.title}
                            width={48}
                            height={48}
                            className="object-cover w-12 h-12"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.description}
                        </p>
                      </div>

                      {/* unread indicator */}
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
