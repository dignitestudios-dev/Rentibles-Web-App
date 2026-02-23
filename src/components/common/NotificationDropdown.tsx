"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/src/lib/api/notifications";
import { Notification as TNotification } from "@/src/types/index.type";
import { Button } from "@/components/ui/button";

interface NotificationDropdownProps {
  onItemClick?: (item: TNotification) => void;
}

const formatTimeAgo = (iso?: string) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onItemClick,
}) => {
  const { notifications, isLoading, isFetching, hasNextPage, loadMore } =
    useNotifications();

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
                  onClick={() => onItemClick?.(n)}
                  className="cursor-pointer"
                >
                  <div className="flex gap-3 p-2 w-full">
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
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-3 text-center">
          {hasNextPage ? (
            <button
              onClick={loadMore}
              disabled={isFetching}
              className="text-sm text-primary hover:underline"
            >
              {isFetching ? "Loading..." : "Show more"}
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">
              No more notifications
            </span>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
