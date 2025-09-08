"use client";

import { useState } from "react";
import { CarouselProducts } from "../../homepage"; // adjust the import path if needed

export default function TabbedProductSlider({ tabs, productData }) {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);

  return (
    <div className="w-full bg-[#f5f3ff] rounded-xl p-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-6 sm:gap-4 px-2 mb-6">
        {Object.keys(tabs).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`text-lg font-semibold transition-colors duration-200 ${
              activeTab === tabKey
                ? "text-black border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            {tabKey}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="component_1">
        <CarouselProducts
          products={productData}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
        />
      </div>
    </div>
  );
}
