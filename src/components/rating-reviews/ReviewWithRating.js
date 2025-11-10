import { useEffect, useRef, useState } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import {
  MdClose,
  MdKeyboardArrowDown,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import required modules
import {
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination as Paginate,
} from "swiper/modules";

import { FaCheck, FaStar, FaUser } from "react-icons/fa";
import { setformstatus } from "@/redux/formslice";
import {
  dislikeAReview,
  getAllReviews,
  likeAReview,
  postUserReview,
} from "@/api/review";
import { ComponentHeader } from "../Common";
import { MediaQueries } from "../utils";
import { getImageUrl, useLoginModal } from "../utils/helpers";
import useDebounce from "../utils/UseDebounce";
import CustomStarRating from "./CustomStarRating";
import HasReview from "./HasReview";
import PostReviewMainPage from "./PostReviewMainPage";
import RatingOverview from "./RatingOverview";

const ReviewWithRating = ({
  setProductReviews,
  productReviews,
  allProductReviews,
  setAllProductReviews,
}) => {
  const authstatus = useSelector((state) => state.formslice.authstatus);
  const logindata = useSelector((state) => state.formslice.logindata);
  const productDetail = useSelector(
    (state) => state.productslice.productDetail
  );
  const { isMobile } = MediaQueries();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hover, setHover] = useState(0);
  const { openLoginModal } = useLoginModal();

  // Image upload modal states
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Swiper image carousel modal states
  const [isImageCarouselOpen, setIsImageCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);

  // Review state management
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);

  // API-driven pagination states with debounced search
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStars, setSelectedStars] = useState([]);
  const [isStarDropdownOpen, setIsStarDropdownOpen] = useState(false);

  // Use debounce hook for search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Extract pagination data from API response
  const totalReviews =
    productReviews?.data?.stats?.totalratingsForPagination || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Add this ref for the sort dropdown container
  const sortDropdownRef = useRef(null);
  const starDropdownRef = useRef(null);

  // Handle image click to open Swiper carousel
  const handleImageClick = (images, clickedIndex) => {
    setCarouselImages(images);
    setInitialSlideIndex(clickedIndex);
    setIsImageCarouselOpen(true);
  };

  // Close image carousel modal
  const handleCloseImageCarousel = () => {
    setIsImageCarouselOpen(false);
    setCarouselImages([]);
    setInitialSlideIndex(0);
  };

  //Handle body scroll when modals are open
  useEffect(() => {
    if (isImageCarouselOpen || isImageModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isImageCarouselOpen, isImageModalOpen]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortDropdownOpen(false);
      }
      if (
        starDropdownRef.current &&
        !starDropdownRef.current.contains(event.target)
      ) {
        setIsStarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle star checkbox changes
  const handleStarCheckboxChange = (starValue, isChecked) => {
    if (isChecked) {
      setSelectedStars((prev) => [...prev, starValue]);
    } else {
      setSelectedStars((prev) => prev.filter((star) => star !== starValue));
    }
    setCurrentPage(1); // Reset pagination
  };

  const getSortDisplayText = (sortValue) => {
    switch (sortValue) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "highest":
        return "Highest Rating";
      case "lowest":
        return "Lowest Rating";
      default:
        return "Newest First";
    }
  };

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];

  // Reset page when filters change (use debouncedSearchTerm)
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, debouncedSearchTerm, selectedStars, productDetail]);

  // Main fetch effect with proper search handling
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = {
          page: currentPage,
          sort: sortBy,
          stars: selectedStars.length > 0 ? selectedStars.join(",") : undefined,
        };

        // Only add search param if there's actually a search term
        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
          params.search = debouncedSearchTerm.trim();
        }

        const { data } = await getAllReviews(productDetail[0]?.id, params);

        if (data?.status === "success") {
          setProductReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    if (productDetail?.[0]?.id) {
      fetchReviews();
    }
  }, [
    productDetail,
    currentPage,
    sortBy,
    debouncedSearchTerm,
    selectedStars,
    reviewsPerPage,
  ]);

  // Handle like/dislike with proper search handling
  const handleLike = async (review_id, productid) => {
    try {
      const response = await likeAReview(review_id, productid);

      // Check if response exists and has the expected structure
      if (response && response.data && response.data.status === "success") {

        const params = {
          page: currentPage,
          sort: sortBy,
          stars: selectedStars.length > 0 ? selectedStars.join(",") : undefined,
        };

        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
          params.search = debouncedSearchTerm.trim();
        }

        const res = await getAllReviews(productDetail[0]?.id, params);
        if (res?.data?.status === "success") {
          setProductReviews(res.data);
        }
      } else {
        console.error(
          "Like action failed - unexpected response structure:",
          response
        );
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleDislike = async (review_id, productid) => {
    try {
      const response = await dislikeAReview(review_id, productid);

      // Check if response exists and has the expected structure
      if (response && response.data && response.data.status === "success") {

        const params = {
          page: currentPage,
          sort: sortBy,
          stars: selectedStars.length > 0 ? selectedStars.join(",") : undefined,
        };

        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
          params.search = debouncedSearchTerm.trim();
        }

        const res = await getAllReviews(productDetail[0]?.id, params);
        if (res?.data?.status === "success") {
          setProductReviews(res.data);
        }
      } else {
        console.error(
          "Dislike action failed - unexpected response structure:",
          response
        );
      }
    } catch (error) {
      console.error("Error in handleDislike:", error);
    }
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
      dispatch(setformstatus(5));
    }
    setIsImageModalOpen(false);
    setReviewText("");
    setRating(3);
    setReviewImages([]);
    setSelectedFiles([]);
    setErrors([]);
  };

  useEffect(() => {
    const getReveiwDetails = async () => {
      const { data } = await getAllReviews(productDetail[0]?.id);
      if (data.status === "success") setProductReviews(data);
    };
    getReveiwDetails();
  }, [logindata]);

  useEffect(() => {
    if (productReviews?.data?.userReview) {
      setHasExistingReview(true);
    } else {
      setHasExistingReview(false);
    }
  }, [productReviews, logindata]);

  const Pagination = () => {
    const totalReviews =
      productReviews?.data?.stats?.totalratingsForPagination || 0;
    const currentPageFromAPI =
      productReviews?.data?.stats?.currentPageForPagination || currentPage;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 3;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const slideThreshold = Math.ceil(maxVisiblePages * 0.6);

        let startPage, endPage;

        if (currentPageFromAPI < slideThreshold) {
          startPage = 1;
          endPage = maxVisiblePages;
        } else if (currentPageFromAPI > totalPages - slideThreshold + 1) {
          startPage = totalPages - maxVisiblePages + 1;
          endPage = totalPages;
        } else {
          const adjacentPages = Math.floor(maxVisiblePages / 2);
          startPage = currentPageFromAPI - adjacentPages;
          endPage = currentPageFromAPI + adjacentPages;

          if (maxVisiblePages % 2 === 0) {
            endPage = currentPageFromAPI + adjacentPages - 1;
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();
    const canGoPrevious = currentPageFromAPI > 1;
    const canGoNext = currentPageFromAPI < totalPages;

    return (
      <div className="flex items-center justify-center mt-3 mb-5 md:mb-0 md:mt-8 gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(currentPageFromAPI - 1)}
          disabled={!canGoPrevious}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 border-review-pagination disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          ← Back
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => {
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-0 !w-8 py-2 text-sm font-medium border-review-pagination ${
                pageNum === currentPageFromAPI
                  ? "bg-[#191B1C] text-white !border-blue-[#191B1C]"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(currentPageFromAPI + 1)}
          disabled={!canGoNext}
          className="flex items-center border-review-pagination px-3 py-2 text-sm font-medium text-gray-500 bg-white border gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="w-full py-0 xl:py-10 text-center overflow-hidden bg-white">
        {/* Header */}
        <div className="component_1 product_Detail_carousel_prod relative">
          {/* {productDetail_products.hasOwnProperty("related_products") && ( */}
          <ComponentHeader
            title={"Ratings & Review"}
            // first_title={"Related"}
            // second_title={"PRODUCTS"}
            // first_string_color={"#000"}
            // second_string_color={null}
            view_all={"rgba(82, 50, 194, 1)"}
            allProductReviews={allProductReviews}
          />
          {/* )} */}
        </div>

        {/* Main Content */}
        <div className="z-20 w-full rounded-2xl md:p-8">
          <div
            className={`grid grid-cols-1 ${
              allProductReviews?.data?.result?.length > 0
                ? "lg:grid-cols-[44%_56%]"
                : ""
            } md:gap-8 items-start`}
          >
            {/* Left Side - Rating Overview & Review Form */}
            <div
              className={`mb-8 md:mb-0 flex-col md:flex-row flex ${
                allProductReviews?.data?.result?.length > 0
                  ? "md:!flex-col"
                  : "w-full"
              } md:gap-8`}
            >
              {/* Rating Overview */}
              {allProductReviews?.data?.stats?.averageRating > 0 && (
                <RatingOverview productReviews={allProductReviews?.data} />
              )}

              {/* Review Form */}
              <div
                className={`hidden md:flex w-full flex-col relative ${
                  !authstatus ? "items-center" : "items-start"
                } justify-center min-h-full ${
                  !authstatus
                    ? "bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_8%,_white_70%)] rounded-2xl p-6"
                    : ""
                }`}
              >
                {/* Quote Icons - Only show when not authenticated */}
                {!authstatus && (
                  <>
                    <img
                      src={"/assets/review/left-icon-review.png"}
                      alt="Quote Left"
                      className="hidden md:block absolute left-[2%] top-[8%] -translate-y-1/2 w-[100px] z-1"
                    />
                    <img
                      src={"/assets/review/left-icon-review.png"}
                      alt="Quote Right"
                      className="hidden md:block absolute right-[2%] top-[90%] -translate-y-1/2 w-[100px] z-1 rotate-180"
                    />
                  </>
                )}

                {!authstatus ? (
                  <div className="text-center">
                    <p
                      data-aos="fade-down"
                      data-aos-easing="ease-in-out"
                      data-aos-duration="700"
                      className="md:text-[22px] font-semibold md:font-bold text-[#43494b] text-center leading-relaxed"
                    >
                      Your review makes a difference <br />
                      share it now!
                    </p>

                    <button
                      data-aos="fade-up"
                      data-aos-easing="ease-in-out"
                      data-aos-duration="700"
                      onClick={openLoginModal}
                      className="bg-[#FFCF0A] hover:bg-[#FFCF0A] transition-colors duration-200 px-5 md:px-8 py-2 md:py-4 rounded-lg font-semibold text-[14px] md:text-base text-black border-none"
                    >
                      Write a review
                    </button>
                  </div>
                ) : (
                  <>
                    {hasExistingReview ? (
                      <HasReview
                        reviewData={productReviews?.data?.userReview}
                        setProductReviews={setProductReviews}
                        setAllProductReviews={setAllProductReviews}
                      />
                    ) : (
                      <PostReviewMainPage
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

            {/* Right Side - All Reviews */}
            {allProductReviews?.data?.result?.length > 0 && (
              <div className="w-full h-full md:px-6 mb-3 md:mb-0">
                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-3 md:mb-0">
                  {/* Search Bar with debounced search */}
                  <div className="flex items-center bg-white border border-gray-300 flex-[1_0_0]">
                    <input
                      type="text"
                      placeholder="Search our customer's review"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                      className="flex-1 px-4 py-2 md:py-1 border-none border-rating-input-filter placeholder-[#9EA5A8] text-gray-700 text-[15px] bg-[#FCFCFC] rounded-l-full md:rounded-l-[4px] outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none"
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center px-[15px] text-[15px] font-normal text-white py-[.56rem] md:py-[5px] bg-black border-none rounded-r-full md:rounded-r-[4px] cursor-pointer"
                      onClick={() => {
                        console.log("Search clicked:", debouncedSearchTerm);
                      }}
                    >
                      Search
                    </button>
                  </div>

                  {/* Sort By Dropdown */}
                  <div
                    ref={sortDropdownRef}
                    className="relative flex-grow md:flex-grow-0  bg-[#fcfcfc] border-rating-filters rounded-full md:rounded-[3px] px-4 py-2 md:py-1.5 text-[15px] font-normal focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500"
                  >
                    <div
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center gap-2 justify-between cursor-pointer min-w-[120px]"
                    >
                      <span className="text-[15px] font-normal">
                        {getSortDisplayText(sortBy)}
                      </span>
                      <MdKeyboardArrowDown
                        className={`text-gray-400 w-[15px] h-5 transition-transform ${
                          isSortDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isSortDropdownOpen && (
                      <div className="absolute overflow-hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg z-[9]">
                        {[
                          { value: "newest", label: "Newest First" },
                          { value: "oldest", label: "Oldest First" },
                          { value: "highest", label: "Highest Rating" },
                          { value: "lowest", label: "Lowest Rating" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setCurrentPage(1);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`px-3 py-2 text-[15px] font-normal cursor-pointer hover:bg-gray-50 ${
                              sortBy === option.value ? "bg-gray-100" : ""
                            }`}
                          >
                            <span>{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stars Filter Dropdown */}
                  <div
                    ref={starDropdownRef}
                    className="relative flex-grow md:flex-grow-0 bg-[#fcfcfc] border-rating-filters rounded-full md:rounded-[3px] px-4 py-2 md:py-1.5 text-[15px] font-normal focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500"
                  >
                    <div
                      onClick={() => setIsStarDropdownOpen(!isStarDropdownOpen)}
                      className="flex items-center gap-2 justify-between cursor-pointer min-w-[80px]"
                    >
                      <span className="text-[15px] font-normal">
                        {selectedStars.length === 0
                          ? "All"
                          : selectedStars.length === 1
                          ? `${selectedStars[0]} Star`
                          : `${selectedStars.length} Stars`}
                      </span>
                      <MdKeyboardArrowDown
                        className={`text-gray-400 w-[15px] h-5 transition-transform ${
                          isStarDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* {isStarDropdownOpen && (
                      <div className="absolute overflow-hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg z-[9]">
                        <div
                          onClick={() => {
                            setSelectedStars([]);
                            setCurrentPage(1);
                          }}
                          className="px-3 py-2 text-[15px] font-normal cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                        >
                          <span className="font-semibold">All</span>
                        </div>

                        {[5, 4, 3, 2, 1].map((star) => {
                          const isChecked = selectedStars.includes(star);

                          return (
                            <label
                              key={star}
                              className="flex justify-center items-center gap-4 px-3 py-2 text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                            >
                            
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleStarCheckboxChange(
                                    star,
                                    e.target.checked
                                  )
                                }
                                className="hidden peer"
                                onClick={(e) => e.stopPropagation()}
                              />

                             
                              <span className="flex items-center justify-center">
                                {isChecked ? (
                                  <div className="border p-1 h-6 w-6 flex items-center justify-center rounded-md">
                                    <FaCheck className="text-[#f4b706] text-sm" />
                                  </div>
                                ) : (
                                  <div className="text-gray-300 w-6 h-6 border rounded-md" />
                                )}
                              </span>

                              <span className="flex items-center gap-1">
                                <span className="text-lg font-semibold">
                                  {star}
                                </span>
                                <FaStar className="w-5 h-5 text-[#f4b706]" />
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )} */}

                    {isStarDropdownOpen && (
                      <div className="absolute overflow-hidden top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg z-[9]">
                        <div
                          onClick={() => {
                            setSelectedStars([]);
                            setCurrentPage(1);
                          }}
                          className="px-3 py-2 text-[15px] font-normal cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                        >
                          <span className="font-semibold">All</span>
                        </div>

                        {[5, 4, 3, 2, 1].map((star) => {
                          const isChecked = selectedStars.includes(star);

                          return (
                            <label
                              key={star}
                              className="flex justify-center items-center gap-4 px-3 py-2 text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                name="star-rating"
                                value={star}
                                checked={isChecked}
                                onChange={(e) => {
                                  // Clear previous selections and set only this one
                                  if (e.target.checked) {
                                    handleStarCheckboxChange(star, true);

                                    selectedStars.forEach((existingStar) => {
                                      if (existingStar !== star) {
                                        handleStarCheckboxChange(
                                          existingStar,
                                          false
                                        );
                                      }
                                    });
                                  }
                                }}
                                className="hidden peer"
                                onClick={(e) => e.stopPropagation()}
                              />

                              <span className="flex items-center justify-center">
                                {isChecked ? (
                                  <div className="border p-1 h-6 w-6 flex items-center justify-center rounded-full border-[#f4b706]">
                                    <div className="w-3 h-3 bg-[#f4b706] rounded-full" />
                                  </div>
                                ) : (
                                  <div className="text-gray-300 w-6 h-6 border rounded-full" />
                                )}
                              </span>

                              <span className="flex items-center gap-1">
                                <span className="text-lg font-semibold">
                                  {star}
                                </span>
                                <FaStar className="w-5 h-5 text-[#f4b706]" />
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="my-0 max-h-[400px] md:max-h-[500px] overflow-y-auto">
                  {productReviews?.data?.result?.map((review, i) => {
                    const dateStr = review.created_at;
                    const options = {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    };
                    const parts = new Date(dateStr)
                      .toLocaleDateString("en-GB", options)
                      .split(" ");
                    const formattedDate = `${parts[0]} ${parts[1]}, ${parts[2]}`;
                    const isLiked = review?.liked_by_user || false;
                    const isDisliked = review?.disliked_by_user || false;
                    return (
                      <div
                        key={i}
                        className="bg-white border-bottom-reviews-scoll last:border-none py-5 flex flex-col gap-[14px] sm:gap-5"
                      >
                        {/* Review Header */}
                        <div className="flex items-start justify-between flex-grow md:flex-grow-0">
                          <div className="flex items-center gap-2 flex-grow">
                            <div className="rounded-full flex items-center md:justify-center">
                              <FaUser className="w-8 h-8 bg-gray-300 p-2 rounded-full text-[#ffff] border-none outline-none [&>*]:border-none" />
                            </div>
                            <div className="flex justify-between flex-row items-start md:items-center gap-2 flex-grow md:flex-grow-0">
                              <span className="text-base font-medium text-[#232121] flex flex-col items-start capitalize">
                                {review?.user?.first_name}
                                <div className="flex md:hidden items-center gap-1 h-2">
                                  <CustomStarRating
                                    editRating={false}
                                    setEditRating={false}
                                    isSelectable={false}
                                    rating={review?.rating}
                                    svgIconViewBox="0 0 34 34"
                                    size="16"
                                    path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                                  />
                                </div>
                              </span>
                              <span className="text-xs md:text-base font-normal text-[#323232] flex md:gap-2">
                                <span className="hidden md:block">•</span>{" "}
                                {formattedDate}
                              </span>
                            </div>
                          </div>

                          {/* Rating Stars */}
                          <div className="hidden md:flex items-center gap-1">
                            <CustomStarRating
                              editRating={false}
                              setEditRating={false}
                              isSelectable={false}
                              rating={review?.rating}
                              size="30px"
                              svgIconViewBox="0 0 44 44"
                              path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
                            />
                          </div>
                        </div>

                        {/* Review Content */}
                        {review?.review_title && (
                          <p className="text-[#6F6F6F] text-sm md:text-base font-normal leading-relaxed text-left mb-0">
                            {review.review_title}
                          </p>
                        )}

                        {/* ✅  Review Images with click handler */}
                        {review?.image && review?.image?.length > 0 && (
                          <div className="grid grid-cols-5 gap-3">
                            {review?.image?.map((image, index) => {
                              return (
                                <div key={index} className="relative">
                                  <img
                                    title="Click to view all images"
                                    src={getImageUrl(image)}
                                    alt={`Review ${index + 1}`}
                                    className="w-full h-14 md:h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
                                    onClick={() =>
                                      handleImageClick(review.image, index)
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {review?.isTrustedReviewer && (
                          <div className="flex items-center gap-1">
                            <BsShieldFillCheck
                              color="#4294FF"
                              className="h-4 w-4 md:w-5 md:h-5"
                            />
                            <span className="text-xs md:text-base text-blue-600 font-normal">
                              Trusted Reviewer
                            </span>
                          </div>
                        )}

                        {/* Like/Dislike Actions */}
                        <div className="flex items-center gap-2 border-t border-gray-100">
                          <button
                            onClick={() =>
                              handleLike(review.rating_id, review.productid)
                            }
                            className={`flex items-center gap-1 bg-transparent rounded-lg transition-colors border-none ${
                              isLiked ? "text-[#4294ff]" : "text-[#bbb]"
                            }`}
                          >
                            <MdThumbUp className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                            <span className="text-sm md:text-base font-medium">
                              {review?.likes}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              handleDislike(review.rating_id, review.productid)
                            }
                            className={`flex items-center gap-1 bg-transparent rounded-lg transition-colors border-none ${
                              isDisliked ? "text-[#4294ff]" : "text-[#bbb]"
                            }`}
                          >
                            <MdThumbDown className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" />
                            <span className="text-sm md:text-base font-medium">
                              {review?.dislikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show pagination when we have more than one page */}
                {totalPages > 1 && <Pagination />}

                {/* No Results */}
                {productReviews?.data?.result?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">
                      No reviews found
                    </div>
                    <div className="text-gray-500 text-sm">
                      {totalReviews === 0
                        ? ""
                        : "Try adjusting your search or filter criteria"}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review Form */}
            <div
              className={`md:hidden flex w-full flex-col relative ${
                !authstatus ? "items-center" : "items-start"
              } justify-center min-h-full ${
                !authstatus
                  ? "bg-[radial-gradient(ellipse_at_center,_rgba(216,180,254,0.4)_8%,_white_70%)] rounded-2xl p-6"
                  : ""
              }`}
            >
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
                      reviewData={productReviews?.data?.userReview}
                      setProductReviews={setProductReviews}
                      setAllProductReviews={setAllProductReviews}
                    />
                  ) : (
                    <PostReviewMainPage
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
      </div>

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
                Want to add product images ?
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
                    {isMobile ? "" : "Selected Files:"} {selectedFiles.length}/
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
                        alt={`Review  ${index + 1}`}
                        className="max-w-full flex-grow max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              1 / {carouselImages.length}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewWithRating;
