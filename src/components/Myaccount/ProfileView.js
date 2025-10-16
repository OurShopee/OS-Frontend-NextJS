"use client"
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
    getMyProfileapi,
    getnationalitydata,
    updateMyProfileapi,
    checkmobileotpapi,
    setregistermobile,
    // resetChangeProfileNumber, // Optional: if you want to reset flag
} from "../../redux/formslice";

import Inputbox from "../Common/Inputbox";
import GenderDropdown from "../Common/GenderDropdown";
import NationalityDropdown from "../Common/NationalityDropdown";
import PhoneInput from "../Common/PhoneInput";
import Formvalidation from "../Validation/Formvalidation";

const ProfileView = () => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [areaCode, setAreaCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneTouched, setPhoneTouched] = useState(false);

    const nationalitydata = useSelector((state) => state.formslice.nationalitydata);
    const user = useSelector((state) => state.formslice.user);
    const changeprifilenumber = useSelector((state) => state.formslice.changeprifilenumber);
    const profilenotupdate = useSelector((state) => state.formslice.profilenotupdate);
    const updateMyProfileapidata = useSelector((state) => state.formslice.updateMyProfileapidata);
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        nationality: "",
        email: "",
        mobile: "",
        password: "",
        agreeTerms: false,
        offersale: false,
    });

    useEffect(() => {
        dispatch(getMyProfileapi());
        dispatch(getnationalitydata());
    }, [dispatch]);

    useEffect(() => {
        if (user && !changeprifilenumber) {
            const mobile = user.mobile || "";
            const code = mobile.slice(0, 2);
            const number = mobile.length > currentcountry.number_count ? mobile.slice(-currentcountry.number_count) : mobile;

            setAreaCode(code);
            setPhoneNumber(number);
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                gender: user.gender || "",
                nationality: user.nationality || "",
                email: user.email || "",
                mobile: user.mobile || "",
                agreeTerms: false,
                offersale: false,
            });
        }
    }, [user, profilenotupdate]);

    const handlePhoneInput = (e) => {
        setPhoneTouched(true);
        setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, currentcountry.number_count));
    };

    useEffect(() => {
        if (phoneTouched && phoneNumber.length === currentcountry.number_count) {
            // const mobileNumber = `${areaCode}${phoneNumber}`;
            if(currentcountry.isAreaCodeRequired){
                var mobileNumber = `${areaCode}${phoneNumber}`;
            }else{
                var mobileNumber = `${phoneNumber}`;
            }
            if (user.mobile != mobileNumber) {
                dispatch(checkmobileotpapi({ mobile: mobileNumber }));
            }

            dispatch(setregistermobile(mobileNumber));
        }
    }, [phoneNumber, areaCode, phoneTouched]);

    useEffect(() => {
        if (changeprifilenumber) {
            const updatedMobile = `${areaCode}${phoneNumber}`;
            setFormData((prev) => ({
                ...prev,
                mobile: updatedMobile,
            }));
            // Optional: reset the flag if needed
            // dispatch(resetChangeProfileNumber());
        }
    }, [changeprifilenumber]);

    const isFormValid = () =>
        formData.first_name &&
        formData.last_name &&
        formData.gender &&
        formData.nationality &&
        formData.email &&
        phoneNumber.length === currentcountry.number_count;

    const handleNext = () => {
        if (!isFormValid()) return;

        const input_data = {
            ...formData,
        };

        dispatch(updateMyProfileapi(input_data));

    };

    const { handleChange, handleSubmit } = Formvalidation(
        formData,
        setFormData,
        setErrors,
        handleNext
    );

    return (
        <Row className="">
            <Col lg={6} md={12}>
                <Inputbox
                    id="first_name"
                    type="text"
                    title="First Name"
                    value={formData.first_name}
                    handleChange={handleChange}
                    error={errors.first_name}
                />
            </Col>
            <Col lg={6} md={12}>
                <Inputbox
                    id="last_name"
                    type="text"
                    title="Last Name"
                    value={formData.last_name}
                    handleChange={handleChange}
                    error={errors.last_name}
                />
            </Col>

            <Col lg={6} md={12}>
                <GenderDropdown
                    title="Gender"
                    selectedGender={formData.gender}
                    onSelect={(gender) => setFormData((prev) => ({ ...prev, gender }))}
                    error={errors.gender}
                />
            </Col>

            <Col lg={6} md={12}>
                <NationalityDropdown
                    nationalitydata={nationalitydata}
                    title="Nationality"
                    selectedNationality={formData.nationality}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, nationality: value }))}
                    error={errors.nationality}
                />
            </Col>
            <Col lg={12} md={12}>
                <PhoneInput
                    areaCode={areaCode}
                    title="Phone number"
                    setAreaCode={setAreaCode}
                    phoneNumber={phoneNumber}
                    handlePhoneInput={handlePhoneInput}
                    error={errors.phoneNumber}
                />
            </Col>
            <Col lg={12} md={12}>
                <Inputbox
                    id="email"
                    type="email"
                    title="Email"
                    value={formData.email}
                    handleChange={handleChange}
                    placeholder="Enter Email"
                    error={errors.email}
                />
            </Col>
            {
                <div className="submitmsg">{updateMyProfileapidata}</div>
            }

            <div className="d-flex justify-content-end" >
                <div
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn" : "formsubmitbutton profileviewsubmitbtn"}
                    onClick={isFormValid() ? handleSubmit : null}
                    style={{cursor: "pointer" }}
                >
                    Update Profile
                </div>
            </div>

        </Row>
    );
};

export default ProfileView;
