import axios from "axios";
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

let cachedFingerprint: string | null = null;

async function getDeviceFingerprint(): Promise<string> {
  if (cachedFingerprint) return cachedFingerprint;

  if (typeof window === "undefined") {
    return "server";
  }

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  cachedFingerprint = result.visitorId;
  return cachedFingerprint;
}

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (request) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return Promise.reject(new Error("No internet connection"));
    }

    const token = localStorage.getItem("token");
    const fingerprint = await getDeviceFingerprint();

    request.headers.set("Accept", "application/json, text/plain, */*");
    request.headers.set("devicemodel", fingerprint);
    request.headers.set("deviceuniqueid", fingerprint);

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.warn("Request timeout or slow internet");
    }

    // if (error.response?.status === 401) {
    //   Cookies.remove("token");

    //   if (typeof window !== "undefined") {
    //     window.location.href = "/";
    //   }
    // }

    return Promise.reject(error);
  },
);
