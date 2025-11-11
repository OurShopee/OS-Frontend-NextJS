"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Inputbox from '@/components/Common/Inputbox';
import PhoneInput from '@/components/Common/PhoneInput';
import Formvalidation from '@/components/Validation/Formvalidation';
import { trackdatabyorderidapi } from '@/redux/formslice';
import BreadComp from '@/components/Myaccount/BreadComp';
import { MediaQueries } from '@/components/utils';
import { useContent, useCurrentLanguage } from '@/hooks';

const Trackorderbyid = () => {
  const currentLanguage = useCurrentLanguage();
  const trackYourOrder = useContent("helpCenter.trackYourOrder");
  const trackByOrderId = useContent("forms.trackByOrderId");
  const enterOrderId = useContent("forms.enterOrderId");
  const orderId = useContent("forms.orderId");
  const phoneNumberTitle = useContent("forms.phoneNumber");
  const submit = useContent("buttons.submit");
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
        <div className='ms-2 me-2 mb-2' dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
        {
            isMobile &&
            <>   <BreadComp title={trackYourOrder} />
            <div className="page-titile">{trackYourOrder}
            </div></>
        }
         
            <div className="mytractrightside">
                <div className='ordrtract-title'>{trackByOrderId}</div>
                <Inputbox
                    id="orderid"
                    type="text"
                    value={formData.orderid}
                    handleChange={handleChange}
                    placeholder={enterOrderId}
                    title={orderId}
                    error={errors.orderid}
                />
                <PhoneInput
                    areaCode={areaCode}
                    setAreaCode={setAreaCode}
                    phoneNumber={phoneNumber}
                    handlePhoneInput={handlePhoneInput}
                    title={phoneNumberTitle}
                />

            </div>
            <div className={`d-flex ${currentLanguage === "ar" ? "justify-content-start" : "justify-content-end"}`}>
                <div
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn" : "formsubmitbutton profileviewsubmitbtn"}
                    onClick={isFormValid() ? handleSubmit : null}
                >
                    {submit}
                </div>
            </div>
        </div>
    );
};

export default Trackorderbyid;
