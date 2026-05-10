# Axelle Hostyn — portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/6ce6de1f-8269-4cd8-ba0f-ffe252bdd207/deploy-status)](https://app.netlify.com/projects/precious-panda-b2809f/deploys)

Custom Astro static site, content managed via Decap CMS, deployed on Netlify.

## Stack

- **Framework:** [Astro 5](https://astro.build) (static, no server runtime)
- **Content:** YAML in `data/`, photos in `public/uploads/photos/`
- **CMS:** [Decap CMS](https://decapcms.org) at `/admin` (Netlify Identity + Git Gateway)
- **Hosting:** Netlify (auto-build on every `main` push)
- **i18n:** Dutch default, English at `/en/`

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev
# → http://localhost:4321
```

Other commands:

```bash
npm run build      # generate dist/
npm run preview    # serve dist/ locally
```

## Project structure

```
data/
  site.yml                 — artist name, email, social links
  projects/<id>.yml        — one file per project (managed by CMS)
public/
  admin/                   — Decap CMS UI (served at /admin)
  uploads/photos/          — photos (uploaded via CMS or manually)
src/
  pages/
    index.astro            — NL home (two-column photo overview)
    en/index.astro         — EN home
    work/[id].astro        — NL project detail (horizontal photo strip)
    en/work/[id].astro     — EN project detail
    contact.astro          — contact page
  components/
    LeftNav.astro          — fixed left navigation
    PhotoCard.astro        — wrapper around each photo + lightbox trigger
    Lightbox.astro         — fullscreen photo overlay
    ProjectHeader.astro    — (legacy, no longer used on home)
  layouts/Base.astro       — HTML shell + Typekit cursor injection
  lib/
    projects.ts            — loads site.yml + projects/*.yml at build time
    i18n.ts                — language utilities (localized, pathFor, ui-strings)
  styles/global.css        — all styling (boxy minimalist black-and-white)
```

## How content works

Every project page comes from one YAML file in `data/projects/`. The
**filename without extension becomes the project ID** (used in URLs:
`/work/<id>`).

Schema per project:

```yaml
order: 1                   # determines column on home: odd=left, even=right
name: "Project name"        # NL version, appears in nav
name_en: ""                 # optional; falls back to NL if empty
title: ""                   # optional
title_en: ""
medium: ""                  # e.g. "photography", "print"
medium_en: ""
klant: ""                   # client; empty = personal work
info: ""                    # markdown; shown in details panel on /work/<id>
info_en: ""
column: ""                  # "" (auto), "a" (left), or "b" (right) override
photos:
  - file: "/uploads/photos/foo.jpg"
    info: ""                 # per-photo caption (optional)
    info_en: ""
```

Site-wide settings (artist name, email, socials) live in `data/site.yml`.

## How the admin works

The editor opens `<site>/admin`, logs in via **Netlify Identity** (email +
password, or "Continue with GitHub" if external provider is enabled — no
GitHub account strictly required), edits content through forms, and hits
save. Decap commits to the repo via **Netlify Git Gateway**. Netlify
sees the commit and rebuilds — changes are live ~30s later.

## Deploy

`git push origin main` → Netlify detects the change → `npm run build` →
publishes from `dist/`.

No separate CI needed. Build takes ~1 min for 33 photos.

## Changes to layout / design

Code only. Key files:

- `src/styles/global.css` — all styling
- `src/pages/index.astro` — home-page logic (random scroll, column distribution)
- `src/pages/work/[id].astro` — detail page (horizontal scroll, wheel mapping)
- `src/layouts/Base.astro` — Typekit cursor + layout shell

The cursor uses the glyph of the letter `q` in `blockhead-illust-ot`
(Adobe Fonts via Typekit, kit `qyw6yte`). Change it in `Base.astro`
around lines 20-22.

## Maintenance

- `npm update` periodically (or set up Renovate/Dependabot — TODO)
- Astro major versions: read the release notes for breaking changes
- The Adobe Fonts subscription must stay active for the cursor to load;
  it falls back to the default cursor if Typekit fails to load
