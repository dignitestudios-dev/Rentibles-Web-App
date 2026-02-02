import { AxiosError } from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  const err = error as AxiosError<{ msg?: string }>;
  return err?.response?.data?.msg || fallback;
}
