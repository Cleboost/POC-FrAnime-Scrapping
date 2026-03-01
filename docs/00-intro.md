# Introduction

This project is a Proof of Concept (POC) focused on analyzing and scraping anime content from **Anime-Sama**.

## What is Anime-Sama?

**Anime-Sama** is a popular French community platform dedicated to anime cataloging and streaming. It provides access to a vast library of:
- **Anime**: Available in VOSTFR (Original Voice with French Subtitles) and VF (French Dub).
- **Manga Scans**: Direct reading of various manga series.

One key architectural detail of Anime-Sama is that **it does not host video files directly**. Instead, it acts as an indexer and aggregator, embedding players from third-party services.

## What is a Video Provider?

A **Video Provider** (or Video Hoster) is an external service used by platforms like Anime-Sama to store and stream actual video files. When you watch an episode, you are interacting with an `<iframe>` that loads a player from one of these providers.

Common providers found on the site include:
- **Vidmoly**: A cloud-based video hosting platform.
- **Sendvid**: A simple video sharing service.
- **Sibnet**: A Russian multimedia host.

### The Scraping Challenge
Scraping Anime-Sama involves two distinct steps:
1. **Catalog Scraping**: Navigating the site's structure to find anime URLs, seasons, languages, and episode lists.
2. **Video Extraction**: Identifying the provider's iframe URL and then "breaking out" of that iframe to find the direct stream link (usually an `.m3u8` or `.mp4` file) if possible.
