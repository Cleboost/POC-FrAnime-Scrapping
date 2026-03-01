# Chapter 2: Catalog Structure Analysis

Once an anime is selected, its main page contains the structure of the different available formats (Seasons, Movies, OAVs, Scans).

## Extraction Points
The site uses JavaScript to generate the interactive panels for each format. The data is hardcoded in the HTML as function calls to:
- `panneauAnime("Name", "relative/url")`
- `panneauScan("Name", "relative/url")`

## POC Implementation
The script `poc/extract.js` performs this extraction by:
1. Fetching the HTML of the anime's main page.
2. Identifying all calls to `panneauAnime` and `panneauScan` via Regex.
3. Filtering out the "nom" and "url" placeholders from the site's template.
4. Returning a clean JSON object of the available content.

### Example for Jujutsu Kaisen:
- **Anime**: Saison 1, Film, Saison 2, Saison 3.
- **Manga**: Scans, Modulo.
