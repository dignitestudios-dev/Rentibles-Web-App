"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import MediaViewer from "../../products/[id]/_components/MediaViewer";
import {
  useBookingDetails,
  useCancelBooking,
  useUpdateBooking,
} from "@/src/lib/api/booking";
import { calculateDistanceMiles } from "@/src/utils/helperFunctions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Loader from "@/src/components/common/Loader";
import RejectionModal from "@/src/components/common/RejectionModal";
import { Button } from "@/components/ui/button";
import { ErrorToast, SuccessToast } from "@/src/components/common/Toaster";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import { RejectReasonContent } from "../../users/[id]/_components/reportUserOptions";
import Link from "next/link";
import PickupCaptchaDialog from "../_components/PickupCaptchaDialog";
import MarkItemCollected, {
  PickupSuccessModal,
  RentalReturnModal,
} from "../_components/MarkAsCollectedScaner";
import EvidenceSlider from "../_components/EvidenceSlider";
import AdjustBookingModal from "../_components/AdjustBooking";
import WriteReviewModal from "../_components/Writereviewmodal";

// ── Defined outside component — stable hook order ────────────────────────────
const useCurrentEpoch = () => {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
};

const formatTimeLeft = (seconds: number) => {
  if (seconds <= 0) return "Expired";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};
