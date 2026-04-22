/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Profile_img } from "@/public/images/export";
import { InputField } from "../common/InputField";
import { useEffect, useState } from "react";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { EditProfilePayload } from "@/src/types/index.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileSchema } from "@/src/schema";
import { Controller, useForm } from "react-hook-form";
import Loader from "../common/Loader";
import GoogleMapComponent from "../common/GoogleMapPicker";
import { useDispatch } from "react-redux";
import { ErrorToast, SuccessToast } from "../common/Toaster";
import { useInvalidateAllQueries } from "@/src/hooks/useInvalidateAllQueries";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import { useUser } from "@/src/lib/api/user";
import { useAppSelector } from "@/src/lib/store/hooks";
import { ArrowLeft } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const libraries: Libraries = ["places"];

type EditProfileDraft = {
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  apartmentNo: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null;
};

const EditProfileForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { invalidateAll } = useInvalidateAllQueries();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  } | null>(null);

  const [currentLocation, setCurrentLocation] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const userId = currentUser?._id ?? "";
  const { data: userData, isLoading: usersLoading } = useUser(userId ?? "", {
    enabled: Boolean(userId),
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > MAX_FILE_SIZE) {
      ErrorToast(
        `File size must not exceed 20 MB. Current: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      );
      e.target.value = "";
      return;
    }

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
    control,
    formState: { errors },
  } = useForm<EditProfilePayload>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      image: undefined as any,
      fullName: "",
      email: "",
      phone: "",
      zipCode: "",
      apartmentNo: "",
      location: null,
    },
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (userData?.data) {
      const data = userData.data;
      setValue("fullName", data.name);
      setValue("email", data.email);
      setValue("phone", data.phone);
      setValue("zipCode", String(data.zipCode));
      setValue("apartmentNo", data.apartment);

      if (data.location?.coordinates) {
        const lat = data.location.coordinates[1];
        const lng = data.location.coordinates[0];
        setLocation({
          lat,
          lng,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
        });
        setValue("location", { lat, lng });
        setLatLng({ lat, lng });
      }

      if (data.profilePicture) {
        setPreview(data.profilePicture);
      }
    }
  }, [userData?.data, setValue]);

  const onSubmit = async (data: EditProfilePayload) => {
    try {
      setLoading(true);

      // TODO: Implement API call to update user profile
      // For now, just show success
      SuccessToast("Profile updated successfully");
      router.back();
    } catch (err: any) {
      const message = err?.message || "Failed to update profile.";
      setError("root", { type: "manual", message });
      ErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!isLoaded || latLng) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });
        setLocationError(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission denied. Please enable location services in your browser settings.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            "Location not available. Please ensure location services are enabled.",
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError(
            "Location request timed out. Please try again or enable location services.",
          );
        } else {
          setLocationError(
            "Unable to get your location. Please enable location services and try again.",
          );
        }
      },
    );
  }, [isLoaded, latLng]);

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader show={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className=" bg-white dark:bg-card ">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-4 px-1 overflow-y-auto scrollbar-hide p-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <label htmlFor="profile-upload">
            {preview ? (
              <div className="w-17 h-17 rounded-full overflow-hidden border border-dashed border-orange-400 flex items-center justify-center bg-gray-50 cursor-pointer">
                <img
                  src={preview}
                  alt="profile preview"
                  className="w-full h-full object-contain"
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

          <p className="text-sm text-gray-600">Update Profile Picture</p>

          <input
            id="profile-upload"
            type="file"
            accept=".jpg,.jpeg,.png"
            hidden
            {...register("image", {
              onChange: (e) => handleImageChange(e),
            })}
          />
        </div>
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">
            {errors.image.message as string}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            placeholder="Full Name"
            error={errors.fullName?.message}
            {...register("fullName")}
            inputType="letter"
            maxLength={50}
          />

          <InputField
            placeholder="Email Address"
            error={errors.email?.message}
            {...register("email")}
            inputType="email"
            maxLength={35}
          />
        </div>

        <div>
          <div className="bg-muted dark:bg-card p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number (Read-only)
            </label>
            <p className="mt-2 text-base text-gray-900 dark:text-white">
              {userData?.data?.phone}
            </p>
          </div>
        </div>

        <div>
          {latLng?.lat || location ? (
            <GoogleMapComponent
              onLocationSelect={onLocationSelect}
              latLng={currentLocation ? latLng : null}
              editAddress={
                location
                  ? {
                      address: location.address,
                      city: location.city,
                      state: location.state,
                      country: location.country,
                      zipCode: "",
                      location: {
                        type: "Point",
                        coordinates: [location.lng, location.lat],
                      },
                    }
                  : null
              }
              setCurrentLocation={setCurrentLocation}
            />
          ) : locationError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Location Access Required
              </p>
              <p className="text-sm text-red-600 mt-1">{locationError}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading map...</p>
          )}
        </div>

        {errors.location && (
          <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
        )}

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCurrentLocation(true);
            }}
            className="mb-2 h-10 w-full border-gray-300 text-sm"
          >
            Use My Current Location
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            placeholder="Zip Code"
            error={errors.zipCode?.message}
            {...register("zipCode")}
            maxLength={5}
            inputType="numeric"
          />

          <InputField
            placeholder="Apartment No"
            error={errors.apartmentNo?.message}
            {...register("apartmentNo")}
            inputType="letter"
          />
        </div>

        <Loader show={loading} />
        <Button
          disabled={loading || usersLoading}
          className="h-12 bg-[#F85E00] cursor-pointer text-white rounded-xl text-base"
        >
          {loading || usersLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
};

export default EditProfileForm;
