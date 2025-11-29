"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Pagination,
  Thumbs,
  Autoplay,
  A11y,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { useDispatch, useSelector } from "react-redux";
import { getWishLists, postWishList } from "../../redux/cartslice";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const ImageCarouselMobile = ({ images, product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state?.cartslice?.wishListData);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const isWishlisted = wishlist?.some((item) => item?.sku === product?.sku);

  const handleWishList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const input_data = {
      product_id: product.id,
      sku: product.sku || product.url?.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        swiperRef.current?.slidePrev();
      } else if (e.key === "ArrowRight") {
        swiperRef.current?.slideNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="relative"
      role="region"
      aria-label={`${product?.name || "Product"} image gallery`}
    >
      {/* Wishlist Icon */}
      {authstatus && (
        <button
          onClick={handleWishList}
          style={{
            bottom: "30%",
            right: "2%",
            boxShadow: "0px 4px 12px 0px #0000000F",
          }}
          className="text-3xl absolute z-20 cursor-pointer p-1 rounded-lg bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          type="button"
        >
          {isWishlisted ? (
            <IoHeartSharp className="text-red-500" aria-hidden="true" />
          ) : (
            <IoHeartOutline className="text-[#43494B]" aria-hidden="true" />
          )}
        </button>
      )}

      {/* Main Swiper */}
      <div className="gap-4">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          spaceBetween={10}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            renderBullet: function (index, className) {
              return `<button type="button" class="${className}" aria-label="Go to slide ${
                index + 1
              }"></button>`;
            },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs, Autoplay, A11y, Keyboard]}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="rounded-xl custom-progress-swiper"
          a11y={{
            enabled: true,
            prevSlideMessage: "Previous image",
            nextSlideMessage: "Next image",
            firstSlideMessage: "This is the first image",
            lastSlideMessage: "This is the last image",
            containerMessage: "Product image gallery",
            itemRoleDescriptionMessage: "Image",
            slideLabelMessage: "{{index}} of {{slidesLength}}",
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              role="group"
              aria-label={`Image ${index + 1} of ${images.length}: ${
                product?.name || "Product image"
              }`}
            >
              <img src={img}
                alt={`${product?.name || "Product"} - Image ${index + 1}`}
                className="w-full object-contain max-h-[300px]"
              loading="lazy" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination Dots */}
        <div
          className="relative justify-center items-center flex gap-2 z-[2] my-4"
          role="tablist"
          aria-label="Image pagination"
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`rounded-full cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                activeIndex === index
                  ? "bg-[#43494B] w-16 h-2.5"
                  : "bg-[#D8D8D8] w-2.5 h-2.5"
              }`}
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`View image ${index + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Thumbnails Swiper */}
        <div role="tablist" aria-label="Image thumbnails">
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs, A11y]}
            className="mt-2"
            a11y={{
              enabled: true,
              containerMessage: "Thumbnail navigation",
              slideRole: "tab",
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide
                key={index}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Thumbnail ${index + 1}: ${
                  product?.name || "Product image"
                }`}
                tabIndex={index === activeIndex ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    swiperRef.current?.slideToLoop(index);
                  }
                }}
              >
                <img src={img}
                  alt=""
                  aria-hidden="true"
                  className="w-full p-3 h-[80px] object-contain rounded-lg"
                  style={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: index === activeIndex ? "#9EA5A8" : "#E7E8E9",
                  }}
                loading="lazy" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselMobile;
