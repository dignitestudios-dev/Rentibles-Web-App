"use client";

import { useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { useProductReviewById } from "@/src/lib/api/products";
import { NoDataFound } from "@/public/images/export";

interface ReviewSectionProps {
  productId: string;
  isBookNow: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  isBookNow,
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const { data: reviewResponse } = useProductReviewById(productId);

  if (isBookNow) return null;

  return (
    <div className="mt-12 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">What People Say</h3>
        {reviewResponse?.data && reviewResponse.data.length > 0 && (
          <Link
            href={`/app/products/${productId}/reviews`}
            className="text-primary hover:underline"
          >
            See All
          </Link>
        )}
      </div>

      {/* Swiper for Reviews */}
      {reviewResponse?.data && reviewResponse.data.length > 0 ? (
        <Swiper
          ref={swiperRef}
          modules={[Navigation, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 1.5,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
          className="reviews-swiper"
        >
          {reviewResponse?.data?.map((review) => (
            <SwiperSlide key={review._id}>
              <div className="bg-muted dark:bg-card p-6 rounded-2xl h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full p-1 bg-primary ring-2 ring-primary shrink-0 overflow-hidden">
                    <img
                      src={review.user.profilePicture}
                      alt={review.user.name}
                      className="w-full h-full object-fill rounded-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-lg">
                        {review.user.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="font-semibold text-sm">
                          {review.stars}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex justify-center items-center w-full mt-10">
          <div className="flex flex-col justify-center items-center">
            <Image src={NoDataFound} alt="Review_Search" className="w-48" />
            <p className="text-foreground mt-2 font-semibold">
              No Reviews Available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
