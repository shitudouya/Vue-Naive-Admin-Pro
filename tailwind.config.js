module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      "2xl": { max: "1920px" },
      xl: { max: "1440px" },
      lg: { max: "1280px" },
      md: { max: "960px" },
      sm: { max: "640px" },
    },
  },
  plugins: [],
};
