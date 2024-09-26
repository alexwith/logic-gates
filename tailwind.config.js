/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0f1216",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
