/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        0: "0",
        64: "16rem",
      },
    },
  },
  variants: {
    extend: {
      // ... other variants
    },
  },
  plugins: [],
};
