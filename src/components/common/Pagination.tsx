"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={!hasPrevPage || isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          hasPrevPage && !isLoading
            ? "border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
            : "border-gray-300 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Info */}
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-sm font-medium text-foreground">
          Page <span className="font-bold">{currentPage}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasNextPage || isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          hasNextPage && !isLoading
            ? "border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
            : "border-gray-300 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
