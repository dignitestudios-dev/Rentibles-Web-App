"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Phone,
  MapPin,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import MediaViewer from "./_components/MediaViewer";
import { useProductById, useProductReviewById } from "@/src/lib/api/products";
import { NoDataFound } from "@/public/images/export";
import { Calendar } from "@/components/ui/calendar";
import { generateTimeSlots } from "@/src/utils/helperFunctions";
import { TimeSlot } from "@/src/types/index.type";

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const swiperRef = useRef<SwiperRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

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

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useProductById(productId);

  const {
    data: reviewResponse,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useProductReviewById(productId);

  // Extract product data from API response
  const product = apiResponse?.data;

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

  const { slots, totalHours, pickupLabel, dropOffLabel } = generateTimeSlots(
    product?.pickupTime,
    product?.dropOffTime,
  );

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

  // Format availability days
  const availableDays = product.availableDays || [];
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select a date";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Convert day names to day indices (0 = Sunday, 1 = Monday, etc.)
  const availableDayIndices = availableDays.map((day) => {
    const dayMap: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return dayMap[day.toLowerCase()] ?? -1;
  });

  // Check if a date is available based on availableDays
  const isDateAvailable = (date: Date): boolean => {
    if (availableDayIndices.length === 0) return true; // If no restrictions, all dates are available
    return availableDayIndices.includes(date.getDay());
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
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
                  {product.distance || "Distance not available"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {product.pickupAddress ||
                    product.pickUpApartment ||
                    "Address not provided"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-base text-[14px]">
                    {storeInfo.phone || "Available after booking"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {storeInfo.email || ""}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Category & SubCategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.category?.name || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Sub Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.subCategory?.name || "Not specified"}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Pricing */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>

              <div className="flex  gap-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-orange-400/20 dark:bg-orange-900/10 px-6 py-4 rounded-2xl hover:bg-orange-400/30 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-between"
                >
                  <div className="text-left flex-1">
                    <p className="text-2xl font-bold text-primary">
                      ${product.pricePerHour.toLocaleString()}/
                      <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                        hr
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedDate
                        ? formatDate(selectedDate)
                        : "Tap to select date"}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-orange-400/20 dark:bg-orange-900/10 px-6 py-4 rounded-2xl hover:bg-orange-400/30 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-between"
                >
                  <p className="text-2xl font-bold text-primary">
                    ${(product.pricePerDay || 0).toLocaleString()}/
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                      day
                    </span>
                  </p>
                </button>
              </div>
            </div>
            {isOpen && (
              <Calendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // Disable past dates
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  date.setHours(0, 0, 0, 0);

                  if (date < today) return true;

                  // Disable dates not in availableDays
                  return !isDateAvailable(date);
                }}
                className="shadow-lg border-2 border-primary/20"
              />
            )}

            {isOpen && (
              <>
                {slots.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No available time slots.
                  </p>
                ) : (
                  <>
                    {/* Summary row */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {pickupLabel}
                      </span>
                      <span>→</span>
                      <span className="font-medium text-gray-700">
                        {dropOffLabel}
                      </span>
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {totalHours % 1 === 0
                          ? `${totalHours}h`
                          : `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`}{" "}
                        total
                      </span>
                    </div>

                    {/* Slot grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slot) => {
                        const isSelected =
                          selectedSlot?.startEpoch === slot.startEpoch;
                        return (
                          <button
                            key={slot.startEpoch}
                            type="button"
                            // onClick={() => handleSelect(slot)}
                            className={[
                              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150",
                              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50",
                            ].join(" ")}
                          >
                            <span className="block">{slot.startLabel}</span>
                            <span className="block text-xs opacity-70">
                              – {slot.endLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected feedback */}
                    {selectedSlot && (
                      <p className="mt-3 text-sm text-blue-600 font-medium">
                        ✓ Selected: {selectedSlot.label}
                      </p>
                    )}
                  </>
                )}
              </>
            )}

            <hr className="my-6 border-border" />

            {/* Availability Days */}
            {/* {availableDays.length > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Available Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map((day) => (
                      <span
                        key={day}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <hr className="my-6 border-border" />
              </>
            )} */}

            {/* Quantity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  Quantity:{" "}
                  <span className="text-primary">
                    {product.quantity || 0} Pcs Available
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
                  disabled={quantity >= (product.quantity || 0)}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {quantity >= (product.quantity || 0) && product.quantity > 0 && (
                <p className="text-xs text-orange-500 mt-2">
                  Maximum available quantity reached
                </p>
              )}
            </div>
            {/* Estimated Total */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Estimated total (1 day rental):
              </p>
              <p className="text-2xl font-bold">
                ${((product.pricePerDay || 0) * quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width */}
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
                          className="w-full h-full object-cover rounded-full"
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
                <Image src={NoDataFound} alt="Review_Search" className="w-48" />
                <p className="text-foreground mt-2 font-semibold">
                  No Reviews Available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Now Button - Fixed Bottom */}
      <div className="w-full flex justify-center gap-4 bg-background border-t border-border px-4 py-4 md:px-6 md:py-5 z-50">
        <button
          className="flex-1 max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors text-lg disabled:opacity-50"
          disabled={product.isBooked || !product.isActive}
          onClick={() => {
            // Handle booking with quantity
            console.log(`Booking ${quantity} items of product ${product._id}`);
            // Add your booking logic here
          }}
        >
          Book Now
        </button>
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
