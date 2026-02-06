"use client";
import { RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface PublicRoutesProps {
  children: React.ReactNode;
}
const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const router = useRouter();
  const { isAuthenticated, user, isVerified } = useSelector(
    (state: RootState) => state.auth,
  );
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.isEmailVerified === false || user.isPhoneVerified === false) {
      router.push("/auth/select-otp");
      return;
    }
    if (isVerified) {
      switch (user.identityStatus) {
        case "not-provided":
          router.push("/auth/identity-verification");
          return;

        case "pending":
        case "rejected":
          router.push("/auth/profile-status");
          return;

        case "approved":
          router.push("/app/home");
          return;
      }
    }
  }, [isAuthenticated, user, router]);

  return <>{children}</>;
};

export default PublicRoutes;
