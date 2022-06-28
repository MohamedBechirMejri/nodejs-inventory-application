/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./views/**/*.pug"],
  theme: {
    extend: {
      animation: {
        "reveal-page": "revealPage .7s ease-in-out",
      },
      keyframes: {
        revealPage: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
