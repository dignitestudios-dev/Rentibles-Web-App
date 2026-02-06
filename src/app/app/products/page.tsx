"use client";

import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Categories, { CATEGORIES } from "../home/_components/categories";
import ProductCard from "../home/_components/product-card";
import Link from "next/link";

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  // Sample products data
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
      rating: 4.5,
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
      rating: 4.5,
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
      rating: 4.5,
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
      rating: 4.5,
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
      rating: 4.5,
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
      rating: 4.5,
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
      rating: 4.5,
    },
  ];

  // Get selected category from URL params
  const selectedCategory = searchParams?.get("category") ?? "all";

  // Filter products by category
  const filteredProducts =
    selectedCategory && selectedCategory !== "all"
      ? allProducts.filter(
          (product) => product.category._id === selectedCategory,
        )
      : allProducts;

  const handleProductLike = (productId: string) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/app/products/${productId}`);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg md:text-xl font-semibold">Products</h1>

          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* Categories Section */}
        <Categories />

        {/* Products Grid */}
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
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
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No products found in this category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
