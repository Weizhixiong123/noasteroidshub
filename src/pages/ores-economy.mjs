import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

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
  Antimatter: "#ef4444"
};

export function renderOresEconomyPage(gameData) {
  const title = "No Asteroids All Ores, Minerals & Market Price Drop Guide";
  const description =
    "Complete layer guide for all 10 verified No Asteroids minerals and exotic materials (Space Ice to Antimatter), plus how to beat terminal price decay.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Ores & Economy", href: "/ores-economy/" }
  ];

  const schemas = [breadcrumbSchema(crumbs)];

  const oreRows = gameData.ores
    .map((o) => {
      const cat = o.mineralogistCore ? "core" : "exotic";
      const swatchColor = ORE_SWATCHES[o.name] || "#e8b325";
      const hazardBadge =
        o.hazard === "None"
          ? '<span class="badge badge-safe">Safe</span>'
          : `<span class="badge badge-impact">${escapeHtml(o.hazard)}</span>`;
      const minBadge = o.mineralogistCore
        ? '<span class="badge badge-yellow">Mineralogist (1 of 8)</span>'
        : '<span class="badge">Exotic core</span>';

      return `
      <tr data-filter-item data-filter-cat="${cat}" data-filter-text="${escapeHtml(`${o.name} ${o.layer} ${o.tier} ${o.hazard} ${o.notes}`)}">
        <td>
          <span class="ore-name-wrap">
            <span class="ore-swatch" style="background:${swatchColor};" aria-hidden="true"></span>
            <strong>${escapeHtml(o.name)}</strong>
          </span><br>${minBadge}
        </td>
        <td>${escapeHtml(o.layer)}</td>
        <td><span class="badge">${escapeHtml(o.tier)}</span></td>
        <td><span class="badge badge-tbd">${escapeHtml(o.baseValue)}</span></td>
        <td>${hazardBadge}</td>
        <td>${escapeHtml(o.notes)}</td>
      </tr>`;
    })
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids all ores, minerals, and market price drop guide</h1>
        <p class="lead">
          Track every mineral layer from outer <strong>Space Ice</strong> down to volatile core <strong>Antimatter</strong>,
          unlock the <em>Mineralogist</em> achievement, and keep payouts high by dodging terminal price decay.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Asteroid layer cross-section (surface to core)</h2>
        <div class="grid grid-2" style="align-items: center;">
          <div class="diagram-card">
            <svg viewBox="0 0 520 340" role="img" aria-label="No Asteroids cross-section diagram showing Surface, Mid Crust, Deep Mantle, and Asteroid Core layers">
              <rect width="520" height="340" fill="#0B0C0F"/>
              <circle cx="260" cy="170" r="145" fill="#1C1F26" stroke="#7DD3FC" stroke-opacity="0.55" stroke-width="2"/>
              <circle cx="260" cy="170" r="108" fill="#181B22" stroke="#F0C446" stroke-opacity="0.65" stroke-width="2" stroke-dasharray="6 4"/>
              <circle cx="260" cy="170" r="70" fill="#14161B" stroke="#C084FC" stroke-opacity="0.75" stroke-width="2"/>
              <circle cx="260" cy="170" r="32" fill="#2A1215" stroke="#EF4444" stroke-width="2.5"/>
              <circle cx="260" cy="170" r="9" fill="#EF4444"/>
              <text x="260" y="42" text-anchor="middle" fill="#7DD3FC" font-family="monospace" font-size="12" font-weight="700">SURFACE: Space Ice / Meteoric Iron</text>
              <text x="260" y="79" text-anchor="middle" fill="#F0C446" font-family="monospace" font-size="12" font-weight="700">MID CRUST: Nickel / Titanium / Star Gold</text>
              <text x="260" y="118" text-anchor="middle" fill="#C084FC" font-family="monospace" font-size="12" font-weight="700">DEEP MANTLE: Space Crystal / Plasmite</text>
              <text x="260" y="174" text-anchor="middle" fill="#FCA5A5" font-family="monospace" font-size="11" font-weight="700">CORE</text>
              <text x="260" y="216" text-anchor="middle" fill="#FCA5A5" font-family="monospace" font-size="11" font-weight="700">Neutronium / Dark Matter / Antimatter</text>
              <text x="260" y="324" text-anchor="middle" fill="#9C988E" font-family="monospace" font-size="11">Deep hazards: pressurized gas pockets and explosive Antimatter</text>
            </svg>
          </div>

          <div class="panel">
            <span class="badge badge-yellow">Scanner and layer strategy</span>
            <h3>Unlocking Mineralogist and Straight to the heart</h3>
            <ul class="clean-list">
              <li><strong>8 core minerals vs. 10 materials:</strong> <em>Mineralogist</em> tracks the 8 core mineable minerals (Space Ice through Neutronium), while Dark Matter and Antimatter appear as exotic deep-core materials.</li>
              <li><strong>Filter with the HUD scanner:</strong> Color-code veins and filter out shallow Space Ice once mid-crust veins open so your pack carries higher value per slot.</li>
              <li><strong>Watch deep hazards:</strong> Deep tunnels hide pressurized <strong>Gas Pockets</strong> (<em>Gas!</em>) and volatile <strong>Antimatter</strong> (<em>Boom</em>). Use Laser or Missile Swarm in Tunnel Mode to breach from range.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section" data-filter-root>
      <div class="container">
        <div class="section-header">
          <div>
            <h2>Verified materials and ores table (10 materials)</h2>
            <p class="section-sub">Exact base credit values are marked <code>TBD (Verifying)</code> pending full post-launch terminal payout verification.</p>
          </div>
        </div>

        <div class="toolbar">
          <div class="pill-group" role="group" aria-label="Filter ores">
            <button class="pill-btn active" type="button" data-filter-btn="all">All materials (10)</button>
            <button class="pill-btn" type="button" data-filter-btn="core">Mineralogist core (8)</button>
            <button class="pill-btn" type="button" data-filter-btn="exotic">Exotic core (2)</button>
          </div>
          <input class="search-input" type="search" placeholder="Search ore, Titanium, Plasmite..." aria-label="Search ores and minerals" data-filter-search>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Depth layer</th>
                <th>Progression tier</th>
                <th>Base sell value</th>
                <th>Hazard</th>
                <th>Mining notes</th>
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
              <li><strong>Mix 2–4 vein types per shift:</strong> Rotate between Star Gold, Space Crystal, Titanium, and Plasmite to keep demand steady.</li>
              <li><strong>Complete Orders of the Day:</strong> Filling daily terminal requests unlocks <em>Quota met</em> and smooths out mid-game upgrade bottlenecks.</li>
            </ul>
          </div>
        </div>
        <div class="hero-actions" style="margin-top: 1.25rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="/calculator/">Test ore splits in calculator</a>
          <a class="btn btn-secondary" href="/achievements-endings/">Track Mineralogist and Museum</a>
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
