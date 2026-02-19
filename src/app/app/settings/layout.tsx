"use client";

import SettingsSidebar from "./_components/SettingsSidebar";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainSettings = pathname === "/app/settings";

  return (
    <div className="py-6">
      <div className="mb-8 md:block hidden">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar - Always show on desktop, conditionally on mobile */}
        <div
          className={`md:col-span-1 ${!isMainSettings ? "hidden md:block" : ""}`}
        >
          <SettingsSidebar />
        </div>

        {/* Main Content - Show detail pages on mobile, show both sidebar and content on desktop */}
        <div
          className={`${isMainSettings ? "hidden md:col-span-2 md:block" : "col-span-1 md:col-span-2"}`}
        >
          <div className="bg-card h-full border border-border rounded-lg p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
