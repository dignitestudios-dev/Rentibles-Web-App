"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import PhoneInput from "../common/PhoneInput";
import { Profile_img } from "@/public/images/export";
import { InputField } from "../common/InputField";
import Link from "next/link";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RegisterPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/src/schema";
import { useForm } from "react-hook-form";
import { CheckEmailStatus, RegisterUser } from "@/src/lib/query/queryFn";
import Loader from "../common/Loader";
import GoogleMapComponent from "../common/GoogleMapPicker";
import { useDispatch } from "react-redux";
import { ErrorToast, SuccessToast } from "../common/Toaster";
import { firebaseLogin, firebaseSignup } from "@/src/firebase/getIdToken";
import { singUp } from "@/src/lib/store/feature/authSlice";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [preview, setPreview] = useState<string | null>(null);
  const [fireBaseLoading, setFirebaseLoading] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      image: undefined as any,
      fullName: "",
      email: "",
      phone: "",
      zipCode: "",
      apartmentNo: "",
      password: "",
      confirmPassword: "",
      location: null,
      terms: false,
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: (payload: { email: string; role: string }) =>
      CheckEmailStatus(payload),
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setFirebaseLoading(true);

      await checkEmailMutation.mutateAsync({ email: data.email, role: "user" });

      let idToken = "";
      try {
        const firebaseRes = await firebaseSignup(data.email, data.password);
        idToken = firebaseRes.idToken;
      } catch (firebaseError: any) {
        if (firebaseError.code === "auth/email-already-in-use") {
          const loginRes = await firebaseLogin(data.email, data.password);
          idToken = loginRes.idToken;
        } else {
          throw firebaseError;
        }
      }

      const formData = new FormData();
      formData.append("name", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("zipCode", data.zipCode);
      formData.append("password", data.password);
      formData.append("profilePicture", data.image[0]);
      formData.append("apartment", data.apartmentNo);
      formData.append("idToken", idToken);
      formData.append("role", "user");
      if (location) {
        formData.append("latitude", String(location.lat));
        formData.append("longitude", String(location.lng));
        formData.append("address", location.address || "");
        formData.append("city", location.city || "");
        formData.append("state", location.state || "");
        formData.append("country", location.country || "");
      }

      await registerMutation.mutateAsync(formData);
    } catch (err: any) {
      const message = err?.message || "Signup failed. Please try again.";
      setError("root", { type: "manual", message });
      ErrorToast(message);
    } finally {
      setFirebaseLoading(false);
    }
  };
  const registerMutation = useMutation({
    mutationFn: (payload: FormData) => RegisterUser(payload),

    onSuccess: (response) => {
      const userInfo = response?.data;

      dispatch(
        singUp({
          token: {
            access: userInfo.token,
            refresh: userInfo.token,
          },
          user: response.data.user,
        }),
      );
      SuccessToast(response?.message);
      router.push("/auth/select-otp");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      setError("root", { type: "manual", message });
      ErrorToast(message);
    },
  });

  const onLocationSelect = (loc: any) => {
    const lat = loc.location.coordinates[1];
    const lng = loc.location.coordinates[0];

    setLocation({
      lat,
      lng,
      address: loc.address,
      city: loc.city,
      state: loc.state,
      country: loc.country,
    });
    setValue("location", { lat, lng });
    clearErrors("location");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-4 px-1 overflow-y-auto scrollbar-hide"
    >
      <div className="flex items-center gap-3 ">
        <label htmlFor="profile-upload">
          {preview ? (
            <div className="w-17 h-17 rounded-full overflow-hidden border border-dashed border-orange-400 flex items-center justify-center bg-gray-50 cursor-pointer">
              <img
                src={preview}
                alt="profile preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Image
              src={Profile_img}
              alt="profile placeholder"
              width={68}
              height={68}
              className="cursor-pointer"
            />
          )}
        </label>

        <p className="text-sm text-gray-600">Add Profile Picture</p>

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          hidden
          {...register("image", {
            onChange: (e) => handleImageChange(e),
          })}
        />
      </div>
      {errors.image && (
        <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          placeholder="Full Name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <InputField
          placeholder="Email Address"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="md:col-span-2">
          <PhoneInput
            placeholder="Phone Number"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      <div>
        <GoogleMapComponent onLocationSelect={onLocationSelect} />
      </div>

      {errors.location && (
        <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          placeholder="Zip Code"
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />

        <InputField
          placeholder="Apartment No"
          error={errors.apartmentNo?.message}
          {...register("apartmentNo")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <InputField
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <div className="flex items-start gap-2 my-2 text-[13px] text-gray-400 leading-tight">
        <input
          type="checkbox"
          {...register("terms")}
          className="mt-1 h-4 w-4 accent-[#F85E00]"
        />
        <p>
          I Agree To The{" "}
          <Link
            href="https://www.rentibles.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F85E00]"
          >
            Terms & Conditions
          </Link>{" "}
          &{" "}
          <Link
            href="https://www.rentibles.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F85E00]"
          >
            Privacy Policy
          </Link>
          , And I Authorize The Collection And Use Of Phone Number For
          Two-Factor Authentication
        </p>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-xs">{errors.terms.message}</p>
      )}

      <Loader show={fireBaseLoading || registerMutation.isPending} />
      <Button
        disabled={fireBaseLoading || registerMutation.isPending}
        className="h-12 bg-[#F85E00] cursor-pointer text-white rounded-xl text-base"
      >
        {fireBaseLoading || registerMutation.isPending
          ? "Signing Up..."
          : "Sign Up"}
      </Button>

      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
      <p className="w-full text-center text-[16px] text-[#3C3C43D9] ">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-[#F85E00] font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
