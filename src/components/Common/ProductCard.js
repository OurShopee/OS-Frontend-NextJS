"use client";
import { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getWishLists, postWishList } from "../../redux/cartslice";
import { MediaQueries } from "../utils";
import { pushToDataLayer } from "../utils/dataUserpush";

const ProductCard = ({ item, type, type2, eid_sale, section_name = "" }) => {
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const wishListData = useSelector((state) => state.cartslice.wishListData);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const { isMobile } = MediaQueries();

  const handleWishList = async (e, item) => {
    e.preventDefault();
    var input_data = {
      product_id: item.id,
      sku: item.hasOwnProperty("sku") ? item.sku : item.url.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p className="mt-8 mb-5">{""}</p>;
    } else {
      // Render a countdown
      return (
        <>
          <p>
            <img
              className="timecount-image"
              src={"/assets/vector_icons/countdown.png"}
              alt="countdown"
            />{" "}
            {zeroPad(days) + " h"} : {zeroPad(minutes) + " m"} :{" "}
            {zeroPad(seconds) + " s"}
          </p>
        </>
      );
    }
  };

  const productcard = (cardname) => {
    if (section_name && section_name.trim() !== "") {
      // If section_name is present, run this logic
      pushToDataLayer("clicked_card_in_section", currentcountry.name, {
        card_name: cardname,
        section_name: section_name,
        page: window.location.pathname,
      });
    } else {
      // If section_name is absent or empty, run this logic
      pushToDataLayer("click_Product_card", currentcountry.name, {
        card_name: cardname,
        page: window.location.pathname,
      });
    }
  };

  return (
    <div
      className={`product_container ${eid_sale ? "eid_sale" : ""} ${
        !isMobile && "hover:scale-[96%]"
      } transition-transform duration-300 ease-in-out product-card`}
      onClick={() => productcard(item.name)}
    >
      {hasError ? (
        <div className="no_image_placeholder"></div>
      ) : eid_sale ? (
        <div
          style={{ borderRadius: "14px" }}
          className="bg-white overflow-hidden"
        >
          <img
            style={{ mixBlendMode: "darken" }}
            src={item.image}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover ease-in-out transition-transform duration-500 ${
              !isMobile && "product-image"
            }`}
            alt={item.name}
            width={300}
            height={300}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl">
          <img
            src={item.image}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover ease-in-out transition-transform duration-500 ${
              !isMobile && "product-image"
            }`}
            alt={item.name}
          />
        </div>
      )}

      {authstatus && (
        <div
          className="absolute custom_wish_heart"
          onClick={(e) => handleWishList(e, item)}
        >
          {wishListData &&
          wishListData.length > 0 &&
          wishListData
            .map(({ id }) => id)
            .flat()
            .includes(item.id) ? (
            <AiFillHeart color={"#ff4a4a"} size={20} />
          ) : (
            <AiOutlineHeart size={20} color={"#000"} />
          )}
        </div>
      )}

      <div className="product_content w-full">
        <h3>{item.name}</h3>

        <div className="product_price_container">
          <div className="price_block">
            <div className="display_price">
              <span>{currentcountry?.currency}</span>
              <h3>{item.display_price || item.special_price || item.price}</h3>
            </div>

            {item.old_price && item.percentage > 0 && (
              <div className="striked_price gap-1">
                <span>
                  {currentcountry?.currency} {item.old_price}
                </span>
                {item.old_price && item.percentage > 0 && (
                  <div className="discount_percent">{item.percentage}%OFF</div>
                )}
              </div>
            )}
          </div>
        </div>

        {type != 2 &&
          item.countdown != "Invalid date" &&
          new Date(item.countdown) > new Date() && (
            <div className="countdown">
              <Countdown date={item.countdown} renderer={renderer} />
            </div>
          )}

        {type == 2 && (
          <div className="grab_it_now">
            <img
              src={"/assets/vector_icons/grab_it_now_bg.png"}
              className="background-image"
              alt="grab it now background"
            />
            <div className="overlay-text">GRAB IT NOW!</div>
          </div>
        )}

        {type2 == 1 && (
          <div className="flex items-center mb-1">
            <img
              src={"/assets/vector_icons/flash.png"}
              className="selling_fast_img"
              alt="flash icon"
            />
            <div className="selling_fast_title">Selling out fast</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
