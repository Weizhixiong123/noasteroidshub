/*
  Ad slots.

  Banner units (atOptions + invoke script) share one global variable and load
  synchronously, so each banner size lives in its own tiny same-origin page
  (/ads/<w>x<h>.html) that is embedded with an iframe. That keeps banners from
  overwriting each other's settings and keeps them from blocking page render.
  The iframe src is set by /js/main.js only for the size that fits the screen,
  so no hidden ad is ever loaded.

  Set ADS=off at build time to build without ads (e.g. for local previews).
*/

export const ADS_ENABLED = (globalThis.process?.env?.ADS || "on") !== "off";

const AD_HOST = "https://bauval.org";

const BANNERS = {
  "728x90": "b68d33ca6ac32bff0b96794ea7113f88",
  "320x50": "f5b76e07c9bd3d34a9e6eab8ebe9f3d6",
  "300x250": "5b05ae0b23245af26c307e7a8cd255ac"
};

const NATIVE = {
  script: `${AD_HOST}/21/ae025775493ffb8c334b32b7399c5bb3`,
  container: "container-ae025775493ffb8c334b32b7399c5bb3"
};

/* The standalone documents served at /ads/<size>.html */
export function adFrameDocuments() {
  return Object.entries(BANNERS).map(([size, key]) => {
    const [width, height] = size.split("x").map(Number);
    return {
      file: `ads/${size}.html`,
      html: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Advertisement</title>
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}</style>
</head>
<body>
<script>
  atOptions = {
    'key' : '${key}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
</script>
<script data-cfasync="false" src="${AD_HOST}/22/${key}"></script>
</body>
</html>
`
    };
  });
}

/*
  sizes: "728x90@768,320x50" → 728x90 when the viewport is at least 768px wide,
  otherwise 320x50. The first size that matches wins.
*/
export function renderAdSlot(sizes, className = "") {
  if (!ADS_ENABLED) return "";
  return `
    <div class="ad-slot ${className}">
      <div class="container">
        <div class="ad-box" data-ad-sizes="${sizes}">
          <span class="ad-label">Advertisement</span>
        </div>
      </div>
    </div>`;
}

export function renderNativeAd() {
  if (!ADS_ENABLED) return "";
  return `
    <div class="ad-slot ad-slot--native">
      <div class="container">
        <span class="ad-label">Advertisement</span>
        <script async data-cfasync="false" src="${NATIVE.script}"></script>
        <div id="${NATIVE.container}"></div>
      </div>
    </div>`;
}
