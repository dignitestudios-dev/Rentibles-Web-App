"use client";

import React, { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ProductCard from "../../home/_components/product-card";

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

  const user = {
    _id: params?.id as string,
    name: "Colby Campbell",
    email: "mathewgarfiled@yopmail.com",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "information", label: "Information" },
    { id: "listing", label: "Listing" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Orange Gradient */}
      <div className="sticky top-0 z-40 bg-linear-to-b from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700 text-white">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Profile</h1>

          <button className="p-2 hover:bg-white/20 rounded-md transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 pb-6 md:px-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full p-1 bg-white ring-4 ring-primary overflow-hidden shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-orange-100">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background border-b border-border sticky top-24 z-30">
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
      </div>

      {/* Content */}
      <main className="p-4 md:p-6">
        {activeTab === "information" && (
          <div className="space-y-8 max-w-2xl">
            <div className="bg-muted dark:bg-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Name
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{user.name}</p>
            </div>

            <div className="bg-muted dark:bg-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visible After Booking
              </p>
            </div>

            <div className="bg-muted dark:bg-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Phone
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visible After Booking
              </p>
            </div>

            <div className="bg-muted dark:bg-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visible After Booking
              </p>
            </div>
          </div>
        )}

        {activeTab === "listing" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dummyProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {dummyProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📦</span>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Products
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This user hasn't listed any products yet
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
