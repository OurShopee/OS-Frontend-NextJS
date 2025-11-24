"use client"
import { useEffect, useRef, useState } from "react";
import {
  IoHeartOutline,
  IoHeartSharp
} from "react-icons/io5";
import ReactImageMagnify from "react-image-magnify";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/grid";
import { Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getWishLists, postWishList } from "@/redux/cartslice";
import { MediaQueries } from "../../utils";
import { getAssetsUrl } from "../../utils/helpers";
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
    const nextIndex = (currentImage + 1) % images.length;
    goToSlide(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentImage - 1 + images.length) % images.length;
    goToSlide(prevIndex);
  };

  // Custom Autoplay Logic
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImage]);

  // if (isMobile) {
  //   return <ImageCarouselMobile images={images} product={product} />;
  // }

  return (
    <div className="flex flex-row gap-5 select-none">
      <div className="flex flex-col w-full flex-grow gap-3 sm:gap-10">
        {/* Main Image Magnifier */}
        <div className="relative rounded-xl overflow-hidden flex-grow">
          <div>
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product Image",
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
                  maxHeight: isMobile ? "170px" : "240px",
                  width: "100%",
                  objectFit: "contain",
                  zIndex: 999,
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
          {images?.length > 1 &&<div>
            <div
              onClick={handlePrev}
              className={`flex items-center justify-center absolute top-1/2 rounded-full -translate-y-1/2 z-10 left-4 cursor-pointer ${
                webfeed ? "bg-[#ffff]" : "bg-[#EFEFEF]"
              } rounded-full p-3 w-10 h-10`} // fixed width and height e.g. 2.5rem (40px)
            >
              {/* <IoChevronBack size={22} /> */}
              <img src={getAssetsUrl("feed/left.png")}
                alt="left"
                className="max-w-full max-h-full object-contain" // fit inside container
              loading="lazy" />
            </div>

            <div
              onClick={handleNext}
              className={`flex items-center justify-center absolute rounded-full top-1/2 -translate-y-1/2 z-10 right-4 cursor-pointer ${
                webfeed ? "bg-[#ffff]" : "bg-[#EFEFEF]"
              } rounded-full p-3 w-10 h-10`} // fixed width and height
            >
              {/* <IoChevronForward size={22} /> */}
              <img src={getAssetsUrl("feed/right.png")}
                alt="right"
                className="max-w-full max-h-full object-contain"
              loading="lazy" />
            </div>
          </div>}
        </div>

        {/* Pagination Dots */}
        <div className="relative justify-center items-center flex gap-0.5 sm:gap-2 z-[2]">
          {images?.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full cursor-pointer transition-all duration-300 ease-in-out
              ${
                currentImage === index
                  ? "bg-[#43494B] w-16 h-1"
                  : "bg-[#D8D8D8] w-1 h-1"
              }`}
            ></div>
          ))}
        </div>

        {/* Thumbnail Swiper with manual autoplay */}
        <div className="px-2 sm:px-8 py-1 sm:py-8 overflow-hidden ml-4">
          <div
            className={`${
              webfeed
                ? "h-[60px] w-full sm:w-[25vw]"
                : "h-[110px] w-[47vw]"
            } relative overflow-visible max-w-[800px]`}
          >
            <Swiper
              direction="horizontal"
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
              onSlideChange={(swiper) =>
                setCurrentImage(swiper.realIndex % images.length)
              }
              modules={[Grid]}
              slidesPerView={5}
              spaceBetween={isMobile ? 4 : 22 }
              style={{ height: "100%", overflow: "visible" }}
            >
              {images?.map((img, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => goToSlide(index % images.length)}
                  style={{
                    boxShadow:
                      currentImage === index % images.length
                        ? "0px 4px 4px 0px #E0E0E040"
                        : "",

                    scale: currentImage === index % images.length ? 1.3 : "",
                    overflow: "visible",
                    borderRadius: 12,
                    background:
                      currentImage === index % images.length ? "#fff" : "",
                    padding: currentImage === index % images.length ? 1 : 6,
                    zIndex: currentImage === index % images.length ? 111 : "",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  // className={webfeed && "shadow-sm"}
                >
                  <img src={img}
                    alt=""
                    style={{
                      objectFit: "contain",
                      width: "100%",
                    }}
                    className={`${webfeed ? isMobile ? "!h-20" : "!h-10" : "!h-20"} ${
                      currentImage === index % images.length
                        ? "scale-120"
                        : ""
                    }`}
                  loading="lazy" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
