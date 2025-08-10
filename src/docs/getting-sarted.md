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
  {% if pageLink == 'blog' or pageLink == 'Blog' %}/{{pageLink | slugify}}{% if
  pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif
  %}/index.html{% elsif pageLink %}/{% assign pagelink = pageLink | slugify %}{{  page.filePathStem | fileSubstringFilter | append: pagelink | downcase }}/index.html{% else
  %}/{% assign title = title | slugify %}{{ page.filePathStem | fileSubstringFilter | append: title | downcase }}/index.html{%endif %}
metaDesc: 
layout: layouts/doc.html
tags: vellum
hero:
content_blocks: []
---
