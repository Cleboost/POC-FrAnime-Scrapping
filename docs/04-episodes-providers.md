# Chapter 4: Cloudflare Bypass & Watch2 Resolution

The `/watch2/` page decodes the obfuscated provider URL and redirects the user's browser to the actual video embed. It is subject to a strict Cloudflare WAF rule that blocks direct HTTP requests.

## The Challenge
Unlike the main `franime.fr` pages, `/watch2/` cannot be accessed with a raw HTTP client even with valid `cf_clearance` cookies. Cloudflare applies a **path-specific Managed Challenge** that requires genuine browser signals (TLS fingerprint, JS environment, request timing) that only a real browser can provide.

### Why curl fails
Curl sends a recognizable TLS fingerprint that Cloudflare flags instantly, regardless of headers.

### Why a basic Playwright session also fails
Loading `/watch2/` as the first request in a fresh browser session still triggers the challenge because there are no existing CF cookies for the domain.

## Solution: Iframe injection from homepage context

The fix exploits the fact that CF grants clearance per-domain, not per-path:

1. Load `https://franime.fr/` first — CF sees a real browser, issues `cf_clearance` cookies for the domain.
2. Without closing the page, inject an `<iframe>` whose `src` is the `/watch2/` URL via JavaScript.
3. The iframe request inherits the parent page's CF cookies, which are now valid.
4. Intercept the frame's navigation to the provider URL.

This works because the iframe is made from **within** an already-cleared browser context.

## Technical details
- **Persistent Chrome profile** (`--user-data-dir`): preserves CF cookies between runs, so the homepage load can be skipped on subsequent calls.
- **Real Chrome binary** (`/usr/bin/google-chrome-stable`): required for a convincing TLS fingerprint.
- **Non-headless** (`headless: false`): CF Managed Challenge detects headless mode. Xvfb is used for display on headless servers.

## POC Implementation
The script `poc/watch2.js` implements this by:
1. Launching Chrome with a persistent profile via Playwright.
2. Navigating to `https://franime.fr/` and waiting for CF clearance.
3. Injecting an iframe with the `/watch2/` URL.
4. Listening for `request` and `framenavigated` events to catch the provider URL.

### Provider detection
The script looks for any URL containing a known provider domain:
`sibnet.ru`, `vidmoly`, `sendvid`, `filemoon`, `streamtape`, `doodstream`.

### Usage:
```sh
node poc/watch2.js "https://franime.fr/watch2/?a=..."
# → https://video.sibnet.ru/shell.php?videoid=4956170
```
