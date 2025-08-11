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
  {% if pageLink %}/{% assign pagelink = pageLink | slugify %}{{  page.filePathStem | fileSubstringFilter | append: pagelink | downcase }}/index.html{% else
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

Another idea is to maybe have the permalink be computed instead of how I am currently using liquid to generate the permalink. I have had issues with cloudcannon not registering a page before and I believe it is because of he dynamic permalink genertion.

## Styling
This website is hard coded into dark mode. I need to come up with a data file powered theme system that will let users define light and dark modes. 

Add "link out" icon if someone sets up a page with a eleventyNavigation.url value to signify that it is an external link / file.

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

## Create shema file 
I still need to create schema file for for doc pages. Part of this would be to give the inputs and some good though. The current page inputs didn't have too much thought put into them since it wasn't as important for the MVP

## Write documentation
I still need to write some documentation for the template. Naturally the documentation would be written using this template. There would likely be collection for "Developers" and "Visual Editors". Visual editing would be about getting it set up in cloudcannon and writing content. The developer documentation would be about how to extend the functionality of the template and what plugins are available to do so.

A guide will be needed on a suggested way to organize pages through folders as 11ty navigation becomes hard to keep track of the more pages there are and if everything is in one gigantic folder. Perhaps innclude a simple "order" guide / system that uses 4 digit system for order pages as a sub organization technique. This would exist to reduce how much manual reordering needs to be redone if a page is added that would needs to go between two existing ordered pages. More thought is needed here.