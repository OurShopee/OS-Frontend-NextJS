"use client";

import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import he from "he";
import Lottie from "lottie-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import fire from "./fire.json";
import ImageCarousel from "./ImageCarousel";
import ProductDescription from "./ProductDescription";

// --- ProductForm Imports ---
import { addFeed, getAreasApi, getLocationsApi } from "@/api/others";
import { feedOtpCheck } from "@/api/payments";
import { useCurrentLanguage, useDynamicContent } from "@/hooks";
import { useContent } from "@/hooks/useContent";
import {
  setotpmodal,
  setregisterapicall,
  setregistermobile,
} from "@/redux/formslice";
import { clearCoupon } from "@/redux/paymentslice";
import { toast } from "react-toastify";
import { MediaQueries } from "../../utils";
import { pushToDataLayer } from "../../utils/dataUserpush";
import { getAssetsUrl } from "../../utils/helpers";
import GeneratedOrderModal from "./GeneratedOrderModal";
import MainModal from "./MainModal";
import PayLaterModal from "./PayLaterModal";
import { TRUE } from "sass";
import PayNowFinal from "./PayNowFinal";
import CODOrderModal from "./CODOrderModal";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

// --- Helper Functions from ProductForm ---
const validateInput = (value, fieldName, type = "text", country) => {
  if (!value || String(value).trim() === "") {
    return `${fieldName} is Required.`;
  }
  if (type === "phone") {
    const trimmedValue = String(value).trim();
    if (country.toLowerCase() === "uae") {
      if (!/^[5][0-9]{8}$/.test(trimmedValue)) {
        return "UAE number must start with 5 followed by 8 digits (e.g., 501234567)";
      }
    } else {
      if (!/^\d{8}$/.test(trimmedValue)) {
        return "Phone number must be exactly 8 digits";
      }
    }
  }
  if (type === "email") {
    const trimmedValue = String(value).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      return "Please enter a valid email address (e.g., abc@mail.com)";
    }
    if (trimmedValue.length > 60) {
      return "Email address must be maximum 60 characters";
    }
  }
  return "";
};

const getPhonePlaceholder = (country) => {
  if (country.toLowerCase() === "uae") {
    return "5xxxxxxxx";
  }
  return "xxxxxxxx";
};

const getMaxLength = (country) => {
  return country.toLowerCase() === "uae" ? 9 : 8;
};

const useElementVisibility = (elementId, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    elementRef.current = element;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px", // Add some margin for better UX
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementId]);

  return isVisible;
};

