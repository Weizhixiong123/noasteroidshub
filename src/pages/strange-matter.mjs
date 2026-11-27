import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

export function renderStrangeMatterPage(gameData) {
  const src = gameData.meta.dataSources;
  const lance = gameData.handheldTools.find((t) => t.name === "Lance");
  const orbital = gameData.shipWeapons.find((w) => w.name === "Orbital Strike");
  const collapsar = gameData.shipWeapons.find((w) => w.name === "Collapsar");

  const title = "No Asteroids Strange Matter: How to Find and Break It";
  const description =
    "Where Strange Matter is in No Asteroids, why you can't break it, and the only tools and ship guns that can: Lance, Slicer, Orbital Strike and Collapsar.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Ores & Economy", href: "/ores-economy/" },
    { name: "Strange Matter", href: "/strange-matter/" }
  ];

  const faqs = [
    {
      q: "Why can't I find Strange Matter?",
      a: "Strange Matter was added on November 25, 2026 and only generates in new campaigns and new Years. Asteroids from saves started before the update are unchanged, so start a new contract or move to the next Year."
    },
    {
      q: "Why can't I break Strange Matter?",
      a: "Only the Lance, the Slicer, the Orbital Strike and the Collapsar break it. Earlier tools, all charges and all drones bounce off. The Missile Swarm can chip it at half strength, but only in No Rush mode."
    },
    {
      q: "Where is Strange Matter located?",
      a: "At the very center of the asteroid, as a ball inside the Neutronium region—below core metal. Reaching it also earns Straight to the heart."
    },
    {
      q: "How much is Strange Matter worth?",
      a: "Community sources place it above Antimatter ($150 usual price), but no exact sell price is confirmed yet."
    }
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    }
  ];

  const breakers = [
    ["Lance", "Handheld tool", lance?.price, "Always"],
    ["Slicer", "Handheld tool", lance?.price, "Always"],
    ["Orbital Strike", "Ship gun", orbital?.price, "Always"],
    ["Collapsar", "Ship gun", collapsar?.price, "Always"],
    ["Missile Swarm", "Handheld tool", "$600,000", "No Rush mode only, at half strength"],
    ["Charges, drones, other tools and guns", "—", "—", "No"]
  ]
    .map(
      ([name, type, price, works]) => `
      <tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>${escapeHtml(type)}</td>
        <td>${escapeHtml(price || "—")}</td>
        <td>${works === "No" ? '<span class="badge badge-impact">No</span>' : escapeHtml(works)}</td>
      </tr>`
    )
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids Strange Matter: where it is and how to break it</h1>
        <p class="lead">
          Strange Matter is the new asteroid heart added in the November 25, 2026 update. It sits at the center, below core metal,
          and only four pieces of gear can break it.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-3">
          <div class="panel">
            <span class="badge badge-yellow">Where</span>
            <h3>The asteroid's center</h3>
            <p>A ball inside the Neutronium region at the core. Dig through basalt and core metal to reach it.</p>
          </div>
          <div class="panel">
            <span class="badge badge-impact">Missing it?</span>
            <h3>New campaigns only</h3>
            <p>Only asteroids generated after the update have it. Older saves keep their original heart—start a new contract or the next Year.</p>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Value</span>
            <h3>Above Antimatter</h3>
            <p>Reported as more valuable than Antimatter ($150). No exact price is confirmed yet.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>What breaks Strange Matter</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Gear</th><th>Type</th><th>Price</th><th>Breaks it?</th></tr></thead>
            <tbody>${breakers}</tbody>
          </table>
        </div>
        <p class="section-sub" style="margin-top: 0.75rem;">
          Buying an Orbital Strike or Collapsar is also what makes the Lance and Slicer appear in the Workshop.
          Not sure which to get? See <a href="/upgrades-weapons/#lance-vs-slicer">Lance vs Slicer</a>.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Fastest route to Strange Matter</h2>
        <ol class="clean-list">
          <li>Get the <strong>Missile Swarm</strong> ($600,000 solo) to cut through core metal.</li>
          <li>Buy an <strong>Orbital Strike</strong> (${escapeHtml(orbital?.price || "$300,000")})—the cheapest gear that breaks Strange Matter, and it unlocks the Lance and Slicer.</li>
          <li>Add the <strong>Lance</strong> (${escapeHtml(lance?.price || "$1,200,000")}) to tunnel straight into the heart.</li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Strange Matter FAQ</h2>
        <div class="grid grid-2">
          ${faqs.map((f) => `<article class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></article>`).join("\n          ")}
        </div>
        <p class="section-sub" style="margin-top: 1rem;">${escapeHtml(src.note)} Checked ${escapeHtml(src.checked)}.</p>
        <div class="hero-actions" style="margin-top: 1rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="/ores-economy/">All ores and prices</a>
          <a class="btn btn-secondary" href="/repair-station/">Repair Station guide</a>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/strange-matter/",
    currentPath: "/strange-matter/",
    schemas,
    content
  });
}
