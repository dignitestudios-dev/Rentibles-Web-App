"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
import Link from "next/link";
import MarkAsReturnModal from "../_components/MarkAsReturnModal";
import PickupCaptchaDialog from "../_components/PickupCaptchaDialog";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
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
    if (bookingData?.data && latitude && longitude) {
      const productLat = bookingData?.data?.pickupLocation.coordinates[1];
      const productLng = bookingData?.data?.pickupLocation.coordinates[0];
      const dist = calculateDistanceMiles(
        latitude,
        longitude,
        productLat,
        productLng,
      );

      setDistance(dist);
    }
  }, [bookingData?.data, latitude, longitude]);

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
  console.log(booking, "distance");

 const useCurrentEpoch = () => {
    const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

    useEffect(() => {
      const interval = setInterval(() => {
        setNow(Math.floor(Date.now() / 1000));
      }, 60000);

      return () => clearInterval(interval);
    }, []);

    return now;
  };

  const now = useCurrentEpoch();
  const type=useSearchParams().get("type");
  const isReadyForPickup = now >= booking.pickupTime && now <= booking.dropOffTime;
 console.log(booking.status,"type")
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

              {/* <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base whitespace-pre-line overflow-x-auto" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#F36815 #0000'
              }}>
                {product.description}
              </p> */}
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base truncate line-clamp-3">
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
                  {distance === null
                    ? "N/A"
                    : distance < 0.05
                      ? "Arrived"
                      : `${distance.toFixed(2)} miles`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <Link
                  href={`tel:${booking.user.phone}`}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-lg">{booking.user.phone}</span>
                </Link>
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
      <div className="w-full px-6 py-6 border-t border-border flex gap-3 justify-center">
           {type === "customer_rental" ? (
          <div className="w-100">
            <PickupCaptchaDialog
              bookingId={booking._id}
              productInfo={{ ProductName: product.name, productImg: product.images[0] ?? "https://placehold.co/600x400" }}
              disabled={!isReadyForPickup && booking.status !== "In Progress"}
              trigger={
                <Button
                  variant={"outline"}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  {booking.status === "pending"
                    ? "Ready for Pickup"
                    : booking.status === "In Progress"
                      ? "Mark As Received"
                      : booking.status === "Incomplete"
                        ? "In Complete"
                        : "Completed"}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="w-100">
             {booking.status === "pending"  && (
                <>
                  <Button
                    variant={"outline"}
                    onClick={() => setIsReturnModalOpen(true)}
                    className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                  >
                    Mark Item Collected
                  </Button>
                  <MarkAsReturnModal
                    open={isReturnModalOpen}
                    onOpenChange={setIsReturnModalOpen}
                  />
                </>
              )}
            {booking.status === "pending" ||
              (booking.status === "Over Due" && (
                <>
                  <Button
                    variant={"outline"}
                    onClick={() => setIsReturnModalOpen(true)}
                    className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                  >
                    Mark As Return
                  </Button>
                  <MarkAsReturnModal
                    open={isReturnModalOpen}
                    onOpenChange={setIsReturnModalOpen}
                  />
                </>
              ))}
          </div>
        )}

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
