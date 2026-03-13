"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Phone,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import MediaViewer from "./_components/MediaViewer";
import { useProductById, useProductReviewById } from "@/src/lib/api/products";
import { NoDataFound } from "@/public/images/export";
import { TimeSlot } from "@/src/types/index.type";
import { ProductAvailability } from "./_components/product-availability";
// import { useForm } from "react-hook-form"; // unused
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import { getAxiosErrorMessage } from "@/src/utils/errorHandlers";
import { useCreateBooking } from "@/src/lib/api/booking";
import { useGetCards } from "@/src/lib/api/cards";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { calculateDistanceMiles } from "@/src/utils/helperFunctions";

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isBookNow, setIsBookNow] = useState(false);
  const [distance, setDistance] = useState("");

  const swiperRef = useRef<SwiperRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  // rentalDate state removed as it's no longer needed
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // const [rentalType, setRentalType] = useState<"day" | "hour">("day");
  // const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  const [selectionMode, setSelectionMode] = useState<"day" | "hour" | null>(
    null,
  );
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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

  const { data: reviewResponse } = useProductReviewById(productId);

  const { data: cardsData } = useGetCards();

  const createBookingMutation = useCreateBooking();

  // Extract product data from API response
  const product = apiResponse?.data;

  // Initialize selected card on mount or when cardsData changes
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
    }
  }, [cardsData, selectedCardId, product]);

  // Guard clause for loading/error states
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
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
    const newQty = quantity + change;
    const maxQuantity = product.quantity || product.totalQuantity || 0;

    if (newQty > 0 && newQty <= maxQuantity) {
      setQuantity(newQty);
    }
  };

  // Get store information (from user object since store is null in API response)
  const storeInfo = product.user || {};
  const storeImage = storeInfo.profilePicture || product.cover;

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
      router.push("/app/settings/card-details");
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
        productId: product._id,
        quantity,
        pickupTime: epochs.pickupTime,
        dropOffTime: epochs.dropOffTime,
        sourceId: selectedCardId,
        isContracted: false,
      });
      SuccessToast("Booking created successfully");
      setIsBookNow(false);
      setSelectedCardId(null);
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to create booking");
      ErrorToast(message);
    }
  };

  return (
    <div className="bg-background min-h-screen">
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

          <div className="w-10 h-10 rounded-full p-1 bg-primary ring-2 ring-primary overflow-hidden">
            <img
              src={storeImage}
              alt="store"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-0 md:px-6 py-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            {/* Image Carousel with Navigation */}
            <div className="mb-6 sticky top-20">
              <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-3 flex items-center justify-center group">
                {/* Left Chevron */}
                {product.images && product.images.length > 0 && (
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
                      src={product.images[activeImageIndex]}
                      alt={product.name || "product"}
                      onClick={() => setIsMediaViewerOpen(true)}
                      className="w-full h-96 md:h-125 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />

                    {/* Right Chevron */}
                    <button
                      onClick={() => {
                        if (activeImageIndex < product.images.length - 1) {
                          setActiveImageIndex(activeImageIndex + 1);
                        }
                      }}
                      className="absolute right-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                      disabled={activeImageIndex === product.images.length - 1}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Indicators */}
              {product.images && product.images.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {product.images.map((_, idx) => (
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
            {/* Product Name & Rating */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {product.name || "Unnamed Product"}
                </h2>
                {product.productReview !== undefined && (
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md whitespace-nowrap">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold">
                      {product.productReview || "0"}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                {product.description || "No description available"}
              </p>
            </div>

            <hr className="my-6 border-border" />

            {/* Pickup & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {distance
                    ? `${distance} Mile away`
                    : "Calculating distance..."}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {/* {product.pickupAddress ||
                    product.pickUpApartment ||
                    "Address not provided"} */}
                  Visible after booking.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-foreground/50" />
                  {/* <span className="text-base text-[14px]">
                    {storeInfo.phone || "Available after booking"}
                  </span> */}
                  Visible after booking.
                </div>
                <p className="text-sm text-foreground/40 dark:text-foreground/60">
                  {storeInfo.email || ""}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Category & SubCategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-foreground/50 dark:text-foreground/60">
                  {product.category?.name || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Sub Category</h3>
                <p className="text-foreground/50 dark:text-foreground/60">
                  {product.subCategory?.name || "Not specified"}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />
            {/* Estimated Total */}
            {isBookNow ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    {
                      label: "Subtotal",
                      value: `$${(product.pricePerDay * quantity).toFixed(2)}`,
                    },
                    {
                      label: "Duration",
                      value: (() => {
                        if (selectionMode === "day" && dateRange?.from) {
                          const from = dateRange.from;
                          const to = dateRange.to ?? dateRange.from;
                          const days =
                            Math.ceil(
                              (to.getTime() - from.getTime()) /
                                (1000 * 60 * 60 * 24),
                            ) + 1;
                          return `${days} day${days === 1 ? "" : "s"}`;
                        }
                        if (selectionMode === "hour" && timeSlots.length > 0) {
                          const sorted = [...timeSlots].sort(
                            (a, b) => a.startEpoch - b.startEpoch,
                          );
                          const start = new Date(sorted[0].startEpoch * 1000);
                          const end = new Date(
                            sorted[sorted.length - 1].endEpoch * 1000,
                          );
                          const hours =
                            (end.getTime() - start.getTime()) /
                            (1000 * 60 * 60);
                          return `${Math.max(1, Math.ceil(hours))} hour${
                            Math.ceil(hours) === 1 ? "" : "s"
                          }`;
                        }
                        return "—";
                      })(),
                    },
                    {
                      label: "Date",
                      value: (() => {
                        if (selectionMode === "day" && dateRange?.from) {
                          const from = dateRange.from;
                          const to = dateRange.to ?? dateRange.from;
                          const format = (date: Date) =>
                            new Intl.DateTimeFormat(undefined, {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }).format(date);
                          return from.getTime() === to.getTime()
                            ? format(from)
                            : `${format(from)} - ${format(to)}`;
                        }
                        if (selectionMode === "hour" && timeSlots.length > 0) {
                          const sorted = [...timeSlots].sort(
                            (a, b) => a.startEpoch - b.startEpoch,
                          );
                          const date = new Date(sorted[0].startEpoch * 1000);
                          return new Intl.DateTimeFormat(undefined, {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }).format(date);
                        }
                        return "—";
                      })(),
                    },
                    {
                      label: "Time",
                      value: (() => {
                        if (selectionMode === "hour" && timeSlots.length > 0) {
                          const sorted = [...timeSlots].sort(
                            (a, b) => a.startEpoch - b.startEpoch,
                          );
                          const fmt = (epoch: number) =>
                            new Date(epoch * 1000).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            );
                          return `${fmt(sorted[0].startEpoch)} - ${fmt(
                            sorted[sorted.length - 1].endEpoch,
                          )}`;
                        }
                        if (selectionMode === "day" && dateRange?.from) {
                          const start = new Date(product.pickupTime * 1000); // convert seconds → ms
                          const end = new Date(product.dropOffTime * 1000);

                          const fmt = (date: Date) =>
                            date.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            });

                          return `${fmt(start)} - ${fmt(end)}`;
                        }

                        return "—";
                      })(),
                    },
                    {
                      label: "Total Items",
                      value: `${quantity}`,
                    },
                  ].map((item) => (
                    <Fragment key={item.label}>
                      <div>
                        <p>{item.label}</p>
                      </div>
                      <div>
                        <p className="text-foreground/50 dark:text-foreground/60">
                          {item.value}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <p className="text-foreground">Payment Method</p>
                    </div>

                    <Button
                      variant="ghost"
                      type="button"
                      title="Select Card"
                      onClick={() => router.push("/app/settings/card-details")}
                      className="text-black"
                    >
                      Add Card
                    </Button>
                  </div>
                  <div>
                    {cardsData && cardsData.data.length > 0 ? (
                      cardsData.data.map((card) => (
                        <div
                          key={card._id}
                          onClick={() => setSelectedCardId(card._id)}
                          className={`flex items-center justify-between border-2 rounded-lg p-4 my-2 cursor-pointer transition-all ${
                            selectedCardId === card._id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedCardId(card._id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {card.brand?.toUpperCase()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                **** **** **** {card.last4}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Exp: {card.expMonth}/{card.expYear}
                              </p>
                            </div>
                          </div>
                          {selectedCardId === card._id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No cards available
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-primary mt-2 font-semibold">
                  <div>
                    <p>Total Amount</p>
                  </div>
                  <div className="flex justify-end">
                    <p>${(product.pricePerDay * quantity).toFixed(2)}</p>
                  </div>
                </div>
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
                />

                <hr className="my-6 border-border" />

                {/* Quantity */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      Quantity:{" "}
                      <span className="text-primary">
                        {availableQuantity || product.quantity || 0} Pcs
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
                        quantity >= (availableQuantity || product.quantity || 0)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {quantity >= (availableQuantity || product.quantity || 0) &&
                    (availableQuantity || product.quantity || 0) > 0 && (
                      <p className="text-xs text-orange-500 mt-2">
                        Maximum available quantity reached
                      </p>
                    )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        {!isBookNow && (
          <div className="mt-12 px-4 md:px-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">What People Say</h3>
              {reviewResponse?.data && reviewResponse.data.length > 0 && (
                <Link
                  href={`/app/products/${product._id}/reviews`}
                  className="text-primary hover:underline"
                >
                  See All
                </Link>
              )}
            </div>

            {/* Swiper for Reviews */}
            {reviewResponse?.data && reviewResponse.data.length > 0 ? (
              <Swiper
                ref={swiperRef}
                modules={[Navigation, A11y]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  768: {
                    slidesPerView: 1.5,
                  },
                  1024: {
                    slidesPerView: 2,
                  },
                }}
                className="reviews-swiper"
              >
                {reviewResponse?.data?.map((review) => (
                  <SwiperSlide key={review._id}>
                    <div className="bg-muted dark:bg-card p-6 rounded-2xl h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full p-1 bg-primary ring-2 ring-primary shrink-0 overflow-hidden">
                          <img
                            src={review.user.profilePicture}
                            alt={review.user.name}
                            className="w-full h-full object-fill rounded-full"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-lg">
                              {review.user.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-primary text-primary" />
                              <span className="font-semibold text-sm">
                                {review.stars}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {review.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex justify-center items-center w-full mt-10">
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={NoDataFound}
                    alt="Review_Search"
                    className="w-48"
                  />
                  <p className="text-foreground mt-2 font-semibold">
                    No Reviews Available
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Now Button - Fixed Bottom */}
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
                className="flex-1 max-w-sm bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-4 rounded-lg transition-colors text-lg"
                onClick={() => {
                  setIsBookNow(false);
                  setSelectedCardId(null);
                }}
              >
                Go Back
              </button>
              <button
                className="flex-1 max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  product.isBooked ||
                  !product.isActive ||
                  !selectedCardId ||
                  !getBookingEpochs() ||
                  createBookingMutation.isPending
                }
                onClick={handleBookNow}
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
              disabled={product.isBooked || !product.isActive}
              onClick={() => {
                if (!getBookingEpochs()) {
                  ErrorToast("Please select booking date and time first");
                  return;
                }
                setIsBookNow(true);
              }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {product.images && product.images.length > 0 && (
        <MediaViewer
          images={product.images}
          initialIndex={activeImageIndex}
          isOpen={isMediaViewerOpen}
          onClose={() => setIsMediaViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
