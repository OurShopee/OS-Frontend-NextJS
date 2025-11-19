import { MdClose } from "react-icons/md";
import { FaApple, FaAndroid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentLanguage } from "@/hooks";

const AppDownloadModal = ({ isOpen, onClose }) => {
  const currentLanguage = useCurrentLanguage();
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[100] flex justify-center items-center"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl w-[90%] md:w-[610px]"
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 z-10 w-8 h-8 flex items-center justify-center bg-[#EAEAEA] rounded-full backdrop-blur-md hover:scale-110 transition border-none ${
              currentLanguage === "ar" ? "left-4" : "right-4"
            }`}
          >
            <MdClose className="text-[#575D68] text-xl h-7 w-7" />
          </button>

          {/* Full Image */}
          <img
            src={ currentLanguage === "ar" ? `/assets/qrs/qr-ar.png` : `/assets/qrs/qr.png`}
            alt="QR"
            className="w-full h-auto object-cover"
          />
          <div className={`absolute bottom-7 sm:bottom-16 z-10 flex items-center justify-center ${
            currentLanguage === "ar" 
              ? "left-[10vw] sm:left-[52px]" 
              : "right-[10vw] sm:right-[52px]"
          }`}>
            <div className="flex justify-center items-center gap-2 sm:gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=www.ourshopee.com&hl=en_IN&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <img
                  src="/assets/qrs/play-store.png"
                  alt="Play Store"
                  className="w-[66px] sm:w-32 hover:opacity-80 transition-opacity"
                />
              </a>
              <a
                href="https://apps.apple.com/us/app/ourshopee-online-shopping/id1226954989"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <img
                  src="/assets/qrs/app-store.png"
                  alt="App Store"
                  className="w-[66px] sm:w-32 hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppDownloadModal;
