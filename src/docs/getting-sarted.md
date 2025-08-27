---
_schema: default
draft: false
title: Getting Started
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: Getting Started 
  order: 3
  title:
  parent:
  url:
  icon: star
pageLink:
metaDesc: 
tags: vellum
hero:
content_blocks: []
---

## Cloudcannon editing
||| warning
**Important**

This project uses the unified Cloudcannon configuration, please select the unified flag when first creating the site in Cloudcannon
|||

When loading the project into cloud cannon please have the project build settings match the following:

```json
{
  "ssg": "eleventy",
  "mode": "hosted",
  "build": {
    "output": "dist",
    "nodeVersion": "file", // labeled as use .nvmrc file in the UI
    "preserved_paths": "node_modules/,.cache/,dist/assets/images/",
    "output_path": "dist",
    "install_command": "npm i",
    "build_command": "npm run build"
  }
}
```

## Commit to 1 editing format per page
Vellum is designed to be able to create the exact same documentation output whethe you are writing raw markdown, or using the visual editor.

That being said, it is not recommended to use both the visual editor or raw markdown on a single page. 

If you are using the content editor, you will not have access to the the more complicated components such as tabs, accordions, callouts, and tasklists as they are not supported. To use them, you will need to use write the raw markdown or use the visual content block based editor.

## Raw markdown vs Content editor
I say raw markdown instead of the content editor because it is really easy to start writing markdown in the source editor, load up the visual editor or content editor, and then everything in your markdown editor gets escaped breaking your formatting.

```md
[my label]{.label .blue}

then becomes

\[my label\]\{.label .blue\}
```