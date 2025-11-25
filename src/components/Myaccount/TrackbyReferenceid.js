import React, { useState } from "react";
import Inputbox from "@/components/Common/Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { MediaQueries } from "@/components/utils";
import BreadComp from "@/components/Myaccount/BreadComp";
import Orders from "../Common/Orders";
import { useContent, useCurrentLanguage } from "@/hooks";
import { trackdatabyreferencid } from "@/api/user";

const TrackbyReferenceid = () => {
  const currentLanguage = useCurrentLanguage();
  const trackYourOrderText = useContent("pages.trackYourOrder");
  const trackByReferenceIdText = useContent("account.trackByReferenceId");
  const referenceIdText = useContent("forms.referenceId");
  const fetchingOrderDetails = useContent("orders.fetchingOrderDetails");
  const enterReferenceIdText = useContent("forms.enterReferenceId");
  const noOrdersFound = useContent("orders.noOrdersFound");
  const submitText = useContent("buttons.submit");

  const { isMobile } = MediaQueries();
  const [formData, setFormData] = useState({
    referenceid: "",
  });
  const [errors, setErrors] = useState({});
  const [trackorderlistdata, setTrackorderlistdata] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const isFormValid = () => formData.referenceid.trim() !== "";

  const handleNext = async () => {
    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const res = await trackdatabyreferencid({
        referenceid: formData.referenceid.trim(),
      });
      setTrackorderlistdata(res);
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          "Unable to fetch order details. Please try again."
      );
      setTrackorderlistdata(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  const showNoOrders =
    trackorderlistdata &&
    Array.isArray(trackorderlistdata?.data) &&
    trackorderlistdata.data.length === 0 &&
    !isLoading;

  const showOrders =
    trackorderlistdata &&
    Array.isArray(trackorderlistdata?.data) &&
    trackorderlistdata.data.length > 0;

  return (
    <div
      className="ms-2 me-2 mb-2"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {isMobile && (
        <>
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
      <div
        className={`d-flex ${
          currentLanguage === "ar"
            ? "justify-content-start"
            : "justify-content-end"
        }`}
      >
        <div
          className={
            isFormValid()
              ? "activeformsubmitbutton profileviewsubmitbtn cursor-pointer"
              : "formsubmitbutton profileviewsubmitbtn cursor-pointer"
          }
          onClick={isFormValid() && !isLoading ? handleSubmit : null}
          aria-disabled={!isFormValid() || isLoading}
        >
          {isLoading ? `${submitText}...` : submitText}
        </div>
      </div>

      {apiError && (
        <div className="text-center text-red-500 mt-4">{apiError}</div>
      )}

      {isLoading && (
        <div className="text-center py-10 text-gray-500">
          {fetchingOrderDetails}
        </div>
      )}

      {showNoOrders && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-gray-600">{noOrdersFound}</p>
        </div>
      )}

      {showOrders && !isLoading && (
        <Orders orderlistdata={trackorderlistdata} />
      )}
    </div>
  );
};

export default TrackbyReferenceid;
