"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import { getAssetsUrl } from "@/components/utils/helpers";
import { useContent, useCurrentLanguage } from "@/hooks";
import { BsArrowLeft } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { MdRefresh } from "react-icons/md";

/**
 * Error Boundary Component
 * This component catches errors in the application and displays a user-friendly error page
 * 
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object that was thrown
 * @param {Function} props.reset - Function to reset the error boundary and retry
 */
export default function Error({ error, reset }) {
  const router = useRouter();
  const { isMobile } = MediaQueries();
  const currentLanguage = useCurrentLanguage();
  const isRTL = currentLanguage === "ar";

  // Get translated content with fallbacks
  const errorTitle = useContent("error.title") || "Something went wrong!";
  const errorSubtitle = useContent("error.subtitle") || "We encountered an unexpected error. Please try again.";
  const goBackText = useContent("error.goBack") || "Go Back";
  const goHomeText = useContent("error.goHome") || "Go to Home";
  const tryAgainText = useContent("error.tryAgain") || "Try Again";

  // Log error to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Application Error:", error);
    }
  }, [error]);

  return (
    <Container
      fluid
      className="homepagecontainer flex md:items-center justify-center min-h-[70vh]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-center w-full max-w-2xl px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Error Image */}
          <div className="mb-4">
            <img
              src={getAssetsUrl("payfail.png")}
              alt="Error"
              className="w-max h-max scale-75 md:scale-[100%] max-w-[300px]"
              loading="eager"
            />
          </div>

          {/* Error Title */}
          <h1 className="text-[32px] md:text-[40px] font-bold text-gray-900">
            {errorTitle}
          </h1>

          {/* Error Message */}
          <p className="font-normal text-[#475156] text-base md:text-lg leading-6 mb-2 max-w-md">
            {errorSubtitle}
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && error?.message && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left w-full max-w-md">
              <p className="text-sm text-red-800 font-semibold mb-2">Error Details:</p>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer">
                    Stack Trace
                  </summary>
                  <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex flex-wrap justify-center gap-3 md:gap-5 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Try Again Button */}
            <button
              onClick={reset}
              className="active:scale-[.97] flex items-center gap-2 bg-[#5232C2] border-none uppercase text-white rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-[#4328A8] transition-colors"
              aria-label={tryAgainText}
            >
              <MdRefresh className="text-lg" />
              <span>{tryAgainText}</span>
            </button>

            {/* Go Back Button */}
            <button
              onClick={() => router.back()}
              className="active:scale-[.97] flex items-center gap-2 bg-white text-[#5232C2] border-2 border-[#5232C2] uppercase rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-[#F5F3FF] transition-colors"
              aria-label={goBackText}
            >
              <BsArrowLeft className="text-lg" />
              <span>{goBackText}</span>
            </button>

            {/* Go Home Button */}
            <button
              onClick={() => router.push("/")}
              className="active:scale-[.97] flex items-center gap-2 bg-transparent text-[#5232C2] border-2 border-[#5232C2] uppercase rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-[#F5F3FF] transition-colors"
              aria-label={goHomeText}
            >
              <GoHome className="text-xl" />
              <span>{goHomeText}</span>
            </button>
          </div>

          {/* Additional Help Text */}
          <p className="text-sm text-gray-500 mt-6">
            {useContent("error.helpText") || "If the problem persists, please contact our support team."}
          </p>
        </div>
      </div>
    </Container>
  );
}

