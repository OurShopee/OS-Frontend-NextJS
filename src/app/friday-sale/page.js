import { NavigationapiServer, getSectionPagesApiServer } from "@/api/products";
import { getServerSideHeaders } from "@/lib/serverUtils";
import { getCountryDataFromRequest } from "@/api/config";
import { cache } from "react";
import FridaySaleClient from "./FridaySaleClient";

const getCachedSectionPagesData = cache(async (sectionId, req) => {
  return await getSectionPagesApiServer(sectionId, undefined, req);
});

export const metadata = {
  title: "Friday Sale - Exclusive Deals & Offers | OurShopee",
  description:
    "Shop the Friday Sale at OurShopee! Get exclusive deals on electronics, home appliances, perfumes, watches & more. Limited time offers - Don't miss out!",
  keywords:
    "friday sale, sale, deals, offers, discounts, electronics, fashion, home appliances, online shopping",
  openGraph: {
    title: "Friday Sale - Exclusive Deals & Offers | OurShopee",
    description:
      "Shop the Friday Sale at OurShopee! Get exclusive deals on electronics, home appliances, perfumes, watches & more. Limited time offers - Don't miss out!",
    siteName: "OurShopee",

    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Friday Sale - Exclusive Deals & Offers | OurShopee",
    description:
      "Shop the Friday Sale at OurShopee! Get exclusive deals on electronics, home appliances, perfumes, watches & more. Limited time offers - Don't miss out!",
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

const ElevenSale = async () => {
  // Get server-side headers for country detection
  const req = await getServerSideHeaders();

  // Get country data from request
  const countryData = getCountryDataFromRequest(req);

  // Extract section ID from navigation data (id === 11 for Friday Sale)
  const sectionId = countryData?.nav_items?.find(
    (i) => i.id === 11
  )?.section_id;

  // Get section pages data if sectionId exists
  let saleData = null;
  if (sectionId) {
    const response = await getCachedSectionPagesData(sectionId, req);
    if (response?.status === "success") {
      saleData = response.data;
    }
    console.log(response)
  }

  return <FridaySaleClient saleData={saleData} currentcountry={countryData} />;
};

export default ElevenSale;
