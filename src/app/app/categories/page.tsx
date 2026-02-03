"use client";

import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "../home/_components/categories";

// Dummy subcategories data
const SUBCATEGORIES: Record<string, Array<{ _id: string; name: string; cover: string }>> = {
  "6761252761c546944d95cc72": [
    {
      _id: "sub1",
      name: "Sofas",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/22c60acc-d7ed-4dd7-8694-0483b35e4aaf.jpg",
    },
    {
      _id: "sub2",
      name: "Chairs",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/bf930ca3-5f96-4554-9f35-7f7043c8093a.jpg",
    },
    {
      _id: "sub3",
      name: "Beds",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8586f2da-d4a3-43ca-b40e-a8ffea023ab7.jpg",
    },
    {
      _id: "sub4",
      name: "Mattresses",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/7cd58120-ab4b-44fa-a7d3-780cd4b54105.jpg",
    },
    {
      _id: "sub5",
      name: "Dining Tables",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/faceb4c9-ba69-4f7a-be34-046ce196a082.jpg",
    },
    {
      _id: "sub6",
      name: "Couches",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/4052ba59-6391-40c3-bbd7-35bdd93af93c.jpg",
    },
    {
      _id: "sub7",
      name: "Coffee Tables",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/11a283c0-93c3-4f76-b44f-b971ecb8f996.jpg",
    },
    {
      _id: "sub8",
      name: "TV Stands",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/52371ad0-6af3-4543-b104-09c1b1b488ca.jpg",
    },
    {
      _id: "sub9",
      name: "Drawers",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    {
      _id: "sub10",
      name: "Benches",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/b9c3386f-edf3-4ba8-9ae7-63d70d281224.jfif",
    },
    {
      _id: "sub11",
      name: "Porches",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/451fe8c2-6905-4e69-9637-c1228ddb58c5.jfif",
    },
    {
      _id: "sub12",
      name: "Nightstands",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/0a507803-92d2-49f0-8714-402a0d814860.jfif",
    },
  ],
  "676121de61c546944d95cc43": [
    {
      _id: "elec1",
      name: "Laptops",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
    },
    {
      _id: "elec2",
      name: "Phones",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8586f2da-d4a3-43ca-b40e-a8ffea023ab7.jpg",
    },
    {
      _id: "elec3",
      name: "Tablets",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/bf930ca3-5f96-4554-9f35-7f7043c8093a.jpg",
    },
    {
      _id: "elec4",
      name: "Cameras",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/7cd58120-ab4b-44fa-a7d3-780cd4b54105.jpg",
    },
    {
      _id: "elec5",
      name: "Speakers",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/22c60acc-d7ed-4dd7-8694-0483b35e4aaf.jpg",
    },
    {
      _id: "elec6",
      name: "Headphones",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/faceb4c9-ba69-4f7a-be34-046ce196a082.jpg",
    },
  ],
  "6946451bbe23c354942649da": [
    {
      _id: "veh1",
      name: "Cars",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/44178608-cfbf-42ee-bf69-cf4424a33bae.jpg",
    },
    {
      _id: "veh2",
      name: "Bikes",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/52371ad0-6af3-4543-b104-09c1b1b488ca.jpg",
    },
    {
      _id: "veh3",
      name: "Scooters",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/451fe8c2-6905-4e69-9637-c1228ddb58c5.jfif",
    },
    {
      _id: "veh4",
      name: "Trucks",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/0a507803-92d2-49f0-8714-402a0d814860.jfif",
    },
  ],
};

const CategoriesPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[6]._id); // Default to HOME & LIVING

  // Filter out "All" category for the sidebar
  const categoriesList = CATEGORIES.filter((cat) => cat._id !== "all");

  const currentSubcategories = SUBCATEGORIES[selectedCategory] || [
    {
      _id: "default1",
      name: "Item 1",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/37b3c72e-c2df-406f-a433-fe8a6da5b1df.jpg",
    },
    {
      _id: "default2",
      name: "Item 2",
      cover: "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/8586f2da-d4a3-43ca-b40e-a8ffea023ab7.jpg",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-18 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Categories</h1>

          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6 md:py-8">
        {/* Left Sidebar - Categories with Orange Background */}
        <div className="md:col-span-1 sticky! top-24">
          <div className="hide-scrollbar bg-orange-100 dark:bg-orange-950/30 rounded-e-2xl p-4 md:max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-light">
            <div className="flex md:flex-col gap-2">
              {categoriesList.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`flex-shrink-0 md:flex-shrink md:w-full text-left px-4 py-3 rounded-lg transition-all whitespace-nowrap md:whitespace-normal border-l-4 ${
                    selectedCategory === category._id
                      ? "border-l-primary bg-white dark:bg-gray-900 text-foreground font-semibold"
                      : "border-l-transparent bg-transparent text-gray-700 dark:text-gray-300 hover:bg-orange-200/50 dark:hover:bg-orange-900/40"
                  }`}
                >
                  <span className="text-sm md:text-base line-clamp-2">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Subcategories Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentSubcategories.map((subcategory) => (
              <button
                key={subcategory._id}
                onClick={() => router.push(`/app/products?category=${selectedCategory}`)}
                className="group cursor-pointer transform transition-all hover:scale-105 active:scale-95"
              >
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square mb-3 border border-border group-hover:border-primary transition-colors">
                  <img
                    src={subcategory.cover}
                    alt={subcategory.name}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <p className="text-center text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {subcategory.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;