# Introduction

This project is a Proof of Concept (POC) focused on analyzing and scraping anime content from **FRAnime**.

## What is FRAnime?

**FRAnime** is a popular French platform dedicated to anime streaming, available at `franime.fr`. It provides access to a large library of:
- **Anime**: Available in VOSTFR (Original Voice with French Subtitles) and VF (French Dub).
- **Various formats**: TV series, films, OVAs, ONAs.

FRAnime does not host video files directly. It acts as an indexer, embedding players from third-party providers inside iframes.

## What is a Video Provider?

A **Video Provider** is an external service used by FRAnime to store and stream actual video files. When you watch an episode, the site loads a player from one of these providers.

Providers found on FRAnime include:
- **Vidmoly** (`vidmoly.biz`): Cloud-based video host, streams via HLS (`.m3u8`).
- **Sibnet** (`video.sibnet.ru`): Russian multimedia host, streams via `.mp4`.
- **Sendvid** (`sendvid.com`): Simple video sharing service.
- **Filemoon**: Cloud video host.

## Architecture Overview

FRAnime is built with **Next.js App Router** and communicates with a dedicated REST API at `api.franime.fr`.

### Key discovery: client-side search
Unlike most sites, FRAnime does **not** have a server-side search endpoint. Instead, it fetches the **entire catalogue** on first load and filters locally in the browser. This means one API call gives us all anime data.

### Cloudflare protection & Watch2
The site is protected by **Cloudflare**. Most API endpoints are accessible with the correct `Origin` and `Referer` headers. Although the web platform decodes the `/watch2/` redirect URLs on the client side inside the browser, we decrypt these obfuscated redirect URLs offline using a fast XOR brute-force technique. This completely bypasses the need for a browser session.

## The Scraping Pipeline

The POC is split into 5 independent steps, each building on the output of the previous one:

| Step | Script | Input | Output |
|------|--------|-------|--------|
| 1 | `search.js` | search query | list of animes with IDs |
| 2 | `details.js` | anime ID | seasons, episodes, available lecteurs |
| 3 | `stream.js` | anime ID + indices + lang | `/watch2/` URL |
| 4 | `watch2.js` | `/watch2/` URL | provider embed URL |
| 5 | `extract.js` | provider embed URL | direct stream URL (`.m3u8` / `.mp4`) |
