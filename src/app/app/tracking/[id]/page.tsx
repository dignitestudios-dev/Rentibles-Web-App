"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import MediaViewer from "../../products/[id]/_components/MediaViewer";
import { useBookingDetails, useCancelBooking } from "@/src/lib/api/booking";
import { calculateDistanceMiles } from "@/src/utils/helperFunctions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Loader from "@/src/components/common/Loader";
import RejectionModal from "@/src/components/common/RejectionModal";
import { Button } from "@/components/ui/button";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import {
  RejectReasonContent,
  ReportUserContent,
} from "../../users/[id]/_components/reportUserOptions";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [distance, setDistance] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);

  // const swiperRef = useRef<SwiperRef>(null);
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );

  const {
    data: bookingData,
    isLoading,
    error,
  } = useBookingDetails(id as string);

  const cancelBookingMutation = useCancelBooking();

  const handleRejectBooking = () => {
    setIsRejectionModalOpen(true);
  };

  const handleConfirmRejection = async (reason: string) => {
    try {
      await cancelBookingMutation.mutateAsync({
        id: booking._id,
        cancellationReason: reason,
      });
      SuccessToast("Booking rejected successfully");
      setShowReasonModal(false);
      router.back();
    } catch (error) {
      ErrorToast("Failed to reject booking. Please try again.");
    }
  };

  useEffect(() => {
    if (bookingData?.data) {
      // Select default card if exists, otherwise select first card

      const productLat = bookingData?.data?.pickupLocation.coordinates[1];
      const productLng = bookingData?.data?.pickupLocation.coordinates[0];

      let distance = null;

      if (latitude && longitude) {
        distance = calculateDistanceMiles(
          latitude,
          longitude,
          productLat,
          productLng,
        ).toFixed(2);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDistance(distance);
      }
    }
  }, [bookingData?.data]);

  const handleRejectionModal = useCallback(() => {
    setIsRejectionModalOpen(false);
    setShowReasonModal(true);
  }, [bookingData?.data]);

  if (isLoading)
    return (
      <div>
        <Loader show={true} />
      </div>
    );
  if (error) return <div>Error loading booking details</div>;
  if (!bookingData?.data) return <div>No data found</div>;

  const booking = bookingData.data;
  const product = booking.product;

  // const handleQuantityChange = (change: number) => {
  //   const newQty = quantity + change;
  //   if (newQty > 0 && newQty <= product.totalQuantity) {
  //     setQuantity(newQty);
  //   }
  // };

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Tracking Dashboard</h1>

          <div className="w-10 h-10 rounded-full p-1 bg-primary ring-2 ring-primary overflow-hidden">
            <img
              src={
                booking?.type === "own"
                  ? booking?.user?.profilePicture
                  : booking.customer.profilePicture
              }
              alt="user"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-0 md:px-6 py-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6 sticky top-20">
              <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-3 flex items-center justify-center group">
                <button
                  onClick={() => {
                    if (activeImageIndex > 0) {
                      setActiveImageIndex(activeImageIndex - 1);
                    }
                  }}
                  className="absolute left-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={product.images[activeImageIndex]}
                  alt="product"
                  onClick={() => setIsMediaViewerOpen(true)}
                  className="w-full h-96 md:h-125 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                />

                <button
                  onClick={() => {
                    if (activeImageIndex < product.images.length - 1) {
                      setActiveImageIndex(activeImageIndex + 1);
                    }
                  }}
                  className="absolute right-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeImageIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="shadow-md rounded-xl p-2 py-3 mb-6">
              <h2>Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span>{booking.shortCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Created:</span>
                  <span>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Time:</span>
                  <span>
                    {new Date(booking.pickupTime * 1000).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {product.name}
                </h2>
                <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md whitespace-nowrap">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{product.productReview}</span>
                </div>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                {product.description}
              </p>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pickup Locations</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {booking.pickupAddress}
                </p>
                <p className="text-xl font-bold">
                  {distance ? `${distance} miles` : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-lg">{booking.user.phone}</span>
                </div>
              </div>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.category.name}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Sub Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.subCategory.name}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Quantity, </h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm ">
                  {booking.quantity} Items
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Date </h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm ">
                  {new Date(booking.bookingDate * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Duration</h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm ">
                  {booking.duration}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Pickup Time</h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm ">
                  {new Date(booking.pickupTime * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />
          </div>
        </div>
      </div>
      <div className="w-full px-6 py-6 border-t border-border flex justify-center">
        {booking.status === "pending" && (
          <Button
            onClick={handleRejectBooking}
            variant="destructive"
            className="w-100 py-6"
            disabled={cancelBookingMutation.isPending}
          >
            {cancelBookingMutation.isPending
              ? "Rejecting..."
              : "Reject Booking"}
          </Button>
        )}
      </div>

      <MediaViewer
        images={product.images}
        initialIndex={activeImageIndex}
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
      />

      <RejectionModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        onSubmit={handleConfirmRejection}
        userId={booking?._id}
        title="Reject Reasons"
        reasons={RejectReasonContent}
      />
      <ConfirmationModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleRejectionModal}
        title=""
        message={`Are you sure you want to cancel/Reject this booking? Please let us know why by providing a reason fro the cancellation.`}
        confirmText="Confirm "
        cancelText="Cancel"
        type="danger"
        isDangerous={false}
        showIcon={true}
      />
    </div>
  );
};

export default OrderDetailsPage;
