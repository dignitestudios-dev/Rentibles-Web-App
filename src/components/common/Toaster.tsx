import { toast } from "react-hot-toast";

let toastId: string | undefined;

export const SuccessToast = (msg: string) => {
  if (toastId) toast.dismiss(toastId);
  toastId = toast.success(msg, {
    icon: "✅",
    className: "toast-slide",
  });
};

export const ErrorToast = (msg: string) => {
  if (toastId) toast.dismiss(toastId);
  toastId = toast.error(msg, {
    icon: "❌",
    className: "toast-slide",
  });
};

export const WarningToast = (msg: string) => {
  if (toastId) toast.dismiss(toastId);
  toastId = toast(msg, {
    icon: "⚠️",
    className: "toast-slide",
  });
};
