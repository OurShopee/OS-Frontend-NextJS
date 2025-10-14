/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // Ensure Tailwind utilities have highest priority
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "progress-bar": "fillBar 3s linear forwards",
      },
      keyframes: {
        fillBar: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      screens: {
        "2xl": "1470px",
        "3xl": "1700px",
      },
      colors: {
        primary: "#5232C2",
        secondary: "#FFCF0A",
        mygray: "#676767",
        "primary-active": "rgba(59, 130, 246, 1)",
      },
      fontFamily: {
        bayon: ['"Bayon"', "sans-serif"],
        bevietnam: ['"Be Vietnam Pro"', "sans-serif"],
        Outfit: ["Outfit", "sans-serif"],
        OtomanopeeOne: ['"OtomanopeeOne"', "sans-serif"],
        pressStar: ['"Press Start 2P"', "sans-serif"],
        crisis: ['"ClimateCrisis"', "sans-serif"],
      },
    },
    container: {
      center: true,
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1470px",
      },
    },
  },
  plugins: [],
};
