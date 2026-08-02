# cuti.io browser extension

A browser extension that shortens the URL of the current tab using the cuti.io API.

## Build environment

- **OS:** Any (macOS, Linux, Windows)
- **Node.js:** 20 or higher (developed with v24.13.1)
- **npm:** bundled with Node.js (developed with v11.8.0)

All other dependencies (including esbuild ^0.25.0) are installed via npm and listed in `package.json`.

## Build instructions

1. Install dependencies:

```bash
npm install
```

2. Build the extension into `dist/`:

```bash
npm run build
```

The `dist/` folder contains the complete, ready-to-load extension. The build copies everything from `public/` (HTML, CSS, icons, manifest) and bundles `src/popup.ts` → `dist/popup.js` and `src/options.ts` → `dist/options.js` using esbuild.

## Source structure

- `src/` — TypeScript source files
- `public/` — static files copied as-is to `dist/` (manifest, HTML, CSS, icons)
- `scripts/build.mjs` — build script

## Loading in the browser

**Chrome / Chromium:**

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

**Firefox:**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** and select any file inside `dist/`

## Tests

```bash
npm test
```
