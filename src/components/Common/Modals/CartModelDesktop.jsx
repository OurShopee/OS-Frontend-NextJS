import { animate, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import deleteimg from "../../../images/Delete.png";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetPlaceOrderapi, setpaymentmethodsdata } from "../../../redux/paymentslice";
import { CalculatePaymentDetails } from "../../utils/Cart";
import { cartlistWithoutLoaderapi, changeCartQuantityapi, removeFromCartapi } from "../../../redux/cartslice";
import { setformmodal, setformstatus } from "../../../redux/formslice";
import AlertModal from "../AlertModal";
import OdometerCounter from "../../OdometerCounter";

const CartModalDesktop = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const debounceTimers = useRef({});
    const [cartQuantities, setCartQuantities] = useState({});
    const cartlistdata = useSelector((state) => state.cartslice.cartlistdata);
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const formmodal = useSelector(state => state.globalslice.formmodal);
    const addresslistdata = useSelector(state => state.addresslice.addresslistdata);
    const paymentmethodsdata = useSelector((state) => state.paymentslice.paymentmethodsdata);
    const logindata = useSelector((state) => state.formslice.logindata);

    const [showGif, setShowGif] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState({});
    const prevTotalSavings = useRef(0); // Track previous totalSavings

    const cartItems = useMemo(() => {
        const result = cartlistdata?.data?.result;
        return Array.isArray(result) ? result : [];
    }, [cartlistdata]);
    const totalSavings = useMemo(() => {
        const rawSavings = cartItems?.reduce((sum, item) => {
            const oldTotal = item.old_price * item.quantity;
            const currentTotal = item.single_price * item.quantity;
            return sum + (oldTotal - currentTotal);
        }, 0);
        return parseFloat(rawSavings.toFixed(2));
    }, [cartItems]);

    const totalOld = useMemo(() => {
        const rawSavings = cartItems.reduce((sum, item) => {
            const oldTotal = item.old_price * item.quantity;
            return sum + oldTotal;
        }, 0);
        return parseFloat(rawSavings.toFixed(2));
    }, [cartItems]);

    const [animatedValue, setAnimatedValue] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const start = Math.max(0, totalSavings - 5);
        const controls = animate(start, totalSavings, {
            duration: 1.5,
            onUpdate(value) {
                setAnimatedValue(value);

                // Only show GIF if savings increased
                if (
                    Math.abs(value - totalSavings) < 0.01 &&
                    totalSavings > prevTotalSavings.current
                ) {
                    setShowGif(true);
                    setTimeout(() => setShowGif(false), 2000);
                    prevTotalSavings.current = totalSavings;
                } else if (Math.abs(value - totalSavings) < 0.01) {

                    prevTotalSavings.current = totalSavings;
                }
            },
        });

        return () => controls.stop();
    }, [totalSavings]);


    useEffect(() => {
        const rounded = parseFloat(animatedValue.toFixed(2));
        setDisplayValue(rounded);
    }, [animatedValue]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [show]);

    useEffect(() => {
        if (cartlistdata?.data?.result?.length) {
            const initialQuantities = {};
            cartlistdata.data.result.forEach((item) => {
                initialQuantities[item.cart_id] = item.quantity;
            });
            setCartQuantities(initialQuantities);
        } else {
            onHide();
        }
    }, [cartlistdata]);

    const handleQuantityChange = (cart_id, newQty) => {
        if (cartlistdata.data.result.find(ele => ele.cart_id === cart_id).available_quantity < newQty) {
            toast.warning("You've reached the maximum quantity available");
            return;
        }
        if (newQty < 1) return;

        setCartQuantities((prev) => ({ ...prev, [cart_id]: newQty }));
        dispatch(setpaymentmethodsdata({
            ...paymentmethodsdata,
            "sub_total": currentcountry.currency + " " + CalculatePaymentDetails(cartlistdata, { ...cartQuantities, [cart_id]: newQty }),
            "final_total": CalculatePaymentDetails(cartlistdata, { ...cartQuantities, [cart_id]: newQty }),
        }))

        if (debounceTimers.current[cart_id]) {
            clearTimeout(debounceTimers.current[cart_id]);
        }

        debounceTimers.current[cart_id] = setTimeout(() => {
            dispatch(changeCartQuantityapi({ cart_id, quantity: newQty }))

                .unwrap()
                .then(() => {
                    const input_data = {
                        ip_address: Cookies.get("jwt_token") !== undefined ? 0 : Cookies.get("cart_ip_address"),
                        user_id: logindata.user_id,
                    };
                    dispatch(cartlistWithoutLoaderapi(input_data));
                    if (Cookies.get("jwt_token") !== undefined) {
                        dispatch(GetPlaceOrderapi(logindata.user_id));
                    }
                })
                .catch((err) => {
                });
        }, 500);
    };

    const openAlertModel = (item) => {
        setDeletingProduct(item)
        setShowAlert(true);
    }

    const removeproduct = async (cart_id) => {
        try {
            await dispatch(removeFromCartapi({ cart_id })).unwrap();
            setShowAlert(false);
            setDeletingProduct({})
            const input_data = {
                ip_address: Cookies.get("jwt_token") !== undefined ? 0 : Cookies.get("cart_ip_address"),
                user_id: logindata.user_id,
            };
            dispatch(cartlistWithoutLoaderapi(input_data));
            if (Cookies.get("jwt_token")) {
                dispatch(GetPlaceOrderapi(logindata.user_id));
            }
        } catch (error) {
        }
    };

    const handleCheckoutNow = () => {
        if (!Cookies.get("jwt_token")) {
            dispatch(setformmodal(!formmodal))
            dispatch(setformstatus(1))
        } else {
            if (addresslistdata?.data?.length > 0) {
                navigate('/Payment')
            } else {
                navigate('/deliveryaddress')
            }
        }
    }

    const navigateToProduct = (url, sku) => {
        navigate(`/details/${url}/${sku}`);
        onHide()
    }

    if (!show) return null
    return (
        <>
            {show && <div className="modal-backdrop-custom" onClick={onHide}></div>}
            <div className={`modal-custom-wrapper-desktop tw-fixed tw-top-0 tw-right-0 tw-h-screen tw-w-[25vw] tw-z-[1050] ${show ? "modal-slide-in" : "modal-slide-out"}`}>
                <div className="tw-flex tw-flex-col tw-h-full tw-bg-white tw-rounded-l-xl">
                    <div className="tw-flex-1 tw-overflow-y-auto tw-py-4 tw-pt-0 tw-px-4">
                        <div className="tw-sticky tw-py-4 tw-top-0 tw-z-20 tw-bg-white tw-border-b tw-flex tw-justify-between tw-items-center tw-select-none">
                            <h5 className="tw-flex tw-items-center tw-gap-1 tw-text-[#43494B] tw-mb-0">
                                <span className="tw-font-[700] tw-text-[24px]">In Cart</span>{" "}
                                <span className="tw-text-[19px] tw-font-[600]">({cartItems.length})</span>
                            </h5>
                            <IoClose onClick={onHide} className="tw-text-3xl tw-cursor-pointer tw-text-[#43494B]" />
                        </div>

                        <div className="tw-flex-1 tw-overflow-y-auto tw-p-0">
                            {cartItems.length > 0 ? (
                                cartItems.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <div className="tw-flex tw-items-center tw-gap-3">
                                            <img onClick={() => navigateToProduct(item.url, item.sku)} src={item.image} alt={item.name} className="tw-cursor-pointer tw-object-contain tw-w-[25%] tw-h-max" />
                                            <div className="cart-item-info">
                                                <span onClick={() => navigateToProduct(item.url, item.sku)} className="tw-cursor-pointer item-name fw-semibold flex-1">
                                                    {item.name.split(" ").length > 15
                                                        ? item.name.split(" ").slice(0, 15).join(" ") + "..."
                                                        : item.name}
                                                </span>
                                                <div className="d-flex justify-content-between tw-my-2 tw-select-none">
                                                    <div className="tw-flex tw-items-center tw-justify-center border tw-rounded-lg tw-gap-3 !tw-p-1">
                                                        {cartQuantities[item.cart_id] === 1 ? (
                                                            <img
                                                                src={deleteimg}
                                                                alt="delete"
                                                                className="tw-cursor-pointer"
                                                                onClick={() => openAlertModel(item)}
                                                            />
                                                        ) : (
                                                            <FiMinus
                                                                className="tw-cursor-pointer"
                                                                onClick={() => handleQuantityChange(item.cart_id, cartQuantities[item.cart_id] - 1)}
                                                            />
                                                        )}

                                                        <div>{cartQuantities[item.cart_id]}</div>

                                                        <FiPlus
                                                            className="tw-cursor-pointer"
                                                            onClick={() => handleQuantityChange(item.cart_id, cartQuantities[item.cart_id] + 1)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tw-text-lg tw-font-semibold">
                                                    <span>{currentcountry?.currency} {(item.single_price * item.quantity).toFixed(2)}</span>

                                                    <span className="tw-text-sm tw-font-semibold tw-mx-1 tw-text-[#33B056]">
                                                        {item.percentage}% OFF
                                                    </span>
                                                    <div className="tw-text-sm tw-line-through tw-text-[#9EA5A8]">
                                                        AED {(item.old_price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {i !== cartItems.length - 1 && <div className="border-gray tw-my-6 "></div>}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="text-center py-4">Your cart is empty.</div>
                            )}
                        </div>
                    </div>

                    <div className="tw-pb-4 tw-shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] tw-relative">
                        <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-bg-white tw-font-semibold">
                            <p className="tw-mb-0 tw-capitalize">total cart value</p>
                            <div className="tw-flex tw-items-center tw-gap-1">
                                <p className="tw-mb-0 tw-text-sm tw-line-through tw-text-[#9EA5A8]">AED {totalOld}</p>
                                <p className="tw-mb-0">{cartlistdata?.data?.grand_total}</p>
                            </div>
                        </div>
                        <div
                            style={{ backgroundImage: "url('/assets/vector_icons/cart_sidebar_wave.svg')" }}
                            className="tw-relative tw-select-none tw-flex tw-justify-between tw-px-4 tw-text-[#33B056] tw-items-center tw-bg-no-repeat tw-bg-cover tw-bg-top tw-w-full tw-h-16 tw-overflow-hidden"
                        >
                            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-8 tw-bg-gradient-to-b tw-from-transparent tw-to-white/80"></div>
                            <div className="tw-flex tw-items-center tw-gap-1">
                                <RiDiscountPercentFill className="tw-text-2xl" />
                                <p className="tw-mb-0 tw-font-semibold tw-capitalize">Your total savings</p>
                            </div>
                            <div className="tw-font-semibold tw-text-lg tw-flex tw-items-center tw-gap-1 tw-h-6">
                                <span className="tw-text-[1.125rem] tw-text-lg">{currentcountry?.currency}</span>
                                <OdometerCounter value={totalSavings} duration={1500} format="(ddd)" />
                            </div>
                        </div>

                        <div className="tw-px-4">
                            <button onClick={() => handleCheckoutNow()} className="hover:tw-text-lg tw-bg-[#5232C2] tw-border-none tw-select-none tw-mt-3 tw-w-full tw-relative tw-inline-flex tw-items-center tw-justify-center tw-h-12 tw-px-6 tw-rounded-xl tw-font-medium tw-text-white tw-overflow-hidden hover:tw-rotate-[-1deg] hover:tw-shadow-[-4px_4px_0_#1c1c1c] tw-transition-all tw-ease-in-out">
                                <span className="tw-z-10 tw-uppercase tw-font-semibold">Checkout now</span>
                                <div className="tw-absolute tw-inset-0 tw-pointer-events-none tw-flex tw-gap-2 tw-justify-center tw-items-center shimmer-overlay">
                                    <div className="tw-h-20 tw-w-10 tw-bg-gradient-to-tr tw-from-transparent tw-to-[#8c70ff] tw-opacity-60 tw-skew-y-12"></div>
                                    <div className="tw-h-20 tw-w-3 tw-bg-gradient-to-tr tw-from-transparent tw-to-[#8c70ff] tw-opacity-60 tw-skew-y-12"></div>
                                </div>
                            </button>
                        </div>
                        {showGif && (
                            <img
                                className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-contain tw-bottom-0"
                                src="/assets/animation.gif"
                                alt="animation"
                            />
                        )}
                    </div>
                </div>
            </div>
            <AlertModal show={showAlert} setShow={setShowAlert} title="Remove Item" message="Are you sure you want to remove this item from the cart?" action={removeproduct} product={deletingProduct} />
        </>
    );
};

export default CartModalDesktop;
