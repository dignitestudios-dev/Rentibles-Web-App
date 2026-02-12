import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const ForgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
});

export type ForgotPayload = z.infer<typeof ForgotSchema>;

export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpPayload = z.infer<typeof OtpSchema>;

export const ForgotOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  email: z.string().email(), // add email
  role: z.literal("user"), // role fixed
});

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type NewPasswordPayload = z.infer<typeof NewPasswordSchema>;

export const RegisterSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7, "Invalid phone number"),
    fcmToken: z.string().optional(),

    zipCode: z.string().min(3, "Zip code is required"),
    apartmentNo: z.string().min(1, "Apartment number is required"),

    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),

    image: z
      .any()
      .refine((file) => file?.length > 0, "Profile image is required"),

    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .nullable()
      .refine((val) => val !== null, {
        message: "Please select your location on the map",
      }),

    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterPayload = z.infer<typeof RegisterSchema>;

export const identitySchema = z.object({
  name: z.string().min(3, "Legal name is required"),

  face: z.instanceof(File, { message: "Face image is required" }),

  front: z.instanceof(File, { message: "Front image is required" }),

  back: z.instanceof(File, { message: "Back image is required" }),
});

export type IdentityFormValues = z.infer<typeof identitySchema>;

export const createProductSchema = z.object({
  productName: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .trim(),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .trim(),

  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number",
  }),

  hourlyPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Hourly price must be a positive number",
    }),

  dailyPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Daily price must be a positive number",
    }),

  pickupTime: z.string().min(1, { message: "Pickup time is required" }),

  dropOffTime: z.string().min(1, { message: "Drop-off time is required" }),

  images: z
    .array(
      z.instanceof(File, {
        message: "Each image must be a valid file",
      }),
    )
    .min(4, { message: "At least 4 product images are required" })
    .max(10, { message: "Maximum 10 images allowed" }),

  coverImage: z
    .instanceof(File, {
      message: "Cover image must be a valid file",
    })
    .refine((file) => file.size > 0, { message: "Cover image is required" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "Cover image must be JPEG, PNG, or WebP" },
    ),

  category: z.string().min(1, { message: "Category is required" }),

  subCategory: z.string().min(1, { message: "Sub-category is required" }),

  availableDays: z
    .array(z.string())
    .min(1, { message: "At least one day must be selected" }),

  location: z
    .object({
      lat: z
        .number()
        .min(-90, { message: "Invalid latitude" })
        .max(90, { message: "Invalid latitude" }),
      lng: z
        .number()
        .min(-180, { message: "Invalid longitude" })
        .max(180, { message: "Invalid longitude" }),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .refine(
      (location) => {
        return (
          location.lat !== 0 &&
          location.lng !== 0 &&
          !isNaN(location.lat) &&
          !isNaN(location.lng) &&
          location.lat >= -90 &&
          location.lat <= 90 &&
          location.lng >= -180 &&
          location.lng <= 180
        );
      },
      {
        message:
          "Location is required. Please select a valid address on the map.",
      },
    ),
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;
