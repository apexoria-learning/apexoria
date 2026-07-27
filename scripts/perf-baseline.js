#!/usr/bin/env node
/**
 * perf-baseline.js
 *
 * Serves the local `build/` folder and runs a Lighthouse mobile audit
 * against it, writing HTML + JSON artifacts to `test_reports/lighthouse/`.
 *
 * Usage:
 *   yarn perf:baseline              # produces baseline-<timestamp>.{json,html}
 *   yarn perf:baseline --label after # produces after-<timestamp>.{json,html}
 *
 * Requires the app to be built first (`yarn build`). The script boots a
 * lightweight static server on a random free port so it can be re-run without
 * port conflicts.
 */

const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

const REPORT_DIR = path.resolve(__dirname, "..", "test_reports", "lighthouse");
const BUILD_DIR = path.resolve(__dirname, "..", "build");

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { label: "baseline" };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--label" && args[i + 1]) {
      out.label = args[i + 1];
      i += 1;
    }
  }
  return out;
}

function mimeFor(ext) {
  switch (ext.toLowerCase()) {
    case ".html": return "text/html; charset=utf-8";
    case ".js":   return "application/javascript; charset=utf-8";
    case ".css":  return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    case ".svg":  return "image/svg+xml";
    case ".png":  return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".avif": return "image/avif";
    case ".ico":  return "image/x-icon";
    case ".woff": return "font/woff";
    case ".woff2": return "font/woff2";
    case ".map":  return "application/json";
    case ".txt":  return "text/plain; charset=utf-8";
    case ".pdf":  return "application/pdf";
    case ".xml":  return "application/xml";
    default:      return "application/octet-stream";
  }
}

function startStaticServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsed = url.parse(req.url);
      let pathname = decodeURIComponent(parsed.pathname || "/");
      // SPA fallback — serve index.html for any non-file route
      let filePath = path.join(rootDir, pathname);
      if (pathname.endsWith("/")) filePath = path.join(filePath, "index.html");
      const resolved = path.resolve(filePath);
      if (!resolved.startsWith(path.resolve(rootDir))) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }
      fs.stat(resolved, (err, stat) => {
        if (err || !stat.isFile()) {
          // SPA fallback
          const indexPath = path.join(rootDir, "index.html");
          fs.readFile(indexPath, (err2, buf) => {
            if (err2) {
              res.statusCode = 404;
              res.end("Not Found");
              return;
            }
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(buf);
          });
          return;
        }
        res.setHeader("Content-Type", mimeFor(path.extname(resolved)));
        res.setHeader("Cache-Control", "no-store");
        fs.createReadStream(resolved).pipe(res);
      });
    });
    server.on("error", reject);
    // Port 0 = OS-assigned free port
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function runLighthouse(targetUrl) {
  // Lighthouse ships as ESM. Import lazily so this script's `require` shell
  // stays CommonJS-friendly for CRA scripts environment.
  const lighthouse = (await import("lighthouse")).default;
  const chromeLauncher = await import("chrome-launcher");

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  try {
    const runnerResult = await lighthouse(targetUrl, {
      port: chrome.port,
      output: ["json", "html"],
      logLevel: "error",
      preset: "desktop",
      // Simulate mobile per Q3 task acceptance criteria
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 1.75,
        disabled: false,
      },
      throttling: {
        // Lighthouse mobile default (Moto G4-ish)
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      onlyCategories: ["performance"],
    });
    return runnerResult;
  } finally {
    await chrome.kill();
  }
}

function summarise(lhr) {
  const audits = lhr.audits || {};
  const pick = (id) => (audits[id] ? audits[id].displayValue || audits[id].numericValue : "n/a");
  const score = lhr.categories && lhr.categories.performance
    ? Math.round((lhr.categories.performance.score || 0) * 100)
    : "n/a";
  return {
    perfScore: score,
    LCP: pick("largest-contentful-paint"),
    FCP: pick("first-contentful-paint"),
    CLS: pick("cumulative-layout-shift"),
    TBT: pick("total-blocking-time"),
    SI:  pick("speed-index"),
    TTI: pick("interactive"),
  };
}

async function main() {
  const { label } = parseArgs();

  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`[perf] No build found at ${BUILD_DIR}. Run \`yarn build\` first.`);
    process.exit(1);
  }
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  console.log("[perf] starting static server for build/ ...");
  const { server, port } = await startStaticServer(BUILD_DIR);
  const targetUrl = `http://127.0.0.1:${port}/`;
  console.log(`[perf] serving ${BUILD_DIR} on ${targetUrl}`);

  let runnerResult;
  try {
    console.log("[perf] running Lighthouse (mobile preset) ...");
    runnerResult = await runLighthouse(targetUrl);
  } finally {
    server.close();
  }

  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const stem = `${label}-${ts}`;
  const [jsonReport, htmlReport] = runnerResult.report;
  fs.writeFileSync(path.join(REPORT_DIR, `${stem}.json`), jsonReport);
  fs.writeFileSync(path.join(REPORT_DIR, `${stem}.html`), htmlReport);

  const summary = summarise(runnerResult.lhr);
  console.log("\n[perf] Lighthouse summary (mobile):");
  console.table(summary);
  console.log(`\n[perf] Artifacts written to test_reports/lighthouse/${stem}.{json,html}`);
}

main().catch((err) => {
  console.error("[perf] failed:", err);
  process.exit(1);
});
