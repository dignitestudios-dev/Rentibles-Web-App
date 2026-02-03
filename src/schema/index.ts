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
    home: z.string().min(1, "Home is required"),
    zipCode: z.string().min(3, "Zip code is required"),
    apartmentNo: z.string().min(1, "Apartment number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    image: z
      .any()
      .refine((file) => file?.length > 0, "Profile image is required"),

    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterPayload = z.infer<typeof RegisterSchema>;
