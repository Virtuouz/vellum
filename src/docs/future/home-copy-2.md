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
pageLink: /
permalink: >-
  {% if pageLink == 'blog' or pageLink == 'Blog' %}/{{pageLink | slugify}}{% if
  pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif
  %}/index.html{% elsif pageLink %}/{% assign pagelink = pageLink | slugify %}{{  page.filePathStem | fileSubstringFilter | append: pagelink | downcase }}/index.html{% else
  %}/{% assign title = title | slugify %}{{ page.filePathStem | fileSubstringFilter | append: title | downcase }}/index.html{%endif %}
metaDesc: 
layout: layouts/doc.html
tags: future
hero:
content_blocks: []
---
These are all things taht need to be done before the template is ready to share with the world.

## 11tydata.js file
I still need to create a 11tydata.js for computed data. This would support the draft flag and to give eleventyNavigation.key a default value equal to the page title if no key value was provided. This default value is to reduce friction when using the template as remebering to set that key value can be tedious if there are many pages.

Maybe also compute the page order based on the alphabetical order? Any page without an order value in eleventyNavigation will be given a value that matches the their alphabetical order. This computed order value would start after the highest already set value for any existing pages.

## Styling
This website is hard coded into dark mode. I need to come up with a data file powered theme system that will let users define light and dark modes. 

### My opinion on current styling
Since I am going for an MVP for the first version, I leveraged AI to help create some UI styling quicker. I don't like how this website looks like "generic dark mode tailwind documentation site #4" in terms of color scheme. This can be probably be addressed once data file driven style system is in place. 

## Left overs from copied code.
I reused code from previous projects in some areas to save time. For the most part this doesn't affect the website building, but it also isn't doing anything. This needs to be cleaned up before release.

## Half ready features
* Site Banner
* Social images based on some global data file.

## Bookshop components
* Alert
	* Info
	* Warning
	* Error
* Tabbed content 
	* ~~I am considering creating a developer focused version of this could be written with just markdown~~
    * I did create this. 
* Accordion