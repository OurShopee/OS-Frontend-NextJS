import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setformstatus } from "../../../redux/formslice";
import Lottie from "lottie-react";
import success from '@/components/rating-reviews/success.json'

const SuccessModal = () => {
  const dispatch = useDispatch();
  const formstatus = useSelector((state) => state.formslice.formstatus);
  const [animationState, setAnimationState] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // useEffect(() => {
  //   if (formstatus == 5) {
  //     // Animation progression through states
  //     const animationTimer = setTimeout(() => {
  //       setAnimationState(1);
  //       setTimeout(() => {
  //         setAnimationState(2);
  //       }, 800);
  //     }, 500);

  //     // Auto close after 3 seconds
  //     const closeTimer = setTimeout(() => {
  //       dispatch(setformstatus(0));
  //     }, 3000);

  //     return () => {
  //       clearTimeout(animationTimer);
  //       clearTimeout(closeTimer);
  //     };
  //   } else {
  //     setAnimationState(0);
  //   }
  // }, [formstatus, dispatch]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      dispatch(setformstatus(0));
    }
  };

  if (formstatus !== 5) {
    return null;
  }

  return (
    <div
      className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-[999] tw-flex tw-items-end md:tw-items-center tw-justify-center tw-p-0 md:tw-p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={`tw-bg-white tw-rounded-t-3xl md:tw-rounded-2xl ${
          isMobile && "tw-h-[415px]"
        } tw-overflow-visible tw-shadow-2xl tw-w-full md:tw-max-w-md md:tw-px-4 md:tw-py-12 tw-mx-0 md:tw-mx-4 tw-transform tw-transition-all tw-duration-300 tw-ease-out tw-translate-y-0 animate-scaleIn tw-relative`}
        style={{
          animation:
            formstatus === 5 && isMobile && "slideUp 0.3s ease-out forwards",
        }}
      >
        {/* Mobile Close Button - Outside modal on top */}
        <button
          onClick={() => dispatch(setformstatus(0))}
          className="tw-absolute md:tw-hidden -tw-top-4 tw-right-8 tw-z-10 tw-bg-[#FCFCFC] tw-rounded-full tw-w-10 tw-h-10 tw-shadow-[0px_4px_12px_0px_#0000000F] tw-flex tw-items-center tw-justify-center tw-border-none tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-colors"
        >
          <MdClose className="tw-w-6 tw-h-6 tw-text-[#191B1C] tw-font-semibold" />
        </button>

        {/* Desktop Close Button - Inside modal on top right */}
        <button
          onClick={() => dispatch(setformstatus(0))}
          className="tw-absolute tw-hidden md:tw-flex tw-top-2 tw-right-2 tw-w-6 tw-h-6 tw-rounded-full tw-bg-gray-300 tw-border-none tw-items-center tw-justify-center tw-text-gray-900 hover:tw-bg-gray-200 tw-transition-colors"
        >
          <MdClose size={16} />
        </button>

        <div
          className={`tw-flex tw-flex-col tw-justify-center tw-items-center ${
            isMobile && "tw-h-full"
          } tw-text-center`}
        >
          {/* Success Icon with Animation States */}
          <div className="tw-flex tw-items-center tw-justify-center tw-relative">
            {/* Main tick box */}
            <Lottie
              animationData={success}
              loop
              autoplay
              className="tw-w-[150px] tw-h-[150px]"
            />
          </div>

          {/* Title */}
          <div className="tw-flex tw-flex-col tw-gap-1 tw-max-w-[325px]">
            <h3 className="tw-text-2xl md:tw-text-xl tw-font-semibold tw-text-center tw-text-[#191B1C] tw-mb-0">
              Thank You for {isMobile && <br />} Your Feedback!
            </h3>
            <p className="tw-text-center tw-text-sm tw-text-[#9EA5A8] tw-mb-0">
              We truly appreciate your time! Your review is submitted and will
              be reviewed shortly. We’ll let you know once it’s live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
