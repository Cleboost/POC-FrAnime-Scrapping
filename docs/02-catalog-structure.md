# Chapter 2: Catalog Structure Analysis

Once an anime ID is known, its full structure (seasons, episodes, languages, providers) is available from a single API call.

## Endpoint
- **URL**: `https://api.franime.fr/api/anime-by-id/:id`
- **Method**: `GET`
- **Required headers**: `Origin: https://franime.fr`, `Referer: https://franime.fr/`

## Mechanism
The response is a rich JSON object describing the entire anime:
- `saisons[]`: array of seasons. Each season contains:
  - `title`: season name.
  - `episodes[]`: array of episodes. Each episode contains:
    - `title`: episode title.
    - `lang.vo.lecteurs[]`: list of provider names available in VO (e.g. `["sibnet", "vidmoly"]`).
    - `lang.vf.lecteurs[]`: list of provider names available in VF (empty array if not available).

### Index conventions
All indices used in subsequent API calls are **0-based**:
- `saisonIndex`: position of the season in `saisons[]`.
- `episodeIndex`: position of the episode in `episodes[]`.
- `lecteurIndex`: position of the provider in `lecteurs[]`.

## POC Implementation
The script `poc/details.js` implements this by:
1. Fetching the anime object from `/api/anime-by-id/:id`.
2. Mapping each season and episode to include their 0-based index.
3. Exposing the `langs.vo` and `langs.vf` lecteur lists for each episode.

### Example output for ID `517396000974` (Re:Zero):
```json
{
  "id": "517396000974",
  "title": "Re:ZERO -Starting Life in Another World-",
  "saisons": [
    {
      "index": 0,
      "title": "Saison 1",
      "episodes": [
        {
          "index": 0,
          "title": "Épisode 1",
          "langs": {
            "vo": ["sibnet"],
            "vf": []
          }
        }
      ]
    }
  ]
}
```

### Usage:
```sh
node poc/details.js 517396000974
```
