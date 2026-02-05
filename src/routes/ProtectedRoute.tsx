"use client";
import { RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.identityStatus === "not-provided") {
      router.push("/auth/identity-verification");
    }
  }, [isAuthenticated, user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
