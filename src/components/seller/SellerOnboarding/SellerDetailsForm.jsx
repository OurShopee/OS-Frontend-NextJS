import React, { useState } from "react";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import DoubleGradientButton from "@/components/Common/DoubleGradientButton";
import { sent_mobile_email_otp } from "@/api/seller";
import { toast } from "react-toastify";

const docFields = [
  { label: "Trade License / Commercial Registration", name: "trade_license" },
  { label: "VAT Certificate", name: "vat_certificate" },
  { label: "National ID or Passport Copy", name: "identity_card" },
  { label: "Bank Account Documents / IBAN Letter", name: "bank_details" },
];

const SellerDetailsForm = ({ formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (name, newFiles) => {
    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    let newErrors = { ...errors };
    let validFiles = [];

    if (newFiles.length > maxFiles) {
      newErrors[name] = `You can upload a maximum of ${maxFiles} files.`;
      setErrors(newErrors);
      return;
    }

    for (const file of newFiles) {
      if (file.size > maxFileSize) {
        newErrors[name] = `${file.name} exceeds the maximum size of 10MB.`;
        setErrors(newErrors);
        return;
      }
      validFiles.push(file);
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((fd) => ({
      ...fd,
      [name]: validFiles,
    }));
  };
  const handlePhoneNumberChange = (status, value, country, number) => {
    const digitsOnly = String(value || "").replace(/\D/g, "");
    const cleaned = digitsOnly.slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      contact_phone: cleaned,
      formattedPhone: cleaned, // or keep `number` if you need formatting
    }));

    setErrors((prev) => ({
      ...prev,
      contact_phone: status ? "" : "Invalid phone number",
      numberStatus: status,
    }));
  };

  const handlePhoneNumberBlur = (status) => {
    setFormData((prev) => ({ ...prev, contact_phone: prev.formattedPhone }));
    if (!status) {
      setErrors((prev) => ({
        ...prev,
        contact_phone: "Invalid phone number",
        numberStatus: false,
      }));
    } else {
      setErrors((prev) => ({ ...prev, contact_phone: "", numberStatus: true }));
    }
  };

  const createBinaryFormData = () => {
    const formDataObj = new FormData();

    formDataObj.append("contact_person", formData.contact_person || "");
    formDataObj.append("contact_phone", formData.contact_phone || "");
    formDataObj.append("email", formData.email || "");

    Object.keys(formData).forEach((key) => {
      if (
        !docFields.some((doc) => doc.name === key) &&
        ![
          "contact_person",
          "contact_phone",
          "email",
          "formattedPhone",
        ].includes(key)
      ) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataObj.append(key, formData[key]);
        }
      }
    });

    docFields.forEach((doc) => {
      const files = formData[doc.name];
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formDataObj.append(doc.name, file);
        });
      }
    });

    return formDataObj;
  };

  const sendOTP = async (email, phoneNumber) => {
    try {
      let inputdata = {
        email: email,
        mobile: phoneNumber,
      };
      const response = await sent_mobile_email_otp(inputdata);

      if (response.data.status != "success") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success(response.data.message);
      return response;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.contact_person) newErrors.contact_person = "Name required";

    if (!formData.contact_phone || formData.contact_phone.trim() === "") {
      newErrors.contact_phone = "Mobile number is required";
      newErrors.numberStatus = false;
    } else if (!errors.numberStatus) {
      newErrors.contact_phone = "Invalid phone number";
      newErrors.numberStatus = false;
    }

    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        await sendOTP(
          formData.email,
          formData.contact_phone.replace(/[\s+]/g, "")
        );

        const binaryData = createBinaryFormData();

        onNext({
          ...formData,
          _binaryFormData: binaryData,
        });
      } catch (error) {
        setErrors({
          api: "Failed to send OTP. Please try again.",
        });
        console.error("OTP sending failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailBlur = () => {
    const emailValue = formData?.email || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailRegex.test(emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h2 className="font-bold text-3xl">Sign up</h2>
      <p className="mb-2 text-mygray">
        Become a seller with OurShopee in easy steps…
      </p>

      {errors.api && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.api}
        </div>
      )}

      <div>
        <label className="font-bold">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          className="block border rounded-[4px] px-4 py-2 w-full mt-2 input-focus"
          type="text"
          required
          maxLength={50}
          value={formData.contact_person || ""}
          onChange={(e) =>
            setFormData((fd) => ({
              ...fd,

              contact_person: e.target.value.replace(/[^A-Za-z\s]/g, ""),
            }))
          }
          placeholder="Enter your name"
        />
        {errors.contact_person && (
          <p className="text-red-500 text-sm">{errors.contact_person}</p>
        )}
      </div>

      <div>
        <label className="font-bold">
          Mobile Number<span className="text-red-500">*</span>
        </label>
        <div className="mt-2 w-full">
          <IntlTelInput
            preferredCountries={["ae", "in", "us"]}
            defaultCountry="ae"
            value={formData?.contact_phone || ""}
            onPhoneNumberChange={handlePhoneNumberChange}
            onPhoneNumberBlur={handlePhoneNumberBlur}
            fieldName="contact_phone"
            inputClassName="w-full border rounded-[4px] py-2 outline-none focus:border-[#b9a6ff] input-focus"
          />
        </div>
        {errors.contact_phone && (
          <p className="text-red-500 text-sm">{errors.contact_phone}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="font-bold">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          className="block border rounded-[4px] px-4 py-2 w-full mt-2 input-focus"
          type="email"
          value={formData.email || ""}
          required
          maxLength={35}
          onChange={(e) => {
            setFormData((fd) => ({ ...fd, email: e.target.value }));
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          onBlur={handleEmailBlur}
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="">
        <h3 className="font-bold text-lg sm:text-[22px] mt-6 mb-0">
          Upload Documents
        </h3>
        <p className="mb-2 text-mygray text-sm sm:text-base">
          Accepted formats: PDF, JPG, PNG | Max size: 10MB
        </p>
        <hr className="mt-1 text-mygray" />
      </div>

      <div className="space-y-4">
        {docFields.map((doc) => {
          const fileList = formData[doc.name];
          const filesArray = fileList ? Array.from(fileList) : [];
          const fileNames = filesArray.map((f) => f.name).join(", ");

          return (
            <div key={doc.name}>
              <label className="block font-semibold sm:font-bold mb-1">
                {doc.label}{" "}
                <span className="font-medium text-gray-400">(Optional)</span>
              </label>
              <div className="flex items-center h-12 w-full rounded-[4px] overflow-hidden input-focus">
                <input
                  id={`file-upload-${doc.name}`}
                  type="file"
                  multiple
                  className="hidden"
                  accept="
                    application/pdf,
                    image/jpeg,
                    image/png,
                  "
                  onChange={(e) => handleFileChange(doc.name, e.target.files)}
                />
                <div
                  style={{ borderRight: "none", border: "1px solid #fcfcfc" }}
                  className="flex-1 text-gray-600 px-4 h-full flex items-center text-base cursor-pointer bg-white rounded-l-[4px] whitespace-nowrap overflow-hidden text-ellipsis"
                  title={fileNames.length ? fileNames : "Browse file to upload"}
                  onClick={() =>
                    document.getElementById(`file-upload-${doc.name}`).click()
                  }
                >
                  {fileNames.length ? fileNames : "Browse file to upload"}
                </div>
                <label
                  htmlFor={`file-upload-${doc.name}`}
                  className="bg-gradient-to-b from-[#8E6FFD] to-[#4C2EB8] text-white font-medium rounded-none text-base h-full px-5 flex items-center cursor-pointer transition-colors"
                  style={{
                    borderTopRightRadius: "0.5rem",
                    borderBottomRightRadius: "0.5rem",
                  }}
                >
                  <img
                    src="/assets/seller/attach_file.png"
                    alt=""
                    className="w-2.5 h-3.5"
                  />{" "}
                  &nbsp; Choose file
                </label>
              </div>
              {errors[doc.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[doc.name]}</p>
              )}
            </div>
          );
        })}
      </div>

      <DoubleGradientButton
        title={isLoading ? "Sending OTP..." : "Next"}
        disabled={isLoading}
      />
    </form>
  );
};

export default SellerDetailsForm;
