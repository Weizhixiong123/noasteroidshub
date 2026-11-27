import { renderLayout, escapeHtml } from "../templates/layout.mjs";
import { SITE_NAME, SITE_URL, STEAM_URL } from "../config.mjs";

export function renderHomePage(gameData) {
  const { meta } = gameData;
  const title = "No Asteroids Hub — Steam Guide, Wiki, 90-Day Calculator & Database";
  const description =
    "Complete unofficial guide, wiki, and 90-day mining calculator for No Asteroids on Steam ($7.99 / $6.39 launch deal, free 15-day demo, 1–8 player co-op).";

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: meta.title,
      alternateName: ["No Asteroid", "No Asteroid Game"],
      applicationCategory: "Game",
      gamePlatform: ["PC (Windows)", "macOS (Apple Silicon)"],
      operatingSystem: "Windows 10+, macOS 12+ (Apple Silicon)",
      datePublished: "2026-11-24",
      author: {
        "@type": "Organization",
        name: meta.developer
      },
      publisher: {
        "@type": "Organization",
        name: meta.publisher
      },
      offers: {
        "@type": "Offer",
        price: "6.39",
        priceCurrency: "USD",
        url: STEAM_URL
      }
    }
  ];

  const content = `
    <section class="hero-rig">
      <div class="container hero-split">
        <div>
          <h1>No Asteroids guide, database, and 90-day mining calculator</h1>
          <p class="lead">
            The government wasted 90 days arguing over who pays to stop a <strong>5,000,000 m³</strong> rock.
            You took the contract with a pickaxe and a promise that the asteroid will pay for itself.
            Plan your daily clear rate, compare tools and ship cannons, and track Steam achievements.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${escapeHtml(STEAM_URL)}" target="_blank" rel="noopener noreferrer">Get on Steam (${escapeHtml(meta.launchDiscountPrice)} launch deal)</a>
            <a class="btn btn-secondary" href="/beginner-guide/">Try the 15-day demo guide</a>
            <a class="btn btn-secondary" href="/calculator/">Open pace calculator</a>
          </div>
          <div class="quota-strip" aria-label="Contract mission targets">
            <div class="quota-cell">
              <span class="quota-label">Contract excavation target</span>
              <span class="quota-val">5,000,000 m³</span>
            </div>
            <div class="quota-cell impact">
              <span class="quota-label">Impact deadline</span>
              <span class="quota-val">90 days (or No Rush)</span>
            </div>
          </div>
        </div>

        <div class="viewport-frame" data-asteroid-scene data-scene-interactive="true" data-initial-volume="4400000">
          <div class="viewport-bar">
            <strong>Ship hull camera</strong>
            <span>Click the rock to test-mine</span>
          </div>
          <div class="viewport-canvas-wrap">
            <canvas aria-label="Interactive voxel asteroid viewport showing an orbiting mining ship firing turret bolts at a rocky asteroid above Earth"></canvas>
          </div>
          <div class="viewport-footer">
            <strong data-scene-volume>4,400,000 m³ remaining</strong>
            <span data-scene-layer>Regolith and stone (Pickaxe)</span>
            <span data-scene-chipped>Test-mined: 0 m³</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="tender-sheet">
          <div class="tender-head">
            <div>
              <h2>Government tender spec sheet</h2>
              <p class="section-sub">Verified Steam release facts for <em>No Asteroids</em> (also searched as &ldquo;No Asteroid&rdquo; or &ldquo;mine asteroids game&rdquo;).</p>
            </div>
            <span class="tender-stamp">App ID #${escapeHtml(meta.steamAppId)}</span>
          </div>

          <div class="ledger-grid">
            <div class="ledger-cell">
              <span class="ledger-label">Steam price and launch discount</span>
              <span class="ledger-value">${escapeHtml(meta.price)} (${escapeHtml(meta.launchDiscountPrice)} till Dec 8)</span>
            </div>
            <div class="ledger-cell">
              <span class="ledger-label">Free demo carryover</span>
              <span class="ledger-value">First 15 days (same PC)</span>
            </div>
            <div class="ledger-cell">
              <span class="ledger-label">Launch concurrent peak</span>
              <span class="ledger-value">${escapeHtml(meta.peakPlayers)} players (SteamDB)</span>
            </div>
            <div class="ledger-cell">
              <span class="ledger-label">Co-op capacity</span>
              <span class="ledger-value">${escapeHtml(meta.coopSupport)}</span>
            </div>
            <div class="ledger-cell">
              <span class="ledger-label">Supported platforms</span>
              <span class="ledger-value">Win 10+ and Apple Silicon Mac</span>
            </div>
            <div class="ledger-cell">
              <span class="ledger-label">Player reception</span>
              <span class="ledger-value">Very Positive (~90%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2>Quick 90-day pace console</h2>
            <p class="section-sub">Adjust your day or remaining cubic meters—the hull camera above erodes as your cleared percentage climbs.</p>
          </div>
          <a class="btn btn-secondary btn-sm" href="/calculator/">Open full pace planner</a>
        </div>

        <div class="console-panel" data-pace-calc>
          <div class="calc-grid">
            <div>
              <div class="field">
                <label for="home-day">Current in-game day (1 to 90)</label>
                <input id="home-day" type="number" min="1" max="90" value="15" data-input-day>
              </div>
              <div class="field">
                <label for="home-rem">Remaining asteroid volume (m³)</label>
                <input id="home-rem" type="number" min="0" max="5000000" step="10000" value="4400000" data-input-rem-number>
                <input type="range" min="0" max="5000000" step="25000" value="4400000" aria-label="Remaining Volume Slider" data-input-rem-range>
              </div>
              <div class="field">
                <label for="home-crew">Crew size (1 solo to 8 co-op)</label>
                <input id="home-crew" type="number" min="1" max="8" value="1" data-input-crew>
              </div>
            </div>

            <div>
              <div class="stat-boxes">
                <div class="stat-box">
                  <div class="stat-box-label">Asteroid cleared</div>
                  <div class="stat-box-value" data-out-pct>12.0%</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Required daily pace</div>
                  <div class="stat-box-value" data-out-req-daily>57,895 m³/day</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Per-player share</div>
                  <div class="stat-box-value" data-out-per-player>57,895 m³/player</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Days remaining</div>
                  <div class="stat-box-value" data-out-days-left>76 days</div>
                </div>
              </div>

              <div class="progress-wrap">
                <div class="progress-track">
                  <div class="progress-fill" data-progress-fill></div>
                </div>
                <div class="milestone-ticks">
                  <span data-milestone="1">1%</span>
                  <span data-milestone="10">10% Tithe</span>
                  <span data-milestone="50">50% Halfway</span>
                  <span data-milestone="90">90% Stretch</span>
                  <span data-milestone="100">100% Saved</span>
                </div>
              </div>
              <div class="callout" data-out-status></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2>Ship terminal index</h2>
            <p class="section-sub">Six focused sections organized by what players need mid-run.</p>
          </div>
        </div>

        <div class="hub-featured">
          <article class="featured-block">
            <span class="badge badge-yellow">Start here</span>
            <h3>Beginner guide and review verdict</h3>
            <p>Should you spend $6.39? Check our honest verdict, free 15-day demo carryover rules, six early-shift mistakes to avoid, and Day 1–90 pacing.</p>
            <div><a class="btn btn-secondary btn-sm" href="/beginner-guide/">Read beginner guide</a></div>
          </article>

          <article class="featured-block">
            <span class="badge badge-yellow">Interactive tool</span>
            <h3>90-day pace and ore split calculator</h3>
            <p>Forecast your clear day for 1–8 players, watch asteroid layers erode live, and split terminal ore sales so single-mineral payouts don't collapse.</p>
            <div><a class="btn btn-secondary btn-sm" href="/calculator/">Launch pace calculator</a></div>
          </article>
        </div>

        <div class="terminal-index">
          <div class="terminal-row">
            <h3>Tools, drones, and ship weapons</h3>
            <p>All 8 tools (Pickaxe to Lance and Slicer) and 9 ship guns with prices and stats, best ship guns, Lance vs Slicer, and solo vs. co-op buy order.</p>
            <a class="btn btn-secondary btn-sm" href="/upgrades-weapons/">Browse arsenal</a>
          </div>
          <div class="terminal-row">
            <h3>All ores and market decay guide</h3>
            <p>Sell prices for all 11 ores, the new Strange Matter heart, which tool breaks each rock layer, and how to avoid glut price drops.</p>
            <a class="btn btn-secondary btn-sm" href="/ores-economy/">Check ores</a>
          </div>
          <div class="terminal-row">
            <h3>65 achievements and museum finds</h3>
            <p>Browser-saved achievement checklist, all 7 Museum collections, and how to trigger Earth saved, Complaints accepted, and No Rush mode.</p>
            <a class="btn btn-secondary btn-sm" href="/achievements-endings/">Track progress</a>
          </div>
          <div class="terminal-row">
            <h3>Co-op, saves, specs, and FAQ</h3>
            <p>8-player host wallet rules, Windows and Steam Deck save folders, Apple Silicon vs. Intel Mac limits, and how it compares to Drink the Ocean.</p>
            <a class="btn btn-secondary btn-sm" href="/faq-coop/">Open FAQ</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>Four rules for your first mining shift</h2>
        <div class="grid grid-2">
          <div class="panel">
            <h3>Buy the Sledgehammer and Drill first</h3>
            <p>At $500 and $2,000 they are the cheapest speed-up of the whole run, and the Drill opens the deep-stone layer.</p>
          </div>
          <div class="panel">
            <h3>Reserve oxygen for the flight back</h3>
            <p>Blacking out or missing lander liftoff forfeits your backpack haul and voids a clean <em>Wide awake</em> run.</p>
          </div>
          <div class="panel">
            <h3>Mount a roof gun early</h3>
            <p>Your mothership starts unarmed. Early hull turrets shave away surface rock continuously while you dig underground.</p>
          </div>
          <div class="panel">
            <h3>Split ore loads at the terminal</h3>
            <p>Flooding one mineral crashes its local buy price. Mix vein types and complete daily orders for <em>Quota met</em>.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/",
    currentPath: "/",
    schemas,
    scripts: ["/js/asteroid-scene.js", "/js/calculator.js"],
    content
  });
}
