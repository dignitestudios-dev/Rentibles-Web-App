import Image from "next/image";
import { Button } from "@/components/ui/button";

type RentalCardProps = {
  userName: string;
  userAvatar: string;
  productImage?: string;
  title: string;
  price: number;
  hours: number;
  status: "Completed" | "Incomplete" | "Pending";
  qty: number;
  date: string;
  handleRedirect: () => void;
};

const statusStyles = {
  Completed: "text-green-500",
  Incomplete: "text-red-500",
  Pending: "text-yellow-500",
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
  handleRedirect,
}: RentalCardProps) => {
  return (
    <div className="bg-[#2e2e2e] rounded-2xl p-4 space-y-4 border border-white/5">
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
          <span className="text-white font-medium">{userName}</span>
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 text-sm">
          View Profile
        </Button>
      </div>
      <hr />

      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black">
          {productImage ? (
            <Image
              src={productImage || "https://placehold.co/600x400"}
              alt={title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
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

      <Button
        onClick={handleRedirect}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 text-lg"
      >
        View Details
      </Button>
    </div>
  );
};

export default RentalCard;
