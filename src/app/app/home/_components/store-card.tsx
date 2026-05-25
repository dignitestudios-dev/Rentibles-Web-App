import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Store = {
  _id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  coverPicture?: string;
};

const StoreCard: React.FC<{ store?: Store }> = ({ store }) => {
  const cover = store?.coverPicture;
  const profile = store?.profilePicture;

  return (
    <div className="relative rounded-3xl h-72 overflow-hidden bg-black/5 dark:bg-black/60">
      {cover ? (
        <Image
          src={cover}
          alt={store?.name ?? "store cover"}
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-end p-4 sm:p-6">
        <div className="flex items-center w-full gap-3 sm:gap-4 min-w-0">
          {/* Profile */}
          <div className="shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full">
              <div className="w-full h-full rounded-full ring-4 ring-primary p-1 bg-white">
                <Image
                  src={profile ?? ""}
                  alt={store?.name ?? "profile"}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-white min-w-0">
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold leading-tight truncate">
              {store?.name ?? "Store Name"}
            </h3>

            <p className="text-sm sm:text-base lg:text-lg opacity-90 truncate">
              {store?.email ?? "store@mail.com"}
            </p>
          </div>

          {/* Button */}
          <Button
            asChild
            className="
          shrink-0
          bg-primary
          text-white
          w-10 h-10
          sm:w-12 sm:h-12
          lg:w-14 lg:h-14
          rounded-md
          flex
          items-center
          justify-center
        "
          >
            <Link href={`/app/store/${store?._id}`}>
              <ChevronRight className="size-5 sm:size-6 lg:size-8" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
