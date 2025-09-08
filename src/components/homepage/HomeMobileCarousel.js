import Carousel from "react-bootstrap/Carousel";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { pushToDataLayer, trackBannerClick } from "../utils/dataUserpush";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

function HomeMobileCarousel({ carousel_data }) {
  const [current_index, setcurrent_index] = useState(0);
  const router = useRouter();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const pageName = router.pathname;

  useEffect(() => {
    const interval = setInterval(() => {
      current_index === carousel_data.length - 1
        ? setcurrent_index(0)
        : setcurrent_index(current_index + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [current_index]);

  return (
    <>
      <Carousel
        fade
        className="home_mobile_carousel"
        controls={false}
        indicators={false}
        activeIndex={current_index}
      >
        {carousel_data.map((item) => {
          const urlParts = item.url.split("/").filter(Boolean);
          const lastPart = urlParts[urlParts.length - 1] || "Banner Item";
          const formattedTitle = lastPart.replace(/[-_]/g, " ");
          return (
            <Carousel.Item key={item.carousel_id}>
              <Link
                href={item.url}
                onClick={() => {
                  const imgUrl = item.mobile_image_url;
                  trackBannerClick(
                    formattedTitle,
                    "",
                    pageName,
                    currentcountry.name
                  );
                  pushToDataLayer("clicked_banner", currentcountry.name, {
                    banner_name: imgUrl,
                    page_name: router.pathname,
                  });
                }}
              >
                <img
                  className={`${carousel_data.length > 1 ? "" : "rounded-0"}`}
                  src={item.mobile_image_url}
                  alt=""
                />
              </Link>
            </Carousel.Item>
          );
        })}
      </Carousel>
      {carousel_data.length > 1 && (
        <div className="track_indicators">
          {carousel_data.map((indicator_item, index) => {
            return (
              <motion.div
                key={index}
                layout
                data-isOpen={current_index == index}
                initial={{ borderRadius: 50 }}
                className="indicator"
                onTap={() => setcurrent_index(index)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default HomeMobileCarousel;
