"use client";

import { logout, setGuestMode } from "@/src/lib/store/feature/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/public/images/export";

const GuestModeMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isGuestMode } = useAppSelector((state) => state.auth);

  if (!isGuestMode) {
    return null;
  }

  const handleExitGuestMode = () => {
    dispatch(setGuestMode(false));
    dispatch(logout());
    router.push("/auth/get-started");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 hover:bg-transparent"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={UserProfile}
              alt="Guest"
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col items-start gap-0">
            <span className="text-sm font-medium text-foreground">Guest User</span>
            <span className="text-xs text-muted-foreground">Guest Mode</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleExitGuestMode}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Exit Guest Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GuestModeMenu;
