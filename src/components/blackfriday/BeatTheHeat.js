import { CarouselProducts } from "../homepage";
import leaf from "./images/leaf.png";
import underline from "./images/underline.png";
const BeatTheHeat = ({ rows }) => {
  const fixedImages = [
    {
      title: "Pre-owned laptops",
      off: "60",
      img: "https://cdn.ourshopee.com/ourshopee-img/summer_sale/hotfix/first.png",
      color: "rgba(177,179,212,0.6)",
    },
    {
      title: "Pre Owned Tablet",
      off: "70",
      img: "https://cdn.ourshopee.com/ourshopee-img/summer_sale/hotfix/second.png",
      color: "#D0E1E6",
    },
    // { title: "Perfumes", off: "40", img: "/assets/11-sale/shop-by-categories/Perfume.png", color: "#E0DAB9" },
    // { title: "Watches", off: "60", img: "/assets/11-sale/shop-by-categories/Watches.png", color: "rgba(177,179,212,0.6)" },
    // { title: "Electronics", off: "50", img: "/assets/11-sale/shop-by-categories/Electronics.png", color: "#D0E1E6" },
  ];

  return (
    <div className="bg-gradient-to-b  from-[#F6FF93] to-[#FFFFFF] rounded-xl pb-4 px-4">
      <div className="flex justify-center items-center gap-4">
        <div className="mt-4 px-3 ">
          <div
            className={`
            relative inline-block
            text-[55px] text-[rgb(42,110,77)]
            tracking-[2.01px] font-bold
          `}
            style={{ fontFamily: "'Bobby Jones Soft Regular', cursive" }}
          >
            {/* leaf before the start */}
            <img
              src={leaf}
              alt=""
              width={50}
              className="absolute -left-[32px] -top-[5px] w-7 h-auto"
            />
            HOT PICKS OF THE MOMENT
            {/* scribble underline */}
            <div className="absolute right-0 top-[3.9rem] flex justify-end h-[40px]">
              <img
                src={underline}
                alt=""
                width={110}
                height={17}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {rows?.map((products, rowIndex) => {
          const fixed = fixedImages?.[rowIndex] || {};

          return (
            products.length > 0 && (
              <div
                key={rowIndex}
                className="grid grid-cols-5 p-4 gap-6 w-full h-full bg-white"
              >
                <div className="min-h-full min-w-[270px] flex  justify-center">
                  <img
                    loading="lazy"
                    className="w-full h-full"
                    src={fixed.img}
                    alt={fixed.title || "Fixed Promo"}
                  />
                </div>

                <div className="col-span-4 beat-the-heat h-full">
                  <CarouselProducts
                    key={rowIndex}
                    products={products}
                    sectionName={"Beat The Heat"}
                    breakPointsProps={{
                      200: { slidesPerView: 1.3 },
                      375: { slidesPerView: 2 },
                      425: { slidesPerView: 2 },
                      500: { slidesPerView: 2 },
                      660: { slidesPerView: 3 },
                      760: { slidesPerView: 3 },
                      1000: { slidesPerView: 4 },
                      1200: { slidesPerView: 4 },
                      1400: { slidesPerView: 5 },
                      1600: { slidesPerView: 5 },
                    }}
                  />
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default BeatTheHeat;
