import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml, renderShot } from "../templates/layout.mjs";

/*
  One page per tool, ship gun and ore. Every page is built from the shared data
  files plus figures computed against the rest of its category (rank, price
  jumps, how much ore a purchase costs), so each page answers questions the hub
  tables can't.
*/

export const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const toolHref = (name) => `/tools/${slugify(name)}/`;
export const gunHref = (name) => `/guns/${slugify(name)}/`;
export const oreHref = (ore) => ore.href || `/ores/${slugify(ore.name)}/`;

const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
const parseMoney = (s) => {
  const m = String(s).replace(/,/g, "").match(/\$(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
};
const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const TOOL_SHOTS = {
  Pickaxe: ["pickaxe-surface-coop", "The pickaxe on the asteroid surface with co-op crewmates nearby", "The pickaxe on Day 1, with crewmates working nearby."],
  Sledgehammer: ["workshop-tools", "The Workshop tool list", "Tools are bought at the Workshop."],
  Drill: ["drill-blast", "Drill in hand while a charge explodes on the surface", "The drill in use while a charge goes off."],
  Laser: ["laser-meteoric-iron-drones", "Laser beam cutting a meteoric iron vein", "The laser cutting meteoric iron on Day 46."],
  "Plasma Cutter": ["plasma-cutter-tunnel", "Plasma cutter boring a tunnel", "The plasma cutter tunnelling toward the core."],
  "Missile Swarm": ["missile-swarm-earth", "Missile Swarm explosions on the surface", "The Missile Swarm tearing into the surface."],
  Lance: ["workshop-tools", "The Workshop tool list", "The Lance appears in the Workshop once unlocked."],
  Slicer: ["workshop-tools", "The Workshop tool list", "The Slicer appears in the Workshop once unlocked."]
};

const TOOL_ACHIEVEMENTS = {
  Sledgehammer: ["heavy-argument"],
  Drill: ["driller"],
  Laser: ["ray-of-hope"],
  "Plasma Cutter": ["fourth-state-of-matter"],
  "Missile Swarm": ["beehive"],
  Lance: ["full-toolbox"],
  Slicer: ["full-toolbox"]
};

const ORE_SHOTS = {
  "Star Gold": ["pickaxe-star-gold", "A pickaxe striking a Star Gold vein", "A Star Gold vein under the pickaxe."],
  "Meteoric Iron": ["laser-meteoric-iron-drones", "Laser cutting a meteoric iron vein", "Mining meteoric iron with the laser."],
  "Space Ice": ["ore-sell-terminal", "Ship terminal listing ore stock and prices", "Space Ice at the sell terminal, top of the list."],
  "Space Crystal": ["ore-sell-terminal", "Ship terminal listing ore stock and prices", "Space Crystal on the sell terminal."],
  Plasmite: ["ore-sell-terminal", "Ship terminal listing ore stock and prices", "Plasmite on the sell terminal."]
};

const ORE_ACHIEVEMENTS = {
  Antimatter: ["boom", "mineralogist"]
};

function achievementList(ids, achievementsData) {
  const all = achievementsData.achievements;
  const items = ids.map((id) => all.find((a) => a.id === id)).filter(Boolean);
  if (!items.length) return "";
  return `
        <h2>Related achievements</h2>
        <ul class="clean-list">
          ${items
            .map(
              (a) =>
                `<li><a href="/achievements-endings/#ach-${escapeHtml(a.id)}"><strong>${escapeHtml(a.name)}</strong></a>: ${escapeHtml(a.description)} <span class="item-muted">(${a.globalPercent.toFixed(1)}% of players)</span></li>`
            )
            .join("\n          ")}
        </ul>`;
}

function patchMentions(names, patchData) {
  const res = names.map((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"));
  const hits = [];
  for (const e of patchData.entries) {
    for (const h of e.highlights) {
      if (res.some((re) => re.test(h))) hits.push({ e, h });
    }
  }
  if (!hits.length) return "";
  const anchor = (e) =>
    e.version ? `v${e.version.replaceAll(".", "-")}` : e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `
        <h2>Changes in recent updates</h2>
        <ul class="clean-list">
          ${hits
            .map(
              ({ e, h }) =>
                `<li><a href="/patch-notes/#${anchor(e)}">${escapeHtml(e.date)}${e.version ? ` · ${escapeHtml(e.version)}` : ""}</a>: ${escapeHtml(h)}</li>`
            )
            .join("\n          ")}
        </ul>`;
}

function faqBlock(faqs) {
  return `
        <h2>FAQ</h2>
        <div class="grid grid-2">
          ${faqs.map((f) => `<article class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></article>`).join("\n          ")}
        </div>`;
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  };
}

function specTable(rows) {
  return `
        <dl class="spec-sheet">
          ${rows
            .map(([k, v]) => `<div class="spec-row"><dt>${escapeHtml(k)}</dt><dd>${v}</dd></div>`)
            .join("\n          ")}
        </dl>`;
}

function itemPage({ title, description, path, crumbs, h1, lead, shot, spec, body, faqs, next, src }) {
  const content = `
    <section class="page-header">
      <div class="container${shot ? " page-header-split" : ""}">
        <div>
          ${renderBreadcrumbs(crumbs)}
          <h1>${escapeHtml(h1)}</h1>
          <p class="lead">${lead}</p>
        </div>
        ${shot ? renderShot(shot[0], shot[1], shot[2], { eager: true }) : ""}
      </div>
    </section>

    <section class="section">
      <div class="container item-layout">
        <aside class="item-spec" aria-label="Key stats">
          ${spec}
        </aside>
        <div class="item-body">
          ${body}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${faqBlock(faqs)}
        <p class="section-sub" style="margin-top: 1rem;">${escapeHtml(src.note)} Checked ${escapeHtml(src.checked)}.</p>
      </div>
    </section>
  `;
  return renderLayout({
    title,
    description,
    canonicalPath: path,
    currentPath: path,
    schemas: [breadcrumbSchema(crumbs), faqSchema(faqs)],
    content,
    next
  });
}

/* ───────── Tools ───────── */
function renderToolPage(tool, i, ctx) {
  const { gameData, achievementsData, patchData } = ctx;
  const tools = gameData.handheldTools;
  const path = toolHref(tool.name);
  const price = parseMoney(tool.price) || 0;
  const prev = tools[i - 1];
  const nextTool = tools[i + 1];
  const prevPrice = prev ? parseMoney(prev.price) : null;
  const coopDiffers = tool.priceCrew2 !== tool.price;
  const layer = gameData.rockLayers.find((l) => tool.breaks.toLowerCase().includes(l.name.toLowerCase()));
  const src = gameData.meta.dataSources;

  const jump =
    prev && prevPrice && price
      ? `${(price / prevPrice).toFixed(price / prevPrice >= 10 ? 0 : 1)}× the price of the ${prev.name}`
      : prev && !prevPrice
        ? `the first tool you pay for after the ${prev.name}`
        : null;

  const lead = `${escapeHtml(tool.name)} is tool ${i + 1} of ${tools.length} in No Asteroids. It costs <strong>${escapeHtml(tool.price)}</strong> solo${
    coopDiffers ? ` (${escapeHtml(tool.priceCrew2)} for two players, ${escapeHtml(tool.priceCrew3)} for three or more)` : ""
  } and breaks <strong>${escapeHtml(tool.breaks.toLowerCase())}</strong>.`;

  const spec = specTable([
    ["Solo price", escapeHtml(tool.price)],
    ["Crew of 2", escapeHtml(tool.priceCrew2)],
    ["Crew of 3+", escapeHtml(tool.priceCrew3)],
    ["Breaks", escapeHtml(tool.breaks)],
    ["Unlock", escapeHtml(tool.unlock)],
    ["Order", `${i + 1} of ${tools.length}`]
  ]);

  const progression = `
        <h2>Where the ${escapeHtml(tool.name)} fits</h2>
        <p>${escapeHtml(tool.notes)}</p>
        <ul class="clean-list">
          ${prev ? `<li>Before it: <a href="${toolHref(prev.name)}">${escapeHtml(prev.name)}</a> (${escapeHtml(prev.price)})${jump ? `—the ${escapeHtml(tool.name)} is ${escapeHtml(jump)}.` : "."}</li>` : "<li>This is the tool every contract starts with.</li>"}
          ${nextTool ? `<li>Next: <a href="${toolHref(nextTool.name)}">${escapeHtml(nextTool.name)}</a> (${escapeHtml(nextTool.price)}), which breaks ${escapeHtml(nextTool.breaks.toLowerCase())}.</li>` : "<li>Nothing comes after it—this is the end of the tool line.</li>"}
          ${layer ? `<li>Rock layer: <strong>${escapeHtml(layer.name)}</strong>, ${escapeHtml(layer.depth.toLowerCase())} (${escapeHtml(layer.breaks.toLowerCase())}).</li>` : ""}
        </ul>
        ${coopDiffers ? `<p class="callout yellow">In co-op this tool costs ${escapeHtml(tool.priceCrew2)} for two players and ${escapeHtml(tool.priceCrew3)} for three or more—unless the host turns on personal gear, in which case it's the solo ${escapeHtml(tool.price)}.</p>` : ""}`;

  const body =
    progression +
    achievementList(TOOL_ACHIEVEMENTS[tool.name] || [], achievementsData) +
    patchMentions([tool.name], patchData);

  const faqs = [
    { q: `How much does the ${tool.name} cost in No Asteroids?`, a: `${tool.price} solo${coopDiffers ? `, ${tool.priceCrew2} for a crew of two and ${tool.priceCrew3} for three or more (solo price with personal gear on)` : " in every mode"}.` },
    { q: `What does the ${tool.name} break?`, a: `${tool.breaks}.${layer ? ` That's the ${layer.name.toLowerCase()} layer, ${layer.depth.toLowerCase()}.` : ""}` },
    {
      q: `How do I unlock the ${tool.name}?`,
      a: tool.unlock === "Starter" ? "You start every contract with it." : tool.unlock === "Workshop" ? `Buy it at the Workshop. It shows its name once your highest balance this Year reaches its price.` : tool.unlock
    }
  ];
  if (nextTool) faqs.push({ q: `What comes after the ${tool.name}?`, a: `The ${nextTool.name} at ${nextTool.price}, which breaks ${nextTool.breaks.toLowerCase()}.` });

  return {
    route: path,
    html: itemPage({
      title: `No Asteroids ${tool.name}: Price, Unlock & What It Breaks`,
      description: `The ${tool.name} in No Asteroids costs ${tool.price} solo and breaks ${tool.breaks.toLowerCase()}. Co-op prices, how to unlock it, what comes next and recent changes.`,
      path,
      crumbs: [
        { name: "Home", href: "/" },
        { name: "Tools & Weapons", href: "/upgrades-weapons/" },
        { name: tool.name, href: path }
      ],
      h1: `No Asteroids ${tool.name}`,
      lead,
      shot: TOOL_SHOTS[tool.name],
      spec,
      body,
      faqs,
      src,
      next: [
        prev ? [toolHref(prev.name), prev.name, `Tool ${i}: ${prev.price}`] : ["/beginner-guide/", "Beginner guide", "Your first shifts with the pickaxe."],
        nextTool ? [toolHref(nextTool.name), nextTool.name, `Tool ${i + 2}: ${nextTool.price}`] : ["/strange-matter/", "Strange Matter", "What the late tools are for."],
        ["/upgrades-weapons/", "All tools and guns", "Prices and stats side by side."]
      ]
    })
  };
}

/* ───────── Ship guns ───────── */
function renderGunPage(gun, i, ctx) {
  const { gameData, patchData, achievementsData } = ctx;
  const guns = gameData.shipWeapons.map((g) => ({ ...g, dps: g.damage * g.shotsPerSecond }));
  const me = guns[i];
  guns.forEach((g) => (g.value = (g.dps / g.priceValue) * 100000));
  const rank = (key) => [...guns].sort((a, b) => b[key] - a[key]).findIndex((g) => g.name === me.name) + 1;
  const dpsRank = rank("dps");
  const valueRank = rank("value");
  const radiusRank = rank("radius");
  const damageRank = rank("damage");
  const path = gunHref(gun.name);
  const prev = guns[i - 1];
  const nextGun = guns[i + 1];
  const hardPrice = gun.name === "Orbital Strike" ? gun.price : money(gun.priceValue * 1.5);
  const breaksStrange = /strange matter/i.test(gun.notes);
  const src = gameData.meta.dataSources;

  const lead = `The ${escapeHtml(gun.name)} costs <strong>${escapeHtml(gun.price)}</strong> and hits for ${me.damage} damage in a ${me.radius} m radius, ${escapeHtml(gun.rate)}. That's ${ordinal(dpsRank)} of ${guns.length} ship guns for damage per second and ${ordinal(radiusRank)} for blast radius.`;

  const spec = specTable([
    ["Price", escapeHtml(gun.price)],
    ["The Hard Way", escapeHtml(hardPrice)],
    ["Damage", String(me.damage)],
    ["Radius", `${me.radius} m`],
    ["Fire rate", escapeHtml(gun.rate)],
    ["DPS", me.dps.toFixed(2)],
    ["DPS per $100k", me.value.toFixed(2)],
    ["Breaks Strange Matter", breaksStrange ? "Yes" : "No"]
  ]);

  const rankRows = [
    ["Damage per shot", damageRank],
    ["Damage per second", dpsRank],
    ["Damage per dollar", valueRank],
    ["Blast radius", radiusRank]
  ]
    .map(
      ([label, r]) =>
        `<tr><td>${label}</td><td><strong>${ordinal(r)}</strong> of ${guns.length}</td><td><span class="rank-bar" style="--w:${Math.round(((guns.length - r + 1) / guns.length) * 100)}%"></span></td></tr>`
    )
    .join("");

  const body = `
        <h2>How the ${escapeHtml(gun.name)} compares</h2>
        <p>${escapeHtml(gun.notes)}</p>
        <div class="table-wrap table-compact">
          <table>
            <thead><tr><th>Ranking</th><th>Place</th><th>Among all ${guns.length} guns</th></tr></thead>
            <tbody>${rankRows}</tbody>
          </table>
        </div>
        <ul class="clean-list" style="margin-top: 1rem;">
          ${prev ? `<li>One step cheaper: <a href="${gunHref(prev.name)}">${escapeHtml(prev.name)}</a> (${escapeHtml(prev.price)}, ${prev.dps.toFixed(2)} DPS).</li>` : "<li>This is the cheapest gun in the shop.</li>"}
          ${nextGun ? `<li>One step up: <a href="${gunHref(nextGun.name)}">${escapeHtml(nextGun.name)}</a> (${escapeHtml(nextGun.price)}, ${nextGun.dps.toFixed(2)} DPS).</li>` : "<li>This is the most expensive gun in the shop.</li>"}
          <li>Guns go on sale on Day 15 in Year 1 and from Day 1 in later Years. In The Hard Way it costs ${escapeHtml(hardPrice)}${gun.name === "Orbital Strike" ? "—the only gun that keeps its normal price" : " (1.5×)"}.</li>
          ${breaksStrange ? `<li>It is one of only two guns that break <a href="/strange-matter/">Strange Matter</a>, and owning it unlocks the <a href="${toolHref("Lance")}">Lance</a> and <a href="${toolHref("Slicer")}">Slicer</a>.</li>` : ""}
        </ul>
        <p class="item-muted">DPS = damage × shots per second, from the listed stats. Gun upgrades (Caliber, Firepower, Rate of fire) raise these numbers for every gun.</p>` +
    achievementList(["gun-on-the-roof", "armed-to-the-teeth"], achievementsData) +
    patchMentions([gun.name], patchData);

  const faqs = [
    { q: `How much does the ${gun.name} cost?`, a: `${gun.price}, or ${hardPrice} in The Hard Way. Guns go on sale from Day 15 in Year 1.` },
    { q: `Is the ${gun.name} worth it?`, a: `It ranks ${ordinal(valueRank)} of ${guns.length} for damage per dollar and ${ordinal(dpsRank)} for raw damage per second${radiusRank <= 3 ? `, with one of the three largest blast radii (${me.radius} m)` : ""}. ${breaksStrange ? "You buy it for Strange Matter and to unlock the Lance and Slicer, not for value." : valueRank <= 3 ? "That makes it a strong value pick." : dpsRank <= 3 ? "Buy it for output rather than value." : "It's a mid-game stepping stone rather than a long-term pick."}` },
    { q: `Does the ${gun.name} break Strange Matter?`, a: breaksStrange ? "Yes. Only the Orbital Strike and Collapsar break it among ship guns." : "No. Only the Orbital Strike and Collapsar break Strange Matter among ship guns." }
  ];

  return {
    route: path,
    html: itemPage({
      title: `No Asteroids ${gun.name}: Price, Damage, Radius & DPS`,
      description: `The ${gun.name} ship gun in No Asteroids: ${gun.price}, ${me.damage} damage, ${me.radius} m radius, ${gun.rate}. Ranked ${ordinal(dpsRank)} of ${guns.length} for DPS, with Hard Way price and recent changes.`,
      path,
      crumbs: [
        { name: "Home", href: "/" },
        { name: "Tools & Weapons", href: "/upgrades-weapons/#best-ship-guns" },
        { name: gun.name, href: path }
      ],
      h1: `No Asteroids ${gun.name}`,
      lead,
      shot: ["ship-gun-slots", "The ship gun screen with numbered hull slots and a grid of all nine guns", "The ship gun screen, where every gun is bought and slotted."],
      spec,
      body,
      faqs,
      src,
      next: [
        prev ? [gunHref(prev.name), prev.name, `${prev.price} · ${prev.dps.toFixed(2)} DPS`] : ["/upgrades-weapons/#best-ship-guns", "Best ship guns", "Rankings for all nine."],
        nextGun ? [gunHref(nextGun.name), nextGun.name, `${nextGun.price} · ${nextGun.dps.toFixed(2)} DPS`] : ["/strange-matter/", "Strange Matter", "What the biggest guns are for."],
        ["/calculator/", "Pace calculator", "See if your guns are keeping up."]
      ]
    })
  };
}

/* ───────── Ores ───────── */
function renderOrePage(ore, ctx) {
  const { gameData, achievementsData, patchData } = ctx;
  const priced = gameData.ores.filter((o) => parseMoney(o.usualPrice) !== null);
  const sorted = [...priced].sort((a, b) => parseMoney(b.usualPrice) - parseMoney(a.usualPrice));
  const price = parseMoney(ore.usualPrice);
  const rank = sorted.findIndex((o) => o.name === ore.name) + 1;
  const idx = gameData.ores.findIndex((o) => o.name === ore.name);
  const cheaper = sorted[rank] || null;
  const pricier = sorted[rank - 2] || null;
  const path = oreHref(ore);
  const src = gameData.meta.dataSources;
  const tools = gameData.handheldTools;
  const guns = gameData.shipWeapons;
  const goals = [
    ["Drill", parseMoney(tools.find((t) => t.name === "Drill").price), toolHref("Drill")],
    ["Laser", parseMoney(tools.find((t) => t.name === "Laser").price), toolHref("Laser")],
    ["Plasma Cutter", parseMoney(tools.find((t) => t.name === "Plasma Cutter").price), toolHref("Plasma Cutter")],
    ["Orbital Strike", guns.find((g) => g.name === "Orbital Strike").priceValue, gunHref("Orbital Strike")]
  ];
  const anyTool = ore.breaks === "Any tool";

  const lead = `${escapeHtml(ore.name)} usually sells for <strong>${escapeHtml(ore.usualPrice)}</strong> per unit (typically ${escapeHtml(ore.priceRange)}), ${rank === 1 ? "the most valuable" : rank === sorted.length ? "the least valuable" : `the ${ordinal(rank)} most valuable`} of ${sorted.length} ores with a known price. ${
    anyTool ? "Any tool can break it." : `You need ${escapeHtml(ore.breaks.toLowerCase())} to break it.`
  }`;

  const spec = specTable([
    ["Usual price", escapeHtml(ore.usualPrice)],
    ["Typical range", escapeHtml(ore.priceRange)],
    ["Value rank", `${ordinal(rank)} of ${sorted.length}`],
    ["Breaks with", escapeHtml(ore.breaks)]
  ]);

  const goalRows = goals
    .map(
      ([name, cost, href]) =>
        `<tr><td><a href="${href}">${escapeHtml(name)}</a></td><td>${money(cost)}</td><td><strong>${Math.ceil(cost / price).toLocaleString("en-US")}</strong> units</td></tr>`
    )
    .join("");

  const body = `
        <h2>What ${escapeHtml(ore.name)} pays for</h2>
        <p>At the usual price, this is how much ${escapeHtml(ore.name)} you would need to sell on its own to afford each upgrade. Selling one ore in bulk lowers its price (glut), so real numbers run higher—mix ores when you sell.</p>
        <div class="table-wrap table-compact">
          <table>
            <thead><tr><th>Upgrade</th><th>Solo price</th><th>${escapeHtml(ore.name)} needed</th></tr></thead>
            <tbody>${goalRows}</tbody>
          </table>
        </div>
        <h2>Compared with other ores</h2>
        <ul class="clean-list">
          ${pricier ? `<li>Next more valuable: <a href="${oreHref(pricier)}">${escapeHtml(pricier.name)}</a> at ${escapeHtml(pricier.usualPrice)} (${(parseMoney(pricier.usualPrice) / price).toFixed(1)}× as much).</li>` : `<li>It's the most valuable ore with a confirmed price; only <a href="/strange-matter/">Strange Matter</a> is reported to be worth more.</li>`}
          ${cheaper ? `<li>Next less valuable: <a href="${oreHref(cheaper)}">${escapeHtml(cheaper.name)}</a> at ${escapeHtml(cheaper.usualPrice)}.</li>` : "<li>It's the cheapest ore in the game—good for early cash, not much else.</li>"}
          ${ore.notes ? `<li>${escapeHtml(ore.notes)}</li>` : ""}
          ${!anyTool ? `<li>Breaking it needs late tools—see the <a href="/ores-economy/">rock layer guide</a> for which tool reaches which depth.</li>` : ""}
        </ul>` +
    achievementList(ORE_ACHIEVEMENTS[ore.name] || ["mineralogist"], achievementsData) +
    patchMentions([ore.name], patchData);

  const faqs = [
    { q: `How much is ${ore.name} worth in No Asteroids?`, a: `Usually ${ore.usualPrice} per unit, with a typical range of ${ore.priceRange}. The price drops if you flood the market and recovers overnight.` },
    { q: `What tool do I need for ${ore.name}?`, a: anyTool ? "Any tool, including the starting pickaxe." : `${ore.breaks}.` },
    { q: `How much ${ore.name} do I need to buy the Laser?`, a: `About ${Math.ceil(goals[1][1] / price).toLocaleString("en-US")} units at the usual ${ore.usualPrice}, before any glut price drop.` }
  ];

  const prevOre = gameData.ores[idx - 1];
  const nextOre = gameData.ores[idx + 1];

  return {
    route: path,
    html: itemPage({
      title: `No Asteroids ${ore.name}: Sell Price & How to Mine It`,
      description: `${ore.name} in No Asteroids sells for ${ore.usualPrice} (range ${ore.priceRange}), ${rank === 1 ? "the most valuable" : rank === sorted.length ? "the least valuable" : `the ${ordinal(rank)} most valuable`} ore. What breaks it, how much you need for the Laser or Orbital Strike, and recent price changes.`,
      path,
      crumbs: [
        { name: "Home", href: "/" },
        { name: "Ores & Economy", href: "/ores-economy/" },
        { name: ore.name, href: path }
      ],
      h1: `No Asteroids ${ore.name}`,
      lead,
      shot: ORE_SHOTS[ore.name],
      spec,
      body,
      faqs,
      src,
      next: [
        prevOre ? [oreHref(prevOre), prevOre.name, `Usually ${prevOre.usualPrice}`] : ["/ores-economy/", "All ores", "Every price in one table."],
        nextOre ? [oreHref(nextOre), nextOre.name, nextOre.href ? "The new asteroid heart" : `Usually ${nextOre.usualPrice}`] : ["/ores-economy/", "All ores", "Every price in one table."],
        ["/ores-economy/", "All ores and rock layers", "Which tool reaches which depth."]
      ]
    })
  };
}

export function itemRoutes(gameData, achievementsData, patchData) {
  const ctx = { gameData, achievementsData, patchData };
  return [
    ...gameData.handheldTools.map((t, i) => renderToolPage(t, i, ctx)),
    ...gameData.shipWeapons.map((g, i) => renderGunPage(g, i, ctx)),
    ...gameData.ores.filter((o) => !o.href).map((o) => renderOrePage(o, ctx))
  ];
}

/* Paths only, for verify.mjs */
export function itemPaths(gameData) {
  return [
    ...gameData.handheldTools.map((t) => toolHref(t.name)),
    ...gameData.shipWeapons.map((g) => gunHref(g.name)),
    ...gameData.ores.filter((o) => !o.href).map((o) => oreHref(o))
  ];
}
