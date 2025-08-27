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
const markdownItBracketedSpans = require("markdown-it-bracketed-spans");
const MarkdownItCollapsible = require("markdown-it-collapsible");

const yaml = require("js-yaml");

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
  const { tab } = await import("@mdit/plugin-tab");
  const { tasklist } = await import("@mdit/plugin-tasklist");
  const { RenderPlugin } = await import("@11ty/eleventy");


  eleventyConfig.addPassthroughCopy("./src/assets/js");
  eleventyConfig.addPassthroughCopy("./src/assets/uploads/**");
  eleventyConfig.addPassthroughCopy("./src/assets/images");
    eleventyConfig.addPassthroughCopy({ "./src/images/favicon": "/" });

  let options = {
    html: true,
    linkify: true,
    typographer: true,
  };

  // Initialize markdown-it
  const md = markdownIt(options)
    .disable(["code"])
    .use(markdownItAnchor)
    .use(markdownItContainer, "div")
    .use(markdownItContainer, "info", {
      marker: "|",
    })
    // For consistency, you should probably update the others as well
    .use(markdownItContainer, "warning", {
      marker: "|",
    })
    .use(markdownItContainer, "error", {
      marker: "|",
    })
    .use(markdownItContainer, "warning")
    .use(markdownItContainer, "error")
    .use(tab, { name: "tabs" })
    .use(markdownItBracketedSpans)
    .use(markdownItAttrs)
    .use(tasklist)
    .use(MarkdownItCollapsible);

  // --- Add these renderer overrides ---

  // Override the 'collapsible_open' rule
  md.renderer.rules.collapsible_open = function (tokens, idx) {
    const token = tokens[idx];
    // The summary text is stored in the token's 'info' property
    const summary = token.info.trim();
    // This will automatically render any attributes the plugin adds to the token,
    // including the 'open' attribute when '++>' is used.
    const attrs = md.renderer.renderAttrs(token);

    // Output the <details>, <summary>, and the opening .details-content div
    return `<details${attrs}><summary><span class="details-marker"></span>${md.utils.escapeHtml(summary)}</summary><div class="details-content">\n`;
  };

  // We already render the summary in 'collapsible_open', so this rule should do nothing.
  md.renderer.rules.collapsible_summary = function () {
    return "";
  };

  // Override the 'collapsible_close' rule
  md.renderer.rules.collapsible_close =
    function (/* tokens, idx, options, env, self */) {
      // Output the closing tags for the content div and the details element
      return "</div></details>\n";
    };

  eleventyConfig.setLibrary("md", md);
  /**
   * Eleventy Transform to wrap all tables in a <table-saw> custom element.
   * This makes tables responsive without needing to modify the source markdown.
   */
  eleventyConfig.addTransform("wrap-tables", function(content, outputPath) {
    // 1. Check if the file is an HTML file before processing.
    if (outputPath && outputPath.endsWith(".html")) {
      
      // 2. Use a regular expression to find all HTML tables.
      // - The /g flag ensures we find ALL tables on the page.
      // - The /s flag (dotAll) allows '.' to match newlines, which is crucial
      //   because tables span multiple lines.
      const tableRegex = /<table[\s\S]*?<\/table>/gs;

      // 3. Use String.prototype.replace() to wrap each match.
      // The callback function receives the matched table string (`match`)
      // and returns it wrapped in the <table-saw> element.
      const transformedContent = content.replace(tableRegex, (match) => {
        return `<table-saw>${match}</table-saw>`;
      });

      return transformedContent;
    }

    // Return the content untouched for non-HTML files.
    return content;
  });

  eleventyConfig.addPlugin(
    pluginBookshop({
      bookshopLocations: ["_component-library"],
      pathPrefix: "",
    })
  );

  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

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
  eleventyConfig.addPlugin(RenderPlugin);

  eleventyConfig.addFilter("markdownify", (markdown) => md.render(markdown));
  eleventyConfig.addFilter("fileSubstringFilter", fileSubstringFilter);
  eleventyConfig.addFilter("uuidFilter", uuidFilter);
  eleventyConfig.addFilter("startsWith", function (itemUrl, pageUrl) {
    console.log(itemUrl, pageUrl);
    return itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0;
  });
  eleventyConfig.addFilter("pathExists", pathExistsFilter);
  eleventyConfig.addFilter("removeExtraWhitespace", function (str) {
    return str.replace(/\s+/g, " ").trim();
  });
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

  eleventyConfig.on("eleventy.before", () => {
    execSync("node ./utils/build-theme.js");
    execSync("node ./utils/permalinkDupCheck.js");
  });

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
