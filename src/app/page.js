import React, { cache } from "react";
import HomeClient from "./HomeClient";
import { getServerSideHeaders } from "@/lib/serverUtils";
import { ServerDataProvider } from "@/contexts/ServerDataContext";
import {
  NavigationapiServer,
  getbannerlistapiServer,
  getSectionPagesApiServer,
  getcategory_itemsApiServer,
} from "@/api/products";

// Cache the API calls to prevent duplicate requests
const getCachedNavigationData = cache(async (req) => {
  return await NavigationapiServer(req);
});

const getCachedBannerData = cache(async (req) => {
  return await getbannerlistapiServer(req);
});

const getCachedSectionPagesData = cache(async (sectionId, req) => {
  return await getSectionPagesApiServer(sectionId, undefined, req);
});

const getCachedCategoryItemsData = cache(async (req) => {
  return await getcategory_itemsApiServer(req);
});

export const metadata = {
  title:
    "Online Shopping UAE - Mobiles, Laptops, Appliances & More | OurShopee",
  description:
    "Shop online for great deals on electronics, home appliances, perfumes, watches & more at OurShopee UAE. Browse our collections today - Fast Delivery & Easy Returns!",
  keywords:
    "online shopping, deals, offers, electronics, fashion, home appliances, UAE, Dubai, Abu Dhabi",
  openGraph: {
    title:
      "Online Shopping UAE - Mobiles, Laptops, Appliances & More | OurShopee",
    description:
      "Shop online for great deals on electronics, home appliances, perfumes, watches & more at OurShopee UAE. Browse our collections today - Fast Delivery & Easy Returns!",
    url: "https://www.ourshopee.com/",
    siteName: "OurShopee",
    images: [
      {
        url: "https://yourcdn.com/assets/og-home-image.webp",
        width: 1200,
        height: 630,
        alt: "OurShopee - Online Shopping UAE",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Online Shopping UAE - Mobiles, Laptops, Appliances & More | OurShopee",
    description:
      "Shop online for great deals on electronics, home appliances, perfumes, watches & more at OurShopee UAE. Browse our collections today - Fast Delivery & Easy Returns!",
    images: ["https://yourcdn.com/assets/og-home-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const Home = async () => {
  // Get server-side headers for country detection
  const req = await getServerSideHeaders();

  // Make server-side API calls with caching
  const [navigationData, bannerListData, categoryItemsData] = await Promise.all(
    [
      getCachedNavigationData(req),
      getCachedBannerData(req),
      getCachedCategoryItemsData(req),
    ]
  );

  // Extract section ID from navigation data
  const sectionId = navigationData?.data?.nav_items?.find(
    (i) => i.id === 11
  )?.section_id;

  // Get section pages data if sectionId exists
  let sectionPagesData = null;
  if (sectionId) {
    sectionPagesData = await getCachedSectionPagesData(sectionId, req);
  }

  const serverData = {
    navigationData,
    bannerListData,
    sectionPagesData,
    categoryItemsData,
  };

  return (
    <ServerDataProvider serverData={serverData}>
      <HomeClient
        initialNavigationData={navigationData}
        initialBannerListData={bannerListData}
        initialSectionPagesData={sectionPagesData}
        initialCategoryItemsData={categoryItemsData}
      />
    </ServerDataProvider>
  );
};

export default Home;
