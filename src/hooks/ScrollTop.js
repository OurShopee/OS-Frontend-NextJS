"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollTop = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children || null;
};

export default ScrollTop;
