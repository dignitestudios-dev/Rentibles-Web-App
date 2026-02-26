"use client";

import {
  LoginRequiredDialogOptions,
  useLoginRequiredDialog,
} from "@/src/lib/auth/LoginRequiredProvider";
import { useAppSelector } from "@/src/lib/store/hooks";

type RequireLoginOptions = LoginRequiredDialogOptions & {
  onAuthenticated?: () => void;
};

export const useRequireLogin = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(isAuthenticated && user);
  const { openLoginRequiredDialog } = useLoginRequiredDialog();

  const requireLogin = (options?: RequireLoginOptions) => {
    if (isLoggedIn) {
      options?.onAuthenticated?.();
      return true;
    }

    openLoginRequiredDialog(options);
    return false;
  };

  return {
    isAuthenticated: isLoggedIn,
    requireLogin,
  };
};
