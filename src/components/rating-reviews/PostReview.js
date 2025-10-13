import React from "react";

const PostReview = ({
  rating,
  setRating,
  hover,
  setHover,
  reviewText,
  setReviewText,
  reviewImages,
  setReviewImages,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleStarHover = (star) => {
    setHover(star);
  };

  const handleStarLeave = () => {
    setHover(0);
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
    <div className="w-full max-w-[92%] flex flex-col gap-6 bg-white rounded-2xl border-[#EDEDED] shadow-lg p-8 mx-4">
      <div className="relative">
        {/* Rating Title */}
        <h3 className="text-[22px] font-semibold text-black text-center">
          Rate this product and tell others what you think
        </h3>

        {/* Interactive Star Rating */}
        <div className="flex justify-center space-x-2 py-2">
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
                className={`w-[34px] h-[34px] transition-colors ${
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
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
        <h4 className="text-lg font-semibold text-[#354259] mb-1">
          Can you tell us more?
        </h4>

        <div className="relative">
          <textarea
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="Leave a review here...."
            className="w-full h-32 p-4 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            maxLength={200}
          />
          <div className="absolute bottom-3 right-4 text-sm text-gray-400">
            {reviewText?.length ? reviewText?.length : 0}/200
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className={`flex gap-3 ${onCancel ? "flex-row" : ""}`}>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 text-base bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none"
          >
            Cancel
          </button>
        )}
        <button
          onClick={onSubmit}
          className={`${
            onCancel ? "flex-1" : "w-full"
          } text-base bg-[#5F1BE7] hover:bg-[#5215cc] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-none`}
        >
          {isEditing ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PostReview;
