"use client";
import React from "react";

/**
 * Fallback component for ProductCard lazy loading
 * Displays a skeleton/placeholder while ProductCard is being loaded
 */
const ProductCardFallback = () => {
  return (
    <div className="relative overflow-hidden product-card min-h-[267px] flex flex-col justify-between animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative p-4 pb-0 flex items-center justify-center">
        <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl">
          <div className="w-full h-full max-w-[100px] max-h-[100px] bg-gray-200 rounded-lg"></div>
        </div>
        {/* Wishlist Heart Icon Skeleton */}
        <div className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 w-8 h-8"></div>
      </div>

      {/* Content Container Skeleton */}
      <div className="px-2 py-3 flex flex-col gap-1.5 mt-auto">
        {/* Product Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        {/* Price Container Skeleton */}
        <div className="flex gap-1.5 items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Button/Carousel Container Skeleton */}
        <div className="relative min-h-[40px] mt-2">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardFallback;

