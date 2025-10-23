"use client";
import React, { useState } from 'react';
import Inputbox from '../Common/Inputbox';
import TextareaBox from '../Common/TextareaBox';
import Formvalidation from "../Validation/Formvalidation";
import BreadComp from './BreadComp';
import { MediaQueries } from "../../components/utils";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { addComplaint } from '@/api/others';
const PlacecomplaintForm = () => {
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);

    const { isMobile } = MediaQueries();
    const router = useRouter();

    const [formData, setFormData] = useState({
        orderid: "",
        email: "",
        mobile: "",
        comments: ""
    });

    const [errors, setErrors] = useState({});

    const isFormValid = () => {
        const validEmail = /^\S+@\S+\.\S+$/.test(formData.email);
        const validMobile = new RegExp(`^\\d{${currentcountry.isAreaCodeRequired ? 9 : currentcountry.number_count}}$`).test(formData.mobile);

        return (
            formData.orderid &&
            validEmail &&
            validMobile &&
            formData.comments.trim() !== ""
        );
    };

    const handleNext = async () => {
        if (!isFormValid()) return;

        const input_data = {
            mobile: formData.mobile,
            invoice: formData.orderid,
            email: formData.email,
            comment: formData.comments
        };
        console.log("input_data",input_data)
        const response = await addComplaint(input_data);
        console.log("tes",response)
        if (response.status === false) {
            toast.error(response?.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            router.push(`/success-complaints?complaint_id=${response.data.complaint_id}`)
        }
    };

    // OMRSSOP3236

    const { handleChange, handleSubmit } = Formvalidation(
        formData,
        setFormData,
        setErrors,
        handleNext
    );

    return (
        <div className=' mt-2 '>


            <div className={`${isMobile ? "" : 'mytractrightside'}`}>
                <Inputbox
                    id="orderid"
                    type="text"
                    value={formData.orderid}
                    handleChange={handleChange}
                    placeholder="Enter Order Id"
                    title="Order id"
                    error={errors.orderid}
                />

                <Inputbox
                    id="mobile"
                    type="text"
                    value={formData.mobile}
                    name={'mobile'}
                    handleChange={handleChange}
                    placeholder="Enter your mobile number"
                    title="Mobile"
                    error={errors.mobile}
                />

                <Inputbox
                    id="email"
                    type="email"
                    value={formData.email}
                    handleChange={handleChange}
                    placeholder="Enter your email"
                    title="Email"
                    error={errors.email}
                />

                <TextareaBox
                    id="comments"
                    label="Comments"
                    placeholder="Write down your complaint."
                    value={formData.comments}
                    onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                    }
                    error={errors.comments}
                />
            </div>

            <div className="d-flex justify-content-end ">
                <span
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn cursor-pointer" : "formsubmitbutton profileviewsubmitbtn cursor-pointer"}
                    onClick={isFormValid() ? handleSubmit : null}
                >
                    Submit
                </span>
            </div>
        </div>
    );
};

export default PlacecomplaintForm;
