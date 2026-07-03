# 10K Push-Up Tracker

A mobile-first, offline-capable push-up tracker built with React, TypeScript, and Vite. All workout data stays in the browser—there is no account or server.

## Run locally

1. Install dependencies: `pnpm install`
2. Generate the app icons: `node scripts/generate-icons.mjs`
3. Start development: `pnpm dev`
4. Open the local URL shown in the terminal.

Run `pnpm test` for the test suite. Run `pnpm build` to create a production build in `dist`, then `pnpm preview` to test the installable/offline production version.

## Deploy

### Vercel

Import the repository in Vercel. Use the Vite preset, `pnpm build` as the build command, and `dist` as the output directory. The included `vercel.json` sends app routes to `index.html`.

### Netlify

Import the repository in Netlify. The included `netlify.toml` sets the build command, publish directory, and SPA fallback automatically.

Both platforms provide HTTPS, which is required for service workers and PWA installation outside localhost.

## Install on iPhone

1. Open the deployed HTTPS site in **Safari**.
2. Tap Safari’s **Share** button.
3. Choose **Add to Home Screen**. If it is not visible, scroll the actions list.
4. Confirm the name and tap **Add**.

Launch the tracker from its home-screen icon. After one successful online load, the app shell works offline. Entries are stored only on that device and browser; clearing Safari website data removes them.
