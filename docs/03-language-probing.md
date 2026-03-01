# Chapter 3: Language Discovery Analysis

One of the challenges of the Anime-Sama platform is identifying which languages are actually available for a given season or movie.

## Mechanism
While the HTML code includes buttons for all possible languages (VF, VOSTFR, VA, VCN, etc.), most are disabled or hidden via CSS classes.

### The Problem
The site's buttons often have the class `hidden` by default, and some might even be placeholders.

### The Solution: Probing
The most reliable way to find available languages is by **probing** the server. Since the site uses a consistent URL structure (e.g., `.../saison1/vf/` or `.../saison1/vostfr/`), we can check the HTTP status code of these paths.

## POC Implementation
The script `poc/languages.js` handles this by:
1. Defining a list of standard language identifiers (`vf`, `vostfr`, `va`, etc.).
2. Sending **HEAD requests** to the corresponding URLs.
3. Filtering out any 404 Not Found responses and keeping the 200 OK ones.

### Findings for JJK Saison 1:
- `VOSTFR`: ✅ (200)
- `VF`: ✅ (200)
- `VA`: ❌ (404)
- `VCN`: ❌ (404)
