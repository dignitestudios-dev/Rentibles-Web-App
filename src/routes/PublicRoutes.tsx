"use client";
import { RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { resolveFlowRoute } from "@/src/lib/flows/resolveFlowRoute";

interface PublicRoutesProps {
  children: React.ReactNode;
}
const PublicRoutes = ({ children }: PublicRoutesProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isGuestMode, isResetPasswordFlow } =
    useSelector((state: RootState) => state.auth);

  const isLoggedIn = Boolean(isAuthenticated && user);

  useEffect(() => {
    const hasForgotEmail =
      typeof window !== "undefined" && Boolean(localStorage.getItem("email"));
    const isAuthRoute = pathname.startsWith("/auth");

    if (isGuestMode && !isLoggedIn && pathname === "/auth/get-started") {
      router.push("/app/home");
      return;
    }

    if (!isLoggedIn || !user) {
      const forgotFlowTarget = resolveFlowRoute({
        currentPath: pathname,
        startPath: "/auth/forgot-password",
        context: {
          hasForgotEmail,
          isResetPasswordFlow,
        },
        steps: [
          {
            path: "/auth/forgot-password",
            canAccess: () => true,
          },
          {
            path: "/auth/otp",
            canAccess: (ctx) => Boolean(ctx.hasForgotEmail),
          },
          {
            path: "/auth/new-password",
            canAccess: (ctx) => Boolean(ctx.isResetPasswordFlow),
          },
        ],
      });

      const allowedUnauthPaths = new Set([
        "/auth/get-started",
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/otp",
        "/auth/new-password",
      ]);

      if (pathname === "/auth/otp" || pathname === "/auth/new-password") {
        if (pathname !== forgotFlowTarget) router.push(forgotFlowTarget);
        return;
      }

      if (!allowedUnauthPaths.has(pathname)) router.push("/auth/login");
      return;
    }

    if (user.isEmailVerified === false || user.isPhoneVerified === false) {
      const signupStepTarget = resolveFlowRoute({
        currentPath: pathname,
        startPath: "/auth/select-otp",
        context: {
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
        steps: [
          {
            path: "/auth/select-otp",
            canAccess: () => true,
          },
          {
            path: "/auth/email-verify",
            canAccess: (ctx) => !ctx.isEmailVerified,
          },
          {
            path: "/auth/phone-verify",
            canAccess: (ctx) =>
              Boolean(ctx.isEmailVerified) && !ctx.isPhoneVerified,
          },
        ],
      });

      if (isAuthRoute && pathname !== signupStepTarget) {
        router.push(signupStepTarget);
      }
      return;
    }

    switch (user.identityStatus) {
      case "not-provided":
        if (pathname !== "/auth/identity-verification") {
          router.push("/auth/identity-verification");
        }
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
        if (isAuthRoute) router.push("/app/home");
        return;
    }
  }, [isLoggedIn, user, isGuestMode, pathname, router, isResetPasswordFlow]);

  return <>{children}</>;
};

export default PublicRoutes;
