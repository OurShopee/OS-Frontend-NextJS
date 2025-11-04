// "use client";
// import { useState } from "react";
// import Countdown, { zeroPad } from "react-countdown";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { getWishLists, postWishList } from "@/redux/cartslice";
// import { MediaQueries } from "../utils";
// import { pushToDataLayer } from "../utils/dataUserpush";

// const ProductCard = ({ item, type, type2, eid_sale, section_name = "" }) => {
//   const dispatch = useDispatch();
//   const [hasError, setHasError] = useState(false);
//   const wishListData = useSelector((state) => state.cartslice.wishListData);
//   const currentcountry = useSelector(
//     (state) => state.globalslice.currentcountry
//   );
//   const authstatus = useSelector((state) => state.formslice.authstatus);
//   const { isMobile } = MediaQueries();

//   const handleWishList = async (e, item) => {
//     e.preventDefault();
//     var input_data = {
//       product_id: item?.id,
//       sku: item?.hasOwnProperty("sku") ? item?.sku : item?.url.split("/")[1],
//     };
//     await dispatch(postWishList(input_data));
//     dispatch(getWishLists());
//   };

//   const renderer = ({ days, hours, minutes, seconds, completed }) => {
//     if (completed) {
//       return <p className="mt-8 mb-5">{""}</p>;
//     } else {
//       // Render a countdown
//       return (
//         <>
//           <p>
//             <img
//               className="timecount-image"
//               src={"/assets/vector_icons/countdown.png"}
//               alt="countdown"
//             />{" "}
//             {zeroPad(days) + " h"} : {zeroPad(minutes) + " m"} :{" "}
//             {zeroPad(seconds) + " s"}
//           </p>
//         </>
//       );
//     }
//   };

//   const productcard = (cardname) => {
//     if (section_name && section_name.trim() !== "") {
//       // If section_name is present, run this logic
//       pushToDataLayer("clicked_card_in_section", currentcountry.name, {
//         card_name: cardname,
//         section_name: section_name,
//         page: window.location.pathname,
//       });
//     } else {
//       // If section_name is absent or empty, run this logic
//       pushToDataLayer("click_Product_card", currentcountry.name, {
//         card_name: cardname,
//         page: window.location.pathname,
//       });
//     }
//   };

//   return (
//     <div
//       className={`product_container ${eid_sale ? "eid_sale" : ""} ${
//         !isMobile && "hover:scale-[96%]"
//       } transition-transform duration-300 ease-in-out product-card`}
//       onClick={() => productcard(item?.name)}
//     >
//       {hasError ? (
//         <div className="no_image_placeholder"></div>
//       ) : eid_sale ? (
//         <div
//           style={{ borderRadius: "14px" }}
//           className="bg-white overflow-hidden"
//         >
//           <img
//             style={{ mixBlendMode: "darken" }}
//             src={item?.image}
//             onError={() => setHasError(true)}
//             className={`w-full object-cover ease-in-out transition-transform duration-500 ${
//               !isMobile && "product-image"
//             }`}
//             alt={item?.name}
//             width={300}
//             height={300}
//           />
//         </div>
//       ) : (
//         <div className="overflow-hidden rounded-xl">
//           <img
//             src={item?.image}
//             onError={() => setHasError(true)}
//             className={`w-full object-cover ease-in-out transition-transform duration-500 ${
//               !isMobile && "product-image"
//             }`}
//             alt={item?.name}
//           />
//         </div>
//       )}

//       {authstatus && (
//         <div
//           className="absolute custom_wish_heart"
//           onClick={(e) => handleWishList(e, item)}
//         >
//           {wishListData &&
//           wishListData.length > 0 &&
//           wishListData
//             .map(({ id }) => id)
//             .flat()
//             .includes(item?.id) ? (
//             <AiFillHeart color={"#ff4a4a"} size={20} />
//           ) : (
//             <AiOutlineHeart size={20} color={"#000"} />
//           )}
//         </div>
//       )}

//       <div className="product_content w-full">
//         <h3>{item?.name}</h3>

//         <div className="product_price_container">
//           <div className="price_block">
//             <div className="display_price">
//               {/* {currentcountry?.currency == "AED" ? (
//                 <div>
//                   <img src="assets/feed/aed-icon.png" className="w-4 h-auto p-0" />
//                 </div>
//               ) : (
//                 <span>{currentcountry?.currency}</span>
//               )} */}
//               <span>{currentcountry?.currency}</span>
//               <h3>{item?.display_price || item?.special_price || item?.price}</h3>
//             </div>

