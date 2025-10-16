import React from "react";
import SellerCards from "../../Common/SellerCards";
import border from "@/images/border.png";
import easyway from "@/images/easyway.png";
import pattern_left from "@/images/pattern_left.png";
import pattern_right from "@/images/pattern_right.png";
import numbers from "@/images/numbers.png";
import numbersMob from "@/images/numbersMob.png";
import card1 from "@/components/seller/gifs/card1.json";
import money from "@/components/seller/gifs/money.json";
import settings from "@/components/seller/gifs/settings.json";
import Support from "@/components/seller/gifs/Support.json";

const SellerLandingSection = () => {
  const data = [
    {
      title: "Quick Setup",
      description:
        "Get started in minutes with a simple sign-up and product listing process.",
      icon: settings,
    },
    {
      title: "Smart Management",
      description:
        "Easily handle orders, inventory, and shipping from one intuitive dashboard.",
      icon: card1,
    },
    {
      title: "Fast Payments",
      description:
        "Enjoy timely, secure payments with complete transaction transparency.",
      icon: money,
    },
    {
      title: "Seller Support",
      description:
        "Access dedicated assistance whenever you need help or guidance.",
      icon: Support,
    },
  ];

  return (
    <div className="relative h-auto bg-gradient-to-l from-[#EBE5FF] to-white pb-32 mb-24">
      <div className="flex flex-col justify-center items-center py-3">
        <div className="xl:flex text-center">
          <span className="text-base xl:text-[36px] font-semibold font-[Outfit] text-black">
            The easiest way to reach more customers -&nbsp;
          </span>
          <span className="text-base xl:text-[36px] font-semibold font-[Outfit] text-[#5232C2]">
            Ourshopee!
          </span>
        </div>
        <div className="w-[80%] xl:w-auto">
          <img src={border.src} alt="Hero" className="w-full object-cover z-1" />
        </div>
      </div>
      <div className="flex w-full px-3 items-center justify-evenly">
        <div className="flex justify-end z-10">
          <SellerCards data={data} />
        </div>
        <div className="hidden xl:flex justify-center">
          <img
            src={easyway.src}
            alt="easy"
            className="w-auto h-[430px] object-cover z-10"
          />
        </div>
      </div>
      <div className="hidden absolute top-[-40%] xl:flex w-[100%] justify-between">
        <img
          src={pattern_left.src}
          alt="Hero"
          className="w-[38%] h-full object-cover z-1"
        />
        <img
          src={pattern_right.src}
          alt="Hero"
          className="w-[33%] h-full object-cover z-1"
        />
      </div>
      <div className="absolute left-1/2 w-full translate-x-[-50%] bottom-0 translate-y-[50%] flex justify-center items-center">
        <img className="hidden xl:block" src={numbers.src} alt="Hero" />
        <img className="xl:hidden w-full px-4" src={numbersMob.src} alt="Hero" />
      </div>
    </div>
  );
};

export default SellerLandingSection;
