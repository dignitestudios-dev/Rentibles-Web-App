import React from "react";
import { Star, Phone, Heart, Flag } from "lucide-react";
import { IProductDetails, IUser } from "@/src/types/index.type";

interface ProductInfoSectionProps {
  product: IProductDetails;
  distance: string;
  storeInfo: IUser;
  isLiked?: boolean;
  onWishlistToggle?: () => void;
  onReport?: () => void;
  isWishlistLoading?: boolean;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  distance,
  storeInfo,
  isLiked = false,
  onWishlistToggle,
  onReport,
  isWishlistLoading = false,
}) => {
  return (
    <>
      {/* Product Name & Rating */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            {product.name || "Unnamed Product"}
          </h2>
          {product.productReview !== undefined && (
            <div className="flex items-center gap-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md whitespace-nowrap">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">
                  {product.productReview || "0"}
                </span>
              </div>

              {/* Heart/Like Button */}
              <button
                type="button"
                onClick={onWishlistToggle}
                disabled={isWishlistLoading}
                className="bg-white rounded-md p-2 shadow flex items-center justify-center hover:shadow-md transition-shadow disabled:opacity-50"
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Report Button */}
              <button
                type="button"
                onClick={onReport}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                title="Report product"
              >
                <Flag className="w-5 h-5" />
                Report
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {product.description || "No description available"}
        </p>
      </div>

      <hr className="my-6 border-border" />

      {/* Pickup & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {distance ? `${distance} Mile away` : "Calculating distance..."}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {/* {product.pickupAddress ||
              product.pickUpApartment ||
              "Address not provided"} */}
            Visible after booking.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-foreground/50" />
            {/* <span className="text-base text-[14px]">
              {storeInfo.phone || "Available after booking"}
            </span> */}
            Visible after booking.
          </div>
          <p className="text-sm text-foreground/40 dark:text-foreground/60">
            {storeInfo.email || ""}
          </p>
        </div>
      </div>

      <hr className="my-6 border-border" />

      {/* Category & SubCategory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <p className="text-foreground/50 dark:text-foreground/60">
            {product.category?.name || "Not specified"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sub Category</h3>
          <p className="text-foreground/50 dark:text-foreground/60">
            {product.subCategory?.name || "Not specified"}
          </p>
        </div>
      </div>

      <hr className="my-6 border-border" />
    </>
  );
};

export default ProductInfoSection;
