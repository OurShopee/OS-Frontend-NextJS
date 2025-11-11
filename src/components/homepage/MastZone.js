// components/MastZone.jsx
"use client";

import { useState, useCallback } from "react";
import AutoToggleHeader from "./AutoToggleHeader";
import CategoryCard from "./CategoryCard";
import { MediaQueries } from "../utils";

export default function MastZone({
  section238Data,
  section59Data,
  mastZoneBgImage,
  namasteZoneBgImage,
}) {
  const { isMobile } = MediaQueries();
  const [activeTab, setActiveTab] = useState(section238Data?.heading);

  const categories =
    activeTab === section238Data?.heading ? section238Data : section59Data;

  const backgroundImage =
    activeTab === section238Data?.heading
      ? mastZoneBgImage
      : namasteZoneBgImage;

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <img src={backgroundImage} className="absolute w-full h-full z-0" />
      <div className="z-10 rounded-2xl px-5">
        {/* Header */}
        <AutoToggleHeader
          onTabChange={handleTabChange}
          section238Data={section238Data}
          section59Data={section59Data}
        />

        {/* Category Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-6 mb-4">
          {categories?.multiple_image?.slice(0, 2)?.map((category) => (
            <CategoryCard key={category.section_id} {...category} />
          ))}
        </div>

        {/* Second Row - Next 2 Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-6 mb-4">
          {categories?.multiple_image?.slice(2, 4)?.map((category) => (
            <CategoryCard key={category.section_id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
