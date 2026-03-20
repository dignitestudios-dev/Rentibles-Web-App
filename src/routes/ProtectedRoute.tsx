"use client";
import { RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isGuestMode, isResetPasswordFlow } =
    useSelector((state: RootState) => state.auth);

  const isLoggedIn = Boolean(isAuthenticated && user);

  const isGuestAllowedPath =
    pathname.startsWith("/app/home") ||
    pathname.startsWith("/app/search") ||
    pathname === "/app/products" ||
    pathname.startsWith("/app/products/") ||
    pathname === "/app/categories" ||
    pathname.startsWith("/app/categories/") ||
    pathname.startsWith("/app/store/") ||
    pathname.startsWith("/app/users");

  useEffect(() => {
    if (!isLoggedIn && !(isGuestMode && isGuestAllowedPath)) {
      router.push("/auth/login");
      return;
    }
    if (isResetPasswordFlow) {
      router.push("/auth/new-password");
      return;
    }

    if (!isLoggedIn) {
      return;
    }

    if (user?.identityStatus === "not-provided") {
      router.push("/auth/identity-verification");
    }
  }, [isLoggedIn, isGuestMode, isGuestAllowedPath, user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
