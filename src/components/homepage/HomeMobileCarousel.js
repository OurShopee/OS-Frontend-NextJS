"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pushToDataLayer, trackBannerClick } from "../utils/dataUserpush";
import Carousel from "../Common/Carousel";

// Custom NavLink component for Next.js App Router
const NavLink = ({ to, children, onClick, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to} {...props}>
      <span onClick={onClick}>{children}</span>
    </Link>
  );
};

function HomeMobileCarousel({ carousel_data }) {
  const [current_index, setcurrent_index] = useState(0);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const pathname = usePathname();
  const pageName =
    typeof window !== "undefined" ? window.location.pathname : pathname;

  useEffect(() => {
    const interval = setInterval(() => {
      current_index === carousel_data.length - 1
        ? setcurrent_index(0)
        : setcurrent_index(current_index + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [current_index, carousel_data.length]);

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
              <NavLink
                to={item.url}
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
                    page_name: pageName,
                  });
                }}
              >
                <img
                  className={`${
                    carousel_data.length > 1 ? "" : "rounded-none"
                  }`}
                  src={item.mobile_image_url}
                  alt={formattedTitle}
                  priority={current_index === 0}
                />
              </NavLink>
            </Carousel.Item>
          );
        })}
      </Carousel>
      {carousel_data.length > 1 && (
        <div className="track_indicators">
          {carousel_data.map((indicator_item, index) => {
            return (
              <motion.button
                key={index}
                layout
                data-isOpen={current_index == index}
                initial={{ borderRadius: 50 }}
                className="indicator bg-transparent border-none p-2 cursor-pointer"
                onTap={() => setcurrent_index(index)}
                onClick={() => setcurrent_index(index)}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={0}
                type="button"
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default HomeMobileCarousel;
