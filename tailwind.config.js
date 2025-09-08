/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extends: {
      colors: {
        'customBlue': '#15658D'
      },
    },
  },
  plugins: [],
}