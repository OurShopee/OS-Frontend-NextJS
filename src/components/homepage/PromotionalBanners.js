// components/PromotionalBanners.jsx

import { MediaQueries } from "../utils";

export default function PromotionalBanners({ sectionBanners }) {
  const { isMobile, isTablet, isLaptop } = MediaQueries();
  const banners = [
    {
      id: 1,
      title: "LAPTOPS",
      subtitle: "COLLECTIONS",
      label: "FRESH ARRIVAL",
      badge: "LIMITED",
      buttonText: "SHOP NOW",
      image: "/images/laptop-promo.png",
      gradient: "from-pink-500 via-red-500 to-orange-500",
      textColor: "text-white",
    },
    {
      id: 2,
      title: "NEW EARPHONES",
      subtitle: "TAURUS",
      badge: "10% OFF",
      buttonText: "SHOP ONLINE NOW",
      image: "/images/earphones.png",
      gradient: "from-purple-600 to-purple-700",
      textColor: "text-white",
      url: "www.yourmusiclife.com +91 765 787",
    },
    {
      id: 3,
      title: "BABY",
      subtitle: "FROM 1ST MONTH FOR YOU",
      label: "Best Protection",
      badge: "MORE",
      image: "/images/baby.png",
      gradient: "from-yellow-300 to-yellow-400",
      textColor: "text-red-600",
      hasBabyBottle: true,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-2 flex-1 min-h-0 overflow-hidden">
      {/* Left Promo Box */}
      <div className="col-span-7 min-h-0">
        {sectionBanners?.sectionBanner1 && (
          <div
            data-aos="zoom-in"
            data-aos-duration="700"
            data-aos-easing="ease-in-out"
            className="bg-cover bg-center rounded-2xl relative overflow-hidden cursor-pointer"
            onClick={() => {
              const url = !isMobile
                ? sectionBanners?.sectionBanner1?.url_web
                : sectionBanners?.sectionBanner1?.url_web;

              pushToDataLayer("clicked_card", currentcountry?.name, {
                card_name: sectionBanners?.sectionBanner1?.image_web,
                page: window.location.pathname,
              });
              router.push(url);
            }}
          >
            <img
              src={
                !isMobile
                  ? sectionBanners?.sectionBanner1?.image_web
                  : sectionBanners?.sectionBanner1?.image_web
              }
              className="w-full h-[350px] aspect-[268/350] rounded-2xl object-cover"
              alt="Banners"
            />
          </div>
        )}
      </div>

      {/* Right Stacked Images */}
      <div className="col-span-5 grid grid-rows-2 gap-2 h-full min-h-0">
        {sectionBanners?.sectionBanner2 && (
          <div
            data-aos="fade-left"
            data-aos-easing="ease-in-out"
            className="bg-cover bg-center rounded-2xl relative overflow-hidden cursor-pointer min-h-0"
            onClick={() => {
              const url = !isMobile
                ? sectionBanners?.sectionBanner2?.url_web
                : sectionBanners?.sectionBanner2?.url_web;

              pushToDataLayer("clicked_card", currentcountry?.name, {
                card_name: sectionBanners?.sectionBanner2?.image_web,
                page: window.location.pathname,
              });
              router.push(url);
            }}
          >
            <img
              src={
                !isMobile
                  ? sectionBanners?.sectionBanner2?.image_web
                  : sectionBanners?.sectionBanner2?.image_web
              }
              className="w-full rounded-2xl h-[170px] aspect-[195/170] object-cover"
              alt="Banners"
            />
          </div>
        )}
        {sectionBanners?.sectionBanner3 && (
          <div
            data-aos="fade-left"
            data-aos-easing="ease-in-out"
            className="bg-cover bg-center rounded-2xl h-full relative overflow-hidden cursor-pointer min-h-0"
            onClick={() => {
              const url = !isMobile
                ? sectionBanners?.sectionBanner3?.url_web
                : sectionBanners?.sectionBanner3?.url_web;

              pushToDataLayer("clicked_card", currentcountry?.name, {
                card_name: sectionBanners?.sectionBanner3?.image_web,
                page: window.location.pathname,
              });
              router.push(url);
            }}
          >
            <img
              src={
                !isMobile
                  ? sectionBanners?.sectionBanner3?.image_web
                  : sectionBanners?.sectionBanner3?.image_web
              }
              className="w-full rounded-2xl h-[170px] aspect-[195/170] object-cover"
              alt="Banners"
            />
          </div>
        )}
      </div>
    </div>
  );
}
