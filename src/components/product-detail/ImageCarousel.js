"use client";
import { useEffect, useRef, useState } from "react";
import {
  IoChevronBack,
  IoChevronForward,
  IoHeartOutline,
  IoHeartSharp,
} from "react-icons/io5";
import ReactImageMagnify from "react-image-magnify";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/grid";
import { Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getWishLists, postWishList } from "@/redux/cartslice";
import { MediaQueries } from "../utils";
import ImageCarouselMobile from "./ImageCarouselMobile";

const ImageCarousel = ({
  images,
  product,
  qty,
  setQty,
  handleClick,
  handleBuyNow,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const mainSwiperRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const { isMobile } = MediaQueries();
  const wishlist = useSelector((state) => state?.cartslice?.wishListData);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const isWishlisted = wishlist?.some((list) => list?.sku === product?.sku);

  const handleWishList = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const input_data = {
      product_id: item.id,
      sku: item.sku || item.url.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  const goToSlide = (index) => {
    setCurrentImage(index);
    mainSwiperRef.current?.slideToLoop(index);
  };

  const handleNext = () => {
    const nextIndex = (currentImage + 1) % images?.length;
    goToSlide(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentImage - 1 + images?.length) % images?.length;
    goToSlide(prevIndex);
  };

  // Custom Autoplay Logic
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImage, images?.length]);

  if (isMobile) {
    return <ImageCarouselMobile images={images} product={product} />;
  }

  return (
    <div className="flex flex-row gap-5 select-none">
      <div className="flex flex-col w-full flex-grow gap-10">
        {/* Main Image Magnifier */}
        <div
          className="relative rounded-xl overflow-hidden flex-grow"
          role="img"
          aria-label={`Product image ${currentImage + 1} of ${images?.length}`}
        >
          <div>
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: `${product?.name || "Product"} - Image ${
                    currentImage + 1
                  }`,
                  isFluidWidth: true,
                  src: images?.[currentImage],
                },
                largeImage: {
                  src: images?.[currentImage],
                  width: 1000,
                  height: 1000,
                  zIndex: 10,
                },
                enlargedImagePosition: "over",
                enlargedImageContainerDimensions: {
                  width: "100%",
                  height: "100%",
                },
                imageStyle: {
                  maxHeight: "450px",
                  width: "100%",
                  objectFit: "contain",
                  zIndex: 999,
                },
              }}
            />
          </div>

          {/* Wishlist */}
          {authstatus && (
            <button
              onClick={(e) => handleWishList(e, product)}
              className="text-3xl absolute top-2 right-4 z-10 cursor-pointer bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              type="button"
            >
              {isWishlisted ? (
                <IoHeartSharp className="text-red-500" aria-hidden="true" />
              ) : (
                <IoHeartOutline aria-hidden="true" />
              )}
            </button>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="flex items-center justify-center absolute top-1/2 border-none -translate-y-1/2 z-10 left-2 cursor-pointer bg-[#EFEFEF] rounded-full p-[12px] hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Previous image"
            type="button"
            disabled={images?.length <= 1}
          >
            <IoChevronBack size={22} aria-hidden="true" />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center absolute top-1/2 border-none -translate-y-1/2 z-10 right-2 cursor-pointer bg-[#EFEFEF] rounded-full p-[12px] hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Next image"
            type="button"
            disabled={images?.length <= 1}
          >
            <IoChevronForward size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div
          className="relative justify-center items-center flex gap-2 z-[2]"
          role="tablist"
          aria-label="Image pagination"
        >
          {images?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full cursor-pointer transition-all border-none duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                currentImage === index
                  ? "bg-[#43494B] w-16 h-2.5"
                  : "bg-[#D8D8D8] w-2.5 h-2.5"
              }`}
              role="tab"
              aria-selected={currentImage === index}
              aria-label={`View image ${index + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Thumbnail Swiper with manual autoplay */}
        <div
          className="h-[110px] w-[47vw] relative overflow-hidden max-w-[800px]"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          <Swiper
            direction="horizontal"
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            onSlideChange={(swiper) =>
              setCurrentImage(swiper.realIndex % images?.length)
            }
            modules={[Grid]}
            slidesPerView={5}
            spaceBetween={10}
            style={{ height: "100%" }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Previous slide",
              nextSlideMessage: "Next slide",
              firstSlideMessage: "This is the first slide",
              lastSlideMessage: "This is the last slide",
            }}
          >
            {images?.map((img, index) => (
              <SwiperSlide
                key={index}
                onClick={() => goToSlide(index % images?.length)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToSlide(index % images?.length);
                  }
                }}
                style={{
                  border:
                    currentImage === index % images?.length
                      ? "1px solid #9EA5A8"
                      : "",
                  borderRadius:
                    currentImage === index % images?.length ? 12 : "",
                  padding: 6,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                tabIndex={0}
                role="tab"
                aria-selected={currentImage === index % images?.length}
                aria-label={`Thumbnail ${index + 1}: ${
                  product?.name || "Product image"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  style={{
                    height: 80,
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
