"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryCard from "../../../home/_components/category-card";
import ProductCard from "../../../home/_components/product-card";
import { CATEGORIES } from "../../../home/_components/categories";
import Link from "next/link";

const StoreDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedCategoryId = searchParams?.get("category") ?? "all";

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (id === "all") {
      params.delete("category");
    } else {
      if (params.get("category") === id) {
        params.delete("category");
      } else {
        params.set("category", id);
      }
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
  };

  const store = {
    _id: "68c42cc21e1affac1cafa5aa",
    name: "Test",
    email: "test23@yopmail.com",
    description:
      "This is a test store description. It provides an overview of the store's offerings, values, and unique selling points. Customers can expect quality products and excellent service when shopping here. We pride ourselves on our commitment to customer satisfaction and our wide range of products to meet diverse needs.",
    profilePicture:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
    coverPicture:
      "https://media.istockphoto.com/id/1412353022/photo/empty-aisle-at-a-supermarket.jpg?s=612x612&w=0&k=20&c=lua6Ayl1iyoOndHTXEWoolyh1xV9HTROcl6we_o-HRc=",
    phone: "12267847792",
    address:
      "Plot 8 B, Sindhi Muslim Cooperative Housing Society Block A Sindhi Muslim CHS (SMCHS), Karachi, Pakistan",
    country: "USA",
    apartment: "322222",
    city: "Cicero",
    state: "Illinois",
    zipCode: 32131,
    location: {
      type: "Point",
      coordinates: [67.05391949999999, 24.8592086],
    },
    isOwn: false,
    createdAt: "2025-09-12T14:22:58.536Z",
    updatedAt: "2025-11-12T06:03:35.398Z",
    hasPurchased: true,
  };

  const products = [
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

  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  return (
    <div className="">
      <div className="sticky top-0">
        <div className="relative flex flex-col min-h-72 md:min-h-92 h-fit">
          <div className="absolute inset-0">
            {!coverLoaded && (
              <div className="absolute inset-0 bg-card animate-pulse" />
            )}

            <Image
              src={store.coverPicture}
              alt="cover"
              width={1000}
              height={1000}
              onLoadingComplete={() => setCoverLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${coverLoaded ? "opacity-100" : "opacity-0"}`}
            />

            {coverLoaded && (
              <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/95" />
            )}
          </div>

          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 z-40 bg-white/20 backdrop-blur-sm text-white p-2 rounded-md"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 top-4 text-white text-xl font-semibold">
            Store Details
          </h2>

          <div className="relative z-20 h-full flex-1 flex flex-col justify-end p-5">
            <div className="flex items-center gap-5 text-white">
              <div className="w-20 h-20 rounded-full p-1 bg-white ring-4 ring-primary relative overflow-hidden">
                {!profileLoaded && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
                )}

                <Image
                  src={store.profilePicture}
                  alt="profile"
                  width={1000}
                  height={1000}
                  onLoadingComplete={() => setProfileLoaded(true)}
                  className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>

              <div>
                <div className="text-2xl font-semibold">{store.name}</div>
                <div className="opacity-90">{store.email}</div>
              </div>
            </div>

            <div className="mt-6 mb-12">
              <div className="flex items-center gap-6 text-white text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{store.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{store.phone}</span>
                </div>
              </div>

              <p className="mt-4 text-gray-300">
                {store.description.length > 680
                  ? `${store.description.slice(0, 680)}...`
                  : store.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-10">
        <div className="bg-background rounded-t-[42px] pt-8 pb-12 px-6">
          <h3 className="text-2xl font-semibold mb-4">Categories</h3>

          <div className="flex gap-3 overflow-x-auto py-2 mb-6 scrollbar-light">
            {CATEGORIES.map((cat) => (
              <div key={cat._id} className="shrink-0">
                <CategoryCard
                  category={{
                    _id: cat._id,
                    name: cat.name,
                    cover: "",
                    createdAt: "",
                    updatedAt: "",
                  }}
                  selected={cat._id === selectedCategoryId}
                  onClick={() => handleSelect(cat._id)}
                />
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Products</h3>

          <div className="grid grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
