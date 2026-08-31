/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["Vazirmatn", "Tahoma", "sans-serif"],
      },
      colors: {
        ink: "#232323",
        paper: "#faf9f7",
        line: "#e2e0db",
        accent: {
          DEFAULT: "#3d5a80",
          light: "#eef2f6",
        },
        warn: {
          DEFAULT: "#b3541e",
          light: "#fbeee3",
        },
      },
    },
  },
  plugins: [],
};
