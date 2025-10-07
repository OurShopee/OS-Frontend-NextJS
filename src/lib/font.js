// lib/fonts.js
import localFont from "next/font/local";
import { Be_Vietnam_Pro, Outfit } from "next/font/google";

export const bayon = localFont({
  src: "/fonts/Bayon-Regular.woff2",
  variable: "--font-bayon",
});
export const otomanopeeOne = localFont({
  src: "/fonts/OtomanopeeOne-Regular.ttf",
  variable: "--font-otomanopeeOne",
});
export const pressStar = localFont({
  src: "/fonts/PressStart2P-Regular.woff2",
  variable: "--font-pressStar",
});
export const crisis = localFont({
  src: "ClimateCrisis-Regular-VariableFont_YEAR.ttf",
  variable: "--font-crisis",
});

export const bevietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-bevietnam",
});
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-outfit",
});
