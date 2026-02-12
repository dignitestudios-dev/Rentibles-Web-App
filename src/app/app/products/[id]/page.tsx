"use client";

import React, { useState, useRef } from "react";
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
import { useProductById } from "@/src/lib/api/products";

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useProductById(productId);

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

            {/* Availability Days */}
            {availableDays.length > 0 && (
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
            )}

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

            <hr className="my-6 border-border" />

            {/* Pricing */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>

              <div className="flex flex-wrap gap-4">
                <div className="bg-orange-400/20 dark:bg-orange-900/10 px-6 py-4 rounded-2xl flex-1 min-w-fit">
                  <p className="text-2xl font-bold text-primary">
                    ${(product.pricePerHour || 0).toLocaleString()}/
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                      hr
                    </span>
                  </p>
                </div>

                <div className="bg-orange-400/20 dark:bg-orange-900/10 px-6 py-4 rounded-2xl flex-1 min-w-fit">
                  <p className="text-2xl font-bold text-primary">
                    ${(product.pricePerDay || 0).toLocaleString()}/
                    <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                      day
                    </span>
                  </p>
                </div>
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

            {/* Status Badges */}
            {/* <div className="flex flex-wrap gap-2 mb-6">
              {product.isActive && (
                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              )}
              {product.isBooked && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  Currently Booked
                </span>
              )}
              {product.isLiked && (
                <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                  Liked
                </span>
              )}
            </div> */}
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        {/* Remove this section if you don't have reviews data from API */}
        {/* You can add it back once you integrate reviews API */}
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
          Book Now ({quantity})
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
