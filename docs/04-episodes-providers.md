# Chapter 4: Watch2 Resolution & XOR Decryption

The `/watch2/` URLs returned by the FRAnime API contain obfuscated parameters encoding the destination provider embed URL. Rather than executing a real browser context to let the client-side SPA decode it, we can decrypt these parameters offline instantly.

## The Encryption Mechanism
The URL parameters of `/watch2/` (e.g. `a`, `b`, `c`, etc.) contain obfuscated data:
1. **Base64 + Hex Encoding**: The query parameter value is first decoded from Base64. The resulting string is a hexadecimal representation of the encrypted bytes.
2. **Dynamic XOR Key**: The payload is encrypted with a single-byte XOR key (an integer between `0` and `255`). This key changes dynamically per link, provider, or site update (common keys include `2`, `3`, `10`, `88`, `95`, etc.).

## Brute-Force Resolution Strategy
Since the XOR key space is extremely small (`256` possible values), we can perform an instant offline brute-force decryption:

1. **Extract parameters**: Parse all search parameters from the `/watch2/` URL.
2. **Decode bytes**: Decode each parameter from Base64, check if it's a valid hex string, and convert it to a binary Buffer.
3. **Try all 256 keys**: For each parameter, XOR the buffer bytes with every key from `0` to `255`.
4. **Validate URL**: Convert the XORed bytes back to a UTF-8 string. If it begins with `http://` or `https://` and contains a recognized provider domain (such as `sibnet.ru`, `filemoon`, etc.), we have found the correct key and decrypted URL.

This process is extremely fast (taking less than 1 microsecond) and completely eliminates the need for headless browser automation (Playwright/Puppeteer) for the watch2 step.

## POC Implementation
The script `poc/watch2.js` implements this by:
1. Parsing the query parameters of the target `/watch2/` URL.
2. Running the brute-force XOR decryption logic on the parameters.
3. Returning the decrypted provider URL immediately.

### Usage:
```sh
node poc/watch2.js "https://franime.fr/watch2/?a=..."
# → https://video.sibnet.ru/shell.php?videoid=5622007
```
