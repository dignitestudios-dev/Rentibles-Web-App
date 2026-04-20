"use client";

import { Button } from "@/components/ui/button";

import { InputField } from "@/src/components/common/InputField";
import { SelectField } from "@/src/components/common/SelectField";
import { UpdateProductPayload, updateProductSchema } from "@/src/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler, Resolver, useWatch } from "react-hook-form";
import DaySelector from "./DaySelector";
import { DaysOfWeek, User } from "@/src/types/index.type";
import { useAppDispatch, useAppSelector } from "@/src/lib/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/src/lib/query/queryFn";
import {
  setCategoriesError,
  setCategoriesLoading,
  setCategoriesSuccess,
} from "@/src/lib/store/feature/appSlice";
import {
  useCategories,
  useSubCategories,
  useProductById,
} from "@/src/lib/api/products";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { toUnixTimestamp } from "@/src/utils/helperFunctions";
import { ProductImagesInput } from "./ProductImagesInput";
import { CoverImageInput } from "./CoverImageInput";
import { useRouter } from "next/navigation";
import Loader from "@/src/components/common/Loader";
import GoogleMapComponent from "@/src/components/common/GoogleMapPicker";
import { defaultDaysOfWeek } from "./DaySelector";
import { DaySchedule } from "@/src/types/index.type";

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
];

interface Props {
  productId: string;
}

const mapAvailableDaysToSchedule = (
  availableDays: string[] = [],
): DaySchedule[] => {
  return defaultDaysOfWeek.map((day) => ({
    ...day,
    enabled: availableDays.includes(day.day),
  }));
};

