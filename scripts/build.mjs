import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LAST_UPDATED, SITE_URL } from "../src/config.mjs";
import { renderHomePage } from "../src/pages/home.mjs";
import { renderBeginnerGuidePage } from "../src/pages/beginner-guide.mjs";
import { renderUpgradesWeaponsPage } from "../src/pages/upgrades-weapons.mjs";
import { renderOresEconomyPage } from "../src/pages/ores-economy.mjs";
import { renderAchievementsPage } from "../src/pages/achievements-endings.mjs";
import { renderCalculatorPage } from "../src/pages/calculator.mjs";
import { renderFaqCoopPage } from "../src/pages/faq-coop.mjs";
import { renderRepairStationPage } from "../src/pages/repair-station.mjs";
import { renderStrangeMatterPage } from "../src/pages/strange-matter.mjs";
import { renderPatchNotesPage } from "../src/pages/patch-notes.mjs";
import { itemRoutes } from "../src/pages/items.mjs";
import { renderNotFoundPage } from "../src/pages/not-found.mjs";
import { ADS_ENABLED, adFrameDocuments } from "../src/ads.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DIST_DIR = path.join(ROOT, "dist");
const DATA_DIR = path.join(ROOT, "src", "data");

async function loadJson(filename) {
  const raw = await readFile(path.join(DATA_DIR, filename), "utf8");
  return JSON.parse(raw);
}

async function build() {
  const start = performance.now();

  const [gameData, achievementsData, faqList, patchData] = await Promise.all([
    loadJson("game-data.json"),
    loadJson("achievements.json"),
    loadJson("faq.json"),
    loadJson("patch-notes.json")
  ]);

  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });
  await cp(PUBLIC_DIR, DIST_DIR, { recursive: true });

  const routes = [
    { route: "/", file: "index.html", priority: "1.0", changefreq: "daily", html: renderHomePage(gameData) },
    {
      route: "/beginner-guide/",
      file: "beginner-guide/index.html",
      priority: "0.9",
      changefreq: "weekly",
      html: renderBeginnerGuidePage(gameData)
    },
    {
      route: "/upgrades-weapons/",
      file: "upgrades-weapons/index.html",
      priority: "0.9",
      changefreq: "weekly",
      html: renderUpgradesWeaponsPage(gameData)
    },
    {
      route: "/ores-economy/",
      file: "ores-economy/index.html",
      priority: "0.9",
      changefreq: "weekly",
      html: renderOresEconomyPage(gameData)
    },
    {
      route: "/achievements-endings/",
      file: "achievements-endings/index.html",
      priority: "0.9",
      changefreq: "weekly",
      html: renderAchievementsPage(achievementsData)
    },
    {
      route: "/calculator/",
      file: "calculator/index.html",
      priority: "0.9",
      changefreq: "weekly",
      html: renderCalculatorPage()
    },
    {
      route: "/faq-coop/",
      file: "faq-coop/index.html",
      priority: "0.8",
      changefreq: "weekly",
      html: renderFaqCoopPage(gameData, faqList)
    },
    {
      route: "/repair-station/",
      file: "repair-station/index.html",
      priority: "0.8",
      changefreq: "weekly",
      html: renderRepairStationPage(gameData)
    },
    {
      route: "/strange-matter/",
      file: "strange-matter/index.html",
      priority: "0.8",
      changefreq: "weekly",
      html: renderStrangeMatterPage(gameData)
    },
    {
      route: "/patch-notes/",
      file: "patch-notes/index.html",
      priority: "0.8",
      changefreq: "daily",
      html: renderPatchNotesPage(patchData)
    },
    ...itemRoutes(gameData, achievementsData, patchData).map((item) => ({
      route: item.route,
      file: `${item.route.replace(/^\/|\/$/g, "")}/index.html`,
      priority: "0.7",
      changefreq: "weekly",
      html: item.html
    }))
  ];

  for (const page of routes) {
    const outPath = path.join(DIST_DIR, page.file);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, page.html, "utf8");
  }

  await writeFile(path.join(DIST_DIR, "404.html"), renderNotFoundPage(), "utf8");

  if (ADS_ENABLED) {
    for (const doc of adFrameDocuments()) {
      const outPath = path.join(DIST_DIR, doc.file);
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, doc.html, "utf8");
    }
  }

  const sitemapUrls = routes
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.route}</loc>
    <lastmod>${LAST_UPDATED}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;
  await writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemapXml, "utf8");

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /ads/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await writeFile(path.join(DIST_DIR, "robots.txt"), robotsTxt, "utf8");

  const elapsedMs = Math.round(performance.now() - start);
  console.log(`Built ${routes.length} pages + 404.html, sitemap.xml, robots.txt in ${elapsedMs}ms -> ${DIST_DIR}`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
