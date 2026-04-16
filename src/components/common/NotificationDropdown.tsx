"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useNotifications,
  markNotificationAsRead,
} from "@/src/lib/api/notifications";
import { Notification as TNotification } from "@/src/types/index.type";
import { Button } from "@/components/ui/button";

interface NotificationDropdownProps {
  onItemClick?: (item: TNotification) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onItemClick,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { notifications, isLoading, isFetching, hasNextPage, loadMore } =
    useNotifications();

  const handleClick = async (n: TNotification) => {
    // mark read if not already
    if (!n.isRead) {
      try {
        await markNotificationAsRead({ notificationId: n._id });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
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

    onItemClick?.(n);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Notification"
          title="Notification"
          className="p-0"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-0">
        <div className="px-4 py-2 font-medium text-sm">Notifications</div>

        <DropdownMenuSeparator />

        {/* Scrollable container */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((n) => {
              const img =
                n.metaData?.product?.cover || n.metaData?.user?.profilePicture;

              return (
                <DropdownMenuItem
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 p-2 w-full">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                      {img ? (
                        <Image
                          src={img}
                          alt={n.title}
                          width={40}
                          height={40}
                          className="object-cover w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {n.description}
                      </p>
                    </div>

                    {/* unread indicator */}
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-3 text-center">
          <button
            onClick={() => router.push("/app/notifications")}
            className="text-sm text-primary hover:underline"
          >
            Show more
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
