"use client"
import { Loader } from "lucide-react";
import { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMailSharp } from "react-icons/io5";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { toast } from "react-toastify";
import MediaQueries from "../../utils/MediaQueries";

export default function ContactCard() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: "", email: "" });
  const { isMobile } = MediaQueries();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** PHONE **/
  const handlePhoneNumberChange = (status, value, country, number) => {
    setFormData({
      ...formData,
      phoneNumber: value,
      formattedPhone: number,
    });
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const handlePhoneNumberBlur = (status) => {
    setFormData((prev) => ({ ...prev, phoneNumber: prev.formattedPhone }));
    console.log(formData?.phoneNumber, status);
    if (formData?.phoneNumber && !status) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Invalid phone number",
        numberStatus: status,
      }));
    }
    if (status) {
      setErrors((prev) => ({ ...prev, phoneNumber: "", numberStatus: true }));
    }
  };

  /** EMAIL **/
  const handleEmailBlur = () => {
    const emailValue = formData?.email || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple regex email pattern
    if (emailValue && !emailRegex.test(emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let hasError = false;
    let newErrors = { phoneNumber: "", email: "", numberStatus: true };
    // If email empty or invalid
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email address";
        hasError = true;
      }
    }
    // If phoneNumber empty
    if (!errors.numberStatus) {
      newErrors.phoneNumber = "Invalid phone number";
      newErrors.numberStatus = false;
      hasError = true;
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required";
      newErrors.numberStatus = false;
      hasError = true;
    }
    setErrors(newErrors);

    // Prevent submit if any error
    if (hasError) {
      console.warn("Form not submitted due to errors:", newErrors);
      return;
    }
    // If everything is valid
    try {
      const res = await submitSellerEnquiry(formData);

      if (res?.data?.status === "success") {
        setLoading(false);
        setSubmitted(true);
        // toast.success("Form submitted successfully!");
        setFormData({});
      } else {
        setLoading(false);
        toast.error("Failed to submit form");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // setInterval(() => {
  //   setSubmitted(!submitted)
  // }, 5000);

  return (
    <div
      id="contact-form"
      className="relative w-full flex py-5 xl:py-20 items-center justify-center bg-transparent z-10"
    >
      {!isMobile && (
        <>
          <div className="circle1 absolute rounded-full z-[-1]"></div>
          <div className="circle2 absolute rounded-full z-[-1]"></div>
          <div className="circle3 absolute rounded-full z-[-1]"></div>
        </>
      )}
      <div className="circle4 absolute rounded-full z-[-1]"></div>

      {/* Card */}
      <div
        className={`${
          submitted && "h-96"
        } relative card-border z-10 !rounded-[20px] xl:!rounded-[28px] overflow-hidden shadow-[0_6px_32px_rgba(80,50,200,0.14)] xl:px-12 p-5 xl:py-12 max-w-[95%] xl:max-w-[76%] w-full`}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center text-center 
              transition-opacity duration-500 ease-out
              ${submitted ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div>
            <FaRegCircleCheck className="text-5xl text-green-500" />
            <p className="text-2xl xl:text-3xl text-green-600 xl:max-w-[70%] m-auto mt-10">
              Your enquiry has been submitted — our team will get back to you
              shortly!
            </p>
          </div>
        </div>
        {!submitted && (
          <>
            <h2 className="text-xl text-center xl:text-start xl:text-4xl font-semibold xl:mb-8">
              Contact Us
            </h2>

            <div className="flex xl:gap-20 md:flex-row flex-col">
              {/* Left Info */}
              <div className="flex-[.8]">
                <p className="font-medium xl:text-xl xl:mb-8 flex items-center justify-center xl:justify-start gap-2">
                  <IoMailSharp className="text-2xl xl:text-3xl text-[#434343]" />
                  support@ourshopee.com
                </p>
                <p className="text-sm xl:text-base text-gray-700">
                  Ourshopee support team is hard working 24/7 for our customers.
                  We give high priority to troubleshoot and sort out all the
                  complaints and issues of our customers.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col gap-2 xl:gap-8"
              >
                {/* First + Last Name */}
                <div className="flex gap-2 xl:gap-8 flex-col xl:flex-row">
                  <div className="flex-1">
                    <label className="block font-medium text-lg">
                      First Name
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData?.firstName || ""}
                      name="firstName"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-[#3A3A3A] 
                  outline-none px-0 pb-2 placeholder-gray-400 focus:border-b-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium text-lg">
                      Last Name
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData?.lastName || ""}
                      name="lastName"
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-[#3A3A3A] 
                  outline-none px-0 pb-2 placeholder-gray-400 focus:border-b-2"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="flex gap-2 xl:gap-8 flex-col xl:flex-row">
                  {/* Email */}
                  <div className="flex-1">
                    <label className="block font-medium text-lg">Email</label>
                    <input
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      value={formData?.email || ""}
                      name="email"
                      type="email"
                      required
                      className="w-full bg-transparent border-0 border-b border-[#3A3A3A] 
                  outline-none px-0 pb-2 placeholder-gray-400 focus:border-b-2"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex-1">
                    <label className="block font-medium text-lg">
                      Phone Number
                    </label>
                    <IntlTelInput
                      preferredCountries={["ae"]}
                      defaultCountry="ae"
                      value={formData?.phoneNumber || ""}
                      onPhoneNumberChange={handlePhoneNumberChange}
                      onPhoneNumberBlur={handlePhoneNumberBlur}
                      fieldName="phoneNumber"
                      inputClassName="w-full bg-transparent border-0 border-b border-[#3A3A3A] 
                              outline-none px-0 pb-2 placeholder-gray-400 focus:border-b-2"
                    />
                    {errors.phoneNumber && (
                      <span className="text-red-500 text-sm">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-medium text-lg">Message</label>
                  <textarea
                    onChange={handleChange}
                    value={formData?.message || ""}
                    name="message"
                    placeholder="Write your message.."
                    className="w-full bg-transparent border-0 border-b border-[#3A3A3A] 
                outline-none px-0 pb-2 placeholder-gray-400 focus:border-b-2"
                  ></textarea>
                </div>

                {/* Submit */}
                <button
                  disabled={loading}
                  type="submit"
                  className="double-gradient text-white xl:text-lg font-medium 
              border-none rounded-lg py-2 xl:py-3 mt-2 shadow-lg"
                >
                  {loading ? <Loader /> : "Submit"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
