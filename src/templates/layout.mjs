import {
  SITE_NAME,
  SITE_URL,
  STEAM_URL,
  STEAM_COMMUNITY_URL,
  LAST_UPDATED,
  NAV_ITEMS,
  ANALYTICS
} from "../config.mjs";

/* ───────── Internal linking ─────────
   The first mention of each term on a page becomes a link to the page that
   answers it. Headings, buttons, labels, captions and existing links are left alone. */
const ACH = (id) => `/achievements-endings/#ach-${id}`;
const LINK_TERMS = [
  ["Lance vs Slicer", "/upgrades-weapons/#lance-vs-slicer"],
  ["Strange Matter", "/strange-matter/"],
  ["strange matter", "/strange-matter/"],
  ["Repair Station", "/repair-station/"],
  ["Orbital Strike", "/upgrades-weapons/#best-ship-guns"],
  ["Collapsar", "/upgrades-weapons/#best-ship-guns"],
  ["Missile Swarm", "/upgrades-weapons/"],
  ["Plasma Cutter", "/upgrades-weapons/"],
  ["Tractor Beam", "/upgrades-weapons/"],
  ["Antimatter", "/ores-economy/"],
  ["Neutronium", "/ores-economy/"],
  ["Dark Matter", "/ores-economy/"],
  ["Star Gold", "/ores-economy/"],
  ["core metal", "/ores-economy/"],
  ["pace calculator", "/calculator/"],
  ["patch notes", "/patch-notes/"],
  ["New Game+", "/patch-notes/"],
  ["Full toolbox", ACH("full-toolbox")],
  ["Armed to the teeth", ACH("armed-to-the-teeth")],
  ["Earth saved", ACH("earth-saved")],
  ["Wide awake", ACH("wide-awake")],
  ["Second wind", ACH("second-wind")],
  ["Complaints accepted", ACH("complaints-accepted")],
  ["Straight to the heart", ACH("straight-to-the-heart")],
  ["Demolition expert", ACH("demolition-expert")],
  ["Fresh off the line", ACH("fresh-off-the-line")],
  ["Mineralogist", ACH("mineralogist")],
  ["Gun on the roof", ACH("gun-on-the-roof")],
  ["Rocketeer", ACH("rocketeer")]
];
const SKIP_TAGS = new Set(["a", "h1", "h2", "h3", "button", "script", "style", "figcaption", "th", "label", "title", "textarea", "option", "code", "svg", "time"]);
const MAX_AUTO_LINKS = 14;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERM_RES = LINK_TERMS.map(([term, href]) => ({ href, re: new RegExp(`(?<![\\w+-])${escapeRe(term)}(?![\\w+-])`) }));

export function autoLink(html, currentPath) {
  const usedHrefs = new Set();
  const isSelf = (href) => href.split("#")[0] === currentPath;
  let count = 0;
  const skip = {};
  let skipDepth = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((tok) => {
      if (tok.startsWith("<")) {
        const m = tok.match(/^<(\/?)([a-zA-Z0-9]+)/);
        if (m && SKIP_TAGS.has(m[2].toLowerCase()) && !tok.endsWith("/>")) {
          const tag = m[2].toLowerCase();
          if (m[1]) {
            if (skip[tag] > 0) { skip[tag] -= 1; skipDepth -= 1; }
          } else {
            skip[tag] = (skip[tag] || 0) + 1; skipDepth += 1;
          }
        }
        return tok;
      }
      if (skipDepth > 0 || count >= MAX_AUTO_LINKS || !tok.trim()) return tok;
      let segments = [{ text: tok, linked: false }];
      for (const { href, re } of TERM_RES) {
        if (count >= MAX_AUTO_LINKS) break;
        if (usedHrefs.has(href) || isSelf(href)) continue;
        const next = [];
        let done = false;
        for (const seg of segments) {
          if (done || seg.linked) { next.push(seg); continue; }
          const m = seg.text.match(re);
          if (!m) { next.push(seg); continue; }
          next.push({ text: seg.text.slice(0, m.index), linked: false });
          next.push({ text: `<a href="${href}">${m[0]}</a>`, linked: true });
          next.push({ text: seg.text.slice(m.index + m[0].length), linked: false });
          done = true;
        }
        if (done) { usedHrefs.add(href); count += 1; }
        segments = next;
      }
      return segments.map((s) => s.text).join("");
    })
    .join("");
}