//             {item?.old_price && item?.percentage > 0 && (
//               <div className="striked_price gap-1">
//                 <span>
//                   {currentcountry?.currency} {item?.old_price}
//                 </span>
//                 {item?.old_price && item?.percentage > 0 && (
//                   <div className="discount_percent">{item?.percentage}%OFF</div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {type != 2 &&
//           item?.countdown != "Invalid date" &&
//           new Date(item?.countdown) > new Date() && (
//             <div className="countdown">
//               <Countdown date={item?.countdown} renderer={renderer} />
//             </div>
//           )}

//         {type == 2 && (
//           <div className="grab_it_now">
//             <img
//               src={"/assets/vector_icons/grab_it_now_bg.png"}
//               className="background-image"
//               alt="grab it now background"
//             />
//             <div className="overlay-text">GRAB IT NOW!</div>
//           </div>
//         )}

//         {type2 == 1 && (
//           <div className="flex items-center mb-1">
//             <img
//               src={"/assets/vector_icons/flash.png"}
//               className="selling_fast_img"
//               alt="flash icon"
//             />
//             <div className="selling_fast_title">Selling out fast</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

"use client";
import { useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getWishLists, postWishList } from "@/redux/cartslice";
import { MediaQueries } from "../utils";
import { pushToDataLayer } from "../utils/dataUserpush";
import VerticalTextCarousel from "../homepage/VerticalTextCarousel";
import { FaCartPlus } from "react-icons/fa6";

