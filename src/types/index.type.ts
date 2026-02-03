export type RegisterPayload = {
  fullName: string;
  image: FileList;
  email: string;
  phone: string;
  home: string;
  zipCode: string;
  apartmentNo: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};
export type RegisterResponse = {
  success: boolean;
  message: string;
  user: object;
  access: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  access: string;
  refresh: string;
};

export type ForgotPayload = {
  email: string;
};
export type NewPasswordPayload = {
  password: string;
  confirmPassword: string;
};
export type NewPasswordResponse = {
  success: boolean;
  message: string;
};

export type ForgotResponse = {
  success: boolean;
  message: string;
};

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
}
