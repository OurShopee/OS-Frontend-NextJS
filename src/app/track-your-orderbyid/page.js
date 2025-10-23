"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Inputbox from '@/components/Common/Inputbox';
import PhoneInput from '@/components/Common/PhoneInput';
import Formvalidation from '@/components/Validation/Formvalidation';
import { trackdatabyorderidapi } from '@/redux/formslice';
import BreadComp from '@/components/Myaccount/BreadComp';
import { MediaQueries } from '@/components/utils';
import { useSelector } from 'react-redux';
const Trackorderbyid = () => {
        const { isMobile } = MediaQueries()
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        orderid: "",
    });
    const [areaCode, setAreaCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState({});

    const isFormValid = () => {
        return formData.orderid.trim() !== "" && phoneNumber.trim().length === currentcountry.number_count;
    };

    const handlePhoneInput = (e) => {
        setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, currentcountry.number_count));
    };

    const handleNext = () => {
        if (!isFormValid()) return;

        const input_data = {
            orderid: formData.orderid,
            phone: `${phoneNumber}`
        };

        // Dispatch the track order action here (you can replace this with your real one)
        dispatch(trackdatabyorderidapi(input_data));
    };

    const { handleChange, handleSubmit } = Formvalidation(
        formData,
        setFormData,
        setErrors,
        handleNext
    );

    return (
        <div className='ms-2 me-2 mb-2'>
        {
            isMobile &&
            <>   <BreadComp title={"Track your order"} />
            <div className="page-titile">Track your order
            </div></>
        }
         
            <div className="mytractrightside">
                <div className='ordrtract-title'>Track by Order ID</div>
                <Inputbox
                    id="orderid"
                    type="text"
                    value={formData.orderid}
                    handleChange={handleChange}
                    placeholder="Enter Order ID"
                    title="Order ID"
                    error={errors.orderid}
                />
                <PhoneInput
                    areaCode={areaCode}
                    setAreaCode={setAreaCode}
                    phoneNumber={phoneNumber}
                    handlePhoneInput={handlePhoneInput}
                    title="Phone Number"
                />

            </div>
            <div className="d-flex justify-content-end">
                <div
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn" : "formsubmitbutton profileviewsubmitbtn"}
                    onClick={isFormValid() ? handleSubmit : null}
                >
                    Submit
                </div>
            </div>
        </div>
    );
};

export default Trackorderbyid;
