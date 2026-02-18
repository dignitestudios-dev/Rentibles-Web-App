import { store } from "./../lib/store/index";
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

// For Chat Type Handling
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

// types/wallet.types.ts
export interface Balance {
  available: number;
  pending: number;
  currency: string;
}

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  PROCESSING = "processing",
}

export interface WithdrawalRecord {
  id: string;
  date: string;
  status: TransactionStatus;
  amount: number;
  type?: "credit" | "debit";
}

export interface TransactionRecord {
  id: string;
  date: string;
  status: TransactionStatus;
  amount: number;
  type?: "credit" | "debit";
}

export type TabType = "withdrawal" | "transaction";

// for withdrawal modal
export interface WithdrawalDetails {
  id: string;
  amount: number;
  currency: string;
  referenceId: string;
  date: string;
  description: string;
  status: string;
}

// types/product-request.types.ts
// export interface Category {
//   id: string;
//   name: string;
//   slug: string;

// }

export interface Category {
  _id: string;
  name: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  id: string;
  productName: string;
  description: string;
  storeName: string;
  category: Category;
  createdAt: Date;
  status: "pending" | "approved" | "rejected";
}

export interface AddProductRequestFormData {
  categoryId: string;
  productName: string;
  description: string;
}
// types/schedule.types.ts
export interface DaySchedule {
  id: string;
  day: string;
  shortName: string;
  enabled: boolean;
  order: number;
}

export type DaysOfWeek = DaySchedule[];

// types/category.types.ts

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSubCategoriesResponse {
  success: boolean;
  message: string;
  data: SubCategory[];
}

// store type defined

export interface Stores {
  _id: string;
  name: string;
  email: string;
  coverPicture: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetStoresParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetStoresResponse {
  success: boolean;
  message: string;
  data: Stores[];
}

//product type define

export interface ProductCategory {
  _id: string;
  name: string;
  cover: string;
}

export interface ProductSubCategory {
  _id: string;
  name: string;
  cover: string;
}

export interface Products {
  _id: string;
  name: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  cover: string;
  pricePerHour: number;
  pricePerDay: number;
  productReview: number;
  isContracted: boolean;
  isOwn: boolean;
  isLiked: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  categoryId?: string;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  data: Products[];
}

export interface ICategory {
  _id: string;
  name: string;
  cover: string;
}

export interface ISubCategory {
  _id: string;
  name: string;
  cover: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  profilePicture: string;
}

export interface IPickupLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface IProductDetails {
  _id: string;
  name: string;
  description: string;

  cover: string;
  images: string[];

  category: ICategory;
  subCategory: ISubCategory;

  user: IUser;
  store: string | null;

  quantity: number;
  totalQuantity?: number;

  pricePerDay: number;
  pricePerHour: number;

  availableDays: string[];
  availabilities: unknown[]; // Change if you know structure

  pickupAddress: string;
  pickUpApartment: string;
  pickupLocation: IPickupLocation;

  pickupTime: number; // Unix timestamp
  dropOffTime: number; // Unix timestamp

  distance: string;

  isActive: boolean;
  isBooked: boolean;
  isContracted: boolean;
  isLiked: boolean;
  isOwn: boolean;

  productReview: number;

  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface GetProductByIdResponse {
  success: boolean;
  message: string;
  data: IProductDetails;
}

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface User {
  _id: string;
  uid: string;
  name: string;
  email: string;
  phone: string; // keep as string since phone numbers can have leading zeros or country codes
  profilePicture?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: number;
  location?: Location;
  identityStatus?: "not-provided" | "pending" | "approved" | "rejected";
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  isSeller?: boolean;
  isDeactivatedByAdmin?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean; // derived flag if needed
  stripeAccountId?: string;
  stripeBankId?: string;
  stripeCustomerId?: string;
  stripeProfileStatus?: "pending" | "approved" | "rejected";
  signUpRecord?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  veriffSessionId?: string | null;
  faceImage?: string | null;
  idFrontImage?: string | null;
  idBackImage?: string | null;
}

export interface LocationSelect {
  location: Location;
  address: string;
  city: string;
  state: string;
  country: string;
}

// Params type: only "search" is allowed
export interface GetUserParams {
  search?: string;
}

// Response type: array of user objects
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }[];
}

export interface GetStoreByIdResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    coverPicture: string;
    description: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: number;
    location?: Location;
  };
}

// Settings
export interface SettingsData {
  _id: string;
  user?: string;
  store?: string;
  notification: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetSettingsResponse {
  success: boolean;
  message: string;
  data: SettingsData;
}

export interface UpdateSettingsPayload {
  notification?: boolean;
}

export interface UpdateSettingsResponse {
  success: boolean;
  message: string;
}

// Auth - Change Password
export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Payment cards
export interface CardItem {
  _id: string;
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  default: boolean;
  paymentMethodId: string;
}

export interface GetCardsResponse {
  success: boolean;
  message: string;
  data: CardItem[];
}

export interface AddCardPayload {
  paymentMethodId: string;
}

export interface AddCardResponse {
  success: boolean;
  message: string;
}

export interface DeleteCardResponse {
  success: boolean;
  message: string;
}

// Bank details
export interface BankItem {
  bank_name: string;
  country: string;
  currency: string;
  routing_number: string;
  last4: string;
  status: "active" | "inactive" | "pending";
}

export interface GetBankResponse {
  success: boolean;
  message: string;
  data: BankItem | null;
}

export interface AddBankPayload {
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
}

export interface AddBankResponse {
  success: boolean;
  message: string;
}

export interface DeleteBankResponse {
  success: boolean;
  message: string;
}
