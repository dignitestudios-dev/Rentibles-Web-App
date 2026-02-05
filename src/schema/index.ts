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
