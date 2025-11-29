"use client";

import React from "react";

/**
 * Generic fallback skeleton used while homepage sections are lazily loading.
 * Keeps layout stable by mimicking section spacing and structure.
 */
const HomeSectionFallback = () => {
  return (
    <div className="w-full rounded-2xl bg-[#f5f5f5] animate-pulse p-4 my-4">
      <div className="h-5 bg-[#e2e2e2] rounded-md w-40 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl bg-white border border-[#ececec] flex items-center justify-center"
          >
            <div className="h-12 w-12 bg-[#e5e5e5] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSectionFallback;

