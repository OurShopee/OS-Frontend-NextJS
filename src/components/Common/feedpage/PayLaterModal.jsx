import { getAssetsUrl } from "@/components/utils/helpers";
import Link from "next/link";

const PayLaterModal = ({ promoImages = [] }) => {
  const bgImage = getAssetsUrl("webFeed/pay-later-bg.png");
  const qrImage = getAssetsUrl("webFeed/qr.svg");

  return (
    <div className="relative flex flex-col items-center px-8 py-6">
      {/* Top Section with Checkmark */}
      <img
        src={bgImage}
        alt="Success"
        className="absolute object-cover -z-10 top-0 left-0 w-full h-full"
      />
      <div className="flex justify-center my-4 rounded-full">
        <img
          src={getAssetsUrl("webFeed/box-icon.png")}
          alt="Processing"
          className="w-40 h-full"
        />
      </div>
      {/* Title */}
      <p className="text-[22px] font-semibold text-[#191B1C] mb-3 whitespace-nowrap">
        Your Order Is Being Generated!
      </p>

      {/* Content Card */}
      <div className="bg-white rounded-3xl w-full max-w-lg flex flex-col items-center ">
        <p className="text-[#43494B] mb-4 font-normal text-center text-base">
          Our team will contact you within 24 hours to process your request and
          confirm your order.
        </p>
        {/* {qr code} */}
        <div className="rounded-[32px] w-full h-full bg-gradient-to-b from-[#A7F37A] via-[#DAF8B7] to-[#FFFFFF] p-6 border border-white/60">
          <p
            className="text-center text-xl font-semibold text-white mb-[2px]
               [text-shadow:0px_3px_5px_#00000029]"
          >
            Unlock More Exclusive Deals!
          </p>

          <p
            className="text-center font-semibold text-xl text-white mb-1
              [text-shadow:0px_3px_5px_#00000029]"
          >
            Scan To Download.
          </p>

          <div className="flex justify-center ">
            {qrImage ? (
              <img
                src={qrImage}
                alt="Promo QR"
                className="w-[132px] h-[132px] object-contain rounded-3xl"
                loading="lazy"
              />
            ) : (
              <div className="w-36 h-36 rounded-3xl border-2 border-dashed border-white/70 flex items-center justify-center text-xs text-[#0A2A12]/70 text-center px-4">
                Add QR image URL
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="store-buttons">
              <Link
                href="https://play.google.com/store/apps/details?id=www.ourshopee.com"
                target="_blank"
              >
                <img
                  src={getAssetsUrl("playstore.png")}
                  alt="Google Play"
                  loading="lazy"
                />
              </Link>
              <Link
                href="https://apps.apple.com/us/app/ourshopee-online-shopping/id1226954989"
                target="_blank"
              >
                <img
                  src={getAssetsUrl("appstore.png")}
                  alt="App Store"
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* Buttons can be rendered below when needed */}
      </div>
    </div>
  );
};

export default PayLaterModal;
