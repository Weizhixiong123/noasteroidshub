export const SITE_NAME = "No Asteroids Hub";
export const SITE_URL = (process.env.SITE_URL || "https://noasteroidshub.wiki").replace(/\/+$/, "");
export const STEAM_APP_ID = "5527800";
export const STEAM_URL = "https://store.steampowered.com/app/5527800/No_Asteroids/";
export const STEAM_COMMUNITY_URL = "https://steamcommunity.com/app/5527800";
// Privacy-friendly analytics (no cookies). Set one at build time to enable:
//   CF_ANALYTICS_TOKEN=<token from Cloudflare Web Analytics>
//   PLAUSIBLE_DOMAIN=noasteroidshub.wiki
export const ANALYTICS = {
  cloudflareToken: process.env.CF_ANALYTICS_TOKEN || "",
  plausibleDomain: process.env.PLAUSIBLE_DOMAIN || ""
};

export const LAST_UPDATED = "2026-11-27";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/beginner-guide/", label: "Beginner Guide" },
  { href: "/upgrades-weapons/", label: "Tools & Weapons" },
  { href: "/ores-economy/", label: "Ores & Economy" },
  { href: "/achievements-endings/", label: "Achievements" },
  { href: "/calculator/", label: "90-Day Calculator" },
  { href: "/faq-coop/", label: "Co-op & FAQ" }
];
