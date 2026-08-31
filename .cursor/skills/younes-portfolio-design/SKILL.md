---
name: younes-portfolio-design
description: >-
  Design system and UI conventions for Younes Basir's Prisma-style portfolio
  (dark cinematic layout, cream palette, framer-motion). Use when styling new
  sections, changing layout, adding components, or adapting motionsites prompts
  into this codebase.
---

# Younes Portfolio Design System

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) with `tailwind.config.js` via `@config`
- framer-motion for all animation
- lucide-react for icons (ArrowRight, Check, etc.)

## Color palette

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#000000` | Page |
| Card dark | `#101010` | About card |
| Card medium | `#212121` | Project cards |
| Primary text | `#E1E0CC` | Headings (inline or class) |
| Tailwind `primary` | `#DEDBC8` | `text-primary`, buttons, accents |
| Body cream | `#DEDBC8` | About paragraph |
| Muted | `text-gray-400`, `text-gray-500` | Secondary copy |
| Nav links | `rgba(225, 224, 204, 0.8)` → `#E1E0CC` on hover | `.nav-link` in `index.css` |

## Typography

Loaded in `index.html`:
- **Almarai** (300, 400, 700, 800) — global default
- **Instrument Serif** (italic) — accent phrases via `font-serif italic`

### Tailwind v4 gotcha

Global font must live in `@layer base`, not a bare `*` rule. Unlayered rules outrank Tailwind utilities and break `.font-serif`:

```css
@layer base {
  * { font-family: "Almarai", ...; }
}
```

## Custom CSS utilities (`index.css`)

- `.noise-overlay` — hero video grain (`baseFrequency 0.85`, 3 octaves), `mix-blend-overlay`
- `.bg-noise` — features section grain (`0.9`, 4 octaves)
- `.nav-link` — nav color + hover

## Shared animation components

| Component | File | Purpose |
| --- | --- | --- |
| `WordsPullUp` | `src/components/WordsPullUp.tsx` | Word stagger pull-up; optional superscript `*` on final "a" |
| `WordsPullUpMultiStyle` | `src/components/WordsPullUpMultiStyle.tsx` | Segments with per-word className |
| Scroll char reveal | `src/components/About.tsx` | `AnimatedLetter` + `useScroll` opacity 0.2→1 |
| Card entrance | `src/components/Features.tsx` | `useInView`, scale 0.95→1, stagger 0.15s |
| Easing constants | `src/lib/motion.ts` | `EASE_SOFT`, `EASE_CARD` |

Default pull-up: `y: 20 → 0`, stagger `0.08s`, ease `[0.16, 1, 0.3, 1]`.

## Section structure

```
Hero      → src/components/Hero.tsx      (h-screen, inset video, pill nav)
About     → src/components/About.tsx     (#about)
Projects  → src/components/Features.tsx  (#projects, 4-col card grid)
App       → src/App.tsx
```

## Adapting motionsites prompts

Prompt collection path (local): `C:\Users\ken\Documents\GitHub\py fpl\motionsites-prompt-collection\prompts\`

When porting a prompt:
1. Read the full prompt file first.
2. Map copy to `YOUNES_BASIR.md` — use skill `younes-portfolio-content`.
3. Keep this repo's stack (TypeScript, framer-motion, Tailwind v4) — do not downgrade to vanilla HTML unless asked.
4. Screenshot at desktop + mobile before calling UI done — use skill `younes-portfolio-verify`.

## Known a11y gaps (fix when touching these areas)

- Decorative `<video>` elements need `prefers-reduced-motion` handling
- About paragraph uses per-character `<span>` — consider `aria-label` on parent
- External links should use `rel="noreferrer"` (already on project cards)
