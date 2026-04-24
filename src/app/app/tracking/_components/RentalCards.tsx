import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PickupCaptchaDialog from "./PickupCaptchaDialog";
import MarkItemCollected, {
  PickupSuccessModal,
  RentalReturnModal,
} from "./MarkAsCollectedScaner";
import WriteReviewModal from "./Writereviewmodal";
import { useUpdateBooking } from "@/src/lib/api/booking";
import { DummyAvatar } from "@/public/images/export";

type RentalCardProps = {
  bookingId: string;
  id: string;
  userName: string;
  userAvatar: string;
  productImage?: string;
  title: string;
  price: number;
  duration: string;
  status:
    | "Completed"
    | "Incomplete"
    | "Pending"
    | "In Progress"
    | "Over Due"
    | "Cancelled"
    | "Rejected";
  qty: number;
  date: string;
  time: string;
  pickupTime: number;
  dropOffTime: number;
  type: string;
  handleRedirect: () => void;
  refetch: () => void;
};

const statusStyles = {
  Completed: "text-green-500",
  Incomplete: "text-red-500",
  Pending: "text-blue-500",
  "In Progress": "text-yellow-500",
  "Over Due": "text-grey-500",
  Cancelled: "text-red-500",
  Rejected: "text-red-500",
};

const RentalCard = ({
  userName,
  userAvatar,
  productImage,
  title,
  price,
  duration,
  status,
  qty,
  date,
  time,
  type,
  pickupTime,
  dropOffTime,
  id,
  bookingId,
  handleRedirect,
  refetch,
}: RentalCardProps) => {
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

  const [scannedId, setScannedId] = useState<string | null>(null);
  const now = useCurrentEpoch();
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();

  const isReadyForPickup = now >= pickupTime && now <= dropOffTime;
  const router = useRouter();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // ── Lifted success modal states ──────────────────────────────────────────
  const [showPickupSuccess, setShowPickupSuccess] = useState(false);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const reviewProduct = {
    name: title,
    image: productImage ?? "https://placehold.co/600x400",
    quantity: qty,
    price: price,
  };

  return (
    <div className="overflow-hidden rounded-2xl p-4 space-y-4 border-[1px] border-foreground/25">
      {/* ── User row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
            <Image
              src={userAvatar || DummyAvatar}
              alt={userName}
              width={40}
              height={40}
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="text-foreground font-medium">{userName}</span>
        </div>

        <Button
          type="button"
          onClick={() => router.push(`/app/users/${id}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 text-sm"
        >
          View Profile
        </Button>
      </div>
      <hr />

      {/* ── Product row ── */}
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black">
          {productImage ? (
            <Image
              src={productImage ?? "https://placehold.co/600x400"}
              alt={title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-base">
            ${price}
            <span className="text-muted-foreground">/{duration} </span>
          </p>
          <p className={`text-sm font-medium ${statusStyles[status]}`}>
            {status}
          </p>
          <p className="text-xs text-muted-foreground">
            Qty: {qty} &nbsp; | &nbsp; {date}
          </p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex justify-between items-center gap-2 w-full">
        {type === "customer_rental" ? (
          <div className="w-full">
            <PickupCaptchaDialog
              refetchBookings={refetch}
              bookingId={bookingId}
              productInfo={{
                ProductName: title,
                productImg: productImage ?? "https://placehold.co/600x400",
              }}
              disabled={!isReadyForPickup && status !== "In Progress"}
              trigger={
                <Button
                  variant={"outline"}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  {status === "Pending"
                    ? "Ready for Pickup"
                    : status === "In Progress"
                      ? "Mark As Received"
                      : status === "Incomplete"
                        ? "In Complete"
                        : "Completed"}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="w-full">
            {/* ── Pickup flow ── */}
            {status === "Pending" && (
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
                  bookingId={bookingId}
                  product={reviewProduct}
                  onScanned={(text) => setScannedId(text)}
                  onEvidenceSubmit={(files) => {
                    const images = files.filter((f) =>
                      f.type.startsWith("image/"),
                    );
                    const videos = files.filter((f) =>
                      f.type.startsWith("video/"),
                    );
                    updateBooking(
                      {
                        id: scannedId || bookingId,
                        type: "pickup",
                        images,
                        videos,
                      },
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
                    setShowPickupSuccess(true);
                    refetch();
                  }}
                />
              </>
            )}

            {/* ── Drop-off flow ── */}
            {status === "In Progress" && (
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
                  bookingId={bookingId}
                  product={reviewProduct}
                  onScanned={(text) => setScannedId(text)}
                  onEvidenceSubmit={(files) => {
                    const images = files.filter((f) =>
                      f.type.startsWith("image/"),
                    );
                    const videos = files.filter((f) =>
                      f.type.startsWith("video/"),
                    );
                    updateBooking(
                      {
                        id: scannedId || bookingId,
                        type: "dropOff",
                        images,
                        videos,
                      },
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
                    setShowReturnSuccess(true);
                    refetch();
                  }}
                />
              </>
            )}
          </div>
        )}

        <div className="w-full">
          <Button
            onClick={handleRedirect}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 text-lg"
          >
            View Details
          </Button>
        </div>
      </div>

      <p className="text-[12px] text-primary -mt-2">
        {!isReadyForPickup &&
          status !== "Completed" &&
          status !== "Incomplete" &&
          status !== "Cancelled" &&
          status !== "Rejected" &&
          status !== "In Progress" &&
          "Can be mark at the time of booking"}
      </p>

      {/* ── Pickup Success Modal ── */}
      <PickupSuccessModal
        open={showPickupSuccess}
        onClose={() => setShowPickupSuccess(false)}
      />

      {/* ── Rental Return Confirmed Modal ── */}
      <RentalReturnModal
        open={showReturnSuccess}
        onFeedback={() => {
          setShowReturnSuccess(false);
          setShowReviewModal(true);
        }}
        onBackToHome={() => setShowReturnSuccess(false)}
      />

      {/* ── Write Review Modal ── */}
      <WriteReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        bookingId={bookingId}
        product={reviewProduct}
        onSuccess={() => {
          setShowReviewModal(false);
          refetch();
        }}
      />
    </div>
  );
};

export default RentalCard;
