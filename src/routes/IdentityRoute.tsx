"use client";
import { RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
interface IdentityRouteProps {
  children: React.ReactNode;
}
const IdentityRoute = ({ children }: IdentityRouteProps) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;
    switch (user.identityStatus) {
      case "not-provided":
        router.push("/auth/identity-verification");
        break;
      case "pending":
      case "rejected":
        router.push("/app/profile-status");
        break;
      case "approved":
        break;
    }
  }, [user, router]);

  return <>{children}</>;
};

export default IdentityRoute;
