/**
 * POC: Resolve watch2 URL to provider URL
 * Input:  https://franime.fr/watch2/?a=...
 * Output: provider URL (e.g. https://vidmoly.biz/embed-xxx.html)
 *
 * Strategy: inject an iframe into franime.fr homepage (which already has CF cookies),
 * then intercept the frame navigation to the provider.
 */

const { chromium } = require("playwright");
const path = require("path");
const os = require("os");
const fs = require("fs");

const PROVIDERS = ["sibnet.ru", "filemoon", "sendvid", "vidmoly", "streamtape", "doodstream"];

function isProvider(url) {
  return PROVIDERS.some((p) => url.includes(p));
}

async function resolveWatch2(watch2Url) {
  const userDataDir = path.join(os.tmpdir(), "pw-franime-profile");
  fs.mkdirSync(userDataDir, { recursive: true });

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-size=1920,1080"],
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    extraHTTPHeaders: { "Accept-Language": "fr-FR,fr;q=0.9" },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    window.chrome = { runtime: {} };
  });

  const page = await context.newPage();
  let providerUrl = null;

  const track = (req) => {
    const u = req.url();
    if (!providerUrl && isProvider(u) && (req.resourceType() === "document" || req.resourceType() === "frame")) {
      providerUrl = u;
    }
  };

  page.on("request", track);
  page.on("framenavigated", (f) => {
    const u = f.url();
    if (!providerUrl && isProvider(u)) providerUrl = u;
  });

  try {
    await page.goto("https://franime.fr/", { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);

    // Inject watch2 as iframe — CF allows it because we already have valid cookies
    await page.evaluate((url) => {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;border:none;";
      document.body.appendChild(iframe);
    }, watch2Url);

    const deadline = Date.now() + 15000;
    while (!providerUrl && Date.now() < deadline) {
      await page.waitForTimeout(300);
    }

    await context.close();
    return providerUrl;
  } catch (err) {
    await context.close();
    throw err;
  }
}

// Direct test
const watch2Url = process.argv[2] || "https://franime.fr/watch2/?a=test";
resolveWatch2(watch2Url).then((url) => console.log(url));
