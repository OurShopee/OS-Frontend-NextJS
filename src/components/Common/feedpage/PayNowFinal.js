import { availableCoupons, getFeedPlaceOrder } from "@/api/payments";
import { getAreasApi, getLocationsApi } from "@/api/others";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaLock } from "react-icons/fa6";
import CheckCoupan from "../CheckCoupan";
import Donation from "../Donation";
import { useSelector, useDispatch } from "react-redux";
import { setselecteddefaultpaymentmethod } from "@/redux/paymentslice";
import { AiOutlineEdit } from "react-icons/ai";
import { IoCaretDownOutline } from "react-icons/io5";
import LocateMe from "@/components/LocateMe";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { FiMapPin } from "react-icons/fi";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const PayNowFinal = ({
  onPayNow = () => {},
  onUpdateFormData = () => {},
  formData = {},
  product = {},
  qty = 1,
  sku = "",
}) => {
  console.log(product);
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
      setFeddData(res.data);
      const paymentMethods = res?.data?.payment_method || [];
      setPaymentOptions(paymentMethods);
      console.log("test", feddData);

      // Set default selected payment method if available
      const defaultMethod = paymentMethods.find((method) => method.selected);
      if (defaultMethod) {
        dispatch(setselecteddefaultpaymentmethod(defaultMethod.id));
      } else if (paymentMethods.length > 0) {
        dispatch(setselecteddefaultpaymentmethod(paymentMethods[0].id));
      }
    }
  };

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

                  <div className="flex flex-col gap-4 mb-4">
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
            <div className="rounded-2xl border border-[#EAEAEA] p-4">
              {currentcountry.isDonationRequired && (
                <Donation donation={paymentOptions?.donation} />
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
                { label: "Subtotal", value: "n/a" },
                { label: "Processing Fee", value: "n/a" },
                { label: "Donation", value: "n/a" },
                { label: "Shipping Charge", value: "FREE", emphasize: true },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span
                    className={`${
                      item.emphasize
                        ? "text-[#27AE60] font-semibold"
                        : "font-medium"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-[#F3F4F6] pt-4">
              <div className="flex  justify-between w-full items-center">
                <p className="text-sm text-[#6C7275]">Total (Inc. of VAT)</p>
                <p className="text-2xl font-bold text-[#1E1E1E]">4366</p>
              </div>
            </div>

            <div className="space-y-3">
              <CheckCoupan
                prodId={product?.id}
                qty={qty}
                sku={sku}
                paymentMethods={product?.display_price}
                coupons={availableCoupon}
                price={product?.display_price}
              />
            </div>

            <button
              onClick={onPayNow}
              className="w-full rounded-2xl bg-[#FFC107] py-3 text-lg font-semibold text-[#1E1E1E] shadow-[0_10px_20px_rgba(255,193,7,0.35)]"
            >
              PAY NOW ฿4366
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
