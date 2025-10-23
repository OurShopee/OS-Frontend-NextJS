"use client";
import React, { useEffect, useState } from "react";
import Inputbox from "@/components/Common/Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { get_VelidateResetToken, post_changePassword } from "@/api/user";
import { toast } from "react-toastify";
// import { changePasswordapi } from "../../redux/formslice";

const Resetpassword = () => {
    const router = useRouter();
    const { token } = useParams();

    //  const changePasswordapidata = useSelector(state => state.addresslice.changePasswordapidata);
    const [formData, setFormData] = useState({

        newpassword: "",
        ConfirmNewpassword: "",
    });

    const [errors, setErrors] = useState({});
    const changePasswordapidata = useSelector(state => state.formslice.changePasswordapidata);
    const handleNext = async () => {
        const { newpassword, ConfirmNewpassword } = formData;
        const input_data = {
            token: token,
            password: newpassword,
            confirm_password: ConfirmNewpassword
        }
        const res = await post_changePassword(input_data)
        if (res.data.status === "success") {
            toast.success(res.data.message);
            router.push('/')
        }else{
            toast.error(res.data.message);
        }
        // dispatch(changePasswordapi({ old_password:oldpassword, new_password:newpassword }));
    };
    useEffect(() => {
        if (token) {
            const validateToken = async () => {
                try {
                    const res = await get_VelidateResetToken(token);
                    if (res.data.status === "failure") {
                        toast.error(res.data.message);
                        router.push("/");
                    }
                } catch (error) {
                    toast.error("Invalid or Expired reset token");
                    router.push("/");
                }
            };
            validateToken();
        }
    }, [token, router]);

    const { handleChange, handleSubmit } = Formvalidation(
        formData,
        setFormData,
        setErrors,
        handleNext
    );

    const isFormValid =

        formData.newpassword &&
        formData.ConfirmNewpassword &&
        formData.newpassword === formData.ConfirmNewpassword;

    return (
        <div className="resetpassword">
            <div className="Resetpassword-main">
                <div>
                    <div className="FormHeading" style={{ WebkitTextFillColor: "transparent" }}>Reset Password</div>
                    <div className="formsubheading resentbelowheading">Please enter your new password below</div>
                    <div className="form-border-bottom"></div>
                </div>

                <Inputbox
                    id="newpassword"
                    type="password"
                    placeholder="New Password"
                    value={formData.newpassword}
                    handleChange={handleChange}
                // error={formData.newpassword != formData.ConfirmNewpassword && "password"}
                />
                <Inputbox
                    id="ConfirmNewpassword"
                    type="password"
                    placeholder="Confirm New Password"
                    value={formData.ConfirmNewpassword}
                    handleChange={handleChange}
                    error={formData.ConfirmNewpassword.length === formData.newpassword.length && formData.newpassword != formData.ConfirmNewpassword && "Password didn’t match"}
                />
                <div className="submitmsg">{changePasswordapidata}</div>
                <div className="d-flex justify-content-end">
                    <div
                        className={
                            isFormValid
                                ? "activeformsubmitbutton tw-cursor-pointer"
                                : "formsubmitbutton tw-cursor-pointer "
                        }
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    >
                        Reset Password
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Resetpassword;
