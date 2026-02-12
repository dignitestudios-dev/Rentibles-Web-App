"use client";

import React from "react";
import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const reviews = [
  {
    _id: "1",
    author: "David Laid",
    rating: 4.5,
    text: "Amazing product. I booked on Monday and I got my order on the next day. I'm highly impressed with their services.",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
  {
    _id: "2",
    author: "Sophie Clark",
    rating: 5,
    text: "Excellent condition and fast delivery. Will rent again.",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
  {
    _id: "3",
    author: "Mohammed Ali",
    rating: 4,
    text: "Good value for money. The support team was helpful.",
    avatar:
      "https://rentibles-bucket.s3.us-west-2.amazonaws.com/pictures/761f866f-6b7a-4316-9dd1-085a6a042283.png",
  },
];

export default function AllReviewsPage() {
  const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-30 bg-background border-b border-border">
        <div className="flex items-center px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold">
            All Reviews
          </h1>

          <div className="w-10" />
        </div>
      </div>

      <main className="p-4 md:p-6">
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-muted dark:bg-card p-4 rounded-2xl flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full p-1 bg-primary ring-2 ring-primary overflow-hidden shrink-0">
                <img
                  src={r.avatar}
                  alt={r.author}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{r.author}</h4>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-sm">{r.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
