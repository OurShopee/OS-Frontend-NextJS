import React, { useState } from "react";
import Inputbox from "./Inputbox";
import Formvalidation from "../Validation/Formvalidation";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordapi } from "../../redux/formslice";

const Changepassword = () => {
  const dispatch = useDispatch();

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
    <div>
      <Inputbox
        id="oldpassword"
        type="password"
        placeholder="Old Password"
        value={formData.oldpassword}
        handleChange={handleChange}
        error={errors.oldpassword}
      />
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
        error={ formData.ConfirmNewpassword.length == formData.newpassword.length &&formData.newpassword != formData.ConfirmNewpassword && "Password didn’t match"}
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
          Change Password
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
