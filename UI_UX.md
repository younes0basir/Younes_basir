# Portfolio UI / UX

Description of the current public experience for **Younes Basir** — a dark, cinematic single-page portfolio for a third-year software engineering student seeking a data internship.

Copy and project facts live in `YOUNES_BASIR.md`. This file is the visual and interaction counterpart.

## Product intent

The site is a recruiter-first landing page, not a studio or agency showcase. The journey is:

1. Land on a full-viewport hero and immediately read name, availability, and two CTAs.
2. Scan skills, then a structured About card (portrait, timeline, stats).
3. Inspect shipped work in a focused project showcase.
4. Flip through event photos in Gallery.
5. Contact via email, GitHub, or LinkedIn.

A hidden `/admin` route exists for CMS editing. It is not part of the public story — only a quiet footer link.

## Visual language

Cinematic dark UI: black canvas, cream type, large serif accents, grain, and restrained motion. The page feels like a film still, not a dashboard.

### Color

| Token | Value | Role |
| --- | --- | --- |
| Page | `#000000` | Full-bleed background |
| Card dark | `#101010` | About, Contact, flipped card backs |
| Card medium | `#212121` | Skeletons, reduced-motion card shells |
| Primary cream | `#DEDBC8` | Tailwind `primary` — buttons, labels, accents |
| Heading cream | `#E1E0CC` | Display type, nav |
| Body cream | `#DEDBC8` | About paragraph |
| Muted | `gray-400` / `gray-500` | Secondary copy, captions |
| Live / open | Emerald `400` | Internship pulse, Live badges |
| Selection | Cream on black | `::selection` |

Borders are thin white at 5–15% opacity. Primary CTAs invert: cream fill, black text. Secondary actions are ghost pills (`border-white/10`).

### Typography

Loaded in `index.html`:

- **Almarai** (300–800) — global UI and body
- **Instrument Serif** italic — accent phrases (“Basir”, “an aspiring data analyst.”, “Let’s talk.”, project titles)

Display type is tight (`leading-[0.85–0.95]`) with negative tracking on the hero first name. Section labels are 10–12px, uppercase, letter-spaced (~0.16–0.2em). Body sits at 14–18px with relaxed leading.

### Texture and chrome

- **Hero video** + fractal noise overlay (`mix-blend-overlay`) + 72px cream grid
- Pointer-follow radial glow (`--mx` / `--my`) and two drifting cream orbs
- Features / Gallery use a lighter noise wash at 15% opacity
- Custom scrollbar: black track, `#212121` thumb
- Cards use 1.5–2rem radii; hero frame is `rounded-2xl` (mobile) / `rounded-[2rem]` (desktop)

### Shape language

Pills for nav, CTAs, chips, and badges. Large rounded rectangles for section cards and the project stage. No sharp marketing boxes.

## Information architecture

```
/                 Home (single scroll)
/admin            CMS (login → Projects / Gallery tabs)

#top              Hero
#about            About
#projects         Selected work
#gallery          Events
#contact          Contact
```

**Nav items:** About · Projects · Gallery · GitHub · LinkedIn · Contact

In-page anchors use smooth scroll with `scroll-padding-top: 5rem` so the sticky header does not cover headings. External links open in a new tab with `rel="noreferrer"`.

## Page flow

`HomePage` stacks: Header → Hero → Skills marquee → About → Projects → Gallery → Contact → Footer.

### Header and navigation

Two nav surfaces, never both fully visible at once.

**Hero nav (desktop only)**  
A black pill hangs from the top center of the hero frame. It is the first-screen navigation.

**Sticky header**  
Hidden until the user scrolls past ~55% of the viewport. Then it fades in: name (left), same links (center/right), 2px cream scroll-progress bar at the very top. Active section is underlined via `aria-current` and `.nav-underline`.

**Mobile**  
Hero nav is hidden. A “Menu” pill is always available. It opens a full-screen dialog from the bottom with large type, focus trap, Escape to close, and body scroll lock. Skip link (“Skip to content”) targets `#about`.

