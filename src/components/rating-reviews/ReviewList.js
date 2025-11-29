import React, { useState, useEffect } from "react";
import { MdThumbUp, MdThumbDown, MdSort, MdSearch } from "react-icons/md";
import RatingOverview from "./RatingOverview";
import { useContent } from "@/hooks";

const ReviewList = () => {
  const ratingsAndReview = useContent("product.ratingsAndReview");
  const topReviews = useContent("product.topReviews");
  const searchCustomerReview = useContent("product.searchCustomerReview");
  const noReviewsFound = useContent("product.noReviewsFound");
  // Sample reviews data
  const [allReviews, setAllReviews] = useState([
    {
      id: 1,
      username: "Username",
      date: "22 Jun 2025",
      rating: 5,
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      images: [
        "https://via.placeholder.com/120x120?text=Image+1",
        "https://via.placeholder.com/120x120?text=Image+2",
        "https://via.placeholder.com/120x120?text=Image+3",
      ],
      likes: 456,
      dislikes: 3,
      isLiked: false,
      isDisliked: false,
      isTrustedReviewer: true,
    },
    {
      id: 2,
      username: "Username",
      date: "22 Jun 2025",
      rating: 4,
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      images: [
        "https://via.placeholder.com/120x120?text=Image+1",
        "https://via.placeholder.com/120x120?text=Image+2",
        "https://via.placeholder.com/120x120?text=Image+3",
      ],
      likes: 234,
      dislikes: 12,
      isLiked: false,
      isDisliked: false,
      isTrustedReviewer: true,
    },
    // Add more sample reviews here...
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 3,
      username: "Username",
      date: "22 Jun 2025",
      rating: Math.floor(Math.random() * 5) + 1,
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      images: [
        "https://via.placeholder.com/120x120?text=Image+1",
        "https://via.placeholder.com/120x120?text=Image+2",
      ],
      likes: Math.floor(Math.random() * 500) + 50,
      dislikes: Math.floor(Math.random() * 20) + 1,
      isLiked: false,
      isDisliked: false,
      isTrustedReviewer: Math.random() > 0.5,
    })),
  ]);

  // State management
  const [filteredReviews, setFilteredReviews] = useState(allReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [starFilter, setStarFilter] = useState("all");

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

  // Filter and sort reviews
  useEffect(() => {
    let filtered = [...allReviews];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Star rating filter
    if (starFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(starFilter)
      );
    }

    // Sort reviews
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "most_liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, starFilter, allReviews]);

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews?.length / reviewsPerPage);

  // Handle like/dislike
  const handleLike = (reviewId) => {
    setAllReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          if (review.isLiked) {
            return { ...review, likes: review.likes - 1, isLiked: false };
          } else {
            return {
              ...review,
              likes: review.likes + 1,
              isLiked: true,
              dislikes: review.isDisliked
                ? review.dislikes - 1
                : review.dislikes,
              isDisliked: false,
            };
          }
        }
        return review;
      })
    );
  };

  const handleDislike = (reviewId) => {
    setAllReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          if (review.isDisliked) {
            return {
              ...review,
              dislikes: review.dislikes - 1,
              isDisliked: false,
            };
          } else {
            return {
              ...review,
              dislikes: review.dislikes + 1,
              isDisliked: true,
              likes: review.isLiked ? review.likes - 1 : review.likes,
              isLiked: false,
            };
          }
        }
        return review;
      })
    );
  };

  // Pagination component
  const Pagination = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center mt-8 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className={`px-3 py-2 text-sm font-medium rounded-lg border ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : page === "..."
                ? "text-gray-400 cursor-default border-transparent"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <section className="relative w-full py-10 text-center overflow-hidden bg-white">
      {/* Header */}
      <div className="relative z-20 w-full text-left mb-6">
        <h2 className="text-3xl font-bold text-[#43494b] text-left w-full max-w-screen-xl">
          {ratingsAndReview}
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[53%_47%] gap-8 items-start">
          {/* Left Side - Rating Overview */}
          <RatingOverview ratingsData={ratingsData} />

          {/* Right Side - Filters and Search */}
          <div className="w-full space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={searchCustomerReview}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {topReviews}
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="most_liked">Most Liked</option>
                  </select>
                  <MdSort className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Star Filters */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Stars</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setStarFilter("all")}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      starFilter === "all"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setStarFilter(star.toString())}
                      className={`px-3 py-1 text-sm rounded-full border flex items-center gap-1 ${
                        starFilter === star.toString()
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {star}
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-12 space-y-6">
          {currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {review.date}
                      </span>
                    </div>
                    {review.isTrustedReviewer && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-blue-600 font-medium">
                          Trusted Reviewer
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "text-[#F4B706] fill-[#F4B706]"
                          : "text-gray-300 fill-gray-300"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>

              {/* Review Images */}
              {review.images && review.images?.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-3 flex-wrap">
                    {review.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image}
                          alt={`Review ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(image, "_blank")}
                          loading="lazy"
                        />
                        {index === 2 && review.images?.length > 3 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer">
                            <span className="text-white text-sm font-medium">
                              +{review.images?.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Like/Dislike Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(review.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border-none ${
                    review.isLiked
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MdThumbUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{review.likes}</span>
                </button>

                <button
                  onClick={() => handleDislike(review.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border-none ${
                    review.isDisliked
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MdThumbDown className="w-4 h-4" />
                  <span className="text-sm font-medium">{review.dislikes}</span>
                </button>

                <button className="text-gray-500 hover:text-gray-700 text-sm font-medium border-none bg-transparent">
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}

        {/* No Results */}
        {filteredReviews?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">{noReviewsFound}</div>
            <div className="text-gray-500 text-sm">
              {tryAdjustingSearchOrFilter}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewList;
