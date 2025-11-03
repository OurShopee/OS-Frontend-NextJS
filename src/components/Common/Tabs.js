import React, { useEffect, useRef, useState, useCallback } from "react";
import "swiper/css";
import { CarouselWithBanner } from "@/components/homepage";
import { CarouselProducts as CarouselProductsplaceholder } from "@/components/placeholders";

const Tabs = ({ breakPointsProps, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const tabRefs = useRef([]);
  const tabDataRef = useRef({});
  const loadingRef = useRef({});
  const CACHE_KEY = 'homepage_tabs_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Load cached data from sessionStorage
  const loadCachedData = useCallback(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          return cachedData;
        } else {
          // Cache expired, remove it
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
    return null;
  }, [CACHE_KEY, CACHE_DURATION]);

  // Save data to sessionStorage
  const saveCachedData = useCallback((data) => {
    try {
      const cacheObject = {
        data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      console.error("Error saving cached data:", error);
    }
  }, [CACHE_KEY]);

  const loadProducts = useCallback(
    async (tabTitle) => {
      // Check if we already have data for this tab or if it's currently loading
      if (tabDataRef.current[tabTitle] || loadingRef.current[tabTitle]) {
        setLoading(false);
        return;
      }

      // Mark this tab as loading
      loadingRef.current[tabTitle] = true;
      setLoading(true);
      
      const tabConfig = tabs.find((tab) => tab.title === tabTitle);
      if (!tabConfig || typeof tabConfig.endpoint !== "function") {
        console.error("Invalid tab or endpoint");
        setLoading(false);
        loadingRef.current[tabTitle] = false;
        return;
      }

      try {
        const imgUrl = tabConfig.imgUrl || "";
        const imgRedirectionUrl = tabConfig.imgRedirectionUrl || "";
        const { data } = await tabConfig.endpoint();

        if (data.status === "success") {
          const products = tabConfig.path
            ? data?.data?.[tabConfig.path]
            : data.data || [];

          const tabInfo = {
            products,
            imgUrl,
            imgRedirectionUrl,
          };

          // Store the data for this tab in both ref and state
          tabDataRef.current[tabTitle] = tabInfo;
          setTabData((prev) => {
            const newData = {
              ...prev,
              [tabTitle]: tabInfo,
            };
            // Save to cache
            saveCachedData(newData);
            return newData;
          });
        } else {
          const emptyTabInfo = {
            products: [],
            imgUrl: "",
          };
          
          tabDataRef.current[tabTitle] = emptyTabInfo;
          setTabData((prev) => ({
            ...prev,
            [tabTitle]: emptyTabInfo,
          }));
          console.error("API returned failure:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        const emptyTabInfo = {
          products: [],
          imgUrl: "",
        };
        
        tabDataRef.current[tabTitle] = emptyTabInfo;
        setTabData((prev) => ({
          ...prev,
          [tabTitle]: emptyTabInfo,
        }));
      }

      setLoading(false);
      loadingRef.current[tabTitle] = false;
      if (initialLoad) {
        setInitialLoad(false);
      }
    },
    [tabs, initialLoad, saveCachedData]
  );

  // Initialize cache on mount
  useEffect(() => {
    const cachedData = loadCachedData();
    if (cachedData) {
      // Restore cached data to both ref and state
      tabDataRef.current = cachedData;
      setTabData(cachedData);
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loadCachedData]);

  // Load initial tab data on mount
  useEffect(() => {
    if (activeTab && !tabDataRef.current[activeTab]) {
      loadProducts(activeTab);
    }
  }, [activeTab, loadProducts]);

  // Preload next tab's data in background
  useEffect(() => {
    if (!initialLoad && activeTab) {
      const currentIndex = tabs.findIndex((tab) => tab.title === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex];

      if (nextTab && !tabDataRef.current[nextTab.title] && !loadingRef.current[nextTab.title]) {
        // Preload next tab data with a slight delay
        const timeoutId = setTimeout(() => {
          loadProducts(nextTab.title);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [activeTab, initialLoad, tabs, loadProducts]);

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
    if (!tabDataRef.current[tabTitle] && !loadingRef.current[tabTitle]) {
      loadProducts(tabTitle);
    }
  };

  // Get current tab data
  const currentTabData = tabData[activeTab] || { products: [], imgUrl: "" };
  const isCurrentTabLoading = loading || !tabData[activeTab];

  return (
    <div className="w-full h-full mt-4 rounded-2xl">
      {/* Tabs */}
      <div className="relative flex gap-6 pl-2 mb-4 overflow-x-auto whitespace-nowrap flex-nowrap hide-scrollbar">
        {tabs?.map((tab, index) => (
          <div
            key={tab.title}
            ref={(el) => (tabRefs.current[index] = el)}
            onClick={() => handleTabClick(tab.title, index)}
            className={`relative pb-2 font-[Outfit] text-xl lg:text-[24px] tracking-[-0.01em] leading-[140%] capitalize cursor-pointer transition-all duration-300
              ${
                activeTab === tab.title
                  ? "text-[#43494B] font-semibold"
                  : "text-[#43494B] text-opacity-65 font-medium"
              }`}
          >
            {tab.title}
          </div>
        ))}

        {/* Animated underline */}
        <div
          className="absolute bottom-0 h-[2px] md:h-[2.5px] bg-[#5B2EFF] rounded-t transition-all duration-300"
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
        <CarouselWithBanner
          products={currentTabData.products}
          type={1}
          inner_bg={"rgba(238, 235, 250, 1)"}
          breakPointsProps={breakPointsProps}
          bannerImage={currentTabData.imgUrl}
          bannerImageRedirectUrl={currentTabData.imgRedirectionUrl}
          section_name={activeTab}
        />
      )}
    </div>
  );
};

export default Tabs;
