"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Common/Header";
import BootstrapClient from "@/components/BootstrapClient";
import { ScrollTop } from "@/hooks";

export default function HeaderWithMargin({ children }) {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <Header />
      </div>
      <ScrollTop>
        <div className="container mainbody" style={{ marginTop: headerHeight }}>
          {children}
        </div>
        <BootstrapClient />
      </ScrollTop>
    </>
  );
}