### Hero

Full small-viewport height, inset padded frame (not edge-to-edge). Layers: looping muted video → grain → grid → bottom fade → optional pointer glow.

**Left / bottom:** oversized “Younes” (word pull-up + superscript asterisk) and italic “Basir”.

**Right / bottom:** availability pulse (“Open to data internships”), short bio, two magnetic CTAs:

- **View my work** → `#projects` (filled)
- **Get in touch** → `#contact` (outline)

On small screens the bio/CTA block sits on a frosted black panel so type stays readable over the video.

If `prefers-reduced-motion` is on, the video and orbs are replaced by a static radial gradient.

### Skills marquee

A thin strip between Hero and About. Uppercase skill names separated by cream asterisks loop left. Hover pauses the track. Edge fades keep the loop from hard-cutting. Reduced motion disables the animation.

### About (`#about`)

A dark card (`#101010`) inside the black page, max-width `6xl`.

**Desktop:** two-column grid. Copy and skills on the left; sticky portrait + vertical timeline on the right.

**Mobile:** heading and focus chips first, then portrait/timeline, then body.

Contents:

- Eyebrow “About”
- Pull-up heading: roman + italic serif line
- Focus chips: Frontend · Backend · Data
- Portrait with soft cream glow (`mix-blend-mode: lighten`)
- Timeline: Now / Year 3 / Built
- Scroll-reveal body (per-character opacity; parent has `aria-label` for the full sentence)
- “Currently mastering” list with cream left rules
- Three skill-group cards (Frontend / Backend / Data) that brighten their border on hover
- Stat row: 3 live projects · 5+ data courses · 3.5+ GPA

### Projects (`#projects`)

Not a card grid. One featured project at a time, plus a browse rail.

**Stage (left, ~8/12):** 16:10 media, category + Live/Soon badges, optional Prev/Next and thumbnail strip when a project has multiple images. Swipe horizontally to change image (or project if there is only one image). Keyboard: Left / Right when the showcase is focused.

**Rail (right, ~4/12):** “Browse projects” with Play/Pause for a 7s autoplay. Desktop: vertical list. Mobile: horizontal snap scroller. Active tab gets a cream border and a linear progress bar along the bottom.

**Details (full width below):** italic title, description, up to three bullets, stack chips, **View live** / **Coming soon**, optional **Source**.

States:

- Loading: pulse skeletons
- Appwrite error: amber note, cached data still shown
- Empty: “No projects yet.”
- Hover or focus on the showcase pauses autoplay

### Gallery (`#gallery`)

1 / 2 / 3 column grid of 3D flip cards.

- **Front:** photo (or carousel), event-type badge, title, “Hover or tap to flip”
- **Back:** event type, italic title, description, date + location

Desktop with a fine pointer: hover flips. Touch / coarse pointer: tap toggles. Cards are keyboard-activable (`Enter` / `Space`, `aria-pressed`). Hover also lifts the card slightly.

Reduced motion skips the flip: front image on top, details stacked below.

Empty state is a dashed `#101010` panel pointing to the admin space. Loading uses three pulse tiles.

### Contact (`#contact`)

Same card treatment as About. Large question + italic “Let’s talk.” Promise of a reply within 24 hours.

Actions: clickable email, Copy (toast “Email copied to clipboard”; falls back to `mailto:` if clipboard fails), **Email me**, GitHub, LinkedIn. Primary button is magnetic.

### Footer

Copyright, discreet Admin link, Back to top (`#top`). Quiet gray type on black — not a second nav.

## Interaction patterns

| Pattern | Where | Behavior |
| --- | --- | --- |
| Magnetic CTA | Hero, Projects, Contact | Button follows the cursor with a spring, then returns |
| Word pull-up | Headings | Words rise 20px and fade in, 0.08s stagger, ease `[0.16, 1, 0.3, 1]` |
| Scroll letter reveal | About body | Characters brighten from 0.45 → 1 as the paragraph crosses the viewport |
| Autoplay + pause | Projects | 7s cycle; hover, focus, or Pause stops it |
| Flip | Gallery | 0.75s rotateY; click/tap/keyboard; hover on fine pointers |
| Toast | Contact copy | Bottom-center pill, `aria-live="polite"` |
| Underline grow | Nav | ScaleX 0 → 1 from the left on hover and current section |

