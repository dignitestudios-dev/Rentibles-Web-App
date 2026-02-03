"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StoreCard from "./store-card";

type Store = {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  coverPicture?: string;
};

interface SwiperStoresProps {
  stores?: Store[];
}

const SwiperStores: React.FC<SwiperStoresProps> = ({ stores = [] }) => {
  const storeCount = stores.length || 5;

  return (
    <div className="my-5">
      <h2 className="font-semibold text-2xl mb-4">Stores</h2>

      <div className="relative">
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={16}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next-stores",
            prevEl: ".swiper-button-prev-stores",
          }}
          className="stores-swiper"
        >
          {stores.length > 0
            ? stores.map((store) => (
                <SwiperSlide key={store._id}>
                  <StoreCard store={store} />
                </SwiperSlide>
              ))
            : Array.from({ length: storeCount }).map((_, index) => (
                <SwiperSlide key={index}>
                  <StoreCard />
                </SwiperSlide>
              ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className="swiper-button-prev-stores absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors flex items-center justify-center"
          aria-label="Previous store"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          className="swiper-button-next-stores absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors flex items-center justify-center"
          aria-label="Next store"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SwiperStores;
