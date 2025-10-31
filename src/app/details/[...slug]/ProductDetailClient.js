"use client";

import { ComponentHeader } from "@/components/Common";
import BreadComps from "@/components/Common/Breadcomps";
import CartModalDesktop from "@/components/Common/Modals/CartModelDesktop";
import StickyActionBar from "@/components/Common/StickyActionbar";
import { CarouselProducts } from "@/components/homepage";
import { ProductCardPlaceHolder } from "@/components/placeholders/ProductCategory";
import Bankoffermodal from "@/components/product-detail/Bankoffermodal";
import ImageCarousel from "@/components/product-detail/ImageCarousel";
import Snplmodal from "@/components/product-detail/Snplmodal";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import { useCart } from "@/hooks";
import { decode } from "html-entities";
import Cookiess from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import "swiper/css";
import "swiper/css/free-mode";
import Cookies from "universal-cookie";
import {
  setbankoffermodal,
  setformmodal,
  setformstatus,
  setsnplmodal,
} from "@/redux/formslice";
import {
  getProductDetail,
  getrelatedItems,
  setprodcatloading,
} from "@/redux/productslice";
import ReviewNoRating from "@/components/rating-reviews/ReviewNoRating";
import ReviewOnlyRating from "@/components/rating-reviews/ReviewOnlyRating";
import ReviewWithRating from "@/components/rating-reviews/ReviewWithRating";
import CustomStarRating from "@/components/rating-reviews/CustomStarRating";
import { getAllReviews } from "@/api/review";

