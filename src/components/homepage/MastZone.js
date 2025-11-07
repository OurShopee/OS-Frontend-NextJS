// components/MastZone.jsx
"use client";

import { useState, useCallback } from "react";
import AutoToggleHeader from "./AutoToggleHeader";
import CategoryCard from "./CategoryCard";
import { MediaQueries } from "../utils";

export default function MastZone({ section238Data, section59Data }) {
  const {isMobile} = MediaQueries()
  const [activeTab, setActiveTab] = useState(section238Data?.heading);


  const categories =
    activeTab === section238Data?.heading ? section238Data : section59Data;
  const backgroundDesktopImage =  activeTab === section238Data?.heading ? section238Data?.background_image?.[0]?.desktopImage : section59Data?.background_image?.[0]?.desktopImage;
  const backgroundMobileImage =  activeTab === section238Data?.heading ? section238Data?.background_image?.[0]?.mobileImage : section59Data?.background_image?.[0]?.mobileImage;
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);
  
  return (
    <div className="rounded-2xl px-5 relative overflow-hidden">
      {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${isMobile ? backgroundMobileImage : backgroundDesktopImage})`,
          }}
        />

      {/* Header */}
      <AutoToggleHeader onTabChange={handleTabChange} section238Data={section238Data} section59Data={section59Data} />

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
  );
}
