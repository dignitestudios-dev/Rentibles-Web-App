"use client";
import React, { useState } from "react";
import ProductCard from "../home/_components/product-card";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const FavoritePage = () => {
  const router = useRouter();
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const allProducts = [
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
      rating: 4.5,
    },
  ];

  const handleProductClick = (productId: string) => {
    router.push(`/app/products/${productId}`);
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

          <h1 className="text-lg font-semibold">Favorite Page</h1>
          <div></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
            >
              <ProductCard
                product={{
                  ...product,
                  isLiked: likedProducts.has(product._id),
                }}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No products found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
