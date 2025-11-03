// components/TopSelling.jsx
"use client";

import { useState } from "react";
import { ProductCard } from "../Common";

export default function TopSelling() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    {
      id: 1,
      name: "HP Victus Intel Core i5 12th Gen 12450H - (16 GB/1 TB...",
      image: "/images/hp-victus.jpg",
      price: 800,
      originalPrice: 1980,
      discount: "19% OFF",
      countdown: { hours: 9, minutes: 9, seconds: 9 },
    },
    {
      id: 2,
      name: "HP Victus Intel Core i5 12th Gen 12450H - (16 GB/1 TB...",
      image: "/images/hp-victus-2.jpg",
      price: 800,
      originalPrice: 1980,
      discount: "19% OFF",
      countdown: { hours: 9, minutes: 9, seconds: 9 },
    },
    {
      id: 3,
      name: "HP Victus Intel Core i5 12th Gen 12450H - (16 GB/1 TB...",
      image: "/images/hp-victus-3.jpg",
      price: 800,
      originalPrice: 1980,
      discount: "19% OFF",
      countdown: { hours: 9, minutes: 9, seconds: 9 },
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 2));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 2 ? prev + 1 : 0));
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-gray-400">Top</span>{" "}
            <span className="text-gray-700">Selling</span>
          </h2>
          <div className="relative">
            <span className="text-3xl">🔥</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              6
            </span>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
          View all
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 -ml-4"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex gap-4 overflow-hidden">
          {products.slice(currentIndex, currentIndex + 2).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 -mr-4"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
