import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const CartModal = ({ show, onHide, productData, quantity, onBuyNow }) => {
    const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const [savedPrice, setSavedPrice] = useState(0);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const navigate = useNavigate()
    useEffect(() => {
        const offData = productData?.old_price * (productData.percentage / 100)
        setSavedPrice(offData ? offData.toFixed(2) : 0);
    }, [productData])
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
                                        objectFit: "cover"
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
                                        height: "28px"
                                    }}
                                />
                            </div>

                            <div className="cart-item-info">
                                <span className="item-name  flex-1" style={{ fontWeight: 500 }}>
                                    {productData.name.split(" ").length > 12
                                        ? productData?.name.split(" ").slice(0, 12).join(" ") + "..."
                                        : productData.name}
                                </span>
                                <div
                                    className="item-price fw-semibold py-1"
                                    style={{ fontFamily: "Outfit", fontSize: "16px" }}
                                >
                                    <div className="d-flex align-items-center">
                                        <span>{currentcountry?.currency}&nbsp;</span>
                                        <span className="" style={{ fontWeight: 600 }}>{productData.display_price * quantity}&nbsp;</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 ">
                                        <span className="text-muted text-decoration-line-through " style={{ fontWeight: 400, color: "#9EA5A8", fontSize: "13px" }}>
                                            <span className="tw-text-[16px]">{currentcountry?.currency}</span>  {Math.ceil(productData?.old_price *quantity)}
                                        </span>
                                        {savedPrice > 0 && (
                                            <div className="save-cartModal d-flex align-items-center justify-content-center px-2 gap-0" >
                                                <div className="py-2 d-flex align-items-center">
                                                    <span className="badge-icon d-inline-flex align-items-center justify-content-center">
                                                        <img src="/assets/vector_icons/Vector.png" alt="%" width={13} height={13} />
                                                    </span>
                                                    <span style={{ fontFamily: "Outfit", fontSize: "12px", fontWeight: "500" }}>
                                                        You saved <span style={{ fontFamily: "Outfit", fontSize: "12px", fontWeight: "600" }}>{currentcountry.currency} {Math.ceil(savedPrice * quantity)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex align-item-center gap-2">

                                    <div className="item-qty small border fw-semibold rounded-pill px-3 py-1 " style={{ fontFamily: "Outfit", fontSize: "10px" }}>Qty. {quantity}</div> <span className="text-success" style={{ fontFamily: "Outfit" }}></span>


                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Footer */}
                    <div className="modal-custom-footer d-flex gap-1 align-items-center">
                        <div className="w-50">
                            <button
                                className="btn tw-w-full tw-h-12 tw-rounded-xl  tw-bg-white tw-text-black tw-font-semibold"
                                onClick={onHide}
                                style={{
                                    fontFamily: "Outfit",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    lineHeight: "140%",
                                    border:"2px solid #ccc",
                                    borderRadius:"12px"
                                }}
                            >
                                CONTINUE SHOPPING
                            </button>
                        </div>
                        {/* <div className="w-50">
                            <button className="btn tw-w-full tw-h-12  ">Continue</button>
                        </div> */}

                        
                        <div className="w-50">
                            <button
                                onClick={() => onBuyNow(productData.id, quantity)}
                                className="tw-w-full tw-bg-[#5232C2] tw-border-none tw-uppercase tw-select-none tw-relative tw-inline-flex tw-items-center tw-justify-center tw-h-12 tw-rounded-xl tw-font-medium tw-text-white tw-overflow-hidden hover:tw-rotate-[-1deg] hover:tw-shadow-[-4px_4px_0_#1c1c1c] tw-transition-all tw-ease-in-out"
                            >
                                <span className="tw-z-10  tw-whitespace-nowrap tw-font-semibold" style={{ fontSize: "14px", fontFamily: "Outfit" }}>Checkout Now</span>
                                <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-flex tw-gap-2 tw-justify-center tw-items-center shimmer-overlay">
                                    <div className="tw-h-20 tw-w-10 tw-bg-gradient-to-tr tw-from-transparent tw-to-[#8c70ff] tw-opacity-60 tw-skew-y-12"></div>
                                    <div className="tw-h-20 tw-w-3 tw-bg-gradient-to-tr tw-from-transparent tw-to-[#8c70ff] tw-opacity-60 tw-skew-y-12"></div>
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
