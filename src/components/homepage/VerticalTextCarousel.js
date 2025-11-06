"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Countdown, { zeroPad } from "react-countdown";

const VerticalTextCarousel = ({
  items = [],
  height = "24px",
  delay = 2000,
  speed = 1000,
  className = "",
}) => {
  const displayItems = items.filter(
    (item) =>
      item &&
      (item.text ||
        item.render ||
        (item.type === "countdown" && item.countdownDate))
  );

  // Countdown renderer for timer items
  const countdownRenderer = ({ hours, minutes, seconds, completed, item }) => {
    if (completed) {
      return null;
    }
    return (
      <div className="flex items-center justify-start gap-1 text-orange-500 font-semibold text-sm bg-yellow-50 rounded-lg px-3 py-2">
        <img
          className="w-4 h-4"
          src="/assets/vector_icons/countdown.png"
          alt="countdown"
        />
        <span>{zeroPad(hours)} h</span>
        <span>:</span>
        <span>{zeroPad(minutes)} m</span>
        <span>:</span>
        <span>{zeroPad(seconds)} s</span>
      </div>
    );
  };

  if (displayItems?.length === 0) {
    return null;
  }

  // If only one item, don't use carousel
  if (displayItems?.length === 1) {
    const item = displayItems[0];
    if (item.type === "countdown" && item.countdownDate) {
      return (
        <div
          className={`tw-overflow-hidden tw-rounded tw-relative ${className}`}
        >
          <Countdown
            date={item.countdownDate}
            renderer={(props) => countdownRenderer({ ...props, item })}
          />
        </div>
      );
    }
    if (item.render) {
      return (
        <div
          className={`tw-overflow-hidden tw-rounded tw-relative ${className}`}
        >
          {item.render()}
        </div>
      );
    }
    return (
      <div
        className={`tw-overflow-hidden tw-rounded tw-relative ${className}`}
        style={{ height }}
      >
        <div
          className={`tw-flex tw-items-center tw-gap-1 tw-text-xs tw-font-semibold tw-w-full ${
            item.textColor || "tw-text-gray-700"
          }`}
          style={{ height }}
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{item.text}</span>
        </div>
      </div>
    );
  }

  // For auto height, we need to calculate a fixed height based on content
  // Otherwise Swiper won't loop properly
  const containerStyle =
    height === "auto" ? { height: "40px", minHeight: "40px" } : { height };

  return (
    <div
      className={`tw-overflow-hidden tw-rounded tw-relative inline-block ${className}`}
      style={containerStyle}
    >
      <Swiper
        direction="vertical"
        loop={displayItems.length > 1}
        autoplay={{
          delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={speed}
        allowTouchMove={false}
        modules={[Autoplay]}
        style={containerStyle}
        slidesPerView={1}
        spaceBetween={0}
      >
        {displayItems?.map((item, index) => (
          <SwiperSlide key={index} style={{ height: containerStyle.height }}>
            <div
              className="flex items-center justify-start"
              style={{ height: containerStyle.height }}
            >
              {item.type === "countdown" && item.countdownDate ? (
                <Countdown
                  date={item.countdownDate}
                  renderer={(props) => countdownRenderer({ ...props, item })}
                />
              ) : item.render ? (
                item.render()
              ) : (
                <div
                  className={`tw-flex tw-items-center tw-gap-1 tw-text-xs tw-font-semibold tw-w-auto ${
                    item.textColor || "tw-text-gray-700"
                  }`}
                  style={{ height: containerStyle.height }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.text}</span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VerticalTextCarousel;
