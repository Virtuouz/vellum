---
_schema: default
draft: false
title: Areas for improvement
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: Areas for improvement
  order: 
  title:
  parent:
  url:
  icon:
pageLink: /
metaDesc: 
socialImage:
customCode:
  headCode: ""
  bodyCode: ""
tags: future
editorial_blocks: []
---
## Custom id adding filter
I noticed right before I was going to share the project that if you use the content block based editing, the table of contents won't generate. 

To this I am going to create a custom filter that will add an id to the heading so that the table of contents will generate.

It'll be something like 

1. Capture build content into a variable
2. pass this string into custom filter
3. pass this string into Table of contents filter

```txt
\{\{ htmlContent | addIds | toc \}\}
```