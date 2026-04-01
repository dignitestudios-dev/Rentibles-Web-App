"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, VideoIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaItem = {
  url: string;
  type: "image" | "video";
};

interface EvidenceSliderProps {
  pickupImages?: string[];
  pickupVideos?: string[];
  dropOffImages?: string[];
  dropOffVideos?: string[];
}

// ─── Single Slider ────────────────────────────────────────────────────────────

const MediaSlider = ({
  title,
  items,
  accentColor,
}: {
  title: string;
  items: MediaItem[];
  accentColor: "primary" | "green";
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const current = items[activeIndex];
  const accent =
    accentColor === "primary"
      ? "bg-primary hover:bg-primary/90"
      : "bg-green-500 hover:bg-green-600";
  const dotActive =
    accentColor === "primary" ? "bg-primary" : "bg-green-500";

  return (
    <div className="flex flex-col gap-3">
      {/* Section label */}
      <div className="flex items-center gap-2">
        {accentColor === "primary" ? (
          <ImageIcon className="w-4 h-4 text-primary" />
        ) : (
          <ImageIcon className="w-4 h-4 text-green-500" />
        )}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {activeIndex + 1} / {items.length}
        </span>
      </div>

      {/* Main viewer */}
      <div className="relative w-full bg-muted rounded-2xl overflow-hidden aspect-video flex items-center justify-center group">
        {/* Prev button */}
        {items.length > 1 && (
          <button
            onClick={() =>
              setActiveIndex((i) => (i - 1 + items.length) % items.length)
            }
            className={`absolute left-2 z-10 text-white rounded-full p-2 transition-colors shadow-md ${accent}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Media */}
        {current.type === "image" ? (
          <img
            src={current.url}
            alt={`${title} ${activeIndex + 1}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            key={current.url}
            src={current.url}
            controls
            className="w-full h-full object-contain"
          />
        )}

        {/* Type badge */}
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
          {current.type === "image" ? (
            <ImageIcon className="w-3.5 h-3.5 text-white" />
          ) : (
            <VideoIcon className="w-3.5 h-3.5 text-white" />
          )}
        </div>

        {/* Next button */}
        {items.length > 1 && (
          <button
            onClick={() =>
              setActiveIndex((i) => (i + 1) % items.length)
            }
            className={`absolute right-2 z-10 text-white rounded-full p-2 transition-colors shadow-md ${accent}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex
                  ? `w-5 ${dotActive}`
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? accentColor === "primary"
                    ? "border-primary"
                    : "border-green-500"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={`thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <VideoIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Evidence Slider ──────────────────────────────────────────────────────────

const EvidenceSlider = ({
  pickupImages = [],
  pickupVideos = [],
  dropOffImages = [],
  dropOffVideos = [],
}: EvidenceSliderProps) => {
  // Merge images + videos into unified MediaItem arrays
  const pickupItems: MediaItem[] = [
    ...pickupImages.map((url) => ({ url, type: "image" as const })),
    ...pickupVideos.map((url) => ({ url, type: "video" as const })),
  ];

  const dropOffItems: MediaItem[] = [
    ...dropOffImages.map((url) => ({ url, type: "image" as const })),
    ...dropOffVideos.map((url) => ({ url, type: "video" as const })),
  ];

  const hasPickup = pickupItems.length > 0;
  const hasDropOff = dropOffItems.length > 0;

  if (!hasPickup && !hasDropOff) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground">Evidence</h2>

      {hasPickup && (
        <MediaSlider
          title="Pickup Evidence"
          items={pickupItems}
          accentColor="primary"
        />
      )}

      {hasPickup && hasDropOff && (
        <hr className="border-border" />
      )}

      {hasDropOff && (
        <MediaSlider
          title="Drop-off Evidence"
          items={dropOffItems}
          accentColor="green"
        />
      )}
    </div>
  );
};

export default EvidenceSlider;