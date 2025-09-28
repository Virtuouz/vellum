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

## CloudCannon editing
<<<<<<< HEAD:src/docs/getting-sarted.md
When loading the project into cloud cannon please have the project build settings match the following:
=======

When loading the project into CloudCannon please have the project build settings match the following:
>>>>>>> cc951bcda0287c1f5fd3e5e2b3eb8c190c989668:src/docs/getting-started.md

```json
{
  "ssg": "eleventy",
  "mode": "hosted",
  "build": {
<<<<<<< HEAD:src/docs/getting-sarted.md
    "output": "dist",
    "nodeVersion": "file", 
=======
    "nodeVersion": "file", // labeled as use .nvmrc file in the UI
>>>>>>> cc951bcda0287c1f5fd3e5e2b3eb8c190c989668:src/docs/getting-started.md
    "preserved_paths": "node_modules/,.cache/,dist/assets/images/",
    "output_path": "dist",
    "install_command": "npm i",
    "build_command": "npm run build"
  }
}
```

## Commit to 1 editing format per page
<<<<<<< HEAD:src/docs/getting-sarted.md
Vellum is designed to be able to create the exact same documentation output whether you are writing raw Markdown, or using the visual editor.
=======
Vellum is designed to be able to create the exact same documentation output whethe you are writing raw Markdown, or using the visual editor.
>>>>>>> cc951bcda0287c1f5fd3e5e2b3eb8c190c989668:src/docs/getting-started.md

That being said, it is not recommended to use both the visual editor or raw Markdown on a single page. 

If you are using the content editor, you will not have access to the the more complicated components such as tabs, accordions, callouts, and tasklists as they are not supported. To use them, you will need to use write the raw Markdown or use the visual content block based editor.

## Raw Markdown vs Content editor
<<<<<<< HEAD:src/docs/getting-sarted.md
I say raw Markdown instead of the content editor because it is really easy to start writing Markdown in the source editor, load up the visual editor or content editor, and then everything in your markdown editor gets escaped breaking your formatting.
=======
I say raw Markdown instead of the content editor because it is really easy to start writing Markdown in the source editor, load up the visual editor or content editor, and then everything in your Markdown editor gets escaped breaking your formatting.
>>>>>>> cc951bcda0287c1f5fd3e5e2b3eb8c190c989668:src/docs/getting-started.md

```md
[my label]{.label .blue}

then becomes

\[my label\]\{.label .blue\}
```