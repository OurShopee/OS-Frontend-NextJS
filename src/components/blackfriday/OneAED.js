import { useSelector } from "react-redux";
import { CarouselProducts } from "../homepage";
import { getAssetsUrl } from "../utils/helpers";

const OneAED = ({ productsAtOne }) => {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  // function splitProducts(products) {
  //     if (products.length > 10) {
  //         const half = Math.ceil(products.length / 2);
  //         return [products.slice(0, half), products.slice(half)];
  //     } else {
  //         const first = products.slice(0, 5);
  //         const second = products.length > 5 ? products.slice(5) : [];
  //         return [first, second];
  //     }
  // }

  // const rows = splitProducts(productsAtOne);

  // const rows = [
  //     Array(10).fill({
  //         name: "Apple iPhone 16 Pro Max 1TB - Desert Titanium",
  //         price: 1,
  //         originalPrice: 1980,
  //         discount: "19% OFF",
  //         image: "/assets/11-sale/Laptop.png",
  //     }),
  //     Array(10).fill({
  //         name: "Apple iPhone 16 Pro Max 1TB - Desert Titanium",
  //         price: 1,
  //         originalPrice: 1980,
  //         discount: "19% OFF",
  //         image: "/assets/11-sale/Watches.png",
  //     })
  // ];

  return (
    <div className="overflow-hidden relative rounded-xl py-5">
      <div className="grid grid-cols-6 gap-4">
        {/* Fixed first column spanning 2 rows */}
        <div
          data-aos="fade-right"
          data-aos-duration="400"
          data-aos-easing="ease-in-out"
          data-aos-delay="150"
          className="row-span-1 col-span-1 rounded-xl ml-1
                bg-gradient-to-tr relative from-[#8682E8] via-[#7262C7]/[60%] to-[#F4C7FF]/[50%]"
        >
          {/* <p className="text-[28px] font-semibold text-[#43494B] p-3.5">
                        Buy Products for only 1 {currentcountry?.currency}
                    </p> */}
          {/* <div
                        className="absolute -rotate-12 z-[2] -bottom-10 -right-10 2xl:-bottom-12 2xl:-right-12 clip-burst mt-2 bg-[#feda4b] w-[150px] h-[150px]"
                    >
                        <p className="text-red-600 flex flex-col mt-1 font-bold text-center pt-[20px] pr-[35px] mb-0 select-none">
                            <span>ONLY</span> <span className='font-extrabold'><span className='text-3xl leading-3'>@</span> 1 {currentcountry?.currency}</span>
                        </p>
                    </div> */}
          <img
            loading="lazy"
            src={getAssetsUrl("11-sale/oneaed.png")}
            alt="frame"
            className="absolute rounded-xl object-cover object-top w-full h-full"
          />
        </div>

        {/* Swiper rows for remaining 4 columns */}
        <div className="col-span-5 bg-[#EEEBFA] p-4 rounded-xl">
          {[...Array(1)].map((_, rowIndex) => (
            <div key={rowIndex} className="">
              <CarouselProducts
                products={productsAtOne}
                slides={5}
                sectionName={"Products @ 1"}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default OneAED;
