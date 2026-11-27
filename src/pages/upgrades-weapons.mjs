import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml, renderShot } from "../templates/layout.mjs";

const fmt = (n, digits = 2) => (Number.isInteger(n) ? String(n) : n.toFixed(digits));

export function renderUpgradesWeaponsPage(gameData) {
  const tools = gameData.handheldTools;
  const guns = gameData.shipWeapons;
  const slots = gameData.shipSlots;
  const src = gameData.meta.dataSources;

  const title = `No Asteroids Tools & Ship Guns: All ${tools.length} Tools, ${guns.length} Guns, Prices & Best Picks`;
  const description = `Every No Asteroids tool (Pickaxe to Lance and Slicer) and all ${guns.length} ship guns with prices, damage, radius and fire rate, plus Lance vs Slicer, best ship guns, slots, drones and charges.`;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Tools & Weapons", href: "/upgrades-weapons/" }
  ];

  const gunStats = guns.map((g) => {
    const dps = g.damage * g.shotsPerSecond;
    return { ...g, dps, dpsPer10k: (dps / g.priceValue) * 10000 };
  });
  const byDps = [...gunStats].sort((a, b) => b.dps - a.dps);
  const byValue = [...gunStats].sort((a, b) => b.dpsPer10k - a.dpsPer10k);
  const byRadius = [...gunStats].sort((a, b) => b.radius - a.radius);

  const faqs = [
    {
      q: "Should I buy the Lance or the Slicer first in No Asteroids?",
      a: "Both cost $1,200,000 and both break strange matter. The Lance bores a tunnel, so it is the pick for reaching the center fast; the Slicer cuts a flat sheet, so it clears wide areas. Since update 1.0.6 the Slicer cuts three times as often and the Lance no longer pushes you back. If you only want to reach the strange-matter heart, take the Lance; for bulk volume, take the Slicer."
    },
    {
      q: "How do I unlock the Lance and Slicer?",
      a: "They only appear in the Workshop after you own an Orbital Strike or a Collapsar (in a ship slot or storage), or after you hit core metal with a mining tool in the current Year. Once owned in a Year they stay on sale."
    },
    {
      q: "What are the best ship guns in No Asteroids?",
      a: `By raw damage per second the ${byDps[0].name} leads; for damage per dollar the ${byValue[0].name} and ${byValue[1].name} are the best early buys. The Orbital Strike has the largest blast radius (${byRadius[0].radius} m) and, with the Collapsar, is the only gun that breaks strange matter.`
    },
    {
      q: "How many ship slots are there?",
      a: `${slots.total}. The first is free; slots 2–${slots.total} cost about ${slots.totalCost} in total. Unlocking every slot earns Armed to the teeth.`
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

  const toolRows = tools
    .map(
      (t, i) => `
      <tr data-filter-item data-filter-cat="handheld" data-filter-text="${escapeHtml(`${t.name} ${t.breaks} ${t.unlock} ${t.notes}`)}">
        <td><strong>${i + 1}. ${escapeHtml(t.name)}</strong></td>
        <td>${escapeHtml(t.price)}</td>
        <td>${escapeHtml(t.priceCrew2)} / ${escapeHtml(t.priceCrew3)}</td>
        <td>${escapeHtml(t.breaks)}</td>
        <td>${escapeHtml(t.notes)}${t.unlock !== "Workshop" && t.unlock !== "Starter" ? `<br><span class="badge badge-yellow">Unlock</span> ${escapeHtml(t.unlock)}` : ""}</td>
      </tr>`
    )
    .join("");

  const gunRows = gunStats
    .map(
      (g) => `
      <tr data-filter-item data-filter-cat="ship" data-filter-text="${escapeHtml(`${g.name} ${g.notes}`)}">
        <td><strong>${escapeHtml(g.name)}</strong></td>
        <td>${escapeHtml(g.price)}</td>
        <td>${escapeHtml(fmt(g.damage))}</td>
        <td>${escapeHtml(fmt(g.radius, 1))} m</td>
        <td>${escapeHtml(g.rate)}</td>
        <td>${escapeHtml(g.dps.toFixed(2))}</td>
        <td>${escapeHtml(g.notes)}</td>
      </tr>`
    )
    .join("");

  const droneRows = gameData.drones
    .map(
      (d) => `
      <tr data-filter-item data-filter-cat="utility" data-filter-text="${escapeHtml(`${d.name} drone ${d.notes}`)}">
        <td><strong>${escapeHtml(d.name)}</strong> <span class="badge">Drone</span></td>
        <td>${escapeHtml(d.price)}</td>
        <td>Day ${d.fromDay}</td>
        <td>${escapeHtml(d.notes)}</td>
      </tr>`
    )
    .join("");

  const utilRows = gameData.utilities
    .map(
      (u) => `
      <tr data-filter-item data-filter-cat="utility" data-filter-text="${escapeHtml(`${u.name} ${u.notes}`)}">
        <td><strong>${u.href ? `<a href="${escapeHtml(u.href)}">${escapeHtml(u.name)}</a>` : escapeHtml(u.name)}</strong> <span class="badge">System</span></td>
        <td>${escapeHtml(u.price)}</td>
        <td>—</td>
        <td>${escapeHtml(u.notes)}</td>
      </tr>`
    )
    .join("");

  const chargeRows = gameData.charges
    .map(
      (c) => `
      <tr>
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td>${escapeHtml(c.price)}</td>
        <td>${c.perPurchase}</td>
        <td>${c.maxCarried}</td>
        <td>Day ${c.fromDay}</td>
      </tr>`
    )
    .join("");

  const upgradeRows = gameData.gunUpgrades
    .map(
      (u) => `
      <tr>
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td>${escapeHtml(u.firstLevel)}</td>
        <td>${u.levels}</td>
        <td>${escapeHtml(u.effect)}</td>
      </tr>`
    )
    .join("");

  const slotList = slots.prices.map((p, i) => `<li>Slot ${i + 1}: <strong>${escapeHtml(p)}</strong></li>`).join("");

  const content = `
    <section class="page-header">
      <div class="container page-header-split">
        <div>
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids tools, ship guns, and upgrade prices</h1>
        <p class="lead">
          All ${tools.length} handheld tools, all ${guns.length} ship guns, the ${slots.total} ship slots, drones, charges and gun upgrades—with prices and stats in one place.
          Jump to <a href="#lance-vs-slicer">Lance vs Slicer</a> or <a href="#best-ship-guns">best ship guns</a>.
        </p>
        </div>
        ${renderShot("workshop-tools", "The Workshop screen listing handheld tools and their upgrades", "The Workshop, where handheld tools are bought and upgraded.", { eager: true })}
      </div>
    </section>

    <section class="section" data-filter-root>
      <div class="container">
        <div class="toolbar">
          <div class="pill-group" role="group" aria-label="Filter equipment category">
            <button class="pill-btn active" type="button" data-filter-btn="all">All gear</button>
            <button class="pill-btn" type="button" data-filter-btn="handheld">Tools (${tools.length})</button>
            <button class="pill-btn" type="button" data-filter-btn="ship">Ship guns (${guns.length})</button>
            <button class="pill-btn" type="button" data-filter-btn="utility">Drones and systems</button>
          </div>
          <input class="search-input" type="search" placeholder="Search Lance, Collapsar, drone..." aria-label="Search tools and weapons" data-filter-search>
        </div>

        <div class="callout yellow">
          <strong>Data sources:</strong> ${escapeHtml(src.note)} Checked ${escapeHtml(src.checked)} against game version ${escapeHtml(src.gameVersion)}.
        </div>

        <h2 style="margin-top: 1.75rem;">1. Handheld tools (all ${tools.length} for Full toolbox)</h2>
        <p class="section-sub">Laser, Plasma Cutter and Missile Swarm cost more in co-op unless the host turns on <em>Separate gear</em>, in which case everyone pays the solo price.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tool</th>
                <th>Solo price</th>
                <th>Crew of 2 / 3+</th>
                <th>Breaks</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${toolRows}
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">2. Ship guns (all ${guns.length})</h2>
        <p class="section-sub">Guns go on sale on Day 15 in Year 1 (Day 1 from Year 2). In The Hard Way, every gun except the Orbital Strike costs 1.5×. DPS = damage × shots per second, computed from the listed stats.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gun</th>
                <th>Price</th>
                <th>Damage</th>
                <th>Radius</th>
                <th>Fire rate</th>
                <th>DPS</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${gunRows}
            </tbody>
          </table>
        </div>

        <h2 style="margin-top: 2rem;">3. Drones and ship systems</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>On sale</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              ${droneRows}
              ${utilRows}
            </tbody>
          </table>
        </div>

        <p class="callout hidden" data-filter-empty>No matching tools or weapons found for your current search filter.</p>
      </div>
    </section>

    <section class="section" id="lance-vs-slicer">
      <div class="container">
        <h2>Lance vs Slicer: which to buy first</h2>
        <div class="grid grid-2">
          <div class="panel">
            <span class="badge badge-yellow">Lance · $1,200,000</span>
            <h3>Bores a tunnel</h3>
            <ul class="clean-list">
              <li>Best for driving straight to the center and the strange-matter heart.</li>
              <li>Charged fire mode; since 1.0.6 it no longer pushes you back.</li>
              <li>Pick it if your goal is <em>Straight to the heart</em> or cracking strange matter quickly.</li>
            </ul>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Slicer · $1,200,000</span>
            <h3>Cuts a flat sheet</h3>
            <ul class="clean-list">
              <li>Clears wide areas; better for raw volume late in a run.</li>
              <li>Since 1.0.6 it cuts three times as often.</li>
              <li>Pick it if you need m³ per minute more than depth.</li>
            </ul>
          </div>
        </div>
        <p class="callout" style="margin-top: 1rem;"><strong>Unlock:</strong> both appear only after you own an Orbital Strike or Collapsar, or after hitting core metal with a mining tool in the current Year. Neither has published damage numbers yet.</p>
      </div>
    </section>

    <section class="section" id="best-ship-guns">
      <div class="container">
        <h2>Best ship guns in No Asteroids</h2>
        <p class="section-sub">Rankings use the listed stats only. Real removal also depends on blast radius and gun upgrades, so treat this as a starting point.</p>
        <div class="grid grid-3">
          <div class="panel">
            <span class="badge badge-safe">Best value early</span>
            <h3>Damage per second per $10k</h3>
            <ol class="clean-list">
              ${byValue.slice(0, 3).map((g) => `<li><strong>${escapeHtml(g.name)}</strong> — ${g.dpsPer10k.toFixed(1)} (${escapeHtml(g.price)})</li>`).join("")}
            </ol>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Highest raw DPS</span>
            <h3>Damage per second</h3>
            <ol class="clean-list">
              ${byDps.slice(0, 3).map((g) => `<li><strong>${escapeHtml(g.name)}</strong> — ${g.dps.toFixed(2)}</li>`).join("")}
            </ol>
          </div>
          <div class="panel">
            <span class="badge badge-impact">Biggest blasts</span>
            <h3>Blast radius</h3>
            <ol class="clean-list">
              ${byRadius.slice(0, 3).map((g) => `<li><strong>${escapeHtml(g.name)}</strong> — ${fmt(g.radius, 1)} m</li>`).join("")}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-2">
          <div>
            <h2>Ship slots (${slots.total})</h2>
            <ul class="clean-list">${slotList}</ul>
            <p class="section-sub">Total for slots 2–${slots.total}: ${escapeHtml(slots.totalCost)}. ${escapeHtml(slots.note)}</p>
          </div>
          <div>
            <h2>Gun upgrades (Engineering)</h2>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Upgrade</th><th>Level 1</th><th>Levels</th><th>Effect</th></tr></thead>
                <tbody>${upgradeRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Charges and workshop gear</h2>
        <p class="section-sub">Using all five charge types earns <a href="/achievements-endings/">Demolition expert</a>. Charge upgrades: Blast radius (10 levels, from $2,000, +15% radius each) and Stock (3 levels, from $4,000). No charge breaks strange matter.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Price</th><th>Per purchase</th><th>Max carried</th><th>On sale</th></tr></thead>
            <tbody>${chargeRows}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Recommended buy order</h2>
        <div class="grid grid-2">
          <div class="panel">
            <span class="badge badge-yellow">Solo</span>
            <ol class="clean-list">
              <li><strong>Sledgehammer ($500) → Drill ($2,000)</strong> in the first days.</li>
              <li>From Day 15: a <strong>Turret</strong> or <strong>Autocannon</strong> plus the <strong>Tractor Beam</strong> so ship-gun ore isn't lost.</li>
              <li><strong>Laser ($42,000)</strong> once basalt blocks your veins; add the Digger and Prospector drones.</li>
              <li><strong>Plasma Cutter</strong>, more ship slots and Firepower / Rate of fire upgrades.</li>
              <li><strong>Missile Swarm</strong> for core metal, then <strong>Orbital Strike</strong> → <strong>Lance or Slicer</strong>.</li>
            </ol>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Co-op</span>
            <ol class="clean-list">
              <li>Decide on <em>Separate gear</em> first—it changes what the Laser, Plasma Cutter and Missile Swarm cost.</li>
              <li>Ship guns and slots are shared value: prioritise them over duplicate tools.</li>
              <li>Send one player for deep Neutronium, Dark Matter and Antimatter while others keep the guns fed.</li>
              <li>Check the <a href="/calculator/">90-day pace calculator</a>—if you're behind, put money into guns and slots.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Tools and guns FAQ</h2>
        <div class="grid grid-2">
          ${faqs.map((f) => `<article class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></article>`).join("\n          ")}
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
