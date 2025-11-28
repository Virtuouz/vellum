---
_schema: default
draft: false
title: Vellum Overview
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: Vellum Overview
  order: 1
  title:
  parent:
  url:
  icon: home
pageLink: /
metaDesc:
socialImage:
customCode:
  headCode: ''
  bodyCode: ''
tags: vellum
editorial_blocks:
  - _bookshop_name: editorial/fileTree
    treeCode: |-
      . root
        src
          index.html
          style.css
        output
  - _bookshop_name: editorial/accordion
    accordions:
      - title: Accordion
        opened: true
        editorials:
          - _bookshop_name: generic/textBlock
            markdownContent: This is cool
          - _bookshop_name: editorial/tabs
            tabs:
              - title: Am I really nesting tabs in here?
                editorials:
                  - _bookshop_name: generic/textBlock
                    markdownContent: 'no'
              - title: yes I am
                editorials:
                  - _bookshop_name: generic/textBlock
                    markdownContent: >-
                      Your rich text content

                      You can use **bold text** and *italic text* along with
                      [links](http://google.com) and others options.
  - _bookshop_name: generic/textBlock
    markdownContent: >-
      Your rich text content You can use **bold text** and *italic text* along
      with [links](http://google.com) and others options. {% bookshop
      'generic/styledText' text: "Oh yeah" style: "green label" %} This should
      be inline


      > Check out this quote ma

      >

      > \-jane doe


      <table><thead><tr><th><p>Separator</p></th><th><p>Item
      2</p></th><th><p>Item 3</p></th></tr></thead><tbody><tr><td><p>Feature
      1</p></td><td><p>X</p></td><td><p>N</p></td></tr><tr><td><p>Feautre
      2</p></td><td><p>N</p></td><td><p>X</p></td></tr><tr><td><p><strong>Separaot</strong></p></td><td><p></p></td><td><p></p></td></tr><tr><td><p>Feature
      3</p></td><td><p>N</p></td><td><p>N</p></td></tr><tr><td><p>Feature
      4</p></td><td><p> X </p></td><td><p>X</p></td></tr></tbody></table>


      Thanks kind it, its a table


      ## Teesting


      asdfasdf {% bookshop 'generic/styledText' text: "Testing" style: "green
      label" %} asdfasf
---
![Vellum Logo](/assets/images/uploads/Vellum%20Logo%20Gray.png)

## What is Vellum?

Vellum is a modern documentation template designed to serve a diverse audience, from non-technical content editors to experienced developers. It bridges the gap between simple, unscalable solutions and complex, development-heavy frameworks.

In the past, creating web-based documentation was primarily a technical task, often requiring developers to set up a site from scratch. This left many businesses, internal teams, and non-profit organizations without an easy way to build and maintain their own knowledge bases. Vellum was created to address this accessibility gap, providing a ready-to-use solution that's simple enough for anyone to get started, yet powerful enough to grow with your needs.

---

## Why Vellum?

Many documentation solutions present a trade-off: they are either simple to start with but become difficult to manage as they grow, or they are powerful but require a steep learning curve and constant maintenance from a technical team.

Vellum solves this by prioritizing both **ease of use** and **scalability**. The template is designed to be ready out of the box, allowing you to focus on your content from day one. At the same time, it is built to handle hundreds of documentation pages effortlessly through a powerful **collections system**. Think of collections as a digital filing cabinet, allowing you to logically organize pages into groups, making navigation and content management intuitive for everyone.

Furthermore, many popular documentation frameworks rely on complex technologies like React, which can be an unnecessary overhead for building static, text-heavy sites. Vellum is built with **Eleventy (11ty)**, a simple yet incredibly fast static site generator. This choice of technology ensures that Vellum is lightweight, produces highly performant pages, and remains accessible to a wide variety of users.