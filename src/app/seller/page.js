"use client";
import icon5 from "@/images/BenefitsIcons/Group 1000003079.svg";
import icon4 from "@/images/BenefitsIcons/Group 1000003080.svg";
import icon1 from "@/images/BenefitsIcons/Group 1000003081.svg";
import icon2 from "@/images/BenefitsIcons/Group 1000003082.svg";
import icon3 from "@/images/BenefitsIcons/Group 1000003083.svg";
import pattern_left from "@/images/pattern_left.png";
import Benefits from "@/components//seller/seller/Benefits";
import SellerHeroSection from "@/components/seller/seller//SellerHeroSection";
import SellerLandingSection from "@/components/seller/seller//SellerLandingSection";
import SellWithUs from "@/components/seller/seller//SellWithUs";

const index = () => {
  const benefits = [
    {
      icon: icon1.src,
      title: "Zero Listing Fees",
      description: "Start selling without upfront charges; grow risk-free.",
    },
    {
      icon: icon2.src,
      title: "Real-Time Order Tracking",
      description: "Stay updated with every sale — from order to delivery.",
    },
    {
      icon: icon3.src,
      title: "Timely & Secure Payments",
      description:
        "Get paid on time with complete payment transparency and security.",
    },
    {
      icon: icon4.src,
      title: "Easy Product Listing",
      description:
        "Upload and manage your products in just a few clicks — no tech skills needed.",
    },
    {
      icon: icon5.src,
      title: "Wide Customer Reach",
      description:
        "Tap into a growing base of active online shoppers across regions.",
    },
    {
      icon: icon1.src,
      title: "Zero Listing Fees",
      description: "Start selling without upfront charges; grow risk-free.",
    },
    {
      icon: icon2.src,
      title: "Real-Time Order Tracking",
      description: "Stay updated with every sale — from order to delivery.",
    },
    {
      icon: icon3.src,
      title: "Timely & Secure Payments",
      description:
        "Get paid on time with complete payment transparency and security.",
    },
    {
      icon: icon4.src,
      title: "Easy Product Listing",
      description:
        "Upload and manage your products in just a few clicks — no tech skills needed.",
    },
    {
      icon: icon5.src,
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
        <img
          src={pattern_left.src}
          alt="Hero"
          className="absolute w-[38%] h-full object-cover z-1"
        />
        <SellWithUs />
        <Benefits benefits={benefits} />
      </div>
      {/* <ContactCard /> */}
    </div>
  );
};

export default index;
