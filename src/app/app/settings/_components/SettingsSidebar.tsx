"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useGetSettings, useUpdateSettings } from "@/src/lib/api/settings";
import Loader from "@/src/components/common/Loader";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";

interface SettingsItem {
  id: string;
  label: string;
  href: string;
  isToggle?: boolean;
}

const settingsItems: SettingsItem[] = [
  {
    id: "notifications",
    label: "Notifications",
    href: "/app/settings/notifications",
    isToggle: true,
  },
  {
    id: "change-password",
    label: "Change Password",
    href: "/app/settings/change-password",
  },
  {
    id: "card-details",
    label: "Card Details",
    href: "/app/settings/card-details",
  },
  {
    id: "bank-details",
    label: "Bank Details",
    href: "/app/settings/bank-details",
  },
  {
    id: "customer-support",
    label: "Customer Support",
    href: "/app/settings/customer-support",
  },
  {
    id: "blocked-users",
    label: "Blocked Users",
    href: "/app/settings/blocked-users",
  },
  {
    id: "delete-account",
    label: "Delete Account",
    href: "/app/settings/delete-account",
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Fetch settings from API
  const { data: settingsData, isLoading } = useGetSettings();

  // Mutation for updating settings
  const updateSettingsMutation = useUpdateSettings();

  // Local state synced with API
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize from API data
  useEffect(() => {
    if (settingsData?.data) {
      setNotificationsEnabled(settingsData.data.notification ?? false);
    }
  }, [settingsData]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Handle notification toggle with API call
  const handleNotificationToggle = async (checked: boolean) => {
    const previousValue = notificationsEnabled;
    setNotificationsEnabled(checked);
    setIsUpdating(true);

    try {
      await updateSettingsMutation.mutateAsync({
        notification: checked,
      });

      // Invalidate query to sync with fresh data
      queryClient.invalidateQueries({ queryKey: ["settings"] });

      SuccessToast(
        checked ? "Notifications enabled" : "Notifications disabled",
      );
    } catch (error) {
      // Revert on error
      setNotificationsEnabled(previousValue);
      const message = getAxiosErrorMessage(
        error,
        "Failed to update notification settings",
      );
      ErrorToast(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Loader show={isLoading || isUpdating} />

      <div className="w-full h-fit bg-card border-b md:border-r md:border-b-0 border-border rounded-lg md:rounded-lg px-4 py-6 md:py-8 sticky top-24 z-10">
        {/* Settings Title - Hidden on larger screens */}
        <h2 className="text-xl font-semibold mb-6 md:hidden text-foreground">
          Settings
        </h2>

        {/* Settings Menu */}
        <nav className="space-y-1">
          {settingsItems.map((item) => {
            const active = isActive(item.href);

            if (item.isToggle) {
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-gray-200 dark:hover:bg-muted"
                  }`}
                >
                  <span className="font-medium text-sm">{item.label}</span>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                    disabled={isLoading || isUpdating}
                    aria-label="Toggle notifications"
                  />
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-gray-200 dark:hover:bg-muted"
                }`}
              >
                <span className="font-medium text-sm">{item.label}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
