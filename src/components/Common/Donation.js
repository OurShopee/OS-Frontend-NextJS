import React, { useState } from "react";
import infoimg from "@/images/Info Square.png";
import donateimg1 from "@/images/Frame 1321316476.png";
import donateimg2 from "@/images/Frame 1321316477.png";
import { useSelector, useDispatch } from "react-redux";
import { setdonationfee, setshowdonation } from "@/redux/paymentslice";

const Donation = ({ donation }) => {
    const donationfee = useSelector((state) => state.paymentslice.donationfee);
    const showdonation = useSelector((state) => state.paymentslice.showdonation);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const value = e.target.value;
        // Only allow digits and limit to 3 characters
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 3) {
            dispatch(setdonationfee(numericValue));
            if (numericValue === '' || numericValue === '0') {
                dispatch(setshowdonation(false));
            }
        }
    };

    const handleCheckboxToggle = () => {
        const newShowDonation = !showdonation;
        dispatch(setshowdonation(newShowDonation));
        if (!newShowDonation) {
            dispatch(setdonationfee('0'));
        }
    };

    return (
        <div>
            <div className="donate-titleclass">
                <div className="d-flex align-items-center justify-content-center">
                    <input
                        type="checkbox"
                        className="donatecheckbox"
                        checked={showdonation}
                        onChange={handleCheckboxToggle}
                    />
                    Donate and make a difference
                </div>
                <img src={infoimg.src} alt="info" />
            </div>

            <div className="ps-3 flex">
                <img src={donateimg1.src} alt="donation1" />
                <img src={donateimg2.src} alt="donation2" />
            </div>

            <div>
                <input
                    type="text"
                    placeholder="ENTER AMOUNT MANUALLY"
                    className="donate-input"
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
