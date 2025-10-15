"use client";
import { getWishLists, postWishList } from "@/redux/cartslice";
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
  webfeed = false,
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
  }, [currentImage]);

  if (isMobile) {
    return <ImageCarouselMobile images={images} product={product} />;
  }

  return (
    <div className="flex flex-row gap-5 select-none">
      <div className="flex flex-col w-full flex-grow gap-10">
        {/* Main Image Magnifier */}
        <div className="relative rounded-xl overflow-hidden flex-grow">
          <div className="w-full h-full">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product Image",
                  isFluidWidth: true,
                  src: images?.[currentImage],
                },
                largeImage: {
                  src: images?.[currentImage],
                  width: 600,
                  height: 600,
                },
                enlargedImagePosition: "over",
                enlargedImageContainerDimensions: {
                  width: "100%",
                  height: "100%",
                },
                enlargedImageContainerStyle: {
                  zIndex: 9,
                },
                imageStyle: {
                  maxHeight: webfeed ? "240px" : "450px",
                  width: "100%",
                  objectFit: "contain",
                },
                shouldUsePositiveSpaceLens: true,
                lensStyle: {
                  backgroundColor: "rgba(0,0,0,.2)",
                },
              }}
            />
          </div>

          {/* Wishlist */}
          {authstatus && (
            <div
              onClick={(e) => handleWishList(e, product)}
              className="text-3xl absolute top-2 right-4 z-10 cursor-pointer"
            >
              {isWishlisted ? (
                <IoHeartSharp className="text-red-500" />
              ) : (
                <IoHeartOutline />
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          <div
            onClick={handlePrev}
            className={`flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10 left-2 cursor-pointer ${
              webfeed ? "bg-[#ffff]" : "bg-[#EFEFEF]"
            }  rounded-full p-[12px]`}
          >
            <IoChevronBack size={22} />
          </div>
          <div
            onClick={handleNext}
            className={`flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10 right-2 cursor-pointer ${
              webfeed ? "bg-[#ffff]" : "bg-[#EFEFEF]"
            } rounded-full p-[12px]`}
          >
            <IoChevronForward size={22} />
          </div>
        </div>

        {/* Pagination Dots */}
        {images?.length > 0 && (
          <div className="relative justify-center items-center flex gap-2 z-[2]">
            {images?.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full cursor-pointer transition-all duration-300 ease-in-out
              ${
                currentImage === index
                  ? "bg-[#43494B] w-16 h-2.5"
                  : "bg-[#D8D8D8] w-2.5 h-2.5"
              }`}
              ></div>
            ))}
          </div>
        )}

        {/* Thumbnail Swiper with manual autoplay */}
        <div
          className={`${
            webfeed ? "h-[60px] w-[28vw]" : "h-[110px]  w-[47vw] 2xl:w-[680px]"
          } relative overflow-hidden max-w-[800px]`}
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
          >
            {images?.map((img, index) => (
              <SwiperSlide
                key={index}
                onClick={() => goToSlide(index % images?.length)}
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
                className={webfeed && "shadow-sm"}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    objectFit: "contain",
                    width: "100%",
                  }}
                  className={`${webfeed ? "!h-8" : "!h-20"}`}
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
