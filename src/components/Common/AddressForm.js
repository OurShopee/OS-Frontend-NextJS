import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { useCurrentLocation, useFormValidation } from "../../hooks";
import { getLocations, getAreas } from "@/redux/globalslice";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { InputBox1 } from "./formInputs";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { PiGps } from "react-icons/pi";
import { postUserAddress, getalladdressesapi } from "@/redux/addresslice";
import { setAddressButtonLoading } from "@/redux/addresslice";
import { setformmodal, setformstatus } from '@/redux/formslice';
import { setotpmodal, checkmobileotpapi, setcheckemailerror, setregistermobile } from '@/redux/formslice';
import LocateMe from "@/components/LocateMe";
const AddressForm = () => {
    const inputs = ['name', 'emirate', 'number', 'address', 'area'];

    const { handleChange, formValues, setFormValues, errors, isClickable } = useFormValidation({ inputs })



    const [address, setAddres] = useState("");

    const locationsdata = useSelector(state => state.globalslice.locationsdata);
    const addresslistdata = useSelector(state => state.addresslice.addresslistdata);

    const addressButtonLoader = useSelector(state => state.addresslice.loading1)
    const address_header = useSelector(state => state.addresslice.address_header)
    const authstatus = useSelector(state => state.formslice.authstatus)
    const addressnumber = useSelector(state => state.formslice.addressnumber)
    const areadata = useSelector(state => state.globalslice.areadata);
    const loading1 = useSelector(state => state.globalslice.loading1);
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const optmodalopen = useSelector((state) => state.formslice.optmodalopen)
    const loading2 = useSelector(state => state.globalslice.loading2);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLocations())
    }, [])

    const { location, setLocation, handleDragEnd, addressData, handleLocateme, setAddress } = useCurrentLocation({ address_header })


    const handleLocationChange = (e) => {
        if (e.target.value == null) {
            setFormValues(prev => {
                const updated = { ...prev };
                delete updated[e.target.name];
                return updated;
            });
        } else {
            if (e.target.name == 'pre') {
                setFormValues({
                    ...formValues,
                    'pre': e.target.value
                })
            } else {
                if (e.target.value != null) {
                    setFormValues({
                        ...formValues,
                        [e.target.name]: e.target.value
                    })
                    if (e.target.name == 'emirate') {
                        dispatch(getAreas(e.target.value))
                    }
                }
            }
        }

    }

    useEffect(() => {
        if (addressData != '') {
            setFormValues({
                ...formValues,
                'address': addressData,
                'address2': addressData
            })
        }
    }, [addressData])


    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        const latLng = await getLatLng(results[0]);
        setLocation(latLng)
        setFormValues({
            ...formValues,
            'address': selectedAddress,
            'address2': selectedAddress
        })
        setAddres(selectedAddress)
    };


    useEffect(() => {
        if (address_header != 0) {
            var address_Details = addresslistdata?.data?.find(ele => ele.idaddress == address_header);
            setAddress(address_Details.address)
            setLocation({ lat: parseFloat(address_Details.latitude), lng: parseFloat(address_Details.longitude) });
            dispatch(getAreas(address_Details.emirate))
            setFormValues({
                idaddress: address_Details.idaddress,
                name: address_Details.first_name,
                default_address: address_Details.default_address,
                emirate: address_Details.emirate,
                area: address_Details.area,
                ...currentcountry.isAreaCodeRequired && ({ number: address_Details.mobile.slice(2) }),
                ...!currentcountry.isAreaCodeRequired && ({ number: address_Details.mobile }),
                pre: address_Details.mobile.slice(0, -currentcountry.number_count)
            })
        }

    }, [address_header])

    const handleSubmit = async () => {
        if (isClickable) {
            var address_Details = addresslistdata?.data?.find(ele => ele.idaddress == address_header);
            if (address_header != 0 && (currentcountry.isAreaCodeRequired ? (formValues.pre + formValues.number) : formValues.number) == address_Details.mobile) {
                finalSubmit()
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
        dispatch(setAddressButtonLoading(true));
        const input_data = {
            idaddress: address_header,
            first_name: formValues.name,
            last_name: "",
            address: formValues.address,
            address2: formValues.address2,
            ...(currentcountry.isAreaCodeRequired ? {
                pre: formValues.pre || 50,
                mobile: `${formValues.pre || 50}${formValues.number}`
            } : {
                mobile: formValues.number
            }),
            emirate: formValues.emirate,
            area: formValues.area,
            building_name: "",
            latitude: location.lat,
            longitude: location.lng,
            status: 0,
            default_address: formValues.default_address ? true : false
        };
        await dispatch(postUserAddress(input_data));

        dispatch(getalladdressesapi(0));
        dispatch(setAddressButtonLoading(false));
        dispatch(setformstatus(0));
        dispatch(setcheckemailerror(""));
        dispatch(setformmodal(false));
    }

    useEffect(() => {
        if (isClickable && addressnumber) {
            finalSubmit()
        }
    }, [addressnumber]);

    const [permissionGuide, setPermissionGuide] = useState(false)
    const getLocation = async () => {
        const res = await handleLocateme();
        if (res === "denied") {
            setPermissionGuide(true);
        } else {
            setPermissionGuide(false)
        }
    }

    return (
        <div className="address_form">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                libraries={["drawing", "places"]}
            >

                <Row className="m-2">
                    <Col lg={6}>
                        {
                            !loading1 && Object.keys(location).length > 0 &&






                            <div className="position-relative">
                                <GoogleMap
                                    center={location}
                                    zoom={18}
                                    mapContainerStyle={{ height: 500, width: '100%', borderRadius: 15 }}
                                // onClick={(event) => setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() })}
                                >

                                    <>
                                        <MarkerF
                                            position={location}
                                            draggable={true}
                                            icon={{
                                                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                scaledSize: { width: 48, height: 48 },
                                                anchor: { x: 24, y: 48 },
                                            }}
                                            // onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                        />
                                    </>


                                </GoogleMap>

                                <div className="position-absolute locate_me_btn" onClick={getLocation}>
                                    Locate me <span className="ps-2"><PiGps size={18} color='rgba(25, 27, 28, 1)' /></span>
                                </div>
                                {
                                    permissionGuide &&
                                    <LocateMe getLocation={getLocation} showGuide={permissionGuide} setShowGuide={setPermissionGuide} />
                                }
                            </div>

                        }
                    </Col>
                    <Col lg={6}>
                        <Row>
                            <div className="address_form_header mb-4">
                                <h5>{address_header == 0 ? 'Add Address' : 'Update Address'}</h5>
                                <h6>Enter your delivery address below</h6>

                                <PlacesAutocomplete value={address} onChange={setAddres} onSelect={handleSelect}>
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (


                                        <div className="position-relative">

                                            <div className="address_search_input_box d-flex align-items-center ">
                                                <CiSearch color='rgba(206, 210, 212, 1)' size={20} />
                                                <input
                                                    {...getInputProps({
                                                        placeholder: 'Search your landmark/Location',
                                                        className: 'ms-1'
                                                    })}
                                                />

                                            </div >

                                            {
                                                suggestions.length > 0 &&
                                                <div className="search_location_dropdown">
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map((suggestion) => {
                                                        const className = suggestion.active ? 'suggestion-item--active suggestion-item' : 'suggestion-item';
                                                        // Modify the styling as per your requirement

                                                        return (
                                                            <div
                                                                {...getSuggestionItemProps(suggestion, {
                                                                    className,
                                                                })}

                                                            >
                                                                {suggestion.description}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            }

                                        </div>


                                    )}
                                </PlacesAutocomplete>
                            </div>
                            <Col lg={12}>
                                <InputBox1 name='name' placeholder="Name" handleChange={handleChange} value={formValues.name} />
                            </Col>
                            <Col lg={2}>
                                <InputBox1 name='country_code' handleChange={handleChange} value={currentcountry.country_code} />
                            </Col>
                            {
                                currentcountry.isAreaCodeRequired &&
                                <Col lg={3}>

                                    <select className="address_input_box" name='pre' onChange={handleLocationChange} value={formValues.pre}>
                                        <option value={50}>{50}</option>
                                        {
                                            [52, 54, 55, 56, 58].map((number) => {
                                                return (
                                                    <option value={number}>{number}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </Col>
                            }


                            <Col lg={currentcountry.isAreaCodeRequired ? 7 : 10}>
                                <InputBox1 type='number' name='number' handleChange={handleChange} placeholder="Enter Mobile Number" value={formValues.number} />
                            </Col>

                            <Col lg={6}>
                                <select className="address_input_box" name='emirate' onChange={handleLocationChange} value={formValues.emirate}>
                                    <option value={null}>Select location</option>
                                    {
                                        locationsdata.map((data) => {
                                            return (
                                                <option value={data.id}>{data.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </Col>
                            <Col lg={6}>
                                <select className="address_input_box" name='area' onChange={handleLocationChange} value={formValues.area}>
                                    <option value={null}>Select Area</option>
                                    {
                                        areadata.map((data) => {
                                            return (
                                                <option value={data.id}>{data.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </Col>
                            <Col lg={12}>
                                <InputBox1 name='address' placeholder="Flat no., House no., Building, landmark" handleChange={handleChange} value={formValues.address} />
                            </Col>

                            <Col lg={12} className="mb-3">
                                <div><input type='checkbox' id="id_Checked" checked={formValues.default_address} onChange={(e) => {
                                    setFormValues({
                                        ...formValues,
                                        default_address: e.target.checked
                                    })
                                }} /><label className="ms-2 cursor-pointer" htmlFor="id_Checked">Make this is my default address</label></div>
                            </Col>

                            <button className="address_btn" onClick={handleSubmit} style={{ background: isClickable && 'var(--primary_color)', color: isClickable && '#fff', cursor: !isClickable && 'not-allowed' }}>
                                Add Address
                                {
                                    addressButtonLoader &&
                                    <ClipLoader className="ms-3" size={16} color={'#fff'} />
                                }
                            </button>
                        </Row>

                    </Col>
                </Row>
            </LoadScript>

        </div>
    )
}
export default AddressForm;