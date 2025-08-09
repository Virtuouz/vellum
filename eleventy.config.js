const { execSync } = require("child_process");

const fileSubstringFilter = require("./src/filters/extract-file-substring-filter.js");
const uuidFilter = require("./src/filters/uuid-filter.js");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const markdownItAnchor = require("markdown-it-anchor");
const pluginTOC = require('eleventy-plugin-nesting-toc');
const markdownIt = require("markdown-it"),
  md = markdownIt({
    html: true,
    linkify: false,
    typographer: true,
  });
md.disable(["code", "blockquote"]);

module.exports = async function (eleventyConfig) {

  // Markdown
  let options = {
    html: true,
    linkify: true,
    typographer: true,
  };
  eleventyConfig.setLibrary(
    "md",
    markdownIt(options).disable(["code"]).use(markdownItAnchor),
  );


  eleventyConfig.on("eleventy.after", () => {
    execSync(
      "npx tailwindcss -i ./src/css/main.css -o ./dist/css/styles.css --minify"
    );
  });

  eleventyConfig.addPlugin(
    pluginBookshop({
      bookshopLocations: ["_component-library"],
      pathPrefix: "",
    })
  );
  eleventyConfig.addPlugin(pluginTOC);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addFilter("fileSubstringFilter", fileSubstringFilter);
  eleventyConfig.addFilter("uuidFilter", uuidFilter);
  eleventyConfig.addFilter("startsWith", function(itemUrl, pageUrl) {
    console.log(itemUrl, pageUrl);
    return itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0
  });

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
