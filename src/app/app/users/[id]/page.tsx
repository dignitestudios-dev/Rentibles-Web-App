"use client";

import React, { useState } from "react";
import { ArrowLeft, Info, MapPin, Phone, TriangleAlert } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ProductCard from "../../home/_components/product-card";
import Image from "next/image";
import { TooltipButton } from "@/src/components/common/TooltipButton";
import { useProducts } from "@/src/lib/api/products";
import { useUser } from "@/src/lib/api/user";
import { formatUSAPhoneNumber } from "@/src/utils/helperFunctions";

type Tab = "information" | "listing";

const dummyProducts = Array.from({ length: 8 }).map((_, i) => ({
  _id: `p-${i}`,
  name: `Sample Product ${i + 1}`,
  cover:
    "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
  category: { name: "Sample" },
  pricePerDay: 20 + i * 5,
  pricePerHour: 5 + i,
  productReview: 4.2 + (i % 5) * 0.2,
  isLiked: i % 2 === 0,
}));

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("information");
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useProducts({
    userId: "6878ee557e8c6f22d396b5fd" || undefined,
  });
  console.log("🚀 ~ UserProfilePage ~ products:", products);

  const {
    data: userData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorMsg,
  } = useUser("6878ee557e8c6f22d396b5fd", { enabled: true });
  console.log("🚀 ~ UserProfilePage ~ userData:", userData);

  const tabs: { id: Tab; label: string }[] = [
    { id: "information", label: "Information" },
    { id: "listing", label: "Listing" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Orange Gradient */}
      <div className="sticky top-0">
        <div className="relative flex flex-col min-h-52 md:min-h-80 h-fit">
          <div className="absolute inset-0">
            <div
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 bg-primary`}
            />
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-4 top-4 z-40 bg-white/20 backdrop-blur-sm text-white p-2 rounded-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 top-4 text-white text-xl font-semibold">
            Profile
          </h2>
          <div className="absolute right-8 top-4 z-50">
            <TooltipButton
              icon={<TriangleAlert className="w-5 h-5" />}
              tooltip="Report store"
              // onClick={() => setShowConfirmation(true)}
            />
          </div>

          <div className="relative z-20 h-full flex-1 flex flex-col justify-end p-5 mb-10">
            <div className="flex items-center gap-5 text-white">
              <div className="w-20 h-20 rounded-full p-1 bg-white ring-4 ring-primary relative overflow-hidden">
                {!profileLoaded && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
                )}

                <Image
                  src={userData?.data?.profilePicture ?? ""}
                  alt="profile"
                  width={1000}
                  height={1000}
                  // onLoadingComplete={() => setProfileLoaded(true)}
                  className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              <div>
                <div className="text-2xl font-semibold">
                  {userData?.data?.name}
                </div>
                <div className="opacity-90">{userData?.data?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-8">
        <div className="bg-background rounded-t-[42px] pt-8 pb-12 px-6">
          <div className="px-4 md:px-6">
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-b-primary text-primary"
                      : "border-b-transparent text-gray-600 dark:text-gray-400 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {/* Content */}
          <main className="p-4 md:p-6">
            {activeTab === "information" && (
              <div className="space-y-8 max-w-2xl">
                {usersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-muted dark:bg-card p-6 rounded-2xl animate-pulse"
                      >
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : userData?.data ? (
                  <>
                    <div className="bg-muted dark:bg-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        Name
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {userData.data.name}
                      </p>
                    </div>

                    <div className="bg-muted dark:bg-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        Email
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {userData.data.email}
                      </p>
                    </div>

                    <div className="bg-muted dark:bg-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Phone
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatUSAPhoneNumber(userData.data.phone)}
                      </p>
                    </div>

                    <div className="bg-muted dark:bg-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Address
                      </h3>
                      <div className="space-y-2 text-gray-600 dark:text-gray-400">
                        <p>{userData.data.address}</p>
                        {userData.data.apartment && (
                          <p className="text-sm">
                            Apt: {userData.data.apartment}
                          </p>
                        )}
                        <p className="text-sm">
                          {userData.data.city}, {userData.data.state}{" "}
                          {userData.data.zipCode}
                        </p>
                        <p className="text-sm">{userData.data.country}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Unable to load user information
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "listing" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products?.data?.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      handleWishlist={() => {}}
                    />
                  ))}
                </div>

                {products?.data?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">📦</span>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No Products
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        This user hasn&apos;t listed any products yet
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
