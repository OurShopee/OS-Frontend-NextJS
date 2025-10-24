"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import HeaderSeller from "./HeaderSeller";

export default function DynamicHeader() {
  const pathname = usePathname();
  const isSeller = pathname === "/seller" || pathname === "/onboarding";

  return isSeller ? <HeaderSeller /> : <Header />;
}
