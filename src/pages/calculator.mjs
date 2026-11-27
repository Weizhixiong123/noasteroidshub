import { renderLayout, renderBreadcrumbs, breadcrumbSchema, renderShot } from "../templates/layout.mjs";
import { SITE_URL } from "../config.mjs";

export function renderCalculatorPage() {
  const title = "No Asteroids 90-Day Mining Calculator & Quota Pace Planner";
  const description =
    "Calculate your daily m³ quota out of 5,000,000 m³ across 90 days for solo or 1–8 player co-op in No Asteroids, plus plan ore sale splits to avoid market decay.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "90-Day Calculator", href: "/calculator/" }
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "No Asteroids 90-Day Mining Calculator",
      url: `${SITE_URL}/calculator/`,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    }
  ];

  const content = `
    <section class="page-header">
      <div class="container page-header-split">
        <div>
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids 90-day mining calculator and quota planner</h1>
        <p class="lead">
          Enter your current campaign day, remaining cubic meters (out of <strong>5,000,000 m³</strong>),
          and crew size (<strong>1–8 players</strong>) to calculate required daily output and watch the rock shrink live.
        </p>
        </div>
        ${renderShot("laser-volume-counter", "Laser mining with the remaining asteroid volume counter at the top of the screen", "The counter at the top is what you are racing: the asteroid volume left.", { eager: true })}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="console-panel" data-pace-calc>
          <div class="calc-grid">
            <div>
              <h2>Campaign inputs</h2>
              <div class="field">
                <label for="calc-day">Current in-game day (1 to 90)</label>
                <input id="calc-day" type="number" min="1" max="90" value="25" data-input-day>
              </div>
              <div class="field">
                <label for="calc-rem-num">Remaining asteroid volume (m³)</label>
                <input id="calc-rem-num" type="number" min="0" max="5000000" step="10000" value="3900000" data-input-rem-number>
                <input type="range" min="0" max="5000000" step="25000" value="3900000" aria-label="Remaining Volume Slider" data-input-rem-range>
              </div>
              <div class="field">
                <label for="calc-avg">Current daily clear rate (m³/day, optional)</label>
                <input id="calc-avg" type="number" min="0" step="1000" placeholder="Auto-estimated from days elapsed" data-input-avg>
              </div>
              <div class="field">
                <label for="calc-crew">Crew size (1 solo to 8 co-op)</label>
                <input id="calc-crew" type="number" min="1" max="8" value="2" data-input-crew>
              </div>
            </div>

            <div>
              <h2>Live asteroid and pace readout</h2>
              <div class="viewport-frame" style="margin-bottom: 1rem;" data-asteroid-scene data-scene-interactive="false" data-initial-volume="3900000">
                <div class="viewport-bar">
                  <strong>Live erosion preview</strong>
                  <span data-scene-volume>3,900,000 m³ remaining</span>
                </div>
                <div class="viewport-canvas-wrap" style="height: 195px;">
                  <canvas aria-label="Live asteroid size preview synced with remaining cubic meters"></canvas>
                </div>
                <div class="viewport-footer">
                  <span data-scene-layer>Regolith and stone (Pickaxe)</span>
                </div>
              </div>

              <div class="stat-boxes">
                <div class="stat-box">
                  <div class="stat-box-label">Percent destroyed</div>
                  <div class="stat-box-value" data-out-pct>22.0%</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Volume excavated</div>
                  <div class="stat-box-value" data-out-mined>1,100,000 m³</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Required team pace</div>
                  <div class="stat-box-value" data-out-req-daily>59,091 m³/day</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Required per player</div>
                  <div class="stat-box-value" data-out-per-player>29,545 m³/player</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Days remaining</div>
                  <div class="stat-box-value" data-out-days-left>66 days</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box-label">Linear finish estimate</div>
                  <div class="stat-box-value" data-out-proj-day>Day 110</div>
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
        <h2>Ore sell-split strategy simulator (planning model)</h2>
        <p class="section-sub" style="margin-bottom: 1rem;">
          <strong>Illustrative planning model:</strong> Exact terminal decay curves are checked in-game at the selling console; use this slider to split cargo across multiple mineral veins before returning to the lander.
        </p>

        <div class="console-panel" data-sell-sim>
          <div class="calc-grid">
            <div>
              <div class="field">
                <label for="sim-haul">Total cargo units in haul</label>
                <input id="sim-haul" type="number" min="10" max="5000" step="10" value="180" data-sim-haul>
              </div>
              <div class="field">
                <label for="sim-types">Distinct ore types carried (1 to 8)</label>
                <input id="sim-types" type="range" min="1" max="8" value="3" data-sim-types>
              </div>
            </div>
            <div>
              <div class="stat-box" style="margin-bottom: 0.85rem;">
                <div class="stat-box-label">Target mix per shift</div>
                <div class="stat-box-value" data-sim-split>60 units per ore (3 ore types)</div>
              </div>
              <div class="callout yellow">
                <strong>Recommendation:</strong> <span data-sim-advice></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/calculator/",
    currentPath: "/calculator/",
    schemas,
    scripts: ["/js/asteroid-scene.js", "/js/calculator.js"],
    content
  });
}
