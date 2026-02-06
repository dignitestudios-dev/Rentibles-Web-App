"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import type SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface MediaViewerProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      setActiveIndex(initialIndex);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-8 h-8 text-white" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Swiper Container */}
      <div className="w-full h-full flex items-center justify-center relative px-4 md:px-12">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Keyboard]}
          navigation={{
            nextEl: ".media-viewer-next",
            prevEl: ".media-viewer-prev",
          }}
          keyboard={{ enabled: true }}
          initialSlide={initialIndex}
          loop={false}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full max-w-4xl"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center">
              <img
                src={image}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left Chevron */}
        <button
          className="media-viewer-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Chevron */}
        <button
          className="media-viewer-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Image Thumbnails */}
      <div className="absolute bottom-6 left-0 right-0 z-20 py-2 flex justify-center gap-2 px-4 overflow-x-auto">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideTo(idx);
                setActiveIndex(idx);
              }
            }}
            className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all border-2 ${
              activeIndex === idx
                ? "border-white ring-2 ring-primary"
                : "border-white/30 hover:border-white/50"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MediaViewer;
