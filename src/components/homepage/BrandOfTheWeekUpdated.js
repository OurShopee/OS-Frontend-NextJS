// "use client";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { MediaQueries } from "../utils";
// import { getImagesByKey } from "../utils/getImagesByKey";
// import { pushToDataLayer } from "../utils/dataUserpush";
// import { ProductCard } from "../Common";

// export default function BrandOfTheWeekUpdated({ products = [] }) {
//   const currentcountry = useSelector((s) => s.globalslice.currentcountry);
//   const bannerList = useSelector((s) => s.homeslice.bannerList);
//   const { isMobile } = MediaQueries();
//   const pathname = usePathname();
//   const [brandData, setBrandData] = useState({});
//   const [currentProductIndex, setCurrentProductIndex] = useState(0);
//   const pageName = typeof window !== "undefined" ? window.location.pathname : pathname;

//   useEffect(() => {
//     const b = {};
//     ["brandWeekBg", "brandWeekImg"].forEach((k) => {
//       const v = getImagesByKey(bannerList, k);
//       if (v) b[k] = v;
//     });
//     setBrandData(b);
//   }, [bannerList]);
// console.log(brandData, "brandData");
//   useEffect(() => {
//     if (!products?.length || products.length <= 4) return;
//     const id = setInterval(() => setCurrentProductIndex((p) => (p + 1) % products.length), 5000);
//     return () => clearInterval(id);
//   }, [products]);

//   const pick = (pos) => (products?.length ? products[(currentProductIndex + pos) % products.length] : null);
//   const p1 = pick(0);
//   const p2 = pick(1);
//   const p3 = pick(2);
//   const p4 = pick(3);

//   const renderProduct = (product) => {
//     if (!product) return null;
//     const parts = product.url?.split("/");
//     const hasSku = Object.prototype.hasOwnProperty.call(product, "sku");
//     const href =
//       hasSku && parts?.length >= 2
//         ? `/details/${product.url}`
//         : hasSku
//         ? `/details/${product.url}/${product.sku}`
//         : `/details/${product.url}`;
//     return (
//       <div className="inline-block align-top">
//         <Link href={href} className="no-underline block" prefetch={false}>
//           <ProductCard item={product} type={1} section_name="Brand Of The Week" />
//         </Link>
//       </div>
//     );
//   };

//   const bannerHref =
//     brandData?.brandWeekImg?.url_web && brandData?.brandWeekImg?.url_web !== "0"
//       ? brandData?.brandWeekImg?.url_web
//       : "#";

//   return (
//     <section
//       className="rounded-3xl px-4 py-6 mt-4 md:p-6 relative overflow-hidden"
//       style={{
//         backgroundImage: `url(${brandData?.brandWeekBg?.image_web || ""})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//       aria-label="Brand of the Week"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-center mb-4 pt-6 pb-2">
//         <div
//           className="px-4 z-0"
//           style={{
//             backgroundColor: "#FACC15",
//             clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
//           }}
//         >
//           <span className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]">BRAND&nbsp;</span>
//           <span className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]" style={{ color: "black" }}>
//             OF&nbsp;
//           </span>
//         </div>
//         <span
//           className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px] z-10 text-black font-bold"
//           style={{ marginLeft: "-20px", letterSpacing: "2px" }}
//         >
//           THE WEEK
//         </span>
//       </div>

//       {/* Desktop semicircle layout */}
//       {!isMobile ? (
//         <div
//           className="
//             mx-auto w-full max-w-[1360px]
//             grid gap-4 md:gap-6
//             [grid-template-columns:1fr_1fr_minmax(340px,420px)_1fr_1fr]
//             items-start justify-center
//           "
//         >
//           {/* OUTER LEFT — more margin-top (lower) */}
//           <div className="justify-self-end mt-16 md:mt-20 lg:mt-24">{renderProduct(p1)}</div>

//           {/* INNER LEFT — less margin-top (higher) */}
//           <div className="justify-self-end ">{renderProduct(p2)}</div>

