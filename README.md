# README Forge

!\[badge](https://img.shields.io/badge/release-v1.0.0-1F6FEB?style=flat-square)
!\[badge](https://img.shields.io/badge/HTML5-E34F26?logo=html5\&logoColor=white\&style=flat-square)
!\[badge](https://img.shields.io/badge/CSS3-1572B6?logo=css3\&logoColor=white\&style=flat-square)
!\[badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript\&logoColor=black\&style=flat-square)
!\[badge](https://img.shields.io/badge/dependencies-zero-1a9e56?style=flat-square)
!\[badge](https://img.shields.io/badge/license-MIT-2DA44E?style=flat-square)

> A zero-friction web tool to generate clean, high-contrast, publication-ready README.md files in under two minutes.

\---

## Table of Contents

* [About](#about)
* [Features](#features)
* [Quick Start](#quick-start)
* [Using It](#using-it)
* [Project Structure](#project-structure)
* [Deploying to GitHub Pages](#deploying-to-github-pages)
* [Contributing](#contributing)
* [License](#license)

## About

Writing clean documentation with consistent tech badges, quick-start guides and feature tables is tedious — and most README generators produce cluttered layouts. **README Forge** is a single static page with a form on the left and a live GitHub-flavoured preview on the right. No accounts, no build step, no framework. Just HTML, CSS, vanilla JS and [marked.js](https://github.com/markedjs/marked).

## Features

|Feature|Description|
|-|-|
|Live preview|Markdown rendered in real time, styled like GitHub|
|Badge engine|Auto-generating shields.io badges for 80+ technologies, licenses and custom badges|
|Tree builder|Turns a plain indented list into a clean ├── directory tree|
|Smart features block|Lines with `Name \| description` become a table automatically|
|One-click export|Copy markdown to clipboard or download `README.md`|
|Autosave|Drafts persist to `localStorage` between sessions|

## Quick Start

```bash
git clone https://github.com/Silence-FT/readme-forge.git
cd readme-forge

