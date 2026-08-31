---
name: younes-portfolio-content
description: >-
  Source-of-truth copy, links, and project facts for Younes Basir's portfolio.
  Use when updating hero/about/projects text, nav labels, CTAs, meta tags, or
  any user-facing content in this repo.
---

# Younes Portfolio Content

## Source of truth

Read and follow `YOUNES_BASIR.md` at the repo root before changing copy. Do not invent projects, URLs, GPA, or contact details.

## Identity

| Field | Value |
| --- | --- |
| Name | Younes Basir |
| Title | 3rd Year Software Engineering Student — Aspiring Data Analyst |
| Tagline | I'm passionate about turning data into insights and building web applications that solve real problems. |
| Status | Actively seeking a **data internship** |
| Focus | Frontend, Backend, Data |
| Education | 3rd year Software Engineering, GPA **3.5+ / 4.0** |
| Currently mastering | Data Analysis with Python, SQL for Data Querying, Data Visualization & Storytelling |

## Contact & links

| Method | Value |
| --- | --- |
| Email | younesbasir0@gmail.com |
| GitHub | https://github.com/younes0basir |
| LinkedIn | https://linkedin.com/in/younes-basir |
| CV | `src/assets/cv_younes_basir.pdf` |
| Portfolio repo | https://github.com/younes0basir/Younes_BASIR |

## Featured projects (use exact names)

### CourseWard — 01
- E-learning platform
- Live: https://courseward-14va.onrender.com/
- Source: Coming soon
- Stack: React, Vite, Tailwind CSS, Express.js, PostgreSQL, Render
- Features: course management & auth, complete REST API, modern responsive UI

### Quincaillerie Fassi — 02
- E-commerce hardware store
- Live: http://quincailleriefassi.ma/
- Source: https://github.com/younes1528/quincaillierie_fassi
- Stack: React, Vite, Tailwind CSS, Node.js, MongoDB
- Features: catalog with search/filter, cart & checkout, auth & admin dashboard

### Your Doctor — 03
- Medical platform (team project)
- Live & source: Coming soon
- Stack: React, Node.js, MongoDB, Express, Socket.io, JWT
- Features: online appointments, medical records, automatic notifications

## Copy rules

1. Keep tone professional and internship-focused — data analyst + software engineer, not agency/creative-studio voice unless the user asks.
2. Wire nav and CTAs to real targets: `#about`, `#projects`, GitHub, LinkedIn, `mailto:` — never `#` placeholders.
3. Live projects → "View live" linking out in a new tab. Not-yet-shipped → "Coming soon" (no fake URLs).
4. After copy changes, update `index.html` `<title>` and `<meta name="description">` if the page purpose changed.

## Where copy lives today

| Section | File |
| --- | --- |
| Hero (name, tagline, nav, CTA) | `src/components/Hero.tsx` |
| About (heading + scroll paragraph) | `src/components/About.tsx` |
| Projects (header + cards) | `src/components/Features.tsx` |
| Page meta | `index.html` |