//           {/* CENTER banner — lowest (deepest point) */}
//           <div className="justify-self-center mt-0">
//             <a
//               href={bannerHref}
//               onClick={() =>
//                 pushToDataLayer("clicked_card_in_section", currentcountry?.name, {
//                   card_name: "Brand of the Week Banner",
//                   section_name: "Brand of the Week",
//                   page: pageName,
//                 })
//               }
//               className="block rounded-2xl overflow-hidden"
//             >
//               <div className="w-full h-[300px] md:h-[340px] rounded-2xl">
//                 <img
//                   src={brandData?.brandWeekImg?.image_web || brandData?.brandWeekImg?.image_app}
//                   alt="Brand of the Week"
//                   className="w-full h-full object-cover rounded-2xl"
//                   loading="lazy"
//                 />
//               </div>
//             </a>
//           </div>

//           {/* INNER RIGHT — less margin-top (higher) */}
//           <div className="justify-self-start">{renderProduct(p3)}</div>

//           {/* OUTER RIGHT — more margin-top (lower) */}
//           <div className="justify-self-start mt-16 md:mt-20 lg:mt-24">{renderProduct(p4)}</div>
//         </div>
//       ) : (
//         // Mobile fallback
//         <div className="flex flex-col gap-3">
//           {(brandData?.brandWeekImg?.image_app || brandData?.brandWeekImg?.image_web) && (
//             <a href={bannerHref} className="block w-full rounded-2xl overflow-hidden">
//               <div className="w-full h-[220px] rounded-2xl">
//                 <img
//                   src={brandData?.brandWeekImg?.image_app || brandData?.brandWeekImg?.image_web}
//                   alt="Brand of the Week"
//                   className="w-full h-full object-cover rounded-2xl"
//                   loading="lazy"
//                 />
//               </div>
//             </a>
//           )}
//           <div className="grid grid-cols-2 gap-2">
//             {[p1, p2, p3, p4].map((p, i) => (
//               <div key={i}>{renderProduct(p)}</div>
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getImagesByKey } from "../utils/getImagesByKey";
import { pushToDataLayer } from "../utils/dataUserpush";
import { ProductCard } from "../Common";
import { MediaQueries } from "../utils";

/* ---------------- One-way overlay crossfade (no layout jump, no blink) ---------------- */
function CrossfadeOverlay({ item, render, duration = 500 }) {
  const idOf = (o) => (o?.id ?? o?.sku ?? o?.url ?? JSON.stringify(o ?? null));

  const [activeData, setActiveData]   = useState(item);
  const [activeKey, setActiveKey]     = useState(idOf(item));
  const [overlayData, setOverlayData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);
  const afterSwapHideRef = useRef(false);

  // When item changes, fade IN the overlay with new content on top of active.
  useEffect(() => {
    const nextKey = idOf(item);
    if (nextKey === activeKey) return; // no change

    setOverlayData(item);
    afterSwapHideRef.current = false;

    // kick the transition reliably
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setShowOverlay(true));
      return () => cancelAnimationFrame(raf2);
    });

    // safety commit in case transitionend is missed
    const hard = setTimeout(() => {
      // Overlay should be fully visible by now; swap under it
      setActiveData(item);
      setActiveKey(nextKey);

      // instantly hide overlay (no second fade) to avoid blink
      afterSwapHideRef.current = true;
      setShowOverlay(false);
      setOverlayData(null);
    }, duration + 80);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(hard);
    };
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const onOverlayEnd = () => {
    if (!overlayData) return;

    // Overlay has finished fading IN and is fully covering the active.
    // Swap the active content underneath:
    const nextKey = idOf(overlayData);
    setActiveData(overlayData);
    setActiveKey(nextKey);

    // Instantly hide the overlay (no second fade) to avoid any flash.
    afterSwapHideRef.current = true;
    setShowOverlay(false);
    setOverlayData(null);
  };

  // When we instantly hide overlay, remove transition for that frame to avoid a visible flicker.
  const overlayStyle = {
    transition: afterSwapHideRef.current ? "none" : `opacity ${duration}ms ease-in-out`,
    opacity: showOverlay ? 1 : 0,
    pointerEvents: "none",
  };

  return (
    <div className="relative w-full">
      {/* ACTIVE — in normal flow, defines the height, never unmounted during fade */}
      <div className="transition-opacity ease-in-out" style={{ opacity: 1 }}>
        {activeData ? render(activeData) : null}
      </div>

      {/* OVERLAY — absolute on top; fades IN only */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={overlayStyle}
        onTransitionEnd={onOverlayEnd}
        aria-hidden={!showOverlay}
      >
        {overlayData ? render(overlayData) : null}
      </div>
    </div>
  );
}

