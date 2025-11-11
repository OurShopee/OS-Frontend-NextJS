import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { setformstatus } from "@/redux/formslice";
import { getAllReviews, postUserReview } from "@/api/review";
import { ComponentHeader } from "../Common";
import { MediaQueries } from "../utils";
import { useLoginModal } from "../utils/helpers";
import HasReview from "./HasReview";
import { useContent, useCurrentLanguage } from "@/hooks";

const ReviewNoRating = ({
  setProductReviews,
  productReviews,
  setAllProductReviews,
}) => {
  const currentLanguage = useCurrentLanguage();
  const ratingsAndReview = useContent("product.ratingsAndReview");
  const yourReviewMakesADifference = useContent("product.yourReviewMakesADifference");
  const shareItNow = useContent("product.shareItNow");
  const writeReview = useContent("product.writeReview");
  const beTheFirstOneToReview = useContent("product.beTheFirstOneToReview");
  const canYouTellUsMore = useContent("product.canYouTellUsMore");
  const leaveAReviewHere = useContent("product.leaveAReviewHere");
  const submit = useContent("buttons.submit");
  const wantToAddProductImages = useContent("product.wantToAddProductImages");
  const clickToUpload = useContent("product.clickToUpload");
  const orDragAndDrop = useContent("product.orDragAndDrop");
  const pngJpgJpegMax5MB = useContent("product.pngJpgJpegMax5MB");
  const maximumFilesAllowed = useContent("product.maximumFilesAllowed");
  const filesAllowed = useContent("product.filesAllowed");
  const selectedFilesText = useContent("product.selectedFiles");
  const skipForNow = useContent("product.skipForNow");
  const onlyPngJpgJpegAllowed = useContent("product.onlyPngJpgJpegAllowed");
  const fileSizeMustBeLessThan5MB = useContent("product.fileSizeMustBeLessThan5MB");
  const youCanOnlyUploadUpTo = useContent("product.youCanOnlyUploadUpTo");
  const images = useContent("product.images");
  
  const { isMobile } = MediaQueries();
  const authstatus = useSelector((state) => state.formslice.authstatus);

  const productDetail = useSelector(
    (state) => state.productslice.productDetail
  );
  
  const dispatch = useDispatch();
  const { openLoginModal } = useLoginModal();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hover, setHover] = useState(0);
  const lottieRef = useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const [isReady, setIsReady] = useState(false);

  // Image upload modal states
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHover(starValue);
  };

  const handleStarLeave = () => {
    setHover(0);
  };

  // Image upload functions
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
      newErrors.push(`${youCanOnlyUploadUpTo} ${MAX_FILES} ${images}`);
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

    formData.append("productid", productDetail[0]?.id);
    formData.append("rating", rating);
    formData.append("review_title", reviewText);

    // Append images as an array
    selectedFiles.forEach((fileObj) => {
      formData.append("images", fileObj.file);
    });

    return formData;
  };

  const handleImageSubmit = async () => {
    const formData = createFormData();
    const { data } = await postUserReview(formData);
    if (data?.status === "success") {
      const { data } = await getAllReviews(productDetail[0]?.id);
      setProductReviews(data);
      setAllProductReviews(data);
    }
    setIsImageModalOpen(false);
    dispatch(setformstatus(5));
    setRating(3);
    setReviewText("");
    setSelectedFiles([]);
    setErrors([]);
  };

  const handleSubmit = () => {
    setIsImageModalOpen(true);
  };

  const handleReviewChange = (e) => {
    let value = e.target.value;

    if (value.startsWith(" ")) {
      return;
    }

    value = value.replace(/\s{2,}/g, " ");

    setReviewText(value);
  };

  return (
    <>
      <section className="relative w-full text-center overflow-hidden md:py-10">
        {/* Left Quote Icon Image */}
        <img
          src={"/assets/review/left-icon-review.png"}
          alt="Quote Left"
          className={`hidden md:block absolute ${
            authstatus ? "left-[10%] top-[30%]" : "left-[18%] top-[35%]"
          }  -translate-y-1/2 w-[100px] z-[9]`}
        />

        {/* Right Quote Icon Image */}
        <img
          src={"/assets/review/left-icon-review.png"}
          alt="Quote Right"
          className={`hidden md:block absolute rotate-180 ${
            authstatus ? "right-[10%] top-[85%] " : "right-[18%] top-[75%]"
          } -translate-y-1/2 w-[100px] z-[9]`}
        />

        {/* Header - now with proper z-index */}
        {/* <div className="relative z-[5] w-full text-left mb-12">
          <h2 className="md:text-3xl font-bold text-[#43494b] text-left w-full max-w-screen-xl">
            Ratings & Review
          </h2>
        </div> */}

        <div className="component_1 product_Detail_carousel_prod mb-6">
          {/* {productDetail_products.hasOwnProperty("related_products") && ( */}
          <ComponentHeader
            title={ratingsAndReview}
            // first_title={"Related"}
            // second_title={"PRODUCTS"}
            // first_string_color={"#000"}
            // second_string_color={null}
            view_all={"rgba(82, 50, 194, 1)"}
          />
          {/* )} */}
        </div>

        {/* Content - with higher z-index */}
        {!authstatus ? (
          <div
            className={`relative z-[5] flex flex-col items-center space-y-4 mx-auto bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_15%,_white_70%)]`}
          >
            {/* Stars with inline styles to ensure visibility */}
            <div
              data-aos="fade-down"
              data-aos-easing="ease-in-out"
              data-aos-duration="600"
              ref={ref}
              className="relative flex justify-center items-center z-30 w-[300px]"
            >
              <img
                src="/assets/review/star.gif"
                alt=""
                className="w-full h-full"
              />
            </div>
            <div
              className="flex flex-col items-center mx-auto"
              data-aos="fade-up"
              data-aos-easing="ease-in-out"
              data-aos-duration="600"
            >
              <p className="md:text-[22px] font-semibold md:font-bold text-[#43494b] text-center leading-relaxed">
                {yourReviewMakesADifference} <br />
                {shareItNow}
              </p>

              <button
                onClick={openLoginModal}
                className="bg-[#FFCF0A] hover:bg-[#FFCF0A] transition-colors duration-200 px-5 md:px-8 py-2 md:py-4 rounded-lg font-semibold text-[14px] md:text-base text-black border-none"
              >
                {writeReview}
              </button>
            </div>
          </div>
        ) : productReviews?.data?.userReview ? (
          <HasReview
            mainPage={false}
            reviewData={productReviews?.data?.userReview}
          />
        ) : (
          <div className="bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_36%,_white_70%)] mb-5">
            <div className="relative z-[5] max-w-3xl mx-auto flex flex-col gap-4 sm:gap-6 bg-white rounded-2xl tw_border_rr_first p-3 md:p-8">
              <div className="relative">
                {/* Rating Title */}
                <h3
                  className={`text-base md:text-[22px] font-semibold text-[#43494b] text-start sm:text-center mb-0`}
                >
                  {beTheFirstOneToReview}
                </h3>

                {/* Interactive Star Rating */}
                <div
                  className={`flex justify-start sm:justify-center sm:space-x-2 py-0 sm:py-2`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none border-none bg-transparent transition-transform hover:scale-110"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                    >
                      <svg
                        className={`w-[24px] h-[24px] sm:w-[34px] sm:h-[34px] transition-colors ${
                          star <= (hover || rating)
                            ? "text-[#F4B706] fill-[#F4B706] stroke-[#F4B706]"
                            : "text-gray-300 fill-gray-300 stroke-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 34 34"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_514_8180)">
                          <g filter="url(#filter0_d_514_8180)">
                            <path
                              d="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_514_8180"
                            x="-3.53125"
                            y="-0.863281"
                            width="40.9971"
                            height="39.7051"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="2" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0.818322 0 0 0 0 0.818322 0 0 0 0 0.818322 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_514_8180"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_514_8180"
                              result="shape"
                            />
                          </filter>
                          <clipPath id="clip0_514_8180">
                            <rect width="34" height="34" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text Section */}
              <div className="text-left">
                {!isMobile && (
                  <h4 className="text-base sm:text-lg font-semibold text-[#354259] mb-1">
                    {canYouTellUsMore}
                  </h4>
                )}

                {/* Text Area */}
                <div className="relative">
                  <textarea
                    value={reviewText}
                    onChange={handleReviewChange}
                    placeholder={leaveAReviewHere}
                    dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                    className={`w-full p-4 h-32 bg-white border rounded-lg text-gray-700 placeholder-gray-400 resize-auto focus:outline-none focus:ring-1 ${
                      reviewText.length === 200
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    }`}
                    maxLength={200}
                  />

                  {/* Character Counter */}
                  <div className="text-end text-sm text-gray-400">
                    {reviewText.length}/200
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                onClick={handleSubmit}
                className="w-full text-base bg-[#5F1BE7] hover:bg-[#5215cc] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none"
              >
                {submit}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Image Upload Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1010] flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="bg-white rounded-t-3xl md:rounded-t-2xl overflow-visible md:rounded-2xl flex flex-col p-6 gap-4 shadow-2xl w-full max-w-lg md:max-w-lg relative max-h-[90vh] md:overflow-y-auto transform transition-transform duration-300 ease-out translate-y-0"
            style={{
              animation:
                isImageModalOpen &&
                isMobile &&
                "slideUp 0.3s ease-out forwards",
            }}
          >
            <button
              onClick={handleImageModalClose}
              className="absolute md:hidden -top-4 right-8 z-10 bg-[#FCFCFC] rounded-full w-10 h-10 shadow-[0px_4px_12px_0px_#0000000F] flex items-center justify-center border-none cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <MdClose className="w-6 h-6 text-[#191B1C] font-semibold" />
            </button>
            {/* Rest of your modal content remains the same */}
            {/* Header */}
            <div className="flex justify-between items-center border-b">
              <h2 className="text-[22px] md:text-xl font-semibold text-gray-800 mb-0">
                {wantToAddProductImages}
              </h2>
              <button
                onClick={handleImageModalClose}
                className="text-gray-500 hidden md:block hover:text-gray-700 border-none bg-transparent text-2xl leading-none"
              >
                <MdClose />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* File Upload Area */}
              {selectedFiles?.length < 5 && (
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
                      {clickToUpload}
                    </span>
                    <span className="text-gray-600"> {orDragAndDrop}</span>
                  </p>

                  <p className="text-sm text-gray-500">
                    {pngJpgJpegMax5MB}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {maximumFilesAllowed} {MAX_FILES} {filesAllowed}
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
              )}

              {/* Error Messages */}
              {errors.length > 0 && (
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
              )}

              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-gray-700 mb-2 text-end md:text-start">
                    {isMobile ? "" : selectedFilesText} {selectedFiles.length}/
                    {MAX_FILES}
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
                          className="absolute -top-1.5 -right-1 bg-[#43494B] border-none text-white rounded-full p-0.5 flex items-center justify-center text-sm opacity-100 transition-opacity"
                        >
                          <MdClose className="w-3 h-3 text-[#FCFCFC]" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* {isMobile && (
                    <h3 className="text-base font-semibold text-gray-700 text-end mb-0">
                      {selectedFiles.length}/{MAX_FILES}
                    </h3>
                  )} */}
                </div>
              )}
            </div>
            {isMobile && selectedFiles?.length == 5 && <></>}

            {/* Footer Actions */}
            <div className="flex flex-col md:flex-row gap-3 border-t pt-4">
              <button
                onClick={handleImageSubmit}
                className="flex-1 bg-[#E7E8E9] btn-cancel-editmodal text-[#43494B] font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {skipForNow}
              </button>
              <button
                onClick={handleImageSubmit}
                className="flex-1 bg-[#5F1BE7] hover:bg-[#5215cc] border-none text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewNoRating;
