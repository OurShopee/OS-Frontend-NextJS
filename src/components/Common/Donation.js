import React, { useEffect } from "react";
import infoimg from "@/images/Info Square.png";
import donateimg1 from "@/images/Frame 1321316476.png";
import donateimg2 from "@/images/Frame 1321316477.png";
import { useSelector, useDispatch } from "react-redux";
import { setdonationfee, setshowdonation } from "@/redux/paymentslice";
import { useContent, useCurrentLanguage } from "@/hooks";

const Donation = ({ donation }) => {
  const donateAndMakeADifference = useContent("checkout.donateAndMakeADifference");
  const enterAmountManually = useContent("checkout.enterAmountManually");
  const donationfee = useSelector((state) => state.paymentslice.donationfee);
  const showdonation = useSelector((state) => state.paymentslice.showdonation);
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  useEffect(() => {
    dispatch(setshowdonation(true));
  }, [dispatch]);

  useEffect(() => {
    if (!showdonation) {
      dispatch(setdonationfee("0"));
    }
  }, [showdonation, dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 3) {
      dispatch(setdonationfee(numericValue));
      if (numericValue === "" || numericValue === "0") {
        dispatch(setshowdonation(false));
      }
    }
  };

  const handleCheckboxToggle = () => {
    const newShowDonation = !showdonation;
    dispatch(setshowdonation(newShowDonation));
    if (!newShowDonation) {
      dispatch(setdonationfee("0"));
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className={`donate-titleclass ${isRTL ? "text-end" : ""}`}>
        <div
          className={`d-flex align-items-center justify-content-center ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <input
            type="checkbox"
            className="donatecheckbox"
            checked={showdonation}
            onChange={handleCheckboxToggle}
          />
          {donateAndMakeADifference}
        </div>
        <img src={infoimg.src} alt="info" />
      </div>

      <div className={`ps-3 flex ${isRTL ? "flex-row-reverse gap-2 justify-end" : "gap-2"}`}>
        <img src={donateimg1.src} alt="donation1" />
        <img src={donateimg2.src} alt="donation2" />
      </div>

      <div>
        <input
          type="text"
          placeholder={enterAmountManually}
          className={`donate-input ${isRTL ? "text-end" : "text-start"}`}
          value={donationfee}
          onChange={handleChange}
          disabled={!showdonation}
          inputMode="numeric"
          maxLength={4}
        />
      </div>
    </div>
  );
};

export default Donation;
