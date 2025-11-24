import React, { useRef, useEffect } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import CustomStarRating from "./CustomStarRating";
import { getImageUrl } from "../utils/helpers";
import { useContent, useCurrentLanguage } from "@/hooks";

// ✅ ADD: Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// ✅ ADD: Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// ✅ ADD: Import required modules
import {
  Navigation,
  Pagination as Paginate,
  Mousewheel,
  Keyboard,
} from "swiper/modules";

const EditModalMobile = ({
  isOpen,
  onClose,
  reviewData,
  onUpdate,
  MAX_FILES = 5,
  // ✅ NEW: Image carousel states passed as props
  isImageCarouselOpen,
  setIsImageCarouselOpen,
  carouselImages,
  setCarouselImages,
  initialSlideIndex,
  setInitialSlideIndex,
  // ✅ NEW: Edit states passed as props
  editRating,
  setEditRating,
  editReviewText,
  setEditReviewText,
  editReviewImages,
  setEditReviewImages,
  errors,
  setErrors,
  isDragOver,
  setIsDragOver,
}) => {
  const reviewTextareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const currentLanguage = useCurrentLanguage();
  const wantToAddProductImages = useContent("product.wantToAddProductImages");
  const onlyPngJpgJpegAllowed = useContent("product.onlyPngJpgJpegAllowed");
  const fileSizeMustBeLessThan5MB = useContent("product.fileSizeMustBeLessThan5MB");
  const youCanOnlyUploadUpTo = useContent("product.youCanOnlyUploadUpTo");
  const images = useContent("product.images");
  const skipForNow = useContent("product.skipForNow");
  const submit = useContent("buttons.submit");
  const cancel = useContent("buttons.cancel");

  // Constants for file validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  // ✅ NEW: Handle image click to open Swiper carousel
  const handleImageClick = (images, clickedIndex) => {
    setCarouselImages(images);
    setInitialSlideIndex(clickedIndex);
    setIsImageCarouselOpen(true);
  };

  // ✅ NEW: Close image carousel modal
  const handleCloseImageCarousel = () => {
    setIsImageCarouselOpen(false);
    setCarouselImages([]);
    setInitialSlideIndex(0);
  };

  // Auto-resize textarea
  const autoResizeReviewTextarea = () => {
    if (reviewTextareaRef.current) {
      reviewTextareaRef.current.style.height = "auto";
      reviewTextareaRef.current.style.height =
        reviewTextareaRef.current.scrollHeight + "px";
    }
  };

  // File validation function
  const validateFile = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: ${onlyPngJpgJpegAllowed}`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: ${fileSizeMustBeLessThan5MB}`);
    }

    return errors;
  };

  // Handle file selection with validation
  const handleFileSelection = (files) => {
    const fileArray = Array.from(files);
    const newErrors = [];
    const validFiles = [];

    if (editReviewImages?.length + fileArray?.length > MAX_FILES) {
      newErrors.push(`${youCanOnlyUploadUpTo} ${MAX_FILES} ${images}`);
      setErrors(newErrors);
      return;
    }

    fileArray.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors?.length === 0) {
        const fileWithPreview = {
          file,
          id: Date.now() + Math.random(),
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        };
        validFiles.push(fileWithPreview);
      } else {
        newErrors.push(...fileErrors);
      }
    });

    setEditReviewImages((prev) => [...prev, ...validFiles]);
    setErrors(newErrors);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    handleFileSelection(files);
    e.target.value = "";
  };

  // Remove image
  const removeImage = (index) => {
    setEditReviewImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const imageToRemove = prev[index];
      if (imageToRemove && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  };

  // Handle submit
  const handleImageSubmit = () => {
    const newErrors = [];

    if (editRating === 0) {
      newErrors.push("Please provide a rating");
    }

    if (newErrors?.length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      rating: editRating,
      review_title: editReviewText,
      image: editReviewImages,
    };

    onUpdate(updatedData);
    setErrors([]);
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Clear errors after 3 seconds
  useEffect(() => {
    if (errors?.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors, setErrors]);

  // ✅ UPDATED: Handle body scroll when modals are open
  useEffect(() => {
    if (isOpen || isImageCarouselOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        if (isImageCarouselOpen) {
          handleCloseImageCarousel();
        } else if (isOpen) {
          onClose();
        }
      }
    };

    if (isOpen || isImageCarouselOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isImageCarouselOpen, onClose]);

  // Auto-resize textarea when text changes
  useEffect(() => {
    setTimeout(() => {
      autoResizeReviewTextarea();
    }, 0);
  }, [editReviewText]);

  if (!isOpen) return null;

  const handleReviewChange = (e) => {
    let value = e.target.value;

    if (value.startsWith(" ")) {
      return;
    }

    value = value.replace(/\s{2,}/g, " ");

    setEditReviewText(value);
  };

  return (
    <>
      <div className="fixed bottom-0 inset-0 z-[1001] flex items-end justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-800"
          onClick={handleBackdropClick}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out animate-slide-up"
          style={{
            animation: isOpen
              ? "slideUp 0.3s ease-out forwards"
              : "slideDown 0.3s ease-out forwards",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 right-8 z-10 bg-[#FCFCFC] rounded-full w-10 h-10 shadow-[0px_4px_12px_0px_#0000000F] flex items-center justify-center border-none cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <MdClose className="w-6 h-6 text-[#191B1C] font-semibold" />
          </button>

          {/* Modal Content */}
          <div className="py-6 px-3 max-h-[80vh] overflow-y-auto">
            <div className="relative w-full flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col text-center gap-2">
                <h3 className="text-xl font-semibold text-black text-left mb-0">
                  My Rating & Review
                </h3>

                {/* Star Rating */}
                <div className="flex justify-left">
                  <CustomStarRating
                    editRating={editRating}
                    setEditRating={setEditRating}
                    isSelectable={true}
                    rating={editRating}
                    size="38px"
                    starSpacing="0px"
                    svgIconViewBox="0 0 44 44"
                    path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="text-left">
                <div className="relative">
                  <textarea
                    ref={reviewTextareaRef}
                    name="editReviewText"
                    id="editReviewTextarea"
                    value={editReviewText}
                    onChange={(e) => {
                      handleReviewChange();
                      autoResizeReviewTextarea();
                    }}
                    onInput={autoResizeReviewTextarea}
                    placeholder="Write a review....."
                    className={`w-full max-h-[200px] p-4 border rounded-xl text-gray-700 placeholder-gray-400 resize-none shadow-[0px_4px_12px_0px_#0000000F] focus:outline-none focus:ring-1 overflow-hidden ${
                      editReviewText?.length === 200
                        ? "border-[#F34845] focus:!ring-[#F34845] focus:!border-[#F34845] focus:outline-none"
                        : "border-editmodal-texts focus:!ring-blue-500 focus:!border-blue-400 focus:outline-none"
                    }`}
                    maxLength={200}
                    rows={4}
                  />
                  <div className="text-end text-sm text-gray-400">
                    <span
                      className={`${
                        editReviewText?.length === 200 && "text-[#F34845]"
                      }`}
                    >
                      {editReviewText?.length}
                    </span>
                    /200
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-[#354259]">
                    {wantToAddProductImages}
                  </h4>
                </div>

                <div
                  className={`rounded-xl p-4 transition-colors ${
                    isDragOver
                      ? "border-purple-400 bg-purple-50"
                      : "border-editmodal-image"
                  } ${errors?.length && "border-red-400"}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="grid grid-cols-5 gap-3">
                    {/* Upload Button */}
                    {editReviewImages?.length < MAX_FILES && (
                      <label className="aspect-square border-editmodal-image rounded-xl flex items-center justify-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/png,image/jpg,image/jpeg"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </label>
                    )}

                    {/* ✅ UPDATED: Image Previews with click handler for carousel */}
                    {editReviewImages?.map((image, i) => (
                      <div
                        key={image.id || i}
                        className="relative aspect-square group"
                      >
                        <img title="Click to view all images"
                          src={
                            typeof image === "string"
                              ? getImageUrl(image)
                              : image.preview || URL.createObjectURL(image.file)
                          }
                          alt="Review"
                          className="w-full h-full object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
                          onClick={() => handleImageClick(editReviewImages, i)}
                          loading="lazy"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-1.5 -right-1 bg-[#43494B] border-none text-white rounded-full p-0.5 flex items-center justify-center text-sm opacity-100 transition-opacity"
                        >
                          <MdClose className="w-3 h-3 text-[#FCFCFC]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <p className="text-sm text-red-600 mb-0">
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </p>
                  <p className="text-sm text-gray-500 text-end mb-0">
                    {editReviewImages?.length}/{MAX_FILES}
                  </p>
                </div>
              </div>

              {/* Error Messages */}
              {/* {errors?.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {errors.map((error, index) => (
                    <p
                      key={index}
                      className="text-red-600 text-sm text-center mb-0"
                    >
                      {error}
                    </p>
                  ))}
                </div>
              )} */}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 text-base bg-[#FCFCFC] text-[#43494B] btn-cancel-editmodal font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg border-none"
                >
                  {cancel}
                </button>
                <button
                  onClick={handleImageSubmit}
                  className="flex-1 text-base bg-[#5232C2] border-[#E7E8E9] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg border-none"
                >
                  {submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Swiper Image Carousel Modal */}
      {isImageCarouselOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur flex items-center justify-center z-[1060] p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={handleCloseImageCarousel}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white border-none rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
            >
              <MdClose className="w-6 h-6" />
            </button>

            {/* Swiper Carousel */}
            <div className="w-full h-[80vh] flex items-center justify-center">
              <Swiper
                cssMode={true}
                navigation={true}
                loop
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Paginate, Mousewheel, Keyboard]}
                className="w-full h-full rounded-lg"
                initialSlide={initialSlideIndex}
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#000",
                  "--swiper-navigation-size": "18px",
                  "--swiper-pagination-bullet-size": "18px",
                }}
              >
                {carouselImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full flex items-center justify-center">
                      <img src={
                          typeof image === "string"
                            ? getImageUrl(image)
                            : image.preview || URL.createObjectURL(image.file)
                        }
                        alt={`Review ${index + 1}`}
                        className="max-w-full flex-grow max-h-full object-contain rounded-lg"
                      loading="lazy" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModalMobile;
