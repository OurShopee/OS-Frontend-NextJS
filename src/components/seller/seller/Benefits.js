import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import MediaQueries from "../../utils/MediaQueries.js";
import { getAssetsUrl } from "../../utils/helpers";
import "swiper/css";
import "swiper/css/pagination";

export default function Benefits({ benefits }) {
  const { isMobile } = MediaQueries();
  return (
    <div
      className="bg-[#F9F9FF] xl:mx-10 py-5 xl:py-0 max-w-full overflow-hidden"
      id="benefits"
    >
      {/* Title */}
      <div className="hidden xl:flex flex-col justify-center items-center py-3 mb-10">
        <div className="flex">
          <span className="text-[36px] font-semibold font-[Outfit] text-black">
            Boost Your Business with{" "}
            <span className="text-primary">OurShopee</span> Benefits
          </span>
        </div>
        <div>
          <img src={getAssetsUrl("border.png")}
            alt="Hero"
            className="w-full object-cover z-1"
          loading="lazy" />
        </div>
      </div>

      <div className="xl:hidden text-center w-max m-auto">
        <span className="font-[Outfit] text-black">
          Boost Your Business with{" "}
          <span className="text-primary">OurShopee</span> Benefits
        </span>
        <div className="w-[85%] m-auto flex gap-1 xl:hidden mt-1">
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="flex-grow h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
          <span className="w-1.5 h-[.15rem] rounded-full bg-primary"></span>
        </div>
      </div>

      <div className="block py-4 xl:py-10 px-4 xl:px-0 swiper-seller">
        <Swiper
          slidesPerView={isMobile ? 1 : 4}
          centeredSlides={true}
          spaceBetween={30}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          speed={1200}
          pagination={{
            el: ".my-custom-pagination",
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="custom-dot ${className}"></span>`;
            },
          }}
          className={`${isMobile ? "" : "custom-swiper"} `}
        >
          {benefits.map((card, idx) => (
            <SwiperSlide key={idx}>
              <div className="carousel-card xl:h-[287px] xl:w-[333px]">
                <img src={card.icon} alt="icon" loading="lazy" />
                <h2 className="text-xl gradient-text">{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* This will hold the dots outside the Swiper */}
        <div className="my-custom-pagination flex justify-center items-center mt-4 h-1"></div>
      </div>
      {/* <div className="flex overflow-x-scroll max-w-full mt-5">
                {benefits.slice(0, 4).map((card, idx) => (
                    <div className="h-[287px] w-[333px] flex-shrink-0">
                        <img src={card.icon} alt="icon" loading="lazy" />
                        <h2 className="text-xl gradient-text">{card.title}</h2>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div> */}
    </div>
  );
}
