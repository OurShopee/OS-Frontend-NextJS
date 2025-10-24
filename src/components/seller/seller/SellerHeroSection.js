import React from "react";
import Hero from "@/images/Hero.png";
import Wave from "@/images/Wave.png";
import man from "@/images/man.png";
import women from "@/images/women.png";
import dash from "@/images/dash.png";
import { FaArrowRight } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SellerHeroSection = () => {
  const router = useRouter();
  useEffect(() => {
    const offset = window.innerHeight * 0.08;
    AOS.init({
      once: true,
      offset: offset,
    });
  }, []);
  return (
    <div className="container relative w-screen h-[500px] xl:h-[660px] overflow-hidden select-none">
      <img
        src={Hero.src}
        alt="Hero"
        className="w-full h-full object-cover z-1"
      />
      <div className="absolute inset-0 flex flex-col items-center pt-2 xl:justify-center z-15">
        <div
          data-aos="fade-down"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
          className="flex flex-col justify-center items-center"
        >
          <h4 className="text-white text-3xl xl:text-5xl font-semibold xl:font-bold mt-3 mb-7 text-center">
            Become a Seller with Ourshopee
          </h4>
          <p className="text-white text-lg xl:text-[22px] max-w-[550px] text-center opacity-[70%] px-2 mb-0">
            Start selling on OurShopee in minutes and grow your business faster
            with smart tools and support.
          </p>
          <div className="flex items-center justify-center gap-3 xl:gap-6 mt-6 xl:my-6">
            <button
              onClick={() => router.push("/onboarding")}
              className="bg-black text-white px-4 py-2 xl:py-3 rounded-lg text-sm xl:text-lg shadow-lg transition hover:bg-gray-800 border-none flex gap-3 xl:gap-4"
            >
              Get started for free
              <span>
                <FaArrowRight />
              </span>
            </button>
            <a
              href="#"
              className="text-white xl:text-lg no-underline hover:text-gray-200"
            >
              Learn more
            </a>
          </div>
        </div>
        <img
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-easing="ease-in-out"
          src={dash.src}
          alt="Dashboard"
          className="absolute bottom-1 left-0 right-0 mx-auto w-full xl:relative max-w-[90%] xl:max-w-[45vw] rounded-2xl overflow-hidden shadow-2xl"
        />
      </div>
      <img
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-easing="ease-in-out"
        src={women.src}
        alt="Person Left"
        className="hidden xl:block absolute left-14 bottom-8 h-[500px] z-21 object-contain"
      />
      <img
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-easing="ease-in-out"
        src={man.src}
        alt="Person Right"
        className="hidden xl:block absolute right-0 bottom-20 h-[480px] z-21 object-contain"
      />
      <img
        src={Wave.src}
        alt="Wave"
        className="absolute bottom-0 left-0 w-full z-22"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
};

export default SellerHeroSection;
