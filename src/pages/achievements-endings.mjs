import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

export function renderAchievementsPage(achievementsData) {
  const title = "No Asteroids Achievements Checklist (65 Total), Museum Finds & Endings";
  const description =
    "Interactive No Asteroids Steam achievements checklist saved in your browser, all 7 Museum collections, and how to unlock Earth Saved vs. failure endings.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Achievements & Endings", href: "/achievements-endings/" }
  ];

  const schemas = [breadcrumbSchema(crumbs)];

  const categoryBadgeClass = (cat) => {
    if (cat === "Destruction") return "badge-yellow";
    if (cat === "Museum") return "badge";
    if (cat === "Economy & Gear") return "badge-safe";
    return "badge-impact";
  };

  const itemsHtml = achievementsData.achievements
    .map(
      (a) => `
      <label class="ach-item" data-ach-item data-ach-id="${escapeHtml(a.id)}" data-ach-cat="${escapeHtml(a.category)}" data-ach-text="${escapeHtml(`${a.name} ${a.category} ${a.description} ${a.tip}`)}">
        <input type="checkbox" aria-label="Mark ${escapeHtml(a.name)} complete">
        <div>
          <div class="ach-title-row">
            <span class="ach-name">${escapeHtml(a.name)}</span>
            <span class="badge ${categoryBadgeClass(a.category)}">${escapeHtml(a.category)}</span>
          </div>
          <p class="ach-desc">${escapeHtml(a.description)}</p>
          <p class="ach-tip"><strong>Tip:</strong> ${escapeHtml(a.tip)}</p>
        </div>
      </label>`
    )
    .join("");

  const collectionRows = achievementsData.museumCollections
    .map(
      (c) => `
      <tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td><span class="badge badge-yellow">${escapeHtml(c.achievement)}</span></td>
        <td>${escapeHtml(c.focus)}</td>
      </tr>`
    )
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids achievements checklist, museum finds, and endings</h1>
        <p class="lead">
          Tick off your progress below—your checklist saves locally in your browser (<code>localStorage</code>).
          Currently tracking <strong>${achievementsData.verifiedCount} verified Steam achievements</strong> cataloged from launch databases
          out of <strong>${achievementsData.totalOnSteam} total on Steam</strong> while hidden entries are verified.
        </p>
      </div>
    </section>

    <section class="section" data-ach-tracker>
      <div class="container">
        <div class="console-panel" style="margin-bottom: 1.5rem;">
          <div class="section-header" style="margin-bottom: 0.75rem;">
            <div>
              <h2 style="margin-bottom: 0.2rem;">Ship trophy manifest</h2>
              <p class="section-sub" data-ach-count>0 / ${achievementsData.verifiedCount} Verified Tracked (${achievementsData.totalOnSteam} Total on Steam)</p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" type="button" data-ach-export>Export progress</button>
              <button class="btn btn-danger btn-sm" type="button" data-ach-reset>Reset progress</button>
            </div>
          </div>
          <div class="progress-track">
            <div class="progress-fill" data-ach-fill></div>
          </div>
        </div>

        <div class="toolbar">
          <div class="pill-group" role="group" aria-label="Filter achievement category">
            <button class="pill-btn active" type="button" data-ach-filter="all">All (${achievementsData.verifiedCount})</button>
            <button class="pill-btn" type="button" data-ach-filter="Destruction">Destruction</button>
            <button class="pill-btn" type="button" data-ach-filter="Museum">Museum</button>
            <button class="pill-btn" type="button" data-ach-filter="Economy &amp; Gear">Economy and gear</button>
            <button class="pill-btn" type="button" data-ach-filter="Hazards &amp; Misc">Hazards and misc</button>
          </div>
          <input class="search-input" type="search" placeholder="Search achievement or tip..." aria-label="Search achievements" data-ach-search>
        </div>

        <div class="ach-list">
          ${itemsHtml}
        </div>
        <p class="callout hidden" data-ach-empty>No achievements match your current filter or search query.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>All 7 museum collections (Full museum)</h2>
        <p class="section-sub" style="margin-bottom: 1rem;">
          Recover satirical relics while carving into the rock (orbital tapes, office chairs, empty defense-budget safes, and fossils) and deposit them in your ship's observation dome.
          Watch open space after blasts for drifting finds to unlock <strong>Reel it in</strong>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Collection name</th>
                <th>Linked achievement</th>
                <th>Where and what to look for</th>
              </tr>
            </thead>
            <tbody>
              ${collectionRows}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Endings and campaign modes</h2>
        <div class="grid grid-3">
          <div class="panel">
            <span class="badge badge-safe">Victory ending</span>
            <h3>Earth saved (0 m³ remaining)</h3>
            <p>Dismantle all 5,000,000 m³ before Day 90 ends. Complete the entire campaign without ever blacking out to earn <strong>Wide awake</strong> at the same time.</p>
          </div>
          <div class="panel">
            <span class="badge badge-impact">Impact ending</span>
            <h3>Complaints accepted</h3>
            <p>Triggered when the 90-day timer expires while asteroid rock remains and reaches Earth. Easy to knock out on a separate test save slot.</p>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Relaxed mode</span>
            <h3>No Rush mode</h3>
            <p>Removes the 90-day countdown completely so you can mine at your own pace, test ship ordnance, and hunt Museum collectibles without deadline stress.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/achievements-endings/",
    currentPath: "/achievements-endings/",
    schemas,
    scripts: ["/js/achievements.js"],
    content
  });
}
