---
name: younes-portfolio-workflow
description: >-
  End-to-end development workflow for the Younes Basir portfolio repo. Use when
  starting work in this project, adding sections, porting motion prompts, or
  deciding which other project skills and Cursor tools to invoke.
---

# Younes Portfolio Workflow

## Project layout

```
src/
├── App.tsx                 # Hero + About + Projects
├── main.tsx
├── index.css               # Tailwind + noise utilities + nav styles
├── components/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Features.tsx        # Projects section (id="projects")
│   ├── WordsPullUp.tsx
│   └── WordsPullUpMultiStyle.tsx
└── lib/motion.ts
YOUNES_BASIR.md             # Copy source of truth
tailwind.config.js          # primary color + serif font
```

## Which skill to use when

| Task | Skill |
| --- | --- |
| Change name, bio, projects, links | `younes-portfolio-content` |
| Styling, new sections, prompt ports | `younes-portfolio-design` |
| Confirm UI looks correct | `younes-portfolio-verify` |
| Full task orientation | this skill |

## Standard implementation flow

1. **Read** `YOUNES_BASIR.md` if touching copy.
2. **Read** existing component before editing — match framer-motion patterns and Tailwind conventions.
3. **Implement** minimal diff; keep imports at top of file (no inline imports).
4. **Verify**: `npm run build` + browser screenshots (see `younes-portfolio-verify`).
5. **Optional**: `npx react-doctor@latest --verbose --scope changed` before commit.

## Porting motionsites prompts

Local prompts folder:
`C:\Users\ken\Documents\GitHub\py fpl\motionsites-prompt-collection\prompts\`

Workflow:
1. Read the specific `.md` prompt file.
2. Extract layout, animation, and asset URLs from the prompt.
3. Rebuild in this repo's stack (React + TS + framer-motion + Tailwind v4).
4. Replace all placeholder/agency copy with content from `YOUNES_BASIR.md`.
5. Screenshot before handing off — user has rejected UI that wasn't visually checked.

## Git & commits

- Only commit when the user explicitly asks.
- This folder may not be a git repo — warn before destructive deletes.
- User photos live in `src/assets/` — do not delete without confirmation.

## Assets still using template placeholders

- Hero + feature card background videos (CloudFront URLs from Prisma template)
- Project card thumbnails (astronaut renders) — swap for app screenshots or lucide icons when user requests

## Related Cursor skills (built-in)

Invoke these from the agent when appropriate — they are not duplicated in this repo:

- **react-doctor** — lint, a11y, bundle, architecture scan; run `design` subcommand for UI audit
- **control-ui** — repeatable browser/CDP harness instead of throwaway scripts
- **check-compiler-errors** — run `npm run build` / typecheck after edits
