import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";

const SECTIONS = [
  { name: "Hangar", bonus: "Cargo hold +3%" },
  { name: "Bridge", bonus: "Ship gun rate of fire +3%" },
  { name: "Museum", bonus: "Find rewards +5%" },
  { name: "Canteen", bonus: "Air +3%" },
  { name: "Engine room", bonus: "Ship gun firepower +3%" }
];

export function renderRepairStationPage(gameData) {
  const src = gameData.meta.dataSources;
  const title = "No Asteroids Repair Station: Price, Location & How to Clean the Ship";
  const description =
    "How to get the No Asteroids Repair Station ($50,000, from Day 28), how to clean and repair the ship, the five section bonuses, and the difference between washing the lander and the ship.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Tools & Weapons", href: "/upgrades-weapons/" },
    { name: "Repair Station", href: "/repair-station/" }
  ];

  const faqs = [
    {
      q: "How do I clean the ship in No Asteroids?",
      a: "The sprayer you start with only washes the lander. To clean and repair the ship itself you need the Repair Station, a $50,000 supply-kiosk item sold from Day 28 in Year 1."
    },
    {
      q: "Where do I buy the Repair Station?",
      a: "From the supply kiosk. Players describe it as the store reached by climbing the ladder near the lander cleaner to the small platform above the lander."
    },
    {
      q: "Is the Repair Station worth $50,000?",
      a: "Each of the five ship sections gives a small permanent bonus once certified (+3% to +5%), plus a little cash per spot and section restored. The gun bonuses (Bridge and Engine room) help most on a full 90-day run; it is less urgent than ship guns early on."
    },
    {
      q: "How do I get the Fresh off the line achievement?",
      a: "Fresh off the line asks you to wash the lander spotless. That uses the free starting sprayer—you do not need the Repair Station for it."
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

  const sectionRows = SECTIONS.map(
    (s) => `
      <tr>
        <td><strong>${escapeHtml(s.name)}</strong></td>
        <td>${escapeHtml(s.bonus)}</td>
      </tr>`
  ).join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids Repair Station and how to clean the ship</h1>
        <p class="lead">
          The starting sprayer only washes the lander. The <strong>Repair Station</strong> ($50,000, from Day 28) is what cleans and repairs the ship—and each restored section gives a permanent bonus.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-3">
          <div class="panel">
            <span class="badge badge-yellow">Price</span>
            <h3>$50,000</h3>
            <p>Bought from the supply kiosk. On sale from Day 28 in Year 1 and every day from Year 2.</p>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Where</span>
            <h3>Kiosk above the lander</h3>
            <p>Climb the ladder near the lander cleaner to the small platform above the lander. Once bought, it adds a cleaning dock in the Hangar.</p>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Sprayer modes</span>
            <h3>Cleaner and Restorer</h3>
            <p><strong>Cleaner</strong> (free) washes off dirt. <strong>Restorer</strong> costs $10 per 45 seconds of spraying and repairs damage.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Ship section bonuses</h2>
        <p class="section-sub">Fully restore a section to certify it. In Year 1 you also earn $5 per damage spot restored and $100 per certified section.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Section</th><th>Certification bonus</th></tr></thead>
            <tbody>${sectionRows}</tbody>
          </table>
        </div>
        <p class="callout yellow" style="margin-top: 1rem;">
          <strong>Not settled yet:</strong> community sources disagree on whether section rewards pay once per campaign (reported after update 1.0.2) or once every Year with rising amounts. We'll update this when it's confirmed in-game.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Lander vs ship: which cleaning do you need?</h2>
        <div class="grid grid-2">
          <div class="panel">
            <h3>Washing the lander</h3>
            <p>Use the starting sprayer—no purchase needed. Getting it spotless unlocks <a href="/achievements-endings/">Fresh off the line</a>.</p>
          </div>
          <div class="panel">
            <h3>Cleaning and repairing the ship</h3>
            <p>Needs the Repair Station. Worth buying once your first guns and slots are in place; the Bridge and Engine room bonuses boost every ship gun.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Repair Station FAQ</h2>
        <div class="grid grid-2">
          ${faqs.map((f) => `<article class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></article>`).join("\n          ")}
        </div>
        <p class="section-sub" style="margin-top: 1rem;">${escapeHtml(src.note)} Checked ${escapeHtml(src.checked)}.</p>
        <div class="hero-actions" style="margin-top: 1rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="/upgrades-weapons/">All tools and ship guns</a>
          <a class="btn btn-secondary" href="/strange-matter/">Strange Matter guide</a>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/repair-station/",
    currentPath: "/repair-station/",
    schemas,
    content
  });
}
