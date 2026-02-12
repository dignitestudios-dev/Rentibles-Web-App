import { AxiosError } from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  const err = error as AxiosError<any>;

  if (err?.response?.data?.message) return err.response.data.message;

  if (err?.response?.data?.msg) return err.response.data.msg;

  return fallback;
}
