import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

const KIND_LABEL = {
  patch: "Patch",
  release: "Launch",
  "pre-release": "Before launch",
  demo: "Demo"
};

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function renderPatchNotesPage(patchData) {
  const entries = patchData.entries;
  const latest = entries.find((e) => e.version) || entries[0];

  const title = `No Asteroids Patch Notes & Updates (Latest: ${latest.version || latest.title})`;
  const description = `Every No Asteroids update in one place, newest first—from the demo to version ${latest.version}. What changed for tools, ore prices, co-op and achievements, with links to the official Steam posts.`;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Patch Notes", href: "/patch-notes/" }
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "No Asteroids patch notes",
      itemListElement: entries.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.title,
        url: e.url
      }))
    }
  ];

  const entryHtml = entries
    .map((e) => {
      const id = e.version ? `v${e.version.replaceAll(".", "-")}` : e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const related = e.related.length
        ? `<p class="patch-related">On this site: ${e.related
            .map(([href, label]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
            .join(", ")}</p>`
        : "";
      return `
        <article class="patch-entry" id="${escapeHtml(id)}">
          <div class="patch-meta">
            <time datetime="${escapeHtml(e.date)}">${escapeHtml(formatDate(e.date))}</time>
            <span class="badge ${e.kind === "patch" ? "badge-yellow" : "badge-tbd"}">${escapeHtml(KIND_LABEL[e.kind] || e.kind)}</span>
          </div>
          <div class="patch-body">
            <h2>${escapeHtml(e.title)}</h2>
            <ul class="clean-list">
              ${e.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("\n              ")}
            </ul>
            ${related}
            <p class="patch-source"><a href="${escapeHtml(e.url)}" target="_blank" rel="noopener noreferrer">Read the full notes on Steam</a></p>
          </div>
        </article>`;
    })
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids patch notes and updates</h1>
        <p class="lead">
          Latest: <strong>${escapeHtml(latest.title)}</strong> (${escapeHtml(formatDate(latest.date))}).
          Each entry sums up the changes that affect how you play and links to the official post. Newest first.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="patch-list">
          ${entryHtml}
        </div>
        <p class="section-sub" style="margin-top: 1.5rem;">
          Summaries are written from the official Unruled Games announcements on Steam, checked ${escapeHtml(patchData.checked)}. Bookmark this page—we add each new update as it ships.
        </p>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/patch-notes/",
    currentPath: "/patch-notes/",
    schemas,
    content
  });
}
