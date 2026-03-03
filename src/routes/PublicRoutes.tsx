"use client";
import { RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface PublicRoutesProps {
  children: React.ReactNode;
}
const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isGuestMode } = useSelector(
    (state: RootState) => state.auth,
  );
  console.log("🚀 ~ PublicRoutes ~ user:", user);
  const isLoggedIn = Boolean(isAuthenticated && user);

  useEffect(() => {
    if (isGuestMode && !isLoggedIn && pathname === "/auth/get-started") {
      router.push("/app/home");
      return;
    }

    if (!isLoggedIn || !user) {
      if (
        pathname !== "/auth/forgot-password" &&
        pathname !== "/auth/register" &&
        pathname !== "/auth/otp" &&
        pathname !== "/auth/get-started"
      ) {
        router.push("/auth/login");
      }
      return;
    }

    if (user.isEmailVerified === false || user.isPhoneVerified === false) {
      // router.push("/auth/select-otp");
      return;
    }

    switch (user.identityStatus) {
      case "not-provided":
        router.push("/auth/identity-verification");
        return;

      case "pending":
      case "rejected":
        // ✅ Allow both routes
        if (
          pathname !== "/auth/profile-status" &&
          pathname !== "/auth/identity-verification"
        ) {
          router.push("/auth/profile-status");
        }
        return;

      case "approved":
      default:
        router.push("/app/home");
        return;
    }
  }, [isLoggedIn, user, isGuestMode, pathname, router]);

  return <>{children}</>;
};

export default PublicRoutes;
