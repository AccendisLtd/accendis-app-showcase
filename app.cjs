// Startup file for GreenGeeks cPanel "Setup Node.js App" (Phusion Passenger), Node 22.
//
// CommonJS on purpose: Passenger's Node loader require()s the startup file, and the
// project's package.json is "type": "module". This file only boots the ESM server
// that `npm run build` writes to .output/server/index.mjs.
//
// Passenger intercepts the first http.Server#listen() call and binds it to its own
// socket, so PORT/HOST are ignored under Passenger. Outside Passenger (e.g.
// `node app.cjs` locally) the server listens on PORT (default 3000).
"use strict";

const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

const entry = path.join(__dirname, ".output", "server", "index.mjs");

if (!fs.existsSync(entry)) {
  console.error(
    `[accendis] Server build not found at ${entry}. Run "npm run build" and upload the .output folder next to app.cjs.`,
  );
  process.exit(1);
}

import(pathToFileURL(entry).href).catch((error) => {
  console.error("[accendis] Failed to start the server:", error);
  process.exit(1);
});
