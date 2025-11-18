"use client";
import React, { useState } from "react";
import Inputbox from "./Inputbox";
import Formvalidation from "../Validation/Formvalidation";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordapi } from "../../redux/formslice";
import { useContent, useCurrentLanguage } from "@/hooks";

const Changepassword = () => {
  const dispatch = useDispatch();
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  // Get translated content
  const oldPassword = useContent("forms.oldPassword") || "Old Password";
  const newPassword = useContent("forms.newPassword") || "New Password";
  const confirmNewPassword = useContent("forms.confirmNewPassword") || "Confirm New Password";
  const passwordDidntMatch = useContent("forms.passwordDidntMatch") || "Password didn't match";
  const changePassword = useContent("buttons.changePassword") || "Change Password";

  //  const changePasswordapidata = useSelector(state => state.addresslice.changePasswordapidata);
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    ConfirmNewpassword: "",
  });

  const [errors, setErrors] = useState({});
  const changePasswordapidata = useSelector(state => state.formslice.changePasswordapidata);
  const handleNext = () => {
    const { oldpassword, newpassword } = formData;
    dispatch(changePasswordapi({ old_password:oldpassword, new_password:newpassword }));
  };
  

  const { handleChange, handleSubmit } = Formvalidation(
    formData,
    setFormData,
    setErrors,
    handleNext
  );

  const isFormValid =
    formData.oldpassword &&
    formData.newpassword &&
    formData.ConfirmNewpassword &&
    formData.newpassword === formData.ConfirmNewpassword;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Inputbox
        id="oldpassword"
        type="password"
        placeholder={oldPassword}
        value={formData.oldpassword}
        handleChange={handleChange}
        error={errors.oldpassword}
      />
      <Inputbox
        id="newpassword"
        type="password"
        placeholder={newPassword}
        value={formData.newpassword}
        handleChange={handleChange}
        // error={formData.newpassword != formData.ConfirmNewpassword && "password"}
      />
      <Inputbox
        id="ConfirmNewpassword"
        type="password"
        placeholder={confirmNewPassword}
        value={formData.ConfirmNewpassword}
        handleChange={handleChange}
        error={formData.ConfirmNewpassword.length == formData.newpassword.length && formData.newpassword != formData.ConfirmNewpassword && passwordDidntMatch}
      />
      <div className="submitmsg">{changePasswordapidata}</div>
      <div className="d-flex justify-content-end">
        <div
          className={
            isFormValid
              ? "activeformsubmitbutton profileviewsubmitbtn"
              : "formsubmitbutton profileviewsubmitbtn"
          }
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          {changePassword}
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
