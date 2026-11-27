import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml, renderShot } from "../templates/layout.mjs";

export function renderAchievementsPage(achievementsData) {
  const title = "No Asteroids Achievements Guide: All 65 With Unlock Rates & Tips";
  const description =
    "All 65 No Asteroids Steam achievements with global unlock rates, the hidden one, how to get each, the rarest achievements, all 7 Museum collections and both endings.";

  const list = achievementsData.achievements;
  const total = list.length;
  const snapshot = achievementsData.globalPercentSnapshot;
  const rarest = [...list].sort((a, b) => a.globalPercent - b.globalPercent).slice(0, 10);
  const hiddenOnes = list.filter((a) => a.hidden);
  const categories = [...new Set(list.map((a) => a.category))];

  const faqs = [
    {
      q: "How many achievements does No Asteroids have?",
      a: `No Asteroids has ${achievementsData.totalOnSteam} Steam achievements. ${hiddenOnes.length} of them is hidden: ${hiddenOnes.map((h) => `"${h.name}" (${h.description.replace(/\.$/, "")})`).join(", ")}.`
    },
    {
      q: "What is the rarest achievement in No Asteroids?",
      a: `As of ${snapshot}, the rarest is "${rarest[0].name}" (${rarest[0].globalPercent}% of players), followed by "${rarest[1].name}" (${rarest[1].globalPercent}%) and "${rarest[2].name}" (${rarest[2].globalPercent}%).`
    },
    {
      q: "Can I get both endings on one save?",
      a: "No. Earth saved requires grinding the asteroid to zero, while Complaints accepted requires letting rock reach Earth. Use a second save slot for the impact ending—there are 5 slots."
    },
    {
      q: "Which achievement is easiest to lose on a run?",
      a: "Plan ahead for Wide awake: it needs a whole run without a single blackout, so one blackout on that save rules it out. Start a fresh contract if you want it."
    }
  ];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Achievements & Endings", href: "/achievements-endings/" }
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const categoryBadgeClass = (cat) => {
    if (cat === "Destruction") return "badge-yellow";
    if (cat === "Museum") return "badge";
    if (cat === "Economy & Gear") return "badge-safe";
    if (cat === "Ship Life") return "badge-tbd";
    return "badge-impact";
  };

  const rarityLabel = (pct) => {
    if (pct < 15) return "Ultra rare";
    if (pct < 40) return "Rare";
    if (pct < 70) return "Uncommon";
    return "Common";
  };

  const itemsHtml = list
    .map(
      (a) => `
      <label class="ach-item" id="ach-${escapeHtml(a.id)}" data-ach-item data-ach-id="${escapeHtml(a.id)}" data-ach-cat="${escapeHtml(a.category)}" data-ach-text="${escapeHtml(`${a.name} ${a.category} ${a.description} ${a.tip}`)}">
        <input type="checkbox" aria-label="Mark ${escapeHtml(a.name)} complete">
        <div>
          <div class="ach-title-row">
            <span class="ach-name">${escapeHtml(a.name)}</span>
            <span class="badge ${categoryBadgeClass(a.category)}">${escapeHtml(a.category)}</span>
            ${a.hidden ? '<span class="badge badge-impact">Hidden</span>' : ""}
            <span class="ach-rate" title="Steam global unlock rate (${escapeHtml(snapshot)})">${escapeHtml(a.globalPercent.toFixed(1))}% · ${rarityLabel(a.globalPercent)}</span>
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
      <div class="container page-header-split">
        <div>
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids achievements guide: all ${total} with unlock rates</h1>
        <p class="lead">
          Every one of the <strong>${achievementsData.totalOnSteam} Steam achievements</strong>, including the hidden one, with its official description,
          how to unlock it, and the share of players who have it (Steam global stats, snapshot ${escapeHtml(snapshot)}).
          Tick them off below—your checklist saves locally in your browser.
        </p>
        </div>
        ${renderShot("telescope-support-rally", "Telescope view of a cartoon Keep Working rally on Earth", "Through the ship telescope: a “Keep working” rally back on Earth.", { eager: true })}
      </div>
    </section>

    <section class="section" data-ach-tracker>
      <div class="container">
        <div class="console-panel" style="margin-bottom: 1.5rem;">
          <div class="section-header" style="margin-bottom: 0.75rem;">
            <div>
              <h2 style="margin-bottom: 0.2rem;">Ship trophy manifest</h2>
              <p class="section-sub" data-ach-count>0 / ${total} unlocked</p>
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
            <button class="pill-btn active" type="button" data-ach-filter="all">All (${total})</button>
            ${categories
              .map(
                (c) =>
                  `<button class="pill-btn" type="button" data-ach-filter="${escapeHtml(c)}">${escapeHtml(c)} (${list.filter((a) => a.category === c).length})</button>`
              )
              .join("\n            ")}
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
        <h2>Rarest No Asteroids achievements</h2>
        <p class="section-sub" style="margin-bottom: 1rem;">The ten achievements the fewest players have unlocked, as of ${escapeHtml(snapshot)}. Plan these on purpose—most won't come naturally.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Players</th>
                <th>How to get it</th>
              </tr>
            </thead>
            <tbody>
              ${rarest
                .map(
                  (a) => `
              <tr>
                <td><strong>${escapeHtml(a.name)}</strong><br><span class="ach-desc">${escapeHtml(a.description)}</span></td>
                <td>${escapeHtml(a.globalPercent.toFixed(1))}%</td>
                <td>${escapeHtml(a.tip)}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
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

  const faqHtml = `
    <section class="section">
      <div class="container">
        <h2>Achievement FAQ</h2>
        <div class="grid grid-2">
          ${faqs.map((f) => `<article class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></article>`).join("\n          ")}
        </div>
      </div>
    </section>`;

  return renderLayout({
    title,
    description,
    canonicalPath: "/achievements-endings/",
    currentPath: "/achievements-endings/",
    schemas,
    scripts: ["/js/achievements.js"],
    content: content + faqHtml
  });
}
