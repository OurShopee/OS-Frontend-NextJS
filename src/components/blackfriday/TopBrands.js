import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useSelector } from "react-redux";
import { handleSummerCard } from "../../components/utils/dataUserpush";
import leaf from "./images/leaf.png";
import underline from "./images/underline.png";
const TopBrands = ({ topBrands }) => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const sectionName = "Top Brands";
  return (
    <div className="px-3">
      <div className="bg-[#F6FF93] rounded-xl pb-5 px-4 py-3">
        <div className="flex justify-center items-center gap-4">
          <div className="my-4 px-3 ">
            <div
              className={`
            relative inline-block
            text-[55px] text-[rgb(42,110,77)]
            tracking-[2.01px] font-bold
          `}
              style={{ fontFamily: "'Bobby Jones Soft Regular', cursive" }}
            >
              {/* leaf before the start */}
              <img
                src={leaf}
                alt=""
                width={50}
                className="absolute -left-[32px] -top-[5px] w-7 h-auto"
              />
              BIG DEALS ON BIG BRANDS
              {/* scribble underline */}
              <div className="absolute right-0 top-[3.9rem] flex justify-end h-[40px]">
                <img
                  src={underline}
                  alt=""
                  width={110}
                  height={17}
                  className="object-contain"
                />
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
          <div className="flex gap-4 overflow-x-scroll hide-scrollbar justify-between">
            {topBrands.map((b) => {
              const dataToSend = {
                sectionName,
                pageName: window.location.pathname,
              };
              return (
                <Link
                  key={b.url}
                  href={b.url}
                  className="bg-white rounded-xl h-24 w-[12rem] flex items-center justify-center last:mr-4"
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
                    className="h-16 w-32 object-contain"
                  />
                </Link>
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
                <Link
                  key={b.url}
                  href={b.url}
                  className="bg-white rounded-xl h-24 w-40 flex items-center justify-center last:mr-4"
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
                    className="h-16 w-32 object-contain"
                  />
                </Link>
              );
            })}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default TopBrands;
