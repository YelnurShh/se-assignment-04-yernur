# Assignment 04 Smart Campus — Shakhar Yernur

- The initial source is commit `628840b6be7bf6a418898ecf634900fbf8d058c0`.
- The final source is on `main`.
- `evidence/` contains the plan, source diff, actual logs and UI screenshots.

## Run

Use Node.js 24 and npm. From the repository root:

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build -- --base ./
```

The baseline suite ran 21/21 and the final suite ran 31/31.

## Browser test

From the repository root, after building:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run test:ui
```

Set `BROWSER_EXECUTABLE` to a local Chrome binary to use it instead of Playwright Chromium. Set `UI_EVIDENCE_DIR` to save screenshots. The recorded run used local Chrome and the bundled Playwright module via `PLAYWRIGHT_MODULE`. It served the production build on an ephemeral loopback port and checked five flows. No account or external API is required.

## Demo

Watson 101 rejects 600–660. Darwin 105 accepts the same interval after a fresh check. With 40 attendees, Display and Whiteboard, only Watson 101 matches. The final source has not been deployed over the Practice 9 site.
