import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");

const EXPECTED_FILES = [
  "index.html",
  "beginner-guide/index.html",
  "upgrades-weapons/index.html",
  "ores-economy/index.html",
  "achievements-endings/index.html",
  "calculator/index.html",
  "faq-coop/index.html",
  "repair-station/index.html",
  "strange-matter/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt",
  "favicon.svg",
  "og-card.svg",
  "css/styles.css",
  "js/main.js",
  "js/asteroid-scene.js",
  "js/calculator.js",
  "js/achievements.js",
  "js/filters.js"
];

const HTML_FILES = EXPECTED_FILES.filter((f) => f.endsWith(".html"));
const EXPECTED_SITEMAP_URLS = HTML_FILES.length - 1; // every page except 404.html

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveDistTarget(refPath) {
  const clean = refPath.split("#")[0].split("?")[0];
  if (!clean || clean === "/") {
    return await exists(path.join(DIST_DIR, "index.html"));
  }
  const rel = clean.replace(/^\/+/, "");
  const direct = path.join(DIST_DIR, rel);
  if (clean.endsWith("/")) {
    return await exists(path.join(direct, "index.html"));
  }
  if (await exists(direct)) return true;
  return await exists(path.join(direct, "index.html"));
}

async function verify() {
  const errors = [];

  for (const rel of EXPECTED_FILES) {
    const full = path.join(DIST_DIR, rel);
    if (!(await exists(full))) {
      errors.push(`Missing expected file: dist/${rel}`);
    }
  }

  for (const htmlRel of HTML_FILES) {
    const full = path.join(DIST_DIR, htmlRel);
    if (!(await exists(full))) continue;
    const html = await readFile(full, "utf8");

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      errors.push(`${htmlRel}: missing or empty <title>`);
    }

    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (!descMatch || !descMatch[1].trim()) {
      errors.push(`${htmlRel}: missing or empty <meta name="description">`);
    }

    const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (!canonMatch || !canonMatch[1].trim()) {
      errors.push(`${htmlRel}: missing <link rel="canonical">`);
    }

    const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
    if (h1Matches.length !== 1) {
      errors.push(`${htmlRel}: expected exactly 1 <h1>, found ${h1Matches.length}`);
    }

    const jsonLdMatches = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const [idx, m] of jsonLdMatches.entries()) {
      try {
        JSON.parse(m[1]);
      } catch (err) {
        errors.push(`${htmlRel}: invalid JSON-LD block #${idx + 1}: ${err.message}`);
      }
    }

    const attrRefs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/gi)];
    for (const m of attrRefs) {
      const ref = m[1];
      if (ref.startsWith("//")) continue;
      const ok = await resolveDistTarget(ref);
      if (!ok) {
        errors.push(`${htmlRel}: broken internal path "${ref}"`);
      }
    }
  }

  const sitemapPath = path.join(DIST_DIR, "sitemap.xml");
  if (await exists(sitemapPath)) {
    const sitemap = await readFile(sitemapPath, "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
    if (locs.length !== EXPECTED_SITEMAP_URLS) {
      errors.push(`sitemap.xml: expected ${EXPECTED_SITEMAP_URLS} <loc> entries, found ${locs.length}`);
    }
    for (const loc of locs) {
      let pathname = "/";
      try {
        pathname = new URL(loc).pathname;
      } catch {
        errors.push(`sitemap.xml: invalid URL "${loc}"`);
        continue;
      }
      if (!(await resolveDistTarget(pathname))) {
        errors.push(`sitemap.xml: <loc> does not resolve to built page: ${loc}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Verification failed with errors:");
    for (const e of errors) {
      console.error(" -", e);
    }
    process.exit(1);
  }

  console.log(`Verification passed: ${EXPECTED_FILES.length} artifacts, ${HTML_FILES.length} HTML pages, valid JSON-LD, zero broken internal links, ${EXPECTED_SITEMAP_URLS}/${EXPECTED_SITEMAP_URLS} sitemap URLs verified.`);
}

verify().catch((err) => {
  console.error("Verify script crashed:", err);
  process.exit(1);
});
