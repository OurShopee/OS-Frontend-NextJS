"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { useSelector } from "react-redux";
import { pushToDataLayer, trackBannerClick } from "../utils/dataUserpush";
function HomeMobileCarousel({ carousel_data }) {
  const [current_index, setcurrent_index] = useState(0);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const pathname = usePathname();
  const pageName = pathname;
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
        controls={false}
        indicators={false}
        activeIndex={current_index}
        onSelect={(i) => setcurrent_index(i)} // sync index on swipe/tap
        interval={3000} // auto-advance
        pause={false} // keep playing
        touch
        className="home_mobile_carousel"
      >
        {carousel_data.map((item) => {
          const urlParts = item.url.split("/").filter(Boolean);
          const lastPart = urlParts[urlParts.length - 1] || "Banner Item";
          const formattedTitle = lastPart.replace(/[-_]/g, " ");
          return (
            <Carousel.Item key={item.carousel_id}>
              <Link href={item.url}
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
                    page_name: pathname,
                  });
                }}
              >
                <img className={`${carousel_data.length > 1 ? "" : "rounded-0"}`}
                  src={item.mobile_image_url}
                  alt=""
                  loading="lazy"
                />
              </Link>
            </Carousel.Item>
          );
        })}
      </Carousel>
      {carousel_data.length > 1 && (
        <div class="track_indicators">
          {carousel_data.map((indicator_item, index) => {
            return (
              <motion.div
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
