"use client";
import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CartModal from "./Modals/CartModal";

const StickyActionBar = ({
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
  onBuyNow,
  productData,
}) => {
  const [stage, setStage] = useState("idle");
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 1 full screen height
      setShowBackToTopButton(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const [showAddedToCartGif, setShowAddedToCartGif] = useState(false);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    setCartData(cartlistdata?.data?.result);
  }, [cartlistdata]);

  useEffect(() => {
    if (
      productData?.sku &&
      cartData?.some((item) => item.sku === productData.sku)
    ) {
      setShowAddedToCartGif(true);
    } else {
      setShowAddedToCartGif(false); // Optional: reset if not in cart
    }
  }, [cartData, productData?.sku]);

  const handleAddToCart = () => {
    onAddToCart();
    setStage("expanded");

    setTimeout(() => {
      setStage(""); // clear stage to force reflow
      requestAnimationFrame(() => setStage("slideLeft"));
    }, 500);

    setTimeout(() => setStage("slideRight"), 800);
    setTimeout(() => setStage("reset"), 1600);
    setTimeout(() => {
      setStage("idle");
      setShowCartModal(true);
      setShowAddedToCartGif(true);
    }, 2100);
  };

  const handleBuyNow = () => {
    onBuyNow(productData.id, quantity, productData.sku);
  };

  return (
    <>
      <style>
        {`
          @keyframes cartExpand {
            from {
              width: 48px;
              padding: 0;
              flex-grow: 0;
            }
            to {
              width: 100%;
              padding: 0 16px;
              flex-grow: 1;
            }
          }

          @keyframes iconSlideLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-10px);
            }
          }

          @keyframes slideOutRight {
            0% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(120%);
              opacity: 0;
            }
          }

          .expand-animation {
            animation: cartExpand 0.5s ease forwards;
          }
          .icon-slide-left {
            will-change: transform;
            animation: iconSlideLeft 0.3s ease forwards;
            position: relative;
          }
          .slide-out {
            animation: slideOutRight 0.8s ease forwards;
          }
          @keyframes gradientExpand {
            0% {
              background-size: 100% 100%;
              background-position: left;
            }
            100% {
              background-size: 400% 100%;
              background-position: left;
            }
          }
          .gradient-expand {
            animation: gradientExpand 0.8s ease forwards;
          }
        `}
      </style>

      {/* Back to Top Button */}
      {showBackToTopButton && (
        <div className="fixed bottom-[75px] left-1/2 transform -translate-x-1/2 z-[1000]">
          <button
            className="bg-[#43494B] border-0 text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-600 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll back to top of page"
          >
            <span className="whitespace-nowrap">Back to Top</span>
            <FaChevronUp size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Sticky Action Bar */}
      <div
        className="fixed w-full bottom-0 left-0 right-0 bg-white px-3 pt-2 pb-2 shadow-lg flex items-center justify-between z-[999] border-t border-gray-200"
        role="toolbar"
        aria-label="Product actions"
      >
        {productData?.stock === "In stock" && productData?.display_price > 0 ? (
          <>
            {/* Quantity Selector */}
            <div
              className="flex items-center justify-center border rounded-xl px-2 py-2"
              role="group"
              aria-label="Product quantity"
            >
              <button
                onClick={onDecrease}
                className="p-1 border-0 bg-transparent flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                type="button"
              >
                <FiMinus
                  className={`text-2xl ${
                    quantity > 1 ? "text-black" : "text-gray-400"
                  }`}
                  aria-hidden="true"
                />
              </button>

              <span
                className="mx-2 font-semibold flex items-center justify-center min-w-[40px]"
                aria-live="polite"
                aria-label={`Current quantity: ${quantity}`}
              >
                {quantity}
              </span>

              <button
                onClick={onIncrease}
                className="p-1 border-0 bg-transparent flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                disabled={quantity === productData?.quantity}
                aria-label="Increase quantity"
                type="button"
              >
                <IoMdAdd className="text-2xl" aria-hidden="true" />
              </button>
            </div>

            {/* Cart Button */}
            <div
              className="relative"
              style={{
                marginRight: "10px",
                width: stage === "idle" || stage === "reset" ? "48px" : "100%",
                flexGrow: stage === "idle" || stage === "reset" ? 0 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-start overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  stage === "expanded" ? "expand-animation" : ""
                } ${stage === "slideRight" ? "gradient-expand" : ""}`}
                style={{
                  width:
                    stage === "idle" || stage === "reset" ? "48px" : "100%",
                  height: "48px",
                  background:
                    stage === "idle" || stage === "reset"
                      ? "#5232C2"
                      : `linear-gradient(120deg, #4429A6 30%, #5232C2 30%)`,
                  borderRadius: "12px",
                  marginLeft: "10px",
                  color: "white",
                  padding: stage === "idle" || stage === "reset" ? 0 : "0 16px",
                  flexGrow: stage === "idle" || stage === "reset" ? 0 : 1,
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "all 0.3s ease",
                  border: "none",
                }}
                aria-label={
                  showAddedToCartGif ? "Added to cart" : "Add to cart"
                }
                type="button"
              >
                <div
                  className={`flex items-center ${
                    stage === "slideRight" ? "slide-out" : ""
                  }`}
                  style={{
                    transition: "transform 0.3s ease",
                    width: "100%",
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className={`flex items-center justify-center ${
                      stage === "slideLeft" ? "icon-slide-left" : ""
                    }`}
                    style={{
                      willChange: "transform",
                      width: "48px",
                      height: "48px",
                      transition: "all 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        showAddedToCartGif
                          ? "/assets/vector_icons/added_to_cart_gif.gif"
                          : "/assets/vector_icons/cart_icon.svg"
                      }
                      alt=""
                      aria-hidden="true"
                      style={{
                        width: showAddedToCartGif ? "42px" : "20px",
                        height: showAddedToCartGif ? "42px" : "20px",
                        objectFit: showAddedToCartGif ? "" : "contain",
                      }}
                    />
                  </div>

                  {/* Add to Cart Text */}
                  {["expanded", "slideLeft", "slideRight"].includes(stage) && (
                    <div
                      className="flex items-center pl-2"
                      style={{ height: "48px" }}
                    >
                      <span className="font-semibold whitespace-nowrap">
                        Add to Cart
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Plus Icon Overlay */}
              {stage === "idle" && !showAddedToCartGif && (
                <div
                  className="absolute -top-1 -right-5 w-[22px] h-[22px] bg-white text-lg rounded-full flex items-center justify-center font-bold leading-none"
                  aria-hidden="true"
                >
                  <span className="text-primary">
                    <FiPlus />
                  </span>
                </div>
              )}
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="font-bold flex items-center justify-center gap-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 hover:bg-yellow-300 transition-colors"
              style={{
                backgroundColor: "#FFD100",
                color: "#000",
                borderRadius: "12px",
                padding:
                  stage === "idle" || stage === "reset" ? "12px 24px" : "0",
                marginLeft: "10px",
                flexGrow: stage === "idle" || stage === "reset" ? 1 : 0,
                width: stage === "idle" || stage === "reset" ? "auto" : "80px",
                height: "48px",
                transition: "all 0.3s ease",
                border: "none",
              }}
              aria-label="Buy now - proceed to checkout"
              type="button"
            >
              <img
                src="/assets/vector_icons/buy_now_flash_.gif"
                alt=""
                aria-hidden="true"
                style={{
                  width: "20px",
                  height: "20px",
                  objectFit: "contain",
                }}
              />
              {(stage === "idle" || stage === "reset") && (
                <span className="ml-2 whitespace-nowrap">BUY NOW</span>
              )}
            </button>
          </>
        ) : (
          <div className="w-full py-1">
            <div className="w-full">
              <button
                className="producrdetailnotifybtn w-full uppercase border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Get notified when product is back in stock"
                type="button"
              >
                Notify me
              </button>
            </div>
          </div>
        )}
      </div>

      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        productData={productData}
        quantity={quantity}
        onBuyNow={onBuyNow}
      />
    </>
  );
};

export default StickyActionBar;
