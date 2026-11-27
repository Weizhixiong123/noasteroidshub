import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

export function renderUpgradesWeaponsPage(gameData) {
  const title = "No Asteroids Tools, Ship Weapons & Best Upgrade Order Guide";
  const description =
    "Complete progression guide for all 6 handheld tools (Pickaxe to Missile Swarm), automated ship weapons including the Collapsar black hole gun, and utility drones.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Tools & Weapons", href: "/upgrades-weapons/" }
  ];

  const schemas = [breadcrumbSchema(crumbs)];

  const toolRows = gameData.handheldTools
    .map((t) => {
      const extras = [
        ...(t.branches ? t.branches.map((b) => `<span class="badge badge-yellow">${escapeHtml(b)}</span>`) : []),
        ...(t.modes ? t.modes.map((m) => `<span class="badge badge-yellow">${escapeHtml(m)}</span>`) : [])
      ].join(" ");
      return `
      <tr data-filter-item data-filter-cat="handheld" data-filter-text="${escapeHtml(`${t.name} ${t.role} ${t.notes} ${(t.branches || []).join(" ")} ${(t.modes || []).join(" ")}`)}">
        <td><strong>Tier ${t.tier}: ${escapeHtml(t.name)}</strong><br><span class="badge">${escapeHtml(t.role)}</span></td>
        <td><span class="badge badge-tbd">${escapeHtml(t.unlockCost)}</span></td>
        <td>${extras || '<span class="badge">Standard progression</span>'}</td>
        <td>${escapeHtml(t.notes)}</td>
      </tr>`;
    })
    .join("");

  const shipRows = gameData.shipWeapons
    .map(
      (w) => `
      <tr data-filter-item data-filter-cat="ship" data-filter-text="${escapeHtml(`${w.name} ${w.stage} ${w.role} ${w.notes}`)}">
        <td><strong>${escapeHtml(w.name)}</strong><br><span class="badge badge-yellow">${escapeHtml(w.stage)}</span></td>
        <td><span class="badge badge-tbd">${escapeHtml(w.cost)}</span></td>
        <td>${escapeHtml(w.role)}</td>
        <td>${escapeHtml(w.notes)}</td>
      </tr>`
    )
    .join("");

  const utilRows = gameData.utilitiesAndDrones
    .map(
      (u) => `
      <tr data-filter-item data-filter-cat="utility" data-filter-text="${escapeHtml(`${u.name} ${u.unlock} ${u.notes}`)}">
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td><span class="badge">${escapeHtml(u.unlock)}</span></td>
        <td>${escapeHtml(u.notes)}</td>
      </tr>`
    )
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids tools, ship weapons, and upgrade order</h1>
        <p class="lead">
          Your handheld gear cuts deep mineral veins while ship-mounted ordnance blasts the 5,000,000 m³ exterior.
          Filter the catalog below to plan upgrades from the starter Pickaxe up to the <strong>Collapsar</strong> black hole weapon.
        </p>
      </div>
    </section>

    <section class="section" data-filter-root>
      <div class="container">
        <div class="toolbar">
          <div class="pill-group" role="group" aria-label="Filter equipment category">
            <button class="pill-btn active" type="button" data-filter-btn="all">All gear</button>
            <button class="pill-btn" type="button" data-filter-btn="handheld">Handheld tools (6)</button>
            <button class="pill-btn" type="button" data-filter-btn="ship">Ship weapons (9 slots)</button>
            <button class="pill-btn" type="button" data-filter-btn="utility">Utilities and drones</button>
          </div>
          <input class="search-input" type="search" placeholder="Search tool, Collapsar, Plasma..." aria-label="Search tools and weapons" data-filter-search>
        </div>

        <div class="callout yellow">
          <strong>Stat transparency:</strong> Tool names, Plasma Cutter upgrade branches (<em>Hit, Tempo, Sweep, Luck</em>), Missile Swarm tactical modes,
          and ship ordnance roles are verified from release builds. Exact credit prices and DPS values vary by patch and stay marked
          <span class="badge badge-tbd">TBD (Verifying)</span> until full post-launch terminal tables are confirmed.
        </div>

        <h2 style="margin-top: 1.75rem;">1. Handheld mining tools (6 tiers for Full toolbox)</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tool and role</th>
                <th>Credit cost</th>
                <th>Branches or modes</th>
                <th>Tactical notes</th>
              </tr>
            </thead>
            <tbody>
              ${toolRows}
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">2. Automated ship weapons (9 hull slots for Armed to the teeth)</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ship weapon and stage</th>
                <th>Slot cost</th>
                <th>Primary role</th>
                <th>How it helps your run</th>
              </tr>
            </thead>
            <tbody>
              ${shipRows}
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">3. Suit utilities, drones, and crew roles</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>System or upgrade</th>
                <th>Source</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              ${utilRows}
            </tbody>
          </table>
        </div>

        <p class="callout hidden" data-filter-empty>No matching tools or weapons found for your current search filter.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Recommended upgrade order (solo vs. co-op)</h2>
        <div class="grid grid-2">
          <div class="panel">
            <span class="badge badge-yellow">Solo campaign order</span>
            <h3>Balance personal digging and roof firepower</h3>
            <ol class="clean-list">
              <li><strong>Oxygen and Cargo Lv. 1–2</strong> to cut wasted shuttle returns.</li>
              <li><strong>Sledgehammer then Drill</strong> alongside your <strong>first ship turret</strong> (<em>Gun on the roof</em>).</li>
              <li><strong>Jetpack</strong> (<em>Rocketeer</em>) before deep vertical shafts slow down exits.</li>
              <li><strong>Plasma Cutter</strong> (prioritize <em>Hit</em> and <em>Tempo</em>, then <em>Sweep</em>) plus mid-tier Railgun and Mass Driver.</li>
              <li><strong>Missile Swarm</strong> (<em>Tunnel Mode</em> for core; <em>Spread Fire</em> for crust) and <strong>Collapsar</strong> to sweep the final 10–25%.</li>
            </ol>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">8-player co-op order</span>
            <h3>Coordinate shared wallet spending</h3>
            <ol class="clean-list">
              <li>Keep host spending permissions clear so shared ore credits don't get wasted on duplicate low-tier tools.</li>
              <li>If loadouts are toggled to <strong>Shared</strong>, each tier unlock upgrades the whole crew at once.</li>
              <li>Send deep-vein hunters after Star Gold and Plasmite while surface players run Tractor Beams and hull weapon slots.</li>
              <li>Check daily team requirements in the <a href="/calculator/">90-day pace calculator</a>—if output lags, funnel funds into Ship Slots and Collapsar.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/upgrades-weapons/",
    currentPath: "/upgrades-weapons/",
    schemas,
    scripts: ["/js/filters.js"],
    content
  });
}
