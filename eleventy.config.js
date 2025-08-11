const { execSync } = require("child_process");

const fileSubstringFilter = require("./src/filters/extract-file-substring-filter.js");
const uuidFilter = require("./src/filters/uuid-filter.js");
const pathExistsFilter = require("./src/filters/pathExists-filter.js");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const svgContents = require("eleventy-plugin-svg-contents");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

const markdownItAttrs = require("markdown-it-attrs");
const markdownItContainer = require("markdown-it-container");

const markdownItAnchor = require("markdown-it-anchor");
const pluginTOC = require("eleventy-plugin-nesting-toc");
const markdownIt = require("markdown-it"),
  md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
md.disable(["code", "blockquote"]);

module.exports = async function (eleventyConfig) {
  const { InputPathToUrlTransformPlugin } = await import("@11ty/eleventy");
  const { default: pluginMermaid } = await import(
    "@kevingimbel/eleventy-plugin-mermaid"
  );

  eleventyConfig.addPassthroughCopy("./src/assets/js");
  eleventyConfig.addPassthroughCopy("./src/assets/uploads/**");

  // Markdown
  let options = {
    html: true,
    linkify: true,
    typographer: true,
  };
  eleventyConfig.setLibrary(
    "md",
    markdownIt(options)
      .disable(["code"])
      .use(markdownItAnchor)
      .use(markdownItContainer, "div")
      .use(markdownItContainer, "info")
      .use(markdownItContainer, "warning")
      .use(markdownItContainer, "error")
      .use(markdownItAttrs)
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
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(svgContents);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(pluginMermaid, {
    mermaid_config: {
      startOnLoad: true,
      theme: "dark",
    },
  });

  eleventyConfig.addFilter("fileSubstringFilter", fileSubstringFilter);
  eleventyConfig.addFilter("uuidFilter", uuidFilter);
  eleventyConfig.addFilter("startsWith", function (itemUrl, pageUrl) {
    console.log(itemUrl, pageUrl);
    return itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0;
  });
  eleventyConfig.addFilter("pathExists", pathExistsFilter);
  eleventyConfig.addLiquidFilter(
    "isDescendantOf",
    function (entry, currentPage) {
      /**
       * Recursively checks if a page is a descendant of a given navigation entry.
       * @param {object} navEntry - The navigation entry to check.
       * @param {object} page - The current 11ty page object.
       * @returns {boolean} - True if the page is a descendant, false otherwise.
       */
      function hasDescendant(navEntry, page) {
        if (!navEntry.children || navEntry.children.length === 0) {
          return false;
        }

        for (const child of navEntry.children) {
          // Check if the current child's URL matches the page's URL
          // or if the child has a descendant that matches.
          if (child.url === page.url || hasDescendant(child, page)) {
            return true;
          }
        }

        return false;
      }

      // Start the recursive check from the top-level entry.
      return hasDescendant(entry, currentPage);
    }
  );

  eleventyConfig.on("eleventy.after", () => {
    execSync(
      "npx tailwindcss -i ./src/css/main.css -o ./dist/css/styles.css --minify"
    );
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
