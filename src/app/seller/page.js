"use client";
import { getAssetsUrl } from "@/components/utils/helpers";
import Benefits from "@/components//seller/seller/Benefits";
import SellerHeroSection from "@/components/seller/seller//SellerHeroSection";
import SellerLandingSection from "@/components/seller/seller//SellerLandingSection";
import SellWithUs from "@/components/seller/seller//SellWithUs";

const index = () => {
  const benefits = [
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003081.svg"),
      title: "Zero Listing Fees",
      description: "Start selling without upfront charges; grow risk-free.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003082.svg"),
      title: "Real-Time Order Tracking",
      description: "Stay updated with every sale — from order to delivery.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003083.svg"),
      title: "Timely & Secure Payments",
      description:
        "Get paid on time with complete payment transparency and security.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003080.svg"),
      title: "Easy Product Listing",
      description:
        "Upload and manage your products in just a few clicks — no tech skills needed.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003079.svg"),
      title: "Wide Customer Reach",
      description:
        "Tap into a growing base of active online shoppers across regions.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003081.svg"),
      title: "Zero Listing Fees",
      description: "Start selling without upfront charges; grow risk-free.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003082.svg"),
      title: "Real-Time Order Tracking",
      description: "Stay updated with every sale — from order to delivery.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003083.svg"),
      title: "Timely & Secure Payments",
      description:
        "Get paid on time with complete payment transparency and security.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003080.svg"),
      title: "Easy Product Listing",
      description:
        "Upload and manage your products in just a few clicks — no tech skills needed.",
    },
    {
      icon: getAssetsUrl("BenefitsIcons/Group 1000003079.svg"),
      title: "Wide Customer Reach",
      description:
        "Tap into a growing base of active online shoppers across regions.",
    },
  ];
  return (
    <div className="seller-page">
      <SellerHeroSection />
      <SellerLandingSection />
      <div className="relative">
        <img src={getAssetsUrl("pattern_left.png")}
          alt="Hero"
          className="absolute w-[38%] h-full object-cover z-1"
        loading="lazy" />
        <SellWithUs />
        <Benefits benefits={benefits} />
      </div>
      {/* <ContactCard /> */}
    </div>
  );
};

export default index;
