---
_schema: default
draft: false
title: Else stuff
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: else stuff
  order: 
  title: Else Stuff
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
tags: else
hero:
content_blocks: []
---

# Documentation Style Guide

Welcome to the Documentation Style Guide! This document serves as a comprehensive reference for all the formatting options available in **Markdown**. You can use it as a template to see how various elements are rendered and to ensure consistency in your own documentation.

---

## Headers

Headers are essential for structuring your document. Markdown provides six levels of headers.

## H2 Header (A major section)
### H3 Header (A sub-section)
#### H4 Header (Further sub-division)
##### H5 Header (Used for fine-grained organization)
###### H6 Header (The smallest header)

---

## Paragraphs and Basic Text Formatting

This is a standard paragraph. You can create a new paragraph by leaving a blank line. This paragraph contains **bold text** and *italic text*. You can also use ***bold and italic text together***. Strikethrough text is also supported.

You can also create a new line within a paragraph using two spaces at the end of the line.  
Like this.

> This is a blockquote. It's often used for quoting a passage from another source or for emphasizing a particular point.
> You can have multiple paragraphs within a blockquote.
>
> > This is a nested blockquote.
> > It's useful for quoting a quote!

---

## Lists

Lists are great for organizing information. There are ordered lists, unordered lists, and even nested lists.

### Unordered Lists

* Item one
* Item two
    * A nested item
    * Another nested item
* Item three

### Ordered Lists

1.  First item
2.  Second item
3.  Third item
    1.  A nested ordered item
    2.  Another nested ordered item
4.  Fourth item

---

## Code

Code blocks are crucial for technical documentation. Markdown supports both inline code and multi-line code blocks.

### Inline Code

Use backticks to show `inline code`. This is great for mentioning a variable name like `my_variable` or a function `my_function()`.

### Code Blocks

You can create a code block using three backticks. You can also specify the language for syntax highlighting.

```python
def hello_world():
  print("Hello, world!")

# Call the function
hello_world()
```

## Tables

Tables are useful for presenting data in a structured format.

|Header 1|Header 2|Header 3|
|---|---|---|
|Row 1, Col 1|Row 1, Col 2|Row 1, Col 3|
|Row 2, Col 1|Row 2, Col 2|Row 2, Col 3|
|Row 3, Col 1|Row 3, Col 2|Row 3, Col 3|

Export to Sheets

You can align columns by using colons (`:`) in the separator line.

|Left-Aligned|Center-Aligned|Right-Aligned|
|---|---|---|
|Left|Center|Right|
|Aligned|Aligned|Aligned|

Export to Sheets

## Links and Images

Links and images are essential for connecting to other resources and adding visual context.

### Links

This is a [link to Google](https://www.google.com). You can also use reference-style links, which can make your markdown cleaner for multiple links to the same URL.

Here's an example: [Google Home Page](https://www.google.com).

### Images

You can embed images in your documentation. They use similar syntax to links but with an exclamation mark at the beginning.

---

## Horizontal Rules

A horizontal rule is a line that separates content. It's great for visually breaking up sections.

---

You can create a horizontal rule using three or more hyphens (`---`), asterisks (`***`), or underscores (`___`). All three will produce the same result.

---

## Task Lists

Task lists (or checkboxes) are a great way to track to-do items.

- [x] This is a completed task.
    
- [ ] This is an incomplete task.
    
- [ ] Another incomplete task.
    

---

## Escaping Characters

Sometimes you need to display a character that Markdown would normally format, like an asterisk or a hashtag. You can use a backslash to escape it.

\*This text is not italic.\* \#This is not a header.

---

## Conclusion

This concludes the Markdown Style Guide. By using these elements, you can create rich, well-structured, and easy-to-read documentation.