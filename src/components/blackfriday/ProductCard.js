import { useDispatch, useSelector } from "react-redux";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaQueries } from "../../components/utils";
import { getWishLists, postWishList } from "../../redux/cartslice";
import flashIcon from "./images/Flash.png";

export default function ProductCard({ product }) {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const wishlist = useSelector((state) => state?.cartslice?.wishListData);
  const isWishlisted = wishlist?.some((list) => list?.sku === product?.sku);
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const { isMobile } = MediaQueries();
  const dispatch = useDispatch();

  const bottomItems = [
    {
      text: "Trending Deal",
      icon: "🔥",
      bg: "bg-red-100",
      textColor: "text-red-400",
    },
    {
      text: "Selling Out Fast",
      icon: flashIcon,
      bg: "bg-yellow-100",
      textColor: "text-[#e78b00]",
    },
  ];

  const handleWishList = async (e, item) => {
    e.preventDefault();
    const input_data = {
      product_id: item?.id,
      sku: item?.sku || item?.url?.split("/")[1],
    };
    await dispatch(postWishList(input_data));
    dispatch(getWishLists());
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-easing="ease-in-out"
      data-aos-delay="200"
      className={`relative product_card_border bg-white rounded-xl shadow-md ${
        !isMobile && "hover:scale-[96%]"
      } min-w-[150px] !max-w-full overflow-hidden transition-transform duration-500 ease-in-out cursor-pointer w-full h-full p-4 pb-2 m-auto product-card`}
    >
      {isMobile && product.percentage > 0 && (
        <span className="absolute top-3 left-3 flex gap-1 text-[#299913] bg-[#eaffd8] text-xs font-semibold px-2 py-1 rounded-xl">
          {product.percentage}% <span>OFF</span>
        </span>
      )}

      <div className="flex flex-col justify-between h-full">
        {/* Image */}
        <div className="w-full rounded-md text-center">
          <img
            loading="lazy"
            src={product.image}
            alt={"img"}
            className={`max-w-[170px] w-full h-auto object-contain mx-auto ${
              !isMobile && "product-image"
            }`}
          />
        </div>

        {/* Product Details */}
        <div className="mt-0 z-10">
          <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-0">
            {product.name}
          </p>
          <div className="flex items-center gap-3 justify-between mt-0">
            <span className="font-bold text-lg text-black whitespace-nowrap">
              {currentcountry.currency} {product.display_price}
            </span>
            <div className="flex items-center justify-center gap-2">
              {product.percentage > 0 && (
                <span className="line-through text-gray-400 text-sm">
                  {product.old_price}
                </span>
              )}
              {!isMobile && product.percentage > 0 && (
                <span className="text-green-600 text-xs font-semibold rounded whitespace-nowrap">
                  {product.percentage}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Label (Swiper Vertical) */}
        <div className="h-[24px] overflow-hidden rounded relative">
          <Swiper
            direction="vertical"
            loop
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            speed={1000}
            allowTouchMove={false}
            modules={[Autoplay]}
            className="h-[24px]"
          >
            {bottomItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`h-[24px] flex items-center gap-1 text-xs font-semibold w-full ${item.textColor}`}
                >
                  {item.icon.startsWith("data") ? (
                    <img src={item.icon} alt={item.text} className="w-4 h-4" loading="lazy" />
                  ) : (
                    <span>{item.icon}</span>
                  )}
                  <span>{item.text}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
