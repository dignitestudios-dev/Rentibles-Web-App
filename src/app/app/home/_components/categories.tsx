"use client";
import React from "react";
import CategoryCard from "./category-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export const CATEGORIES = [
  { _id: "all", name: "All", cover: "" },
  {
    _id: "69453c3bbe23c35494262b3a",
    name: " BUSINESS, OFFICE & WORK EQUIPMENT",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/451fe8c2-6905-4e69-9637-c1228ddb58c5.jfif",
    createdAt: "2025-12-19T11:51:23.545Z",
    updatedAt: "2025-12-19T11:51:23.545Z",
  },
  {
    _id: "69455c0ebe23c3549426370c",
    name: " MUSICAL INSTRUMENTS & AUDIO GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/0a507803-92d2-49f0-8714-402a0d814860.jfif",
    createdAt: "2025-12-19T14:07:10.582Z",
    updatedAt: "2025-12-19T14:07:10.582Z",
  },
  {
    _id: "694522d0be23c354942625d5",
    name: " TRAVEL, TRANSPORTATION & LIFESTYLE",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/b8ab7513-1b73-4bd0-89b5-545063ee3f8e.jpg",
    createdAt: "2025-12-19T10:02:56.565Z",
    updatedAt: "2025-12-19T10:02:56.565Z",
  },
  {
    _id: "6946451bbe23c354942649da",
    name: " VEHICLES & TRANSPORTATION",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/71d132e5-5bca-4a61-a681-b94bf088721f.jpg",
    createdAt: "2025-12-20T06:41:31.583Z",
    updatedAt: "2025-12-20T06:41:31.583Z",
  },
  {
    _id: "676121de61c546944d95cc43",
    name: "ELECTRONICS & TECH RENTALS",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    createdAt: "2024-12-17T07:01:50.413Z",
    updatedAt: "2025-12-20T07:01:53.842Z",
  },
  {
    _id: "69454d4abe23c35494263273",
    name: "HOLIDAY, SEASONAL & SPECIAL OCCASION ITEMS",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/b75cfd14-3cb7-4d73-bbb0-c2a9defd6870.jfif",
    createdAt: "2025-12-19T13:04:10.597Z",
    updatedAt: "2025-12-19T13:04:10.597Z",
  },
  {
    _id: "6761252761c546944d95cc72",
    name: "HOME & LIVING",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/52371ad0-6af3-4543-b104-09c1b1b488ca.jpg",
    createdAt: "2024-12-17T07:15:51.280Z",
    updatedAt: "2025-12-20T07:02:11.762Z",
  },
  {
    _id: "69451a35be23c35494262112",
    name: "HOME IMPROVEMENT & TOOLS",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/1462953b-123e-4608-87c9-9c416dc1a280.jpg",
    createdAt: "2025-12-19T09:26:13.128Z",
    updatedAt: "2025-12-19T09:26:13.128Z",
  },
  {
    _id: "694541c1be23c35494262cfc",
    name: "HOME LIVING, FURNITURE & APPLIANCES",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/b9c3386f-edf3-4ba8-9ae7-63d70d281224.jfif",
    createdAt: "2025-12-19T12:14:57.906Z",
    updatedAt: "2025-12-19T12:14:57.906Z",
  },
  {
    _id: "693c243fdbb3a9a70cb30c51",
    name: "KIDS & BABY GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/885ca80c-8324-4914-b186-9b0ef9a0e135.jpg",
    createdAt: "2025-12-12T14:18:39.678Z",
    updatedAt: "2025-12-20T07:02:36.644Z",
  },
  {
    _id: "6945620abe23c35494263ac6",
    name: "KITCHEN & CATERING EQUIPMENT",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/a3f784ad-ea7d-4bb0-88d6-dd23d791cc50.jfif",
    createdAt: "2025-12-19T14:32:42.130Z",
    updatedAt: "2025-12-19T14:32:42.130Z",
  },
  {
    _id: "693c209adbb3a9a70cb30af1",
    name: "MEDICAL & WELLNESS EQUIPMENT",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/972abedc-6604-408d-972f-295d0837851c.jpg",
    createdAt: "2025-12-12T14:03:06.125Z",
    updatedAt: "2025-12-20T06:24:15.408Z",
  },
  {
    _id: "693c22fadbb3a9a70cb30bda",
    name: "MUSICAL INSTRUMENTS & AUDIO GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/940648a6-2d4a-404c-917d-a96cc4f8474d.jpg",
    createdAt: "2025-12-12T14:13:14.423Z",
    updatedAt: "2025-12-20T07:03:01.423Z",
  },
  {
    _id: "693c21b7dbb3a9a70cb30b4a",
    name: "OFFICE & WORK",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/918ed68d-ecbd-41a1-a25f-4900f58bcf03.jpg",
    createdAt: "2025-12-12T14:07:51.473Z",
    updatedAt: "2025-12-20T07:03:15.861Z",
  },
  {
    _id: "69441d9bbe23c3549426154c",
    name: "OUTDOOR & RECREATIONAL GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/bbeb5c9f-374c-44b1-821a-bb9c335ff03a.jpg",
    createdAt: "2025-12-18T15:28:27.240Z",
    updatedAt: "2025-12-20T07:03:42.599Z",
  },
  {
    _id: "6761264161c546944d95cc85",
    name: "PARTIES & EVENTS RENTAL",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/630ee161-3aed-4053-ae82-3c2918075336.jpg",
    createdAt: "2024-12-17T07:20:33.387Z",
    updatedAt: "2025-12-20T07:04:04.505Z",
  },
  {
    _id: "69456156be23c35494263a30",
    name: "PET & ANIMAL GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/fc18ca91-2fa7-414d-a056-bb275ccdc73e.jpg",
    createdAt: "2025-12-19T14:29:42.038Z",
    updatedAt: "2025-12-19T14:29:42.038Z",
  },
  {
    _id: "69451cacbe23c35494262194",
    name: "PHOTO, FILM & CREATOR GEAR",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/d62e71a1-ab36-497d-9083-f29c114f1957.jpg",
    createdAt: "2025-12-19T09:36:44.642Z",
    updatedAt: "2025-12-19T09:36:44.642Z",
  },
  {
    _id: "693c256bdbb3a9a70cb30cc9",
    name: "SPORTS & FITNESS",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/2a74b998-96c4-40d1-82f2-efda6095d0de.jpg",
    createdAt: "2025-12-12T14:23:39.139Z",
    updatedAt: "2025-12-20T07:04:20.487Z",
  },
  {
    _id: "69463d65be23c3549426466b",
    name: "TOYS, GAMES, HOBBIES & FAMILY FUN",
    cover:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/662828bb-1fde-47bd-a64f-91e874e291c6.jpg",
    createdAt: "2025-12-20T06:08:37.388Z",
    updatedAt: "2025-12-20T06:08:37.388Z",
  },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="my-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Categories</h2>
        <Link href={"/app/categories"} className="text-primary hover:underline">
          See All
        </Link>
      </div>

      <div className="mt-3 relative">
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
      </div>
    </div>
  );
};

export default Categories;
