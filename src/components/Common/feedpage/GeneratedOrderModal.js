import { getAssetsUrl } from "@/components/utils/helpers";
import { BsCheckCircleFill } from "react-icons/bs";

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
    <p className="text-2xl font-bold text-white mb-10.5">
      Order Is Being Generated!
    </p>

    {/* Content Card */}
    <div className="bg-white rounded-3xl p-6 w-full max-w-lg flex flex-col items-center shadow-md">
      <p className="text-lg font-semibold text-[#191B1C] mb-2 text-center">
        Your order is now moving to the next step.{" "}
        <span role="img" aria-label="party">
          🎉
        </span>
      </p>
      <p className="text-gray-500 mb-5 text-center text-base">
        Please complete your payment now to confirm your order and speed up
        delivery.
      </p>
      {/* Pay Now Button */}
      <button
        className="w-full py-3 mb-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 font-bold text-[#191B1C] flex items-center justify-center gap-2 text-lg transition-colors"
        onClick={onPayNow}
      >
        PAY NOW
        {/* Payment Icons - Use your own SVGs/images as in your project */}
        <span className="ml-2 flex gap-1">
          <img src="/your/path/tabby.svg" className="w-6 h-6" alt="Tabby" />
          <img src="/your/path/visa.svg" className="w-6 h-6" alt="Visa" />
          <img
            src="/your/path/mastercard.svg"
            className="w-6 h-6"
            alt="Mastercard"
          />
        </span>
      </button>
      {/* Pay Later Button */}
      <button
        className="w-full py-3 rounded-lg border border-gray-300 bg-white text-[#191B1C] font-bold text-lg hover:bg-gray-100 transition-colors"
        onClick={onPayLater}
      >
        I'LL PAY LATER
      </button>
    </div>
  </div>
);

export default GeneratedOrderModal;
