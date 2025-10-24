import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setformstatus } from "../../../redux/formslice";
import Lottie from "lottie-react";
import success from "@/components/rating-reviews/success.json";

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
      className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-t-3xl md:rounded-2xl ${
          isMobile && "h-[415px]"
        } overflow-visible shadow-2xl w-full md:max-w-md md:px-4 md:py-12 mx-0 md:mx-4 transform transition-all duration-300 ease-out translate-y-0 animate-scaleIn relative`}
        style={{
          animation:
            formstatus === 5 && isMobile && "slideUp 0.3s ease-out forwards",
        }}
      >
        {/* Mobile Close Button - Outside modal on top */}
        <button
          onClick={() => dispatch(setformstatus(0))}
          className="absolute md:hidden -top-4 right-8 z-10 bg-[#FCFCFC] rounded-full w-10 h-10 shadow-[0px_4px_12px_0px_#0000000F] flex items-center justify-center border-none cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <MdClose className="w-6 h-6 text-[#191B1C] font-semibold" />
        </button>

        {/* Desktop Close Button - Inside modal on top right */}
        <button
          onClick={() => dispatch(setformstatus(0))}
          className="absolute hidden md:flex top-2 right-2 w-6 h-6 rounded-full bg-gray-300 border-none items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
        >
          <MdClose size={16} />
        </button>

        <div
          className={`flex flex-col justify-center items-center ${
            isMobile && "h-full"
          } text-center`}
        >
          {/* Success Icon with Animation States */}
          <div className="flex items-center justify-center relative">
            {/* Main tick box */}
            <Lottie
              animationData={success}
              loop
              autoplay
              className="w-[150px] h-[150px]"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1 max-w-[325px]">
            <h3 className="text-2xl md:text-xl font-semibold text-center text-[#191B1C] mb-0">
              Thank You for {isMobile && <br />} Your Feedback!
            </h3>
            <p className="text-center text-sm text-[#9EA5A8] mb-0">
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
