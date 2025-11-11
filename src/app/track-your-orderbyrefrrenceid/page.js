"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Inputbox from "@/components/Common/Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { trackdatabyreferencidapi } from "@/redux/formslice";
import { MediaQueries } from "@/components/utils";
import BreadComp from "@/components/Myaccount/BreadComp";
import Orders from "@/components/Common/Orders";
import { useContent, useCurrentLanguage } from "@/hooks";

const TrackbyReferenceid = () => {
  const currentLanguage = useCurrentLanguage();
  const trackYourOrderText = useContent("helpCenter.trackYourOrder");
  const trackByReferenceIdText = useContent("account.trackByReferenceId");
  const referenceIdText = useContent("forms.referenceId");
  const enterReferenceIdText = useContent("forms.enterReferenceId");
  const submitText = useContent("buttons.submit");
  const { isMobile } = MediaQueries();
  const dispatch = useDispatch();
  const trackorderlistdata = useSelector(
    (state) => state.formslice.trackorderlistdata
  );
  const [formData, setFormData] = useState({
    referenceid: "",
  });
  const [errors, setErrors] = useState({});

  const isFormValid = () => {
    return formData.referenceid.trim() !== "";
  };

  const handleNext = () => {
    if (!isFormValid()) return;

    const input_data = {
      referenceid: formData.referenceid,
    };

    // Dispatch the track order action here (replace with your actual action)
    dispatch(trackdatabyreferencidapi(input_data));
  };

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  return (
    <div className="ms-2 me-2 mb-2" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      {isMobile && (
        <>
          {" "}
          <BreadComp title={trackYourOrderText} />
          <div className="page-titile">{trackYourOrderText}</div>
        </>
      )}
      <div className="mytractrightside order-trackcard">
        <div className="ordrtract-title">{trackByReferenceIdText}</div>
        <Inputbox
          id="referenceid"
          type="text"
          value={formData.referenceid}
          handleChange={handleChange}
          placeholder={enterReferenceIdText}
          title={referenceIdText}
          error={errors.referenceid}
        />
      </div>
      <div className={`d-flex ${currentLanguage === "ar" ? "justify-content-start" : "justify-content-end"}`}>
        <div
          className={
            isFormValid()
              ? "activeformsubmitbutton profileviewsubmitbtn cursor-pointer"
              : "formsubmitbutton profileviewsubmitbtn cursor-pointer"
          }
          onClick={isFormValid() ? handleSubmit : null}
        >
          {submitText}
        </div>
      </div>
      <Orders orderlistdata={trackorderlistdata} />
    </div>
  );
};

export default TrackbyReferenceid;
