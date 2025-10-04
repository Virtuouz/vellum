// Set to true for development environment, false for production.
// When true, developers can see all posts
// without having to manually change each post's front matter.
const isDevEnv = false;

function showDraft(data) {
  const isDraft = "draft" in data && data.draft !== false;
  return isDevEnv || !isDraft;
}

module.exports = {
  eleventyComputed: {
    /**
     * Automatically assigns an order to navigation items that don't have one.
     * It sorts pages with an 'order' key first, then sorts the remaining
     * pages alphabetically. This logic is applied at each nesting level.
     */
    eleventyNavigation: (data) => {
      // If there's no navigation object or key, we can't process it.
      if (!data.eleventyNavigation || !data.eleventyNavigation.key) {
        return data.eleventyNavigation;
      }

      // If an 'order' is already explicitly set as a number, respect it and do nothing.
      if (typeof data.eleventyNavigation.order === "number") {
        return data.eleventyNavigation;
      }

      // `collections.all` is available in computed data. We'll use it to find sibling pages.
      const allPages = data.collections.all;

      // Determine the parent of the current page. Root pages will have an undefined parent.
      const parent = data.eleventyNavigation.parent || undefined;

      // Filter to find sibling pages (those with the same parent).
      const siblings = allPages.filter((page) => {
        if (!page.data.eleventyNavigation || !page.data.eleventyNavigation.key) {
          return false;
        }
        const pageParent = page.data.eleventyNavigation.parent || undefined;
        // This check ensures we're only comparing pages within the same directory context (e.g. /docs/).
        // This is a simple way to scope the sorting behavior.
        if (!page.filePathStem.startsWith(data.page.filePathStem.substring(0, data.page.filePathStem.indexOf('/')))) {
            return false;
        }
        return parent === pageParent;
      });

      // Separate siblings into those with a predefined order and those without.
      const orderedSiblings = siblings.filter(
        (page) => typeof page.data.eleventyNavigation.order === "number"
      );
      const unorderedSiblings = siblings.filter(
        (page) => typeof page.data.eleventyNavigation.order !== "number"
      );

      // Find the highest order number among the ordered siblings. Default to 0 if none have an order.
      let maxOrder = 0;
      if (orderedSiblings.length > 0) {
        maxOrder = Math.max(
          ...orderedSiblings.map((p) => p.data.eleventyNavigation.order)
        );
      }

      // Sort the unordered pages alphabetically by their title or key if title is not set.
      unorderedSiblings.sort((a, b) => {
        const titleA = a.data.eleventyNavigation.title || a.data.eleventyNavigation.key || "";
        const titleB = b.data.eleventyNavigation.title || b.data.eleventyNavigation.key || "";
        return titleA.localeCompare(titleB);
      });

      // Find the alphabetical index of the current page among its unordered siblings.
      const pageIndex = unorderedSiblings.findIndex(
        (p) => p.page.filePathStem === data.page.filePathStem
      );

      // This shouldn't happen if the initial check passes, but it's a safeguard.
      if (pageIndex === -1) {
        return data.eleventyNavigation;
      }

      // The new order starts right after the highest existing order number.
      const newOrder = maxOrder + pageIndex + 1;

      // Return a new navigation object with the calculated order.
      return {
        ...data.eleventyNavigation,
        order: newOrder,
      };
    },

    eleventyExcludeFromCollections: function (data) {
      if (showDraft(data)) {
        return data.eleventyExcludeFromCollections;
      } else {
        return true;
      }
    },
    permalink: function (data) {
      let permalinkTrue = false;
      if (showDraft(data)) {
        permalinkTrue = true;
      }

      // If a URL is set in eleventyNavigation, it's an external link and shouldn't generate a page.
      if (data.eleventyNavigation && data.eleventyNavigation.url) {
        permalinkTrue = false;
      }

      if (permalinkTrue) {
        return data.permalink;
      } else {
        return false;
      }
    },
  },
};
