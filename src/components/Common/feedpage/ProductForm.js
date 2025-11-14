"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getLocationsApi, getAreasApi, addFeed } from "../../services/Apis";
import { useSelector, useDispatch } from "react-redux";
import { pushToDataLayer } from "../utils/dataUserpush";
import { toast } from "react-toastify";
import {
  checkmobileotpapi,
  setotpmodal,
  setregistermobile,
  setregisterapicall,
} from "../../redux/formslice";

// Validation helpers intact (omitted here for brevity)...

const ProductForm = ({ product, queryParams, Webfeed }) => {
  const dispatch = useDispatch();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const country = currentcountry.name;
  const [formData, setFormData] = useState({
    form_name: "",
    contact_no: "",
    quantity: "1",
    location: "",
    area: "",
    delivery_address: "",
    product: product?.sku || "",
    price: product?.display_price || "0.00",
    orderfrom: queryParams?.orderfrom || "Web",
    source: queryParams?.source || "",
    medium: queryParams?.medium || "",
    campaign: queryParams?.campaign || "",
    content: queryParams?.content || "",
    term: queryParams?.term || "",
  });
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    type: "",
  });
  const [mapCoords, setMapCoords] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);

  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const registerapicall = useSelector(
    (state) => state.formslice.registerapicall
  );

  useEffect(() => {
    if (registerapicall && pendingFormData && !optmodalopen) {
      const submitForm = async () => {
        try {
          await submitFormAfterOTP();
        } catch (error) {
          console.error("Error submitting after OTP", error);
        }
      };

      submitForm();
    }
  }, [registerapicall, pendingFormData, optmodalopen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "contact_no" ? value.replace(/[^\d]/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "location" ? { area: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submissionStatus.message) {
      setSubmissionStatus({ message: "", type: "" });
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      setErrors((prev) => ({ ...prev, location: "" }));
      try {
        const data = await getLocationsApi();
        if (data?.status === 200 && Array.isArray(data.data?.data)) {
          setLocations(data.data.data);
        } else {
          setErrors((prev) => ({
            ...prev,
            location: "Failed to load locations.",
          }));
        }
      } catch {
        setErrors((prev) => ({
          ...prev,
          location: "Failed to load locations.",
        }));
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!formData.location) {
        setAreas([]);
        return;
      }
      setLoadingAreas(true);
      setErrors((prev) => ({ ...prev, area: "" }));
      try {
        const data = await getAreasApi(formData.location);
        if (data?.status === 200 && Array.isArray(data.data?.data)) {
          setAreas(data.data.data);
        } else {
          setErrors((prev) => ({ ...prev, area: "Failed to load areas." }));
        }
      } catch {
        setErrors((prev) => ({ ...prev, area: "Failed to load areas." }));
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, [formData.location]);

  // handleLocationSelect and auto select logic omitted - same as before

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus({ message: "", type: "" });
    setErrors({});

    const currentErrors = {};
    currentErrors.form_name = validateInput(formData.form_name, "Full Name");
    currentErrors.contact_no = validateInput(
      formData.contact_no,
      "Contact Number",
      "phone",
      country
    );
    currentErrors.location = validateInput(formData.location, "Location");
    currentErrors.area = validateInput(formData.area, "Area");
    currentErrors.delivery_address = validateInput(
      formData.delivery_address,
      "Street/Flat No"
    );
    currentErrors.quantity = validateInput(formData.quantity, "Quantity");

    if (Object.values(currentErrors).some((error) => error !== "")) {
      setErrors(currentErrors);
      setIsSubmitting(false);
      toast.error("Please Fill All Required Fields.");
      setSubmissionStatus({
        message: "Please Fill All Required Fields.",
        type: "error",
      });
      const firstErrorField = Object.keys(currentErrors).find(
        (key) => currentErrors[key]
      );
      if (firstErrorField)
        document.getElementsByName(firstErrorField)[0]?.focus();
      return;
    }

    const apiData = {
      form_name: formData.form_name.trim(),
      contact_no: `${currentcountry.country_code}${formData.contact_no.trim()}`,
      product: formData.product,
      emirate: formData.location,
      area: formData.area,
      delivery_address: formData.delivery_address.trim(),
      orderfrom: Webfeed || "WebFeed",
      price: formData.price,
      quantity: formData.quantity,
      productid: product?.id,
      // source: ..., medium: ..., etc.
    };

    setPendingFormData(apiData);

    // Check if OTP verification is enabled via environment variable
    const checkOtpEnabled = process.env.NEXT_PUBLIC_CHECK_OTP_WEBFEED === "false";

    // If OTP check is disabled, directly submit the form
    if (!checkOtpEnabled) {
      try {
        await submitFormAfterOTP();
      } catch (error) {
        console.error("Order submission error:", error);
        toast.error("Failed to submit order. Please try again.");
        setSubmissionStatus({
          message: "Failed to submit order. Please try again.",
          type: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // OTP check is enabled, proceed with OTP verification
    try {
      const mobileNumber = formData.contact_no.trim();
      dispatch(setregistermobile(mobileNumber));
      const result = await dispatch(
        checkmobileotpapi({ mobile: mobileNumber })
      );

      if (result.payload.status === "success") {
        dispatch(setotpmodal(true));
      } else {
        toast.error(result.payload.message || "Failed to send OTP");
        setSubmissionStatus({
          message:
            result.payload.message || "Failed to send OTP. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      setSubmissionStatus({
        message: "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitFormAfterOTP = async () => {
    if (!pendingFormData) return;
    setIsSubmitting(true);
    try {
      const result = await addFeed(pendingFormData);
      if (result.data.status === "success") {
        setSubmissionStatus({
          message: result.message || "Order submitted successfully!",
          type: "success",
        });
        toast.success("Order submitted successfully!");

        // Push to dataLayer and reset form logic here...

        setFormData({
          form_name: "",
          contact_no: "",
          quantity: "1",
          location: "",
          area: "",
          delivery_address: "",
          product: product?.sku || "",
          price: product?.special_price || "0.00",
          orderfrom: queryParams?.orderfrom || "WebFeed",
          source: queryParams?.source || "",
          medium: queryParams?.medium || "",
          campaign: queryParams?.campaign || "",
          content: queryParams?.content || "",
          term: queryParams?.term || "",
        });
        setAreas([]);
        setMapCoords(null);
        setPendingFormData(null);
        dispatch(setotpmodal(false));
        dispatch(setregisterapicall(false));
        const searchInput = document.querySelector(
          'input[placeholder*="Search for a location"]'
        );
        if (searchInput) searchInput.value = "";
      } else {
        setSubmissionStatus({
          message: result.message || "Submission failed. Please try again.",
          type: "error",
        });
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      setSubmissionStatus({
        message: "An unexpected error occurred during submission.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-0">
      <p className="text-xs text-gray-500 mb-3">
        *Fill out the form to request an order, our team will review your
        details and contact you to confirm pricing, availability, and next
        steps.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="mb-3">
          <label
            htmlFor="form_name"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="form_name"
            name="form_name"
            value={formData.form_name}
            onChange={handleChange}
            className={`block w-full rounded-md border px-3 py-2 ${
              errors.form_name ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter Full name"
            disabled={isSubmitting}
            required
          />
          {errors.form_name && (
            <p className="text-red-600 text-sm mt-1">{errors.form_name}</p>
          )}
        </div>

        {/* Phone Number and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label
              htmlFor="contact_no"
              className="block text-gray-700 font-medium mb-1"
            >
              Phone Number <span className="text-red-600">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none">
                {currentcountry.country_code}
              </span>
              <input
                type="tel"
                id="contact_no"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                className={`block w-full rounded-r-md border px-3 py-2 ${
                  errors.contact_no ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder={getPhonePlaceholder(country)}
                maxLength={getMaxLength(country)}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.contact_no && (
              <p className="text-red-600 text-sm mt-1">{errors.contact_no}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-gray-700 font-medium mb-1"
            >
              Quantity <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`block w-full rounded-md border px-3 py-2 ${
                errors.quantity ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              min="1"
              disabled={isSubmitting}
              required
            />
            {errors.quantity && (
              <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-1"
          >
            Location <span className="text-red-600">*</span>
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`block w-full rounded-md border px-3 py-2 ${
              errors.location ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            disabled={isSubmitting || loadingLocations}
            required
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {loadingLocations && (
            <p className="mt-2 text-sm text-gray-500">Loading locations...</p>
          )}
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Area */}
        <div className="mb-3">
          <label
            htmlFor="area"
            className="block text-gray-700 font-medium mb-1"
          >
            Area <span className="text-red-600">*</span>
          </label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`block w-full rounded-md border px-3 py-2 ${
              errors.area ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            disabled={isSubmitting || loadingAreas || !formData.location}
            required
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          {loadingAreas && (
            <p className="mt-2 text-sm text-gray-500">Loading areas...</p>
          )}
          {errors.area && (
            <p className="text-red-600 text-sm mt-1">{errors.area}</p>
          )}
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <label
            htmlFor="delivery_address"
            className="block text-gray-700 font-medium mb-1"
          >
            Delivery Address <span className="text-red-600">*</span>
          </label>
          <textarea
            id="delivery_address"
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleChange}
            className={`block w-full rounded-md border px-3 py-2 ${
              errors.delivery_address ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            rows="3"
            placeholder="Enter your delivery address"
            disabled={isSubmitting}
            required
          />
          {errors.delivery_address && (
            <p className="text-red-600 text-sm mt-1">
              {errors.delivery_address}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-semibold rounded-md transition-colors ${
            isSubmitting
              ? "bg-indigo-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Order"
          )}
        </button>

        {submissionStatus.message && (
          <div
            className={`mt-4 p-3 rounded ${
              submissionStatus.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submissionStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
