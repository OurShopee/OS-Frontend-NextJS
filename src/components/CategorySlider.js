// "use client";
// import React from "react";
// import Marquee from "react-fast-marquee";
// import { useRouter } from "next/navigation";
// import { pushToDataLayer } from "./utils/dataUserpush";
// import { useSelector } from "react-redux";

// export default function CategorySlider({ categoryList }) {
//   const currentcountry = useSelector(
//     (state) => state.globalslice.currentcountry
//   );
//   const router = useRouter();

//   return (
//     <div className="w-full bg-white pt-2 overflow-visible">
//       <Marquee
//         autoFill={true}
//         speed={10}
//         play={true}
//         pauseOnHover
//         pauseOnClick
//         gradient={false}
//         className="gap-1 overflow"
//       >
//         {categoryList?.map((cat, idx) => (
//           <div
//             key={idx}
//             className="group w-[6.3rem] mx-0 relative flex flex-col items-center justify-start overflow-visible cursor-pointer"
//             onClick={() => {
//               pushToDataLayer("clicked_category", currentcountry.name, {
//                 category_name: cat.category_name,
//                 page:
//                   typeof window !== "undefined" ? window.location.pathname : "",
//               });
//               router.push("/categories/" + cat.url);
//             }}
//           >
//             <div className="relative transition-transform duration-[300ms] group-hover:duration-[800ms] group-hover:scale-110 z-10 flex flex-col items-center justify-start">
//               <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                 <img
//                   src={cat.vector_icon}
//                   alt={cat.category_name}
//                   className="w-full h-full object-contain"
//                   style={{
//                     filter: "drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.2))",
//                   }}
//                 />
//               </div>
//               <h5 className="mt-1 text-[13px] text-center font-medium text-gray-700 leading-tight min-h-10">
//                 {cat.category_name}
//               </h5>
//             </div>
//           </div>
//         ))}
//       </Marquee>
//     </div>
//   );
// }
// import React, { useCallback, useEffect, useState, useRef } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { useNavigate } from "react-router-dom";
// import { pushToDataLayer } from "./utils/dataUserpush";
// import { useSelector } from "react-redux";

// export default function CategorySlider({ categoryList }) {
//   const currentcountry = useSelector((s) => s.globalslice.currentcountry);
//   const navigate = useNavigate();

