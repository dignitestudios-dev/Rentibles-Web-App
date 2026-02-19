import Cookies from "js-cookie";
import { axiosInstance } from "../axiosInstance";
import {
  CheckEmailPayload,
  CheckEmailResponse,
  ForgotPayload,
  ForgotResponse,
  ForgotVerifyOtpPayload,
  ForgotVerifyOtpResponse,
  GetCategoriesParams,
  GetCategoriesResponse,
  GetProductByIdResponse,
  GetProductReviewResponse,
  GetProductsParams,
  GetProductsResponse,
  GetStoresParams,
  GetStoresResponse,
  GetSubCategoriesResponse,
  GetUserParams,
  GetUserResponse,
  LoginPayload,
  LoginResponse,
  NewPasswordPayload,
  NewPasswordResponse,
  RegisterResponse,
  ResendEmailPaylod,
  ResendPhonePaylod,
  ResendResponse,
  SocialRegisterPayload,
  SocialRegisterResponse,
  VerifyIdentityResponse,
  VerifyOtpResponse,
} from "@/src/types/index.type";
import { OtpPayload } from "@/src/schema";

export const loginUser = async (
  credentials: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post("/auth/signIn", credentials);
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
export const ForgotVerifyOtp = async (
  payload: ForgotVerifyOtpPayload,
): Promise<ForgotVerifyOtpResponse> => {
  const { data } = await axiosInstance.post("/auth/verifyOTP", payload);
  return data;
};
export const ForgotResendOtp = async (
  payload: OtpPayload,
): Promise<VerifyOtpResponse> => {
  const { data } = await axiosInstance.post("/auth/forgot", payload);
  return data;
};

export const newPassword = async (
  payload: NewPasswordPayload,
): Promise<NewPasswordResponse> => {
  const { data } = await axiosInstance.post("/auth/updatePassword", payload);
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
export const IdentityVerification = async (
  payload: FormData,
): Promise<VerifyIdentityResponse> => {
  const { data } = await axiosInstance.post("/user/verifyIdentity", payload);
  return data;
};
export const socialRegister = async (
  payload: SocialRegisterPayload,
): Promise<SocialRegisterResponse> => {
  const { data } = await axiosInstance.post("/auth/socialRegister", payload);
  return data;
};

export const createProduct = async (formData: FormData) => {
  const response = await axiosInstance.post("/product", formData);
  return response.data;
};

// add favorite
export const createWishlist = async (payload: {
  productId: string;
  value: boolean;
}) => {
  const response = await axiosInstance.post("/wishlist", payload);
  return response.data;
};

// categories

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const { data } = await axiosInstance.get("/category");
  return data;
};

export const getCategoriesWithParams = async (
  params?: GetCategoriesParams,
): Promise<GetCategoriesResponse> => {
  const { data } = await axiosInstance.get("/category", { params });
  return data;
};

export const getSubCategories = async (
  categoryId: string,
): Promise<GetSubCategoriesResponse> => {
  const { data } = await axiosInstance.get(`/category/${categoryId}`);
  return data;
};

export const getStoresWithParams = async (
  params?: GetStoresParams,
): Promise<GetStoresResponse> => {
  const { data } = await axiosInstance.get("/store", { params });
  return data;
};

// products

export const getProductsWithParams = async (
  params?: GetProductsParams,
): Promise<GetProductsResponse> => {
  const { data } = await axiosInstance.get("/product", { params });
  return data;
};

export const getProductById = async (
  categoryId: string,
): Promise<GetProductByIdResponse> => {
  const { data } = await axiosInstance.get(
    `/product/${categoryId}?longitude=123&latitude=123`,
  );
  return data;
};

export const getProductReview = async (
  productId: string,
): Promise<GetProductReviewResponse> => {
  const { data } = await axiosInstance.get(`/review?productId=${productId}`);
  return data;
};

//users
export const getUsers = async (): Promise<GetCategoriesResponse> => {
  const { data } = await axiosInstance.get("/user/all");
  return data;
};

export const getUsersWithParams = async (
  params?: GetUserParams,
): Promise<GetUserResponse> => {
  const { data } = await axiosInstance.get("/user/all", { params });
  return data;
};

//store
export const getStoreById = async (storeId: string) => {
  const { data } = await axiosInstance.get(`/store/${storeId}`);
  return data;
};
