"use client";
import { useState, useMemo, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getWishLists, postWishList } from "@/redux/cartslice";
import { MediaQueries } from "../utils";
import {
  setformmodal,
  setformstatus,
} from "@/redux/formslice";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useContent, useDynamicContent, useCurrentLanguage } from "@/hooks";
import VerticalTextCarousel from "../homepage/VerticalTextCarousel";
import Cookies from "js-cookie";
import useCart from "@/hooks/useCart";

const ProductCard = ({ item, type, type2, eid_sale, section_name = "" }) => {
  const youSaved = useContent("product.youSaved");
  const addToCartText = useContent("product.addToCart");
  const grabItNow = useContent("product.grabItNow");
  const sellingOutFastText = useContent("product.sellingOutFast");
  const expressDeliveryText = useContent("product.expressDelivery");
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [item?.image]);
  const [isHovered, setIsHovered] = useState(false);
  const wishListData = useSelector((state) => state.cartslice.wishListData);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const currentcountry = useSelector((state) => state.globalslice.currentcountry);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);
  const { isMobile } = MediaQueries();
  const { add2cart, isLoading } = useCart();
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  // Calculate saved price similar to product details page
  const savedPrice = useMemo(() => {
    if (item?.old_price && item?.percentage > 0) {
      const offData = item.old_price * (item.percentage / 100);
      return offData ? parseFloat(offData.toFixed(2)) : 0;
    }
    return 0;
  }, [item?.old_price, item?.percentage]);

  // Get dynamic content based on current language
  const itemName = useDynamicContent(item, "name");
  const off = useContent("product.off");

  const handleWishList = async (e, item) => {
    e.preventDefault();
    if(!authstatus){
      dispatch(setformmodal(!formmodal));
      dispatch(setformstatus(1));
      return;
    }
    var input_data = {
      product_id: item?.id,
      sku: item?.hasOwnProperty("sku") ? item?.sku : item?.url.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  const handleAddToCart =async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your add to cart logic here
    var input_data = {
      product_id: item.id,
      user_id: authstatus ? logindata.user_id : 0,
      quantity: 1,
      country_id: currentcountry.id,
    };
    if (Cookies.get("cart_ip_address") == undefined) {
      input_data.ip_address = 0;
    } else {
      input_data.ip_address = Cookies.get("cart_ip_address");
    }
    await add2cart(input_data);
    pushToDataLayer(
      "clicked_add_to_cart",
      currentcountry.name,
      {
        product_name: itemName,
      },
      true
    );
    pushToDataLayer(
      "add_to_cart",
      {
        currency: currentcountry.currency,
        value: item.display_price,
        items: [
          {
            item_id: item.sku,
            item_name: itemName,
            item_category: item.subcategory_name,
            price: item.display_price,
            quantity: 1,
          },
        ],
      },
      false
    );
  };

  // Build carousel items
  const carouselItems = useMemo(() => {
    const items = [];

    // Add discount badge if savedPrice > 0
    if (savedPrice > 0) {
      items.push({
        type: "discount",
        render: () => (
          <div
            className={`save-banner px-3 py-2 flex items-center !font-medium`}
          >
            <span
              className={`text-[12px] text-nowrap flex items-center gap-0.5 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {youSaved}{" "}
              {currentcountry?.currency == "AED" ? (
                <img
                  src="/assets/feed/aed-icon.svg"
                  alt="AED"
                  className={`w-2.5 h-2.5 inline-block mix-blend-multiply ${isRTL ? "ml-0.5" : "mr-0.5"}`}
                  style={{ color: "black" }}
                />
              ) : (
                <span className={`currency-symbol text-[12px] ${isRTL ? "ml-0.5" : "mr-0.5"}`}>
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
            <div
              className={`text-white font-bold text-sm uppercase ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {(grabItNow || "").toUpperCase()}
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
          <div
            className={`flex items-center gap-1.5 ${
              isRTL ? "flex-row-reverse text-right" : ""
            }`}
          >
            <svg
              className={`w-4 h-4 text-orange-500 ${
                isRTL ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
            <span className="text-orange-500 text-xs font-semibold">
              {sellingOutFastText}
            </span>
          </div>
        ),
      });
    }
    if (item?.avg_rating > 0) {
      items.push({
        type: "review",
        render: () => (
          <div
            className={`flex items-center gap-1.5 ${
              isRTL ? "mr-1 flex-row-reverse text-right" : "ml-1"
            }`}
          >
            <span className="font-semibold text-[#43494B]">
              {item?.avg_rating}
            </span>
            {/* Star Icon */}
            <svg
              className="w-5 h-5 text-[#FFB525]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.956c.3.92-.755 1.688-1.54 1.118l-3.371-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.785.57-1.841-.198-1.541-1.118l1.285-3.956a1 1 0 00-.364-1.118L2.227 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.285-3.956z" />
            </svg>
            {/* Vertical divider */}
            <span className="text-[#9EA5A8]">|</span>
            <span className="text-[#9EA5A8] font-medium">
              ({item?.total_ratings})
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
          <div
            className={`flex items-center ${
              isRTL ? "justify-end" : "justify-start"
            }`}
          >
            <img
              src="/assets/vector_icons/Express_delivery.gif"
              alt={expressDeliveryText || "Express Delivery"}
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
    youSaved,
    grabItNow,
    sellingOutFastText,
    expressDeliveryText,
    isRTL,
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
      className={`relative overflow-hidden product-card min-h-[267px] flex flex-col justify-between ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={() => productcard(itemName)}
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
              alt={itemName}
            />
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} bg-white rounded-full p-1 transition-shadow z-10`}
          onClick={(e) => handleWishList(e, item)}
        >
          {wishListData &&
          wishListData.length > 0 &&
          wishListData
            .map(({ id }) => id)
            .flat()
            .includes(item?.id) ? (
            <AiFillHeart color="#ff4a4a" size={18} />
          ) : (
            <AiOutlineHeart size={18} color="#9c9c9c" />
          )}
        </button>

        {/* ---- MOBILE Add-to-Cart (inside image area, keeps gap to description) ---- */}
        {isMobile && (
          <button
            aria-label={addToCartText}
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`absolute ${
              isRTL ? "left-3" : "right-3"
            } -bottom-[1rem] z-10 bg-white rounded-2xl p-3 border border-gray-100 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
          >
            {isLoading ? (
              <svg
                className="animate-spin w-5 h-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <img src={"/assets/vector_icons/shopping_cart.svg"} alt={"cart"} className="w-5 h-5" />
            )}
          </button>
        )}
        {/* ----------------------------------------------------------------------- */}
      </div>

      {/* Content Container */}
      <div className="px-2 py-3 flex flex-col gap-1.5 mt-auto">
        {/* Product Title */}
        <h3
          className={`text-[#525252] font-semibold text-sm line-clamp-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {itemName}
        </h3>

        {/* Price Container */}
        <div
          className={`flex gap-1.5 ${
            isRTL ? "flex-row-reverse justify-end text-right" : ""
          }`}
        >
          {/* Current Price - Currency always comes first */}
          <div className={`flex items-center gap-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
            {currentcountry?.currency == "AED" ? (
              <img
                src="/assets/feed/aed-icon.svg"
                alt="AED"
                className={`w-[18px] h-[18px] inline-block mix-blend-multiply ${isRTL ? "ml-0.5" : "mr-0.5"}`}
                style={{ color: "black" }}
              />
            ) : (
              <span className={`text-[#191B1C] text-xl font-semibold ${isRTL ? "ml-0.5" : "mr-0.5"}`}>
                {currentcountry?.currency}
              </span>
            )}
            <span className="text-[#191B1C] lg:text-lg text-md font-semibold">
              {(() => {
                const price = parseFloat(item?.display_price || item?.special_price || item?.price);
                return Number.isInteger(price) ? price : price.toFixed(1);
              })()}
            </span>
          </div>
          {/* Old Price and Discount Percentage */}
          {item?.old_price && item?.percentage > 0 && (
            <div
              className={`flex items-center gap-1.5 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-[#9EA5A8] font-medium line-through text-sm">
                {Math.floor(item?.old_price)}
              </span>
              <span className="bg-[#ECF8E2] text-green-600 whitespace-nowrap text-[12px] font-semibold px-1 py-0.5 rounded">
                {Math.floor(item?.percentage || 0)}% {off}
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

          {/* Add to Cart Button - Slides up from bottom on desktop hover */}
          <div
            className="transition-all duration-500 ease-in-out absolute w-full bottom-0 left-0 right-0"
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
              aria-label={addToCartText}
              disabled={isLoading}
              className="w-full bg-[#FACC15] whitespace-nowrap text-black font-semibold py-[7px] px-4 rounded-lg flex items-center justify-center gap-[5px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow:
                  isHovered && !isMobile
                    ? "0 4px 12px rgba(255, 199, 39, 0.4)"
                    : "none",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm font-semibold">{addToCartText}</span>
                </>
              ) : (
                <>
                  <img src={"/assets/vector_icons/cart.png"} alt={"cart"} className="w-4 h-4" />
                  <span className="text-sm font-semibold">{addToCartText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
