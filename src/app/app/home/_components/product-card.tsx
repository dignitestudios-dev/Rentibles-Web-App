import React, { useState } from "react";
import { Heart, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  _id?: string;
  name?: string;
  cover?: string;
  category?: { name?: string };
  pricePerDay?: number;
  pricePerHour?: number;
  productReview?: number;
  isLiked?: boolean;
};

const ProductCard: React.FC<{ product?: Product }> = ({ product }) => {
  const cover = product?.cover ?? "";
  const name = product?.name ?? "Product Name";
  const category = product?.category?.name ?? "Furniture";
  const price = product?.pricePerDay ?? product?.pricePerHour ?? 0;
  const review = product?.productReview?.toFixed(1) ?? 0.0;
  const liked = product?.isLiked ?? false;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-96 hover:-translate-y-2">
      <div className="p-4 h-full flex flex-col">
        <div className="relative rounded-2xl overflow-hidden bg-card h-56">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-card animate-pulse z-10" />
          )}

          <Image
            src={cover}
            alt={name}
            width={1000}
            height={1000}
            onLoadingComplete={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />

          <div className="absolute top-3 left-3 bg-gray-800 text-white rounded-md px-2 py-1 flex items-center gap-2 text-sm z-20">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{review}</span>
          </div>

          <button className="absolute top-3 right-3 bg-white rounded-md p-2 shadow flex items-center justify-center z-20">
            <Heart
              className={`w-5 h-5 ${liked ? "text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>

        <h3 className="mt-4 text-2xl font-bold">{name}</h3>
        <p className="text-gray-400">{category}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="text-2xl font-bold">${Math.round(price)}</div>
          <Link
            href={`/app/products/${product?._id}`}
            className="cursor-pointer bg-primary text-primary-foreground w-10 h-10 rounded-md flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
