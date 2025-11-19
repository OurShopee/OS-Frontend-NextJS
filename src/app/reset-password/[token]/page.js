"use client";

import { get_VelidateResetToken, post_changePassword } from "@/api/user";
import Inputbox from "@/components/Common/Inputbox";
import Formvalidation from "@/components/Validation/Formvalidation";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useContent, useCurrentLanguage } from "@/hooks";

const Resetpassword = () => {
  const currentLanguage = useCurrentLanguage();
  const resetPassword = useContent("forms.resetPassword");
  const pleaseEnterNewPasswordBelow = useContent("forms.pleaseEnterNewPasswordBelow");
  const newPassword = useContent("forms.newPassword");
  const confirmNewPassword = useContent("forms.confirmNewPassword");
  const passwordDidntMatch = useContent("forms.passwordDidntMatch");
  const router = useRouter();
  const params = useParams();
  const token = params?.token;

  const [formData, setFormData] = useState({
    newpassword: "",
    ConfirmNewpassword: "",
  });

  const [errors, setErrors] = useState({});
  const changePasswordapidata = useSelector(
    (state) => state.formslice.changePasswordapidata
  );

  const handleNext = async () => {
    const { newpassword, ConfirmNewpassword } = formData;
    const input_data = {
      token: token,
      password: newpassword,
      confirm_password: ConfirmNewpassword,
    };
    const res = await post_changePassword(input_data);
    if (res.data.status === "success") {
      toast.success(res.data.message);
      router.push("/");
    } else {
      toast.error(res.data.message);
    }
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
    <div className="resetpassword" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
      <div className="Resetpassword-main">
        <div>
          <div
            className="FormHeading"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            {resetPassword}
          </div>
          <div className="formsubheading resentbelowheading">
            {pleaseEnterNewPasswordBelow}
          </div>
          <div className="form-border-bottom"></div>
        </div>

        <Inputbox
          id="newpassword"
          type="password"
          placeholder={newPassword}
          value={formData.newpassword}
          handleChange={handleChange}
        />
        <Inputbox
          id="ConfirmNewpassword"
          type="password"
          placeholder={confirmNewPassword}
          value={formData.ConfirmNewpassword}
          handleChange={handleChange}
          error={
            formData.ConfirmNewpassword.length ===
              formData.newpassword.length &&
            formData.newpassword != formData.ConfirmNewpassword &&
            passwordDidntMatch
          }
        />
        <div className="submitmsg">{changePasswordapidata}</div>
        <div className={`d-flex ${currentLanguage === "ar" ? "justify-content-start" : "justify-content-end"}`}>
          <div
            className={
              isFormValid
                ? "activeformsubmitbutton cursor-pointer"
                : "formsubmitbutton cursor-pointer "
            }
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {resetPassword}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
