import { renderLayout, renderBreadcrumbs, breadcrumbSchema, escapeHtml } from "../templates/layout.mjs";
import { STEAM_COMMUNITY_URL } from "../config.mjs";

export function renderFaqCoopPage(gameData, faqList) {
  const title = "No Asteroids Co-op Guide, Save Files, System Specs & FAQ";
  const description =
    "Everything about 8-player online co-op in No Asteroids, Windows & Steam Deck save file locations, PC & Apple Silicon specs, console status, and Drink the Ocean comparison.";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Co-op & FAQ", href: "/faq-coop/" }
  ];

  const schemas = [
    breadcrumbSchema(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqList.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ];

  const winMin = gameData.systemRequirements.windows.minimum;
  const winRec = gameData.systemRequirements.windows.recommended;
  const macMin = gameData.systemRequirements.mac.minimum;
  const macRec = gameData.systemRequirements.mac.recommended;

  const faqHtml = faqList
    .map(
      (f) => `
      <article class="faq-item">
        <h3>${escapeHtml(f.question)}</h3>
        <p>${escapeHtml(f.answer)}</p>
      </article>`
    )
    .join("");

  const content = `
    <section class="page-header">
      <div class="container">
        ${renderBreadcrumbs(crumbs)}
        <h1>No Asteroids co-op guide, save files, system specs, and FAQ</h1>
        <p class="lead">
          Answers to the most-searched technical questions on Steam and Reddit: 8-player co-op wallet permissions,
          save folder paths, demo carryover, Intel Mac limits, cheat codes, and games like <em>Drink the Ocean</em>.
        </p>
        <nav class="toc" aria-label="Jump to section">
          <a href="#coop">8-player co-op</a>
          <a href="#saves">Save file paths</a>
          <a href="#specs">PC and Mac specs</a>
          <a href="#faq">Platforms and FAQ</a>
          <a href="#similar">Games like No Asteroids</a>
        </nav>
      </div>
    </section>

    <section class="section" id="coop">
      <div class="container">
        <h2>8-player online co-op rules and launch patches</h2>
        <div class="grid grid-2">
          <div class="panel">
            <h3>Shared wallet and host controls</h3>
            <ul class="clean-list">
              <li><strong>Host owns the save:</strong> Campaign progress stays on the host's PC across up to 5 campaign slots.</li>
              <li><strong>Shared crew wallet:</strong> Credits from sold ore go into a shared pool managed by host spending permissions.</li>
              <li><strong>Shared vs. personal loadouts:</strong> Hosts can toggle whether gear upgrades apply individually or across the crew.</li>
              <li><strong>Crew communication:</strong> Press <code>T</code> for online text chat and follow teammate outlines visible through rock.</li>
            </ul>
          </div>
          <div class="panel">
            <h3>Multiplayer lag and desync fixes</h3>
            <ul class="clean-list">
              <li><strong>Recent launch patches:</strong> Unruled Games shipped fixes for join transition freezes, invisible teammates, desync, and background Steam Cloud write hitches.</li>
              <li><strong>Lander liftoff blackouts:</strong> Board the lander before your squad launches—getting left behind blacks you out and drops carried ore.</li>
              <li><strong>Voxel frame drops:</strong> Lower shadow and effect settings during late-game Missile Swarm and Collapsar barrages.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="saves">
      <div class="container">
        <h2>Save file locations and demo carryover</h2>
        <p class="section-sub" style="margin-bottom: 1rem;">
          Your free 15-day Steam demo progress carries over automatically to the full version on the same computer. Copy the paths below to back up your 5 campaign slots.
        </p>

        <div class="grid grid-2">
          <div class="panel">
            <h3>Windows (AppData LocalLow)</h3>
            <p>Press <code>Win + R</code>, open <code>%appdata%</code>, go up one folder to <code>LocalLow</code>, and open the Unruled Games / No Asteroids directory:</p>
            <div class="path-box">
              <code id="win-save-path">C:\Users\&lt;YourUsername&gt;\AppData\LocalLow\Unruled Games\No Asteroids</code>
              <button class="btn btn-secondary btn-sm" type="button" data-copy-target="win-save-path">Copy Windows path</button>
            </div>
          </div>

          <div class="panel">
            <h3>Steam Deck and Linux (Proton App ID 5527800)</h3>
            <p>Switch to Desktop Mode and open Dolphin File Manager at the Steam compatdata prefix for App ID <code>5527800</code>:</p>
            <div class="path-box">
              <code id="deck-save-path">/home/deck/.local/share/Steam/steamapps/compatdata/5527800/pfx/drive_c/users/steamuser/AppData/LocalLow/</code>
              <button class="btn btn-secondary btn-sm" type="button" data-copy-target="deck-save-path">Copy Deck path</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="specs">
      <div class="container">
        <h2>PC and macOS system requirements</h2>
        <div class="callout impact">
          <strong>Important Mac warning:</strong> Intel-based Macs are <strong>not supported</strong>. macOS play requires an Apple Silicon (M1 or newer) processor.
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Platform and spec</th>
                <th>Minimum</th>
                <th>Recommended</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Windows OS</strong></td>
                <td>${escapeHtml(winMin.os)}</td>
                <td>${escapeHtml(winRec.os)}</td>
              </tr>
              <tr>
                <td><strong>Windows CPU</strong></td>
                <td>${escapeHtml(winMin.cpu)}</td>
                <td>${escapeHtml(winRec.cpu)}</td>
              </tr>
              <tr>
                <td><strong>Windows RAM</strong></td>
                <td>${escapeHtml(winMin.ram)}</td>
                <td>${escapeHtml(winRec.ram)}</td>
              </tr>
              <tr>
                <td><strong>Windows GPU</strong></td>
                <td>${escapeHtml(winMin.gpu)}</td>
                <td>${escapeHtml(winRec.gpu)}</td>
              </tr>
              <tr>
                <td><strong>DirectX and storage</strong></td>
                <td>${escapeHtml(winMin.directX)}, ${escapeHtml(winMin.storage)}</td>
                <td>${escapeHtml(winRec.directX)}, ${escapeHtml(winRec.storage)}</td>
              </tr>
              <tr>
                <td><strong>macOS (Apple Silicon only)</strong></td>
                <td>${escapeHtml(macMin.os)}, ${escapeHtml(macMin.cpu)}, ${escapeHtml(macMin.ram)}</td>
                <td>${escapeHtml(macRec.os)}, ${escapeHtml(macRec.cpu)}, ${escapeHtml(macRec.ram)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <div class="container">
        <h2>Frequently asked questions</h2>
        <div class="grid grid-2">
          ${faqHtml}
        </div>
      </div>
    </section>

    <section class="section" id="similar">
      <div class="container">
        <h2>Games like No Asteroids (including Drink the Ocean)</h2>
        <p class="section-sub" style="margin-bottom: 1rem;">
          Search trends show players checking <strong>Drink the Ocean</strong> alongside <strong>No Asteroids</strong> because both share the viral
          first-person massive-scale incremental hook. Here is how they compare:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Developer and platform</th>
                <th>Price</th>
                <th>Core premise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>No Asteroids</strong></td>
                <td>Unruled Games on Steam (Win and Apple Silicon Mac)</td>
                <td>${escapeHtml(gameData.meta.price)} (${escapeHtml(gameData.meta.launchDiscountPrice)} launch deal plus free 15-day demo)</td>
                <td>Mine a 5,000,000 m³ asteroid in 90 days solo or 1–8 player co-op using tools and automated ship weapons.</td>
              </tr>
              <tr>
                <td><strong>Drink the Ocean</strong></td>
                <td>Pinidi Studio on free browser and mobile (no official Steam release)</td>
                <td>Free</td>
                <td>First-person incremental comedy sim where you drink the world ocean through a straw, take bathroom breaks, and buy upgrades.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="hero-actions" style="margin-top: 1.25rem; margin-bottom: 0;">
          <a class="btn btn-secondary" href="${escapeHtml(STEAM_COMMUNITY_URL)}" target="_blank" rel="noopener noreferrer">Official Steam discussions</a>
          <a class="btn btn-primary" href="/calculator/">Plan your 90-day run</a>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonicalPath: "/faq-coop/",
    currentPath: "/faq-coop/",
    schemas,
    content
  });
}
