import { MdClose } from "react-icons/md";
import { FaApple, FaAndroid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AppDownloadModal = ({ isOpen, onClose }) => {
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
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-md w-[90%] md:w-[60%] relative shadow-2xl border border-white/20 transition-all"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-1.5 right-2 p-2 border-none bg-transparent hover:scale-110 transition"
          >
            <MdClose className="text-gray-700 text-2xl" />
          </button>

          {/* Title */}
          <h2 className="font-semibold text-2xl bg-gradient-to-r from-[#7151E3] via-[#220066] via-80% to-[#5232C2] bg-clip-text text-transparent text-center font-[Outfit] mb-8">
            Scan to Download Our App
          </h2>

          {/* QR Codes Section */}
          <div className="flex justify-around gap-8 items-center flex-wrap">
            {/* Android */}
            <div className="flex flex-col items-center gap-3 group">
              <div className="rounded-2xl p-3 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src="/assets/qrs/Android.png"
                  alt="Android QR"
                  className="w-32 h-32 object-contain rounded-md shadow-inner"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FaAndroid className="text-gray-700 text-xl" />
                <span className="text-sm font-semibold text-gray-800 font-[Outfit]">
                  Android App
                </span>
              </div>
            </div>

            {/* iOS */}
            <div className="flex flex-col items-center gap-3 group">
              <div className="rounded-2xl p-3 shadow-lg group-hover:scale-105 transition-transform">
                <img
                  src="/assets/qrs/Apple.png"
                  alt="iOS QR"
                  className="w-32 h-32 object-contain rounded-md shadow-inner"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FaApple className="text-gray-800 text-xl" />
                <span className="text-sm font-semibold text-gray-800 font-[Outfit]">
                  iOS App
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppDownloadModal;
