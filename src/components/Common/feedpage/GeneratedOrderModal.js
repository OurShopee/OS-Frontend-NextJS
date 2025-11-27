import { getAssetsUrl } from "@/components/utils/helpers";

const GeneratedOrderModal = ({ onPayNow, onPayLater }) => (
  <div className="relative flex flex-col items-center p-4">
    {/* Top Section with Checkmark */}
    <img
      src={getAssetsUrl("webFeed/order-submitted-bg.png")}
      alt="Success"
      className="absolute object-cover -z-10 top-0 left-0 w-full h-full"
    />
    <div className="flex justify-center mt-5 mb-3 rounded-full">
      <img
        src={getAssetsUrl("webFeed/check-icon.png")}
        alt="Processing"
        className="w-40 h-full"
      />
    </div>
    {/* Title */}
    <p className="text-2xl font-bold text-white mb-10">
      Order Is Being Generated!
    </p>

    {/* Content Card */}
    <div className="bg-white rounded-3xl py-[30px] px-5 w-full max-w-lg flex flex-col items-center backdrop-blur-[0px] gap-4">
      <p className="text-[22px] font-semibold text-[#191B1C] text-center">
        Your order is now moving to the next step.{" "}
        <span role="img" aria-label="party">
          🎉
        </span>
      </p>
      <p className="text-[#43494B] mb-2.5 font-normal text-center text-base">
        Please complete your payment now to confirm your order and speed up
        delivery.
      </p>
      {/* Pay Now Button */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="animated-bg-button-container m-0 h-[54px]">
          <div className="animated-bg-button-shadow" />
          <button
            type="button"
            onClick={onPayNow}
            className="w-full place-order-button border-none gap-2 uppercase select-none relative inline-flex items-center justify-center h-14 rounded-xl font-medium text-white overflow-hidden disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            <span className="text-sm sm:text-base movetext-feed text-black flex items-center">
              PAY NOW
              <span className="ml-0.5 flex gap-1">
                <img
                  src={getAssetsUrl("webFeed/payment-options.png")}
                  className="w-full h-6"
                  alt="Tabby"
                />
              </span>
            </span>
            <div className="absolute inset-0 pointer-events-none flex gap-2 justify-center items-center shimmer-overlay">
              <div className="h-20 w-10 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
              <div className="h-20 w-3 bg-gradient-to-tr from-transparent to-white opacity-60 skew-y-12"></div>
            </div>
          </button>
        </div>

        {/* Pay Later Button */}
        <button
          className="w-full py-4 rounded-lg border bg-white text-[#191B1C] font-semibold text-base"
          onClick={onPayLater}
        >
          I'LL PAY LATER
        </button>
      </div>
    </div>
  </div>
);

export default GeneratedOrderModal;
