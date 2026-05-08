"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Heart,
  Flag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";

import MediaViewer from "./_components/MediaViewer";
import BookingSummary from "./_components/BookingSummary";
import PaymentCards from "./_components/PaymentCards";
import ReviewSection from "./_components/ReviewSection";
import ProductInfoSection from "./_components/ProductInfoSection";
import { useProductById } from "@/src/lib/api/products";
import { TimeSlot, User } from "@/src/types/index.type";
import { ProductAvailability } from "./_components/product-availability";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import {
  useCreateBooking,
  useSignDetails,
  useSubmitSignature,
} from "@/src/lib/api/booking";
import { useGetCards } from "@/src/lib/api/cards";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { calculateDistanceMiles } from "@/src/utils/helperFunctions";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWishlist } from "@/src/lib/query/queryFn";
import { reportUser } from "@/src/lib/api/user";
import Loader from "@/src/components/common/Loader";
import ReportProductModal from "./_components/ReportProductModal";
import { ReportProductContent } from "./_components/reportProductOptions";
import { generateRentalPolicyPDF } from "./../../../../utils/helperFunctions/pdfFunction/pdfFunction";
import ContractModal from "@/src/components/common/ContractModal";
import { generateAgreementPdf } from "./../../../../utils/helperFunctions/pdfFunction/imagePdfFunction";
import { InputField } from "@/src/components/common/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/src/lib/axiosInstance";

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | undefined>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : undefined;
    }
    return undefined;
  });
  const { _id: userId } = user || {};

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isBookNow, setIsBookNow] = useState(false);
  const [distance, setDistance] = useState("");
  const [contractOpen, setContractOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | undefined | null>(null);
  const [isPDFView, setIsPDFView] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  // rentalDate state removed as it's no longer needed
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // const [rentalType, setRentalType] = useState<"day" | "hour">("day");
  const [selectedDate, setSelectedDate] = useState<boolean>(false);

  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  const [selectionMode, setSelectionMode] = useState<"day" | "hour" | null>(
    null,
  );

  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Wishlist state
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Report state
  const [showReportProductForm, setShowReportProductForm] =
    useState<boolean>(false);
  const [isReporting, setIsReporting] = useState<boolean>(false);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // data hooks must run unconditionally at top of component
  const { data: apiResponse, isLoading, isError } = useProductById(productId);
  const { data: signData } = useSignDetails(productId, {
    enabled: true,
  });

  const { data: cardsData } = useGetCards();

  const createBookingMutation = useCreateBooking();

  // Wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: async (payload: { productId: string; value: boolean }) => {
      const formData = {
        productId: payload.productId,
        value: payload.value,
      };
      return createWishlist(formData);
    },
    onSuccess: (data, variables) => {
      setIsLiked(variables.value);
      SuccessToast(
        variables.value ? "Added to wishlist" : "Removed from wishlist",
      );
    },
    onError: (err) => {
      const message = getAxiosErrorMessage(err || "Failed to update wishlist");
      ErrorToast(message);
    },
    // onSettled: () => {

    //   queryClient.invalidateQueries( { queryKey: ["productById", productId] });
    // },
  });

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!product?._id) return;
    wishlistMutation.mutate({
      productId: product._id,
      value: !isLiked,
    });
  };

  // Handle report product
  const handleReportProduct = async (reasonId: string, details?: string) => {
    if (!product?.user?._id) return;

    const selectedReason = ReportProductContent.find(
      (reason) => reason.id === reasonId,
    );

    setIsReporting(true);
    try {
      const payload = {
        title: selectedReason?.label || "Report Product",
        description:
          reasonId === "other"
            ? details || selectedReason?.description || "Other"
            : selectedReason?.description ||
              selectedReason?.label ||
              "Report Product",
        userId: product.user._id,
      };
      await reportUser(payload);
      SuccessToast("Product reported successfully");
      setShowReportProductForm(false);
    } catch (error) {
      const message = getAxiosErrorMessage(error || "Failed to report product");
      ErrorToast(message);
    } finally {
      setIsReporting(false);
    }
  };

  // Extract product data from API response

  // const product = apiResponse?.data;
  //show thumbnail first
  const rawProduct = apiResponse?.data;

  const product = rawProduct
    ? {
        ...rawProduct,
        images: rawProduct.cover
          ? [rawProduct.cover, ...(rawProduct.images || [])]
          : rawProduct.images || [],
      }
    : null;

  // const { mutate: signContract, isPending } = useSubmitSignature();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  // const onSignSubmit = (formData: { sign: string }) => {
  //   setPdfUrl(null); // Close the PDF preview
  //   signContract(
  //     {
  //       bookingId: "", // Using product ID as booking ID
  //       name: user?.name || "User",
  //       signature: formData.sign,
  //     },
  //     {
  //       onSuccess: () => {
  //         SuccessToast("Signature submitted successfully!");
  //         setPdfUrl(null); // Close the preview
  //         reset(); // Clear the form
  //       },
  //       onError: (err) => {
  //         ErrorToast(err.message || "Failed to submit signature");
  //       },
  //     },
  //   );
  // };

  // Initialize selected card on mount or when cardsData changes

  const onSignSubmit = async (formData: { sign: string }) => {
    setIsPending(true);
    const epochs = getBookingEpochs();

    if (!epochs) {
      ErrorToast("Please select booking date and time");
      return;
    }

    if (!selectedCardId) {
      ErrorToast("Please select a card");
      return;
    }

    try {
      // ─────────────────────────────────────────────
      // 1. CREATE BOOKING
      // ─────────────────────────────────────────────
      const bookingResponse = await createBookingMutation.mutateAsync({
        productId: product?._id,
        quantity,
        pickupTime: epochs.pickupTime,
        dropOffTime: epochs.dropOffTime,
        sourceId: selectedCardId,
        isContracted: false,
      });

      console.log("🚀 ~ onSignSubmit ~ bookingResponse:", bookingResponse);

      if (!bookingResponse?.success) {
        ErrorToast("Booking creation failed");
        return;
      }

      const paymentIntentId = bookingResponse?.data?.paymentIntent;

      if (!paymentIntentId) {
        ErrorToast("Payment Intent not found");
        return;
      }

      // ─────────────────────────────────────────────
      // 2. CHECK BOOKING STATUS
      // ─────────────────────────────────────────────
      const paymentStatusResponse = await axiosInstance.post(
        "/booking/status",
        {
          paymentIntentId,
        },
      );

      console.log("🚀 ~ paymentStatusResponse:", paymentStatusResponse);

      if (!paymentStatusResponse?.data?.success) {
        ErrorToast("Payment status verification failed");
        return;
      }

      const bookingId = paymentStatusResponse?.data?.data?._id;

      if (!bookingId) {
        ErrorToast("Booking ID not found");
        return;
      }

      // ─────────────────────────────────────────────
      // 3. SUBMIT SIGNATURE
      // ─────────────────────────────────────────────
      const signaturePayload = {
        bookingId,
        name: user?.name || "User",
        signature: formData.sign,
      };

      const signContractResponse = await axiosInstance.post(
        "/contract/user-signature",
        signaturePayload,
      );

      console.log("🚀 ~ signContractResponse:", signContractResponse);

      if (!signContractResponse?.data?.success) {
        ErrorToast("Failed to submit signature");
        return;
      }

      // ─────────────────────────────────────────────
      // 4. SUCCESS FLOW
      // ─────────────────────────────────────────────
      SuccessToast("Contract signed successfully");

      setPdfUrl(null);
      setIsBookNow(false);
      setSelectedCardId(null);

      reset();

      router.push("/app/tracking");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("🚀 ~ onSignSubmit ~ error:", error);

      const message = getAxiosErrorMessage(error, "Failed to complete booking");

      ErrorToast(message);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (cardsData?.data && cardsData.data.length > 0 && !selectedCardId) {
      // Select default card if exists, otherwise select first card
      const defaultCard = cardsData.data.find((card) => card.default);
      setSelectedCardId(defaultCard?._id || cardsData.data[0]._id);
    }
    if (product) {
      const productLat = product?.pickupLocation.coordinates[1];
      const productLng = product?.pickupLocation.coordinates[0];

      let distance = null;

      if (latitude && longitude) {
        distance = calculateDistanceMiles(
          latitude,
          longitude,
          productLat,
          productLng,
        ).toFixed(2);
        setDistance(distance);
      }

      // Set initial liked state from product
      setIsLiked(product?.isLiked ?? false);
    }
  }, [cardsData, selectedCardId, product]);

  // Guard clause for loading/error states
  if (isLoading) {
    return <Loader show={isLoading} />;
  }

  if (isError || !product) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">
            Failed to load product
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle quantity change with proper validation
  const handleQuantityChange = (change: number) => {
    const booking = getBookingEpochs();
    if (getBookingEpochs() || selectedDate) {
      const newQty = quantity + change;
      const maxQuantity = product?.quantity || product?.totalQuantity || 0;

      if (newQty > 0 && newQty <= maxQuantity) {
        setQuantity(newQty);
      }
    } else {
      ErrorToast("Please select booking date and time first");
      return;
    }
  };

  // Get store information (from user object since store is null in API response)
  const storeInfo = product?.user || {};
  const storeImage = storeInfo.profilePicture || product?.cover;

  const handleSlotSelect = (slots: TimeSlot[]) => {
    setTimeSlots(slots);
    getBookingEpochs();
  };

  // day selection callback removed; handled via dateRange instead

  // moved above early returns
  // const createBookingMutation = useCreateBooking(); // see api function below

  // 3. Compute pickupTime / dropOffTime right before submit
  const getBookingEpochs = (): {
    pickupTime: number;
    dropOffTime: number;
  } | null => {
    if (selectionMode === "hour" && timeSlots.length >= 4) {
      const sorted = [...timeSlots].sort((a, b) => a.startEpoch - b.startEpoch);
      return {
        pickupTime: sorted[0].startEpoch, // already UTC epoch seconds
        dropOffTime: sorted[sorted.length - 1].endEpoch,
      };
    }

    if (selectionMode === "day" && dateRange?.from) {
      const from = dateRange.from;
      const to = dateRange.to ?? dateRange.from; // single-day = same day

      // midnight UTC of each date
      const pickupTime = Math.floor(
        Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()) / 1000,
      );
      const dropOffTime = Math.floor(
        Date.UTC(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59) /
          1000,
      );
      return { pickupTime, dropOffTime };
    }

    return null;
  };

  // 4. Book Now handler
  const handleBookNow = async () => {
    const epochs = getBookingEpochs();

    if (!epochs) return; // button should already be disabled, but guard anyway

    if (!cardsData?.data || cardsData.data.length === 0) {
      ErrorToast("Please add a card first");
      // router.push("/app/settings/card-details");
      return;
    }

    if (!selectedCardId) {
      ErrorToast("Please select a card");
      return;
    }

    const selectedCard = cardsData.data.find(
      (card) => card._id === selectedCardId,
    );
    if (!selectedCard) {
      ErrorToast("Selected card not found");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        productId: product?._id,
        quantity,
        pickupTime: epochs.pickupTime,
        dropOffTime: epochs.dropOffTime,
        sourceId: selectedCardId,
        isContracted: false,
      });
      SuccessToast("Booking created successfully");
      setIsBookNow(false);
      setSelectedCardId(null);
      router.push("/app/tracking");
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to create booking");
      ErrorToast(message);
    }
  };

  const handleViewContract = async () => {
    const url = await generateAgreementPdf(
      {
        itemName: product.name,
        pickupTime: product.pickupTime,
        dropOffTime: product?.dropOffTime,
        quantity: quantity,
        code: "",
        selectionMode: selectionMode,
        dateRange,
        timeSlots,
        hourlyPrice: product.pricePerHour,
        dailyPrice: product.pricePerDay,
        ownerName: product.user?.name || "Owner",
        ownerSign: signData?.data?.store?.signature,
      },
      false,
      false,
      isPDFView,
    );

    setPdfUrl(url);
  };

  // If pdfUrl exists, show the viewer; otherwise show the product info
  if (pdfUrl) {
    return (
      <div className="relative">
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800">Review & Sign Agreement</h3>
            <Button variant="ghost" onClick={() => setPdfUrl(null)}>
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

          {/* Signature Form Area */}
        </div>
        {isBookNow && (
          <div className="flex justify-center absolute z-50 top-125 left-80 right-0">
            <div className="p-6 border-t bg-white shadow-lg w-[600px] ">
              <form
                onSubmit={handleSubmit(onSignSubmit)}
                className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-grow w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type your full name to sign
                  </label>
                  <InputField
                    placeholder="Your Digital Signature"
                    error={errors.sign?.message}
                    {...register("sign")}
                    inputType="text"
                    maxLength={50}
                    disabled={isPending}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto h-[45px] px-8"
                  disabled={isPending || createBookingMutation.isPending}
                >
                  {isPending || createBookingMutation.isPending
                    ? "Submitting..."
                    : "Confirm & Sign"}
                </Button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-3">
                By clicking &quot;Confirm & Sign&quot;, you agree to the terms
                listed in the document above.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Loader show={isReporting} />
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Product Details</h1>

          <div className="flex items-center gap-3">
            {/* {product?.user?._id !== userId && (
              <>
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistMutation.isPending}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setShowReportProductForm(true)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  title="Report product"
                >
                  <Flag className="w-5 h-5 text-gray-400" />
                </button>
              </>
            )} */}
            <Link
              href={
                product?.user?._id
                  ? `/app/users/${product?.user?._id}`
                  : `/app/store/${product?.store?._id}`
              }
              className="cursor-pointer w-12 h-12 rounded-full p-1 bg-primary ring-[.5px] ring-primary overflow-hidden"
            >
              <Image
                src={storeImage}
                alt="store"
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-full"
                unoptimized
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-0 md:px-6 py-6 pb-6 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            {/* Image Carousel with Navigation */}
            <div className="mb-6 sticky top-20">
              <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-3 flex items-center justify-center group">
                {/* Left Chevron */}
                {product?.images && product?.images.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        if (activeImageIndex > 0) {
                          setActiveImageIndex(activeImageIndex - 1);
                        }
                      }}
                      className="absolute left-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                      disabled={activeImageIndex === 0}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <img
                      src={product?.images[activeImageIndex]}
                      alt={product?.name || "product"}
                      onClick={() => setIsMediaViewerOpen(true)}
                      className="w-full h-96 md:h-125 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    />

                    {/* Right Chevron */}
                    <button
                      onClick={() => {
                        if (activeImageIndex < product?.images.length - 1) {
                          setActiveImageIndex(activeImageIndex + 1);
                        }
                      }}
                      className="absolute right-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                      disabled={activeImageIndex === product?.images.length - 1}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Indicators */}
              {product?.images && product?.images.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {product?.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeImageIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1">
            <ProductInfoSection
              product={product}
              distance={distance}
              storeInfo={storeInfo}
              isLiked={isLiked}
              onWishlistToggle={handleWishlistToggle}
              onReport={() => setShowReportProductForm(true)}
              isWishlistLoading={wishlistMutation.isPending}
            />

            <div className="my-2">
              <div className="flex justify-between items-center mb-2">
                {!isBookNow && (
                  <>
                    <h3 className="text-lg font-semibold">
                      Contracted Product
                    </h3>
                    <Button onClick={handleViewContract}>
                      {" "}
                      View Contract{" "}
                    </Button>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Booking made simple! Check your email, sign the contract, and
                  you&apos;re good to pickup. No signature, no item -- it&apos;s
                  that easy!
                </p>
              </div>
            </div>

            {product?.user?._id !== userId && (
              <>
                {isBookNow ? (
                  <>
                    <BookingSummary
                      product={product}
                      quantity={quantity}
                      selectionMode={selectionMode}
                      dateRange={dateRange}
                      timeSlots={timeSlots}
                    />
                    <PaymentCards
                      cardsData={cardsData}
                      selectedCardId={selectedCardId}
                      setSelectedCardId={setSelectedCardId}
                    />
                  </>
                ) : (
                  <>
                    {/* Pricing */}
                    <ProductAvailability
                      product={product}
                      onSlotSelect={handleSlotSelect}
                      setAvailableQuantity={setAvailableQuantity}
                      onSelectionModeChange={setSelectionMode} // ← new
                      onDateRangeChange={setDateRange} // ← new
                      onDaySelect={(date) => setSelectedDate(date)}
                    />

                    <hr className="my-6 border-border" />

                    {/* Quantity */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">
                          Quantity:{" "}
                          <span className="text-primary">
                            {availableQuantity || product?.quantity || 0} Pcs
                            Available
                          </span>
                        </h3>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        {quantity} {quantity === 1 ? "Item" : "Items"} Selected
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="px-4 py-2 text-gray-400 hover:text-foreground transition-colors disabled:opacity-50"
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-5 h-5" />
                        </button>

                        <span className="text-xl font-semibold w-12 text-center">
                          {quantity}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                          disabled={
                            quantity >=
                            (availableQuantity || product?.quantity || 0)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {quantity >=
                        (availableQuantity || product?.quantity || 0) &&
                        (availableQuantity || product?.quantity || 0) > 0 && (
                          <p className="text-xs text-orange-500 mt-2">
                            Maximum available quantity reached
                          </p>
                        )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {product?.user?._id !== userId && (
          <>
            <ReviewSection productId={productId} isBookNow={isBookNow} />
          </>
        )}
      </div>
      {/* Book Now Button - Fixed Bottom */}
      {product?.user?._id !== userId && (
        <div className="w-full flex flex-col justify-center gap-4 bg-background border-t border-border px-4 py-4 md:px-6 md:py-5 z-50">
          {isBookNow && !selectedCardId && (
            <p className="text-center text-sm text-orange-500 font-medium">
              Please select a payment method to continue
            </p>
          )}
          <div className="flex justify-center gap-4">
            {isBookNow ? (
              <>
                <button
                  type="button"
                  className="flex-1 max-w-sm bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-4 rounded-lg transition-colors text-lg"
                  onClick={() => {
                    setIsBookNow(false);
                    setIsPDFView(true);
                    setSelectedCardId(null);
                  }}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="flex-1 max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    product?.isBooked ||
                    !product?.isActive ||
                    !selectedCardId ||
                    createBookingMutation.isPending ||
                    !getBookingEpochs()
                  }
                  onClick={handleViewContract}
                  title={
                    !selectedCardId
                      ? "Please select a payment method"
                      : !getBookingEpochs()
                        ? "Please select a date/time slot"
                        : ""
                  }
                >
                  {createBookingMutation.isPending
                    ? "Booking..."
                    : "Confirm Booking"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="flex-1 max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors text-lg disabled:opacity-50"
                disabled={product?.isBooked || !product?.isActive}
                onClick={() => {
                  if (getBookingEpochs() || selectedDate) {
                    setIsBookNow(true);
                    setIsPDFView(false);
                  } else {
                    ErrorToast("Please select booking date and time first");
                    return;
                  }
                }}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {product?.images && product?.images.length > 0 && (
        <MediaViewer
          images={product?.images}
          initialIndex={activeImageIndex}
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
        />
      )}

      <ReportProductModal
        isOpen={showReportProductForm}
        onClose={() => setShowReportProductForm(false)}
        onSubmit={handleReportProduct}
        isLoading={isReporting}
        title="Report Product"
        reasons={ReportProductContent}
      />
      <ContractModal
        open={contractOpen}
        onClose={() => setContractOpen(false)}
        product={{
          productName: product.name,
          pickupTime: product.pickupTime,
          dropOffTime: product?.dropOffTime,
          quantity: quantity,
          productId: product._id,
          selectionMode: selectionMode,
          dateRange,
          timeSlots,
          hourlyPrice: product.pricePerHour,
          dailyPrice: product.pricePerDay,
          renterName: user?.name || "Renter",
          ownerName: product.user?.name || "Owner",
        }}
      />
    </div>
  );
};

export default ProductDetailsPage;
