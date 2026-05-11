"use client";

import { Button } from "@/components/ui/button";
import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { InputField } from "@/src/components/common/InputField";
import { SelectField } from "@/src/components/common/SelectField";
import { CreateProductPayload, createProductSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import DaySelector from "./DaySelector";
import { DaysOfWeek, User } from "@/src/types/index.type";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/src/lib/query/queryFn";
import {
  setCategoriesError,
  setCategoriesLoading,
  setCategoriesSuccess,
} from "@/src/lib/store/feature/appSlice";
import { useCategories, useSubCategories } from "@/src/lib/api/products";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { toUnixTimestamp } from "@/src/utils/helperFunctions";
import { ProductImagesInput } from "./ProductImagesInput";
import { CoverImageInput } from "./CoverImageInput";
import { useRouter } from "next/navigation";
import Loader from "@/src/components/common/Loader";
import { useUser } from "@/src/lib/api/user";
import { useSubmitSignature } from "@/src/lib/api/booking";
import z from "zod";
import { generateAgreementPdf } from "@/src/utils/helperFunctions/pdfFunction/imagePdfFunction";

type LocationData = {
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
};

const TimeOptions = [
  // { label: "12:00 AM", value: "00:00" },
  { label: "01:00 AM", value: "01:00" },
  { label: "02:00 AM", value: "02:00" },
  { label: "03:00 AM", value: "03:00" },
  { label: "04:00 AM", value: "04:00" },
  { label: "05:00 AM", value: "05:00" },
  { label: "06:00 AM", value: "06:00" },
  { label: "07:00 AM", value: "07:00" },
  { label: "08:00 AM", value: "08:00" },
  { label: "09:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "01:00 PM", value: "13:00" },
  { label: "02:00 PM", value: "14:00" },
  { label: "03:00 PM", value: "15:00" },
  { label: "04:00 PM", value: "16:00" },
  { label: "05:00 PM", value: "17:00" },
  { label: "06:00 PM", value: "18:00" },
  { label: "07:00 PM", value: "19:00" },
  { label: "08:00 PM", value: "20:00" },
  { label: "09:00 PM", value: "21:00" },
  { label: "10:00 PM", value: "22:00" },
  { label: "11:00 PM", value: "23:00" },
];

const CreateProductForm = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();
  const [isMap, setIsMap] = useState<boolean>(false);
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | undefined | null>(null);
  const [pendingProductFormData, setPendingProductFormData] =
    useState<FormData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { location: locationValue } = user || {};

  // ✅ get userId
  const userId = user?._id;

  // ✅ call query
  const { data: userData } = useUser(userId ?? "", {
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (userData?.data?.isSeller === false) {
      router.push("/app/home");
    }
  }, [userData, router]);

  const handleViewContract = async () => {
    const obj = Object.fromEntries(pendingProductFormData?.entries() || []);

    const url = await generateAgreementPdf(
      { itemName: obj.name, ownerName: userData?.data?.name },
      false,
      true,
      false,
    );
    setPdfUrl(url);
  };

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    location?: {
      type: "Point";
      coordinates: number[];
    };
  } | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");

  const [selectedDays, setSelectedDays] = useState<DaysOfWeek>();
  const { categories } = useAppSelector((state) => state.categories);

  const { data, isLoading, isError, error } = useCategories();
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } =
    useSubCategories(selectedCategoryId);

  // Store categories in Redux when data is fetched
  useEffect(() => {
    if (isLoading) {
      dispatch(setCategoriesLoading(true));
    }

    if (data?.data) {
      dispatch(setCategoriesSuccess(data?.data));
    }

    if (isError) {
      dispatch(
        setCategoriesError(error.message || "Failed to fetch categories"),
      );
    }
  }, [data, isLoading, isError, error, dispatch]);

  // Transform categories array to options format
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category.name.trim(), // trim to remove extra spaces
      value: category._id,
    }));
  }, [categories]);

  const handleDaysChange = (days: DaysOfWeek) => {
    setSelectedDays(days);
    setValue("availableDays", ["1"], { shouldValidate: true });
  };

  const subCategoryOptions = useMemo(() => {
    return subCategoriesData?.data?.map((subCategory) => ({
      label: subCategory.name.trim(),
      value: subCategory._id,
    }));
  }, [subCategoriesData]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(""); // Reset subcategory when category changes
    setValue("category", categoryId, { shouldValidate: true });
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategoryId(e.target.value);
    setValue("subCategory", e.target.value, { shouldValidate: true });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateProductPayload>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      description: "",
      quantity: "0",
      category: "",
      subCategory: "",
      availableDays: [],
      pickupTime: "",
      dropOffTime: "",
      hourlyPrice: "0",
      dailyPrice: "0",
      images: [],
      coverImage: undefined,
      location: {
        lat: 0,
        lng: 0,
        address: "",
        city: "",
        state: "",
        country: "",
      },
    },
  });

  const onLocationSelect = (loc: LocationData) => {
    if (!loc.location) {
      throw new Error("Location is missing");
    }

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

    setValue("location", { lat, lng }, { shouldValidate: true });
    // clearErrors("location");
  };

  // const createProductMutation = useMutation({
  //   mutationFn: createProduct,
  //   onSuccess: (response) => {
  //     SuccessToast("Product Created");
  //     router.push(`/app/products/${response?.data?._id}`);
  //   },
  //   onError: (err) => {
  //     const message = getAxiosErrorMessage(err || "Failed to create product");
  //     ErrorToast(message);
  //   },
  // });

  // ✅ Warn user about unsaved changes before leaving or refreshing
  const createProductMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: (response) => {
      SuccessToast("Product Created");

      reset();
      // signReset();

      setPdfUrl(null);
      // setPendingProductFormData(null);

      router.push(`/app/products/${response?.data?._id}`);
    },

    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Failed to create product");

      ErrorToast(message);
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !createProductMutation.isPending) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, createProductMutation.isPending]);

  // const onsubmit = (data: CreateProductPayload) => {
  //   const formData = new FormData();

  //   // Basic fields
  //   formData.append("name", data.productName);
  //   formData.append("description", data.description);
  //   formData.append("quantity", String(data.quantity));
  //   formData.append("categoryId", selectedCategoryId);
  //   formData.append("subCategoryId", selectedSubCategoryId);
  //   formData.append("pickupTime", toUnixTimestamp(data.pickupTime).toString());
  //   formData.append(
  //     "dropOffTime",
  //     toUnixTimestamp(data.dropOffTime).toString(),
  //   );

  //   formData.append("pricePerHour", String(data.hourlyPrice));
  //   formData.append("pricePerDay", String(data.dailyPrice));
  //   formData.append("pickupAddress", location?.address || "");

  //   // Available days
  //   selectedDays
  //     ?.filter((d) => d.enabled)
  //     .forEach((d) => {
  //       formData.append("availableDays[]", d.day);
  //     });

  //   // Location
  //   if (locationValue) {
  //     formData.append("longitude", String(location?.lng));
  //     formData.append("latitude", String(location?.lat));
  //   }

  //   // Cover image
  //   if (data.coverImage) {
  //     formData.append("cover", data.coverImage);
  //   }

  //   // Product images
  //   data.images.forEach((file) => {
  //     formData.append("images", file);
  //   });

  //   createProductMutation.mutate(formData);
  // };

  const onsubmit = async (data: CreateProductPayload) => {
    const formData = new FormData();

    // Basic fields
    formData.append("name", data.productName);
    formData.append("description", data.description);
    formData.append("quantity", String(data.quantity));
    formData.append("categoryId", selectedCategoryId);
    formData.append("subCategoryId", selectedSubCategoryId);

    formData.append("pickupTime", toUnixTimestamp(data.pickupTime).toString());

    formData.append(
      "dropOffTime",
      toUnixTimestamp(data.dropOffTime).toString(),
    );

    formData.append("pricePerHour", String(data.hourlyPrice));
    formData.append("pricePerDay", String(data.dailyPrice));

    formData.append("pickupAddress", location?.address || "");

    // Available days
    selectedDays
      ?.filter((d) => d.enabled)
      .forEach((d) => {
        formData.append("availableDays[]", d.day);
      });

    // Location
    if (locationValue) {
      formData.append("longitude", String(location?.lng));
      formData.append("latitude", String(location?.lat));
    }

    // Cover image
    if (data.coverImage) {
      formData.append("cover", data.coverImage);
    }

    // Product images
    data.images.forEach((file) => {
      formData.append("images", file);
    });

    // STORE TEMPORARILY
    setPendingProductFormData(formData);

    if (userData?.data?.signature === null) {
      handleViewContract();
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleSameAsProfile = () => {
    setIsMap(false);
    if (
      !user?.location?.coordinates ||
      user.location.coordinates.length !== 2
    ) {
      console.error("User location data is not available");
      return;
    }

    const [lng, lat] = user.location.coordinates;

    // Update the location state
    setLocation({
      lat,
      lng,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
    });

    // Update the form location field
    setValue("location", {
      lat,
      lng,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
    });

    clearErrors("location");
  };

  const handleClearLocation = () => {
    // Clear location state
    setLocation(null);

    // Clear form location field
    setValue("location", {
      lat: 0,
      lng: 0,
      address: "",
      city: "",
      state: "",
      country: "",
    });

    // Clear validation errors
    clearErrors("location");
    setIsMap(true);
  };

  const handleImageChange = useCallback(
    (files: File[]) =>
      setValue("images", files, { shouldValidate: true, shouldDirty: true }),
    [setValue],
  );

  const pickupTime = watch("pickupTime");

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // const filteredDropOffOptions = TimeOptions.filter((option) => {
  //   if (!pickupTime) return TimeOptions;

  //   const pickupMinutes = timeToMinutes(pickupTime);
  //   const dropMinutes = timeToMinutes(option.value);

  //   return dropMinutes >= pickupMinutes + 240;
  // });

  const filteredDropOffOptions = TimeOptions.filter((option) => {
    if (!pickupTime) return TimeOptions;

    const pickupMinutes = timeToMinutes(pickupTime);
    const dropMinutes = timeToMinutes(option.value);

    // Only allow forward progression OR next-day clearly
    if (dropMinutes <= pickupMinutes) return false;

    return dropMinutes >= pickupMinutes + 240;
  });

  const pickupTimeOptions = TimeOptions.filter(
    (option) => option.value <= "19:00",
  );

  const { mutateAsync: signContract, isPending } = useSubmitSignature();
  // const {
  //   register: signRegister,
  //   handleSubmit: handleSignSubmit,
  //   reset,
  //   formState: { errors: signErrors },
  // } = useForm<{ sign: string }>({
  //   resolver: zodResolver(
  //     z.object({
  //       sign: z
  //         .string()
  //         .trim()
  //         .min(1, "Signature is required")
  //         .min(2, "Signature must be at least 2 characters"),
  //     }),
  //   ),
  //   defaultValues: { sign: "" },
  // });
  const {
    register: signRegister,
    handleSubmit: handleSignSubmit,
    reset: signReset,
    formState: { errors: signErrors },
  } = useForm<{ sign: string }>({
    resolver: zodResolver(
      z.object({
        sign: z
          .string()
          .trim()
          .min(1, "Signature is required")
          .min(2, "Signature must be at least 2 characters"),
      }),
    ),
    defaultValues: {
      sign: "",
    },
  });

  // const onSignSubmit = async (formData: { sign: string }) => {
  //   signContract(
  //     {
  //       // name: user?.name || "User",
  //       signature: formData.sign,
  //     },
  //     {
  //       onSuccess: async () => {
  //         SuccessToast("Signature submitted successfully!");
  //         reset();
  //         setPdfUrl(null);
  //       },

  //       onError: (err) => {
  //         ErrorToast(err.message || "Failed to submit signature");
  //       },
  //     },
  //   );
  // };

  const onSignSubmit = async (formData: { sign: string }) => {
    try {
      // 1. SIGNATURE API
      await signContract({
        signature: formData.sign,
      });

      SuccessToast("Signature submitted successfully!");

      // 2. CREATE PRODUCT API
      if (!pendingProductFormData) {
        ErrorToast("Product data missing");
        return;
      }

      await createProductMutation.mutateAsync(pendingProductFormData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      ErrorToast(err?.message || "Failed to complete process");
    }
  };

  // If pdfUrl exists, show the viewer; otherwise show the product info
  if (pdfUrl) {
    return (
      <div className="relative">
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Review & Sign Agreement</h3>
            <Button
              variant="default"
              onClick={() => {
                setPdfUrl(null);
                // handleViewContract();
              }}
            >
              Close
            </Button>
          </div>

          {/* PDF View Area */}
          <div className="flex-grow   ">
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              title="PDF Viewer"
              className="border-none"
            />
          </div>
        </div>
        {/* Signature Form Area */}
        <div className="flex justify-center absolute z-50 top-125 left-80 right-0">
          <div className="p-6 border-t bg-white shadow-lg w-[600px] ">
            <form
              onSubmit={handleSignSubmit(onSignSubmit)}
              className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-end"
            >
              <div className="flex-grow w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type your full name to sign
                </label>
                <InputField
                  placeholder="Your Digital Signature"
                  error={signErrors.sign?.message}
                  {...signRegister("sign")}
                  inputType="letter"
                  maxLength={50}
                  disabled={isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto h-[45px] px-8"
                disabled={isPending || createProductMutation.isPending}
              >
                {isPending
                  ? "Submitting..."
                  : createProductMutation.isPending
                    ? "Creating Product..."
                    : "Confirm & Sign"}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3">
              By clicking &quot;Confirm & Sign&quot;, you agree to the terms
              listed in the document above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-3 sm:px-4 py-4 sm:py-6 text-white">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">
          Add Product
        </h1>
      </div>
      <form action="" onSubmit={handleSubmit(onsubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 sm:gap-6 items-stretch">
          <div className="w-full">
            <ProductImagesInput
              value={watch("images")}
              onChange={handleImageChange}
              error={errors.images?.message}
            />
          </div>

          <div className="w-full">
            <CoverImageInput
              value={watch("coverImage")}
              onChange={(file) => {
                if (file) {
                  setValue("coverImage", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              error={errors.coverImage?.message as string}
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              label="Product Name"
              error={errors.productName?.message}
              {...register("productName")}
              placeholder="Enter Product Name"
              inputType="letter"
            />
            <InputField
              error={errors.description?.message}
              {...register("description")}
              label="Description"
              placeholder="Enter Description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              inputType="numeric"
              label="Quantity"
              placeholder="Enter Quantity"
              error={errors.quantity?.message}
              {...register("quantity")}
            />
            <SelectField
              label="Category"
              placeholder="Select Category"
              options={categoryOptions}
              onChange={handleCategoryChange}
              error={errors?.category?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {selectedCategoryId && (
              <SelectField
                label="Sub Category"
                placeholder={
                  isSubCategoriesLoading
                    ? "Loading subcategories..."
                    : "Select Subcategory"
                }
                options={subCategoryOptions}
                onChange={handleSubCategoryChange}
                disabled={isSubCategoriesLoading || !selectedCategoryId}
                error={errors?.subCategory?.message}
              />
            )}

            <div>
              <DaySelector
                selectedDays={selectedDays}
                onChange={handleDaysChange}
                label="Working Days"
                showSelectedCount={true}
              />
              {errors?.availableDays && (
                <p className="text-red-600 text-xs sm:text-sm font-medium">
                  {errors?.availableDays?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            The product location you select must match your device&apos;s
            timezone for accurate booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <SelectField
            label="Pick Up Time"
            placeholder="Select"
            options={pickupTimeOptions}
            error={errors.pickupTime?.message}
            {...register("pickupTime")}
          />

          <SelectField
            label="Drop Off Time"
            placeholder="Select"
            options={filteredDropOffOptions}
            error={errors.dropOffTime?.message}
            {...register("dropOffTime")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <InputField
            inputType="numeric"
            label="Hourly Price"
            placeholder="Enter Price"
            error={errors.hourlyPrice?.message}
            {...register("hourlyPrice")}
          />
          <InputField
            inputType="numeric"
            label="Daily Price"
            placeholder="Enter Price"
            error={errors.dailyPrice?.message}
            {...register("dailyPrice")}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handleSameAsProfile}
            type="button"
            className="bg-primary cursor-pointer h-10 sm:h-12 rounded-xl px-4 sm:px-6 text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            Same as Profile
          </button>

          <button
            type="button"
            onClick={handleClearLocation}
            className="bg-accent text-foreground h-10 sm:h-12 cursor-pointer rounded-xl px-4 sm:px-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium whitespace-nowrap"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {isMap && (
          <p className="text-base sm:text-lg text-foreground mt-3 sm:mt-4">
            Pickup Address
          </p>
        )}
        <div className="mt-3 sm:mt-4">
          {/* <GoogleMapComponent onLocationSelect={onLocationSelect} /> */}
          <GoogleMapComponent
            onLocationSelect={onLocationSelect}
            editAddress={{
              address: location?.address,
              city: location?.city,
              state: location?.state,
              country: location?.country,
              // zipCode: location?.zipCode,
              location: {
                type: "Point",
                coordinates: [location?.lng || 0, location?.lat || 0],
              },
            }}
            isClear={location === null}
            error={errors?.location?.message}
          />
        </div>
        <div className="flex items-start gap-2 my-4 sm:my-6 text-xs sm:text-sm text-muted-foreground">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            Every booking comes with peace of mind! You&apos;ll get an email to
            review and sign the contract before pickup-every time. No signature,
            no handoff.
          </p>
        </div>

        {createProductMutation.isPending ? (
          <Loader show={createProductMutation.isPending || isPending} />
        ) : (
          <Button
            className="w-full h-10 sm:h-12 text-sm sm:text-base"
            type="submit"
            disabled={createProductMutation.isPending || isPending}
          >
            {createProductMutation.isPending
              ? "Creating Product..."
              : "Add Rental Product"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateProductForm;
