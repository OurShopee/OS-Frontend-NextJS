import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { getAssetsUrl } from "../../utils/helpers";

const BankDetailsForm = ({ formData, setFormData, onBack, onSubmit }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "bank_name" || name === "account_holder_name") {
      filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (name === "account_number") {
      filteredValue = value.replace(/\D/g, "");
    } else if (name === "swift_bic_code") {
      filteredValue = value.replace(/[^A-Za-z0-9]/g, "");
    }
    setFormData({ ...formData, [name]: filteredValue });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setTermsAccepted(true);
    setIsModalOpen(false);
  };

  // Effect to prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (termsAccepted) {
            onSubmit();
          } else {
            toast.error("Please accept the Terms and Conditions.");
          }
        }}
      >
        <div className="flex flex-col gap-2.5 mb-3">
          <h2 className="font-bold text-2xl mb-0 flex items-center gap-1.5">
            Submit Your Bank Details for Verification
            <img src={getAssetsUrl("seller/shield.png")}
              alt="tick"
              className="text-green-500 w-5 h-5"
            loading="lazy" />
          </h2>
          <hr className="h-1 bg-[#E5E5E5] !m-0" />
        </div>
        <div className="flex flex-col gap-4">
          {/* Input fields */}
          <div className="flex flex-col gap-2.5">
            <label className="block font-bold">
              Bank Name<span className="text-red-500">*</span>
            </label>
            <input
              className="block seller-sell-type-grid-border px-4 py-2 w-full"
              type="text"
              name="bank_name"
              value={formData?.bank_name || ""}
              onChange={handleChange}
              placeholder="Enter bank name"
              required
              maxLength={50}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="block font-bold">
              Account Holder Name<span className="text-red-500">*</span>
            </label>
            <input
              className="block seller-sell-type-grid-border px-4 py-2 w-full"
              type="text"
              name="account_holder_name"
              value={formData?.account_holder_name || ""}
              onChange={handleChange}
              placeholder="Enter account holder name"
              required
              maxLength={50}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="block font-bold">
              Account Number<span className="text-red-500">*</span>
            </label>
            <input
              className="block seller-sell-type-grid-border px-4 py-2 w-full"
              type="text"
              name="account_number"
              value={formData?.account_number || ""}
              onChange={handleChange}
              placeholder="Enter account number"
              required
              maxLength={50}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="block font-bold">
              SWIFT/BIC Code<span className="text-red-500">*</span>
            </label>
            <input
              className="block seller-sell-type-grid-border px-4 py-2 w-full"
              type="text"
              name="swift_bic_code"
              value={formData?.swift_bic_code || ""}
              onChange={handleChange}
              placeholder="Enter SWIFT/BIC code"
              required
              maxLength={50}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="block font-bold">
              Bank Address<span className="text-red-500">*</span>
            </label>
            <input
              className="block seller-sell-type-grid-border px-4 py-2 w-full"
              type="text"
              name="bank_address"
              value={formData?.bank_address || ""}
              onChange={handleChange}
              placeholder="Enter bank address"
              required
              maxLength={200}
            />
          </div>

          {/* Terms/checkbox */}
          <div className="flex items-center gap-2.5 mt-1">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={termsAccepted}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-primary border-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="termsAccepted"
              className="text-sm text-black"
              onClick={(e) => e.preventDefault()} // Prevent label click from toggling checkbox directly
            >
              I agree that I have read and accepted the&nbsp;
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  openModal();
                }}
                className="text-primary cursor-pointer hover:underline"
              >
                Terms and Conditions
              </span>
              .
            </label>
          </div>
          <button
            disabled={!termsAccepted}
            type="submit"
            className={`w-full mt-1 ${
              !termsAccepted ? "opacity-50" : "opacity-100"
            } double-gradient border-none text-white py-3 font-bold rounded-lg shadow-[0px_5px_8px_0px_#5B5B5B40]`}
          >
            Submit
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-[776px] w-full relative p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="bg-[#FFF8E0] rounded-t-2xl px-5 py-3 flex items-center gap-3">
              <img src={getAssetsUrl("seller/doc-icon.png")}
                alt="document"
                className="w-6 h-6"
              loading="lazy" />
              <div>
                <div className="font-medium text-[22px]">
                  Business Agreement
                </div>
                <div className="text-nase text-gray-600 font-medium">
                  General Terms & Conditions
                </div>
              </div>
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="ml-auto bg-white h-8 w-8 rounded-full font-bold border-none flex items-center justify-center"
              >
                <MdClose className="w-4 h-4 text-[#000000]" />
              </button>
            </div>

            {/* Terms Content */}
            <div className="p-5 space-y-2.5 text-gray-800 max-h-[70vh] overflow-y-scroll">
              <div className="rounded-xl py-3.5 px-2.5 terms-content-border text-[#7E7E7E] font-normal">
                <div>
                  This Agreement is entered into by and between{" "}
                  <span className="font-semibold text-primary">
                    Ourshopee Trading L.L.C
                  </span>
                  , hereinafter referred to as 'Buyer', "
                  <span className="text-[#4733C1] no-underline">
                    Supplier / Vendor Name
                  </span>
                  ”, hereinafter referred to as “Supplier/Vendor/Seller”. This
                  agreement governs the purchase and resale of products by Buyer
                  through retail and wholesale models in any region.
                </div>
              </div>
              <div className="rounded-xl py-3.5 px-2.5 terms-content-border text-[#7E7E7E] font-normal">
                <div className="font-semibold text-black">Defined Terms</div>
                <ul className="list-disc list-inside mt-2 mb-0">
                  <li>Buyer: Ourshopee Trading LLC</li>
                  <li>Customer: End Consumer</li>
                  <li>Supplier: “Supplier name”</li>
                  <li>
                    Product: Brand Name / Category Name / Products – Any genuine
                    goods supply from you for resale purpose.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl py-3.5 px-2.5 terms-content-border text-[#7E7E7E] font-normal tex-base">
                <div className="font-semibold text-black">
                  Supplier Eligibility
                </div>
                <ul className="list-disc list-inside mt-2 mb-0">
                  <li>
                    Must be a legally registered business entity in the
                    respective region.
                  </li>
                  <li>
                    Provide all supporting legal documents (Trade/Commercial
                    License, VAT Certificate, TRN Certificate, Bank Details on
                    Company Letterhead, Address & Contact Details on company
                    letterhead.) if need any other official document will be
                    requested via email.
                  </li>
                  <li>Reload this page, then press Try Again</li>
                </ul>
              </div>
            </div>
            {/* Footer button */}
            <div className="px-5 pb-5 rounded-b-2xl">
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  closeModal();
                }}
                type="I Agree"
                className={`w-full mt-0 double-gradient border-none text-white py-3 font-bold rounded-lg shadow-[0px_5px_8px_0px_#5B5B5B40]`}
              >
                I agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankDetailsForm;
