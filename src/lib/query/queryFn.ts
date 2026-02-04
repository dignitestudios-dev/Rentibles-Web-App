import Cookies from "js-cookie";
import { axiosInstance } from "../axiosInstance";
import {
  CheckEmailPayload,
  CheckEmailResponse,
  ForgotPayload,
  ForgotResponse,
  LoginPayload,
  LoginResponse,
  NewPasswordPayload,
  NewPasswordResponse,
  RegisterPayload,
  RegisterResponse,
  ResendEmailPaylod,
  ResendPhonePaylod,
  ResendResponse,
  VerifyOtpResponse,
} from "@/src/types/index.type";
import { OtpPayload } from "@/src/schema";

export const loginUser = async (
  credentials: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post("/auth/login/", credentials);
  Cookies.set("access_token", data.access, { expires: 7, path: "/" });
  return data;
};

export const ForgotUser = async (
  credentials: ForgotPayload,
): Promise<ForgotResponse> => {
  const { data } = await axiosInstance.post("/auth/forgot/", credentials);

  return data;
};

export const verifyOtp = async (
  payload: OtpPayload,
): Promise<VerifyOtpResponse> => {
  const { data } = await axiosInstance.post("/auth/verifyEmail", payload);
  return data;
};

export const newPassword = async (
  payload: NewPasswordPayload,
): Promise<NewPasswordResponse> => {
  const { data } = await axiosInstance.post("/auth/new-password", payload);
  return data;
};
export const RegisterUser = async (
  payload: FormData,
): Promise<RegisterResponse> => {
  const { data } = await axiosInstance.post("/auth/signUp", payload);
  return data;
};
export const CheckEmailStatus = async (
  payload: CheckEmailPayload,
): Promise<CheckEmailResponse> => {
  const { data } = await axiosInstance.post("/auth/check", payload);
  return data;
};
export const ResendOtp = async (
  payload: ResendEmailPaylod,
): Promise<ResendResponse> => {
  const { data } = await axiosInstance.post(
    "/auth/emailVerificationOTP",
    payload,
  );
  return data;
};
export const PhoneVerifyOtp = async (
  payload: OtpPayload,
): Promise<VerifyOtpResponse> => {
  const { data } = await axiosInstance.post("/auth/verifyPhone", payload);
  return data;
};

export const PhoneResendOtp = async (
  payload: ResendPhonePaylod,
): Promise<ResendResponse> => {
  const { data } = await axiosInstance.post(
    "/auth/phoneVerificationOTP",
    payload,
  );
  return data;
};
