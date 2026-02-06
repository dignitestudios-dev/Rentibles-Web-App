"use client";

import Link from "next/link";
import React from "react";
import ProfileMenu from "./ProfileMenu";
import Logo from "@/src/components/icons/Logo";
import ThemeToggle from "@/src/components/common/ThemeToggle";

const AppNavbar = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-4 py-5 flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/app/home" className="shrink-0">
          <Logo />
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
