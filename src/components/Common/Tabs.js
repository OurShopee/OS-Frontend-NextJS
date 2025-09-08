import React, { useEffect, useRef, useState, useCallback } from "react";
import "swiper/css";
import { CarouselProducts } from "@/components/homepage";
import { CarouselProducts as CarouselProductsplaceholder } from "@/components/placeholders";

const Tabs = ({ breakPointsProps, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const tabRefs = useRef([]);

  const loadProducts = useCallback(
    async (tabTitle) => {
      // Check if we already have data for this tab
      if (tabData[tabTitle]) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const tabConfig = tabs.find((tab) => tab.title === tabTitle);
      if (!tabConfig || typeof tabConfig.endpoint !== "function") {
        console.error("Invalid tab or endpoint");
        setLoading(false);
        return;
      }
      
      try {
         const imgUrl = tabConfig.imgUrl || "";
         const imgRedirectionUrl = tabConfig.imgRedirectionUrl || "";
        const { data } = await tabConfig.endpoint();

        if (data.status === "success") {
          const products = tabConfig.path
            ? data?.data?.[tabConfig.path]
            : data.data || []

          // Store the data for this tab
          setTabData((prev) => ({
            ...prev,
            [tabTitle]: {
              products,
              imgUrl,
              imgRedirectionUrl,
            },
          }));
        } else {
          setTabData((prev) => ({
            ...prev,
            [tabTitle]: {
              products: [],
              imgUrl: "",
            },
          }));
          console.error("API returned failure:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setTabData((prev) => ({
          ...prev,
          [tabTitle]: {
            products: [],
            imgUrl: "",
          },
        }));
      }

      setLoading(false);
      if (initialLoad) {
        setInitialLoad(false);
      }
    },
    [tabs, tabData, initialLoad]
  );

  // Load initial tab data on mount
  useEffect(() => {
    if (activeTab) {
      loadProducts(activeTab);
    }
  }, [activeTab, loadProducts]);

  // Preload next tab's data in background
  useEffect(() => {
    if (!initialLoad && activeTab) {
      const currentIndex = tabs.findIndex((tab) => tab.title === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex];

      if (nextTab && !tabData[nextTab.title]) {
        // Preload next tab data with a slight delay
        const timeoutId = setTimeout(() => {
          loadProducts(nextTab.title);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [activeTab, initialLoad, tabs, tabData, loadProducts]);

  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.title === activeTab);
    const activeTabEl = tabRefs.current[activeIndex];
    if (activeTabEl) {
      const { offsetLeft, clientWidth } = activeTabEl;
      setUnderlineStyle({ left: offsetLeft, width: clientWidth });
    }
  }, [activeTab, tabs]);

  const handleTabClick = (tabTitle, index) => {
    setActiveTab(tabTitle);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    // Load products for the clicked tab if not already loaded
    if (!tabData[tabTitle]) {
      loadProducts(tabTitle);
    }
  };

  // Get current tab data
  const currentTabData = tabData[activeTab] || { products: [], imgUrl: "" };
  const isCurrentTabLoading = loading || !tabData[activeTab];

  return (
    <div className="tw-w-full tw-h-full mt-4 tw-rounded-2xl">
      {/* Tabs */}
      <div className="tw-relative tw-flex tw-gap-6 tw-pl-2 tw-border-b tw-border-gray-200 tw-mb-4 tw-overflow-x-auto tw-whitespace-nowrap tw-flex-nowrap hide-scrollbar">
        {tabs?.map((tab, index) => (
          <div
            key={tab.title}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleTabClick(tab.title, index)}
            className={`tw-relative tw-pb-2 tw-font-[Outfit] tw-text-xl lg:tw-text-[24px] tw-tracking-[-0.01em] tw-leading-[140%] tw-capitalize tw-cursor-pointer tw-transition-all tw-duration-300
              ${
                activeTab === tab.title
                  ? "tw-text-[#43494B] tw-font-semibold"
                  : "tw-text-[#43494B] tw-text-opacity-65 tw-font-medium"
              }`}
          >
            {tab.title}
          </div>
        ))}

        {/* Animated underline */}
        <div
          className="tw-absolute tw-bottom-0 tw-h-[2px] md:tw-h-[2.5px] tw-bg-[#5B2EFF] tw-rounded-t tw-transition-all tw-duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
            position: "absolute",
          }}
        />
      </div>

      {/* Products */}
      {isCurrentTabLoading ? (
        <CarouselProductsplaceholder
          category_list={[1, 2, 3, 4, 5, 6, 7, 8]}
          type={1}
          breakPointsProps={breakPointsProps}
        />
      ) : (
        <CarouselProducts
          products={currentTabData.products}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          breakPointsProps={breakPointsProps}
          imgUrl={currentTabData.imgUrl}
          imgRedirectionUrl={currentTabData.imgRedirectionUrl}
          section_name={activeTab}
        />
      )}
    </div>
  );
};

export default Tabs;
