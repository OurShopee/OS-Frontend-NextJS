"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BusinessDetailsForm from "@/components/seller/SellerOnboarding/BusinessDetailsForm";
import OTPVerificationForm from "@/components/seller/SellerOnboarding/OTPVerificationForm";  
import SellerDetailsForm from "@/components/seller/SellerOnboarding/SellerDetailsForm";
import StepIndicator from "@/components/seller/SellerOnboarding/StepIndicator";
import { addVendorApi } from "@/api/seller";
import BankDetailsForm from "@/components/seller/SellerOnboarding/BankDetailsForm";

const SellerOnboarding = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  const [formData, setFormData] = useState({
    contact_person: "",
    contact_phone: "",
    email: "",
    trade_license: null,
    vat_certificate: null,
    identity_card: null,
    bank_details: null,
    otp: "",
    category: "all",
    category_id: "",
    business_address: "",
    emirate_id: "",
    area_id: "",
    business_name: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    swift_bic_code: "",
    bank_address: "",
  });
  const [binaryFormData, setBinaryFormData] = useState(null);

  const handleSellerDetailsNext = (data) => {
    const { _binaryFormData, ...regularData } = data;
    setFormData((prev) => ({ ...prev, ...regularData }));
    setBinaryFormData(_binaryFormData);
    setStep(1);
  };

  useEffect(() => {
    AOS.init({
      once: true,
      delay: 200,
      duration: 500,
    });
  }, []);

  // Effect to handle modal animation when isSuccess changes
  useEffect(() => {
    if (isSuccess) {
      setIsModalVisible(true);
      // Small delay to ensure the modal is rendered before starting animation
      setTimeout(() => {
        setIsModalAnimating(true);
      }, 10);
    }
  }, [isSuccess]);

  const handleSubmit = () => {
    const addVendorFunction = async () => {
      try {
        let finalFormData = binaryFormData || new FormData();
        finalFormData.set("category", formData.category || "other");
        if (formData.category_id)
          finalFormData.set("category_id", formData.category_id);
        if (formData.business_address)
          finalFormData.set("business_address", formData.business_address);
        if (formData.emirate_id)
          finalFormData.set("emirate_id", formData.emirate_id);
        if (formData.area_id) finalFormData.set("area_id", formData.area_id);
        if (formData.otp) finalFormData.set("otp", formData.otp);
        if (formData.business_name)
          finalFormData.set("business_name", formData.business_name);
        if (formData.bank_name)
          finalFormData.set("bank_name", formData.bank_name);
        if (formData.account_holder_name)
          finalFormData.set(
            "account_holder_name",
            formData.account_holder_name
          );
        if (formData.account_number)
          finalFormData.set("account_number", formData.account_number);
        if (formData.swift_bic_code)
          finalFormData.set("swift_bic_code", formData.swift_bic_code);
        if (formData.bank_address)
          finalFormData.set("bank_address", formData.bank_address);

        for (let [key, value] of finalFormData.entries()) {
          console.log(
            key,
            value instanceof File ? `File: ${value.name}` : value
          );
        }
        console.log(finalFormData);

        const { data } = await addVendorApi(finalFormData);
        if (data.status === "success") {
          setFormData({
            contact_person: "",
            contact_phone: "",
            email: "",
            trade_license: null,
            vat_certificate: null,
            identity_card: null,
            bank_details: null,
            otp: "",
            category: "all",
            category_id: "",
            business_address: "",
            emirate_id: "",
            area_id: "",
            business_name: "",
            bank_name: "",
            account_holder_name: "",
            account_number: "",
            swift_bic_code: "",
            bank_address: "",
          });

          setBinaryFormData(null);
          setIsSuccess(true);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error adding vendor:", error);
        toast.error(error);
      }
    };

    addVendorFunction();
  };

  const handleExplore = () => {
    closeModal();
    router.push("/");
  };

  const handleBack = () => {
    setStep(step > 0 ? step - 1 : 0);
  };

  const closeModal = () => {
    setIsModalAnimating(false);
    setTimeout(() => {
      setIsModalVisible(false);
      setIsSuccess(false);
      router.push("/");
    }, 300);
  };

  // Handler for backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div className="mx-auto bg-white shadow-lg flex max-w-full overflow-hidden max-h-[calc(100vh-78px)]">
        <div className="hidden sm:block">
          <img
            src={`/assets/seller/step${step + 1}.png`}
            alt=""
            className="img-seller-height w-full"
          />
        </div>
        <div className="relative flex-grow min-w-0 pb-4 px-6 sm:px-10 overflow-y-scroll">
          <div className="sticky -top-0 py-4 bg-white z-10 pb-8 sm:pb-4">
            <button
              type="button"
              onClick={handleBack}
              className={`mb-4 sm:mb-2 text-[#333333] border-none bg-transparent flex gap-2 justify-center items-center font-medium ${
                step === 0 && "hidden"
              }`}
            >
              <img
                src="/assets/seller/back-arrow.png"
                alt=""
                className="w-1.5 h-3"
              />{" "}
              Back
            </button>

            <StepIndicator activeStep={step} totalSteps={4} />
          </div>
          <div className="sm:mt-4">
            {step === 0 && (
              <SellerDetailsForm
                formData={formData}
                setFormData={setFormData}
                onNext={handleSellerDetailsNext}
              />
            )}
            {step === 1 && (
              <OTPVerificationForm
                mobile={formData.contact_phone}
                email={formData.email}
                setFormData={setFormData}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <BusinessDetailsForm
                formData={formData}
                setFormData={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    ...data,
                  }))
                }
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <BankDetailsForm
                formData={formData}
                setFormData={(data) =>
                  setFormData((prev) => ({
                    ...prev,
                    ...data,
                  }))
                }
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isModalVisible && (
        <div
          className={`fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
            isModalAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleBackdropClick}
        >
          <div
            className={`bg-white rounded-3xl shadow-xl max-w-[428px] w-full relative h-[352px] transition-transform duration-300 ease-out ${
              isModalAnimating
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0"
            }`}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -top-4 rounded-full w-9 h-9 flex justify-center items-center bg-[#FCFCFC] right-6 hover:text-gray-600 text-xl font-bold border-none z-10 popup-close-icon-shadow transition-all duration-200 hover:scale-110"
            >
              <MdClose className="w-4 h-4 text-[#686868]" />
            </button>

            {/* Background Image */}
            <img
              className="w-full h-full relative"
              src="/assets/seller/thankyou-popup.png"
              alt=""
            />
            {/* Button positioned absolutely at bottom */}
            <button
              onClick={handleExplore}
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gred-purple text-white px-6 py-1.5 border-none rounded-[6px] font-medium transition-all duration-200 hover:scale-105"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerOnboarding;
