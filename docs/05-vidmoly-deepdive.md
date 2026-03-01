# Chapter 5: Video Hoster Analysis (Vidmoly)

Vidmoly is one of the primary video providers for Anime-Sama, along with Sendvid and Sibnet.

## Mechanism
When a user clicks on an episode, the Anime-Sama player embeds a Vidmoly player using an `<iframe>`. The actual video is played using **JW Player** on the Vidmoly domain.

### Video Stream URL
The most important part of the Vidmoly player's HTML is the configuration object for `jwplayer().setup()`. Inside this object, the direct stream URL is specified as the `file:` property.

## Extraction POC
The script `poc/vidmoly.js` implements this by:
1. Fetching the HTML of the Vidmoly embed page.
2. Using a Regex to find the `file: '...'` property containing the `.m3u8` link.
3. Extracting metadata such as the video title, poster image, and duration.

### Stream Link (Example):
`https://prx-1359-ant-vp.vmwesa.online/hls2/02/01915/awjm3il8rk3p_,n,l,.urlset/master.m3u8?t=...`

This `.m3u8` link can be played directly in any HLS-compatible player (e.g., VLC, HLSPlayer, etc.).