const ProductCard = ({ item, type, type2, eid_sale, section_name = "" }) => {
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wishListData = useSelector((state) => state.cartslice.wishListData);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const { isMobile } = MediaQueries();

  // Calculate saved price similar to product details page
  const savedPrice = useMemo(() => {
    if (item?.old_price && item?.percentage > 0) {
      const offData = item.old_price * (item.percentage / 100);
      return offData ? parseFloat(offData.toFixed(2)) : 0;
    }
    return 0;
  }, [item?.old_price, item?.percentage]);

  const handleWishList = async (e, item) => {
    e.preventDefault();
    var input_data = {
      product_id: item?.id,
      sku: item?.hasOwnProperty("sku") ? item?.sku : item?.url.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your add to cart logic here
    console.log("Adding to cart:", item);
  };

  // Build carousel items
  const carouselItems = useMemo(() => {
    const items = [];

    // Add discount badge if savedPrice > 0
    if (savedPrice > 0) {
      items.push({
        type: "discount",
        render: () => (
          <div className="save-banner px-3 py-2 flex items-center !font-medium">
            <span className="badge-icon mr-1 inline-flex items-center justify-center">
              <img
                src="/assets/vector_icons/Vector.png"
                alt="%"
                className="discount-icon"
              />
            </span>
            <span className="text-[12px] text-nowrap flex items-center gap-0.5">
              You saved{" "}
              {currentcountry?.currency == "AED" ? (
                <img
                  src="/assets/feed/aed-icon.png"
                  alt="AED"
                  className="w-2.5 h-2.5 inline-block mix-blend-multiply"
                  style={{ color: "black" }}
                />
              ) : (
                <span className="currency-symbol text-[12px]">
                  {currentcountry?.currency}
                </span>
              )}{" "}
              <span className="font-bold">{Math.ceil(savedPrice)}</span>
            </span>
          </div>
        ),
      });
    }

    // Add countdown timer if valid
    if (
      type != 2 &&
      item?.countdown != "Invalid date" &&
      new Date(item?.countdown) > new Date()
    ) {
      items.push({
        type: "countdown",
        countdownDate: item.countdown,
      });
    }

    // Add "Grab it now" if type == 2
    if (type == 2) {
      items.push({
        type: "grabIt",
        render: () => (
          <div className="relative bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg py-2 px-4">
            <div className="text-white text-left font-bold text-sm uppercase">
              GRAB IT NOW!
            </div>
          </div>
        ),
      });
    }

    // Add "Selling out fast" if type2 == 1
    if (type2 == 1) {
      items.push({
        type: "sellingOut",
        render: () => (
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
            <span className="text-orange-500 text-xs font-semibold">
              Selling out fast
            </span>
          </div>
        ),
      });
    }

    // Add Express Delivery if fastTrack === 1
    if (item?.fastTrack === 1) {
      items.push({
        type: "expressDelivery",
        render: () => (
          <div className="flex items-center justify-start">
            <img
              src="/assets/vector_icons/Express_delivery.gif"
              alt="Express Delivery"
              width={isMobile ? 150 : 180}
              height={25}
              className="object-contain"
            />
          </div>
        ),
      });
    }

    return items;
  }, [
    type,
    type2,
    item?.countdown,
    item?.fastTrack,
    savedPrice,
    currentcountry?.currency,
    isMobile,
  ]);

  const productcard = (cardname) => {
    if (section_name && section_name.trim() !== "") {
      pushToDataLayer("clicked_card_in_section", currentcountry.name, {
        card_name: cardname,
        section_name: section_name,
        page: window.location.pathname,
      });
    } else {
      pushToDataLayer("click_Product_card", currentcountry.name, {
        card_name: cardname,
        page: window.location.pathname,
      });
    }
  };

  const hasCarousel = carouselItems.length > 0;

  return (
    <div
      className={`relative overflow-hidden product-card min-h-[267px] flex flex-col justify-between`}
      onClick={() => productcard(item?.name)}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{ perspective: "1000px" }}
    >
      {/* Image Container */}
      <div className="relative p-4 pb-0 flex items-center justify-center">
        {hasError ? (
          <div className="w-full rounded-2xl flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        ) : (
          <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={item?.image}
              onError={() => setHasError(true)}
              className={`w-full h-full max-w-[100px] max-h-[100px] object-contain`}
              alt={item?.name}
            />
          </div>
        )}

        {/* Wishlist Heart Icon */}
        {authstatus && (
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
            onClick={(e) => handleWishList(e, item)}
          >
            {wishListData &&
            wishListData.length > 0 &&
            wishListData
              .map(({ id }) => id)
              .flat()
              .includes(item?.id) ? (
              <AiFillHeart color="#ff4a4a" size={16} />
            ) : (
              <AiOutlineHeart size={16} color="#000" />
            )}
          </button>
        )}
      </div>

      {/* Content Container */}
      <div className="px-2 py-3 flex flex-col gap-1.5 mt-auto">
        {/* Product Title */}
        <h3 className="text-[#525252] font-semibold text-sm line-clamp-2">
          {item?.name}
        </h3>

        {/* Price Container */}
        <div className="flex gap-1.5">
          {/* Current Price */}
          <div className="flex items-center gap-0.5">
            {currentcountry?.currency == "AED" ? (
              <img
                src="/assets/feed/aed-icon.png"
                alt="AED"
                className="w-[18px] h-[18px] inline-block mix-blend-multiply"
                style={{ color: "black" }}
              />
            ) : (
              <span className="text-[#191B1C] text-xl font-semibold">
                {currentcountry?.currency}
              </span>
            )}
            <span className="text-[#191B1C] text-xl font-semibold">
              {item?.display_price || item?.special_price || item?.price}
            </span>
          </div>
          {/* Old Price and Discount Percentage */}
          {item?.old_price && item?.percentage > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#9EA5A8] font-medium line-through text-sm">
                {Math.floor(item?.old_price)}
              </span>
              <span className="bg-[#ECF8E2] text-green-600 whitespace-nowrap text-[12px] font-semibold px-1 py-0.5 rounded">
                {Math.floor(item?.percentage || 0)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Container for Carousel/Button with 3D Animation */}
        <div className="relative min-h-[40px]">
          {/* VerticalTextCarousel - Slides up in place with 3D effect */}
          {hasCarousel && (
            <div
              className="transition-all duration-500 ease-in-out"
              style={{
                transform:
                  isHovered && !isMobile
                    ? "translateY(-30px) translateZ(20px)"
                    : "translateY(0) translateZ(0)",
                transformStyle: "preserve-3d",
                opacity: isHovered && !isMobile ? 0 : 1,
              }}
            >
              <VerticalTextCarousel
                items={carouselItems}
                height="auto"
                delay={2000}
                speed={1000}
                className="min-h-[32px] w-auto"
              />
            </div>
          )}

          {/* Add to Cart Button - Slides up from bottom with 3D effect */}
          <div
            className="transition-all duration-500 ease-in-out absolute bottom-0 left-0 right-0"
            style={{
              transform:
                isHovered && !isMobile
                  ? "translateY(0) translateZ(20px)"
                  : "translateY(100%) translateZ(0)",
              transformStyle: "preserve-3d",
              opacity: isHovered && !isMobile ? 1 : 0,
              pointerEvents: isHovered && !isMobile ? "auto" : "none",
            }}
          >
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FFC727] whitespace-nowrap hover:bg-[#FFD84D] text-black font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                boxShadow:
                  isHovered && !isMobile
                    ? "0 4px 12px rgba(255, 199, 39, 0.4)"
                    : "none",
              }}
            >
              <FaCartPlus size={18} />
              <span className="text-sm font-bold">ADD TO CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