//   // Use useRef to store the autoplay plugin instance
//   const autoplayRef = useRef(
//     Autoplay({
//       delay: 1000,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//       playOnInit: true,
//     })
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     {
//       loop: true,
//       dragFree: false,
//       containScroll: "trimSnaps",
//       slidesToScroll: 1,
//       skipSnaps: false,
//       duration: 600,
//       axis: "x",
//       startIndex: 0, // This ensures starting from index 0
//       align: "start",
//       // breakpoints: {
//       //   "(max-width: 320px)": { slidesToScroll: 1 },
//       //   "(max-width: 640px)": { slidesToScroll: 2 },
//       //   "(max-width: 768px)": { slidesToScroll: 3 },
//       //   "(min-width: 769px)": { slidesToScroll: 1 },
//       // },
//     },
//     [autoplayRef.current]
//   );

//   const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
//   const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
//   const [isAutoplayActive, setIsAutoplayActive] = useState(true);

//   // const scrollPrev = useCallback(() => {
//   //   if (emblaApi) {
//   //    emblaApi.scrollPrev();
//   //   }
//   // }, [emblaApi,]);

//   // const scrollNext = useCallback(() => {
//   //   if (emblaApi) {
//   //     emblaApi.scrollNext();
//   //   }
//   // }, [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     // For looped carousel, buttons should always be enabled
//     setPrevBtnEnabled(true);
//     setNextBtnEnabled(true);
//   }, [emblaApi]);

//   // Handle mouse wheel scrolling
//   const handleWheel = useCallback(
//     (event) => {
//       if (!emblaApi) return;

//       event.preventDefault();

//       if (event.deltaY > 0) {
//         emblaApi.scrollNext();
//       } else {
//         emblaApi.scrollPrev();
//       }
//     },
//     [emblaApi]
//   );

//   // Handle mouse enter - stop autoplay
//   const handleMouseEnter = useCallback(() => {
//     if (emblaApi && autoplayRef.current) {
//       try {
//         autoplayRef.current.stop();
//         setIsAutoplayActive(false);
//       } catch (error) {
//         // Fallback: pause autoplay through embla API
//         emblaApi.plugins().autoplay?.stop();
//         setIsAutoplayActive(false);
//       }
//     }
//   }, [emblaApi]);

//   // Handle mouse leave - restart autoplay
//   const handleMouseLeave = useCallback(() => {
//     if (emblaApi && autoplayRef.current) {
//       try {
//         autoplayRef.current.play();
//         setIsAutoplayActive(true);
//       } catch (error) {
//         // Fallback: restart autoplay through embla API
//         emblaApi.plugins().autoplay?.play();
//         setIsAutoplayActive(true);
//       }
//     }
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     onSelect();
//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", onSelect);

//     // Add wheel event listener
//     const emblaContainer = emblaApi.containerNode();
//     if (emblaContainer) {
//       emblaContainer.addEventListener("wheel", handleWheel, { passive: false });
//     }

//     return () => {
//       if (emblaContainer) {
//         emblaContainer.removeEventListener("wheel", handleWheel);
//       }
//     };
//   }, [emblaApi, onSelect, handleWheel]);

//   return (
//     <div className="w-full bg-white pt-2 relative">
//       {/* Previous Button */}
//       {/* <button
//         className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 z-[10] transition-all duration-200 hover:scale-110"
//         onClick={scrollPrev}
//         aria-label="Previous"
//       >
//         <svg
//           className="w-5 h-5 text-gray-600"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>

//       <button
//         className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-gray-50 z-[10] transition-all duration-200 hover:scale-110"
//         onClick={scrollNext}
//         aria-label="Next"
//       >
//         <svg
//           className="w-5 h-5 text-gray-600"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </button> */}

//       {/* Embla Carousel */}
//       <div
//         className="overflow-hidden px-6"
//         ref={emblaRef}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div className="flex gap-1">
//           {categoryList.map((cat, idx) => (
//             <div
//               key={idx}
//               className="flex-shrink-0 basis-auto min-w-0"
//               style={{ flex: "0 0 auto", minWidth: "6.3rem" }}
//             >
//               <div
//                 className="group w-[6.3rem] mx-0 relative flex flex-col items-center justify-start overflow-visible cursor-pointer select-none"
//                 onClick={() => {
//                   pushToDataLayer("clicked_category", currentcountry.name, {
//                     category_name: cat.category_name,
//                     page: window.location.pathname,
//                   });
//                   navigate("/categories/" + cat.url);
//                 }}
//               >
//                 <div className="relative transition-transform duration-[300ms] group-hover:duration-[800ms] group-hover:scale-110 z-10 flex flex-col items-center justify-start">
//                   <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                     <img
//                       src={cat.vector_icon}
//                       alt={cat.category_name}
//                       className="w-full h-full object-contain pointer-events-none"
//                       style={{
//                         filter: "drop-shadow(0px 4px 2px rgba(0,0,0,0.2))",
//                       }}
//                       draggable={false}
//                     />
//                   </div>
//                   <h5 className="mt-1 text-[13px] text-center font-medium text-gray-700 leading-tight min-h-10">
//                     {cat.category_name}
//                   </h5>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { pushToDataLayer } from "./utils/dataUserpush";
import { useSelector } from "react-redux";

export default function CategorySlider({ categoryList }) {
  const currentcountry = useSelector((s) => s.globalslice.currentcountry);
  const router = useRouter();

  // Autoplay instance
  const autoplayRef = useRef(
    Autoplay(
      {
        delay: 1500,
        stopOnInteraction: false,
        playOnInit: true,
      },
      (emblaRoot) => emblaRoot.parentElement
    )
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false, // removes swappable/flicking
      skipSnaps: false, // keeps slides snapping properly
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      align: "start",
      axis: "x",
      duration: 600, // keep smooth autoplay as before
      startIndex: 0,
    },
    [autoplayRef.current]
  );

  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  // Immediate pause on hover
  const handleMouseEnter = useCallback(() => {
    if (autoplayRef.current) {
      autoplayRef.current.stop();
      setIsAutoplayActive(false);
    }
  }, []);

  // Resume autoplay when leaving
  const handleMouseLeave = useCallback(() => {
    if (autoplayRef.current) {
      autoplayRef.current.play();
      setIsAutoplayActive(true);
    }
  }, []);

  // Optional: support mouse wheel scroll
  const handleWheel = useCallback(
    (event) => {
      if (!emblaApi) return;
      event.preventDefault();
      if (event.deltaY > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    },
    [emblaApi]
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

  return (
    <div className="w-full pt-2 relative">
      {/* Embla Carousel */}
      <div
        className="overflow-hidden px-6"
        ref={emblaRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-1">
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
                      src={cat.vector_icon}
                      alt={cat.category_name}
                      className="w-full h-full object-contain pointer-events-none"
                      style={{
                        filter: "drop-shadow(0px 4px 2px rgba(0,0,0,0.2))",
                      }}
                      draggable={false}
                    />
                  </div>
                  <h5 className="mt-1 text-[13px] text-center font-medium text-gray-700 leading-tight min-h-10">
                    {cat.category_name}
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
