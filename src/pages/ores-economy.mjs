import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml, renderShot } from "../templates/layout.mjs";

const ORE_SWATCHES = {
  "Space Ice": "#7dd3fc",
  "Meteoric Iron": "#9ca3af",
  Nickel: "#cbd5e1",
  Titanium: "#94a3b8",
  "Star Gold": "#f0c446",
  "Space Crystal": "#5eead4",
  Plasmite: "#c084fc",
  Neutronium: "#e2e8f0",
  "Dark Matter": "#6366f1",
  Antimatter: "#ef4444",
  "Strange Matter": "#f472b6"
};

export function renderOresEconomyPage(gameData) {
  const ores = gameData.ores;
  const src = gameData.meta.dataSources;
  const title = `No Asteroids Ores & Prices: All ${ores.length} Minerals, Rock Layers & Selling Guide`;
  const description = `All ${ores.length} No Asteroids ores with sell prices (Space Ice $3 to Antimatter $150), the new Strange Matter heart, which tool breaks each rock layer, and how to avoid glut price drops.`;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Ores & Economy", href: "/ores-economy/" }
  ];

  const schemas = [breadcrumbSchema(crumbs)];

  const oreRows = ores
    .map((o) => {
      const cat = o.breaks === "Any tool" ? "easy" : "deep";
      const swatchColor = ORE_SWATCHES[o.name] || "#e8b325";
      const nameHtml = o.href ? `<a href="${escapeHtml(o.href)}">${escapeHtml(o.name)}</a>` : escapeHtml(o.name);
      return `
      <tr data-filter-item data-filter-cat="${cat}" data-filter-text="${escapeHtml(`${o.name} ${o.breaks} ${o.notes}`)}">
        <td>
          <span class="ore-name-wrap">
            <span class="ore-swatch" style="background:${swatchColor};" aria-hidden="true"></span>
            <strong>${nameHtml}</strong>
          </span>
        </td>
        <td><strong>${escapeHtml(o.usualPrice)}</strong></td>
        <td>${escapeHtml(o.priceRange)}</td>
        <td>${escapeHtml(o.breaks)}</td>
        <td>${escapeHtml(o.notes || "—")}</td>
      </tr>`;
    })
    .join("");

  const layerRows = gameData.rockLayers
    .map(
      (l) => `
      <tr>
        <td><strong>${escapeHtml(l.name)}</strong></td>
        <td>${escapeHtml(l.depth)}</td>
        <td>${escapeHtml(l.breaks)}</td>
      </tr>`
    )
    .join("");

  const easyCount = ores.filter((o) => o.breaks === "Any tool").length;

  const content = `
    <section class="page-header">
      <div class="container page-header-split">
        <div>
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids all ores, minerals, and market price drop guide</h1>
        <p class="lead">
          Sell prices for all ${ores.length} ores—from <strong>Space Ice</strong> ($3) to <strong>Antimatter</strong> ($150) and the new
          <a href="/strange-matter/">Strange Matter</a> heart—plus which tool breaks each rock layer and how to keep payouts high.
        </p>
        </div>
        ${renderShot("pickaxe-star-gold", "A pickaxe striking a glowing Star Gold vein", "Breaking a Star Gold vein with the pickaxe.", { eager: true })}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Asteroid layer cross-section (surface to core)</h2>
        <div class="grid grid-2" style="align-items: center;">
          <div class="diagram-card">
            <svg viewBox="0 0 520 340" role="img" aria-label="No Asteroids cross-section showing regolith and stone, deep stone, basalt, core metal and the strange matter heart">
              <rect width="520" height="340" fill="#050A18"/>
              <circle cx="260" cy="170" r="145" fill="#1C1F26" stroke="#7DD3FC" stroke-opacity="0.55" stroke-width="2"/>
              <circle cx="260" cy="170" r="108" fill="#181B22" stroke="#F0C446" stroke-opacity="0.65" stroke-width="2" stroke-dasharray="6 4"/>
              <circle cx="260" cy="170" r="70" fill="#14161B" stroke="#C084FC" stroke-opacity="0.75" stroke-width="2"/>
              <circle cx="260" cy="170" r="32" fill="#2A1215" stroke="#EF4444" stroke-width="2.5"/>
              <circle cx="260" cy="170" r="9" fill="#EF4444"/>
              <text x="260" y="42" text-anchor="middle" fill="#7DD3FC" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="12" font-weight="700">REGOLITH / STONE (70–100%): Pickaxe</text>
              <text x="260" y="79" text-anchor="middle" fill="#F0C446" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="12" font-weight="700">DEEP STONE (55–70%): Drill</text>
              <text x="260" y="118" text-anchor="middle" fill="#C084FC" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="12" font-weight="700">BASALT (40–55%): Laser</text>
              <text x="260" y="174" text-anchor="middle" fill="#FCA5A5" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="11" font-weight="700">CORE METAL</text>
              <text x="260" y="216" text-anchor="middle" fill="#FCA5A5" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="11" font-weight="700">0–40%: Missile Swarm · center: Strange Matter</text>
              <text x="260" y="324" text-anchor="middle" fill="#9C988E" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="#050A18" stroke-width="5" stroke-linejoin="round" font-size="11">% = distance from the center as a share of the radius</text>
            </svg>
          </div>

          <div>
            <h3>Rock layers and the tool you need</h3>
            <div class="table-wrap table-compact">
              <table>
                <thead><tr><th>Layer</th><th>Depth</th><th>Breaks with</th></tr></thead>
                <tbody>${layerRows}</tbody>
              </table>
            </div>
            <p class="section-sub">${escapeHtml(gameData.rockStockNote)}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" data-filter-root>
      <div class="container">
        <div class="section-header">
          <div>
            <h2>All ${ores.length} ores and sell prices</h2>
            <p class="section-sub">"Usual price" is the typical market price; it drops when you flood the market (glut) and recovers over time. ${escapeHtml(src.note)} Checked ${escapeHtml(src.checked)}.</p>
          </div>
        </div>

        <div class="toolbar">
          <div class="pill-group" role="group" aria-label="Filter ores">
            <button class="pill-btn active" type="button" data-filter-btn="all">All ores (${ores.length})</button>
            <button class="pill-btn" type="button" data-filter-btn="easy">Any tool (${easyCount})</button>
            <button class="pill-btn" type="button" data-filter-btn="deep">Needs late tools (${ores.length - easyCount})</button>
          </div>
          <input class="search-input" type="search" placeholder="Search ore, Antimatter, Neutronium..." aria-label="Search ores and minerals" data-filter-search>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ore</th>
                <th>Usual price</th>
                <th>Typical range</th>
                <th>Breaks with</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${oreRows}
            </tbody>
          </table>
        </div>

        <p class="callout hidden" data-filter-empty>No materials match your filter.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>How market price decay works (and how to stop it)</h2>
        <div class="grid grid-2">
          <div class="panel">
            <h3>Why your ore payout drops</h3>
            <p>Selling massive quantities of the same ore floods the ship's trade terminal, causing unit prices to decay. Players who haul only Meteoric Iron or Star Gold trip after trip lose credits unnecessarily.</p>
          </div>
          <div class="panel">
            <h3>Three ways to protect terminal profits</h3>
            <ul class="clean-list">
              <li><strong>Check total payout before confirming:</strong> Watch the combined payout preview at the terminal rather than trusting base starting prices.</li>
              <li><strong>Mix ore types per shift:</strong> Spread sales across several ores so no single price gluts. Since the Nov 25 update, prices recover faster and big sales take a smaller hit.</li>
              <li><strong>Complete Orders of the Day:</strong> Filling daily terminal requests unlocks <em>Quota met</em> and smooths out mid-game upgrade bottlenecks.</li>
            </ul>
          </div>
        </div>
        <div class="hero-actions" style="margin-top: 1.25rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="/calculator/">Test ore splits in calculator</a>
          <a class="btn btn-secondary" href="/achievements-endings/">Track Mineralogist and all 65 achievements</a>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/ores-economy/",
    currentPath: "/ores-economy/",
    schemas,
    scripts: ["/js/filters.js"],
    content
  });
}
