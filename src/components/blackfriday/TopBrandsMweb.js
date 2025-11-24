import React from "react";
import Marquee from "react-fast-marquee";
import { NavLink } from "react-router-dom";
import { handleSummerCard } from "../../components/utils/dataUserpush";
import { useSelector } from "react-redux";
import underline from "./images/underline.png";
import leaf from "./images/leaf.png";
const TopBrandsMweb = ({ topBrands }) => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const sectionName = "Top Brands";
  return (
    <div className="">
      <div className="bg-[#F6FF93] rounded-xl pb-5 px-4 py-3">
        <div className="flex justify-center items-center gap-4">
          <div className="my-4  ">
            <div
              className={`
            relative inline-block
            text-[30px] text-[rgb(42,110,77)]
            tracking-[1.01px] font-bold whitespace-nowrap
          `}
              style={{ fontFamily: "'Bobby Jones Soft Regular', cursive" }}
            >
              {/* leaf before the start */}
              <img src={leaf}
                alt=""
                width={20}
                className="absolute -left-[25px] -top-[5px] w-5 h-auto"
              loading="lazy" />
              BIG DEALS ON BIG BRANDS
              {/* scribble underline */}
              <div className="flex absolute right-0 top-[2.4rem] justify-end h-[30px]">
                <img src={underline}
                  alt=""
                  width={120}
                  height={18}
                  className="object-contain"
                loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        <Marquee
          autoFill={true}
          speed={20}
          play={true}
          pauseOnHover
          pauseOnClick
          gradient={false}
          className="overflow-hidden"
        >
          <div className="flex gap-2 overflow-x-scroll hide-scrollbar justify-between">
            {topBrands.map((b) => {
              const dataToSend = {
                sectionName,
                pageName: window.location.pathname,
              };
              return (
                <NavLink
                  key={b.url}
                  to={b.url}
                  className="bg-white rounded-xl h-[60px] w-[120px] flex items-center justify-center last:mr-4"
                  data-aos="fade"
                  data-aos-easing="linear"
                  onClick={() =>
                    handleSummerCard(currentcountry.name, dataToSend)
                  }
                >
                  <img
                    loading="lazy"
                    src={b.desktopImage}
                    alt="logo"
                    className="h-11 w-20 object-contain"
                  />
                </NavLink>
              );
            })}
          </div>
        </Marquee>
        <Marquee
          autoFill={true}
          speed={20}
          play={true}
          pauseOnHover
          pauseOnClick
          gradient={false}
          className="overflow-hidden mt-2"
          direction="right"
        >
          <div className="flex gap-4 overflow-x-scroll hide-scrollbar justify-between mt-2">
            {topBrands.map((b) => {
              const dataToSend = {
                sectionName,
                pageName: window.location.pathname,
              };
              return (
                <NavLink
                  key={b.url}
                  to={b.url}
                  className="bg-white rounded-xl h-[60px] w-[115px] flex items-center justify-center last:mr-4"
                  data-aos="fade"
                  data-aos-easing="linear"
                  onClick={() =>
                    handleSummerCard(currentcountry.name, dataToSend)
                  }
                >
                  <img
                    loading="lazy"
                    src={b.desktopImage}
                    alt="logo"
                    className="h-11 w-20 object-contain"
                  />
                </NavLink>
              );
            })}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default TopBrandsMweb;
