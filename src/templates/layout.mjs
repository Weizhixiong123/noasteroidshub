import {
  SITE_NAME,
  SITE_URL,
  STEAM_URL,
  STEAM_COMMUNITY_URL,
  LAST_UPDATED,
  NAV_ITEMS
} from "../config.mjs";

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  const ogImage = `${SITE_URL}/og-card.svg`;

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
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  ${schemaHtml}
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
    ${content}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <p><strong>${escapeHtml(SITE_NAME)}</strong> is an independent player database, 90-day mining calculator, and strategy guide for <em>No Asteroids</em> by Unruled Games.</p>
          <p><strong>Unofficial fan resource:</strong> Not affiliated with, endorsed by, or sponsored by Unruled Games or Valve/Steam. Prices and stats are cross-checked against community wikis and marked when unconfirmed.</p>
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
