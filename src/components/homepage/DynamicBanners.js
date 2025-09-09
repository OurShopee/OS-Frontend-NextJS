import React from "react";
import { MediaQueries } from "../utils";
import { useSelector } from "react-redux";
import Link from "next/link";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useRouter } from "next/navigation";

const DynamicBanners = ({
  bannerKey,
  enableAos = false,
  aosType = "zoom-in",
  className,
}) => {
  const bannerList = useSelector((state) => state.homeslice.bannerList);
  const { isMobile } = MediaQueries();
  const router = useRouter();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  // Return null if key doesn't exist
  if (!bannerList?.dynamicBanners?.hasOwnProperty(bannerKey)) return null;

  const matched = bannerList.dynamicBanners[bannerKey];
  if (!matched?.image_web) return null;

  const imgSrc = isMobile ? matched.image_app : matched.image_web;
  const url = isMobile ? matched.url_app : matched.url_web;
  const isValidUrl = url && url !== "0" && url !== "";

  const imgProps = {
    src: imgSrc,
    alt: "Dynamic Banner",
    loading: "lazy",
    className: className
      ? className
      : isMobile
      ? "mt-4 rounded-3xl"
      : "mt-4  rounded-3xl",
    ...(enableAos && {
      "data-aos": aosType,
      "data-aos-duration": "700",
      "data-aos-easing": "ease-in-out",
      "data-aos-delay": "200",
    }),
  };

  return isValidUrl ? (
    <Link
      className="single_banner"
      href={url}
      onClick={(e) => {
        const imgName = imgSrc;
        pushToDataLayer("clicked_banner", currentcountry.name, {
          banner_name: imgName,
          page_name: router.pathname,
        });
      }}
    >
      <img {...imgProps} />
    </Link>
  ) : (
    <div className="single_banner cursor-default">
      <img {...imgProps} style={{ cursor: "default" }} />
    </div>
  );
};

export default DynamicBanners;
