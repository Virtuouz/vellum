/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,md}", "./_component-library/**/*.liquid"],
  theme: {
    extend: {
      colors: {
        vellum: {
          darkbrown: "#100501",
          lightbrown: "#f6f0ee",
          lessdarkbrown: "#1c0c06",
          lightgrey: "#f5f5f5",
        },
      },
    },
  },
  // safelist: [
  //       {
  //         pattern: /.+/,
  //       },
  //     ],
  plugins: ["prettier-plugin-tailwindcss"],
};
