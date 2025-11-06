import React, { useEffect, useRef, useState, useCallback } from "react";
import "swiper/css";
import { CarouselWithBanner } from "@/components/homepage";
import { CarouselProducts as CarouselProductsplaceholder } from "@/components/placeholders";
import CountdownTimer from "../homepage/CountdownTimer";

const Tabs = ({ breakPointsProps, tabs, countdownEndDate }) => {
  // Single source of truth for all tab data
  const [tabsState, setTabsState] = useState({});
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || "");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const tabRefs = useRef([]);
  const loadingStatusRef = useRef({});
  const errorStatusRef = useRef({}); // Track if we've already encountered an error
  const CACHE_KEY = "homepage_tabs_cache_v2";
  const CACHE_DURATION = 5 * 60 * 1000;

  // Initialize tab state structure
  useEffect(() => {
    const initialState = tabs.reduce((acc, tab) => {
      acc[tab.title] = {
        products: [],
        imgUrl: "",
        imgRedirectionUrl: "",
        isLoading: true,
        error: null,
      };
      return acc;
    }, {});

    setTabsState(initialState);
  }, [tabs.length]); // Only re-run if tabs array length changes

  // Load cached data once
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp < CACHE_DURATION) {
          setTabsState((prev) => ({
            ...prev,
            ...cachedData,
          }));
          // Mark loaded tabs so we don't reload them and clear any error status
          Object.keys(cachedData).forEach((tabTitle) => {
            loadingStatusRef.current[tabTitle] = false;
            // Clear error status if we have cached data (means it was successful before)
            if (cachedData[tabTitle]?.products?.length > 0) {
              errorStatusRef.current[tabTitle] = false;
            }
          });
        } else {
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
  }, []); // Run only once on mount

  // Fetch products for a specific tab
  const fetchTabData = useCallback(
    async (tabTitle) => {
      // Skip if already loaded, loading, or if we've already encountered an error
      if (
        tabsState[tabTitle]?.products?.length > 0 ||
        loadingStatusRef.current[tabTitle] ||
        errorStatusRef.current[tabTitle]
      ) {
        return;
      }

      loadingStatusRef.current[tabTitle] = true;

      const tabConfig = tabs.find((tab) => tab.title === tabTitle);
      if (!tabConfig || typeof tabConfig.endpoint !== "function") {
        console.error(`Invalid tab config for: ${tabTitle}`);
        setTabsState((prev) => ({
          ...prev,
          [tabTitle]: {
            ...prev[tabTitle],
            isLoading: false,
            error: "Invalid configuration",
          },
        }));
        errorStatusRef.current[tabTitle] = true; // Mark as error to prevent retries
        loadingStatusRef.current[tabTitle] = false;
        return;
      }

      try {
        const { data } = await tabConfig.endpoint();

        if (data.status === "success") {
          const products = tabConfig.path
            ? data?.data?.[tabConfig.path]
            : data.data || [];

          const newTabData = {
            products,
            imgUrl: tabConfig.imgUrl || "",
            imgRedirectionUrl: tabConfig.imgRedirectionUrl || "",
            isLoading: false,
            error: null,
          };

          // Clear error status on success
          errorStatusRef.current[tabTitle] = false;

          // Update state
          setTabsState((prev) => ({
            ...prev,
            [tabTitle]: newTabData,
          }));

          // Update cache
          setTabsState((currentState) => {
            const cacheObject = {
              data: currentState,
              timestamp: Date.now(),
            };
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
            } catch (cacheError) {
              console.error("Error saving cache:", cacheError);
            }
            return currentState;
          });
        } else {
          throw new Error(data.message || "API returned failure");
        }
      } catch (error) {
        console.error(`Error fetching products for ${tabTitle}:`, error);
        
        // Check if it's a 500 error or server error
        const isServerError = error?.response?.status >= 500 || 
                             error?.response?.status === 500 ||
                             error?.message?.includes('500') ||
                             error?.code === 'ERR_NETWORK';
        
        // Mark as error to prevent infinite retries
        errorStatusRef.current[tabTitle] = true;
        
        setTabsState((prev) => ({
          ...prev,
          [tabTitle]: {
            ...prev[tabTitle],
            products: [],
            isLoading: false,
            error: error.message || "Failed to load products",
          },
        }));
      } finally {
        loadingStatusRef.current[tabTitle] = false;
      }
    },
    [tabs, CACHE_KEY] // Removed tabsState from dependencies to prevent infinite loops
  );

  // Load data for active tab
  useEffect(() => {
    if (activeTab && tabsState[activeTab] && !errorStatusRef.current[activeTab]) {
      fetchTabData(activeTab);
    }
  }, [activeTab, fetchTabData]); // tabsState removed to prevent re-triggering on state updates

  // Preload next tab
  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.title === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];

    if (nextTab && !loadingStatusRef.current[nextTab.title] && !errorStatusRef.current[nextTab.title]) {
      const preloadTimer = setTimeout(() => {
        fetchTabData(nextTab.title);
      }, 600); // Delay to not interfere with current tab

      return () => clearTimeout(preloadTimer);
    }
  }, [activeTab, tabs, fetchTabData]);

  // Update underline position
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.title === activeTab);
    const activeTabEl = tabRefs.current[activeIndex];

    if (activeTabEl) {
      const { offsetLeft, clientWidth } = activeTabEl;
      setUnderlineStyle({ left: offsetLeft, width: clientWidth });
    }
  }, [activeTab, tabs]);

  // Handle tab click
  const handleTabClick = (tabTitle, index) => {
    setActiveTab(tabTitle);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // Get current tab data
  const currentTabData = tabsState[activeTab] || {
    products: [],
    imgUrl: "",
    imgRedirectionUrl: "",
    isLoading: true,
    error: null,
  };

  const isCurrentTabLoading = currentTabData.isLoading;

  return (
    <div className="w-full h-full mt-4 rounded-2xl">
      {/* Tabs with CountdownTimer */}
      <div className="relative flex items-center gap-4 mb-4">
        {/* Scrollable tabs container */}
        <div className="relative flex gap-6 pl-2 overflow-x-auto whitespace-nowrap flex-nowrap hide-scrollbar flex-1">
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
            }}
          />
        </div>

        {/* CountdownTimer - sticky on the right */}
        {countdownEndDate && (
          <div className="flex-shrink-0">
            <CountdownTimer
              endZoned={countdownEndDate}
              className="text-sm md:text-base"
            />
          </div>
        )}
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

