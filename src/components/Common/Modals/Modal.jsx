"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useCurrentLanguage } from "@/hooks";

const sizeMap = {
  sm: "w-[90%] max-w-[400px]",
  md: "w-[90%] max-w-[600px]",
  lg: "w-[90%] max-w-[900px]",
};

export default function Modal({
  show,
  onHide,
  keyboard = true,
  size = "md",
  centered = false,
  className = "",
  panelClassName = "",
  closeOnBackdrop = true,
  ariaLabel = "Modal dialog",
  children,
}) {
  const panelRef = useRef(null);
  const currentLanguage = useCurrentLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  // ESC handling
  useEffect(() => {
    if (!show || !keyboard) return;
    const onKey = (e) => {
      if (e.key === "Escape") onHide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, keyboard, onHide]);

  if (!show) return null;

  const position = centered ? "items-center" : "items-start pt-10";
  const panelSize = sizeMap[size] || sizeMap.md;

  const modal = (
    <div
      className={`fixed inset-0 z-[100] ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeOnBackdrop ? onHide : undefined}
      />

      {/* Panel */}
      <div className={`relative h-full w-full flex justify-center ${position}`}>
        <div
          ref={panelRef}
          className={`relative bg-white rounded-2xl shadow-2xl ${panelSize} max-w-lg max-h-[90vh] overflow-y-auto ${panelClassName}`}
          onClick={(e) => e.stopPropagation()}
          dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(modal, document.body) : null;
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  keyboard: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  centered: PropTypes.bool,
  className: PropTypes.string,
  panelClassName: PropTypes.string,
  closeOnBackdrop: PropTypes.bool,
  ariaLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
};
