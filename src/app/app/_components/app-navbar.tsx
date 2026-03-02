"use client";

import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import GuestModeMenu from "./GuestModeMenu";
import Logo from "@/src/components/icons/Logo";
import ThemeToggle from "@/src/components/common/ThemeToggle";
import NotificationDropdown from "@/src/components/common/NotificationDropdown";
import { CirclePlus, FileClock, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/lib/store/hooks";

const AppNavbar = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(isAuthenticated && user);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-4 py-5 flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/app/home" className="shrink-0">
          <Logo />
        </Link>

        {/* Right controls */}
        {isLoggedIn && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              aria-label="Create Product"
              title="Create Product"
              className="p-0"
              onClick={() => router.push("/app/create-product")}
            >
              <CirclePlus />
            </Button>
            <Button
              variant="ghost"
              aria-label="Tracking"
              title="Tracking"
              className="p-0"
              onClick={() => router.push("/app/rental-tracking")}
            >
              <FileClock className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Messages"
              title="Messages"
              className="p-0"
            >
              <MessageSquareText className="w-6 h-6" />
            </Button>

            <NotificationDropdown />
            <ThemeToggle />
            <ProfileMenu />
          </div>
        )}
        {!isLoggedIn && (
          <div className="flex items-center gap-2 shrink-0">
            <GuestModeMenu />
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;
