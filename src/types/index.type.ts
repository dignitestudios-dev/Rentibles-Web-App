export type RegisterPayload = {
  fullName: string;
  image: FileList;
  email: string;
  phone: string;
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
export type ForgotVerifyOtpPayload = {
  email: string;
  otp: string;
  role: "user";
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
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      phone: number;
      identityStatus?: "not-provided" | "pending" | "approved" | "rejected";
      isPhoneVerified: boolean;
      isEmailVerified: boolean;
    };
  };
};
export type ForgotVerifyOtpResponse = {
  success: boolean;
  message: string;
  access: string;
  refresh: string;
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

export type ForgotPayload = {
  email: string;
};
export type NewPasswordPayload = {
  password: string;
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

export interface VerifyIdentityPayload {
  face: File;
  front: File;
  back: File;
  name: string;
}

export type VerifyIdentityResponse = {
  success: boolean;
  message: string;
};
export type SocialRegisterResponse = {
  success: boolean;
  message: string;
  access: string;
  refresh: string;
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
export type SocialRegisterPayload = {
  idToken: string;
  role: "user";
};
