const { execSync } = require("child_process");

const fileSubstringFilter = require("./src/filters/extract-file-substring-filter.js");
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const uuidFilter = require("./src/filters/uuid-filter.js");

module.exports = async function (eleventyConfig) {
  eleventyConfig.on("eleventy.after", () => {
    execSync(
      "npx @tailwindcss/cli -i ./src/css/main.css -o ./dist/css/styles.css --minify"
    );
  });

    eleventyConfig.addPlugin(
    pluginBookshop({
      bookshopLocations: ["_component-library"],
      pathPrefix: "",
    }),
  );

  eleventyConfig.addFilter("fileSubstringFilter", fileSubstringFilter);
    eleventyConfig.addFilter("uuidFilter", uuidFilter);

    return {
    markdownTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    cssTemplateEngine: "liquid",
    dir: {
      input: "src",
      pages: "pages",
      output: "dist",
    },
  };
};