/* --------------------------- Custom Mobile Product Card --------------------------- */
function BrandWeekMobileCard({ item }) {
  const currentcountry = useSelector((s) => s.globalslice.currentcountry);
  const [hasError, setHasError] = useState(false);
  const pct = Math.floor(item?.percentage || 0);
  const fmt = (n) =>
    n === null || n === undefined
      ? ""
      : Math.round(Number(n));
  const currentPrice =
    item?.display_price ?? item?.special_price ?? item?.price;
  const productcard = (cardname) => {
    pushToDataLayer("clicked_card_in_section", currentcountry?.name, {
      card_name: cardname,
      section_name: "Brand Of The Week",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  return (
    <div
      className="relative min-w-[126px] bg-white rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5"
      onClick={() => productcard(item?.name)}
    >
      {/* Discount Badge */}
      {pct > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <div
            className="px-3.5 py-1.5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#C8F4C8" }}
          >
            <span
              className="text-xs font-bold leading-none"
              style={{ color: "#15803D" }}
            >
              {pct}% OFF
            </span>
          </div>
        </div>
      )}
  
      {/* Product Image */}
      <div className="relative p-4 pb-2 flex items-center justify-center h-[131px]">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        ) : (
          <img
            src={item?.image}
            alt={item?.name || "Product"}
            onError={() => setHasError(true)}
            className="w-[56px] h-[56px] object-contain aspect-[56/56]"
            loading="lazy"
          />
        )}
      </div>
  
      {/* Price Row */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-baseline gap-2">
          {/* Current Price */}
          <div className="flex items-baseline ">
            {currentcountry?.currency === "AED" ? (
              <img
                src="/assets/feed/aed-icon.png"
                alt="AED"
                className="w-4 h-4 inline-block mix-blend-multiply"
              />
            ) : (
              <span className="text-black text-xl font-bold leading-none">
                {currentcountry?.currency}
              </span>
            )}
            <span className="text-black text-xl font-bold leading-none">
              {fmt(currentPrice)}
            </span>
          </div>
  
          {/* Old Price */}
          {item?.old_price ? (
            <span className="text-gray-400 text-sm line-through font-medium">
              {fmt(item?.old_price)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
  
}

/* --------------------------- Stable product slot wrapper --------------------------- */
function ProductSlot({ product }) {
  const { isMobile } = MediaQueries();

  const renderInner = useCallback(
    (p) => {
      if (!p) return null;
      const parts = p.url?.split("/");
      const hasSku = Object.prototype.hasOwnProperty.call(p, "sku");
      const href =
        hasSku && parts?.length >= 2
          ? `/details/${p.url}`
          : hasSku
          ? `/details/${p.url}/${p.sku}`
          : `/details/${p.url}`;

      // Use custom mobile card for mobile, normal ProductCard for desktop
      if (isMobile) {
        return (
          <Link href={href} className="no-underline block" prefetch={false}>
            <BrandWeekMobileCard item={p} />
          </Link>
        );
      }

      return (
        <Link href={href} className="no-underline block" prefetch={false}>
          <ProductCard item={p} type={1} section_name="Brand Of The Week" />
        </Link>
      );
    },
    [isMobile]
  );

  // Frame never unmounts; only inner content swaps via overlay fade.
  return (
    <div className="inline-block align-top w-full">
      <CrossfadeOverlay item={product} render={renderInner} duration={500} />
    </div>
  );
}

/* -------------------------------- Main component -------------------------------- */
export default function BrandOfTheWeekUpdated({ products = [] }) {
  const currentcountry = useSelector((s) => s.globalslice.currentcountry);
  const bannerList = useSelector((s) => s.homeslice.bannerList);
  const pathname = usePathname();
  const [brandData, setBrandData] = useState({});
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const pageName = typeof window !== "undefined" ? window.location.pathname : pathname;
  const { isMobile } = MediaQueries();
  useEffect(() => {
    const b = {};
    ["brandWeekBg", "brandWeekImg"].forEach((k) => {
      const v = getImagesByKey(bannerList, k);
      if (v) b[k] = v;
    });
    setBrandData(b);
  }, [bannerList]);

  useEffect(() => {
    if (!products?.length || products.length <= 4) return;
    const id = setInterval(() => setCurrentProductIndex((p) => (p + 1) % products.length), 5000);
    return () => clearInterval(id);
  }, [products]);

  const pick = useCallback(
    (pos) => (products?.length ? products[(currentProductIndex + pos) % products.length] : null),
    [products, currentProductIndex]
  );

  const p1 = pick(0);
  const p2 = pick(1);
  const p3 = pick(2);
  const p4 = pick(3);

  const bannerHref =
    brandData?.brandWeekImg?.url_web && brandData?.brandWeekImg?.url_web !== "0"
      ? brandData?.brandWeekImg?.url_web
      : "#";

  return (
    <section
      className="rounded-3xl px-4 py-6 mt-4 md:p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${brandData?.brandWeekBg?.image_web || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Brand of the Week"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-2 sm:mb-4 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <div
          className="px-2 sm:px-3 md:px-4 z-0"
          style={{
            backgroundColor: "#FACC15",
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
        >
          <span className="font-[Anta] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[40px]">BRAND&nbsp;</span>
          <span className="font-[Anta] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[40px]" style={{ color: "black" }}>
            OF&nbsp;
          </span>
        </div>
        <span
          className="font-[Anta] text-[14px] sm:text-[24px] md:text-[38px] lg:text-[60px] z-10 text-black font-bold sm:ml-[-15px] md:ml-[-20px]"
          style={{ marginLeft: "-10px", letterSpacing: "1px" }}
        >
          THE WEEK
        </span>
      </div>

      {/* Semicircle layout - same design for all screens, scaled down */}
      <div
        className="
          mx-auto w-full max-w-[1360px]
          grid gap-3 sm:gap-3 md:gap-4 lg:gap-3
          [grid-template-columns:1fr_1fr_minmax(200px,280px)_1fr_1fr]
          sm:[grid-template-columns:1fr_1fr_minmax(240px,320px)_1fr_1fr]
          md:[grid-template-columns:1fr_1fr_minmax(280px,360px)_1fr_1fr]
          lg:[grid-template-columns:1fr_1fr_minmax(340px,420px)_1fr_1fr]
          items-start justify-center
        "
      >
        <div className="justify-self-end mt-8 sm:mt-12 md:mt-16 lg:mt-28">{!isMobile   ? <ProductSlot product={p1} /> : null}</div>
        <div className="justify-self-end mt-2"><ProductSlot product={p2} /></div>

        {/* Center banner */}
        <div className="justify-self-center mt-0">
          <a
            href={bannerHref}
            onClick={() =>
              pushToDataLayer("clicked_card_in_section", currentcountry?.name, {
                card_name: "Brand of the Week Banner",
                section_name: "Brand of the Week",
                page: pageName,
              })
            }
            className="block rounded-xl sm:rounded-2xl overflow-hidden"
          >
            <div className="w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[340px] rounded-xl sm:rounded-2xl">
              <img
                src={brandData?.brandWeekImg?.image_web || brandData?.brandWeekImg?.image_app}
                alt="Brand of the Week"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                loading="lazy"
              />
            </div>
          </a>
        </div>

        <div className="justify-self-start mt-2"><ProductSlot product={p3} /></div>
        <div className="justify-self-start mt-8 sm:mt-12 md:mt-16 lg:mt-28">{!isMobile ? <ProductSlot product={p4} /> : null}</div>
      </div>
        <div className="flex justify-center items-center mt-4">
            <button 
              className="text-black px-6 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-3 border-2 border-white"
              style={{
                background: 'linear-gradient(to right, #FFD700, #FF8C00)'
              }}
            >
              <span className="text-black text-sm ">More From </span>
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent text-sm font-bold">→</span>
              </div>
            </button>
        </div>
    </section>
  );
}
