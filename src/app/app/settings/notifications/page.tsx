"use client";

import SettingsBackButton from "../_components/SettingsBackButton";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div>
      <SettingsBackButton />

      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Notifications
      </h2>

      <div className="flex flex-col items-center justify-center py-16">
        <Bell className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          Use the toggle in the sidebar to enable or disable notifications.
        </p>
      </div>

      {/* Information about what gets sent when notifications are enabled */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">
          When notifications are enabled, you'll receive:
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-foreground">Order Updates</p>
              <p className="text-sm text-muted-foreground">
                Real-time notifications about your orders and rentals
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-foreground">Messages</p>
              <p className="text-sm text-muted-foreground">
                New messages from other users
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-primary mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-foreground">Promotions</p>
              <p className="text-sm text-muted-foreground">
                Special offers and discounts relevant to you
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