// ─────────────────────────────────────────────────────────────────────────────

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const type = useSearchParams().get("type");

  // ── Modal states ─────────────────────────────────────────────────────────
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPickupSuccess, setShowPickupSuccess] = useState(false);   // ← lifted from MarkItemCollected
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);   // ← lifted from MarkItemCollected

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [showAdjust, setShowAdjust] = useState(false);

  const now = useCurrentEpoch();
  const { latitude, longitude } = useSelector(
    (state: RootState) => state.location,
  );
  const bookingId = scannedId || (id as string);

  const {
    data: bookingData,
    isLoading,
    error,
    refetch,
  } = useBookingDetails(bookingId, {
    enabled: !!bookingId,
  });

  const cancelBookingMutation = useCancelBooking();
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (bookingData?.data && latitude && longitude) {
      const productLat = bookingData.data.pickupLocation.coordinates[1];
      const productLng = bookingData.data.pickupLocation.coordinates[0];
      setDistance(
        calculateDistanceMiles(latitude, longitude, productLat, productLng),
      );
    }
  }, [bookingData?.data, latitude, longitude]);

  const handleRejectionModal = useCallback(() => {
    setIsRejectionModalOpen(false);
    setShowReasonModal(true);
  }, []);

  const handleRejectBooking = () => setIsRejectionModalOpen(true);

  const handleConfirmRejection = async (reason: string) => {
    try {
      await cancelBookingMutation.mutateAsync({
        id: booking._id,
        cancellationReason: reason,
      });
      SuccessToast("Booking rejected successfully");
      setShowReasonModal(false);
      router.back();
    } catch {
      ErrorToast("Failed to reject booking. Please try again.");
    }
  };

  // ── Early returns after all hooks ────────────────────────────────────────
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
  const detail = booking.detail;

  const timeNow = now;
  let timeLeftText = "";

  if (timeNow < booking.pickupTime) {
    const seconds = booking.pickupTime - timeNow;
    timeLeftText = "Starts in " + formatTimeLeft(seconds);
  } else if (timeNow > booking.dropOffTime) {
    timeLeftText = "Expired";
  } else {
    const seconds = booking.dropOffTime - timeNow;
    timeLeftText = formatTimeLeft(seconds);
  }

  const isReadyForPickup =
    now >= booking.pickupTime && now <= booking.dropOffTime;

  // ── Pull evidence arrays from API response ───────────────────────────────
  const pickupImages: string[] = detail?.pickupImages ?? [];
  const pickupVideos: string[] = detail?.pickupVideos ?? [];
  const dropOffImages: string[] = detail?.dropOffImages ?? [];
  const dropOffVideos: string[] = detail?.dropOffVideos ?? [];

  const hasEvidence =
    pickupImages.length > 0 ||
    pickupVideos.length > 0 ||
    dropOffImages.length > 0 ||
    dropOffVideos.length > 0;

  const reviewProduct = {
    name: product.name,
    image: product.images[0] ?? "https://placehold.co/600x400",
    quantity: booking.quantity,
    price: booking.perUnitPrice,
  };

  const handleAdjustBooking = () => {
    setShowAdjust(false);
    refetch();
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ── Header ── */}
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
          {/* ── Left col: product slider + evidence slider ── */}
          <div className="lg:col-span-2">
            <div className="mb-6 sticky top-20 flex flex-col gap-8">
              {/* Product image slider */}
              <div>
                <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-3 flex items-center justify-center">
                  <button
                    onClick={() =>
                      setActiveImageIndex((i) => Math.max(i - 1, 0))
                    }
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
                    onClick={() =>
                      setActiveImageIndex((i) =>
                        Math.min(i + 1, product.images.length - 1),
                      )
                    }
                    className="absolute right-4 z-10 bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {product.images.map((_: any, idx: number) => (
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

              {/* ── Evidence Slider ── */}
              {hasEvidence && (
                <div className="px-4 md:px-0">
                  <EvidenceSlider
                    pickupImages={pickupImages}
                    pickupVideos={pickupVideos}
                    dropOffImages={dropOffImages}
                    dropOffVideos={dropOffVideos}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Right col: order info ── */}
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
                <div className="flex justify-between">
                  <span className="font-medium">Time Left:</span>
                  <span className="text-primary font-semibold">
                    {timeLeftText}
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
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base line-clamp-3">
                {product.description}
              </p>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
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
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {booking.quantity} Items
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Date</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(booking.bookingDate * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Duration</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {booking.duration}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Pickup Time</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(booking.pickupTime * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />

            <div>
              {!booking?.review && booking.status === "completed" && (
                <h3 className="text-2xl font-bold mb-4">Customer Feedback</h3>
              )}

              <>
                {!booking?.review &&
                  booking.status === "completed" &&
                  type === "my_rentals" && (
                    <Button
                      onClick={() => setShowReviewModal(!showReviewModal)}
                      className="text-white w-full"
                    >
                      Give Feedback
                    </Button>
                  )}

                {!booking?.review && booking.status === "completed" && (
                  <div className="border rounded-xl mt-3 p-4 text-center text-gray-500">
                    No Feedback Available
                  </div>
                )}

                {booking?.review && (
                  <div className="border rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={booking?.review?.user?.profilePicture}
                        alt={booking?.review?.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {booking?.review?.user?.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < booking?.review?.stars
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {booking?.review?.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(
                        booking?.review?.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action bar ── */}
      <div className="w-full px-6 py-6 border-t border-border flex gap-3 justify-center">
        {type === "customer_rental" ? (
          <div className="w-100">
            <PickupCaptchaDialog
              refetchBookings={refetch}
              bookingId={booking._id}
              productInfo={{
                ProductName: product.name,
                productImg: product.images[0] ?? "https://placehold.co/600x400",
              }}
              disabled={!isReadyForPickup && booking.status !== "in-progress"}
              trigger={
                <Button
                  variant={"outline"}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  {booking.status === "pending"
                    ? "Ready for Pickup"
                    : booking.status === "in-progress"
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
            {/* ── Pickup flow ── */}
            {booking.status === "pending" && (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => setIsReturnModalOpen(true)}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  Mark Item Collected
                </Button>
                <MarkItemCollected
                  open={isReturnModalOpen}
                  onOpenChange={setIsReturnModalOpen}
                  type="pickup"
                  product={reviewProduct}
                  bookingId={booking._id}
                  onScanned={(text) => setScannedId(text)}
                  onEvidenceSubmit={(files) => {
                    const images = files.filter((f) =>
                      f.type.startsWith("image/"),
                    );
                    const videos = files.filter((f) =>
                      f.type.startsWith("video/"),
                    );
                    updateBooking(
                      { id: bookingId, type: "pickup", images, videos },
                      {
                        onSuccess: () => {
                          setIsReturnModalOpen(false);
                        },
                        onError: (err) => console.error("Error:", err),
                      },
                    );
                  }}
                  isSubmitting={isUpdating}
                  onSubmitSuccess={() => {
                    // scanner modal is already closed by MarkItemCollected
                    // now safely show pickup success modal
                    setShowPickupSuccess(true);
                    refetch();
                  }}
                />
              </>
            )}

            {/* ── Drop-off flow ── */}
            {booking.status === "in-progress" && (
              <>
                <Button
                  variant={"outline"}
                  onClick={() => setIsReturnModalOpen(true)}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  Mark As Return
                </Button>
                <MarkItemCollected
                  open={isReturnModalOpen}
                  type="dropOff"
                  onOpenChange={setIsReturnModalOpen}
                  product={reviewProduct}
                  bookingId={booking._id}
                  onScanned={(text) => setScannedId(text)}
                  onEvidenceSubmit={(files) => {
                    const images = files.filter((f) =>
                      f.type.startsWith("image/"),
                    );
                    const videos = files.filter((f) =>
                      f.type.startsWith("video/"),
                    );
                    updateBooking(
                      { id: bookingId, type: "dropOff", images, videos },
                      {
                        onSuccess: () => {
                          setIsReturnModalOpen(false);
                        },
                        onError: (err) => console.error("Error:", err),
                      },
                    );
                  }}
                  isSubmitting={isUpdating}
                  onSubmitSuccess={() => {
                    // scanner modal is already closed by MarkItemCollected
                    // now safely show return success modal
                    setShowReturnSuccess(true);
                    refetch();
                  }}
                />
              </>
            )}
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

      {/* ── Pickup Success Modal (owned by parent, survives scanner close) ── */}
      <PickupSuccessModal
        open={showPickupSuccess}
        onClose={() => setShowPickupSuccess(false)}
      />

      {/* ── Rental Return Confirmed Modal (owned by parent) ── */}
      <RentalReturnModal
        open={showReturnSuccess}
        onFeedback={() => {
          setShowReturnSuccess(false);
          setShowReviewModal(true); // open review modal after feedback click
        }}
        onBackToHome={() => {
          setShowReturnSuccess(false);
          router.back();
        }}
      />

      {/* ── Write Review Modal ── */}
      <WriteReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        bookingId={bookingId}
        product={{
          name: product.name,
          image: product.images[0] ?? "https://placehold.co/600x400",
          quantity: booking.quantity,
          price: booking.perUnitPrice,
        }}
        onSuccess={() => {
          refetch();
          setShowReviewModal(false);
        }}
      />

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
        message="Are you sure you want to cancel/Reject this booking? Please let us know why by providing a reason for the cancellation."
        confirmText="Confirm"
        cancelText="Cancel"
        type="danger"
        isDangerous={false}
        showIcon={true}
      />

      {!booking?.isPopupShown && type === "customer_rental" && (
        <AdjustBookingModal
          bookingId={booking?._id}
          isOpen={!booking?.isPopupShown}
          onClose={() => setShowAdjust(false)}
          onConfirm={handleAdjustBooking}
          title="Product Damage"
          message="Click Adjust Booking if there are any bookings scheduled within the next 24 hours that you want to cancel."
          confirmText="Adjust Booking"
          cancelText="Skip"
          type="danger"
          isDangerous={false}
          showIcon={true}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;