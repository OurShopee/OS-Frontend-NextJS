"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { pushToDataLayer } from "./utils/dataUserpush";

export default function Carousel3D({
  interval = 2500,
  cardBackground = "#F5F5F5",
  gap = 1,
  shadowIntensity = 0.25,
  shadowStyle = "soft",
  style,
}) {
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const filteredItems =
    currentcountry?.nav_items?.filter((item) => item?.status === 1) || [];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3); // Start with 3 cards
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const cardCount = filteredItems.length;
  const cardSize = 75;

  // Transition from 3 to 5 cards after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(5);
    }, 1200); // Slightly faster initial delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (paused || cardCount === 0) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % cardCount);
    }, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, interval, paused, cardCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastWheelTime = 0;
    const wheelThreshold = 500;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) < 20) return;

      e.preventDefault();
      setPaused(true);

      const now = Date.now();
      if (now - lastWheelTime < wheelThreshold) return;

      lastWheelTime = now;
      if (e.deltaX > 0) {
        setCurrent((prev) => (prev + 1) % cardCount);
      } else {
        setCurrent((prev) => (prev - 1 + cardCount) % cardCount);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [cardCount]);

  const getCardStyle = (idx) => {
    let offset = idx - current;
    if (offset < -Math.floor(visibleCards / 2)) offset += cardCount;
    if (offset > Math.floor(visibleCards / 2)) offset -= cardCount;

    let transform = "";
    let zIndex = 1;
    let opacity = 1;
    let boxShadow = "none";

    if (offset === 0 && shadowIntensity > 0) {
      boxShadow =
        shadowStyle === "soft"
          ? `0 8px 16px -8px rgba(0, 0, 0, 0.75)`
          : `0 4px 12px rgba(0,0,0,1,${shadowIntensity * 1.2})`;
    }

    if (offset === 0) {
      transform = `translateX(0) scale(1.05) rotateY(0deg)`;
      zIndex = 5;
      opacity = 1;
    } else if (offset === -1) {
      transform = `translateX(calc(-100% - ${gap}px)) scale(0.92) rotateY(30deg)`;
      zIndex = 4;
      opacity = 0.8;
    } else if (offset === 1) {
      transform = `translateX(calc(100% + ${gap}px)) scale(0.92) rotateY(-30deg)`;
      zIndex = 4;
      opacity = 0.8;
    } else if (offset === -2) {
      transform = `translateX(calc(-180% - ${
        gap * 2
      }px)) scale(0.85) rotateY(50deg)`;
      zIndex = 3;
      opacity = 0.5;
    } else if (offset === 2) {
      transform = `translateX(calc(180% + ${
        gap * 2
      }px)) scale(0.85) rotateY(-50deg)`;
      zIndex = 3;
      opacity = 0.5;
    } else {
      transform = `translateX(0) scale(0.7) rotateY(0deg)`;
      opacity = 0;
    }

    return {
      transform,
      zIndex,
      opacity,
      boxShadow,
      cursor: offset === 0 ? "pointer" : "pointer",
    };
  };

  const handleClick = (index) => {
    setPaused(true);
    setCurrent(index);
  };

  const handleDragEnd = (_, info) => {
    setPaused(true);
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setCurrent((prev) => (prev + 1) % cardCount);
    } else if (info.offset.x > threshold) {
      setCurrent((prev) => (prev - 1 + cardCount) % cardCount);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        paddingTop: "10px",
        paddingBottom: "10px",
        width: "fit-content",
        backgroundColor: "#EEEBFA",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden", // Prevent visual glitches during expansion
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <motion.div
        style={{
          position: "relative",
          height: `${cardSize}px`,
          width: `${(cardSize + gap) * 3}px`, // Keep base width for 3 cards
        }}
        animate={{
          width: `${(cardSize + gap) * visibleCards}px`,
        }}
        transition={{
          duration: 2,
          ease: [0.23, 1, 0.32, 1],
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {filteredItems.map((card, idx) => {
          let offset = idx - current;
          if (offset < -Math.floor(visibleCards / 2)) offset += cardCount;
          if (offset > Math.floor(visibleCards / 2)) offset -= cardCount;

          if (Math.abs(offset) > Math.floor(visibleCards / 2)) {
            return null;
          }

          const styleData = getCardStyle(idx);

          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                transform: styleData.transform,
                opacity: styleData.opacity,
                zIndex: styleData.zIndex,
              }}
              transition={{
                duration: 1.0, // Smoother card transitions
                ease: [0.25, 0.46, 0.45, 0.94], // Matching ease curve
                opacity: {
                  duration: visibleCards === 5 ? 1.5 : 0.7, // Slower opacity fade-in for new cards
                  delay: visibleCards === 5 && Math.abs(offset) === 2 ? 0.3 : 0, // Slight delay for outer cards
                },
              }}
              onClick={() => {
                handleClick(idx);
                pushToDataLayer(
                  "clicked_card_in_section",
                  currentcountry.name,
                  {
                    card_name: card.title,
                    section_name: "Sale Section",
                    page:
                      typeof window !== "undefined"
                        ? window.location.pathname
                        : "",
                  }
                );
                router.push(card?.url);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: cardSize,
                height: cardSize,
                marginLeft: -cardSize / 2,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mixBlendMode: "multiply",
                overflow: "hidden",
                userSelect: "none",
                cursor: styleData.cursor,
              }}
            >
              <img src={card?.image}
                alt={card?.alt || "Card image"}
                style={{
                  width: "95%",
                  height: "95%",
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              loading="lazy" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
