"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ProductCard from "../../home/_components/product-card";
import { CATEGORIES } from "../../home/_components/categories";

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

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const category = CATEGORIES.find((c) => c._id === id) ?? { name: "Category" };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold">
            {category.name}
          </h1>

          <div className="w-10" />
        </div>
      </div>

      <main className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dummyProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
