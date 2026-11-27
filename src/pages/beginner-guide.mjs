import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml, renderShot } from "../templates/layout.mjs";
import { STEAM_URL } from "../config.mjs";

export function renderBeginnerGuidePage(gameData) {
  const title = "No Asteroids Beginner Guide, Tips & Is It Worth It? (2026)";
  const description =
    "New to No Asteroids on Steam? Read our buyer verdict, free 15-day demo carryover details, 6 critical early-game rules, and Day 1–90 campaign pacing.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Beginner Guide", href: "/beginner-guide/" }
  ];

  const schemas = [breadcrumbSchema(crumbs)];

  const content = `
    <section class="page-header">
      <div class="container page-header-split">
        <div>
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids beginner guide, tips, and buyer verdict</h1>
        <p class="lead">
          If you spotted <em>No Asteroids</em> (often searched as &ldquo;No Asteroid&rdquo;) on Steam, Reddit, or YouTube and want to know
          whether it is worth ${escapeHtml(gameData.meta.launchDiscountPrice)}—and how to survive your first 15 days—start here.
        </p>
        </div>
        ${renderShot("pickaxe-surface-coop", "First-person view of a pickaxe on the asteroid surface with two co-op miners nearby", "Starting out: the pickaxe on the surface, with co-op crewmates nearby.", { eager: true })}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Is No Asteroids worth buying?</h2>
        <div class="grid grid-2">
          <div class="panel">
            <span class="badge badge-safe">Reasons to buy (~90% Positive)</span>
            <ul class="clean-list">
              <li><strong>Escalating destruction:</strong> Starts with a single pickaxe in tight shafts and scales into automated turrets, orbital strikes, and a black-hole Collapsar cannon.</li>
              <li><strong>True voxel carving:</strong> Dig directly into the 5,000,000 m³ rock while your ship chews the exterior in real time.</li>
              <li><strong>Budget 8-player co-op:</strong> ${escapeHtml(gameData.meta.launchDiscountPrice)} launch price (normally ${escapeHtml(gameData.meta.price)}) plus an optional relaxed <strong>No Rush</strong> mode without the 90-day deadline.</li>
            </ul>
          </div>
          <div class="panel">
            <span class="badge badge-yellow">Know before buying</span>
            <ul class="clean-list">
              <li><strong>Cramped opening shifts:</strong> Days 1–5 feel deliberately slow until you upgrade suit oxygen, cargo capacity, and mount your first roof turret.</li>
              <li><strong>Finite campaign structure:</strong> Once the asteroid hits 0 m³, replayability comes from achievements, Museum sets, and faster co-op runs.</li>
              <li><strong>Free 15-day demo first:</strong> Download the free Steam demo before paying; your save carries straight into the full game on the same PC.</li>
            </ul>
          </div>
        </div>
        <div class="hero-actions" style="margin-top: 1.25rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="${escapeHtml(STEAM_URL)}" target="_blank" rel="noopener noreferrer">Try free demo or buy on Steam</a>
          <a class="btn btn-secondary" href="/faq-coop/">Check PC and Apple Silicon specs</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>How a single mining shift works</h2>
        <div class="grid grid-3">
          <div class="panel">
            <h3>1. Prep on the ship</h3>
            <p>Check the selling terminal's Order of the Day, buy unlocked gear or hull turrets, and grab coffee at the ship station for the <em>Coffee break</em> achievement.</p>
          </div>
          <div class="panel">
            <h3>2. Drop and dig the surface</h3>
            <p>Ride the lander down and work the surface first: every ore up to Plasmite breaks with any tool, so sell early and put the first $500 into the Sledgehammer.</p>
          </div>
          <div class="panel">
            <h3>3. Extract before oxygen runs out</h3>
            <p>Fly back to the lander with spare air, return to orbit, sell mixed ore loads to avoid price decay, and reinvest credits before the next day.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Six early-game mistakes to avoid</h2>
        <div class="grid grid-2">
          <div class="panel">
            <h3>Upgrade oxygen and cargo before cosmetics</h3>
            <p>Short air timers and tiny backpacks double your transit time. Suit tanks and cargo upgrades pay back every future shift.</p>
          </div>
          <div class="panel">
            <h3>Leave your ship unarmed too long</h3>
            <p>Your mothership starts with zero guns. Mount a basic turret early so automated fire strips rock while you tunnel inside.</p>
          </div>
          <div class="panel">
            <h3>Dump 100% of one mineral</h3>
            <p>Flooding the trade terminal with a single ore drops its payout rate. Check the total haul payout and mix at least 2–3 mineral veins.</p>
          </div>
          <div class="panel">
            <h3>Miss the lander in co-op</h3>
            <p>If your crew launches or your air hits zero outside the lander, you black out and drop all carried cargo.</p>
          </div>
          <div class="panel">
            <h3>Delay buying the Jetpack</h3>
            <p>Deep vertical tunnels become slow climbs without thrust. Grabbing the Jetpack (<em>Rocketeer</em>) saves runs once shafts go deep.</p>
          </div>
          <div class="panel">
            <h3>Ignore non-ore relics</h3>
            <p>Embedded artifacts like orbital tapes, office chairs, and fossils fill your ship's Museum dome and unlock seven collection achievements.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>90-day campaign pacing roadmap</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Days</th>
                <th>Primary goal</th>
                <th>Priority purchases</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Phase 1: Demo and foundation</strong></td>
                <td>Days 1–15</td>
                <td>Learn the oxygen round trip, avoid blackouts, harvest Space Ice and Meteoric Iron</td>
                <td>Sledgehammer then Drill, Oxygen and Cargo tanks, first Ship Turret, Jetpack</td>
              </tr>
              <tr>
                <td><strong>Phase 2: Automation ramp</strong></td>
                <td>Days 16–50</td>
                <td>Pass 50% (<em>Halfway there</em>), dig toward Star Gold, Space Crystal, and Plasmite</td>
                <td>Laser then Plasma Cutter, Railgun or Rockets, Digger and Prospector drones</td>
              </tr>
              <tr>
                <td><strong>Phase 3: Core and cleanup</strong></td>
                <td>Days 51–90</td>
                <td>Reach asteroid center, finish Museum finds, hit 0 m³ (<em>Earth saved</em>)</td>
                <td>Missile Swarm for core metal, Orbital Strike, Lance or Slicer, Collapsar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="hero-actions" style="margin-top: 1.25rem; margin-bottom: 0;">
          <a class="btn btn-primary" href="/upgrades-weapons/">See full tools and ship weapons</a>
          <a class="btn btn-secondary" href="/ores-economy/">View all 11 ores and prices</a>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/beginner-guide/",
    currentPath: "/beginner-guide/",
    schemas,
    content
  });
}
