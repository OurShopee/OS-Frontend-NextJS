import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MediaQueries } from "../../components/utils";
import { handleSummerCard } from "../../components/utils/dataUserpush";
import ProductCard from "./ProductCard";
import leaf from "./images/leaf.png";
import left from "./images/left.png";
import right from "./images/right.png";
import underline from "./images/underline.png";

const ShopByPopularCategoryMobile = ({ rows }) => {
  const { isMobile } = MediaQueries();
  const scrollRefs = useRef([]);
  const [shrinkPxByRow, setShrinkPxByRow] = useState({});
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  const MAX_WIDTH = 165;
  const MIN_WIDTH = 110;
  const GAP = 8;
  const SHRINK_RANGE = MAX_WIDTH - MIN_WIDTH;
  const MIN_SCALE = 0.88;
  const MIN_IMG_OPACITY = 0.0;

  const fixedImages = [
    {
      title: "Pre-owned",
      Description: "Laptops",
      off: "60",
      img: left,
      color: "#F6B748",
      to: "#FFE169",
    },
    {
      title: "Pre-Owned",
      Description: "Tablets",
      off: "70",
      img: right,
      color: "#308099",
      to: "#61B2C5",
    },
    {
      title: "Perfumes",
      off: "40",
      img: "/assets/11-sale/shop-by-categories/Perfume.png",
      color: "#E0DAB9",
    },
    {
      title: "Watches",
      off: "60",
      img: "/assets/11-sale/shop-by-categories/Watches.png",
      color: "rgba(177,179,212,1)",
    },
    {
      title: "Electronics",
      off: "50",
      img: "/assets/11-sale/shop-by-categories/Electronics.png",
      color: "#D0E1E6",
    },
  ];

  const handleScroll = (rowIdx) => {
    const ref = scrollRefs.current[rowIdx];
    if (!ref) return;
    const scrolledPx = Math.min(ref.scrollLeft, SHRINK_RANGE);
    setShrinkPxByRow((prev) => ({
      ...prev,
      [rowIdx]: scrolledPx,
    }));
  };

  // Arrow component
  const RightArrow = ({ opacity, rowIdx }) => (
    <div
      className={`absolute bottom-3 right-4 w-6 h-6 bg-opacity-80 rounded-full flex items-center justify-center border ${
        rowIdx % 2 === 0 ? "border_black" : "border_white"
      }`}
      style={{
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={rowIdx % 2 === 0 ? "text-black" : "text-white"}
      >
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#F6FF93] to-[#FFFFFF] rounded-xl overflow-hidden">
      <div className="flex justify-center items-center gap-4">
        <div className="my-4">
          <div
            className={`
            relative inline-block
            text-[30px] text-[rgb(42,110,77)]
            tracking-[1.01px] font-bold whitespace-nowrap
          `}
            style={{ fontFamily: "'Bobby Jones Soft Regular', cursive" }}
          >
            <img src={leaf}
              alt=""
              width={20}
              className="absolute -left-[25px] -top-[5px] w-5 h-auto"
            loading="lazy" />
            HOT PICKS OF THE MOMENT
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

      <div className="flex flex-col gap-4 px-4">
        {rows?.map((products, rowIdx) => {
          const shrinkPx = shrinkPxByRow[rowIdx] ?? 0;
          const percent = Math.min(shrinkPx / SHRINK_RANGE, 1);
          const currentWidth = MAX_WIDTH - shrinkPx;
          const imgScale = 1 - percent * (1 - MIN_SCALE);
          const imgOpacity = 1 - percent * (1 - MIN_IMG_OPACITY);

          // Calculate text position - moves right and down as it shrinks
          const textOffsetX = percent * 1; // Horizontal movement
          const textOffsetY = percent * 80; // Vertical movement (down)
          const arrowOpacity = percent; // Arrow appears as shrinking progresses

          return (
            products.length > 0 && (
              <div className="bg-white p-2 rounded-lg" key={rowIdx}>
                <div className="relative w-full bg-white overflow-hidden">
                  <div
                    style={{
                      width: `${currentWidth}px`,
                      minWidth: `${MIN_WIDTH}px`,
                      maxWidth: `${MAX_WIDTH}px`,
                      transition: "none",
                      height: "100%",
                      background: `linear-gradient(to bottom, ${
                        fixedImages?.[rowIdx]?.color || "#fff"
                      }, ${fixedImages?.[rowIdx]?.to || "#000"})`,
                    }}
                    className={`
                      absolute left-0 top-0 h-full z-10 text-white rounded-xl shadow-lg
                      overflow-hidden
                    `}
                  >
                    {/* IMAGES LAYER */}
                    <div className="pointer-events-none">
                      <div
                        className={`absolute ${
                          rowIdx % 2 === 0 ? "-left-10" : "-right-10"
                        } bottom-0`}
                        style={{
                          opacity: imgOpacity,
                          transition: "none",
                          height: "90%",
                          transform: `scale(${imgScale})`,
                          transformOrigin:
                            rowIdx % 2 === 0 ? "left bottom" : "right bottom",
                        }}
                      >
                        <img
                          loading="lazy"
                          src={fixedImages?.[rowIdx]?.img}
                          alt="Category"
                          className="object-contain h-full w-auto"
                        />
                      </div>
                    </div>

                    {/* CONTENT LAYER */}
                    <div
                      className={`relative ${
                        rowIdx % 2 === 0 ? "text-black" : "text-white"
                      } z-10 h-full p-2 flex flex-col top-[25%] ${
                        rowIdx % 2 === 0
                          ? "items-end text-right"
                          : "items-start text-left"
                      }`}
                      style={{
                        transform: `translate(${
                          rowIdx % 2 === 0 ? textOffsetX : -textOffsetX
                        }px, ${textOffsetY}px)`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* Title */}
                      <div
                        className="flex flex-col text-center tracking-normal uppercase mb-0 leading-tight"
                        style={{
                          fontFamily: "Readex Pro",
                          fontSize: `${15 * imgScale}px`,
                          transition: "none",
                        }}
                      >
                        <span className="whitespace-nowrap text-xs font-bold">
                          {fixedImages?.[rowIdx]?.title}
                        </span>
                        <span className="font-bold text-xl">
                          {fixedImages?.[rowIdx]?.Description}
                        </span>
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <RightArrow opacity={arrowOpacity} rowIdx={rowIdx} />
                  </div>

                  {/* Scroll row */}
                  <div className="overflow-hidden">
                    <div
                      ref={(el) => (scrollRefs.current[rowIdx] = el)}
                      onScroll={() => handleScroll(rowIdx)}
                      className="flex gap-2 overflow-x-auto scroll-smooth h-full hide-scrollbar"
                      style={{
                        marginLeft: `${currentWidth + GAP}px`,
                        alignItems: "stretch",
                      }}
                    >
                      {products?.map((item, idx) => {
                        const urlParts = item.url?.split("/") ?? [];
                        const link =
                          item.hasOwnProperty("sku") && urlParts.length < 2
                            ? `/details/${item.url}`
                            : `/details/${item.url}`;
                        const dataToSend = {
                          sectionName: "Beat The Heat",
                          name: item?.name,
                          price: item?.display_price,
                          pageName: window.location.pathname,
                        };
                        return (
                          <NavLink
                            key={idx}
                            to={link}
                            onClick={() =>
                              handleSummerCard(currentcountry.name, dataToSend)
                            }
                            className="no-underline block !w-[250px]"
                          >
                            <ProductCard product={item} />
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default ShopByPopularCategoryMobile;
