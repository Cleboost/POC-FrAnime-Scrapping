# POC FRAnime Scrapping

This repository is a **Research and Proof of Concept (POC)** project focused on analyzing and scraping anime content from the French platform **FRAnime**.

The goal is to understand the site's architecture, its catalog structure, and how it integrates with various third-party video providers.

## 🚀 Purpose

- **Catalog Research**: Exploring how anime, seasons, and languages are indexed.
- **Scraping POC**: Implementing lightweight, dependency-free scripts to extract data.
- **Stream Analysis**: Investigating how video streams (from providers like Vidmoly, Sibnet, Sendvid, Filemoon, etc.) are embedded and can be extracted.

## 📂 Documentation

For detailed information on the site's architecture and the research findings, please refer to the documentation:

- **[Introduction to FRAnime and Video Providers](docs/00-intro.md)**
- **[Chapter 1: Search Engine Analysis](docs/01-search-engine.md)**
- **[Chapter 2: Catalog Structure Analysis](docs/02-catalog-structure.md)**
- **[Chapter 3: Stream URL Resolution](docs/03-language-probing.md)**
- **[Chapter 4: Watch2 Resolution & XOR Decryption](docs/04-episodes-providers.md)**
- **[Chapter 5: Vidmoly Deep Dive](docs/05-vidmoly-deepdive.md)**

## 🛠️ Proof of Concept (POC)

You can find the experimental scripts in the `poc/` directory:

- `poc/search.js`: Search for animes on the platform.
- `poc/details.js`: Get anime seasons, episodes, languages, and provider list by ID.
- `poc/stream.js`: Retrieve the obfuscated `/watch2/` redirect URL for an episode.
- `poc/watch2.js`: Decrypt `/watch2/` redirect URLs using fast offline XOR brute-force.
- `poc/extract.js`: Extract direct stream URLs (`.m3u8` or `.mp4`) from video host embeds.

An integrated demo combining all these steps is available in `demo/index.js`.

## ⚠️ Disclaimer

This repository is for **educational and research purposes only**. The goal is to analyze the technical aspects of web scraping and stream embedding. Please respect the terms of service of the analyzed platforms.
