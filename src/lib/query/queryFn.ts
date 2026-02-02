import Cookies from "js-cookie";
import { axiosInstance } from "../axiosInstance";
import { LoginPayload, LoginResponse } from "@/src/types/index.type";

export const loginUser = async (
  credentials: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post("/auth/login/", credentials);
  Cookies.set("access_token", data.access, { expires: 7, path: "/" });
  return data;
};