/* ───────── "Where to next" per page ───────── */
const NEXT_STEPS = {
  "/beginner-guide/": [["/calculator/", "90-day pace calculator", "Check whether your pace will finish by Day 90."], ["/upgrades-weapons/", "Tools and ship guns", "What to buy after the Sledgehammer and Drill."], ["/ores-economy/", "Ore prices", "Which ores are worth the trip back."]],
  "/upgrades-weapons/": [["/strange-matter/", "Strange Matter", "What the Lance, Slicer and big guns are for."], ["/repair-station/", "Repair Station", "Permanent gun bonuses from cleaning the ship."], ["/calculator/", "Pace calculator", "See if your guns are keeping up."]],
  "/ores-economy/": [["/strange-matter/", "Strange Matter", "The new heart at the center of the asteroid."], ["/upgrades-weapons/", "Tools and guns", "Which tool breaks which layer."], ["/calculator/", "Pace calculator", "Turn your daily haul into a finish date."]],
  "/achievements-endings/": [["/repair-station/", "Repair Station", "Cleaning, repairs and Fresh off the line."], ["/strange-matter/", "Strange Matter", "Reaching the center for Straight to the heart."], ["/patch-notes/", "Patch notes", "Achievement fixes in recent updates."]],
  "/calculator/": [["/upgrades-weapons/#best-ship-guns", "Best ship guns", "The fastest way to raise your daily volume."], ["/ores-economy/", "Ore prices", "Fund upgrades faster."], ["/beginner-guide/", "Beginner guide", "Day 1–90 phases at a glance."]],
  "/faq-coop/": [["/beginner-guide/", "Beginner guide", "Your first shifts, step by step."], ["/upgrades-weapons/", "Tools and guns", "Co-op prices and buy order."], ["/patch-notes/", "Patch notes", "Recent co-op fixes."]],
  "/repair-station/": [["/achievements-endings/", "All 65 achievements", "With unlock rates and tips."], ["/upgrades-weapons/", "Tools and guns", "Spend the bonuses well."], ["/patch-notes/", "Patch notes", "Cleaning and repair changes."]],
  "/strange-matter/": [["/upgrades-weapons/#lance-vs-slicer", "Lance vs Slicer", "Which $1.2M tool to buy first."], ["/ores-economy/", "All ores", "Prices for everything else you dig up."], ["/patch-notes/", "Patch notes", "When Strange Matter arrived and what changed since."]],
  "/patch-notes/": [["/upgrades-weapons/", "Tools and guns", "Current prices and stats."], ["/strange-matter/", "Strange Matter", "The biggest addition since launch."], ["/faq-coop/", "Co-op FAQ", "How shared money and gear work."]]
};

function renderNextSteps(currentPath) {
  const steps = NEXT_STEPS[currentPath];
  if (!steps) return "";
  return `
    <section class="section next-steps" aria-labelledby="next-steps-title">
      <div class="container">
        <h2 id="next-steps-title">Where to next</h2>
        <div class="next-grid">
          ${steps
            .map(
              ([href, label, desc]) => `<a class="next-card" href="${escapeHtml(href)}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(desc)}</span></a>`
            )
            .join("\n          ")}
        </div>
      </div>
    </section>`;
}

function renderAnalytics() {
  const parts = [];
  if (ANALYTICS.cloudflareToken) {
    parts.push(`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token: ANALYTICS.cloudflareToken })}'></script>`);
  }
  if (ANALYTICS.plausibleDomain) {
    parts.push(`<script defer data-domain="${escapeHtml(ANALYTICS.plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`);
  }
  return parts.join("\n  ");
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const SHOT_CREDIT = "Screenshot: Unruled Games / Steam";

export function renderShot(slug, alt, caption, { eager = false, className = "shot" } = {}) {
  const base = `/img/screens/${slug}`;
  return `<figure class="${className}">
          <a href="${base}-1280.webp" class="shot-link">
            <img src="${base}-1280.webp" srcset="${base}-640.webp 640w, ${base}-1280.webp 1280w" sizes="(max-width: 960px) 100vw, 560px" width="1280" height="720" alt="${escapeHtml(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">
          </a>
          <figcaption>${escapeHtml(caption)} <span class="shot-credit">${SHOT_CREDIT}</span></figcaption>
        </figure>`;
}

