// components/ProductRequestCard.tsx
"use client";

import React from "react";
import { Trash2, Store, Tag } from "lucide-react";
import { ProductRequest } from "@/src/types/index.type";

interface ProductRequestCardProps {
  request: ProductRequest;
  onDelete: (id: string) => void;
}

const ProductRequestCard: React.FC<ProductRequestCardProps> = ({
  request,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      window.confirm(
        `Are you sure you want to delete the request for "${request.productName}"?`,
      )
    ) {
      onDelete(request.id);
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 relative group">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 p-2 rounded-lg bg-red-600 text-red-50 transition-all duration-200 hover:bg-red-700 cursor-pointer"
        aria-label="Delete product request"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-12">
        {request.productName}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {request.description}
      </p>
      <span className="text-xs text-gray-500">
        {formatDate(request.createdAt)}
      </span>
    </div>
  );
};

export default ProductRequestCard;
