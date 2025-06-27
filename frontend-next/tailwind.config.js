/** @type {import('tailwindcss').Config} */
const customColors = require("./src/colors");


module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: 
      {colors: {
        ...customColors,
      },
    },
  },
  plugins: [],
};
