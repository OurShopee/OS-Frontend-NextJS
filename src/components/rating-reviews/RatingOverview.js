import CustomStarRating from "./CustomStarRating";
import { useContent } from "@/hooks";
import { getAssetsUrl } from "../utils/helpers";

const RatingOverview = ({ productReviews }) => {
  const stats = productReviews?.stats;
  const ratings = useContent("product.ratings");
  const reviews = useContent("product.reviews");

  return (
    <div className="flex items-center md:items-start pt-1 gap-2 md:gap-8 w-full">
      {/* Average Rating Display */}
      <div className="flex items-center gap-4 w-max">
        <div className="relative text-center gap-3 md:p-0 w-[142px] h-[130px] md:h-full md:w-full">
          <img className="md:hidden absolute h-full w-full left-0 top-0"
            src={getAssetsUrl("review/overview-border.svg")}
            alt="Overview Border"
          loading="lazy" />
          <div className="gap-1 flex items-center justify-center flex-col h-full">
            <div className="leading-3 text-[32px] md:text-5xl font-semibold text-black">
              {Number.isInteger(stats?.averageRating)
                ? `${stats?.averageRating}.0`
                : stats?.averageRating?.toFixed(1)}
            </div>
            <div className="hidden md:block whitespace-nowrap">
              <CustomStarRating rating={stats?.averageRating} />
            </div>
            <div className="md:hidden whitespace-nowrap">
              <CustomStarRating
                svgIconViewBox="0 0 40 40"
                size="17"
                rating={stats?.averageRating}
                path="M18.1901 2.64701L22.0515 10.4427C22.1394 10.6406 22.2775 10.812 22.4522 10.9398C22.6269 11.0676 22.8321 11.1475 23.0472 11.1713L31.5714 12.4342C31.8184 12.4659 32.0511 12.5672 32.2425 12.7262C32.4338 12.8852 32.5761 13.0955 32.6524 13.3323C32.7289 13.5691 32.7362 13.8228 32.6738 14.0637C32.6116 14.3046 32.4819 14.5228 32.3 14.6927L26.1557 20.7884C25.9991 20.935 25.8813 21.1183 25.8135 21.322C25.7455 21.5255 25.7298 21.7429 25.7672 21.9542L27.2486 30.5269C27.2916 30.7734 27.2644 31.0267 27.1704 31.2584C27.0764 31.4901 26.9193 31.6907 26.7167 31.8376C26.5144 31.9843 26.2747 32.0712 26.0253 32.0887C25.7759 32.106 25.5265 32.053 25.3057 31.9355L17.6315 27.8798C17.435 27.7834 17.219 27.7333 17.0001 27.7333C16.7812 27.7333 16.5652 27.7834 16.3687 27.8798L8.69438 31.9355C8.47359 32.053 8.2243 32.106 7.97486 32.0887C7.72542 32.0712 7.48585 31.9843 7.28342 31.8376C7.08098 31.6907 6.9238 31.4901 6.82977 31.2584C6.73576 31.0267 6.70863 30.7734 6.75152 30.5269L8.23295 21.857C8.27049 21.6457 8.25461 21.4284 8.18676 21.2248C8.1189 21.0212 8.00119 20.8378 7.84438 20.6913L1.62724 14.6927C1.44331 14.5181 1.31395 14.2939 1.25485 14.0473C1.19575 13.8006 1.20944 13.5421 1.29425 13.3031C1.37907 13.0641 1.53137 12.8548 1.73272 12.7005C1.93406 12.5463 2.17581 12.4538 2.42866 12.4342L10.9529 11.1713C11.1681 11.1475 11.3733 11.0676 11.548 10.9398C11.7227 10.812 11.8608 10.6406 11.9487 10.4427L15.8101 2.64701C15.9152 2.41996 16.0832 2.22774 16.294 2.09302C16.5049 1.9583 16.7499 1.88672 17.0001 1.88672C17.2503 1.88672 17.4953 1.9583 17.7062 2.09302C17.917 2.22774 18.0849 2.41996 18.1901 2.64701Z"
              />
            </div>
          </div>
          <div className="hidden md:block text-base text-[#868686] font-normal">
            {stats?.totalRatingCount} {ratings}{" "}
            {stats?.reviewCount > 0 && (
              <>
                {" "}
                & <br />
                {stats?.reviewCount} {reviews}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating Distribution Bars */}
      <div className="w-full md:space-y-1.5">
        {[...Object.entries(stats.ratingCount)]
          .reverse()
          .map(([stars, data]) => (
            <div
              key={stars}
              className="grid grid-cols-[8px_1fr_30px] items-center gap-2 md:gap-7"
            >
              {/* Stars */}
              <span className="text-base md:text-[22px] font-semibold text-[#646464]">
                {stars}
              </span>

              {/* Progress Bar with max equal width */}
              <div className="bg-gray-200 rounded-full h-1.5 md:h-2 relative overflow-hidden w-full">
                <div
                  className="bg-[#F4B706] h-full rounded-full transition-all duration-300"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>

              {/* Percentage */}
              <span className="text-xs md:text-base text-gray-600 font-medium text-left">
                {data.percentage}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RatingOverview;
