/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#dcecff",
          500: "#4f83ff",
          600: "#3f6ff5",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "app-gradient": "radial-gradient(circle at 10% 10%, rgba(129, 140, 248, 0.10), transparent 35%), radial-gradient(circle at 90% 90%, rgba(14, 165, 233, 0.10), transparent 40%)",
      },
    },
  },
  plugins: [],
};
