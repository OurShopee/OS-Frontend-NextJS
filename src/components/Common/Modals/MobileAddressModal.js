import useCurrentLocation from "@/hooks/useCurrentLocation";
import useFormValidation from "@/hooks/useFormValidation";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { CiLocationOn } from "react-icons/ci";
import { IoClose, IoSearch } from "react-icons/io5";
import { PiGps } from "react-icons/pi";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { toggleMobileAddressModal } from "../../../redux/addresslice";

import {
  getalladdressesapi,
  postUserAddress,
  setAddressButtonLoading,
} from "../../../redux/addresslice";
import {
  checkmobileotpapi,
  setcheckemailerror,
  setregistermobile
} from "../../../redux/formslice";
import { getAreas, getLocations } from "../../../redux/globalslice";
import { InputBox1 } from "../formInputs";
import { useContent, useCurrentLanguage } from "@/hooks";

function MobileAddressModal() {
  const dispatch = useDispatch();
  const inputs = ["name", "emirate", "number", "address", "area"];
  const currentLanguage = useCurrentLanguage();
  
  // Content translations
  const whatAreYouLookingFor = useContent("buttons.whatAreYouLookingFor");
  const loading = useContent("buttons.loading");
  const addAddress = useContent("buttons.addAddress");
  const updateAddress = useContent("buttons.updateAddress");
  const name = useContent("forms.firstName");
  const enterMobileNumber = useContent("buttons.enterMobileNumber");
  const selectLocation = useContent("buttons.selectLocation");
  const selectArea = useContent("buttons.selectArea");
  const flatNoHouseNoBuildingLandmark = useContent("buttons.flatNoHouseNoBuildingLandmark");
  const deliveringYourOrderTo = useContent("buttons.deliveringYourOrderTo");
  const useMyCurrentLocation = useContent("buttons.useMyCurrentLocation");
  const confirmMyLocation = useContent("buttons.confirmMyLocation");
  const locateMe = useContent("buttons.locateMe");

  const mobile_address_modal = useSelector(
    (state) => state.addresslice.mobile_address_modal
  );
  const address_header = useSelector(
    (state) => state.addresslice.address_header
  );
  const addresslistdata = useSelector(
    (state) => state.addresslice.addresslistdata
  );
  const locationsdata = useSelector((state) => state.globalslice.locationsdata);
  const areadata = useSelector((state) => state.globalslice.areadata);
  const loading1 = useSelector((state) => state.globalslice.loading1);
  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const addressButtonLoader = useSelector(
    (state) => state.addresslice.loading1
  );
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const addressnumber = useSelector((state) => state.formslice.addressnumber);
  const { handleChange, formValues, setFormValues, errors, isClickable } =
    useFormValidation({ inputs });

  const [address, setAddres] = useState("");

  const [step, setstep] = useState(false);

  const {
    location,
    setLocation,
    handleDragEnd,
    addressData,
    handleLocateme,
    setAddress,
  } = useCurrentLocation({ address_header });

  useEffect(() => {
    if (addressData != "") {
      setFormValues({
        ...formValues,
        address: addressData,
        address2: addressData,
      });
    }
  }, [addressData]);

  const handleDragMap = (e) => {
    setstep(true);
    handleDragEnd(e);
  };

  useEffect(() => {
    dispatch(getLocations());
  }, []);

  const handleSelect = async (selectedAddress) => {
    setstep(false);

    const results = await geocodeByAddress(selectedAddress);
    const latLng = await getLatLng(results[0]);
    setLocation(latLng);
    setFormValues({
      ...formValues,
      address: selectedAddress,
      address2: selectedAddress,
    });
    setAddres(selectedAddress);
    setcurrent_Step(1);
    inputRef.current?.blur();
  };

  const [isFocused, setIsFocused] = useState(false);
  const [current_Step, setcurrent_Step] = useState(0);

  const handleFocus = () => {
    setcurrent_Step(0);
    setIsFocused(true);
  };

  const handleClose = () => {
    setIsFocused(false);
    setstep(false);
    setcurrent_Step(0);
    dispatch(toggleMobileAddressModal(false));
    setFormValues({});
  };

  useEffect(() => {
    if (address_header != 0) {
      var address_Details = addresslistdata?.data?.find(
        (ele) => ele.idaddress == address_header
      );
      setAddress(address_Details.address);
      setLocation({
        lat: parseFloat(address_Details.latitude),
        lng: parseFloat(address_Details.longitude),
      });
      dispatch(getAreas(address_Details.emirate));
      setFormValues({
        idaddress: address_Details.idaddress,
        name: address_Details.first_name,
        emirate: address_Details.emirate,
        area: address_Details.area,
        ...(currentcountry.isAreaCodeRequired && {
          number: address_Details.mobile.slice(2),
        }),
        ...(!currentcountry.isAreaCodeRequired && {
          number: address_Details.mobile,
        }),
        pre: address_Details.mobile.slice(0, -currentcountry.number_count),
      });
    }
  }, [address_header]);

  const handleLocationChange = (e) => {
    if (e.target.value == null) {
      setFormValues((prev) => {
        const updated = { ...prev };
        delete updated[e.target.name];
        return updated;
      });
    } else {
      if (e.target.name == "pre") {
        setFormValues({
          ...formValues,
          pre: e.target.value,
        });
      } else {
        if (e.target.value != null) {
          setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
          });
          if (e.target.name == "emirate") {
            dispatch(getAreas(e.target.value));
          }
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (isClickable) {
      var address_Details = addresslistdata?.data?.find(
        (ele) => ele.idaddress == address_header
      );
      if (
        address_header != 0 &&
        (currentcountry.isAreaCodeRequired
          ? formValues.pre + formValues.number
          : formValues.number) == address_Details.mobile
      ) {
        finalSubmit();
      } else {
        let mobileNumber;
        if (currentcountry.isAreaCodeRequired) {
          mobileNumber = `${formValues.pre || 50}${formValues.number}`;
        } else {
          mobileNumber = formValues.number;
        }
        dispatch(setcheckemailerror(""));
        dispatch(checkmobileotpapi({ mobile: mobileNumber }));
        dispatch(setregistermobile(mobileNumber));
      }
    }
  };

  const finalSubmit = async () => {
    if (isClickable) {
      dispatch(setAddressButtonLoading(true));
      var input_data = {
        idaddress: address_header,
        first_name: formValues.name,
        last_name: "",
        address: formValues.address,
        address2: formValues.address2,
        ...(currentcountry.isAreaCodeRequired && {
          pre: formValues.hasOwnProperty("pre") ? formValues.pre : 50,
        }),
        ...(currentcountry.isAreaCodeRequired && {
          mobile: formValues.hasOwnProperty("pre")
            ? formValues.pre + formValues.number
            : 50 + formValues.number,
        }),
        ...(!currentcountry.isAreaCodeRequired && {
          mobile: formValues.number,
        }),
        emirate: formValues.emirate,
        area: formValues.area,
        building_name: "",
        latitude: location.lat,
        longitude: location.lng,
        status: 0,
        default_address: formValues.hasOwnProperty("default_address")
          ? formValues.default_address
          : true,
      };
      await dispatch(postUserAddress(input_data));
      dispatch(getalladdressesapi(0));
      dispatch(setAddressButtonLoading(false));
      setcurrent_Step(0);
      setAddres("");
      handleClose();
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };
  useEffect(() => {
    if (isClickable && addressnumber) {
      finalSubmit();
    }
  }, [addressnumber]);

  const inputRef = useRef(null);

  return (
    <>
      <Modal
        show={mobile_address_modal}
        backdrop="static"
        keyboard={false}
        centered
        fullscreen
        className={`address_dropdown ${optmodalopen && "z-3"}`}
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["drawing", "places"]}
        >
          <div className="mobile_address_modal">
            <PlacesAutocomplete
              value={address}
              onChange={setAddres}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className="relative">
                  <div className="mobile_address_modal_header">
                    <div
                      onClick={() => {
                        if (!isFocused) {
                          handleClose();
                          setAddres("");
                          handleLocateme();
                          // setFormValues({
                          //     'address': '',
                          // })
                        }
                        setcurrent_Step(0);
                        setAddres("");
                        inputRef.current?.blur();
                        setIsFocused(false);
                      }}
                    >
                      <img src="/assets/vector_icons/arrow_left.svg" />
                    </div>

                    <div className="flex w-full items-center">
                      <div className="flex footercontactus mobile_address w-full mx-3">
                        <input
                          {...getInputProps({
                            placeholder: whatAreYouLookingFor,
                            className: "header-inputbox",
                            onFocus: handleFocus,
                            ref: inputRef,
                            dir: currentLanguage === "ar" ? "rtl" : "ltr",
                          })}
                        />
                        <div
                          className="header-search secondarybackground"
                          onClick={() => {
                            setcurrent_Step(1);
                            setIsFocused(true);

                            inputRef.current?.blur();
                          }}
                        >
                          <IoSearch size={16} className="iconcolor" />
                        </div>
                      </div>
                    </div>
                    <IoClose size={30} onClick={handleClose} />
                  </div>

                  {suggestions.length > 0 && (
                    <div className="mobile_search_location_dropdown" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                      {loading && <div>{loading}</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "suggestion-item--active suggestion-item"
                          : "suggestion-item";

                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                            })}
                          >
                            <CiLocationOn size={20} className="me-4" />{" "}
                            <div className="two_lines">
                              {suggestion.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {current_Step == 1 && (
                    <div className="mobile_address_form address_form" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                      <h5>
                        {address_header == 0 ? addAddress : updateAddress}
                      </h5>
                      <div className="address_form_header mt-3 grid grid-cols-1 sm:grid-cols-12 gap-4">
                        {/* Name */}
                        <div className="lg:col-span-12">
                          <InputBox1
                            name="name"
                            placeholder={name}
                            handleChange={handleChange}
                            value={formValues.name}
                          />
                        </div>

                        {/* Country Code */}
                        <div className="lg:col-span-3 col-span-3">
                          <InputBox1
                            name="country_code"
                            readOnly
                            handleChange={handleChange}
                            value={currentcountry.country_code}
                          />
                        </div>

                        {/* Area Code Dropdown (Conditional) */}
                        {currentcountry.isAreaCodeRequired && (
                          <div className="lg:col-span-3 col-span-3 pe-0">
                            <select
                              className="address_input_box"
                              name="pre"
                              onChange={handleLocationChange}
                              value={formValues.pre}
                            >
                              <option value={50}>{50}</option>
                              {[52, 54, 55, 56, 58].map((number) => (
                                <option key={number} value={number}>
                                  {number}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Mobile Number */}
                        <div
                          className={`${
                            currentcountry.isAreaCodeRequired
                              ? "lg:col-span-6 col-span-6"
                              : "lg:col-span-9 col-span-9"
                          }`}
                        >
                          <InputBox1
                            type="number"
                            name="number"
                            handleChange={handleChange}
                            placeholder={enterMobileNumber}
                            value={formValues.number}
                          />
                        </div>

                        {/* Emirate Select */}
                        <div className="lg:col-span-6 col-span-6 pe-0">
                          <select
                            className="address_input_box"
                            name="emirate"
                            onChange={handleLocationChange}
                            value={formValues.emirate}
                            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                          >
                            <option value={null}>{selectLocation}</option>
                            {locationsdata.map((data) => (
                              <option key={data.id} value={data.id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Area Select */}
                        <div className="lg:col-span-6 col-span-6">
                          <select
                            className="address_input_box"
                            name="area"
                            onChange={handleLocationChange}
                            value={formValues.area}
                            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                          >
                            <option value={null}>{selectArea}</option>
                            {areadata.map((data) => (
                              <option key={data.id} value={data.id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Address Field */}
                        <div className="lg:col-span-12">
                          <InputBox1
                            name="address"
                            placeholder={flatNoHouseNoBuildingLandmark}
                            handleChange={handleChange}
                            value={formValues.address}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </div>

          <div className="modal_address_body">
            <div className="grid grid-cols-1">
              <div className="col-span-1">
                {!isFocused &&
                  !loading1 &&
                  Object.keys(location).length > 0 && (
                    <div className="relative">
                      <GoogleMap
                        center={location}
                        zoom={15}
                        mapContainerStyle={{ height: "80vh", width: "100%" }}
                      >
                        <MarkerF
                          position={location}
                          draggable={true}
                          icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            scaledSize: { width: 48, height: 48 },
                            anchor: { x: 24, y: 48 },
                          }}
                          onDragEnd={handleDragMap}
                        />
                      </GoogleMap>

                      <div
                        className={`absolute locate_me_btn ${
                          currentLanguage === "ar" ? "flex-row-reverse" : ""
                        }`}
                        onClick={handleLocateme}
                      >
                        {locateMe}{" "}
                        <span className={currentLanguage === "ar" ? "mr-2" : "ps-2"}>
                          <PiGps size={18} color="rgba(25, 27, 28, 1)" />
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {!isFocused && (
              <div className="modal_address_footer" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                <div className="comp_1">
                  <h6>{deliveringYourOrderTo} </h6>
                  <h5>
                    {formValues.address != ""
                      ? formValues.address
                      : addressData}
                  </h5>
                </div>
                {address_header == 0 && !step ? (
                  <div
                    className="address_btn_current_location mt-2"
                    style={{ background: "var(--primary_color)", color: "#fff" }}
                    onClick={() => {
                      handleLocateme();
                      setcurrent_Step(1);
                      setIsFocused(true);
                    }}
                  >
                    {useMyCurrentLocation}
                  </div>
                ) : (
                  <div
                    className="address_btn_current_location mt-2"
                    style={{ background: "var(--primary_color)", color: "#fff" }}
                    onClick={() => {
                      setcurrent_Step(1);
                      setIsFocused(true);
                    }}
                  >
                    {confirmMyLocation}
                  </div>
                )}
              </div>
            )}
            {current_Step == 1 && (
              <div className="modal_address_footer" style={{ height: "auto" }} dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                <div
                  className="address_btn"
                  onClick={handleSubmit}
                  style={{
                    background: isClickable && "var(--primary_color)",
                    color: isClickable && "#fff",
                  }}
                >
                  {address_header == 0 ? addAddress : updateAddress}
                  {addressButtonLoader && (
                    <ClipLoader className={currentLanguage === "ar" ? "mr-3" : "ms-3"} size={16} color={"#fff"} />
                  )}
                </div>
              </div>
            )}
          </div>
        </LoadScript>
      </Modal>
    </>
  );
}

export default MobileAddressModal;
