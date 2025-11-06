// components/MastZone.jsx
"use client";

import { useState, useCallback } from "react";
import AutoToggleHeader from "./AutoToggleHeader";
import CategoryCard from "./CategoryCard";

export default function MastZone() {
  const [activeTab, setActiveTab] = useState("mast");

  const mastCategories = [
    {
      id: 1,
      title: "Tablets",
      subtitle: "Our Finest, Curated for You",
      image: "/images/tablets.jpg",
      bgColor: "bg-white",
    },
    {
      id: 2,
      title: "Laptops",
      subtitle: "Our Finest, Broad Selection",
      image: "/assets/banners/sellus.png",
      bgColor: "bg-gray-900",
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Top Deals, Best Prices",
      image: "/assets/banners/sellus.png",
      badge: "70% OFF",
      bgColor: "bg-black",
    },
    {
      id: 4,
      title: "Accessories",
      subtitle: "Hot Drops, Endless Styles",
      image: "/assets/banners/sellus.png",
      badge: "70% OFF*",
      bgColor: "bg-blue-600",
    },
  ];

  const namasteCategories = [
    {
      id: 1,
      title: "Mobiles",
      subtitle: "Latest Models, Best Prices",
      image: "/assets/banners/sellus.png",
      bgColor: "bg-white",
    },
    {
      id: 2,
      title: "TVs",
      subtitle: "Big Screens, Clear Views",
      image: "/assets/banners/sellus.png",
      bgColor: "bg-gray-900",
    },
    {
      id: 3,
      title: "Headphones",
      subtitle: "Premium Audio, Amazing Deals",
      image: "/assets/banners/sellus.png",
      badge: "50% OFF",
      bgColor: "bg-black",
    },
    {
      id: 4,
      title: "Smart Watches",
      subtitle: "Stay Connected, Stay Fit",
      image: "/assets/banners/sellus.png",
      badge: "60% OFF*",
      bgColor: "bg-blue-600",
    },
  ];

  const categories = activeTab === "mast" ? mastCategories : namasteCategories;

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl px-5 relative overflow-hidden">
      {/* Dotted Pattern Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <AutoToggleHeader onTabChange={handleTabChange} />

      {/* Category Cards Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-6 mb-4">
        {categories?.slice(0, 2)?.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>

      {/* Second Row - Next 2 Cards */}
      <div className="relative z-10 grid grid-cols-2 gap-6 mb-4">
        {categories?.slice(2, 4)?.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
}
