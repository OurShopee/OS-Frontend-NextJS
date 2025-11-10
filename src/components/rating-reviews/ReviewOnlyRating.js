import { useEffect, useRef, useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import PostReview from "./PostReview"; // Import the PostReview component
import HasReview from "./HasReview"; // Import the HasReview component
import RatingOverview from "./RatingOverview";
import { useLoginModal } from "../utils/helpers";
import { ComponentHeader } from "../Common";

const ReviewOnlyRating = () => {
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const [rating, setRating] = useState(3);
  const [reviewText, setReviewText] = useState();
  const [hover, setHover] = useState(0);
  const { openLoginModal } = useLoginModal();

  // Image upload modal states
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Review state management
  const [hasExistingReview, setHasExistingReview] = useState(true); // Set to true to show existing review initially
  const [isEditing, setIsEditing] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);

  // Rating Statistics Data Object
  const ratingsData = {
    averageRating: 4.4,
    totalRatings: 500,
    totalReviews: 100,
    ratingDistribution: [
      { stars: 5, count: 250, percentage: 50 },
      { stars: 4, count: 150, percentage: 30 },
      { stars: 3, count: 50, percentage: 10 },
      { stars: 2, count: 30, percentage: 6 },
      { stars: 1, count: 20, percentage: 4 },
    ],
  };

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  // Review handler functions - Updated for inline editing
  const handleUpdateReview = (updatedData) => {
    setRating(updatedData.rating);
    setReviewText(updatedData.reviewText);
    setReviewImages(updatedData.reviewImages);

    // Here you can also call your API to update the review

    // Optionally show a success message
    alert("Review updated successfully!");
  };

  const handleReviewSubmit = () => {
    setIsImageModalOpen(true);
  };

  // Image upload functions
  const validateFile = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: Only PNG, JPG, and JPEG files are allowed`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File size must be less than 5MB`);
    }

    return errors;
  };

  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isImageModalOpen]);

  const handleFileSelection = (files) => {
    const fileArray = Array.from(files);
    const newErrors = [];
    const validFiles = [];

    if (selectedFiles.length + fileArray.length > MAX_FILES) {
      newErrors.push(`You can only upload up to ${MAX_FILES} files`);
      setErrors(newErrors);
      return;
    }

    fileArray.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
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

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setErrors(newErrors);
  };

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

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileSelection(files);
    e.target.value = "";
  };

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((file) => file.id !== fileId);
      const fileToRemove = prev.find((file) => file.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const handleImageModalClose = () => {
    selectedFiles.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    setErrors([]);
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Create FormData and handle final submission
  const createFormData = () => {
    const formData = new FormData();

    formData.append("rating", rating);
    formData.append("reviewText", reviewText);
    formData.append("reviewTextLength", reviewText.length);
    formData.append("timestamp", new Date().toISOString());

    selectedFiles.forEach((fileObj, index) => {
      formData.append(`image_${index}`, fileObj.file);
    });

    formData.append("totalImages", selectedFiles.length);
    formData.append("authStatus", authstatus);

    return formData;
  };

  const logFormData = (formData) => {

    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: new Date(value.lastModified).toISOString(),
        });
      } else {
        console.log(`${key}:`, value);
      }
    }

    console.log("=== END FORM DATA ===");
  };

  const handleImageSubmit = () => {
    if (selectedFiles.length === 0) {
      setErrors(["Please select at least one file"]);
      return;
    }

    const formData = createFormData();
    logFormData(formData);

    // Convert selectedFiles to reviewImages format
    const newReviewImages = selectedFiles.map((file) => ({
      id: file.id,
      preview: file.preview,
      name: file.name,
    }));

    setReviewImages(newReviewImages);
    setHasExistingReview(true);
    setIsEditing(false);

    alert(
      `Review submitted successfully!\nRating: ${rating}\nImages: ${selectedFiles.length}`
    );
    setIsImageModalOpen(false);
  };

  const handleSkipImages = () => {
    const formData = createFormData();
    logFormData(formData);

    setHasExistingReview(true);
    setIsEditing(false);

    alert(`Review submitted successfully without images!\nRating: ${rating}`);
    setIsImageModalOpen(false);
  };

  return (
    <>
      <section className="relative w-full py-10 text-center overflow-hidden bg-white">
        {/* Header */}
        <div className="component_1 product_Detail_carousel_prod mb-6">
          {/* {productDetail_products.hasOwnProperty("related_products") && ( */}
          <ComponentHeader
            title={"Ratings & Review"}
            // first_title={"Related"}
            // second_title={"PRODUCTS"}
            // first_string_color={"#000"}
            // second_string_color={null}
            view_all={"rgba(82, 50, 194, 1)"}
          />
          {/* )} */}
        </div>

        {/* Main Content */}
        <div className="relative z-20 w-full rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[53%_47%] gap-8 items-start">
            {/* Left Side - Rating Overview */}
            <RatingOverview ratingsData={ratingsData} />

            {/* Right Side - Review Form */}
            <div
              className={`flex flex-col relative ${
                !authstatus ? "items-center" : "items-end"
              }  justify-center min-h-full ${
                !authstatus
                  ? "bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_8%,_white_70%)]"
                  : ""
              }`}
            >
              {/* Quote Icons - Only show when not authenticated */}
              {!authstatus && (
                <>
                  <img
                    src={"/assets/review/left-icon-review.png"}
                    alt="Quote Left"
                    className="hidden xl:block absolute left-[2%] top-[8%] -translate-y-1/2 w-[100px] z-1"
                  />
                  <img
                    src={"/assets/review/left-icon-review.png"}
                    alt="Quote Right"
                    className="hidden xl:block absolute right-[2%] top-[90%] -translate-y-1/2 w-[100px] z-1 rotate-180"
                  />
                </>
              )}

              {!authstatus ? (
                <div className="text-center">
                  <p className="xl:text-[22px] font-semibold xl:font-bold text-[#43494b] text-center leading-relaxed">
                    Your review makes a difference <br />
                    share it now!
                  </p>
                  <button
                    onClick={openLoginModal}
                    className="bg-[#FFCF0A] hover:bg-[#FFCF0A] transition-colors duration-200 px-5 xl:px-8 py-2 xl:py-4 rounded-lg font-semibold text-[14px] xl:text-base text-black border-none"
                  >
                    Write a review
                  </button>
                </div>
              ) : (
                <>
                  {hasExistingReview ? (
                    <HasReview
                      rating={rating}
                      reviewText={reviewText}
                      reviewImages={reviewImages}
                      onUpdate={handleUpdateReview}
                    />
                  ) : (
                    <PostReview
                      rating={rating}
                      setRating={setRating}
                      hover={hover}
                      setHover={setHover}
                      reviewText={reviewText}
                      setReviewText={setReviewText}
                      reviewImages={reviewImages}
                      setReviewImages={setReviewImages}
                      onSubmit={handleReviewSubmit}
                      onCancel={null}
                      isEditing={false}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1010] p-4">
          <div className="bg-white rounded-2xl flex flex-col p-6 gap-5 shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Want to add product images ?
              </h2>
              <button
                onClick={handleImageModalClose}
                className="text-gray-500 hover:text-gray-700 border-none bg-transparent text-2xl leading-none"
              >
                <MdClose />
              </button>
            </div>

            {/* Content */}
            <div className="">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Upload Icon */}
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <p className="text-lg mb-2">
                  <span className="text-[#5F1BE7] font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                </p>

                <p className="text-sm text-gray-500">
                  PNG, JPG or JPEG (max. 5MB)
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Maximum {MAX_FILES} files allowed
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {errors.map((error, index) => (
                    <p
                      key={index}
                      className="text-red-600 text-sm text-center mb-0"
                    >
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Files ({selectedFiles.length}/{MAX_FILES})
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute -top-1 -right-1 bg-red-500 border-none text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdDelete />
                        </button>

                        {/* File Info */}
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 truncate mb-1">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 border-t">
              <button
                onClick={handleSkipImages}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleImageSubmit}
                className="flex-1 bg-[#5F1BE7] hover:bg-[#5215cc] border-none text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewOnlyRating;