export function renderJsonLd(obj) {
  const safeJson = JSON.stringify(obj).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${safeJson}</script>`;
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`
    }))
  };
}

export function renderBreadcrumbs(items) {
  if (!items || items.length === 0) return "";
  const parts = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    if (isLast) {
      return `<span aria-current="page">${escapeHtml(item.name)}</span>`;
    }
    return `<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a><span aria-hidden="true">/</span>`;
  });
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${parts.join(" ")}</nav>`;
}

export function renderLayout({
  title,
  description,
  canonicalPath,
  currentPath,
  schemas = [],
  scripts = [],
  noindex = false,
  content
}) {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const ogImage = `${SITE_URL}/og-card.jpg`;

  const navHtml = NAV_ITEMS.map((item) => {
    const active = item.href === currentPath ? ' aria-current="page"' : "";
    return `<li><a href="${escapeHtml(item.href)}"${active}>${escapeHtml(item.label)}</a></li>`;
  }).join("\n            ");

  const schemaHtml = schemas.map((s) => renderJsonLd(s)).join("\n  ");
  const scriptHtml = ["/js/main.js", ...scripts]
    .map((src) => `<script src="${escapeHtml(src)}" defer></script>`)
    .join("\n  ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">'}
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@700;800&family=Big+Shoulders+Stencil:wght@900&family=Public+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  ${schemaHtml}
  ${renderAnalytics()}
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        <img class="brand-mark" src="/favicon.svg" alt="" width="30" height="30">
        <span>${escapeHtml(SITE_NAME)}</span>
      </a>
      <nav aria-label="Primary Navigation">
        <ul class="nav-links" data-nav-links>
            ${navHtml}
        </ul>
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary btn-sm header-steam-btn" href="${escapeHtml(STEAM_URL)}" target="_blank" rel="noopener noreferrer">View on Steam</a>
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-label="Toggle navigation menu">Menu</button>
      </div>
    </div>
  </header>

  <main id="main-content">
    ${autoLink(content, currentPath)}
    ${renderNextSteps(currentPath)}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <p><strong>${escapeHtml(SITE_NAME)}</strong> is an independent player database, 90-day mining calculator, and strategy guide for <em>No Asteroids</em> by Unruled Games.</p>
          <p><strong>Unofficial fan resource:</strong> Not affiliated with, endorsed by, or sponsored by Unruled Games or Valve/Steam. Prices and stats are cross-checked against community wikis and marked when unconfirmed. Game screenshots &copy; Unruled Games, shown for reference.</p>
        </div>
        <div>
          <h3>Guides and database</h3>
          <ul class="footer-links">
            <li><a href="/">Home overview</a></li>
            <li><a href="/beginner-guide/">Beginner guide and review</a></li>
            <li><a href="/upgrades-weapons/">Tools, ship guns, and Lance vs Slicer</a></li>
            <li><a href="/ores-economy/">All ores and sell prices</a></li>
            <li><a href="/strange-matter/">Strange Matter guide</a></li>
            <li><a href="/repair-station/">Repair Station and ship cleaning</a></li>
          </ul>
        </div>
        <div>
          <h3>Tools and support</h3>
          <ul class="footer-links">
            <li><a href="/achievements-endings/">65 achievements and museum</a></li>
            <li><a href="/calculator/">90-day pace calculator</a></li>
            <li><a href="/faq-coop/">Co-op, saves, and system FAQ</a></li>
            <li><a href="/patch-notes/">Patch notes and updates</a></li>
            <li><a href="${escapeHtml(STEAM_COMMUNITY_URL)}" target="_blank" rel="noopener noreferrer">Steam community hub</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>Last updated ${escapeHtml(LAST_UPDATED)} (Steam App ID 5527800)</span>
        <span>Zero tracking cookies — checklist progress stays local in your browser</span>
      </div>
    </div>
  </footer>
  ${scriptHtml}
</body>
</html>
`;
}
