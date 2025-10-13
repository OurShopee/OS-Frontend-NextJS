import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { deleteReview, getAllReviews, updateUserReview } from "@/api/review";
import { getImageUrl } from "../utils/helpers";
import CustomStarRating from "./CustomStarRating";
import garbage from "./Garbage.json";

// ✅ ADD: Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// ✅ ADD: Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// ✅ ADD: Import required modules
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination as Paginate,
} from "swiper/modules";
import { setformstatus } from "../../redux/formslice";
import { MediaQueries } from "../utils";
import EditModalMobile from "./EditModalMobile";

const HasReview = ({
  rating,
  mainPage = true,
  reviewData,
  setProductReviews,
  setAllProductReviews,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { isMobile } = MediaQueries();
  const [editRating, setEditRating] = useState(reviewData?.rating);
  const [editReviewText, setEditReviewText] = useState(
    reviewData?.review_title
  );
  const [isOpenEditDelete, setIsOpenEditDelete] = useState(false);
  const dropdownEditDeleteRef = useRef(null);

  const toggleEditDeleteDropdown = () => {
    setIsOpenEditDelete(!isOpenEditDelete);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEditDeleteRef.current &&
        !dropdownEditDeleteRef.current.contains(event.target)
      ) {
        setIsOpenEditDelete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [editReviewImages, setEditReviewImages] = useState(
    reviewData?.image || []
  );
  const dispatch = useDispatch();

  // ✅ UPDATED: Single state for delete modal with dynamic content
  const [deleteModalState, setDeleteModalState] = useState(null);
  // null, "confirm", or "success"

  // ✅ NEW: Swiper image carousel modal states
  const [isImageCarouselOpen, setIsImageCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);

  const reviewTextareaRef = useRef(null);

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

  // ✅ UPDATED: Handle body scroll when modals are open
  useEffect(() => {
    if (isImageCarouselOpen || deleteModalState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isImageCarouselOpen, deleteModalState]);

  // Auto-resize function with unique name
  const autoResizeReviewTextarea = () => {
    const textarea = reviewTextareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Auto-resize on content change
  useEffect(() => {
    autoResizeReviewTextarea();
  }, [editReviewText]);

  const createFormData = () => {
    const formData = new FormData();

    formData.append("rating_id", reviewData?.rating_id);
    formData.append("productid", reviewData?.productid);
    formData.append("rating", editRating);
    formData.append("review_title", editReviewText);

    // Append images as an array
    editReviewImages.forEach((fileObj) => {
      if (typeof fileObj !== "string") {
        formData.append("images", fileObj.file);
      } else {
        formData.append("images", fileObj);
      }
    });

    return formData;
  };

  const handleImageSubmit = async () => {
    const formData = createFormData();
    const { data } = await updateUserReview(formData);
    if (data?.status === "success") {
      const { data } = await getAllReviews(reviewData?.product_id);
      setProductReviews(data);
      setAllProductReviews(data);
      setIsEditing(false);
      dispatch(setformstatus(5));
    }
  };

  const handleDeleteReview = async (rating_id, productid) => {
    try {
      const { data } = await deleteReview(rating_id, productid);
      if (data.status == "success") {
        setDeleteModalState("success");
        setTimeout(async () => {
          const { data } = await getAllReviews(reviewData?.product_id);
          setProductReviews(data);
          setAllProductReviews(data);
        }, 2000);
      } else {
        toast.error(data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [hover, setHover] = useState();
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  // Constants for validation
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRating(reviewData?.rating);
    setEditReviewText(reviewData?.review_title);
    setEditReviewImages(reviewData?.image || []);
    setHover(0);
    setErrors([]);
  };

  // Validation function for files
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files?.length > 0) {
      const newErrors = [];
      const validFiles = [];

      // Check if adding these files would exceed the limit
      if (editReviewImages.length + files.length > MAX_FILES) {
        newErrors.push(`You can only upload up to ${MAX_FILES} images`);
        setErrors(newErrors);
        return;
      }

      // Validate each file
      files.forEach((file) => {
        const fileErrors = validateFile(file);
        if (fileErrors.length === 0) {
          const fileWithPreview = {
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random(),
            name: file.name,
          };
          validFiles.push(fileWithPreview);
        } else {
          newErrors.push(...fileErrors);
        }
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
      } else {
        setEditReviewImages([...editReviewImages, ...validFiles]);
      }
    }

    // Clear the input value to allow selecting the same file again
    e.target.value = "";
  };

  const removeImage = (index) => {
    const updatedImages = editReviewImages.filter((_, i) => i !== index);
    setEditReviewImages(updatedImages);
  };

  // Auto-hide errors after 3 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

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
      <div className="w-full bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_15%,_white_70%)]">
        <div
          className={`relative w-full m-auto ${
            mainPage ? "" : "lg:max-w-[50%] xl:max-w-[40%]"
          }  flex flex-col gap-[14px] md:gap-4 bg-white rounded-2xl has-review-shadow p-3 md:p-8 z-[8] my-4 md:mt-0`}
        >
          {/* Header */}
          <div className="text-center relative">
            <div className="flex justify-between items-center mb-2 md:mb-4">
              <h3 className="text-lg md:text-[22px] font-semibold text-black mb-0">
                My Ratings & Review
              </h3>
              {reviewData?.rstatus === 0 ? (
                <div className="bg-transparent absolute top-0 right-0 text-[19px] h-[60px] w-[85px] md:h-[80px] tmd:w-w-[110px] leading-none flex items-center border-none text-[#5232C2] rounded-lg select-none">
                  <img
                    src="/assets/review/under-review.png"
                    className="h-full w-full swing-pendulum"
                    alt="Under Review"
                  />
                </div>
              ) : (
                <>
                  {/* <div className="bg-transparent h-[33px] text-[19px] leading-none cursor-pointer flex items-center border-none text-[#5232C2] rounded-lg select-none">
                    <img
                      onClick={() => setDeleteModalState("confirm")}
                      src="/assets/review/delete-icon.png"
                      className="h-full w-full"
                      alt="Delete Review"
                    />
                  </div> */}
                  <div
                    className="relative inline-block"
                    ref={dropdownEditDeleteRef}
                  >
                    {/* Triple Dots Button */}
                    <div
                      onClick={toggleEditDeleteDropdown}
                      className="bg-transparent h-[33px] text-[19px] leading-none cursor-pointer flex items-center justify-center border-none text-gray-500 rounded-lg select-none w-[33px] transition-colors"
                    >
                      <span className="text-[20px] font-bold">⋯</span>
                    </div>

                    {/* Dropdown Menu */}
                    {isOpenEditDelete && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          {reviewData?.rstatus === 1 &&
                            !reviewData.is_edited && (
                              <button
                                onClick={() => {
                                  handleEditClick();
                                  setIsOpenEditDelete(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-none bg-transparent"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M7.99992 14.6535C3.07792 14.6535 1.33325 12.9786 1.33325 8.25352C1.33325 3.5284 3.07792 1.85352 7.99992 1.85352C8.27592 1.85352 8.49992 2.06856 8.49992 2.33352C8.49992 2.59848 8.27592 2.81352 7.99992 2.81352C3.65725 2.81352 2.33325 4.08456 2.33325 8.25352C2.33325 12.4225 3.65725 13.6935 7.99992 13.6935C12.3426 13.6935 13.6666 12.4225 13.6666 8.25352C13.6666 7.98856 13.8906 7.77352 14.1666 7.77352C14.4426 7.77352 14.6666 7.98856 14.6666 8.25352C14.6666 12.9786 12.9219 14.6535 7.99992 14.6535Z"
                                    fill="#43494B"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.8243 6.58029L13.5301 5.81526C14.2981 4.98262 14.2167 3.70582 13.3501 2.9679C12.9301 2.61078 12.3874 2.43158 11.83 2.46486C11.27 2.4975 10.7567 2.73814 10.3847 3.14134L6.46205 7.39607C5.24605 8.71319 6.07805 10.4546 6.11405 10.5282C6.17338 10.6492 6.28272 10.7414 6.41538 10.781C6.45338 10.7932 6.89605 10.9231 7.47938 10.9231C8.13605 10.9231 8.97138 10.7573 9.60605 10.0687L12.7182 6.69526C12.7387 6.6791 12.7582 6.66113 12.7763 6.64137C12.7943 6.62196 12.8103 6.60152 12.8243 6.58029ZM6.93872 9.91447C7.35672 9.98743 8.27938 10.0591 8.85738 9.43255L11.6913 6.36072L10.0437 4.95983L7.21138 8.03287C6.61938 8.67351 6.80805 9.52791 6.93872 9.91447ZM10.7063 4.24089L12.3547 5.64161L12.7814 5.1791C13.1834 4.74262 13.1414 4.07318 12.6874 3.68726C12.4667 3.50038 12.1807 3.40502 11.8907 3.42294C11.5974 3.44086 11.3287 3.5663 11.1334 3.7775L10.7063 4.24089Z"
                                    fill="#43494B"
                                  />
                                </svg>
                                Edit
                              </button>
                            )}
                          <button
                            onClick={() => {
                              setIsOpenEditDelete(false);
                              setDeleteModalState("confirm");
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-none bg-transparent"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="18"
                              viewBox="0 0 16 18"
                              fill="none"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M3.68625 7.34366C3.96165 7.32314 4.20123 7.53423 4.22135 7.81516L4.62932 13.5106C4.69459 14.4231 5.43964 15.1296 6.33587 15.1296H10.3313C11.2281 15.1296 11.9725 14.4231 12.0378 13.5113L12.4457 7.81516C12.4659 7.53423 12.7055 7.32314 12.9809 7.34366C13.2563 7.36419 13.4632 7.60855 13.4431 7.88948L13.0351 13.5856C12.9317 15.0302 11.7524 16.1496 10.3313 16.1496H6.33587C4.91534 16.1496 3.73537 15.0302 3.63197 13.5849L3.22401 7.88948C3.20389 7.60855 3.41083 7.36419 3.68625 7.34366Z"
                                fill="#43494B"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M2.32349 5.7141C2.32349 5.43244 2.54735 5.2041 2.82349 5.2041H13.8432C14.1193 5.2041 14.3432 5.43244 14.3432 5.7141C14.3432 5.99576 14.1193 6.2241 13.8432 6.2241H2.82349C2.54735 6.2241 2.32349 5.99576 2.32349 5.7141Z"
                                fill="#43494B"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.96199 2.89063H9.70865C10.3109 2.89063 10.8395 3.30351 10.9953 3.89805C10.9979 3.90804 11.0003 3.91812 11.0023 3.92826L11.3376 5.61195C11.3926 5.88797 11.2178 6.15719 10.9471 6.21327C10.6765 6.26934 10.4126 6.09104 10.3576 5.815L10.026 4.14996C9.98358 4.00843 9.85485 3.91063 9.70865 3.91063H6.95952C6.81199 3.91011 6.68292 4.00779 6.64005 4.14982L6.31181 5.81407C6.25735 6.09019 5.99373 6.26901 5.72302 6.21346C5.4523 6.15791 5.27699 5.88902 5.33145 5.61289L5.66353 3.9292C5.66562 3.91861 5.66804 3.9081 5.67078 3.89767C5.82752 3.30159 6.35775 2.88896 6.96199 2.89063Z"
                                fill="#43494B"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.06765 8.86182C7.34379 8.86182 7.56765 9.09016 7.56765 9.37182V12.4375C7.56765 12.7192 7.34379 12.9475 7.06765 12.9475C6.79145 12.9475 6.56763 12.7192 6.56763 12.4375V9.37182C6.56763 9.09016 6.79145 8.86182 7.06765 8.86182ZM9.32125 8.86182C9.59739 8.86182 9.82125 9.09016 9.82125 9.37182V12.4375C9.82125 12.7192 9.59739 12.9475 9.32125 12.9475C9.04512 12.9475 8.82125 12.7192 8.82125 12.4375V9.37182C8.82125 9.09016 9.04512 8.86182 9.32125 8.86182Z"
                                fill="#43494B"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Star Rating Display/Edit */}
            <div className="hidden md:flex justify-start">
              <CustomStarRating
                editRating={editRating}
                setEditRating={setEditRating}
                isSelectable={isEditing}
                rating={reviewData?.rating}
                starSpacing="4px"
                size="46px"
                svgIconViewBox="0 0 44 44"
                path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
              />
            </div>
            <div className="flex md:hidden justify-start">
              <CustomStarRating
                editRating={editRating}
                setEditRating={setEditRating}
                isSelectable={isEditing}
                rating={editRating}
                svgIconViewBox="0 0 40 40"
                size="30px"
                path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
              />
            </div>
          </div>

          {((reviewData?.image && reviewData?.image?.length > 0) ||
            isEditing) && (
            <div className="text-left block md:hidden">
              {isEditing && (
                <h4 className="text-lg font-semibold text-[#354259] mb-3">
                  Add Images (Optional) - {editReviewImages?.length}/{MAX_FILES}
                </h4>
              )}

              {isEditing ? (
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {/* Upload Button */}
                  {editReviewImages?.length < MAX_FILES && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50">
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

                  {/* Image Previews in Edit Mode */}
                  {editReviewImages?.map((image, i) => (
                    <div key={image.id} className="relative aspect-square">
                      <img
                        src={
                          typeof image === "string"
                            ? getImageUrl(image)
                            : URL.createObjectURL(image.file)
                        }
                        alt="Review"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 border-none bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // ✅ UPDATED: Image grid with click handler for carousel
                <div className="grid grid-cols-5 gap-3">
                  {reviewData?.image.map((image, index) => (
                    <div key={image.id || index} className="relative">
                      <img
                        title="Click to view all images"
                        src={getImageUrl(image)}
                        alt={`Review ${index + 1}`}
                        className="w-16 h-16 p-2 object-cover has-review-shadow !shadow-none rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
                        onClick={() =>
                          handleImageClick(reviewData.image, index)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Review Text Display/Edit */}
          {(reviewData?.review_title || isEditing) && (
            <div className="text-left">
              {isEditing && (
                <h4 className="text-lg font-semibold text-[#354259] mb-3">
                  Your Review
                </h4>
              )}

              <div className="relative">
                <textarea
                  ref={reviewTextareaRef}
                  name="editReviewText"
                  id="editReviewTextarea"
                  disabled={!isEditing}
                  value={editReviewText}
                  onChange={(e) => {
                    handleReviewChange(e);
                    autoResizeReviewTextarea();
                  }}
                  onInput={autoResizeReviewTextarea}
                  placeholder="Leave a review here...."
                  className={`${
                    !isEditing && "cursor-not-allowed"
                  } w-full max-h-[300px] p-3 md:p-4 bg-white border border-none sm:border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 overflow-hidden`}
                  maxLength={200}
                  rows={1}
                />
                {isEditing && (
                  <div className="absolute bottom-3 right-4 text-sm text-gray-400">
                    {editReviewText?.length}/200
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm mb-1 last:mb-0">
                  {error}
                </p>
              ))}
            </div>
          )}

          {((reviewData?.image && reviewData?.image?.length > 0) ||
            isEditing) && (
            <div className="text-left hidden md:block">
              {isEditing && (
                <h4 className="text-lg font-semibold text-[#354259] mb-3">
                  Add Images (Optional) - {editReviewImages?.length}/{MAX_FILES}
                </h4>
              )}

              {isEditing ? (
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {/* Upload Button */}
                  {editReviewImages?.length < MAX_FILES && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:border-purple-400 hover:bg-purple-50">
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

                  {/* Image Previews in Edit Mode */}
                  {editReviewImages?.map((image, i) => (
                    <div key={image.id} className="relative aspect-square">
                      <img
                        src={
                          typeof image === "string"
                            ? getImageUrl(image)
                            : URL.createObjectURL(image.file)
                        }
                        alt="Review"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 border-none bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // ✅ UPDATED: Image grid with click handler for carousel
                <div className="grid grid-cols-5 gap-3">
                  {reviewData?.image.map((image, index) => (
                    <div key={image.id || index} className="relative">
                      <img
                        title="Click to view all images"
                        src={getImageUrl(image)}
                        alt={`Review ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
                        onClick={() =>
                          handleImageClick(reviewData.image, index)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {
            isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 text-base bg-[#b9b9b9] hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageSubmit}
                  className="flex-1 text-base bg-[#5F1BE7] hover:bg-[#5215cc] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none"
                >
                  Update
                </button>
              </div>
            )
            // (
            //   reviewData?.rstatus === 1 &&
            //   !reviewData.isEdited && (
            //     <div className="flex gap-3">
            //       <button
            //         onClick={handleEditClick}
            //         className="flex-1 text-base bg-[#5F1BE7] hover:bg-[#5215cc] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none"
            //       >
            //         Edit Review
            //       </button>
            //     </div>
            //   )
            // )
          }
        </div>
      </div>

      {/* ✅ REFACTORED: Single Delete Modal with Dynamic Content */}
      {deleteModalState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1060] p-4">
          <div className="bg-white rounded-2xl max-w-[400px] w-full mx-4 relative shadow-2xl">
            <div className="flex flex-col gap-1 px-6 py-8 text-center">
              {/* Dynamic Content Based on State */}
              {deleteModalState === "confirm" && (
                <>
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div
                      className="h-[130px] rounded-2xl"
                      data-aos="fade-up"
                      data-aos-offset="0"
                      data-aos-duration="1000"
                      data-aos-easing="ease-out-back"
                    >
                      <img
                        className="w-full h-full"
                        src="/assets/review/delete-cross.png"
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {/* Title */}
                    <h3 className="text-xl text-left font-medium text-[#181D27] mb-0">
                      Delete Review
                    </h3>

                    {/* Description */}
                    <p className="text-[#535862] text-left text-[15px] tracking-normal leading-5 font-normal mb-2">
                      Are you sure you want to delete this review? This action
                      cannot be undone.
                    </p>
                  </div>
                </>
              )}

              {deleteModalState === "success" && (
                <>
                  <div className="flex justify-center items-center w-full">
                    <Lottie
                      animationData={garbage}
                      loop
                      autoplay
                      className="w-[150px] h-[150px]"
                    />
                  </div>
                  <h2 className="font-semibold text-2xl text-[#191B1C] mb-0">
                    Review <br />
                    Successfully Deleted
                  </h2>
                  <p className="text-[#9EA5A8] text-sm font-normal mb-0">
                    Review has been removed.
                  </p>
                </>
              )}

              {/* Dynamic Footer Buttons */}
              <div className="flex gap-3 mt-4">
                {deleteModalState === "confirm" && (
                  <>
                    <button
                      onClick={() => setDeleteModalState(null)}
                      className="flex-1 bg-[#5232C2] text-white text-lg font-medium py-2 px-[18px] rounded-lg hover:bg-[#5215cc] transition-all duration-200 border-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteReview(
                          reviewData.rating_id,
                          reviewData.product_id
                        )
                      }
                      className="flex-1 bg-white text-gray-700 text-lg font-medium py-2 px-[18px] rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </>
                )}
                {deleteModalState === "success" && (
                  <button
                    onClick={() => setDeleteModalState(null)}
                    className="bg-[#5232C2] text-white font-semibold py-2.5 px-[18px] rounded-lg text-lg border-none grow-width"
                  >
                    Back to Home
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Swiper Image Carousel Modal */}
      {isImageCarouselOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur flex items-center justify-center z-[1020] p-4">
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
                      <img
                        src={getImageUrl(image)}
                        alt={`Review ${index + 1}`}
                        className="max-w-full flex-grow max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="md:hidden">
          <EditModalMobile
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            reviewData={reviewData}
            onUpdate={handleImageSubmit}
            MAX_FILES={5}
            isImageCarouselOpen={isImageCarouselOpen}
            setIsImageCarouselOpen={setIsImageCarouselOpen}
            carouselImages={carouselImages}
            setCarouselImages={setCarouselImages}
            initialSlideIndex={initialSlideIndex}
            setInitialSlideIndex={setInitialSlideIndex}
            // Edit states
            editRating={editRating}
            setEditRating={setEditRating}
            editReviewText={editReviewText}
            setEditReviewText={setEditReviewText}
            editReviewImages={editReviewImages}
            setEditReviewImages={setEditReviewImages}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
      )}
    </>
  );
};

export default HasReview;
