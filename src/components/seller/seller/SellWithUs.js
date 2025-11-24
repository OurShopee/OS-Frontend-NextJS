import React from "react";
import SellerAlignCards from "../../Common/SellerAlignCards";
import { getAssetsUrl } from "../../utils/helpers";
const SellWithUs = () => {
  const cards = [
    {
      id: 1,
      name: "Register",
      description:
        "Create your account to register yourself as a seller on OurShopee and start selling today!",
    },
    {
      id: 2,
      name: "List Products",
      description:
        "List your products on OurShopee and start reaching thousands of customers instantly!",
    },
    {
      id: 3,
      name: "Orders & Shipment",
      description:
        "Receive orders and track your shipments seamlessly with OurShopee’s seller dashboard!",
    },
    {
      id: 4,
      name: "Payment",
      description:
        "Easily manage your payments and track earnings with OurShopee’s secure seller platform!",
    },
  ];
  return (
    <div
      className="flex flex-col justify-center items-center py-3"
      id="get-started"
    >
      <div className="hidden xl:flex flex-col justify-center items-center py-3">
        <div className="flex flex-col items-center">
          <span className="text-[36px] font-semibold font-[Outfit] text-black">
            Get Started & Sell With Us
          </span>
          <img src={getAssetsUrl("border.png")}
            alt="Hero"
            className=""
            style={{
              width: "100%",
              maxWidth: "380px",
              zIndex: 1,
              height: "1.5px",
            }}
          loading="lazy" />
        </div>
      </div>
      <div className="xl:hidden text-center w-max">
        <span className="text-base xl:text-[36px] font-semibold font-[Outfit] text-black">
          Get Started & Sell With Us
        </span>
        <div className="w-[85%] m-auto flex gap-1 xl:hidden mt-1">
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="flex-grow h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
        </div>
      </div>

      <div className="flex w-full px-3 items-center">
        <div className="hidden xl:flex justify-end items-center w-[60%]">
          <img src={getAssetsUrl("ipad.png")}
            alt="Hero"
            className="w-full h-full object-cover z-10"
          loading="lazy" />
        </div>
        <div className="flex justify-center w-full xl:w-[60%]">
          <SellerAlignCards data={cards} />
        </div>
      </div>
    </div>
  );
};

export default SellWithUs;
