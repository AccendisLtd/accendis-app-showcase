# Deploying Accendis to GreenGeeks (cPanel Node.js / Passenger, Node 22)

The production build targets a standalone Node.js server (Nitro `node-server` preset).
The server bundle in `.output/` is self-contained: no `npm install` is needed on the host.

## 1. Build (on your computer or CI, not on the shared host)

Requires Node 22.12+ (Vite 8). Run outside the Lovable editor:

```sh
npm ci                 # installs exactly what package-lock.json lists (or: bun install --frozen-lockfile)
npm run build          # writes .output/ (preset: node-server)
npm run package:cpanel # assembles cpanel-release/ for upload
```

To regenerate `package-lock.json` from scratch, use npm 11 (`npx npm@11 install`): npm 10.9, bundled with Node 22, crashes with "Cannot read properties of null (reading 'edgesOut')" when resolving this dependency tree without a lockfile. Installing from the existing lockfile works on npm 10.

`package:cpanel` refuses to run if `.output/nitro.json` does not say `node-server`.

## 2. Files to upload

Upload the **contents** of `cpanel-release/` to the application root (e.g. `~/accendis`):

```text
accendis/
  app.cjs          <- Application startup file
  package.json     <- minimal manifest, no dependencies
  .output/
    nitro.json
    public/        <- static assets (served by the Node server)
    server/        <- index.mjs + bundled libraries
```

`.output` is a hidden folder: enable "Show Hidden Files" in cPanel File Manager, or upload a zip and extract it there.
Do not upload `src/`, `node_modules/` or the root `package.json`.

## 3. cPanel > Setup Node.js App > Create Application

| Field | Value |
| --- | --- |
| Node.js version | 22.x |
| Application mode | Production |
| Application root | `accendis` (the folder above) |
| Application URL | your domain or subdomain root (the app expects to be served at `/`) |
| Application startup file | `app.cjs` |

Skip "Run NPM Install". Click **Restart** after every new upload.

## 4. Environment variables

None are required. Optional:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Set to `production` by "Application mode"; `app.cjs` defaults it anyway. |
| `PORT` / `HOST` | Ignored under Passenger (it binds its own socket); only used for `node app.cjs` elsewhere. |

## Passenger compatibility notes

- `app.cjs` is CommonJS because Passenger `require()`s the startup file and the project is `"type": "module"`; it dynamically imports `.output/server/index.mjs`.
- The server calls `http.Server#listen()` once at startup, which Passenger intercepts and rebinds to its socket.
- SSR errors still go through `src/server.ts`, which returns the branded "This page didn't load" page.

## Local smoke test

```sh
npm run build && PORT=3000 npm start   # http://localhost:3000
```
