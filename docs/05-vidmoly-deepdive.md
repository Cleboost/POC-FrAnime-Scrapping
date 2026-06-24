# Chapter 5: Video Provider Extraction

The final step extracts a playable stream URL (`.m3u8` or `.mp4`) from the provider's embed page. Each provider has a different mechanism.

## Vidmoly

Vidmoly serves video via **HLS** (HTTP Live Streaming). The embed page loads a JW Player instance whose configuration is inlined in the HTML.

### Extraction mechanism
The `jwplayer().setup()` call contains a `file:` property with the `.m3u8` URL:
```js
jwplayer("player").setup({
  file: 'https://prx-xxx.vmwesa.online/hls2/.../master.m3u8?t=...',
  ...
});
```

A single fetch + regex is sufficient — no browser needed.

### Example stream URL:
`https://prx-1359-ant-vp.vmwesa.online/hls2/02/01915/awjm3il8rk3p_,n,l,.urlset/master.m3u8?t=...`

---

## Sibnet

Sibnet serves video as a signed `.mp4` file hosted on their CDN. The URL is time-limited (the `e=` parameter is a Unix timestamp expiry).

### Extraction mechanism — two HTTP requests, no browser

1. **Fetch the embed page** (`shell.php?videoid=...`): the HTML contains a JW Player `src:` property with a path like `/v/<token>/<videoid>.mp4`.
2. **Follow the redirect manually**: a `GET` to `https://video.sibnet.ru/v/<token>/<videoid>.mp4` returns a `302` to the real CDN URL.

```
GET https://video.sibnet.ru/v/daa4d85ca35bf1a6d5b6221e23bab411/4956170.mp4
→ 302 Location: //dv97.sibnet.ru/46/16/29/4616290.mp4?st=...&e=...
```

### Why the playlist API doesn't work
`/export/playlist_xml.php` returns **related videos** (suggested next content), not the current video's stream. The `file` field in that response belongs to other video IDs.

### Example stream URL:
`https://dv97.sibnet.ru/46/16/29/4616290.mp4?st=lL9WqT5rU1TqsIW15HfLKg&e=1782341000&stor=57&noip=1`

---

## Sendvid

Sendvid embeds a standard HTML5 `<video>` player. The source URL (`.mp4` or `.m3u8`) is either in a `<source src="...">` tag or in a `file:` property.

A single fetch + regex is sufficient.

---

## POC Implementation
The script `poc/extract.js` implements all three providers:
1. Detects the provider from the URL.
2. Dispatches to the appropriate extractor function.
3. Returns the direct stream URL.

### Usage:
```sh
# Vidmoly
node poc/extract.js "https://vidmoly.biz/embed-cbp5sc7ez1za.html"
# → https://prx-....m3u8

# Sibnet
node poc/extract.js "https://video.sibnet.ru/shell.php?videoid=4956170"
# → https://dv97.sibnet.ru/....mp4?st=...&e=...

# Sendvid
node poc/extract.js "https://sendvid.com/embed/..."
# → https://...mp4
```
