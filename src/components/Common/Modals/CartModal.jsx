import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const CartModal = ({ show, onHide, productData, quantity, onBuyNow }) => {
  const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [savedPrice, setSavedPrice] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  useEffect(() => {
    const offData = productData?.old_price * (productData.percentage / 100);
    setSavedPrice(offData ? offData.toFixed(2) : 0);
  }, [productData]);
  if (!show) return null;
  return (
    <Container fluid className="pb-3 homepagecontainer">
      <div className="modal-backdrop-custom" onClick={onHide}></div>
      <div className="modal-custom-wrapper">
        <div className="modal-custom-content">
          <div className="modal-custom-body pb-4">
            <div className="cart-item gap-3">
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={productData.image}
                  alt={productData.name}
                  className="cart-item-image"
                  style={{
                    width: "100px", // adjust as needed
                    height: "100px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <img
                  src="/assets/vector_icons/successfull.gif"
                  alt="Success Check"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-5px",
                    width: "28px",
                    height: "28px",
                  }}
                />
              </div>

              <div className="cart-item-info">
                <span className="item-name  flex-1" style={{ fontWeight: 500 }}>
                  {productData.name.split(" ").length > 12
                    ? productData?.name.split(" ").slice(0, 12).join(" ") +
                      "..."
                    : productData.name}
                </span>
                <div
                  className="item-price fw-semibold py-1"
                  style={{ fontFamily: "Outfit", fontSize: "16px" }}
                >
                  <div className="d-flex align-items-center">
                    <span>{currentcountry?.currency}&nbsp;</span>
                    <span className="" style={{ fontWeight: 600 }}>
                      {productData.display_price * quantity}&nbsp;
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 ">
                    <span
                      className="text-muted text-decoration-line-through "
                      style={{
                        fontWeight: 400,
                        color: "#9EA5A8",
                        fontSize: "13px",
                      }}
                    >
                      <span className="text-[16px]">
                        {currentcountry?.currency}
                      </span>{" "}
                      {Math.ceil(productData?.old_price * quantity)}
                    </span>
                    {savedPrice > 0 && (
                      <div className="save-cartModal d-flex align-items-center justify-content-center px-2 gap-0">
                        <div className="py-2 d-flex align-items-center">
                          <span className="badge-icon d-inline-flex align-items-center justify-content-center">
                            <img
                              src="/assets/vector_icons/Vector.png"
                              alt="%"
                              width={13}
                              height={13}
                            />
                          </span>
                          <span
                            style={{
                              fontFamily: "Outfit",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            You saved{" "}
                            <span
                              style={{
                                fontFamily: "Outfit",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {currentcountry.currency}{" "}
                              {Math.ceil(savedPrice * quantity)}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-item-center gap-2">
                  <div
                    className="item-qty small border fw-semibold rounded-pill px-3 py-1 "
                    style={{ fontFamily: "Outfit", fontSize: "10px" }}
                  >
                    Qty. {quantity}
                  </div>{" "}
                  <span
                    className="text-success"
                    style={{ fontFamily: "Outfit" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-custom-footer d-flex gap-1 align-items-center">
            <div className="w-50">
              <button
                className="btn w-full h-12 rounded-xl  bg-white text-black font-semibold"
                onClick={onHide}
                style={{
                  fontFamily: "Outfit",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "140%",
                  border: "2px solid #ccc",
                  borderRadius: "12px",
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
            {/* <div className="w-50">
                            <button className="btn w-full h-12  ">Continue</button>
                        </div> */}

            <div className="w-50">
              <button
                onClick={() => onBuyNow(productData.id, quantity)}
                className="w-full bg-[#5232C2] border-none uppercase select-none relative inline-flex items-center justify-center h-12 rounded-xl font-medium text-white overflow-hidden hover:rotate-[-1deg] hover:shadow-[-4px_4px_0_#1c1c1c] transition-all ease-in-out"
              >
                <span
                  className="z-10  whitespace-nowrap font-semibold"
                  style={{ fontSize: "14px", fontFamily: "Outfit" }}
                >
                  Checkout Now
                </span>
                <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
                  <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                  <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-[#8c70ff] opacity-60 skew-y-12"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartModal;