const ProductPageLayout = ({
  product,
  queryParams = {},
  country = "uae",
  Webfeed,
}) => {
  const dispatch = useDispatch();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const currentLanguage = useCurrentLanguage();
  const placeOrderTitle = useContent("checkout.placeOrder");
  const youSaved = useContent("product.youSaved");
  const incOfVat = useContent("forms.incOfVat");
  const off = useContent("product.off");
  // --- Original State ---
  const [activeImage, setActiveImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPrice, setSavedPrice] = useState(0);
  const [openFinalModal, setOpenFinalModal] = useState(false);
  const [openPayLaterModal, setOpenPayLaterModal] = useState(false);
  const [openPayNowModal, setOpenPayNowModal] = useState(false);
  const [openCODModal, setOpenCODModal] = useState();
  const [qty, setQty] = useState(1);
  const { sku } = useParams();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // --- ProductForm State Integration ---
  const [formData, setFormData] = useState({
    form_name: "",
    contact_no: "",
    email: "",
    quantity: "1",
    location: "",
    area: "",
    delivery_address: "",
    latitude: "",
    longitude: "",
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
  const { isMobile } = MediaQueries();
  const [areas, setAreas] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const helpCenter = useContent("product.helpCenter");
  const securedPayments = useContent("product.securedPayments");
  const easyReturn = useContent("product.easyReturn");
  const cashOnDelivery = useContent("product.cashOnDelivery");
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    type: "",
  });
  const [mapCoords, setMapCoords] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);

  // --- Redux State for OTP ---
  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const registerapicall = useSelector(
    (state) => state.formslice.registerapicall
  );
  const isOrderFormVisible = useElementVisibility("order-form");

  // Get dynamic content based on current language
  const productName = useDynamicContent(product, "name");
  const productDetails = useDynamicContent(product, "details");

  useEffect(() => {
    AOS.init({
      once: true,
      delay: 200,
      duration: 500,
    });
    pushToDataLayer("viewed_feed_page", country, {
      sku_id: product?.sku,
      product_name: product?.name,
      product_price: `${product?.currency || ""} ${product?.display_price}`,
      source_: "WebFeed",
    });
    // Fix overflow-x-hidden breaking sticky positioning
    const overflowHiddenDiv = document.querySelector(".overflow-x-hidden");
    if (overflowHiddenDiv && window.innerWidth >= 1024) {
      overflowHiddenDiv.style.overflowX = "clip";
      overflowHiddenDiv.style.overflowY = "visible";
    }

    return () => {
      // Restore on unmount
      if (overflowHiddenDiv) {
        overflowHiddenDiv.style.overflowX = "";
        overflowHiddenDiv.style.overflowY = "";
      }
    };
  }, []);

  const {
    galleryImages,
    isOutOfStock,
    productInfoDetails,
    areAllWebfeedsEmpty,
  } = useMemo(() => {
    // Check if all web-feeds (alternateAttributes) are empty
    // const alternateAttributes = product?.alternateAttributes || [];
    // const hasEmptyWebfeeds =
    //   !alternateAttributes.length ||
    //   alternateAttributes.every((attr) => !attr?.list || !attr.list.length);

    return {
      displayPrice: product?.display_price || "Price not available",
      oldPrice: product?.old_price,
      galleryImages: product?.images?.length
        ? product.images
        : product?.image
        ? [product.image]
        : [],
      isOutOfStock:
        product?.stock?.toLowerCase() !== "in stock" ||
        !product?.display_price ||
        typeof product?.display_price !== "number",
      productInfoDetails: [
        ...(product?.small_desc_data || [])
          .filter((item) => item.title && (item.value || item.value === 0))
          .map((item) => ({
            label: item.title,
            value: item.value,
          })),
      ],
      decodedDetails: product?.details ? he.decode(product.details) : "",
      // areAllWebfeedsEmpty: hasEmptyWebfeeds,
    };
  }, [product]);

  // Check if all required form fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.form_name?.trim() !== "" &&
      formData.contact_no?.trim() !== "" &&
      formData.email?.trim() !== "" &&
      formData.location?.trim() !== "" &&
      formData.area?.trim() !== "" &&
      formData.delivery_address?.trim() !== "" &&
      qty > 0
    );
  }, [
    formData.form_name,
    formData.contact_no,
    formData.email,
    formData.location,
    formData.area,
    formData.delivery_address,
    qty,
  ]);

  const trustBadges = [
    {
      img: getAssetsUrl("vector_icons/Secure_Transaction.png"),
      text: securedPayments,
    },
    {
      img: getAssetsUrl("vector_icons/Pay_Delivery.png"),
      text: cashOnDelivery,
    },
    {
      img: getAssetsUrl("vector_icons/Exchange_Available.png"),
      text: easyReturn,
    },
    {
      img: getAssetsUrl("vector_icons/help-center.png"),
      text: helpCenter,
    },
  ];

  // --- ProductForm Effects ---
  useEffect(() => {
    if (!registerapicall || !pendingFormData) {
      return;
    }

    // When OTP is verified, just open the generate modal without calling addFeed
    setIsGenerateModalOpen(true);
    dispatch(setregisterapicall(false));
  }, [dispatch, pendingFormData, registerapicall]);

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      setErrors((prev) => ({ ...prev, location: "" }));
      try {
        const data = await getLocationsApi();
        if (data?.status === 200 && Array.isArray(data.data?.data)) {
          setLocations(data.data?.data);
        } else {
          console.error("Invalid locations API response:", data);
          setErrors((prev) => ({
            ...prev,
            location: "Failed to load locations (invalid format).",
          }));
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
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

  // Fetch areas when location changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (formData.location) {
        setLoadingAreas(true);
        setAreas([]);
        setErrors((prev) => ({ ...prev, area: "" }));
        try {
          const data = await getAreasApi(formData.location);
          if (data?.status === 200 && Array.isArray(data.data?.data)) {
            setAreas(data.data?.data || []);
          } else {
            console.error("Invalid areas API response:", data);
            setErrors((prev) => ({
              ...prev,
              area: "Failed to load areas (invalid format).",
            }));
          }
        } catch (error) {
          console.error("Error fetching areas:", error);
          setErrors((prev) => ({ ...prev, area: "Failed to load areas." }));
        } finally {
          setLoadingAreas(false);
        }
      } else {
        setAreas([]);
      }
    };
    fetchAreas();
  }, [formData.location]);

  // Update active image when product changes (keeping original logic)
  useEffect(() => {
    setActiveImage(galleryImages[0] || null);
    setImageError(false);
    setIsLoading(true);
  }, [product?.id, galleryImages]);

  const handleImageError = useCallback((e) => {
    if (e.currentTarget.src !== PLACEHOLDER_IMAGE) {
      e.currentTarget.src = PLACEHOLDER_IMAGE;
      setImageError(true);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const offData = product?.old_price * (product?.percentage / 100);
    setSavedPrice(offData ? offData.toFixed(2) : 0);
  }, [product]);

  const handleThumbnailClick = useCallback((imgUrl) => {
    setActiveImage(imgUrl);
    setImageError(false);
    setIsLoading(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact_no") {
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "email") {
      // Limit to 60 characters
      if (value.length > 60) {
        return; // Don't update if exceeds 60 characters
      }
      
      // Only prevent spaces in email
      const emailValue = value.replace(/\s/g, "");
      setFormData((prev) => ({ ...prev, [name]: emailValue }));
      
      // Real-time email format validation - only validate after user has typed something meaningful
      const trimmedValue = emailValue.trim();
      if (trimmedValue === "") {
        // Clear error if field is empty (will be validated on submit)
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else if (trimmedValue.length < 3 && !trimmedValue.includes("@")) {
        // Don't show error if user is just starting to type (less than 3 chars and no @)
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        // Validate email format only after user has typed something meaningful
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(trimmedValue)) {
          // Valid email format - clear error
          setErrors((prev) => ({ ...prev, [name]: "" }));
        } else {
          // Invalid email format - show error only if they've typed enough to indicate they're entering an email
          // Show error if they've typed @ or if length is 5+ characters
          if (trimmedValue.includes("@") || trimmedValue.length >= 5) {
            setErrors((prev) => ({
              ...prev,
              [name]: "Please enter a valid email address",
            }));
          } else {
            // Clear error if they're still typing early on
            setErrors((prev) => ({ ...prev, [name]: "" }));
          }
        }
      }
    } else if (name === "form_name") {
      const namePattern = /^[A-Za-z\s]{0,50}$/;

      if (namePattern.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear any existing error for this field if input is valid
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      } else {
        // Set error if pattern doesn't match
        setErrors((prev) => ({
          ...prev,
          [name]:
            "Please enter only letters and spaces (maximum 50 characters)",
        }));
        // Don't update the form data with invalid input
        return;
      }
    } else if (name === "location") {
      // Check location length limit (200 characters)
      if (value.length <= 200) {
        setFormData((prev) => ({ ...prev, [name]: value, area: "" }));
        setAreas([]);

        // Clear any existing error for this field if input is valid
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      } else {
        // Set error if location exceeds 200 characters
        setErrors((prev) => ({
          ...prev,
          [name]: "Location must be maximum 200 characters",
        }));
        // Don't update the form data with invalid input
        return;
      }
    } else if (name === "delivery_address") {
      // Count words in the textarea
      const wordCount = countWords(value);

      if (wordCount <= 200) {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear any existing error for this field if input is valid
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      } else {
        // Set error if word count exceeds 200 words
        setErrors((prev) => ({
          ...prev,
          [name]: `Delivery address must be maximum 200 words (currently ${wordCount} words)`,
        }));
        // Don't update the form data with invalid input
        return;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear errors for fields other than form_name, location, delivery_address, and email
    if (
      errors[name] &&
      !["form_name", "location", "delivery_address", "email"].includes(name)
    ) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (submissionStatus.message) {
      setSubmissionStatus({ message: "", type: "" });
    }
  };

  // Add this word counting function
  const countWords = (text) => {
    if (!text || text.trim() === "") return 0;

    // Remove extra whitespaces and split by spaces
    const words = text.trim().replace(/\s+/g, " ").split(" ");

    // Filter out empty strings
    return words.filter((word) => word !== "").length;
  };

  const handleInputChange = (field, value) => {
    // Convert field names to match ProductForm format
    const fieldMapping = {
      fullName: "form_name",
      phoneNumber: "contact_no",
      email: "email",
      quantity: "quantity",
      location: "location",
      area: "area",
      deliveryAddress: "delivery_address",
    };

    const mappedField = fieldMapping[field] || field;

    if (mappedField === "contact_no") {
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [mappedField]: numericValue }));
    } else if (mappedField === "email") {
      // Limit to 60 characters
      if (value.length > 60) {
        return; // Don't update if exceeds 60 characters
      }
      
      // Only prevent spaces in email
      const emailValue = value.replace(/\s/g, "");
      setFormData((prev) => ({ ...prev, [mappedField]: emailValue }));
      
      // Real-time email format validation - only validate after user has typed something meaningful
      const trimmedValue = emailValue.trim();
      if (trimmedValue === "") {
        // Clear error if field is empty
        setErrors((prev) => ({ ...prev, [mappedField]: "" }));
      } else if (trimmedValue.length < 3 && !trimmedValue.includes("@")) {
        // Don't show error if user is just starting to type (less than 3 chars and no @)
        setErrors((prev) => ({ ...prev, [mappedField]: "" }));
      } else {
        // Validate email format only after user has typed something meaningful
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(trimmedValue)) {
          // Valid email format - clear error
          setErrors((prev) => ({ ...prev, [mappedField]: "" }));
        } else {
          // Invalid email format - show error only if they've typed enough to indicate they're entering an email
          // Show error if they've typed @ or if length is 5+ characters
          if (trimmedValue.includes("@") || trimmedValue.length >= 5) {
            setErrors((prev) => ({
              ...prev,
              [mappedField]: "Please enter a valid email address (e.g., abc@mail.com)",
            }));
          } else {
            // Clear error if they're still typing early on
            setErrors((prev) => ({ ...prev, [mappedField]: "" }));
          }
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [mappedField]: value }));
    }

    if (mappedField === "location") {
      setFormData((prev) => ({ ...prev, area: "" }));
      setAreas([]);
    }

    if (errors[mappedField]) {
      setErrors((prev) => ({ ...prev, [mappedField]: "" }));
    }
    if (submissionStatus.message) {
      setSubmissionStatus({ message: "", type: "" });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus({ message: "", type: "" });
    setErrors({});

    // Update quantity from qty state
    const updatedFormData = { ...formData, quantity: qty.toString() };
    setFormData(updatedFormData);

    // Validation
    const countryName = currentcountry.name || country;
    const currentErrors = {};
    currentErrors.form_name = validateInput(
      updatedFormData.form_name,
      "Full Name"
    );
    currentErrors.contact_no = validateInput(
      updatedFormData.contact_no,
      "Contact Number",
      "phone",
      countryName
    );
    currentErrors.email = validateInput(
      updatedFormData.email,
      "Email",
      "email"
    );
    currentErrors.location = validateInput(
      updatedFormData.location,
      "Location"
    );
    currentErrors.area = validateInput(updatedFormData.area, "Area");
    currentErrors.delivery_address = validateInput(
      updatedFormData.delivery_address,
      "Street/Flat No"
    );
    currentErrors.quantity = validateInput(
      updatedFormData.quantity,
      "Quantity"
    );

    const hasErrors = Object.values(currentErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) {
      setErrors(currentErrors);
      setIsSubmitting(false);

      // Toast only non-empty errors
      const nonEmptyErrors = Object.values(currentErrors).filter(
        (error) => error && error.trim() !== ""
      );
      nonEmptyErrors.forEach((error) => {
        toast.error(error);
      });

      setSubmissionStatus({
        message: "Please fix the errors above.",
        type: "error",
      });

      // Focus the first field with an error
      const firstErrorField = Object.keys(currentErrors).find(
        (key) => currentErrors[key]
      );
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)?.[0]?.focus();
      }
      return;
    }

    const apiData = {
      form_name: updatedFormData.form_name.trim(),
      contact_no: `${
        currentcountry.country_code
      }${updatedFormData.contact_no.trim()}`,
      email: updatedFormData.email.trim(),
      product: updatedFormData.product,
      emirate: updatedFormData.location,
      area: updatedFormData.area,
      delivery_address: updatedFormData.delivery_address.trim(),
      orderfrom: Webfeed ? Webfeed : "WebFeed",
      price: updatedFormData.price,
      quantity: updatedFormData.quantity,
      productid: product?.id,
    };

    // Check if OTP verification is enabled via environment variable
    // Properly parse the environment variable (handle string "false" and "true")
    // const checkOtpEnabled =
    //   process.env.NEXT_PUBLIC_CHECK_OTP_WEBFEED === "true" ||
    //   process.env.NEXT_PUBLIC_CHECK_OTP_WEBFEED === true;

    // // If OTP check is disabled, directly submit the form
    // if (!checkOtpEnabled) {
    //   setPendingFormData(apiData);
    //   try {
    //     // Pass apiData directly to avoid state timing issues
    //     await submitFormAfterOTP(apiData);
    //   } catch (error) {
    //     console.error("Order submission error:", error);
    //     toast.error("Failed to submit order. Please try again.");
    //     setSubmissionStatus({
    //       message: "Failed to submit order. Please try again.",
    //       type: "error",
    //     });
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    //   return;
    // }

    setPendingFormData(apiData);

    const mobileNumber = updatedFormData.contact_no.trim();
    dispatch(setregistermobile(mobileNumber));

    if (!product?.category_id || !product?.subcategory_id) {
      toast.error("Missing product category details. Please try again later.");
      setSubmissionStatus({
        message: "Missing product category details. Please try again later.",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const otpCheckPayload = {
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        mobile: mobileNumber,
      };

      const otpResponse = await feedOtpCheck(otpCheckPayload);
      const otpStatus =
        otpResponse?.otp_status ||
        otpResponse?.data?.otp_status ||
        otpResponse?.data?.status ||
        otpResponse?.status;

      switch (otpStatus) {
        case "OTP_SENT":
          dispatch(setotpmodal(true));
          break;
        case "OTP_DISABLED": {
          // const submitted = await submitFormAfterOTP(apiData);
          // if (submitted) {
          //   setIsGenerateModalOpen(true);
          // }
          setIsGenerateModalOpen(true);
          break;
        }
        case "OTP_BLOCKED":
          toast.error(
            "OTP verification limit exceeded. Please try again later."
          );
          setSubmissionStatus({
            message: "OTP verification limit exceeded. Please try again later.",
            type: "error",
          });
          break;
        default:
          toast.error("Failed to send OTP. Please try again.");
          setSubmissionStatus({
            message: "Failed to send OTP. Please try again.",
            type: "error",
          });
          break;
      }
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error("Failed to send OTP. Please try again.");
      setSubmissionStatus({
        message: "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable function to submit order and open pay later modal
  const submitOrderAndOpenPayLaterModal = async (formDataToSubmit = null) => {
    // Use passed data if available, otherwise fall back to state
    const dataToSubmit = formDataToSubmit || pendingFormData;
    if (!dataToSubmit) {
      toast.error("No order data available. Please fill the form again.");
      return false;
    }

    console.log("dataToSubmit.contact_no", dataToSubmit.contact_no);

    setIsSubmitting(true);
    let isSuccessful = false;
    try {
      const result = await addFeed(dataToSubmit);

      if (result.data.status === "success") {
        isSuccessful = true;
        setSubmissionStatus({
          message: result.message || "Order submitted successfully!",
          type: "success",
        });

        const selectedLocationName =
          locations.find((loc) => loc.id === parseInt(dataToSubmit.emirate))
            ?.name || "N/A";
        pushToDataLayer("submitted_feed_order", currentcountry.name, {
          form_name: dataToSubmit.form_name,
          contact_no: dataToSubmit.contact_no,
          product: dataToSubmit.product,
          emirate: dataToSubmit.emirate,
          area: dataToSubmit.area,
          delivery_address: dataToSubmit.delivery_address,
          source: dataToSubmit.orderfrom,
          price: dataToSubmit.price,
          quantity: dataToSubmit.quantity,
          sku_id: product?.sku,
          product_name: product?.name,
          product_price: `${currentcountry.currency} ${
            product?.display_price || "0.00"
          }`,
          location: selectedLocationName,
          order_id: result.data.order_id || "",
          order_status: "submitted",
        });

        // Reset form
        setFormData({
          form_name: "",
          contact_no: "",
          email: "",
          quantity: "1",
          location: "",
          area: "",
          delivery_address: "",
          product: product?.sku || "",
          price: product?.display_price || "0.00",
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
        setQty(1); // Reset quantity
        dispatch(setotpmodal(false));
        dispatch(setregisterapicall(false));

        // Open pay later modal
        setOpenPayLaterModal(true);
      } else {
        setSubmissionStatus({
          message: result.message || "Submission failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Submission catch error:", error);
      setSubmissionStatus({
        message: "An unexpected error occurred during submission.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }

    return isSuccessful;
  };

  const handleChangeQty = (action) => {
    if (action === "inc") {
      setQty(qty + 1);
    } else if (action === "dec") {
      if (qty > 1) setQty(qty - 1);
    }
  };

  const countdownDateStr = product?.feed_countdown;
  const countdownTimestamp = new Date(countdownDateStr).getTime();
  const now = Date.now();

  function capitalizeFirstLetterOnly(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  if (!product) {
    return (
      <div
        className="flex flex-col min-h-screen"
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <main className="flex-grow container mx-auto py-5 text-center">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-300 rounded mx-auto w-9/12 h-8"></div>
            <div
              className="bg-gray-300 rounded mx-auto w-6/12"
              style={{ height: "16rem" }}
            ></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="webfeed-bg relative">
      <div className="sm:px-4 sm:py-4 container">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Left Side - Product Images and Overview */}
          <div className="w-full lg:w-8/12 flex-shrink-0">
            <div className="bg-white bg-opacity-[0.9] sm:rounded-[20px] p-4 sm:shadow-sm">
              {/* Main Product Image */}
              <div className="sm:hidden mb-2 w-max flex items-center brand-feed-shadow px-3 py-1 rounded-full shadow">
                <span className="text-[#8F8F8F] font-normal text-sm">
                  {product.brand}
                </span>
              </div>
              <div className="mb-3.5 sm:hidden">
                <h1 className="font-medium text-lg">{productName}</h1>
              </div>

              <div className="sm:flex mt-4">
                <div
                  className="w-full sm:w-1/2 bounce-on-scroll"
                  data-aos="fade-down"
                  data-aos-easing="ease-out-back"
                  data-aos-duration="1200"
                  data-aos-delay="200"
                >
                  <ImageCarousel
                    isLoading={isLoading}
                    images={product?.images}
                    product={product}
                    webfeed
                  />
                </div>
                <div className="w-full sm:w-1/2 px-4 py-1 sm:py-4">
                  <div className="hidden sm:inline-flex mb-4 items-center brand-feed-shadow px-3 py-1 rounded-full shadow gap-1">
                    <span className="text-[#8F8F8F] font-normal text-sm">
                      {product.brand}
                    </span>
                  </div>

                  <div className="rounded-lg">
                    {!isOutOfStock && (
                      <div className="mb-2">
                        <span className="font-medium text-base text-[#E78B00] flex items-end gap-1">
                          <Lottie
                            animationData={fire}
                            loop
                            autoplay
                            className="w-5"
                          />
                          Hurry ! Low in Stock
                        </span>
                      </div>
                    )}

                    <div className="sm:mb-3.5 hidden sm:flex">
                      <h1 className="font-medium text-[22px]">{productName}</h1>
                    </div>

                    <div className="mb-4">
                      <div className="my-2 sm:my-0 flex">
                        <div className="flex items-center">
                          {currentcountry.currency == "AED" ? (
                            <img
                              src={getAssetsUrl("feed/aed-icon.svg")}
                              alt="AED"
                              className={`w-6 h-6 inline-block mix-blend-multiply ${
                                currentLanguage === "ar" ? "ml-1" : "mr-1"
                              }`}
                              style={{ color: "black" }}
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className={`currency-symbol text-[24px] md:text-[26px] font-bold ${
                                currentLanguage === "ar" ? "ml-1" : "mr-1"
                              }`}
                            >
                              {currentcountry.currency}
                            </span>
                          )}
                          <span className="text-[24px] md:text-[26px] font-bold">
                            {product?.display_price}
                          </span>
                        </div>
                        {savedPrice > 0 && (
                          <div className="save-banner ml-4 px-3 py-2 flex items-center font-medium">
                            <span
                              className={`${
                                currentLanguage === "ar" ? "ml-2" : "mr-2"
                              } badge-icon flex items-center justify-center`}
                            >
                              <img
                                src={getAssetsUrl("vector_icons/Vector.png")}
                                alt="%"
                                className="discount-icon"
                                loading="lazy"
                              />
                            </span>
                            <span className="flex gap-1 items-center text-sm">
                              {youSaved}{" "}
                              {currentcountry.currency == "AED" ? (
                                <img
                                  src={getAssetsUrl("feed/aed-icon.svg")}
                                  alt="AED"
                                  className="w-4 h-4 inline-block mix-blend-multiply"
                                  style={{ color: "black" }}
                                  loading="lazy"
                                />
                              ) : (
                                <span className="currency-symbol text-sm">
                                  {currentcountry.currency}
                                </span>
                              )}
                              {Math.ceil(savedPrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      {product?.hasOwnProperty("old_price") &&
                        Number(product?.display_price) <
                          Number(product?.old_price) && (
                          <div className="old_price">
                            {currentcountry.currency == "AED" ? (
                              <div
                                className={`flex justify-center items-center text-[#9ea5a8] line-through gap-1 ${
                                  currentLanguage === "ar"
                                    ? "flex-row-reverse"
                                    : ""
                                }`}
                              >
                                <img
                                  src={getAssetsUrl("feed/aed-icon.svg")}
                                  alt="AED"
                                  className="w-4 h-4 grayscale mix-blend-multiply opacity-30"
                                  style={{ color: "#9ea5a8" }}
                                  loading="lazy"
                                />
                                {product?.old_price}
                              </div>
                            ) : (
                              <span
                                className={`flex items-center ${
                                  currentLanguage === "ar"
                                    ? "flex-row-reverse"
                                    : ""
                                }`}
                              >
                                {currentcountry.currency +
                                  " " +
                                  product?.old_price}
                              </span>
                            )}
                            <div className="product_Detail_price_container">
                              <div className="display_percentage">
                                {product?.percentage + "%" + off}
                              </div>
                            </div>
                            <p className="text-[#9EA5A8] mb-0 text-base">
                              {incOfVat}
                            </p>
                          </div>
                        )}
                    </div>

                    {countdownTimestamp > now && (
                      <div className="hidden sm:flex items-center gap-2 mt-3">
                        <div className="flex items-center">
                          <img
                            src={getAssetsUrl("feed/clock.png")}
                            alt=""
                            className="w-16 h-full"
                            loading="lazy"
                          />
                          <FlipClockCountdown
                            to={countdownTimestamp}
                            labels={["Days", "Hrs", "Min", "Sec"]}
                            showLabels={true}
                            renderMap={[true, true, true, true]}
                            digitBlockStyle={{
                              width: 14,
                              height: 24,
                              fontSize: 14,
                              background:
                                "linear-gradient(0deg,#ff3437,#ff1d0c)",
                              color: "#fff",
                              borderRadius: 0,
                              fontWeight: 600,
                            }}
                            separatorStyle={{
                              size: "3px",
                              color: "#a80000",
                              fontWeight: "400",
                            }}
                            labelStyle={{
                              fontSize: 12,
                              color: "#000",
                              fontWeight: 600,
                              marginTop: 1,
                            }}
                            duration={0.5}
                            showSeparators={true}
                          />
                        </div>
                      </div>
                    )}

                    <div className="w-[212px] mt-1 sm:mt-3">
                      <img
                        src={getAssetsUrl("feed/limited-offer.gif")}
                        className="w-full h-full"
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Product Overview Section */}
              <div className="mt-1 rounded-[20px] p-4 feed-card bg-shadow-feed-form">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-4">
                  Product Overview
                </h3>
                <div className="flex flex-wrap mb-2 -mx-2">
                  {product?.alternateAttributes
                    ?.slice()
                    .reverse()
                    .map((attribute, index) => {
                      if (!attribute?.list?.length) return null;
                      return (
                        <div
                          className="mb-3 w-full md:w-1/2 px-2"
                          key={`attribute-${index}`}
                        >
                          <div>
                            <h6 className="mb-0 font-semibold text-[#666666] font-[Outfit] capitalize">
                              {capitalizeFirstLetterOnly(attribute.title)}
                            </h6>
                          </div>
                          <div className="flex flex-wrap mt-4 gap-5 items-center">
                            {attribute.list.map((attribute_item) => {
                              const isActive = sku == attribute_item.sku;
                              const colorCircleStyle = {
                                background: attribute_item?.code?.startsWith(
                                  "#"
                                )
                                  ? attribute_item.code
                                  : "#" + attribute_item.code,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                              };
                              return (
                                <div className="flex" key={attribute_item.sku}>
                                  {attribute_item.code === "" ? (
                                    <Link
                                      href={`/feed/${attribute_item.sku}`}
                                      className={`flex items-center cursor-pointer rounded-full px-10 py-3 border ${
                                        isActive
                                          ? "border-webfeed font-semibold text-primary text-[14px]"
                                          : "border-gray-300 text-[#91979A] font-medium bg-[#FCFCFC]"
                                      }`}
                                    >
                                      <h6 className="text-[14px] text-center mb-0">
                                        {attribute_item?.name}
                                      </h6>
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/feed/${attribute_item.sku}`}
                                      className="flex flex-col items-center cursor-pointer w-max max-w-16"
                                    >
                                      <div
                                        className={`flex items-center justify-center w-7 h-7 rounded-full ${
                                          isActive
                                            ? "border-webfeed1"
                                            : "border-gray-300"
                                        }`}
                                      >
                                        <div style={colorCircleStyle}></div>
                                      </div>
                                      <h6
                                        className={`mt-3 text-[14px] mb-0 text-center ${
                                          isActive
                                            ? "text-[#43494B] font-semibold text-[15px]"
                                            : "text-[#91979A] font-medium"
                                        }`}
                                      >
                                        {attribute_item.name}
                                      </h6>
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
                {/* Product Details Table */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {productInfoDetails.map((detail, index) => (
                    <div key={`${detail.label}-${index}`}>
                      <div className="bg-[#F8F8F8] py-1.5 px-3 rounded-lg h-full">
                        <div
                          style={{ fontSize: "14px" }}
                          className="text-[#91979A] font-normal"
                        >
                          {detail.label}
                        </div>
                        <div
                          style={{ fontSize: "16px" }}
                          className="text-[#43494B] font-semibold"
                        >
                          {detail.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!isMobile && productDetails && (
                  <ProductDescription product={product} />
                )}
              </div>
              <div className="my-4 rounded-[20px] p-4 feed-card bg-shadow-feed-form">
                <div className="grid gap-2.5 grid-cols-2 xl:flex xl:justify-between">
                  {trustBadges.map((badge, index) => (
                    <div
                      key={index}
                      /* text-center gap-2 -> text-center gap-2 */
                      className="flex text-center gap-2 items-center"
                    >
                      <img
                        src={badge.img}
                        alt={badge.text}
                        width={isMobile ? 50 : 70}
                        height={isMobile ? 50 : 70}
                        /* mb-2 bg-light p-2 rounded-circle - loading="lazy"> mb-2 bg-gray-100 p-2 rounded-full */
                        className="bg-gray-100 p-2 rounded-full"
                      />
                      <div className="flex items-center text-start sm:max-w-24 text-xs sm:text-sm font-semibold">
                        {badge.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {isMobile && (
                <div className="mt-[18px] rounded-[20px] p-4 pb-0 feed-card bg-shadow-feed-form">
                  {productDetails && <ProductDescription product={product} />}
                </div>
              )}
            </div>
          </div>
          <div
            className="w-full flex justify-center lg:w-4/12 webfeed-order-form-sticky"
            {...(isMobile
              ? {
                  "data-aos": "fade-down",
                  "data-aos-easing": "ease-out-back",
                  "data-aos-duration": "1000",
                  "data-aos-delay": "100",
                }
              : {})}
            id="order-form"
          >
            <div className="bg-white rounded-[20px] px-4 w-[92%] sm:w-full py-5 pb-2 bg-shadow-feed-form">
              <div>
                <h4 className="font-bold mb-5 text-xl sm:text-2xl">
                  {placeOrderTitle}
                </h4>
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-4">
                    <label className="block text-[#454545] font-medium mb-2">
                      Full Name<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="form_name"
                      className={`block w-full product webfeed-form-input rounded-lg px-3 py-2 ${
                        errors.form_name ? "border-red-600" : "border-gray-300"
                      }`}
                      placeholder="Enter Full Name"
                      value={formData.form_name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.form_name && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.form_name}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 grid grid-cols-6 gap-1 sm:gap-3 w-full">
                    {/* Phone Number */}
                    <div className="col-span-6 sm:col-span-4">
                      <label className="block text-[#454545] font-medium">
                        Phone number<span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          className="col-span-1 webfeed-form-input rounded-lg border px-3 py-2 text-gray-700 font-medium outline-none"
                          value={currentcountry.country_code}
                          disabled
                        />
                        <input
                          type="tel"
                          name="contact_no"
                          className={`col-span-2 webfeed-form-input rounded-lg border px-4 py-2 text-gray-700 font-medium outline-none ${
                            errors.contact_no
                              ? "border-red-600"
                              : "border-gray-300"
                          }`}
                          value={formData.contact_no}
                          onChange={handleChange}
                          placeholder={getPhonePlaceholder(
                            currentcountry.name || country
                          )}
                          maxLength={getMaxLength(
                            currentcountry.name || country
                          )}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      {errors.contact_no && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.contact_no}
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="hidden sm:block col-span-2">
                      <label className="block text-[#454545] font-medium">
                        Quantity<span className="text-red-600">*</span>
                      </label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-1 sm:gap-3 border py-2 rounded-lg px-2.5 text-base">
                          <button
                            type="button"
                            disabled={qty <= 1}
                            className="flex-1 border-none bg-transparent flex items-center justify-center px-0 cursor-pointer"
                            onClick={() => handleChangeQty("dec")}
                          >
                            <FiMinus
                              height={22}
                              className={`${
                                qty == 1 && "text-[#ddd9d9] text-opacity-50"
                              }`}
                            />
                          </button>

                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]+"
                            value={qty}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const numberPattern = /^[0-9]*$/;
                              if (!numberPattern.test(inputValue)) return;
                              const numValue = parseInt(inputValue) || 0;
                              if (numValue > 999) {
                                setQty(999);
                              } else if (numValue < 1 && inputValue !== "") {
                                setQty(1);
                              } else {
                                setQty(inputValue === "" ? "" : numValue);
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              setQty(
                                value >= 1 ? (value > 999 ? 999 : value) : 1
                              );
                            }}
                            className="font-semibold flex-1 text-center border-none bg-transparent outline-none appearance-none w-full"
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                            }}
                            title="Enter quantity"
                          />

                          <button
                            type="button"
                            disabled={qty == 999}
                            className="border-none flex-1 bg-transparent flex items-center justify-center px-0 cursor-pointer"
                            onClick={() => handleChangeQty("inc")}
                          >
                            <FiPlus
                              height={22}
                              className={`${
                                qty == 999 && "text-[#ddd9d9] text-opacity-50"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[#454545] font-medium mb-2">
                      Email<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`block w-full product webfeed-form-input rounded-lg px-3 py-2 ${
                        errors.email ? "border-red-600" : "border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                      maxLength={60}
                    />
                    {errors.email && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <label className="block text-[#454545] font-medium mb-2">
                      Location<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="location"
                        className={`webfeed-form-select px-3 py-2 block w-full border-2 product webfeed-form-input rounded-lg appearance-none pr-12 ${
                          errors.location ? "is-invalid" : ""
                        }`}
                        value={formData.location}
                        onChange={handleChange}
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

                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <BiSolidDownArrow size={12} />
                      </div>
                    </div>

                    {loadingLocations && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="animate-spin rounded-full border-2 border-t-2 border-primary w-5 h-5"></div>
                        <span className="text-muted">Loading locations...</span>
                      </div>
                    )}

                    {errors.location && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors.location}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-[#454545] font-medium mb-2">
                      Area<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="area"
                        className={`webfeed-form-select px-3 py-2 appearance-none block w-full border-2 product webfeed-form-input rounded-lg ${
                          errors.area ? "border-red-600" : "border-gray-300"
                        } ${!formData.location ? "bg-[#e9ecef]" : ""}`}
                        value={formData.area}
                        onChange={handleChange}
                        disabled={
                          isSubmitting || loadingAreas || !formData.location
                        }
                        required
                      >
                        <option value="">Select Area</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </select>

                      {areas.length > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <BiSolidDownArrow size={12} />
                        </div>
                      )}

                      {loadingAreas && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="animate-spin rounded-full border-2 border-t-2 border-primary w-5 h-5"></div>
                          <span className="text-muted">Loading areas...</span>
                        </div>
                      )}

                      {errors.area && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.area}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[#454545] font-medium mb-2">
                      Delivery Address<span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="delivery_address"
                      className={`block w-full border-2 product webfeed-form-input rounded-lg px-3 py-2 ${
                        errors.delivery_address
                          ? "border-red-600"
                          : "border-gray-300"
                      }`}
                      rows="4"
                      placeholder="Enter your delivery address"
                      value={formData.delivery_address}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    ></textarea>
                    <small className="text-muted mt-1 block">
                      {countWords(formData.delivery_address || "")}/200 words
                    </small>
                  </div>

                  <div className="grid grid-cols-7 gap-4 justify-center items-center">
                    {isMobile && (
                      <div className="col-span-3 gap-4">
                        <div className="flex items-center justify-between gap-1 sm:gap-3 border py-2 rounded-lg px-2 text-base">
                          <button
                            type="button"
                            disabled={qty <= 1}
                            className={`flex-1 border-none bg-transparent flex items-center justify-center px-0 cursor-pointer`}
                            onClick={() => handleChangeQty("dec")}
                          >
                            <FiMinus
                              height={22}
                              className={`${
                                qty == 1 && "text-[#ddd9d9] text-opacity-50"
                              }`}
                            />
                          </button>

                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]+"
                            value={qty}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const numberPattern = /^[0-9]*$/;
                              if (!numberPattern.test(inputValue)) return;
                              const numValue = parseInt(inputValue) || 0;
                              if (numValue > 999) {
                                setQty(999);
                              } else if (numValue < 1 && inputValue !== "") {
                                setQty(1);
                              } else {
                                setQty(inputValue === "" ? "" : numValue);
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              setQty(
                                value >= 1 ? (value > 999 ? 999 : value) : 1
                              );
                            }}
                            className="font-semibold flex-1 text-center border-none bg-transparent outline-none appearance-none w-full"
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                            }}
                            title="Enter quantity"
                          />

                          <button
                            type="button"
                            disabled={qty == 999}
                            className={`border-none flex-1 bg-transparent flex items-center justify-center px-0 cursor-pointer`}
                            onClick={() => handleChangeQty("inc")}
                          >
                            <FiPlus
                              height={22}
                              className={`${
                                qty == 999 && "text-[#ddd9d9] text-opacity-50"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="animated-bg-button-container lg:!mt-0 col-span-4 sm:col-span-7">
                      <div className="animated-bg-button-shadow" />
                      <button
                        disabled={isOutOfStock || isSubmitting || !isFormValid}
                        type="submit"
                        className="w-full place-order-button border-none gap-2 uppercase select-none relative inline-flex items-center justify-center h-12 rounded-xl font-medium text-white overflow-hidden disabled:bg-[#e5e5e5] disabled:cursor-not-allowed"
                      >
                        <img
                          src={getAssetsUrl("vector_icons/buy_now_flash_.gif")}
                          alt="flash"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                          className={`${
                            isOutOfStock || isSubmitting || !isFormValid
                              ? "opacity-50"
                              : ""
                          }`}
                          loading="lazy"
                        />
                        <span
                          className={`text-sm sm:text-base movetext-feed text-black ${
                            isOutOfStock || isSubmitting || !isFormValid
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          {placeOrderTitle}
                        </span>
                        <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
                          <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
                          <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Submission Status Message */}
                  {submissionStatus.message && (
                    <div
                      className={`mt-3 p-3 rounded ${
                        submissionStatus.type === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submissionStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {isMobile && (
          <div
            id="fixed-bottom"
            className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-all duration-300 ${
              isOrderFormVisible
                ? "opacity-0 pointer-events-none translate-y-full"
                : "opacity-100 pointer-events-auto translate-y-0"
            }`}
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                {/* Countdown Timer */}
                {countdownTimestamp > now && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <img
                        src={getAssetsUrl("feed/clock.png")}
                        alt=""
                        className="w-10 h-full"
                        loading="lazy"
                      />
                      <FlipClockCountdown
                        to={countdownTimestamp}
                        labels={["Days", "Hrs", "Min", "Sec"]}
                        showLabels={true}
                        renderMap={[true, true, true, true]}
                        digitBlockStyle={{
                          width: 10,
                          height: 16,
                          fontSize: 8,
                          background: "linear-gradient(0deg,#ff3437,#fa2c2c)",
                          color: "#fff",
                          borderRadius: 0,
                          fontWeight: 600,
                        }}
                        separatorStyle={{
                          size: "3px",
                          color: "#a80000",
                          fontWeight: "400",
                        }}
                        labelStyle={{
                          fontSize: 12,
                          color: "#000",
                          fontWeight: 600,
                          marginTop: 1,
                        }}
                        duration={0.5}
                        showSeparators={true}
                      />
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  className="w-full h-[44px] place-order-button text-sm whitespace-nowrap border-none gap-2 uppercase select-none relative inline-flex items-center justify-center rounded-xl font-medium text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    const element = document.getElementById("order-form");
                    if (element) {
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - 200;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <img
                    src={getAssetsUrl("vector_icons/buy_now_flash_.gif")}
                    alt="flash"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                    loading="lazy"
                  />
                  <span className="text-[#191B1C] font-bold text-sm">
                    {placeOrderTitle}
                  </span>
                  <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
                    <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
                    <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        <MainModal
          modalWidth={"md"}
          isOpen={isGenerateModalOpen}
          onClose={async () => {
            setIsGenerateModalOpen(false);
            await submitOrderAndOpenPayLaterModal();
          }}
          modalContent={
            <GeneratedOrderModal
              onPayNow={() => {
                setIsGenerateModalOpen(false);
                setOpenPayNowModal(true);
              }}
              onPayLater={async () => {
                setIsGenerateModalOpen(false);
                await submitOrderAndOpenPayLaterModal();
              }}
            />
          }
        />

        <MainModal
          isOpen={openPayLaterModal}
          modalWidth={"md"}
          onClose={() => setOpenPayLaterModal(false)}
          modalContent={<PayLaterModal />}
        />
        <MainModal
          isOpen={openCODModal}
          modalWidth={"md"}
          onClose={() => setOpenCODModal(false)}
          modalContent={<CODOrderModal />}
        />

        <MainModal
          isOpen={openPayNowModal}
          onClose={async () => {
            setOpenPayNowModal(false);
            dispatch(clearCoupon());
            await submitOrderAndOpenPayLaterModal();
          }}
          modalContent={
            <PayNowFinal
              formData={formData}
              product={product}
              qty={qty}
              sku={sku}
              onUpdateFormData={(updatedFields) =>
                setFormData((prev) => ({ ...prev, ...updatedFields }))
              }
            />
          }
        />
      </div>
    </div>
  );
};

ProductPageLayout.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    display_price: PropTypes.string,
    old_price: PropTypes.string,
    stock: PropTypes.string,
    quantity: PropTypes.number,
    sku: PropTypes.string,
    brand: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    small_desc_data: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    details: PropTypes.string,
  }),
  locationsData: PropTypes.array,
  queryParams: PropTypes.object,
  country: PropTypes.string,
  Webfeed: PropTypes.object,
};

export default ProductPageLayout;
