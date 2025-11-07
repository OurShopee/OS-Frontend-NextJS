"use client";
import { useState, useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getWishLists, postWishList } from "@/redux/cartslice";
import { MediaQueries } from "../utils";
import {
  setformmodal,
  setformstatus,
} from "@/redux/formslice";
import { pushToDataLayer } from "../utils/dataUserpush";
import VerticalTextCarousel from "../homepage/VerticalTextCarousel";
import { FaCartPlus } from "react-icons/fa6";
import Cookies from "js-cookie";
import useCart from "@/hooks/useCart";

const ProductCard = ({ item, type, type2, eid_sale, section_name = "" }) => {
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wishListData = useSelector((state) => state.cartslice.wishListData);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const currentcountry = useSelector((state) => state.globalslice.currentcountry);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);
  const { isMobile } = MediaQueries();
  const { add2cart } = useCart();

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
        product_name: item.name,
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
            item_name: item.name,
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
        

        {/* ---- MOBILE Add-to-Cart (inside image area, keeps gap to description) ---- */}
        {isMobile && (
          <button
            aria-label="Add to cart"
            onClick={handleAddToCart}
            className="absolute right-3 -bottom-[1rem] z-10 bg-white rounded-2xl p-3  border border-gray-100 active:scale-95 transition"
          >
            <FaCartPlus className="w-5 h-5" />
          </button>
        )}
        {/* ----------------------------------------------------------------------- */}
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

          {/* Add to Cart Button - Slides up from bottom on desktop hover */}
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
              className="w-full bg-[#FACC15] whitespace-nowrap text-black font-semibold py-[7px] px-4 rounded-lg flex items-center justify-center gap-[5px] transition-all duration-200"
              style={{
                boxShadow:
                  isHovered && !isMobile
                    ? "0 4px 12px rgba(255, 199, 39, 0.4)"
                    : "none",
              }}
            >
              {/* <FaCartPlus size={18} /> */}
              <img src={"/assets/vector_icons/cart.png"} alt={"cart"} className="w-4 h-4" />
              <span className="text-sm font-semibold">ADD TO CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
