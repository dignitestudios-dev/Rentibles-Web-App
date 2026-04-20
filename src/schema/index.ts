import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, "Password is required"),
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
  email: z.string().email({ message: "Invalid email address" }), // add email
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
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required") // empty check
      .refine((val) => emailRegex.test(val), {
        message: "Invalid email address",
      }),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .min(7, "Phone number must be at least 7 digits"),
    fcmToken: z.string().optional(),

    zipCode: z
      .string()
      .trim()
      .min(1, "Zip code is required")
      .min(5, "Zip code must be at least 5 characters"),
    apartmentNo: z.string().min(1, "Apartment number is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(8, "Confirm your password"),

    image: z.any().optional(),

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
      message: "You must accept Terms & Conditions and Privacy Policy",
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
    .min(1, "Product name is required")
    .min(3, { message: "Product name must be at least 3 characters" })
    .trim(),
  // .refine((val) => !/\d/.test(val), {
  //   message: "Product name should not contain numbers",
  // }),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, { message: "Description must be at least 10 characters" })
    .trim(),

  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid quantity greater than 0",
    }),

  hourlyPrice: z
    .string()
    .min(1, "Hourly price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Hourly price must be a positive number",
    }),

  dailyPrice: z
    .string()
    .min(1, "Daily price is required")
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
    .min(1, { message: "At least 4 product images are required" })
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

export const updateProductSchema = z
  .object({
    productName: z
      .string()
      .min(3, { message: "Product name must be at least 3 characters" })
      .trim()
      .refine((val) => !/\d/.test(val), {
        message: "Product name should not contain numbers",
      }),

    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" })
      .trim(),

    quantity: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
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

    // ✅ NEW: Flexible image validation
    // Can be empty array - existing images will satisfy the requirement
    images: z
      .array(
        z.instanceof(File, {
          message: "Each image must be a valid file",
        }),
      )
      .max(10, { message: "Maximum 10 images allowed" })
      // we always want an array in the output, even if the user uploads nothing
      // the default ensures the form value is `File[]` instead of `File[] | undefined`
      .default([]),

    // ✅ NEW: Track remaining prefilled images (URLs)
    // These are the images that user kept from the original product
    existingPictures: z
      .array(z.string().url({ message: "Invalid image URL" }))
      // default to an empty array so the inferred TypeScript type is string[]
      .default([]),

    // ✅ NEW: Optional cover image (only if user changes it)
    // If not provided, the existing cover image is kept
    coverImage: z
      .instanceof(File, {
        message: "Cover image must be a valid file",
      })
      .refine((file) => file.size > 0, { message: "Cover image is required" })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        { message: "Cover image must be JPEG, PNG, or WebP" },
      )
      .nullable()
      .refine((val) => val !== null, { message: "Cover image is required" })
      .optional(),

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
  })
  // ✅ Main validation: Total images (existing + new) must be at least 4
  .refine(
    (data) => {
      const existingCount = data.existingPictures?.length || 0;
      const newCount = data.images?.length || 0;
      const totalImages = existingCount + newCount;

      return totalImages >= 4;
    },
    {
      message:
        "Total images must be at least 4. Current: existing images + new uploads.",
      path: ["images"], // Error will be associated with 'images' field
    },
  )
  // ✅ Secondary validation: Maximum 10 total images
  .refine(
    (data) => {
      const existingCount = data.existingPictures?.length || 0;
      const newCount = data.images?.length || 0;
      const totalImages = existingCount + newCount;

      return totalImages <= 10;
    },
    {
      message: "Total images cannot exceed 10.",
      path: ["images"], // Error will be associated with 'images' field
    },
  );

export type UpdateProductPayload = z.infer<typeof updateProductSchema>;
