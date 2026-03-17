import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PickupCaptchaDialog from "./PickupCaptchaDialog";

type RentalCardProps = {
  bookingId: string;
  id: string;
  userName: string;
  userAvatar: string;
  productImage?: string;
  title: string;
  price: number;
  hours: number;
  status: "Completed" | "Incomplete" | "Pending" | "In Progress" | "Over Due";
  qty: number;
  date: string;
  time: string;
  pickupTime: number;
  dropOffTime: number;
  type: string;
  handleRedirect: () => void;
};

const statusStyles = {
  Completed: "text-green-500",
  Incomplete: "text-red-500",
  Pending: "text-blue-500",
  "In Progress": "text-yellow-500",
  "Over Due": "text-grey-500",
};

const RentalCard = ({
  userName,
  userAvatar,
  productImage,
  title,
  price,
  hours,
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

  const now = useCurrentEpoch();

  const isReadyForPickup = now >= pickupTime && now <= dropOffTime;
  const router = useRouter();
  return (
    <div className=" overflow-hidden rounded-2xl p-4 space-y-4 border-[1px] border-foreground/25">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
            <Image
              src={userAvatar || "https://placehold.co/600x400"}
              alt={userName}
              width={40}
              height={40}
              className="object-cover"
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

      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black">
          {productImage ? (
            <Image
              src={productImage ?? "https://placehold.co/600x400"}
              alt={title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className=" text-lg font-semibold">{title}</h3>
          <p className=" text-base">
            ${price}
            <span className="text-muted-foreground">/{hours} hrs</span>
          </p>
          <p className={`text-sm font-medium ${statusStyles[status]}`}>
            {status}
          </p>
          <p className="text-xs text-muted-foreground">
            Qty: {qty} &nbsp; | &nbsp; {date}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 w-full ">
        {type === "customer_rental" && (
          <div className="mt-2 w-full">
            <PickupCaptchaDialog
              bookingId={bookingId}
              disabled={!isReadyForPickup}
              trigger={
                <Button
                  variant={"outline"}
                  className="w-full border-[1px] border-primary text-primary rounded-xl py-6 text-lg"
                >
                  {status === "Pending"
                    ? "Ready for Pickup"
                    : status === "In Progress"
                      ? "Mark As Received"
                      : "Completed"}
                </Button>
              }
            />

            <p className="text-[12px] text-primary">
              {!isReadyForPickup &&
                status !== "Completed" &&
                "Can be mark at the time of booking"}
            </p>
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
    </div>
  );
};

export default RentalCard;
