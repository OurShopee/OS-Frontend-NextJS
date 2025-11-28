import { MediaQueries } from "@/components/utils";
import { getAssetsUrl } from "@/components/utils/helpers";
import Link from "next/link";

const CODOrderModal = () => {
  const bgImage = getAssetsUrl("webFeed/pay-later-bg.png");
  const qrImage = getAssetsUrl("webFeed/qr.svg");
  const { isMobile } = MediaQueries();

  return (
    <div className="relative flex flex-col items-center px-8 pt-6 pb-3">
      {/* Top Section with Checkmark */}
      <img
        src={bgImage}
        alt="Success"
        className="absolute object-cover -z-10 top-0 left-0 w-full h-full"
      />
      <div className="flex justify-center my-1 sm:my-4 rounded-full">
        <img
          src={getAssetsUrl("wallet/cod-icon.png")}
          alt="Processing"
          className="w-40 h-full"
        />
      </div>
      {/* Title */}
      <p className="text-[22px] font-semibold text-[#191B1C] mt-[120px] sm:mt-16 mb-1 whitespace-nowrap">
        Your COD Order Is Confirmed.
      </p>

      {/* Content Card */}
      <div className="bg-white rounded-3xl w-full max-w-lg flex flex-col items-center ">
        <p className="text-[#43494B] mb-4 font-normal text-center text-base">
          We’ll bring your order soon. Payment will be collected upon delivery.
        </p>
        {/* {qr code} */}
        <div className="rounded-[32px] w-[280px] sm:w-full h-full bg-gradient-to-b from-[#84d955] via-[#D0F47C] to-[#ffffff] p-6 border border-white/60">
          <p
            className="text-center text-xl font-semibold text-white mb-[2px]
               [text-shadow:0px_3px_5px_#00000029]"
          >
            Unlock More Exclusive Deals {isMobile && "In The App"}
          </p>

          {!isMobile && (
            <p
              className="text-center font-semibold text-xl text-white mb-1
              [text-shadow:0px_3px_5px_#00000029]"
            >
              Scan To Download.
            </p>
          )}

          {!isMobile && (
            <div className="flex justify-center ">
              {qrImage && (
                <img
                  src={qrImage}
                  alt="Promo QR"
                  className="w-[132px] h-[132px] object-contain rounded-3xl"
                  loading="lazy"
                />
              )}
            </div>
          )}
          <div className="">
            <div className="flex flex-col sm:flex-row  gap-4 justify-center store-buttons">
              <Link
                href="https://play.google.com/store/apps/details?id=www.ourshopee.com"
                target="_blank"
                className="flex justify-center items-center"
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
                className="flex justify-center items-center"
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

export default CODOrderModal;