const UpdateProductForm: React.FC<Props> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isMap, setIsMap] = useState<boolean>(false);
  const router = useRouter();
  const [existingPictures, setExistingPictures] = useState<string[]>([]); // Track remaining prefilled images

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const { data: productResp, isLoading: loadingProduct } =
    useProductById(productId);

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    location?: { type: "Point"; coordinates: number[] };
  } | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [selectedDays, setSelectedDays] =
    useState<DaysOfWeek>(defaultDaysOfWeek);

  const { categories } = useAppSelector((s) => s.categories);
  const { data, isLoading, isError, error } = useCategories();
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } =
    useSubCategories(selectedCategoryId);

  useEffect(() => {
    if (isLoading) dispatch(setCategoriesLoading(true));
    if (data?.data) dispatch(setCategoriesSuccess(data.data));
    if (isError)
      dispatch(
        setCategoriesError(error?.message || "Failed to fetch categories"),
      );
  }, [data, isLoading, isError, error, dispatch]);

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({ label: c.name.trim(), value: c._id }));
  }, [categories]);

  const subCategoryOptions = useMemo(() => {
    return subCategoriesData?.data?.map((s) => ({
      label: s.name.trim(),
      value: s._id,
    }));
  }, [subCategoriesData]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    watch,
    control,
    formState: { errors },
  } = useForm<UpdateProductPayload>({
    // this cast forces the resolver to match our strict payload type
    resolver: zodResolver(
      updateProductSchema,
    ) as Resolver<UpdateProductPayload>,
  });

  // Watch category and subcategory form fields to sync with local state
  const watchedCategoryId = useWatch({ control, name: "category" });
  const watchedSubCategoryId = useWatch({ control, name: "subCategory" });

  // Sync watched category to local state (triggers subcategory fetch)
  useEffect(() => {
    if (watchedCategoryId && watchedCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(watchedCategoryId);
    }
  }, [watchedCategoryId, selectedCategoryId]);

  // Sync watched subcategory to local state
  useEffect(() => {
    if (
      watchedSubCategoryId &&
      watchedSubCategoryId !== selectedSubCategoryId
    ) {
      setSelectedSubCategoryId(watchedSubCategoryId);
    }
  }, [watchedSubCategoryId, selectedSubCategoryId]);

  // read the images once so we don't pass the callable watch function itself to props
  const watchedImages = watch("images");

  // when product loads, prefill form
  useEffect(() => {
    if (!productResp?.data) return;
    const p = productResp.data;
    setSelectedCategoryId(p.category?._id || "");
    setSelectedSubCategoryId(p.subCategory?._id || "");
    setLocation({
      lat: p.pickupLocation?.coordinates?.[1] || 0,
      lng: p.pickupLocation?.coordinates?.[0] || 0,
      address: p.pickupAddress,
      city: undefined,
      state: undefined,
      country: undefined,
    });

    // convert unix timestamps to HH:MM strings
    const toTime = (ts?: number) => {
      if (!ts) return "";
      const d = new Date(ts * 1000);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    if (p?.availableDays) {
      const mappedDays = mapAvailableDaysToSchedule(p.availableDays);
      setSelectedDays(mappedDays);
    }

    reset({
      productName: p.name || "",
      description: p.description || "",
      quantity: String(p.quantity || 0),
      category: p.category?._id || "",
      subCategory: p.subCategory?._id || "",
      availableDays: p.availableDays || [],
      pickupTime: toTime(p.pickupTime),
      dropOffTime: toTime(p.dropOffTime),
      hourlyPrice: String(p.pricePerHour || 0),
      dailyPrice: String(p.pricePerDay || 0),
      images: [],
      // start with the current images as existing pictures so the schema stays happy
      existingPictures: p.images || [],
      coverImage: p.cover ? undefined : (null as any), // If no cover, require upload
      location: {
        lat: p.pickupLocation?.coordinates?.[1] || 0,
        lng: p.pickupLocation?.coordinates?.[0] || 0,
        address: p.pickupAddress || "",
        city: "",
        state: "",
        country: "",
      },
    });
  }, [productResp, reset]);

  // Handle remaining images from component
  const handleRemainingImages = useCallback((remainingUrls: string[]) => {
    setExistingPictures(remainingUrls);
    setValue("existingPictures", remainingUrls, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, []);

  const handleImageChange = useCallback(
    (files: File[]) =>
      setValue("images", files, { shouldValidate: true, shouldDirty: true }),
    [setValue],
  );

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      SuccessToast("Product updated");
      // navigate to updated product page
      queryClient.invalidateQueries({ queryKey: ["productById"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/app/products/${productId}`);
    },
    onError: (err) => {
      const msg = getAxiosErrorMessage(err || "Failed to update product");
      ErrorToast(msg);
    },
  });

  const onsubmit: SubmitHandler<UpdateProductPayload> = (data) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("name", data.productName);
    formData.append("description", data.description || "");
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

    selectedDays
      ?.filter((d) => d.enabled)
      .forEach((d) => {
        formData.append("availableDays[]", d.day);
      });

    if (location) {
      formData.append("longitude", String(location.lng));
      formData.append("latitude", String(location.lat));
    }

    if (data.coverImage) formData.append("cover", data.coverImage);
    data.images.forEach((f) => formData.append("images", f));
    // REMAINING prefilled images
    if (data.existingPictures?.length > 0) {
      data.existingPictures.forEach((url: string) => {
        formData.append("existingPictures", url);
      });
    }

    updateProductMutation.mutate(formData);
  };

  const handleDaysChange = (days: DaysOfWeek) => {
    setSelectedDays(days);
    setValue("availableDays", days?.map((d) => d.day) || [], {
      shouldValidate: true,
    });
  };

  const onLocationSelect = (loc: LocationData) => {
    if (!loc.location) return;
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
  };

  if (loadingProduct) return <Loader show={true} />;

  return (
    <div className=" mx-auto px-4 py-6 text-white">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-semibold text-foreground">Edit Product</h1>
      </div>

      <form action="" onSubmit={handleSubmit(onsubmit)}>
        <div className="flex w-full gap-2 items-stretch ">
          <ProductImagesInput
            value={watchedImages}
            prefilledImages={productResp?.data?.images || []}
            onChange={handleImageChange}
            onRemainingImages={handleRemainingImages}
            error={errors.images?.message}
          />

          <div className="w-[50%] shrink-0">
            <CoverImageInput
              value={watch("coverImage")} // New upload only
              prefilledImage={productResp?.data?.cover} // Prefilled URL from backend
              onChange={(file) =>
                setValue("coverImage", file as any, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={errors.coverImage?.message as string}
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              error={errors.productName?.message}
              {...register("productName")}
              placeholder="Enter Product Name"
            />
            <InputField
              error={errors.description?.message}
              {...register("description")}
              label="Description"
              placeholder="Enter Description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {...register("category")}
              error={errors?.category?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategoryId && (
              <SelectField
                label="Sub Category"
                placeholder={
                  isSubCategoriesLoading
                    ? "Loading subcategories..."
                    : "Select Subcategory"
                }
                options={subCategoryOptions}
                {...register("subCategory")}
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
                <p className="text-red-600 text-sm font-medium">
                  {errors?.availableDays?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            The product location you select must match your device&apos;s
            timezone for accurate booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <SelectField
            label="Pick Up Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.pickupTime?.message}
            {...register("pickupTime")}
          />
          <SelectField
            label="Drop Off Time"
            placeholder="Select"
            options={TimeOptions}
            error={errors.dropOffTime?.message}
            {...register("dropOffTime")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setIsMap(false);
              if (
                !user?.location?.coordinates ||
                user.location.coordinates.length !== 2
              )
                return;
              const [lng, lat] = user.location.coordinates;
              setLocation({
                lat,
                lng,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
              });
              setValue("location", {
                lat,
                lng,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
              });
              clearErrors("location");
            }}
            type="button"
            className="bg-primary cursor-pointer h-12 rounded-xl px-6 text-sm font-medium"
          >
            Same as Profile
          </button>

          <button
            type="button"
            onClick={() => {
              setLocation(null);
              setValue("location", {
                lat: 0,
                lng: 0,
                address: "",
                city: "",
                state: "",
                country: "",
              });
              clearErrors("location");
              setIsMap(true);
            }}
            className="bg-accent text-foreground h-12  cursor-pointer rounded-xl px-6 flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {isMap && (
          <p className="text-lg text-foreground mt-3"> Pickup Address</p>
        )}
        <div className="mt-3">
          <GoogleMapComponent
            onLocationSelect={onLocationSelect}
            editAddress={{
              address: location?.address,
              city: location?.city,
              state: location?.state,
              country: location?.country,
              location: {
                type: "Point",
                coordinates: [location?.lng || 0, location?.lat || 0],
              },
            }}
            isClear={location === null}
            error={errors?.location?.message}
          />
        </div>

        <div className="flex items-start gap-2 my-6 text-sm text-muted-foreground">
          <AlertCircle size={16} />
          <p>
            Every booking comes with peace of mind! You&apos;ll get an email to
            review and sign the contract before pickup-every time. No signature,
            no handoff.
          </p>
        </div>

        {updateProductMutation.isPending ? (
          <Loader show={updateProductMutation.isPending} />
        ) : (
          <Button
            className="w-full h-12 "
            type="submit"
            disabled={updateProductMutation.isPending}
          >
            Update Product
          </Button>
        )}
      </form>
    </div>
  );
};

export default UpdateProductForm;
