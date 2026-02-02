"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import PhoneInput from "../common/PhoneInput";
import { Map_img, Profile_img } from "@/public/images/export";
import { InputField } from "../common/InputField";
import Link from "next/link";
import { useState } from "react";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RegisterPayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/src/schema";
import { useForm } from "react-hook-form";
import { RegisterUser } from "@/src/lib/query/queryFn";

const RegisterForm = () => {
  const [preview, setPreview] = useState<string | null>(null);

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
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      image: undefined as any,
      fullName: "",
      email: "",
      phone: "",
      home: "",
      zipCode: "",
      apartmentNo: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: RegisterPayload) => {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("home", data.home);
    formData.append("zipCode", data.zipCode);
    formData.append("apartmentNo", data.apartmentNo);
    formData.append("password", data.password);
    formData.append("image", data.image[0]);
    registerMutation.mutate(formData);
  };

  const registerMutation = useMutation({
    mutationFn: (payload: FormData) => RegisterUser(payload),
    onSuccess: () => {
      redirect("/dashboard/home");
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err);
      setError("root", { type: "manual", message });
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col  px-1 gap-[clamp(0.6rem,1.2vh,1rem)] h-full overflow-auto"
    >
      <div className="flex items-center gap-3">
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
      <InputField
        placeholder="Home"
        error={errors.home?.message}
        {...register("home")}
      />
      <div className="rounded-xl overflow-hidden bg-gray-100 h-[clamp(4rem,10vh,6rem)]">
        <Image src={Map_img} alt="map" className=" object-contain" />
      </div>
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
          <span className="text-[#F85E00]">Terms & Conditions</span> &{" "}
          <span className="text-[#F85E00]">Privacy Policy</span>, And I
          Authorize The Collection And Use Of Phone Number For Two-Factor
          Authentication
        </p>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-xs">{errors.terms.message}</p>
      )}

      <Button className="h-12 bg-[#F85E00] text-white rounded-xl text-base">
        Sign Up
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
