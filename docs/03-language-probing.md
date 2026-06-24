# Chapter 3: Stream URL Resolution

Once the anime ID, season index, episode index, language, and lecteur index are known, the FRAnime API returns a `/watch2/` URL that encodes the provider information.

## Endpoint
- **URL**: `https://api.franime.fr/api/anime/:animeId/:saisonIndex/:episodeIndex/:lang/:lecteurIndex`
- **Method**: `GET`
- **Required headers**: `Origin: https://franime.fr`, `Referer: https://franime.fr/`
- **Response**: plain text — a `https://franime.fr/watch2/?a=...` URL.

## Mechanism
The API acts as a **lecteur resolver**. It takes the 0-based indices from the catalogue structure and returns an obfuscated redirect URL pointing to the actual video provider.

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `animeId` | string | Anime ID from `search.js` |
| `saisonIndex` | integer (0-based) | Season index from `details.js` |
| `episodeIndex` | integer (0-based) | Episode index from `details.js` |
| `lang` | `vo` or `vf` | Language — must match an available lang from `details.js` |
| `lecteurIndex` | integer (0-based) | Provider index within the lang's lecteurs array |

### Common mistake
Passing the provider name (e.g. `sibnet`) instead of its index will result in an HTTP error. Always use the numeric index of the provider as it appears in `lecteurs[]`.

## POC Implementation
The script `poc/stream.js` implements this by:
1. Building the API URL from the 5 parameters.
2. Fetching it with the required headers.
3. Returning the plain-text `/watch2/` URL.

### Example:
```sh
node poc/stream.js 517396000974 0 0 vo 0
# → https://franime.fr/watch2/?a=...
```
