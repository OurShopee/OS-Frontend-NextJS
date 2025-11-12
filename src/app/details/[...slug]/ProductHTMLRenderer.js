"use client";

export default function ProductHTMLRenderer({ htmlContent }) {
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
    // <div dangerouslySetInnerHTML={{ __html: "<strong>Test HTML</strong>" }} />
  );
}
