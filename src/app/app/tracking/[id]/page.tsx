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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import MediaViewer from "../../products/[id]/_components/MediaViewer";

const OrderDetailsPage = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(14);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  const product = {
    _id: "68b99e0ded64fb55be419720",
    name: "Test Product",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
    images: [
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8586f2da-d4a3-43ca-b40e-a8ffea023ab7.jpg",
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/bf930ca3-5f96-4554-9f35-7f7043c8093a.jpg",
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/7cd58120-ab4b-44fa-a7d3-780cd4b54105.jpg",
    ],
    rating: 4.5,
    category: "Furniture",
    subCategory: "Chair",
    pricePerHour: 3000,
    pricePerDay: 9000,
    totalQuantity: 100,
    availableQuantity: 14,
    distance: "8 Miles Away",
    phone: "+1 136 898 21345",
    storeAvatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  };

  const handleQuantityChange = (change: number) => {
    const newQty = quantity + change;
    if (newQty > 0 && newQty <= product.totalQuantity) {
      setQuantity(newQty);
    }
  };

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
              src={product.storeAvatar}
              alt="store"
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
                  className="w-full h-96 md:h-125 object-cover cursor-pointer hover:opacity-90 transition-opacity"
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
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {product.name}
                </h2>
                <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md whitespace-nowrap">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
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
                  Location will be visible once you book the item.
                </p>
                <p className="text-xl font-bold">{product.distance}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-lg">{product.phone}</span>
                </div>
              </div>
            </div>

            <hr className="my-6 border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.category}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Sub Category</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {product.subCategory}
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Quantity, </h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {quantity} Items
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Date </h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {quantity} Items
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Duration</h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                 1:00 AM - 7:00 AM
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Date </h3>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {quantity} Items
                </p>
              </div>
            </div>

            <hr className="my-6 border-border" />
          </div>
        </div>
      </div>

      <MediaViewer
        images={product.images}
        initialIndex={activeImageIndex}
        isOpen={isMediaViewerOpen}
        onClose={() => setIsMediaViewerOpen(false)}
      />
    </div>
  );
};

export default OrderDetailsPage;