const ProductDetailClient = ({ initialProductData, productInfo }) => {
  const cookies = new Cookies();
  const { isMobile, isLaptop, isTablet } = MediaQueries();
  const { add2cart, isLoading } = useCart();
  const [showCartModalDesktop, setShowCartModalDesktop] = useState(false);
  const [product, setProduct] = useState(initialProductData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [productReviews, setProductReviews] = useState();
  const [allProductReviews, setAllProductReviews] = useState();

  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);
  const formmodal = useSelector((state) => state.globalslice.formmodal);
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const countryDropdown = useSelector(
    (state) => state.globalslice.countryDropdown
  );

  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [bankSlider, setBankSlider] = useState();
  const [bankofferdata, setbankofferdata] = useState();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const innerRef = useRef(null);
  const wrapperRef = useRef(null);
  const reviewRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  const headerRef = useRef(null);
  const [qty, setQty] = useState(1);
  const loading = useSelector((state) => state.productslice.loading);
  const loading1 = useSelector((state) => state.productslice.loading1);
  const productDetail = initialProductData;
  const productDetail_products = useSelector(
    (state) => state.productslice.productDetail_products
  );
  const [savedPrice, setSavedPrice] = useState(0);
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCard(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust as needed for how much of review section should be visible before showing footer
    );

    if (reviewRef.current) {
      observer.observe(reviewRef.current);
    }

    return () => {
      if (reviewRef.current) {
        observer.unobserve(reviewRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const screenHeight = window.innerHeight - 100;

      if (currentScrollY > screenHeight) {
        if (currentScrollY > lastScrollY) {
          setShow(true);
        }
        setLastScrollY(currentScrollY);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    dispatch(setsnplmodal(false));
    dispatch(setbankoffermodal(false));
  }, []);

  useEffect(() => {
    const offData =
      productDetail[0]?.old_price * (productDetail[0]?.percentage / 100);
    setSavedPrice(offData ? offData.toFixed(2) : 0);
    setBankSlider(productDetail[0]?.bank_offers);
  }, [productDetail[0]]);

  function decodeHtml(html) {
    return decode(html);
  }

  const bankofferclick = (bank_offer) => {
    dispatch(setbankoffermodal(true));
    setbankofferdata(bank_offer);
  };

  useEffect(() => {
    const getAllReviewsdata = async () => {
      try {
        const res = await getAllReviews(productDetail[0]?.id);
        if (res?.data?.status === "success") {
          setProductReviews(res.data);
          setAllProductReviews(res.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (productDetail[0]?.id) {
      getAllReviewsdata();
    }
  }, [productDetail, logindata, authstatus]);

  const saveCookies = () => {
    if (cookies.get("sku") == undefined) {
      cookies.set("sku", [productInfo.productSku]);
    } else {
      cookies.set("sku", [
        ...cookies.get("sku").filter((item) => item != productInfo.productSku),
        productInfo.productSku,
      ]);
    }
  };

  useEffect(() => {
    dispatch(setprodcatloading(true));
    saveCookies();
    dispatch(getProductDetail(productInfo.productSku));
  }, [productInfo.productSku]);

  useEffect(() => {
    if (!loading) {
      var input_data = {
        brand_id: productDetail[0]?.brand_id,
        subcategory_id: productDetail[0]?.subcategory_id,
        sku: productInfo.productSku,
        skulist: cookies.get("sku"),
      };
      dispatch(getrelatedItems(input_data));
    }
  }, [loading]);

  let a_plus_images;
  if (isMobile) {
    a_plus_images = productDetail?.[0]?.m_web_a_plus_images;
  } else {
    a_plus_images = productDetail?.[0]?.a_plus_images;
  }

  const trustBadges = [
    {
      img: "/assets/vector_icons/top_rated_customer.png",
      text: "Top Rated By Customers",
    },
    {
      img: "/assets/vector_icons/Secure_Transaction.png",
      text: "Secure Transaction",
    },
    {
      img: "/assets/vector_icons/Exchange_Available.png",
      text: "Exchange Available",
    },
    {
      img: "/assets/vector_icons/Pay_Delivery.png",
      text: "Cash/Pay On Delivery",
    },
  ];

  const bankBanner = [
    {
      image: "/assets/vector_icons/Bank_offer_blue.png",
      textBackground: "#4171DB",
      payBackground: "rgb(173, 218, 253)",
    },
    {
      image: "/assets/vector_icons/Bank_offer_green.png",
      textBackground: "#38A60C",
      payBackground: "rgb(222, 242, 195)",
    },
    {
      image: "/assets/vector_icons/Bank_offer_pink.png",
      textBackground: "#DA372D",
      payBackground: "rgb(255, 175, 187)",
    },
  ];

  const [view_more, setview_more] = useState(5);

  const handleViewMore = () => {
    if (view_more == productDetail[0]?.bank_offers.length) {
      setview_more(5);
    } else {
      setview_more(productDetail[0]?.bank_offers.length);
    }
  };

  useEffect(() => {
    setProduct(productDetail[0]);
  }, [productDetail]);

  useEffect(() => {
    pushToDataLayer(
      "view_pdp",
      currentcountry.name,
      {
        product_name: productDetail[0]?.name,
        source: "pdp",
      },
      false
    );
    pushToDataLayer(
      "view_item",
      currentcountry.name,
      {
        currency: currentcountry.currency,
        value: productDetail[0]?.display_price,
        items: [
          {
            item_id: productDetail[0]?.sku,
            item_name: productDetail[0]?.name,
            item_category: productDetail[0]?.subcategory_name,
            price: productDetail[0]?.display_price,
            quantity: 1,
          },
        ],
      },
      false
    );
  }, [productDetail]);

  const handleClick = async () => {
    var input_data = {
      product_id: productDetail[0]?.id,
      user_id: authstatus ? logindata.user_id : 0,
      quantity: qty,
      country_id: currentcountry.id,
    };
    if (cookies.get("cart_ip_address") == undefined) {
      input_data.ip_address = 0;
    } else {
      input_data.ip_address = cookies.get("cart_ip_address");
    }
    await add2cart(input_data);
    setShowCartModalDesktop(true);
    pushToDataLayer(
      "clicked_add_to_cart",
      currentcountry.name,
      {
        product_name: productDetail[0]?.name,
      },
      true
    );
    pushToDataLayer(
      "add_to_cart",
      {
        currency: currentcountry.currency,
        value: productDetail[0]?.display_price,
        items: [
          {
            item_id: productDetail[0]?.sku,
            item_name: productDetail[0]?.name,
            item_category: productDetail[0]?.subcategory_name,
            price: productDetail[0]?.display_price,
            quantity: qty,
          },
        ],
      },
      false
    );
  };

  const cleanedDetails = decodeHtml(productDetail[0]?.details)
    .replace(/&lt;div&gt;/g, "")
    .replace(/&lt;\/div&gt;/g, "")
    .replace(/&lt;br\s*\/?&gt;/gi, "")
    .trim();

  const handleBuyNow = (id, qty, sku = "") => {
    if (!Cookiess.get("jwt_token")) {
      dispatch(setformmodal(!formmodal));
      dispatch(setformstatus(1));
    } else {
      pushToDataLayer(
        "clicked_buy_now",
        currentcountry?.name,
        {
          currency: currentcountry.currency,
          value: productDetail[0]?.display_price,
          items: [
            {
              item_id: productDetail[0]?.sku,
              item_name: productDetail[0]?.name,
              item_category: productDetail[0]?.subcategory_name,
              price: productDetail[0]?.display_price,
              quantity: qty,
            },
          ],
        },
        false
      );
      if (addresslistdata?.data?.length > 0) {
        router.push(`/Payment?prodId=${id}&qty=${qty}&sku=${sku}&price=${productDetail[0]?.display_price}`);
      } else {
        router.push(`/deliveryaddress?prodId=${id}&qty=${qty}&sku=${sku}&price=${productDetail[0]?.display_price}`);
      }
    }
  };

  const handleChangeQty = (action) => {
    if (action === "inc") {
      setQty(qty + 1);
    } else if (action === "dec") {
      if (qty > 1) setQty(qty - 1);
    }
  };

  const getCombinedPartial = () => {
    const smallDescData = productDetail[0]?.small_desc_data || [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `<table>${cleanedDetails}</table>`;
    const allRows = Array.from(tempDiv.querySelectorAll("tr"));
    const combined = [];

    for (let i = 0; i < smallDescData.length && combined.length < 3; i++) {
      combined.push({ type: "react", data: smallDescData[i] });
    }

    return combined;
  };

  const handleToggle = () => {
    let scrollHeight;
    if (isMobile) {
      scrollHeight = 250;
    } else {
      scrollHeight = 100;
    }
    if (expanded) {
      setTimeout(() => {
        const top =
          headerRef.current?.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: top - scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (innerRef.current) {
      setContentHeight(innerRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <>
      <div className="">
        {/* Container fluid -> w-full px-4 */}
        <div className="pb-3 px-3">
          {!loading ? (
            <div
              className={`2xl:container top-[20px] flex ${
                isMobile && "flex-col"
              } gap-5 !m-auto relative`}
            >
              <div
                className={`${
                  !isMobile &&
                  "flex-[0_0_47%] w-[47%] sticky top-[0px] self-start"
                }`}
              >
                {isMobile && (
                  <>
                    <div className="product_Detail_right_side">
                      <div className="grid gap-1 mt-3">
                        <h6 className="text-sm text-[#6F787C] mb-0">
                          {productDetail[0]?.brand}
                        </h6>
                        <h3 className="text-lg text-[#191B1C] font-semibold">
                          {productDetail[0]?.name}
                        </h3>
                        {allProductReviews?.data?.stats?.averageRating > 0 && (
                          <div className="flex gap-1 justify-start items-center">
                            <CustomStarRating
                              rating={
                                allProductReviews?.data?.stats?.averageRating
                              }
                              starSpacing="0px"
                              size="22px"
                              svgIconViewBox="0 3 40 40"
                              path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                            />
                            <span className="font-semibold text-[#43494B]">
                              {Number.isInteger(
                                allProductReviews?.data?.stats?.averageRating
                              )
                                ? `${allProductReviews?.data?.stats?.averageRating}.0`
                                : allProductReviews?.data?.stats?.averageRating?.toFixed(
                                    1
                                  )}
                            </span>
                            <span className="text-[#9EA5A8] font-medium">
                              | ({allProductReviews?.data?.stats?.reviewCount}{" "}
                              Reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="product_Detail_left_side">
                  {!loading && !isLaptop && (
                    <div className="!mb-3 2xl:container !m-auto">
                      <BreadComps
                        title0={productDetail[0]?.category_name}
                        link0={productDetail[0]?.category_url}
                        title1={productDetail[0]?.subcategory_name}
                        link1={productDetail[0]?.subcategory_url}
                        title2={productDetail[0]?.sub_sub_category_name}
                        link2={productDetail[0]?.sub_sub_category_url}
                        activetitle={productDetail[0]?.name}
                      />
                    </div>
                  )}
                  <ImageCarousel
                    isLoading={isLoading}
                    handleClick={handleClick}
                    handleBuyNow={handleBuyNow}
                    images={productDetail[0]?.images}
                    product={productDetail[0]}
                    qty={qty}
                    setQty={setQty}
                  />
                  {isTablet && (
                    <StickyActionBar
                      quantity={qty}
                      onIncrease={() => setQty((q) => q + 1)}
                      onDecrease={() => setQty((q) => Math.max(1, q - 1))}
                      onAddToCart={handleClick}
                      onBuyNow={(id, qty, sku) => handleBuyNow(id, qty, sku)}
                      productData={productDetail[0]}
                    />
                  )}
                </div>
              </div>
              <div
                className={`${
                  !isMobile && "flex-grow basis-0 overflow-hidden"
                }`}
              >
                <div
                  className={`product_Detail_right_side ${
                    isMobile ? "mt-0" : "mt-10"
                  }`}
                >
                  {!isMobile && (
                    <div className="mb-7">
                      <h6 className="text-[#6F787C] font-medium mb-2 leading-[1.2rem]">
                        {productDetail[0]?.brand}
                      </h6>
                      <h3 className="!text-[22px] !font-semibold mb-3">
                        {productDetail[0]?.name}
                      </h3>
                      {allProductReviews?.data?.stats?.averageRating > 0 && (
                        <div className="flex gap-1 justify-start items-center">
                          <CustomStarRating
                            rating={
                              allProductReviews?.data?.stats?.averageRating
                            }
                            starSpacing="0px"
                            size="24px"
                            svgIconViewBox="0 0 40 40"
                            path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                          />
                          <span className="text-lg font-semibold text-[#43494B]">
                            {Number.isInteger(
                              allProductReviews?.data?.stats?.averageRating
                            )
                              ? `${allProductReviews?.data?.stats?.averageRating}.0`
                              : allProductReviews?.data?.stats?.averageRating?.toFixed(
                                  1
                                )}
                          </span>
                          {allProductReviews?.data?.stats?.reviewCount > 0 && (
                            <span className="text-base text-[#9EA5A8] font-medium">
                              | ({allProductReviews?.data?.stats?.reviewCount}{" "}
                              Reviews)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {!isMobile && <hr className="text-[#b3aaaa] mb-0" />}
                  <div className={`${!isMobile && "my-7"}`}>
                    {/* d-flex -> flex */}
                    <div className="product_Detail_price_container flex">
                      {/* d-flex align-items-center -> flex items-center */}
                      <div className="display_price flex items-center">
                        {/* fw-bold fs-5 d-flex align-items-center -> font-bold text-xl flex items-center */}
                        <span className="font-bold text-xl flex items-center">
                          {/* me-1 -> mr-1 */}
                          <span className="currency-symbol mr-1 text-[24px] md:text-[26px]">
                            {currentcountry.currency}
                          </span>
                          <span className="text-[24px] md:text-[26px]">
                            {" "}
                            {productDetail[0]?.display_price}
                          </span>
                        </span>

                        {savedPrice > 0 && (
                          /* ms-2 px-3 py-2 d-flex align-items-center -> ml-2 px-3 py-2 flex items-center */
                          <div className="save-banner ml-2 px-3 py-2 flex items-center !font-medium">
                            {/* me-2 d-inline-flex align-items-center justify-content-center -> mr-2 inline-flex items-center justify-center */}
                            <span className="badge-icon mr-2 inline-flex items-center justify-center">
                              <img
                                src="/assets/vector_icons/Vector.png"
                                alt="%"
                                className="discount-icon"
                              />
                            </span>
                            <span className="text-sm">
                              You saved{" "}
                              <span className="currency-symbol !text-sm">
                                {currentcountry.currency}{" "}
                              </span>
                              {Math.ceil(savedPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {productDetail[0]?.hasOwnProperty("old_price") &&
                      Number(productDetail[0]?.display_price) <
                        Number(productDetail[0]?.old_price) && (
                        <div className="old_price">
                          <span>
                            {currentcountry.currency +
                              " " +
                              productDetail[0]?.old_price}
                          </span>
                          <div className="product_Detail_price_container">
                            <div className="display_percentage">
                              {productDetail[0]?.percentage + "% OFF"}
                            </div>
                          </div>
                          <p className="text-[#9EA5A8] mb-0 text-base">
                            (Inc. of VAT)
                          </p>
                        </div>
                      )}
                  </div>
                  <div className="my-6">
                    {productDetail[0]?.stock === "In stock" && (
                      <>
                        {/* d-flex gap-3 -> flex gap-3 */}
                        <div className="product_Detail_btn_container flex gap-3">
                          <span
                            /* ms-1 fw-semibold -> ml-1 font-semibold */
                            className="ml-1 font-semibold"
                            style={{ fontFamily: "Outfit", fontSize: "16px" }}
                          >
                            IN STOCK
                          </span>
                          {/* d-flex align-items-center justify-content-center -> flex items-center justify-center */}
                          <div className="flex items-center justify-center">
                            <img
                              src={"/assets/vector_icons/fire.png"}
                              alt="fire"
                              width={11.75}
                              height={20}
                            />
                            <span
                              /* ms-1 fw-bold -> ml-1 font-bold */
                              className="ml-1 font-bold"
                              style={{
                                color: "#E78B00",
                                fontFamily: "Outfit",
                                fontSize: "14px",
                              }}
                            >
                              Selling out fast!
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center ${
                            isMobile ? "" : "gap-2"
                          } flex-nowrap min-w-0`}
                        >
                          {productDetail?.[0]?.fastTrack === 1 && (
                            <img
                              src={"/assets/vector_icons/Express_delivery.gif"}
                              alt="gif"
                              width={isMobile ? 200 : 230}
                              height={35}
                            />
                          )}
                          <span
                            /* ms-1 -> ml-1 */
                            className={`whitespace-nowrap ${
                              productDetail?.[0]?.fastTrack === 0 ? "ml-1" : ""
                            }`}
                            style={{ fontFamily: "Outfit", fontSize: "14px" }}
                          >
                            {(() => {
                              const deliveryText =
                                productDetail?.[0]?.delivery || "";
                              const afterDelivery =
                                deliveryText.split("Delivery ")[1] || "";
                              const [beforeExpected, afterExpected] =
                                afterDelivery.split("Expected ");

                              return (
                                <>
                                  {beforeExpected}
                               
                                  {afterExpected && (
                                    <>
                                      {" Expected  "}
                                      <strong className="font-bold text-base">
                                        {afterExpected.trim()}
                                      </strong>
                                    </>
                                  )}
                                </>
                              );
                            })()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {isMobile && (
                    /* my-4 -> my-4 */
                    <div className="my-4">
                      <div className="grid grid-cols-4 gap-1">
                        {trustBadges.map((badge, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center text-center gap-1"
                          >
                            <img
                              src={badge.img}
                              alt={badge.text}
                              width={68}
                              height={68}
                              className="mb-2 bg-gray-100 p-2 rounded-full"
                            />
                            <div className="text-xs font-semibold">
                              {badge.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Alternative Attributes */}
                  {productDetail[0]?.alternateAttributes.map(
                    (attribute, index) => {
                      if (!attribute?.list?.length) return null;
                      return (
                        /* mb-3 -> mb-3 */
                        <div className="mb-3" key={`attribute-${index}`}>
                          <div>
                            <h6 className="mb-0 font-semibold text-lg font-[Outfit]">
                              {attribute.title}
                            </h6>
                          </div>
                          <div className="flex mt-2 gap-[14px] flex-wrap">
                            {attribute.list.map((attribute_item) => {
                              const isActive =
                                productInfo.productSku === attribute_item.sku;
                              const colorCircleStyle = {
                                background: attribute_item?.code?.startsWith(
                                  "#"
                                )
                                  ? attribute_item.code
                                  : "#" + attribute_item.code,
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                              };

                              return (
                                <div className="flex" key={attribute_item.sku}>
                                  {attribute_item.code === "" ? (
                                    <Link
                                      href={`/details/${attribute_item.url}`}
                                      /* text-decoration-none -> no-underline */
                                      className="no-underline flex items-center cursor-pointer"
                                    >
                                      <h6
                                        className={`text-[14px] text-center rounded-full whitespace-nowrap px-10 py-3 border ${
                                          isActive
                                            ? "custom_border_select font-bold text-[16px]"
                                            : "image-border text-[#43494B] font-medium"
                                        }`}
                                      >
                                        {attribute_item?.name}
                                      </h6>
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/details/${attribute_item.url}`}
                                      /* text-decoration-none -> no-underline */
                                      className="no-underline flex flex-col items-center cursor-pointer w-max max-w-16"
                                    >
                                      <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                          isActive
                                            ? "custom_border_select"
                                            : "image-border"
                                        }`}
                                      >
                                        <div style={colorCircleStyle} />
                                      </div>
                                      <h6
                                        className={`mt-3 text-[14px] text-center ${
                                          isActive
                                            ? "text-[#43494B] font-bold text-[15px]"
                                            : "text-[#43494B] font-medium"
                                        }`}
                                      >
                                        {attribute_item.name}
                                      </h6>
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
                  {/* Add to Cart Section */}
                  {!isTablet &&
                  product?.stock === "In stock" &&
                  product?.display_price > 0 ? (
                    <div className="grid lg:flex gap-3 mt-4 items-center select-none mb-3">
                      <div className="flex w-full gap-3 items-center">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between gap-3 border py-[.8rem] rounded-lg px-4 text-lg">
                            <button
                              disabled={qty <= 1}
                              className="flex-1 border-none bg-transparent flex items-center justify-center px-0"
                            >
                              <FiMinus
                                height={22}
                                className={`cursor-pointer ${
                                  qty == 1 &&
                                  "text-[#ddd9d9] text-opacity-50 !cursor-default"
                                }`}
                                onClick={() => handleChangeQty("dec")}
                              />
                            </button>
                            <div className="font-semibold flex-1 text-center">
                              {qty}
                            </div>
                            <button className="border-none flex-1 bg-transparent flex items-center justify-center px-0">
                              <FiPlus
                                height={22}
                                onClick={() => handleChangeQty("inc")}
                              />
                            </button>
                          </div>
                        </div>
                        <button
                          className="bg-[#5232C2] uppercase whitespace-nowrap rounded-lg py-[0.9rem] text-white items-center flex justify-center flex-1 gap-2 border-none font-semibold"
                          onClick={handleClick}
                        >
                          <img
                            src={"/assets/vector_icons/cart_icon.svg"}
                            alt={"cart"}
                          />
                          Add to cart
                          {isLoading && (
                            /* ms-3 -> ml-3 */
                            <ClipLoader
                              className="ml-3"
                              size={16}
                              color={"#fff"}
                            />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleBuyNow(product?.id, qty, product.sku)
                          }
                          /* fw-bold -> font-bold, overflow-hidden stays same */
                          className="whitespace-nowrap hidden lg:flex flex-1 border-none rounded-lg py-[0.9rem] !bg-[#FFD100] text-[#191B1C] font-bold items-center justify-center gap-2 overflow-hidden"
                        >
                          <img
                            src="/assets/vector_icons/buy_now_flash_.gif"
                            alt="flash"
                            style={{
                              width: "20px",
                              height: "20px",
                              objectFit: "contain",
                            }}
                          />
                          <span>BUY NOW</span>
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          handleBuyNow(product?.id, qty, product.sku)
                        }
                        /* fw-bold -> font-bold, overflow-hidden stays same */
                        className="whitespace-nowrap flex-1 lg:hidden border-none rounded-lg py-[0.9rem] !bg-[#FFD100] text-[#191B1C] font-bold flex items-center justify-center gap-2 overflow-hidden"
                      >
                        <img
                          src="/assets/vector_icons/buy_now_flash_.gif"
                          alt="flash"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                        <span>BUY NOW</span>
                      </button>
                    </div>
                  ) : (
                    !isTablet && (
                      <>
                        <div className="producrdetailnotifybtn mt-3 uppercase !text-base">
                          Notify me
                          {isLoading && (
                            /* ms-3 -> ml-3 */
                            <ClipLoader
                              className="ml-3"
                              size={16}
                              color={"#fff"}
                            />
                          )}
                        </div>
                        <div className="productdetail-notifystatus">
                          Get notified when this item comes back in stock.
                        </div>
                      </>
                    )
                  )}
                  {!isMobile && (
                    /* my-4 -> my-4 */
                    <div className="my-4">
                      <div className="grid gap-2 grid-cols-2 xl:flex xl:justify-between">
                        {trustBadges.map((badge, index) => (
                          <div
                            key={index}
                            /* text-center gap-2 -> text-center gap-2 */
                            className="flex text-center gap-2 items-center"
                          >
                            <img
                              src={badge.img}
                              alt={badge.text}
                              width={70}
                              height={70}
                              /* mb-2 bg-light p-2 rounded-circle -> mb-2 bg-gray-100 p-2 rounded-full */
                              className="mb-2 bg-gray-100 p-2 rounded-full"
                            />
                            <div className="flex items-center text-start text-sm font-semibold">
                              {badge.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Tabby Section */}
                  <div className="">
                    {currentcountry?.isTabbyRequired && (
                      <>
                        <div className="flex max-w-full overflow-hidden">
                          <img
                            src={"/assets/vector_icons/Tabby_web.png"}
                            alt="Tabby Offer"
                            className="flex-1 max-w-full cursor-pointer"
                            style={{ borderRadius: "12px" }}
                            onClick={() => dispatch(setsnplmodal(true))}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {bankofferdata?.plans?.length > 0 && (
                    <Bankoffermodal plans={bankofferdata?.plans} />
                  )}
                  {
                    <Snplmodal
                      productcost={
                        productDetail[0]?.display_price /
                        currentcountry?.emi_months
                      }
                    />
                  }

                  <div className="mt-4"></div>
                </div>
              </div>
            </div>
          ) : (
            /* Row -> flex flex-wrap, mt-3 -> mt-3 */
            <div className="flex flex-wrap mt-3">
              {/* Col lg={4} -> w-full lg:w-1/3 */}
              <div className="w-full lg:w-1/3">
                <div className="product_Detail_left_side">
                  <div
                    className="placeholder_color"
                    style={{ width: "100%", height: 450, borderRadius: 8 }}
                  />
                  {/* d-flex mt-3 -> flex mt-3 */}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4, 5].map((_i) => {
                      return (
                        <div
                          key={_i}
                          /* me-3 -> mr-3 */
                          className="placeholder_color mr-3"
                          style={{
                            width: "15%",
                            height: 100,
                            borderRadius: 8,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Col lg={8} -> w-full lg:w-2/3 */}
              <div className="w-full lg:w-2/3">
                <div className="product_Detail_right_side">
                  <div
                    className="placeholder_color"
                    style={{ width: "80%", height: 10, borderRadius: 5 }}
                  />
                  <div
                    /* mt-3 -> mt-3 */
                    className="placeholder_color mt-3"
                    style={{ width: "20%", height: 10, borderRadius: 5 }}
                  />
                  {/* d-block mt-5 -> block mt-5 */}
                  <div className="block mt-5">
                    {[1, 2, 3, 4, 5, 6].map((_i) => {
                      return (
                        <div
                          key={_i}
                          /* mt-3 -> mt-3 */
                          className="placeholder_color mt-3"
                          style={{
                            width: "50%",
                            height: 10,
                            borderRadius: 8,
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* d-flex mt-5 -> flex mt-5 */}
                  <div className="flex mt-5">
                    <div
                      /* me-3 -> mr-3 */
                      className="placeholder_color mr-3"
                      style={{ width: "15%", height: 10, borderRadius: 5 }}
                    />
                    <div
                      className="placeholder_color"
                      style={{ width: "8%", height: 10, borderRadius: 5 }}
                    />
                  </div>
                  {/* d-flex mt-3 -> flex mt-3 */}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4, 5].map((_i) => {
                      return (
                        <div
                          key={_i}
                          /* me-3 -> mr-3 */
                          className="placeholder_color mr-3"
                          style={{ width: 40, height: 40, borderRadius: 50 }}
                        />
                      );
                    })}
                  </div>
                  {/* d-flex mt-5 -> flex mt-5 */}
                  <div className="flex mt-5">
                    <div
                      /* me-3 -> mr-3 */
                      className="placeholder_color mr-3"
                      style={{ width: "15%", height: 10, borderRadius: 5 }}
                    />
                    <div
                      className="placeholder_color"
                      style={{ width: "8%", height: 10, borderRadius: 5 }}
                    />
                  </div>
                  {/* d-flex mt-3 -> flex mt-3 */}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4, 5].map((_i) => {
                      return (
                        <div
                          key={_i}
                          /* me-3 -> mr-3 */
                          className="placeholder_color mr-3"
                          style={{ width: 100, height: 40, borderRadius: 10 }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Specifications */}
          <div className={`${!isMobile ? "mt-8" : "mt-4"}`}>
            <div
              className={`${
                expanded ? "accordian_border1" : "accordian_border"
              } relative mb-4 ${expanded && "pb-12"} overflow-hidden`}
            >
              <div
                ref={headerRef}
                className="p-3 cursor-default flex justify-between items-center"
              >
                <span
                  /* fw-semibold -> font-semibold */
                  className="font-semibold"
                  style={{ fontFamily: "Outfit", fontSize: "18px" }}
                >
                  Product Specifications
                </span>
                <img
                  onClick={handleToggle}
                  src="/assets/downArrow.png"
                  alt="Arrow"
                  className={`w-4 h-4 cursor-pointer grayscale ${
                    expanded ? "rotate-180" : ""
                  } transition-transform`}
                />
              </div>

              <div className="bg-white px-3 py-4 max-h-[50vh] overflow-y-auto">
                <div className={`relative ${expanded && "pb-8"}`}>
                  {!expanded && (
                    <div
                      className="absolute left-0 bottom-0 h-20 w-full z-10 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(255,255,255,1),rgba(255,255,255,0.7), rgba(255,255,255,0.5), transparent)",
                      }}
                    />
                  )}

                  <div className="specification-main relative">
                    {expanded
                      ? productDetail[0]?.small_desc_data.map((ele, index) => (
                          /* Row -> flex flex-wrap */
                          <div
                            key={index}
                            className={`flex flex-wrap specificationdetails ${
                              index % 2 === 0
                                ? "evenbacground"
                                : "nooddbackground"
                            }`}
                          >
                            {/* Col lg={4} md={4} sm={6} xs={6} -> w-full lg:w-1/3 md:w-1/3 sm:w-1/2 */}
                            <div className="w-full lg:w-1/3 md:w-1/3 sm:w-1/2 specificationtitle">
                              {ele.title}
                            </div>
                            {/* Col lg={8} md={8} sm={6} xs={6} -> w-full lg:w-2/3 md:w-2/3 sm:w-1/2 */}
                            <div className="w-full lg:w-2/3 md:w-2/3 sm:w-1/2 specificationvalue">
                              {ele.value}
                            </div>
                          </div>
                        ))
                      : getCombinedPartial().map((item, index) =>
                          item.type === "react" ? (
                            /* Row -> flex flex-wrap */
                            <div
                              key={index}
                              className={`flex flex-wrap specificationdetails ${
                                index % 2 === 0
                                  ? "evenbacground"
                                  : "nooddbackground"
                              }`}
                            >
                              {/* Col mappings same as above */}
                              <div className="w-full lg:w-1/3 md:w-1/3 sm:w-1/2 specificationtitle">
                                {item.data.title}
                              </div>
                              <div className="w-full lg:w-2/3 md:w-2/3 sm:w-1/2 specificationvalue">
                                {item.data.value}
                              </div>
                            </div>
                          ) : (
                            <div
                              key={`html-${index}`}
                              dangerouslySetInnerHTML={{
                                /* table table-striped -> table table-auto, m-0 -> m-0 */
                                __html: `<table class="table table-auto m-0"><tbody>${item.data}</tbody></table>`,
                              }}
                            />
                          )
                        )}
                  </div>

                  <div className="product-spec-table mt-2">
                    <div
                      ref={wrapperRef}
                      style={{
                        maxHeight: expanded ? `${contentHeight}px` : "150px",
                        overflow: "hidden",
                        transition: "max-height 2s ease-in-out",
                      }}
                    >
                      <div ref={innerRef}>
                        {/* table-responsive -> overflow-x-auto */}
                        <div className="overflow-x-auto">
                          {/* table table-striped m-0 -> table table-auto m-0 */}
                          <table className="table table-auto m-0">
                            <tbody
                              dangerouslySetInnerHTML={{
                                __html: expanded ? cleanedDetails : "",
                              }}
                            />
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* mt-2 -> mt-2 */}
              <div className="text-center mt-2 absolute z-10 left-[50%] -translate-x-[50%] bottom-4">
                <span
                  onClick={handleToggle}
                  className="text-[#007bff] cursor-pointer font-medium font-outfit"
                >
                  {expanded ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">View Less</span>
                      <img
                        src="/assets/downArrow.png"
                        alt="Up Arrow"
                        className="w-4 h-4 rotate-180 mt-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">View More</span>
                      <img
                        src="/assets/downArrow.png"
                        alt="Down Arrow"
                        className="w-4 h-4 mt-1"
                      />
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* A+ content section */}
          {a_plus_images?.length > 0 && (
            <div className="flex flex-col pb-7 sm:pb-0">
              {a_plus_images?.map((i) => (
                <img className="w-full h-auto" src={i} alt="img" />
              ))}
            </div>
          )}

          {/* component to show when there are no ratings except the current user's pending review */}
          <div ref={reviewRef} id="review-rating-section">
            {allProductReviews?.data?.result?.length === 0 &&
              (!allProductReviews?.data?.userReview ||
                allProductReviews?.data?.userReview?.rstatus === 0) && (
                <ReviewNoRating
                  setProductReviews={setProductReviews}
                  productReviews={productReviews}
                  setAllProductReviews={setAllProductReviews}
                />
              )}
            {allProductReviews?.data?.stats?.averageRating > 0 && (
              <ReviewWithRating
                setProductReviews={setProductReviews}
                productReviews={productReviews}
                allProductReviews={allProductReviews}
                setAllProductReviews={setAllProductReviews}
              />
            )}
          </div>

          {/* Related Products */}
          {!loading1 ? (
            <div className="component_1 product_Detail_carousel_prod mt-5">
              {productDetail_products?.hasOwnProperty("related_products") && (
                <ComponentHeader
                  title={"Related Products"}
                  first_title={"Related"}
                  second_title={"PRODUCTS"}
                  first_string_color={"#000"}
                  second_string_color={null}
                  view_all={"rgba(82, 50, 194, 1)"}
                />
              )}
              {/* mt-3 -> mt-3 */}
              {isMobile && <div className="mt-3"></div>}
              <CarouselProducts
                products={productDetail_products?.related_products}
                type={1}
                inner_bg={"rgba(238, 235, 250, 1)"}
              />
            </div>
          ) : (
            /* mt-3 row -> mt-3 flex flex-wrap */
            <div className="mt-3 flex flex-wrap">
              {[1, 2, 3, 4, 5].map((product) => {
                return (
                  /* Col xxl={2} xl={2} lg={3} md={3} sm={6} xs={6} mb-4 -> w-full 2xl:w-1/6 xl:w-1/6 lg:w-1/4 md:w-1/4 sm:w-1/2 mb-4 */
                  <div
                    key={product}
                    className="w-full 2xl:w-1/6 xl:w-1/6 lg:w-1/4 md:w-1/4 sm:w-1/2 mb-4"
                  >
                    <ProductCardPlaceHolder />
                  </div>
                );
              })}
            </div>
          )}

          {/* Recently Viewed */}
          {!loading1 ? (
            /* mt-4 -> mt-4 */
            <div className="component_1 product_Detail_carousel_prod mt-4">
              {productDetail_products?.hasOwnProperty("recently_viewed") && (
                <ComponentHeader
                  title={"Recently viewed Products"}
                  first_title={"Recently"}
                  second_title={"viewed PRODUCTS"}
                  first_string_color={"#000"}
                  second_string_color={null}
                  view_all={"rgba(82, 50, 194, 1)"}
                />
              )}
              {/* mt-3 -> mt-3 */}
              {isMobile && <div className="mt-3"></div>}
              <CarouselProducts
                products={productDetail_products?.recently_viewed}
                type={1}
                inner_bg={"rgba(238, 235, 250, 1)"}
              />
            </div>
          ) : (
            /* mt-3 row -> mt-3 flex flex-wrap */
            <div className="mt-3 flex flex-wrap">
              {[1, 2, 3, 4, 5].map((product) => {
                return (
                  /* Same Col mapping as above */
                  <div
                    key={product}
                    className="w-full 2xl:w-1/6 xl:w-1/6 lg:w-1/4 md:w-1/4 sm:w-1/2 mb-4"
                  >
                    <ProductCardPlaceHolder />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!isMobile && (
          <CartModalDesktop
            show={showCartModalDesktop}
            onHide={() => setShowCartModalDesktop(false)}
            productData={productDetail[0]}
          />
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {!isTablet && (
        <div
          className={`fixed w-full bottom-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
            showCard
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <div className="flex justify-end pr-4 pb-1">
            <button
              className="bg-[#43494B] border-none text-white rounded-full p-2 flex items-center justify-center"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <FaChevronUp size={20} />
            </button>
          </div>
          <div className="backdrop-blur-3xl items-center shadow-[0_10px_25px_rgba(0,0,0,0.2)] gap-10 border border-gray-300 p-4 md:p-6 flex justify-between transition-transform duration-300 transform bg-white perspective-[1000px]">
            <div className="flex gap-4 max-w-[650px]">
              <div className="flex items-center gap-4">
                <img
                  src={product?.images?.[0]}
                  alt="product"
                  className="w-auto h-28 object-contain"
                />
                <p className="font-semibold text-base xl:text-lg hidden xl:block">
                  {product?.name}
                </p>
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-semibold text-base block xl:hidden">
                  {product?.name}
                </p>
                <div className="block xl:hidden">
                  <div className="product_Detail_price_container flex">
                    {/* d-flex align-items-center -> flex items-center */}
                    <div className="display_price flex items-center">
                      {/* fw-bold fs-5 d-flex align-items-center -> font-bold text-xl flex items-center */}
                      <span className="font-bold text-xl flex items-center">
                        {/* me-1 -> mr-1 */}
                        <span className="currency-symbol mr-1 !text-[22px]">
                          {currentcountry?.currency}
                        </span>
                        <span className="!text-[22px]">
                          {" "}
                          {product?.display_price}
                        </span>
                      </span>

                      {savedPrice > 0 && (
                        /* ms-2 px-3 py-2 d-flex align-items-center -> ml-2 px-3 py-2 flex items-center */
                        <div className="save-banner ml-2 px-3 py-2 flex items-center !font-medium">
                          {/* me-2 d-inline-flex align-items-center justify-content-center -> mr-2 inline-flex items-center justify-center */}
                          <span className="badge-icon mr-2 inline-flex items-center justify-center">
                            <img
                              src="/assets/vector_icons/Vector.png"
                              alt="%"
                              className="discount-icon"
                            />
                          </span>
                          <span className="text-sm text-nowrap">
                            You saved{" "}
                            <span className="currency-symbol !text-sm !xl:text-sm">
                              {currentcountry?.currency}{" "}
                            </span>
                            <span className="font-bold">
                              {Math.ceil(savedPrice)}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {product?.hasOwnProperty("old_price") && (
                    <div className="old_price">
                      <span className="text-base xl:text-lg">
                        {currentcountry.currency + " " + product?.old_price}
                      </span>
                      <div className="product_Detail_price_container">
                        <div className="display_percentage text-base xl:text-lg">
                          {product?.percentage + "% OFF"}
                        </div>
                      </div>
                      <p className="text-[#9EA5A8] mb-0 text-base xl:text-lg">
                        (Inc. of VAT)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden xl:block">
              <div className="product_Detail_price_container flex">
                {/* d-flex align-items-center -> flex items-center */}
                <div className="display_price flex items-center">
                  {/* fw-bold fs-5 d-flex align-items-center -> font-bold text-xl flex items-center */}
                  <span className="font-bold text-xl flex items-center">
                    {/* me-1 -> mr-1 */}
                    <span className="currency-symbol mr-1 text-base xl:!text-[22px]">
                      {currentcountry?.currency}
                    </span>
                    <span className="text-base xl:text-[22px]">
                      {" "}
                      {product?.display_price}
                    </span>
                  </span>

                  {savedPrice > 0 && (
                    /* ms-2 px-3 py-2 d-flex align-items-center -> ml-2 px-3 py-2 flex items-center */
                    <div className="save-banner ml-2 px-3 py-2 flex items-center !font-medium">
                      {/* me-2 d-inline-flex align-items-center justify-content-center -> mr-2 inline-flex items-center justify-center */}
                      <span className="badge-icon mr-2 inline-flex items-center justify-center">
                        <img
                          src="/assets/vector_icons/Vector.png"
                          alt="%"
                          className="discount-icon"
                        />
                      </span>
                      <span className="text-sm text-nowrap">
                        You saved{" "}
                        <span className="currency-symbol !text-sm !xl:text-sm">
                          {currentcountry?.currency}{" "}
                        </span>
                        <span className="font-bold">
                          {Math.ceil(savedPrice)}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {product?.hasOwnProperty("old_price") && (
                <div className="old_price">
                  <span className="text-base xl:text-lg">
                    {currentcountry.currency + " " + product?.old_price}
                  </span>
                  <div className="product_Detail_price_container">
                    <div className="display_percentage text-base xl:text-lg">
                      {product?.percentage + "% OFF"}
                    </div>
                  </div>
                  <p className="text-[#9EA5A8] mb-0 text-base xl:text-lg">
                    (Inc. of VAT)
                  </p>
                </div>
              )}
            </div>

            {product?.stock === "In stock" && product?.display_price > 0 ? (
              <>
                <div className="flex w-28 flex-col gap-4">
                  {product?.stock === "In stock" &&
                    product?.display_price > 0 && (
                      <div className="flex items-center justify-between gap-2 border py-[.4rem] rounded-lg px-4 text-lg">
                        <button
                          disabled={qty <= 1}
                          className="flex-1 border-none bg-transparent flex items-center justify-center px-0"
                        >
                          <FiMinus
                            className={`cursor-pointer ${
                              qty == 1 &&
                              "text-[#ddd9d9] text-opacity-50 !cursor-default"
                            }`}
                            onClick={() => handleChangeQty("dec")}
                          />
                        </button>
                        <div className="font-semibold flex-1 text-center">
                          {qty}
                        </div>
                        <button className="border-none flex-1 bg-transparent flex items-center justify-center px-0">
                          <FiPlus onClick={() => handleChangeQty("inc")} />
                        </button>
                      </div>
                    )}
                </div>
                <div className="grid gap-3 items-center select-none flex-grow-1 max-w-[275px]">
                  <button
                    className="w-full bg-[#5232C2] uppercase whitespace-nowrap rounded-lg px-4 py-3 text-white items-center flex justify-center flex-1 gap-2 border-none font-semibold"
                    onClick={handleClick}
                  >
                    <img
                      src={"/assets/vector_icons/cart_icon.svg"}
                      alt={"cart"}
                    />
                    Add to cart
                    {isLoading && (
                      /* ms-3 -> ml-3 */
                      <ClipLoader className="ml-3" size={16} color={"#fff"} />
                    )}
                  </button>
                  <button
                    onClick={() => handleBuyNow(product?.id, qty, product.sku)}
                    /* fw-bold -> font-bold, overflow-hidden stays */
                    className="whitespace-nowrap flex-1 border-none rounded-lg py-3 !bg-[#FFD100] text-[#191B1C] font-bold flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <img
                      src="/assets/vector_icons/buy_now_flash_.gif"
                      alt="flash"
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                    />
                    <span>BUY NOW</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid justify-center items-center">
                <div className="producrdetailnotifybtn mt-3 uppercase !text-base">
                  Notify me
                  {isLoading && (
                    /* ms-3 -> ml-3 */
                    <ClipLoader className="ml-3" size={16} color={"#fff"} />
                  )}
                </div>
                <div className="productdetail-notifystatus">
                  Get notified when this item comes back in stock.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailClient;