Primary buttons are at least 44px tall (`min-h-11`). Focus-visible rings are 2px cream with 3px offset.

## Responsive layout

| Breakpoint | What changes |
| --- | --- |
| Default | Single column; hero bio on a frosted panel; mobile menu; project rail is a horizontal snap strip; gallery 1-up |
| `sm` | Wider type, two-up gallery |
| `md` | Hero becomes true `h-screen` with larger radius; desktop hero nav; sticky header links; About / Contact padding grows |
| `lg` | Hero name + bio split 7/5; About sticky sidebar; project stage + rail side by side; gallery 3-up |

Horizontal overflow is clipped on `body`. Project and gallery sections also clip x-overflow so noise and motion do not create a page scroll gutter.

## Motion and reduced motion

Shared easing: `EASE_SOFT` `[0.16, 1, 0.3, 1]`. Card stagger is 0.12s.

`prefers-reduced-motion: reduce` turns off:

- Smooth scroll
- Marquee and orb CSS animations
- Nav underline transition
- Flip-card transform
- Hero video, glow, and orbs
- Magnetic tracking
- Project autoplay and flip 3D
- Most enter animations (`initial={false}`)

Gallery then shows a stacked article instead of a flip.

## Accessibility (current)

Already in place:

- Skip link, landmark nav labels, modal dialog for mobile menu
- Focus trap + Escape on the mobile menu
- Cream focus rings on links and buttons
- `aria-current` on the active section
- Project tabs (`tablist` / `tab` / `tabpanel`) and `aria-live` on project details
- Flip cards expose pressed state and a spoken label
- Decorative hero video is `aria-hidden`
- About paragraph has a full-text `aria-label` while letters are split for animation
- External links use `rel="noreferrer"`
- Theme color `#000000`; `lang="en"`

Known gaps to fix when touching these areas:

- Hero video still has no `prefers-reduced-motion` *media* pause beyond the React branch (the branch is the intended fix)
- Some gallery / project thumbnails use empty `alt` (decorative); ensure the parent always names the work
- Flip cards use `role="button"` on an `<article>` — works, but a real `<button>` wrapper would be cleaner
- No visible form: contact is mailto + clipboard only, which is fine for this page

## Loading, empty, and error

The public site is CMS-backed (Appwrite + Cloudinary). UI treats that as first-class:

| Surface | Loading | Empty | Error |
| --- | --- | --- | --- |
| Projects | Pulse stage + two blocks | “No projects yet.” | Amber “cached project data” banner |
| Gallery | Three pulse tiles | Dashed empty card | Hook-level; empty if no items |
| About portrait | Cloudinary or local PNG fallback | — | Local asset if Cloudinary is not configured |

## Admin (out of the public path)

`/admin` reuses the black/cream palette but is utilitarian: login, then pill tabs for Projects and Gallery, sign-out, back to portfolio. It is intentionally quieter than the home page.

## Source map

| Concern | File |
| --- | --- |
| Page composition | `src/pages/HomePage.tsx` |
| Tokens / grain / flip / nav | `src/index.css` |
| Palette + serif | `tailwind.config.js` |
| Nav, skills, timeline | `src/lib/site.ts` |
| Easing / stagger | `src/lib/motion.ts` |
| Hero | `src/components/Hero.tsx` |
| Header | `src/components/Header.tsx` |
| About | `src/components/About.tsx` |
| Projects | `src/components/Features.tsx` |
| Gallery | `src/components/Gallery.tsx` |
| Contact + toast | `src/components/Contact.tsx`, `Toast.tsx` |
| Flip / magnetic / pull-up | `FlipCard.tsx`, `hooks/useMagnetic.ts`, `WordsPullUp*.tsx` |
