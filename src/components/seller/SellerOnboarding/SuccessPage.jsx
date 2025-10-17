import React from "react";

const SuccessPage = ({ onExplore }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-7 min-h-[600px] justify-center items-center">
      <div
        className="flex flex-col gap-4 sm:gap-7 items-center justify-center  text-center px-2 sm:px-8"
        data-aos="bounce-fade-up"
        data-aos-easing="ease-in-out"
        data-aos-duration="600"
      >
        <div className="w-44 h-44 rounded-2xl flex items-center justify-center">
          <img
            src="/assets/seller/checklist.png"
            alt=""
            className="w-full h-full"
          />
        </div>

        <div className="relative w-full h-full flex justify-center items-center flex-col gap-0 -mt-4">
          <div className="h-24 sm:h-36">
            <img
              src="/assets/seller/thank-you-text.png"
              alt=""
              className="w-full h-full"
            />
          </div>
          <p className="hidden sm:block absolute bottom-0 whitespace-nowrap text-[#686868] text-lg font-medium leading-relaxed">
            Thanks for sharing your details! We're reviewing your documents and
            will connect with you in 24-48 Hrs.
          </p>
          <p className="block sm:hidden text-[#686868] -mt-4 sm:text-lg font-medium leading-relaxed">
            Thanks for sharing your details! We're reviewing your documents and
            will connect with you in 24-48 Hrs.
          </p>
        </div>
      </div>
      <button
        data-aos="bounce-fade-down"
        data-aos-easing="ease-in-out"
        data-aos-duration="600"
        onClick={onExplore}
        className="text-white font-medium py-2 px-6 rounded-[6px] transition-colors border-none duration-200 shadow-lg"
        style={{
          background:
            "linear-gradient(90deg, #5232C2 1.92%, #8767F8 32.69%, #5232C2 50.48%, #7150E5 77.88%, #5232C2 100%)",
        }}
      >
        Explore OurShopee
      </button>
    </div>
  );
};

export default SuccessPage;
