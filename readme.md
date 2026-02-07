# Vellum
---
Vellum is a documentation template built with a simple philosophy: creating beautiful, easy-to-read documentation should be an intuitive and enjoyable process for everyone, from developers to non-technical writers. It leverages the power of Markdown, the simplicity of 11ty, and the visual editing of CloudCannon to create a site that is fast, flexible, and fully customizable.

This template works with or without CloudCannon. CloudCannon is recommended if you or your users are non developers. 
## Key Features
- **Markdown is all you need:** Write content and even complex components using familiar Markdown syntax.
- **Visually edit with CloudCannon:** Non-technical users can build pages visually using Bookshop components.
- **Full Theming Control:**
    - Easily define your own light and dark mode color palettes.
    - Choose any font from Google Fonts for headings, body text, and your logo.
    - Upload light and dark theme logos
- **“Collection” Based Routing:** The navigation bar intelligently shows only the docs relevant to the selected collection, keeping things tidy.
- **Advanced Authoring Components:**
	- Tabs
    - Accordions
    - Mermaid.js graphs
        - Automatically styled with your theme
        - Built in panning and zooming
    - File Tree
    - Task lists
    - Callouts (info, warning, error)
    - Label text styling (green, orange, red, blue, kbd{this one is styled like a keyboard key})
    - All components are nestable, in raw markdown and through bookshop.
- **Robust & SEO-Friendly:**
    - Duplicate permalink checker to prevent build failures.
    - Dynamic permalinks for clean URLs (folder becomes part of url).
    - Automatic `sitemap.xml` and `robots.txt` generation.
    - Automatic image optimization, you don’t have to do anything (11ty img)
- **Flexible & Powerful:**
    - Site-wide banner for announcements.
    - Custom code injection (site-wide or per-page) for analytics and tracking scripts or anything else.
    - Draft page functionality so you can publish when ready.
    - Nested navigation powered by 11ty Navigation.
    - Responsive tables using `<table-saw>`.
    - Internal linking via file paths (InputPath to Url 11ty plugin)
    - Quickly add a change log with the `changelog` component.

## Quick Start
Navigate to the Site data file, labeled `Vellum` in the CloudCannon UI. Update the information there to match your organization or personal project.

In the Doc Collections file configure your collections, this is the organizational category that each page created can be associated with. 

Optionally set a site wide banner or update the light and dark theme colors to match your brand.

In depth guides can be found here [https://www.vellumdocs.dev/](https://www.vellumdocs.dev/)

## Local Development
1. Run `npm install` to install the modules
2. Run `npm run build` to built the site 
3. Run `npm run start` to create local dev server

The output folder is `dist`.

This templates can be extended by creating new bookshop components or adding Markdown-it plugins.. `npm run start` 