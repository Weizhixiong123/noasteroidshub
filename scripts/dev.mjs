import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist");
const PORT = Number(process.env.PORT || 4173);
const HOST = "127.0.0.1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

async function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = path.normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  let target = path.join(DIST_DIR, safePath);

  if (!target.startsWith(DIST_DIR)) {
    return null;
  }

  try {
    const st = await stat(target);
    if (st.isDirectory()) {
      target = path.join(target, "index.html");
      await stat(target);
    }
    return target;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const reqPath = req.url || "/";
  const resolved = await resolveFile(reqPath);

  if (resolved) {
    const ext = path.extname(resolved).toLowerCase();
    const mime = MIME_TYPES[ext] || "application/octet-stream";
    const body = await readFile(resolved);
    res.writeHead(200, { "Content-Type": mime });
    res.end(body);
    return;
  }

  try {
    const notFound = await readFile(path.join(DIST_DIR, "404.html"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(notFound);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`No Asteroids Hub preview server running at http://${HOST}:${PORT}`);
});
