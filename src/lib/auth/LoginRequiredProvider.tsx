"use client";

import LoginRequiredDialog from "@/src/components/common/LoginRequiredDialog";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { setGuestMode } from "@/src/lib/store/feature/authSlice";

type LoginRequiredDialogOptions = {
  title?: string;
  description?: string;
  actionLabel?: string;
  loginPath?: string;
};

type LoginRequiredDialogContextValue = {
  openLoginRequiredDialog: (options?: LoginRequiredDialogOptions) => void;
  closeLoginRequiredDialog: () => void;
};

const LoginRequiredDialogContext =
  createContext<LoginRequiredDialogContextValue | null>(null);

const defaultOptions: Required<LoginRequiredDialogOptions> = {
  title: "Login Required",
  description: "Please login in order to access full features of the app.",
  actionLabel: "Login Now",
  loginPath: "/auth/get-started",
};

export const LoginRequiredProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] =
    useState<Required<LoginRequiredDialogOptions>>(defaultOptions);

  const openLoginRequiredDialog = useCallback(
    (dialogOptions?: LoginRequiredDialogOptions) => {
      setOptions({ ...defaultOptions, ...dialogOptions });
      setOpen(true);
    },
    [],
  );

  const closeLoginRequiredDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLoginNow = useCallback(() => {
    setOpen(false);
    dispatch(setGuestMode(false));
    router.push(options.loginPath);
  }, [options.loginPath, router, dispatch]);

  const value = useMemo(
    () => ({
      openLoginRequiredDialog,
      closeLoginRequiredDialog,
    }),
    [openLoginRequiredDialog, closeLoginRequiredDialog],
  );

  return (
    <LoginRequiredDialogContext.Provider value={value}>
      {children}
      <LoginRequiredDialog
        open={open}
        onOpenChange={setOpen}
        onLoginNow={handleLoginNow}
        title={options.title}
        description={options.description}
        actionLabel={options.actionLabel}
      />
    </LoginRequiredDialogContext.Provider>
  );
};

export const useLoginRequiredDialog = () => {
  const context = useContext(LoginRequiredDialogContext);

  if (!context) {
    throw new Error(
      "useLoginRequiredDialog must be used within LoginRequiredProvider",
    );
  }

  return context;
};

export type { LoginRequiredDialogOptions };
