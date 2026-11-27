import { renderLayout } from "../templates/layout.mjs";

export function renderNotFoundPage() {
  return renderLayout({
    title: "404 — Signal Lost | No Asteroids Hub",
    description: "The requested sector could not be found on No Asteroids Hub.",
    canonicalPath: "/404.html",
    currentPath: "",
    noindex: true,
    content: `
      <section class="page-header">
        <div class="container">
          <h1>Signal lost: sector not found (404)</h1>
          <p class="lead">
            The page or guide sector you requested does not exist or moved. Jump back to the main rig or open the pace calculator below.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/">Return to home hub</a>
            <a class="btn btn-secondary" href="/calculator/">Open 90-day calculator</a>
            <a class="btn btn-secondary" href="/achievements-endings/">Achievements tracker</a>
          </div>
        </div>
      </section>
    `
  });
}
