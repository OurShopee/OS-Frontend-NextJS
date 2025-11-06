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
import { MediaQueries } from "../utils";
import { getImagesByKey } from "../utils/getImagesByKey";
import { pushToDataLayer } from "../utils/dataUserpush";
import { ProductCard } from "../Common";

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

/* --------------------------- Stable product slot wrapper --------------------------- */
function ProductSlot({ product }) {
  const renderInner = useCallback((p) => {
    if (!p) return null;
    const parts = p.url?.split("/");
    const hasSku = Object.prototype.hasOwnProperty.call(p, "sku");
    const href =
      hasSku && parts?.length >= 2
        ? `/details/${p.url}`
        : hasSku
        ? `/details/${p.url}/${p.sku}`
        : `/details/${p.url}`;

    // TIP: If ProductCard height varies a lot, add a consistent min-h inside ProductCard.
    return (
      <Link href={href} className="no-underline block" prefetch={false}>
        <ProductCard item={p} type={1} section_name="Brand Of The Week" />
      </Link>
    );
  }, []);

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
  const { isMobile } = MediaQueries();
  const pathname = usePathname();
  const [brandData, setBrandData] = useState({});
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const pageName = typeof window !== "undefined" ? window.location.pathname : pathname;

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
      <div className="flex items-center justify-center mb-4 pt-6 pb-2">
        <div
          className="px-4 z-0"
          style={{
            backgroundColor: "#FACC15",
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
        >
          <span className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]">BRAND&nbsp;</span>
          <span className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]" style={{ color: "black" }}>
            OF&nbsp;
          </span>
        </div>
        <span
          className="font-[Anta] text-[20px] md:text-[38px] lg:text-[60px] z-10 text-black font-bold"
          style={{ marginLeft: "-20px", letterSpacing: "2px" }}
        >
          THE WEEK
        </span>
      </div>

      {/* Desktop semicircle layout */}
      {!isMobile ? (
        <div
          className="
            mx-auto w-full max-w-[1360px]
            grid gap-4 md:gap-6
            [grid-template-columns:1fr_1fr_minmax(340px,420px)_1fr_1fr]
            items-start justify-center
          "
        >
          <div className="justify-self-end mt-16 md:mt-20 lg:mt-28"><ProductSlot product={p1} /></div>
          <div className="justify-self-end"><ProductSlot product={p2} /></div>

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
              className="block rounded-2xl overflow-hidden"
            >
              <div className="w-full h-[300px] md:h-[340px] rounded-2xl">
                <img
                  src={brandData?.brandWeekImg?.image_web || brandData?.brandWeekImg?.image_app}
                  alt="Brand of the Week"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </a>
          </div>

          <div className="justify-self-start"><ProductSlot product={p3} /></div>
          <div className="justify-self-start mt-16 md:mt-20 lg:mt-28"><ProductSlot product={p4} /></div>
        </div>
      ) : (
        // Mobile
        <div className="flex flex-col gap-3">
          {(brandData?.brandWeekImg?.image_app || brandData?.brandWeekImg?.image_web) && (
            <a href={bannerHref} className="block w-full rounded-2xl overflow-hidden">
              <div className="w-full h-[220px] rounded-2xl">
                <img
                  src={brandData?.brandWeekImg?.image_app || brandData?.brandWeekImg?.image_web}
                  alt="Brand of the Week"
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              </div>
            </a>
          )}
          <div className="grid grid-cols-2 gap-2">
            {[p1, p2, p3, p4].map((p, i) => (
              <ProductSlot key={i} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
