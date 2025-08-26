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
This project uses the unified Cloudcannon configuration, please select the unified flag when first creating the site in Cloudcannon

When loading the project into cloud cannon please have the project settings match the following:

```json
{
  "ssg": "eleventy",
  "mode": "hosted",
  "build": {
    "output": "dist",
    "nodeVersion": "file",
    "preserved_paths": "node_modules/,.cache/,dist/assets/images/",
    "output_path": "dist",
    "install_command": "npm i",
    "build_command": "npm run build"
  }
}
```