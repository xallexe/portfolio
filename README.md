# Axelle Hostyn — portfolio

Custom Astro static site, content managed via Decap CMS, deployed on Netlify.

## Stack

- **Framework:** [Astro 5](https://astro.build) (statisch, geen server-runtime)
- **Content:** YAML in `data/`, foto's in `public/uploads/photos/`
- **CMS:** [Decap CMS](https://decapcms.org) op `/admin` (Netlify Identity + Git Gateway)
- **Hosting:** Netlify (auto-build op elke `main` push)
- **i18n:** NL default, EN op `/en/`

## Lokaal draaien

Vereist Node 20+.

```bash
npm install
npm run dev
# → http://localhost:4321
```

Andere commands:

```bash
npm run build      # generate dist/
npm run preview    # serve dist/ locally
```

## Project-structuur

```
data/
  site.yml                 — artiestnaam, email, social links
  projects/<id>.yml        — één file per project (managed door CMS)
public/
  admin/                   — Decap CMS UI (geserved op /admin)
  uploads/photos/          — foto's (uploaded via CMS of manueel)
src/
  pages/
    index.astro            — NL home (twee-koloms foto-overzicht)
    en/index.astro         — EN home
    work/[id].astro        — NL project-detail (horizontale foto-strip)
    en/work/[id].astro     — EN project-detail
    contact.astro          — contact page
  components/
    LeftNav.astro          — vaste linker-navigatie
    PhotoCard.astro        — wrapper rond elke foto + lightbox-trigger
    Lightbox.astro         — fullscreen foto overlay
    ProjectHeader.astro    — (legacy, niet langer in home gebruikt)
  layouts/Base.astro       — HTML-shell + Typekit-cursor injectie
  lib/
    projects.ts            — laadt site.yml + projects/*.yml at build time
    i18n.ts                — taal-utilities (localized, pathFor, ui-strings)
  styles/global.css        — alle styling (boxy minimalistisch zwart-wit)
```

## Hoe content werkt

Elke project-pagina komt van één YAML-bestand in `data/projects/`. De
**bestandsnaam zonder extensie wordt het project-ID** (gebruikt in URLs:
`/work/<id>`).

Schema per project:

```yaml
order: 1                   # bepaalt kolom op home: oneven=links, even=rechts
name: "Project naam"        # NL versie, verschijnt in nav
name_en: ""                 # optioneel; valt terug op NL als leeg
title: ""                   # optioneel
title_en: ""
medium: ""                  # bv. "fotografie", "print"
medium_en: ""
klant: ""                   # opdrachtgever; leeg = persoonlijk werk
info: ""                    # markdown; toont in details-panel op /work/<id>
info_en: ""
column: ""                  # "" (auto), "a" (links), of "b" (rechts) override
photos:
  - file: "/uploads/photos/foo.jpg"
    info: ""                 # caption per foto (optioneel)
    info_en: ""
```

Site-brede instellingen (artiestnaam, email, social) staan in `data/site.yml`.

## Hoe de admin werkt

Editor opent `<site>/admin`, logt in met **Netlify Identity** (email +
wachtwoord, geen GitHub-account nodig), bewerkt content via formulieren,
klikt save. Decap commit naar de repo via **Netlify Git Gateway**.
Netlify ziet de commit en herbouwt — wijzigingen zijn ~30s later live.

## Deploy

`git push origin main` → Netlify detecteert change → `npm run build` →
publishen vanuit `dist/`.

Geen aparte CI nodig. Build duurt ~1 min voor 33 foto's.

## Wijzigingen aan layout / design

Alleen via code. Belangrijke files:

- `src/styles/global.css` — alle styling
- `src/pages/index.astro` — home-pagina logica (random scroll, kolom-distributie)
- `src/pages/work/[id].astro` — detail-pagina (horizontale scroll, wheel-mapping)
- `src/layouts/Base.astro` — Typekit-cursor + layout-shell

Cursor gebruikt het glyph van de letter `q` in `blockhead-illust-ot`
(Adobe Fonts via Typekit, kit `qyw6yte`). Wijzigen in `Base.astro` regel
~20-22.

## Onderhoud

- `npm update` periodiek (of via Renovate/Dependabot — TODO)
- Astro major-versions: lees release notes voor breaking changes
- Adobe Fonts subscription moet actief blijven voor de cursor; valt terug
  op default als Typekit faalt te laden
