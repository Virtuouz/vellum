---
_schema: default
draft: false
title: Getting Started
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: Getting Started 
  order: 990
  title:
  parent:
  url:
pageLink:
permalink: >-
  {% if pageLink %}/{% assign pagelink = pageLink | slugify %}{{  page.filePathStem | fileSubstringFilter | append: pagelink | downcase }}/index.html{% else
  %}/{% assign title = title | slugify %}{{ page.filePathStem | fileSubstringFilter | append: title | downcase }}/index.html{%endif %}
metaDesc: 
layout: layouts/doc.html
tags: vellum
hero:
content_blocks: []
---

This would be where the getting started exists. In the future there would be a collection for people using the visual editor and for developers / technical users explaining how to extend the functionality of the template.