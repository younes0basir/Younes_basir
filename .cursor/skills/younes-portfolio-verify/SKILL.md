---
name: younes-portfolio-verify
description: >-
  Verify UI changes on Younes Basir's portfolio in a real browser before
  finishing. Use after hero/about/projects layout or styling changes, when the
  user says something looks wrong, or before declaring a UI task complete.
---

# Younes Portfolio UI Verification

Do not ship UI changes based on code review alone. Run the app and capture evidence.

## Quick checklist

```
- [ ] npm run build passes (tsc + vite)
- [ ] Dev server loads with zero console errors
- [ ] Hero: name, nav links, CTA visible at 1440px and 390px
- [ ] About: serif italic accent renders as Instrument Serif (not Almarai)
- [ ] Projects: 4 cards, live links open correct URLs
- [ ] Screenshot saved for desktop + mobile
```

## Commands

```bash
npm run dev
npm run build
npm run typecheck   # tsc -b
npx oxlint src
```

## Browser verification workflow

1. Start dev server: `npm run dev` (note the port).
2. Open at **1440×900** (desktop) and **390×844** (mobile).
3. Scroll through all three sections: Hero → `#about` → `#projects`.
4. On desktop, confirm computed styles for serif accent:
   - `font-family` contains `"Instrument Serif"`
   - Nav link color is `rgba(225, 224, 204, 0.8)`
5. Check console for errors; check both background videos load.
6. Save screenshots to a temp folder; delete one-off scripts after verification.

## Regression signals from past bugs

| Symptom | Likely cause |
| --- | --- |
| Italic accent looks like Almarai, not serif | Global `*` font rule outside `@layer base` |
| 3D text layers paint wrong order | `filter` on a `preserve-3d` parent flattens stacking |
| Tailwind `text-primary` missing in build | `tailwind.config.js` not loaded — check `@config` in `index.css` |
| Hero text overlaps portrait/cards | Absolute positioning without dedicated layout band |

## When to run React Doctor

After meaningful React/UI changes:

```bash
npx react-doctor@latest --verbose --scope changed
```

For a focused design audit:

```bash
npx react-doctor@latest design --verbose
```

Fix errors before warnings. Do not commit if the score regressed.

## Playwright probe (optional)

Only if Playwright is already available in the environment. Do not add it as a dependency unless the user asks.

Minimal pattern — adapt port and selectors:

```javascript
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "verify-desktop.png" });
await browser.close();
```

For full browser-harness guidance, follow Cursor's built-in **control-ui** skill.
