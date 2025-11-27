import { getAreasApi, getLocationsApi } from "@/api/others";
import { availableCoupons, getFeedPlaceOrder } from "@/api/payments";
import { useContent, useCurrentLanguage } from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

import LocateMe from "@/components/LocateMe";
import OdometerCounter from "@/components/OdometerCounter";
import { getAssetsUrl } from "@/components/utils/helpers";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { setselecteddefaultpaymentmethod } from "@/redux/paymentslice";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { AiOutlineEdit } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { IoCaretDownOutline } from "react-icons/io5";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import CheckCoupan from "../CheckCoupan";
import Donation from "../Donation";

const PayNowFinal = ({
  onPayNow = () => {},
  onUpdateFormData = () => {},
  formData = {},
  product = {},
  qty = 1,
  sku = "",
}) => {
  const {
    form_name = "",
    contact_no = "",
    location = "",
    area = "",
    delivery_address = "",
    latitude = "",
    longitude = "",
  } = formData;

  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [addressForm, setAddressForm] = useState({
    location: location || "",
    area: area || "",
    delivery_address: delivery_address || "",
  });
  const [addressError, setAddressError] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [availableCoupon, setAvailableCoupon] = useState([]);
  const [feddData, setFeddData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const currentLanguage = useCurrentLanguage();
  const [feedData, setFeedData] = useState(null);
  const yourTotalSavings = useContent("product.yourTotalSavings");
  const donationfee = useSelector((state) => state.paymentslice.donationfee);
  const coupon = useSelector((state) => state.paymentslice.coupon);
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [paymentOptions, setPaymentOptions] = useState([]);
  const dispatch = useDispatch();
  const selecteddefaultpaymentmethod = useSelector(
    (state) => state.paymentslice.selecteddefaultpaymentmethod
  );
  const {
    location: geoLocation,
    setLocation,
    addressData,
    setAddress,
    handleLocateme,
    isLocating,
    geoError,
    handleDragEnd,
  } = useCurrentLocation({ address_header: 1 });
  const [mapCenter, setMapCenter] = useState(null);
  const mapRef = useRef(null);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );

  useEffect(() => {
    if (geoLocation?.lat && geoLocation?.lng) {
      setMapCenter({
        lat: Number(geoLocation.lat),
        lng: Number(geoLocation.lng),
      });
    }
  }, [geoLocation]);

  const selectedLocationLabel = useMemo(() => {
    const match = locations.find((loc) => String(loc.id) === String(location));
    return match?.name || location || "";
  }, [locations, location]);

  const selectedAreaLabel = useMemo(() => {
    const match = areas.find((item) => String(item.id) === String(area));
    return match?.name || area || "";
  }, [areas, area]);

  useEffect(() => {
    setAddressForm({
      location: location || "",
      area: area || "",
      delivery_address: delivery_address || "",
    });
  }, [location, area, delivery_address]);

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({
        lat: Number(latitude),
        lng: Number(longitude),
      });
    }
  }, [latitude, longitude, setLocation]);

  useEffect(() => {
    if (delivery_address) {
      setAddress(delivery_address);
    }
  }, [delivery_address, setAddress]);

  useEffect(() => {
    if (addressData && typeof addressData === "string") {
      setAddressForm((prev) => ({
        ...prev,
        delivery_address: addressData,
      }));
    }
  }, [addressData]);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const data = await getLocationsApi();
        if (data?.status === 200 && Array.isArray(data.data?.data)) {
          setLocations(data.data?.data);
        } else {
          console.error("Invalid locations response", data);
        }
      } catch (error) {
        console.error("Error fetching locations", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!addressForm.location) {
        setAreas([]);
        return;
      }
      setLoadingAreas(true);
      try {
        const data = await getAreasApi(addressForm.location);
        if (data?.status === 200 && Array.isArray(data.data?.data)) {
          setAreas(data.data?.data || []);
        } else {
          console.error("Invalid areas response", data);
        }
      } catch (error) {
        console.error("Error fetching areas", error);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, [addressForm.location]);

  const mapEmbedSrc = useMemo(() => {
    if (geoLocation?.lat && geoLocation?.lng) {
      return `https://maps.google.com/maps?q=${geoLocation.lat},${geoLocation.lng}&z=16&output=embed`;
    }
    return null;
  }, [geoLocation?.lat, geoLocation?.lng]);

  const handleAddressChange = (field, value) => {
    setAddressForm((prev) => {
      if (field === "location") {
        return {
          ...prev,
          location: value,
          area: "",
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
    setAddressError("");
  };

  const handleCancelEdit = () => {
    setAddressForm({
      location: formData.location || "",
      area: formData.area || "",
      delivery_address: formData.delivery_address || "",
    });
    if (formData.latitude && formData.longitude) {
      setLocation({
        lat: Number(formData.latitude),
        lng: Number(formData.longitude),
      });
    }
    setIsAddressEditing(false);
    setAddressError("");
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.location.trim() ||
      !addressForm.area.trim() ||
      !addressForm.delivery_address.trim()
    ) {
      setAddressError("Please complete all required fields.");
      return;
    }

    onUpdateFormData({
      ...addressForm,
      latitude: geoLocation?.lat || formData.latitude || "",
      longitude: geoLocation?.lng || formData.longitude || "",
    });
    setAddress(addressForm.delivery_address);
    setIsAddressEditing(false);
    setAddressError("");
  };

  const handleLocateMeClick = () => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setShowGuide(true);
      return;
    }
    handleLocateme();
  };

  useEffect(() => {
    if (geoError && geoError.toLowerCase().includes("permission")) {
      setShowGuide(true);
    }
  }, [geoError]);

  // Helper function to parse amount values
  const parseAmountValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }
    if (typeof value === "number") {
      return value;
    }
    const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(numericValue) ? 0 : numericValue;
  };

  // Get selected payment method
  const selectedPaymentMethod = paymentOptions.find(
    (method) => method.id === selecteddefaultpaymentmethod
  );

  // Calculate dynamic values based on selected payment method
  const getProcessingFee = () => {
    if (selectedPaymentMethod) {
      return parseAmountValue(selectedPaymentMethod.processing_fee);
    }
    return parseAmountValue(feedData?.processing_fee || 0);
  };

  const getCouponDiscount = () => {
    if (!coupon) return 0;
    const rawDiscount =
      coupon.discount ?? coupon.discount_value ?? coupon.discount_amount ?? 0;
    return parseAmountValue(rawDiscount);
  };

  const getFinalTotal = () => {
    if (!feedData) return 0;

    const subTotal = parseAmountValue(feedData.sub_total);
    const processingFee = getProcessingFee();
    const shippingCharge = parseAmountValue(feedData.shipping_charge);
    const donation = parseAmountValue(donationfee || 0);
    const couponDiscount = getCouponDiscount();

    const total =
      subTotal + processingFee + shippingCharge + donation - couponDiscount;
    return total < 0 ? 0 : total;
  };
  const fetchAvailableCoupons = async () => {
    const res = await availableCoupons();
    if (res.status === "success") {
      setAvailableCoupon(res.data.availableCoupons);
    }
  };
  const getFeddData = async () => {
    const input_data = {
      product_id: product?.id,
      quantity: qty,
      product_price: product?.display_price,
    };
    const res = await getFeedPlaceOrder(input_data);
    if (res.status === "success") {
      setFeedData(res.data);

      const paymentMethods = res?.data?.payment_method || [];
      setPaymentOptions(paymentMethods);

      // Set default selected payment method if available
      const defaultMethod = paymentMethods.find((method) => method.selected);
      if (defaultMethod) {
        dispatch(setselecteddefaultpaymentmethod(defaultMethod.id));
      } else if (paymentMethods.length > 0) {
        dispatch(setselecteddefaultpaymentmethod(paymentMethods[0].id));
      }
    }
  };
  const totalSavings = useMemo(() => {
    const oldPrice = parseAmountValue(product?.old_price);
    const quantity = Number(qty) || 0;

    const currentSubtotal = feedData
      ? parseAmountValue(feedData?.sub_total)
      : parseAmountValue(product?.display_price) * quantity;

    let savingsFromPricing = 0;

    if (oldPrice > 0 && quantity > 0 && currentSubtotal > 0) {
      const oldTotal = oldPrice * quantity;
      savingsFromPricing = oldTotal - currentSubtotal;
    }

    const couponDiscount = getCouponDiscount();
    const total = savingsFromPricing + couponDiscount;

    if (!Number.isFinite(total) || total <= 0) {
      return 0;
    }

    return parseFloat(total.toFixed(2));
  }, [product?.old_price, product?.display_price, feedData, qty, coupon]);

  const handlePaymentChange = (id, processingFee) => {
    dispatch(setselecteddefaultpaymentmethod(id));
  };

  useEffect(() => {
    fetchAvailableCoupons();
    getFeddData();
  }, []);
  return (
    <div className="bg-white">
      <div className="flex flex-col lg:flex-row gap-6 p-8">
        {/* Left column */}
        <div className="flex-[1.57] w-full lg:w-[560px]">
          <div className="flex flex-col gap-5">
            <h2 className="text-[28px] font-semibold text-[#191B1C]">
              Order Summary
            </h2>

            <div className="flex flex-col w-full gap-2">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-xl text-[#191B1C]">
                    Delivery Address
                  </p>
                  {!isAddressEditing && (
                    <button
                      type="button"
                      onClick={() => setIsAddressEditing((prev) => !prev)}
                      aria-expanded={isAddressEditing}
                      className="flex items-center gap-1 text-sm font-medium text-[#3B82F6] border border-[#3B82F6] px-3 py-2 rounded-lg transition-colors hover:bg-[#E8F1FF]"
                    >
                      <AiOutlineEdit className="shrink-0" fill="#3B82F6" />
                      {isAddressEditing ? "Close" : "Edit Address"}
                    </button>
                  )}
                </div>
                <p className="text-[#43494B] mt-1 whitespace-pre-line">
                  {delivery_address}
                </p>

                <div className="text-sm text-[#6F787C] mt-2">
                  {contact_no && (
                    <p className="font-semibold text-[#191B1C]">
                      {currentcountry.country_code}-{contact_no}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isAddressEditing
                    ? "max-h-[1200px] opacity-100 pointer-events-auto mt-2"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isAddressEditing}
              >
                <div className="w-full rounded-2xl border border-[#E7E8E9] px-5 py-4 bg-white">
                  <h2 className="text-lg font-semibold text-[#191B1C] mb-4">
                    Edit Address
                  </h2>

                  <div className="flex flex-col gap-2 mb-4">
                    <div className="relative">
                      <div className="h-48 w-full rounded-2xl overflow-hidden bg-[#F8F8F8] flex items-center justify-center">
                        {mapCenter ? (
                          isLoaded && !loadError ? (
                            <GoogleMap
                              mapContainerStyle={mapContainerStyle}
                              center={mapCenter}
                              zoom={15}
                              onLoad={(map) => {
                                mapRef.current = map;
                              }}
                              options={{
                                gestureHandling: "greedy",
                                disableDefaultUI: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                              }}
                            >
                              <MarkerF
                                position={mapCenter}
                                draggable
                                onDragEnd={(event) => {
                                  handleDragEnd(event);
                                  const lat = event.latLng.lat();
                                  const lng = event.latLng.lng();
                                  setMapCenter({ lat, lng });
                                }}
                              />
                            </GoogleMap>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <p className="text-sm text-[#6F787C]">
                                {loadError
                                  ? "Unable to load map right now. Please try again."
                                  : "Loading map..."}
                              </p>
                            </div>
                          )
                        ) : (
                          <p className="text-sm text-[#6F787C]">
                            Fetching map for your area...
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleLocateMeClick}
                        className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 bg-white text-[#43494B] text-xs font-semibold rounded-xl shadow-[0px_4px_12px_0px_#0000000F] px-4 py-3 flex items-center"
                      >
                        {isLocating ? "Locating..." : "LOCATE ME"}
                        <span className="inline-flex w-5 h-5 items-center justify-center text-[#43494B]">
                          <FiMapPin />
                        </span>
                      </button>
                    </div>
                    {geoError && (
                      <p className="text-xs text-red-500">{geoError}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:gap-4 gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#43494B] mb-1">
                          Location<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-11 appearance-none rounded-xl bg-[#F8F8F8] px-4 pyx-2.5 text-sm text-[#191B1C] font-normal focus:outline-none"
                            value={addressForm.location}
                            onChange={(e) =>
                              handleAddressChange("location", e.target.value)
                            }
                            disabled={loadingLocations}
                          >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.name}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <IoCaretDownOutline fill="#43494B" />
                          </span>
                        </div>
                        {loadingLocations && (
                          <p className="text-xs text-[#6F787C] mt-1">
                            Loading locations...
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="text-sm font-medium text-[#43494B] mb-1">
                          Area<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-11 appearance-none rounded-xl bg-[#F8F8F8] px-4 pyx-2.5 text-sm text-[#191B1C] font-normal focus:outline-none"
                            value={addressForm.area}
                            onChange={(e) =>
                              handleAddressChange("area", e.target.value)
                            }
                            disabled={!addressForm.location || loadingAreas}
                          >
                            <option value="">
                              {addressForm.location
                                ? "Select Area"
                                : "Select a location first"}
                            </option>
                            {areas.map((areaOption) => (
                              <option key={areaOption.id} value={areaOption.id}>
                                {areaOption.name}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <IoCaretDownOutline fill="#43494B" />
                          </span>
                        </div>
                        {loadingAreas && (
                          <p className="text-xs text-[#6F787C] mt-1">
                            Loading areas...
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#43494B] mb-1">
                        Delivery Address<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="deliveryAddress"
                        rows={3}
                        className="w-full rounded-xl bg-[#F8F8F8] px-4 py-2.5 text-sm text-[#191B1C] font-normal resize-none focus:outline-none border border-transparent focus:border-[#C6C6C6]"
                        value={addressForm.delivery_address}
                        onChange={(e) =>
                          handleAddressChange(
                            "delivery_address",
                            e.target.value
                          )
                        }
                        placeholder="Enter your complete delivery address"
                      />
                    </div>
                    {addressError && (
                      <p className="text-xs text-red-500">{addressError}</p>
                    )}
                  </div>

                  <div className="flex justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 h-11 rounded-[10px] border border-[#E7E8E9] text-[#43494B] font-semibold text-sm"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="flex-1 h-11 rounded-[10px] bg-[#5232C2] text-white font-semibold text-sm"
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-[#191B1C]">
                Payment Options
              </h3>

              {paymentOptions?.length > 0 ? (
                paymentOptions.map((paymentMethod) => {
                  const isSelected =
                    selecteddefaultpaymentmethod === paymentMethod.id;
                  const processingFee = paymentMethod.processing_fee;
                  const isFree =
                    processingFee === 0 ||
                    processingFee === "0" ||
                    processingFee === "FREE" ||
                    !processingFee;

                  return (
                    <div
                      key={paymentMethod.id}
                      className={`payment-option-card ${
                        isSelected ? "border-[#3B82F6]" : ""
                      }`}
                      onClick={() =>
                        handlePaymentChange(
                          paymentMethod.id,
                          paymentMethod.processing_fee
                        )
                      }
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value={paymentMethod.id}
                          checked={isSelected}
                          onChange={() =>
                            handlePaymentChange(
                              paymentMethod.id,
                              paymentMethod.processing_fee
                            )
                          }
                          className="payment-radiobtn"
                        />
                        <div className="flex-1 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="paymentmethod-label">
                              <span className="font-medium text-[#191B1C]">
                                {paymentMethod.label}
                              </span>
                            </div>
                            {paymentMethod.sub_label && (
                              <div className="paymentmethod-sublabel font-normal text-xs text-[#6F787C]">
                                {paymentMethod.sub_label}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#9E9E9E] text-sm">
                  No payment methods available
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[#EAEAEA] p-4 space-y-4">
              {currentcountry.isDonationRequired && (
                <Donation donation={feedData?.donation} />
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 w-full">
          <div className="rounded-3xl border border-[#F0F0F0] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6">
            <h3 className="text-xl font-semibold text-[#191B1C]">
              Price Details
            </h3>

            <div className="space-y-3 text-[#4F4F4F] text-sm">
              {[
                { label: "Subtotal", value: feedData?.sub_total },
                { label: "Processing Fee", value: getProcessingFee() },
                { label: "Donation", value: donationfee },
                { label: "Shipping Charge", value: feedData?.shipping_charge },
                ...(getCouponDiscount() > 0
                  ? [
                      {
                        label: "Coupon Discount",
                        value: -getCouponDiscount(),
                      },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[16px] font-medium text-[#43494B]">
                    {item.label}
                  </span>
                  <span className={`text-[16px] font-medium text-[#191B1C]`}>
                    {currentcountry.currency === "AED" ? (
                      <img
                        src={getAssetsUrl("feed/aed-icon.svg")}
                        alt="AED"
                        className="w-[16px] h-[19px] inline-block mix-blend-multiply mr-1"
                      />
                    ) : (
                      <span className="text-[14px] font-bold text-[#1E1E1E] mr-1">
                        {currentcountry.currency}
                      </span>
                    )}
                    <span className="text-[16px] font-bold text-[#1E1E1E]">
                      {parseFloat(item.value || 0).toFixed(2)}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-[#F3F4F6] pt-4">
              <div className="w-full flex justify-between items-center text-xl font-bold text-[#1E1E1E]">
                <p className="text-[18px] text-[#191B1C] font-semibold">
                  Total
                  <span className="text-[18px] text-[#43494B] font-medium">
                    &nbsp;(Inc. of VAT)
                  </span>
                </p>
                <p className="flex items-center text-[18px] font-bold text-[#1E1E1E]">
                  {currentcountry.currency === "AED" ? (
                    <img
                      src={getAssetsUrl("feed/aed-icon.svg")}
                      alt="AED"
                      className="w-[20px] h-[24px] inline-block mix-blend-multiply "
                    />
                  ) : (
                    <span className="text-[20px] font-bold text-[#1E1E1E]">
                      {currentcountry.currency}
                    </span>
                  )}
                  <span className="text-[20px] font-bold text-[#1E1E1E]">
                    {getFinalTotal().toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <CheckCoupan
                prodId={product?.id}
                qty={qty}
                sku={sku}
                paymentMethods={
                  selectedPaymentMethod
                    ? {
                        ...selectedPaymentMethod,
                        sub_total: feedData?.sub_total,
                      }
                    : { sub_total: feedData?.sub_total }
                }
                coupons={availableCoupon}
                price={product?.display_price}
              />
            </div>
            <div
              style={{
                backgroundImage:
                  `url(${getAssetsUrl("vector_icons/cart_sidebar_wave.svg")})`,
              }}
              className="relative select-none flex justify-between px-4 text-[#33B056] items-center bg-no-repeat bg-cover bg-top w-full h-16 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-white/80"></div>
              <div className="flex items-center gap-1">
                <RiDiscountPercentFill
                  className="text-2xl"
                  aria-hidden="true"
                />
                <p className="mb-0 font-semibold capitalize">
                  {yourTotalSavings}
                </p>
              </div>
              <div
                className={`font-semibold text-lg flex items-center gap-1 h-6 ${
                  currentLanguage === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                {currentcountry?.currency == "AED" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17.39"
                    viewBox="0 1.3 21 17.39"
                  >
                    <g id="surface1">
                      <path
                        style={{
                          stroke: "none",
                          fillRule: "nonzero",
                          fill: "rgb(51, 176, 86)",
                          fillOpacity: 1,
                        }}
                        d="M 1.765625 1.320312 C 1.773438 1.332031 1.816406 1.386719 1.859375 1.4375 C 2.164062 1.800781 2.394531 2.394531 2.519531 3.140625 C 2.601562 3.628906 2.605469 3.785156 2.605469 5.652344 L 2.605469 7.390625 L 1.769531 7.390625 C 1.007812 7.390625 0.917969 7.386719 0.769531 7.359375 C 0.53125 7.308594 0.289062 7.175781 0.125 7.003906 C -0.0078125 6.863281 -0.00390625 6.855469 0.0078125 7.273438 C 0.015625 7.621094 0.0195312 7.65625 0.0703125 7.847656 C 0.148438 8.144531 0.261719 8.367188 0.425781 8.5625 C 0.652344 8.835938 0.882812 8.988281 1.210938 9.089844 C 1.28125 9.109375 1.429688 9.117188 1.953125 9.121094 L 2.605469 9.132812 L 2.605469 10.867188 L 1.683594 10.859375 L 0.757812 10.855469 L 0.597656 10.789062 C 0.40625 10.714844 0.320312 10.65625 0.136719 10.492188 L 0 10.371094 L 0.0078125 10.753906 C 0.0195312 11.105469 0.0195312 11.144531 0.0703125 11.324219 C 0.242188 11.960938 0.664062 12.414062 1.21875 12.5625 C 1.355469 12.601562 1.410156 12.605469 1.988281 12.613281 L 2.605469 12.621094 L 2.605469 14.410156 C 2.605469 15.492188 2.601562 16.292969 2.589844 16.429688 C 2.578125 16.550781 2.546875 16.785156 2.519531 16.945312 C 2.390625 17.691406 2.15625 18.253906 1.820312 18.617188 L 1.753906 18.691406 L 5.132812 18.691406 C 7.15625 18.691406 8.667969 18.683594 8.890625 18.675781 C 9.28125 18.652344 10.148438 18.566406 10.347656 18.527344 C 10.40625 18.515625 10.523438 18.496094 10.601562 18.484375 C 10.761719 18.460938 11.03125 18.402344 11.414062 18.304688 C 11.960938 18.171875 12.457031 18 12.941406 17.785156 C 13.09375 17.714844 13.53125 17.492188 13.644531 17.425781 C 13.707031 17.386719 13.78125 17.34375 13.808594 17.328125 C 13.886719 17.289062 14.019531 17.203125 14.207031 17.066406 C 14.300781 17 14.394531 16.933594 14.414062 16.921875 C 14.5 16.863281 14.789062 16.621094 14.921875 16.5 C 15.425781 16.039062 15.84375 15.523438 16.171875 14.972656 C 16.214844 14.894531 16.277344 14.792969 16.300781 14.753906 C 16.367188 14.640625 16.640625 14.078125 16.664062 13.996094 C 16.679688 13.957031 16.695312 13.917969 16.703125 13.910156 C 16.753906 13.84375 17.054688 12.898438 17.089844 12.691406 C 17.101562 12.625 17.109375 12.617188 17.15625 12.605469 C 17.191406 12.601562 17.65625 12.601562 18.195312 12.605469 C 19.269531 12.613281 19.269531 12.613281 19.507812 12.722656 C 19.640625 12.785156 19.683594 12.8125 19.828125 12.945312 C 20.023438 13.121094 20.007812 13.148438 19.992188 12.710938 C 19.984375 12.457031 19.976562 12.296875 19.957031 12.234375 C 19.890625 11.988281 19.875 11.9375 19.8125 11.8125 C 19.617188 11.382812 19.289062 11.078125 18.871094 10.933594 L 18.707031 10.871094 L 17.371094 10.855469 L 17.378906 10.621094 C 17.386719 10.3125 17.386719 9.703125 17.378906 9.386719 L 17.371094 9.136719 L 18.261719 9.132812 C 19.027344 9.128906 19.167969 9.132812 19.253906 9.152344 C 19.503906 9.222656 19.675781 9.320312 19.882812 9.511719 L 19.996094 9.617188 L 19.996094 9.320312 C 19.996094 8.96875 19.980469 8.8125 19.90625 8.582031 C 19.765625 8.113281 19.484375 7.761719 19.085938 7.546875 C 18.824219 7.40625 18.808594 7.402344 17.914062 7.394531 C 17.390625 7.390625 17.117188 7.382812 17.105469 7.371094 C 17.09375 7.359375 17.082031 7.339844 17.082031 7.324219 C 17.082031 7.308594 17.050781 7.183594 17.011719 7.046875 C 16.542969 5.390625 15.671875 4.078125 14.390625 3.105469 C 14.21875 2.96875 13.792969 2.6875 13.621094 2.59375 C 13.554688 2.554688 13.480469 2.515625 13.464844 2.503906 C 13.378906 2.457031 12.898438 2.21875 12.777344 2.171875 C 12.707031 2.136719 12.613281 2.097656 12.570312 2.082031 C 11.863281 1.777344 10.679688 1.484375 9.777344 1.394531 C 9.628906 1.382812 9.433594 1.359375 9.34375 1.351562 C 8.933594 1.304688 8.367188 1.300781 5.152344 1.300781 C 2.4375 1.300781 1.757812 1.304688 1.765625 1.320312 Z M 8.378906 2.1875 C 9.054688 2.226562 9.472656 2.277344 9.957031 2.394531 C 11.441406 2.746094 12.484375 3.492188 13.242188 4.734375 C 13.3125 4.851562 13.609375 5.457031 13.652344 5.578125 C 13.863281 6.144531 13.964844 6.480469 14.054688 6.925781 C 14.078125 7.03125 14.109375 7.175781 14.121094 7.242188 C 14.136719 7.308594 14.140625 7.371094 14.136719 7.378906 C 14.125 7.386719 12.117188 7.390625 9.671875 7.386719 L 5.21875 7.382812 L 5.214844 4.8125 C 5.210938 3.402344 5.214844 2.226562 5.21875 2.207031 L 5.226562 2.167969 L 6.648438 2.167969 C 7.429688 2.167969 8.210938 2.175781 8.378906 2.1875 Z M 14.328125 9.191406 C 14.34375 9.277344 14.34375 10.738281 14.328125 10.808594 L 14.316406 10.863281 L 9.769531 10.859375 L 5.21875 10.855469 L 5.214844 10.007812 C 5.210938 9.539062 5.214844 9.152344 5.21875 9.144531 C 5.226562 9.132812 7.164062 9.128906 9.773438 9.128906 L 14.316406 9.128906 Z M 14.125 12.625 C 14.136719 12.65625 14.089844 12.902344 13.988281 13.300781 C 13.878906 13.753906 13.726562 14.207031 13.570312 14.542969 C 13.496094 14.714844 13.304688 15.085938 13.261719 15.15625 C 13.238281 15.1875 13.175781 15.289062 13.117188 15.378906 C 12.757812 15.945312 12.242188 16.457031 11.65625 16.839844 C 11.445312 16.972656 11.003906 17.207031 10.886719 17.242188 C 10.863281 17.246094 10.835938 17.261719 10.824219 17.269531 C 10.8125 17.28125 10.628906 17.347656 10.417969 17.425781 C 10.027344 17.5625 9.285156 17.710938 8.691406 17.773438 C 8.304688 17.8125 8.242188 17.8125 6.757812 17.8125 L 5.21875 17.8125 L 5.21875 12.625 L 9.636719 12.617188 C 12.066406 12.613281 14.066406 12.605469 14.085938 12.601562 C 14.101562 12.601562 14.121094 12.613281 14.125 12.625 Z M 14.125 12.625 "
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <span className="text-[1.125rem] text-lg">
                    {currentcountry?.currency}
                  </span>
                )}
                <span
                  aria-live="polite"
                  aria-label={`Total savings: ${currentcountry?.currency} ${totalSavings}`}
                  dir="ltr"
                  style={{ display: "inline-block" }}
                >
                  <OdometerCounter
                    value={totalSavings}
                    duration={1500}
                    format="(ddd)"
                  />
                </span>
              </div>
            </div>
            <button
              onClick={onPayNow}
              className="flex justify-center items-center w-full rounded-2xl bg-[#FFC107] py-3 text-lg font-semibold text-[#1E1E1E] shadow-[0_10px_20px_rgba(255,193,7,0.35)] gap-2"
            >
              <div>Pay Now</div>
              <div className="flex items-center">
               
                  {currentcountry.currency?.toUpperCase() === "AED" ? (
                    <img
                      src={getAssetsUrl("feed/aed-icon.svg")}
                      alt="AED"
                      className="w-[18px] h-[18px] inline-block mix-blend-multiply "
                    />
                  ) : (
                    <span className="text-[14px] font-bold text-[#1E1E1E] ">
                      {currentcountry.currency}
                    </span>
                  )}
             
                <span className="text-[18px] font-semibold text-[#1E1E1E]">{getFinalTotal().toFixed(2)}</span>
              </div>
            </button>

            <div className="flex items-center justify-center gap-3 text-[#219653] text-sm font-semibold pt-2">
              <FaLock />
              <span>Safe & Secure Payment Transaction</span>
            </div>
          </div>
        </div>
      </div>
      <LocateMe
        showGuide={showGuide}
        setShowGuide={setShowGuide}
        getLocation={handleLocateMeClick}
      />
    </div>
  );
};

export default PayNowFinal;
