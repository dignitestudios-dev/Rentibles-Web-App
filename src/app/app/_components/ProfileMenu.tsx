"use client";

import { RootState } from "../../../lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { logout } from "../../../lib/store/feature/authSlice";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import { UserProfile } from "@/public/images/export";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInvalidateAllQueries } from "@/src/hooks/useInvalidateAllQueries";
import ConfirmDialog from "@/src/components/common/ConfirmDialog";

const NAV_LINKS = [
  { label: "Home", href: "/app/home" },
  { label: "Favorites", href: "/app/favorites" },
  { label: "Chat Support", href: "/app/chat-support" },
  { label: "Cash Withdrawal", href: "/app/cash-withdrawal" },
  { label: "Product Request", href: "/app/product-request" },
  { label: "Product Issues", href: "/app/product-issues" },
  { label: "Settings", href: "/app/settings" },
];

const ProfileMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { invalidateAll } = useInvalidateAllQueries();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authState = useAppSelector((state: RootState) => state.auth);
  const { user, isAuthenticated } = authState;

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      invalidateAll();
      dispatch(logout());
      router.push("/auth/get-started");
    } finally {
      setIsLoading(false);
      setOpenConfirm(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-2 hover:bg-transparent"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user.image || UserProfile}
                alt={user.name}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden md:flex flex-col items-start gap-0">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-2">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div
                onClick={() => router.push(`/app/users/${user._id}`)}
                className="cursor-pointer"
              >
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {/* <ChevronDown className="w-4 h-4" /> */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Navigation Links */}
          {NAV_LINKS.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href} className="cursor-pointer">
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => setOpenConfirm(true)}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Log out"
        description="Are you sure you want to log out?"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={handleConfirmLogout}
        loading={isLoading}
      />
    </>
  );
};

export default ProfileMenu;
