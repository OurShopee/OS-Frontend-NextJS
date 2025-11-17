"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getImagesByKey } from "../utils/getImagesByKey";
import { pushToDataLayer } from "../utils/dataUserpush";
import { useContent, useCurrentLanguage } from "@/hooks";
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
  const currentLanguage = useCurrentLanguage();
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [item?.image]);
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
      className="relative w-[105px] min-h-[130px] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5"
      onClick={() => productcard(item?.name)}
    >
      {/* Discount Badge */}
      {pct > 0 && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <div
            className="px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#C8F4C8" }}
          >
            <span
              className="text-[10px] sm:text-xs font-bold leading-none"
              style={{ color: "#15803D" }}
            >
              {pct}% OFF
            </span>
          </div>
        </div>
      )}
  
      {/* Product Image */}
      <div className="relative p-3 pb-2 sm:p-4 sm:pb-2 flex items-center justify-center h-[110px] sm:h-[131px]">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
          </div>
        ) : (
          <img
            src={item?.image}
            alt={item?.name || "Product"}
            onError={() => setHasError(true)}
            className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] object-contain aspect-square"
            loading="lazy"
          />
        )}
      </div>
        
      {/* Price Row */}
      <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4 sm:pt-2 whitespace-nowrap">
        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap text-nowrap">
          {/* Current Price */}
          <div className="flex items-baseline">
            {currentcountry?.currency === "AED" ? (
              <img
                src="/assets/feed/aed-icon.svg"
                alt="AED"
                className={`w-3 h-3 sm:w-4 sm:h-4 inline-block mix-blend-multiply ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}
                style={{ color: "black" }}
              />
            ) : (
              <span className={`text-black text-sm sm:text-xl font-bold leading-none ${currentLanguage === "ar" ? "ml-1" : "mr-1"}`}>
                {currentcountry?.currency}
              </span>
            )}
            <span className="text-black text-sm sm:text-xl font-bold leading-none">
              {fmt(currentPrice)}
            </span>
          </div>
  
          {/* Old Price */}
          {item?.old_price ? (
            <span className="text-gray-400 text-[10px] sm:text-sm line-through font-medium">
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
export default function BrandOfTheWeekUpdated({ products = [], name = "", url = "" }) {
  console.log(products, name, url);
  const currentcountry = useSelector((s) => s.globalslice.currentcountry);
  const bannerList = useSelector((s) => s.homeslice.bannerList);
  const router = useRouter();
  const pathname = usePathname();
  const [brandData, setBrandData] = useState({});
    // Language content
  const brandOfTheWeekShort = useContent("specialPages.brandOfTheWeekShort");
  const theWeek = useContent("specialPages.theWeek");
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
      className="rounded-2xl sm:rounded-3xl px-3 py-4 sm:px-4 sm:py-6 mt-4 md:p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${brandData?.brandWeekBg?.image_web || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Brand of the Week"
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-4  pb-2">
        {/* Yellow box with right-side cut */}
        <div
          className=" px-4 z-0"
          style={{
            backgroundColor: "#FACC15",

            /* cut 20px off the right edge */
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)",
          }}
        >
          <span className="inner-shadow-text">
            <span className="brand-inner-shadow font-[Anta] text-[20px] md:text-[38px] lg:text-[60px]">
              {brandOfTheWeekShort}&nbsp;
            </span>
          </span>
        </div>

        {/* pull “THE” back under the diagonal overlap */}
        <span
          className="rest-inner-shadow font-[Anta] text-[20px] md:text-[38px] lg:text-[60px] z-10 text-black font-bold"
          style={{
            marginLeft: "-20px",
            letterSpacing: "2px",
            textShadow: " 0px 4px 1.5px 0px #8C8C8C40 inset",
          }}
        >
          {theWeek}
        </span>
      </div>


      {/* Layout - responsive grid */}
      {isMobile ? (
        /* Mobile layout: simplified 3-column grid */
        <div className="mx-auto w-full max-w-[1360px] grid grid-cols-3 gap-2 items-start justify-center">
          <div className="justify-self-end mt-4">
            <ProductSlot product={p2} />
          </div>

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
              className="block rounded-xl overflow-hidden"
            >
              <div className="w-full h-[140px] rounded-xl">
                <img
                  src={brandData?.brandWeekImg?.image_web || brandData?.brandWeekImg?.image_app}
                  alt="Brand of the Week"
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </a>
          </div>

          <div className="justify-self-start mt-4">
            <ProductSlot product={p3} />
          </div>
        </div>
      ) : (
        /* Desktop layout: 5-column semicircle grid */
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
          <div className="justify-self-end mt-8 sm:mt-12 md:mt-16 lg:mt-28">
            <ProductSlot product={p1} />
          </div>
          <div className="justify-self-end mt-2">
            <ProductSlot product={p2} />
          </div>

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
              <div className="w-full h-[220px] sm:h-[220px] md:h-[280px] lg:h-[340px] rounded-xl sm:rounded-2xl">
                <img
                  src={brandData?.brandWeekImg?.image_web || brandData?.brandWeekImg?.image_app}
                  alt="Brand of the Week"
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl aspect-[275/307]"
                  loading="lazy"
                />
              </div>
            </a>
          </div>

          <div className="justify-self-start mt-2">
            <ProductSlot product={p3} />
          </div>
          <div className="justify-self-start mt-8 sm:mt-12 md:mt-16 lg:mt-28">
            <ProductSlot product={p4} />
          </div>
        </div>
      )}
        <div className="flex justify-center items-center mt-3 sm:mt-4">
            <button 
              className="text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 sm:gap-3 border-2 border-white"
              style={{
                background: 'linear-gradient(to right, #FFD700, #FF8C00)'
              }}
              onClick={() => router.push(url)}
            >
              <span className="text-black text-xs sm:text-sm">More From {name}</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black flex items-center justify-center">
                <span className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent text-xs sm:text-sm font-bold">→</span>
              </div>
            </button>
        </div>
    </section>
  );
}
