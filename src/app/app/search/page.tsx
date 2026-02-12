"use client";

import React, { useState } from "react";
import { ArrowLeft, Search as SearchIcon, X, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../home/_components/product-card";
import StoreCard from "../home/_components/store-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Tab = "all" | "users" | "stores" | "products";

const dummyUsers = [
  {
    _id: "u1",
    name: "Colby Campbell",
    email: "mathewgarfiled@yopmail.com",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
  {
    _id: "u2",
    name: "Gannon Bond",
    email: "test@yopmail.com",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
  {
    _id: "u3",
    name: "Fleur Mcfadden",
    email: "fleur@yopmail.com",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
];

const dummyStores = [
  {
    _id: "s1",
    name: "Micah Muller",
    email: "testred54@yopmail.com",
    profilePicture:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
    coverPicture:
      "https://media.istockphoto.com/id/1412353022/photo/empty-aisle-at-a-supermarket.jpg?s=612x612&w=0&k=20&c=lua6Ayl1iyoOndHTXEWoolyh1xV9HTROcl6we_o-HRc=",
  },
];

const dummyProducts = [
  {
    _id: "695fcaf55f8a230e6cb6ae5f",
    name: "Test",
    category: {
      _id: "69453c3bbe23c35494262b3a",
      name: " BUSINESS, OFFICE & WORK EQUIPMENT",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/451fe8c2-6905-4e69-9637-c1228ddb58c5.jfif",
    },
    subCategory: {
      _id: "69453f88be23c35494262c54",
      name: "Barcode scanners",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/23841de9-d5b4-4af5-bb0a-576e1ed490ba.jfif",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/11a283c0-93c3-4f76-b44f-b971ecb8f996.jpg",
    pricePerHour: 10,
    pricePerDay: 20,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2026-01-08T15:19:17.608Z",
    updatedAt: "2026-01-08T15:19:17.608Z",
  },
  {
    _id: "6932a45e912545702b79dad5",
    name: "Test Product ",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761236161c546944d95cc53",
      name: "Audio Equipment",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/110df065-db10-4f64-b76a-cb689a9356e8.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/22c60acc-d7ed-4dd7-8694-0483b35e4aaf.jpg",
    pricePerHour: 10,
    pricePerDay: 100,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: true,
    isActive: true,
    createdAt: "2025-12-05T09:22:38.826Z",
    updatedAt: "2025-12-11T07:21:00.351Z",
  },
  {
    _id: "68b99e0ded64fb55be419720",
    name: "Test Product",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761225461c546944d95cc46",
      name: "Mobile Phones & Accessories",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/5ceddfc8-ac8f-4b13-bb2e-d8a6b67dae73.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
    pricePerHour: 20,
    pricePerDay: 200,
    productReview: 5,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-09-04T14:11:25.883Z",
    updatedAt: "2025-09-04T14:19:32.181Z",
  },
  {
    _id: "6881fec1eb495ea3dc6ae145",
    name: "Watch",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761236161c546944d95cc53",
      name: "Audio Equipment",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/110df065-db10-4f64-b76a-cb689a9356e8.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8586f2da-d4a3-43ca-b40e-a8ffea023ab7.jpg",
    pricePerHour: 10,
    pricePerDay: 100,
    productReview: 3,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-07-24T09:37:05.408Z",
    updatedAt: "2026-01-28T09:11:20.428Z",
  },
  {
    _id: "6852bdb8c495face6b7576d2",
    name: "Fhhb",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761236161c546944d95cc53",
      name: "Audio Equipment",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/110df065-db10-4f64-b76a-cb689a9356e8.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/bf930ca3-5f96-4554-9f35-7f7043c8093a.jpg",
    pricePerHour: 14,
    pricePerDay: 200,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-06-18T13:23:04.185Z",
    updatedAt: "2025-06-18T13:23:04.185Z",
  },
  {
    _id: "6852bbfbc495face6b757613",
    name: "Screen ",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761227961c546944d95cc49",
      name: "Computers & Laptops",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/18179050-c6be-4e2e-977b-5b1bf2aeb26b.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/7cd58120-ab4b-44fa-a7d3-780cd4b54105.jpg",
    pricePerHour: 70,
    pricePerDay: 200.5,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-06-18T13:15:39.313Z",
    updatedAt: "2025-06-18T13:15:39.313Z",
  },
  {
    _id: "6852b4c8c495face6b757268",
    name: "Aquafina",
    category: {
      _id: "6761252761c546944d95cc72",
      name: "HOME & LIVING",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/52371ad0-6af3-4543-b104-09c1b1b488ca.jpg",
    },
    subCategory: {
      _id: "6761262061c546944d95cc81",
      name: "Storage Solutions",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/f2fbdb9b-b5fa-4334-8c7c-0b4958ba1c00.jpg",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/faceb4c9-ba69-4f7a-be34-046ce196a082.jpg",
    pricePerHour: 2,
    pricePerDay: 150,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-06-18T12:44:56.293Z",
    updatedAt: "2025-06-18T13:41:34.475Z",
  },
  {
    _id: "6814de07c495face6b73173b",
    name: "Darkness",
    category: {
      _id: "676121de61c546944d95cc43",
      name: "ELECTRONICS & TECH RENTALS",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    subCategory: {
      _id: "6761233261c546944d95cc50",
      name: "Gaming Equipment",
      cover:
        "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/cae2ad99-8629-4fd3-88d3-eaa45783631b.webp",
    },
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/4052ba59-6391-40c3-bbd7-35bdd93af93c.jpg",
    pricePerHour: 15,
    pricePerDay: 90,
    productReview: 0,
    isContracted: true,
    isOwn: false,
    isLiked: false,
    isActive: true,
    createdAt: "2025-05-02T15:00:23.547Z",
    updatedAt: "2025-05-02T15:00:23.547Z",
  },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "users", label: "Users" },
    { id: "stores", label: "Stores" },
    { id: "products", label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Search</h1>

          <span />
        </div>
      </div>
      {/* Header */}

      <div className="flex-1 flex items-center gap-2 bg-muted px-4 mt-4 mb-2 py-2 rounded-lg">
        <SearchIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-10 bg-transparent outline-none text-foreground placeholder:text-gray-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[calc(var(--navbar-height)+4rem)] z-30 bg-background border-b border-border">
        <div className="flex gap-2 px-4 py-2 md:px-6 overflow-x-auto scrollbar-light">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-4 md:p-6">
        {(activeTab === "all" || activeTab === "users") && (
          <div className="mb-12">
            {activeTab === "all" && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Users</h3>
                <button
                  className="text-primary hover:underline text-sm"
                  onClick={() => setActiveTab("users")}
                >
                  See All
                </button>
              </div>
            )}

            <div className="space-y-4">
              {dummyUsers.map((user) => (
                <Link
                  key={user._id}
                  href={`/app/users/${user._id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card transition-colors cursor-pointer"
                >
                  <div className="relative w-18 h-18 rounded-full">
                    <div className="w-full h-full rounded-full ring-4 ring-primary p-1 bg-white">
                      <Image
                        src={user.avatar ?? ""}
                        alt={user.name ?? "profile"}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-xl">
                      {user.name}
                    </h4>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "stores") && (
          <div className="mb-12">
            {activeTab === "all" && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Stores</h3>
                <button
                  className="text-primary hover:underline text-sm"
                  onClick={() => setActiveTab("stores")}
                >
                  See All
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {dummyStores.map((store) => (
                <StoreCard key={store._id} store={store} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "products") && (
          <div>
            {activeTab === "all" && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Products</h3>
                <button
                  className="text-primary hover:underline text-sm"
                  onClick={() => setActiveTab("products")}
                >
                  See All
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dummyProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Empty Search State */}
        {!searchQuery &&
          activeTab !== "all" &&
          activeTab !== "users" &&
          activeTab !== "stores" &&
          activeTab !== "products" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <svg
                className="w-24 h-24 text-primary opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Search here
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Type something to get started
                </p>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
