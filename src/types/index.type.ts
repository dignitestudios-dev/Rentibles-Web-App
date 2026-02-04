export type RegisterPayload = {
  fullName: string;
  image: FileList;
  email: string;
  phone: string;
  // fcmToken: any;
  zipCode: string;
  apartmentNo: string;
  password: string;
  confirmPassword: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  terms: boolean;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      phone: number;
    };
  };
};
export type CheckEmailPayload = {
  email: string;
  role: string;
};
export type ResendEmailPaylod = {
  email?: string;
};
export type ResendPhonePaylod = {
  phone?: number;
};
export type CheckEmailResponse = {
  success: boolean;
  message: string;
  user: object;
  access: string;
};
export type ResendResponse = {
  success: boolean;
  message: string;
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

export interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
