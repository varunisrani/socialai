/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        phone: { max: "470px" },
        "phone-min": { min: "300px", max: "470px" },
        mid: { min: "470px", max: "640px" },
        mac: { min: "641px", max: "1280px" }, // Added screen size for mac
      },
    },
  },
  plugins: [],
};
