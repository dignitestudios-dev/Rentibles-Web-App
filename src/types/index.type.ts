// Support Ticket
export interface SupportTicketPayload {
  title: string;
  description: string;
}
export interface SupportTicketResponse {
  success: boolean;
  message: string;
}
export type RegisterPayload = {
  fullName: string;
  image?: any;
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
      phone: string;
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
  phone?: string;
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
      _id: string;
      name: string;
      email: string;
      image?: string;
      phone: string;
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
      phone: string;
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
      phone: string;
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

export interface BalanceAmount {
  amount: number;
  currency: string;
}

export interface GetBalanceResponse {
  success: boolean;
  message: string;
  data: {
    availableBalance: BalanceAmount;
    pendingBalance: BalanceAmount;
    instantAvailable: BalanceAmount;
  };
}

export interface Payout {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  date: number; // epoch seconds
  bankName?: string | null;
  accountHolderName?: string | null;
  accountNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPayoutsResponse {
  success: boolean;
  message: string;
  data: Payout[];
}

export interface BankDetails {
  bank_name?: string;
  country: string;
  currency: string;
  last4: string;
  status: string;
}

export interface GetBankResponse {
  success: boolean;
  message: string;
  data: BankDetails | null;
}

export interface WithdrawalPayload {
  amount: number;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data?: {
    _id?: string;
    accountHolderName?: string | null;
    accountNumber?: string;
    amount: number;
    bankName?: string | null;
    currency: string;
    date: number;
    method?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
  PROCESSING = "processing",
}

// raw transaction item returned by /transaction endpoint
export interface TransactionItem {
  _id: string;
  shortCode?: string;
  productName?: string;
  amount: number;
  reason: string;
  card?: {
    brand: string;
    last4: string;
  };
  type: "debit" | "credit";
  date: number; // unix timestamp in seconds
  status?: TransactionStatus; // some endpoints may include status
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: TransactionItem[];
}

export interface GetTransactionsParams {
  limit?: number;
  page?: number;
  startDate?: number;
  endDate?: number;
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
  productName?: string;
  shortCode?: string;
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

// Product Request API
export interface CreateProductRequestPayload {
  name: string;
  description: string;
  categoryId: string;
}

export interface CreateProductRequestResponse {
  success: boolean;
  message: string;
}

export interface ProductRequestItem {
  _id: string;
  name: string;
  description: string;
  category: {
    _id: string;
    name: string;
    cover?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetProductRequestsResponse {
  success: boolean;
  message: string;
  data: ProductRequestItem[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export type DeleteProductRequestPayload = string;

export interface DeleteProductRequestResponse {
  success: boolean;
  message: string;
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

export interface ReportStoreConfig {
  storeId: string;
  storeName?: string;
}

// configuration used when showing the user report modal
export interface ReportUserConfig {
  userId: string;
  userName?: string;
}

// payload/response for reporting a store
export interface ReportStorePayload {
  title: string;
  description: string;
  storeId: string;
}

export interface ReportStoreResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    title: string;
    description: string;
    storeId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// payload/response for reporting a user
export interface ReportUserPayload {
  title: string;
  description: string;
  userId: string;
}

export interface ReportUserResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    title: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

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
  latitude?: number;
  longitude?: number;
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
  userId?: string;
  latitude?: number;
  longitude?: number;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  data: Products[];
  pagination?: {
    currentPage?: number;
    itemsPerPage?: number;
    totalItems?: number;
    totalPages?: number;
  };
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
  phone?: string;
  profilePicture: string;
}

export interface IStore {
  _id: string;
  name: string;
  email: string;
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
  store: IStore;

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

// used when deleting a product via DELETE /product with request body
export interface DeleteProductPayload {
  productId: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
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

// Response type: single user profile object
export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    phone: string;
    country: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: number;
    location: {
      type: string;
      coordinates: [number, number];
    };
    identityStatus: "not-provided" | "pending" | "approved" | "rejected";
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isProfileCompleted: boolean;
    isSeller: boolean;
    stripeProfileStatus: string;
    stripeAccountId: string;
    idFrontImage: string | null;
    idBackImage: string | null;
    isOwn: boolean;
    createdAt: string;
    updatedAt: string;
    hasPurchased: boolean;
  };
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

// Notifications
export interface NotificationMetaData {
  type?: string;
  product?: {
    _id: string;
    name?: string;
    cover?: string;
  };
  user?: {
    _id: string;
    name?: string;
    profilePicture?: string;
  };
  booking?: Record<string, unknown> | null;
}

export interface Notification {
  _id: string;
  title: string;
  description?: string;
  metaData?: NotificationMetaData;
  isRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
  unreadCount?: number;
  pagination: NotificationsPagination;
}

export interface ReportStorePayload {
  title: string;
  description: string;
  storeId: string;
}

export interface ReportStoreResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    title: string;
    description: string;
    storeId: string;
    createdAt: string;
    updatedAt: string;
  };
}

// review types

export interface IUser {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface IProductReview {
  _id: string;
  user: IUser;
  stars: number;
  description: string;
  isOwn: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IPagination {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface GetProductReviewResponse {
  success: boolean;
  message: string;
  data: IProductReview[];
  pagination: IPagination;
}

export interface TimeSlot {
  label: string; // "02:00 PM - 03:00 PM"
  startEpoch: number; // unix seconds
  endEpoch: number;
  startLabel: string; // "02:00 PM"
  endLabel: string; // "03:00 PM"
  disabled?: boolean; // if the slot is in the past or unavailable for booking
  /**
   * optional quantity available for this slot. not every consumer of
   * TimeSlot will set it, so it remains optional.
   */
  availableQuantity?: number;
}

export interface TimeSlotResult {
  slots: TimeSlot[];
  totalHours: number;
  pickupLabel: string;
  dropOffLabel: string;
}

// --- product availability API ------------------------------------------------
export interface ProductAvailabilitySlot {
  start: number; // epoch seconds
  end: number; // epoch seconds
  availableQuantity: number;
}

export interface ProductAvailabilityDay {
  date: number; // epoch seconds for midnight of the day
  minQuantity: number;
  dayStartAt: number;
  dayEndAt: number;
  slots: ProductAvailabilitySlot[];
}

export interface GetProductAvailabilityResponse {
  success: boolean;
  message: string;
  data: ProductAvailabilityDay[];
}

export interface AvailabilitySlotsProps {
  pickupTime?: number | null; // product?.pickupTime  (epoch seconds)
  dropOffTime?: number | null; // product?.dropOffTime (epoch seconds)
  onSlotSelect?: (slot: TimeSlot) => void;
}

// wishlist types
export interface GetWishlistResponse {
  success: boolean;
  message: string;
  data: Products[];
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

// Delete Account
export interface DeleteAccountPayload {
  password: string;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

// Tracking / Booking types for rentals

// Tracking / Booking types for rentals

export interface TrackingBooking {
  _id: string;
  shortCode: string;
  bookingDate: number;
  pickupTime: number;
  dropOffTime: number;
  quantity: number;
  perUnitPrice: number;
  totalAmount: number;
  pickupAddress: string | null;
  pickupLocation: {
    type: string;
    coordinates: [number, number];
  };
  dropOffAddress: string | null;
  dropOffLocation: {
    type: string;
    coordinates: [number, number];
  };
  duration: string;
  status: string;
  chatId: string | null;
  type: string;
  documentId: string | null;
  signedBySeller: boolean;
  signedByRenter: boolean;
  isContractSigned: boolean;
  isReported: boolean;
  isPopupShown: boolean;
  distance: number | null;
  createdAt: string;
  updatedAt: string;
  platformAmount: number;
  stripeFee: number;
  sellerAmount: number;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
    phone: string;
    uid: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: null | any;
  customer: {
    _id: string;
    name: string;
    profilePicture: string;
    phone: string;
    uid: string;
  };
  product: {
    _id: string;
    name: string;
    description: string;
    cover: string;
    images: string[];
    productReview: number;
    category: {
      _id: string;
      name: string;
      cover: string;
    };
    subCategory: {
      _id: string;
      name: string;
      cover: string;
    };
    isContracted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  detail: {
    history: Array<{
      status: string;
      date: number;
    }>;
    pickupImages: string[];
    pickupVideos: string[];
    dropOffImages: string[];
    dropOffVideos: string[];
    cancellationReason: string | null;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: null | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  review: null | any;
}

export interface GetTrackingParams {
  type: "rental" | "own";
  page?: number;
  limit?: number;
}

export interface GetTrackingResponse {
  success: boolean;
  message: string;
  data: TrackingBooking[];
  pagination: IPagination;
}

export interface GetBookingDetailsResponse {
  success: boolean;
  message: string;
  data: TrackingBooking;
}

export interface ReportBookingReporter {
  _id: string;
  id?: string;
  email?: string;
  name: string;
  profilePicture?: string | null;
  uid?: string;
}

export interface ReportBookingProductUser {
  _id: string;
  name: string;
  profilePicture?: string | null;
  uid: string;
}

export interface ReportBookingProduct {
  _id: string;
  name: string;
  cover?: string;
  user: ReportBookingProductUser;
}

export interface ReportBookingBooking {
  _id: string;
  shortCode: string;
  chatId: string;
  product: ReportBookingProduct;
}

export interface ReportBookingItem {
  _id: string;
  title: string;
  description: string;
  reportedByUser: ReportBookingReporter | null;
  reportedByStore: {
    _id: string;
    name: string;
  } | null;
  booking: ReportBookingBooking;
  createdAt: string;
  updatedAt: string;
}

export interface GetReportBookingResponse {
  success: boolean;
  message: string;
  data: ReportBookingItem[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}
