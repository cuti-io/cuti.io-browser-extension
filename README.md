# cuti.io browser extension

This is the code for the cuti.io browser extension. It is a simple extension that allows you to easily access your cuti.io account and manage your tasks.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+

## Build

Install dependencies:

```bash
npm install
```

Build the extension into `dist/`:

```bash
npm run build
```

For development with automatic rebuilds on file changes:

```bash
npm run watch
```

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
