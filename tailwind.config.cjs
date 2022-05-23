/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.svelte"],
  darkMode: "class",
  mode: "jit",
  important: true, // important in prod is must be

  theme: {
    extend: {
      keyframes: {
        arrow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        arrowr: {
          "100%": { transform: "rotate(0deg)" },
          "0%": { transform: "rotate(180deg)" },
        },
      },
      animation: {
        arrow: "arrow 0.3s ease-in-out 1 forwards",
        arrowr: "arrowr 0.3s ease-in-out 1 forwards",
      },
      screens: {
        "light-mode": { raw: "(prefers-color-scheme: light)" },
        "dark-mode": { raw: "(prefers-color-scheme: dark)" },
        phone: { raw: "(max-width: 768px)" },
        desktop: { raw: "(min-width: 1024px)" },
        tablet: { raw: "(max-width: 1023px)" },
      },
      zIndex: {
        "-10": -10,
        "-1": -1,
        0: 0,
        1: 1,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        auto: "auto",
      },
      colors: {
        primary: {
          default: "#18A058FF",
          deep: "#0C7A43FF",
          shallow: "#36AD6AFF",
        },
        gray$: {
          default: "#ddd",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
