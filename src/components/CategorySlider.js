import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { pushToDataLayer } from "./utils/dataUserpush";
import { useSelector } from "react-redux";
import { getDynamicContent } from "@/hooks";

export default function CategorySlider({ categoryList }) {
  const currentcountry = useSelector((s) => s.globalslice.currentcountry);
  const currentLanguage = useSelector((s) => s.globalslice?.currentLanguage || "en");
  const router = useRouter();

  // Determine direction based on language
  const direction = currentLanguage === "ar" ? "rtl" : "ltr";

  // Autoplay instance - create it once and reuse
  const autoplayPlugin = useMemo(
    () =>
      Autoplay(
        {
          delay: 1500,
          stopOnInteraction: false,
          playOnInit: true,
        },
        (emblaRoot) => emblaRoot.parentElement
      ),
    []
  );

  // Memoize options to trigger reinitialization when direction changes
  const emblaOptions = useMemo(
    () => ({
      loop: true,
      dragFree: false, // removes swappable/flicking
      skipSnaps: false, // keeps slides snapping properly
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      align: "start",
      axis: "x",
      duration: 600, // keep smooth autoplay as before
      startIndex: 0,
      direction: direction, // Set direction based on language
    }),
    [direction]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, [autoplayPlugin]);

  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  // Immediate pause on hover
  const handleMouseEnter = useCallback(() => {
    if (autoplayPlugin) {
      autoplayPlugin.stop();
      setIsAutoplayActive(false);
    }
  }, [autoplayPlugin]);

  // Resume autoplay when leaving
  const handleMouseLeave = useCallback(() => {
    if (autoplayPlugin) {
      autoplayPlugin?.play();
      setIsAutoplayActive(true);
    }
  }, [autoplayPlugin]);

  // Optional: support mouse wheel scroll
  // In RTL mode, reverse the scroll direction
  const handleWheel = useCallback(
    (event) => {
      if (!emblaApi) return;
      event.preventDefault();
      const isRTL = direction === "rtl";
      if (event.deltaY > 0) {
        isRTL ? emblaApi.scrollPrev() : emblaApi.scrollNext();
      } else {
        isRTL ? emblaApi.scrollNext() : emblaApi.scrollPrev();
      }
    },
    [emblaApi, direction]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const emblaContainer = emblaApi.containerNode();
    if (emblaContainer) {
      emblaContainer.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (emblaContainer) {
        emblaContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, [emblaApi, handleWheel]);

  // Restart autoplay when direction changes
  useEffect(() => {
    if (!emblaApi || !autoplayPlugin) return;
    
    // Restart autoplay after direction change
    autoplayPlugin?.play();
  }, [emblaApi, autoplayPlugin, direction]);

  return (
    <div className="w-full pt-2 relative">
      {/* Embla Carousel */}
      <div
        className="overflow-hidden px-6"
        ref={emblaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-1 no-rtl-reverse">
          {categoryList.map((cat, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 basis-auto min-w-0"
              style={{ flex: "0 0 auto", minWidth: "6.3rem" }}
            >
              <div
                className="group w-[6.3rem] mx-0 relative flex flex-col items-center justify-start overflow-visible cursor-pointer select-none"
                onClick={() => {
                  pushToDataLayer("clicked_category", currentcountry.name, {
                    category_name: cat.category_name,
                    page: window.location.pathname,
                  });
                  router.push("/categories/" + cat.url);
                }}
              >
                <div className="relative transition-transform duration-[300ms] group-hover:duration-[800ms] group-hover:scale-110 z-10 flex flex-col items-center justify-start">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    <img
                      src={cat?.vector_icon || null}
                      alt={cat?.category_name}
                      className="w-full h-full object-contain pointer-events-none"
                      style={{
                        filter: "drop-shadow(0px 4px 2px rgba(0,0,0,0.2))",
                      }}
                      draggable={false}
                    />
                  </div>
                  <h5 className="mt-1 text-[13px] text-center font-medium text-gray-700 leading-tight min-h-10">
                    {getDynamicContent(cat, "category_name", currentLanguage)}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
