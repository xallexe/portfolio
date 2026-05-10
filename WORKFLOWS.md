# Portfolio website — workflow opties

Werkbestand om vandaag samen door te nemen. Doel: een opvallend portfolio
voor een grafisch ontwerp student. Custom font + custom cursor zijn al
gepland.

---

## Voortgang (2026-05-09)

**Beslissingen genomen:**
- Workflow: **A (designer-driven)** — Axelle geeft brief + assets, Claude codeert
- Framework: **Astro 5** met i18n (NL default + /en/)
- Talen: **NL + EN** met language switch
- TIF-conversie: lokaal via ImageMagick (5 TIFs → JPG quality 95)
- Figma EDU Pro: geactiveerd op `axelle.hostyn@student.luca-arts.be`
- Figma cloud MCP: geauthenticeerd via plugin:figma:figma plugin (View seat)

**Wat staat er nu:**
- `data/projects.yaml` — 5 projecten (placeholder namen "Project 1-5"), 33 foto's gemapt
- `src/assets/photos/` — 33 web-ready foto's; TIF originals in `_originals_tif/`
- `src/pages/` — `index.astro` (NL home), `contact.astro`, `en/index.astro`, `en/contact.astro`
- `src/components/` — `LeftNav`, `ProjectHeader`, `PhotoCard`, `Lightbox`
- `src/lib/` — `projects.ts` (YAML loader), `photos.ts` (image lookup), `i18n.ts` (translations + path helpers)
- `src/styles/global.css` — boxy minimalistisch zwart-wit, Helvetica fallback
- `astro.config.mjs` — i18n config + Vite allowedHosts voor trycloudflare

**Nog placeholder, wacht op assets:**
- Custom font (komt van Axelle) → drop in `public/fonts/` + 1 CSS regel
- Custom cursor "spie kaas" (komt van Axelle) → drop in `public/cursor/` + 1 CSS regel
- Echte project namen, titels, mediums, klanten, info → Axelle vult `data/projects.yaml` aan
- EN vertalingen via `_en` suffix in YAML (optioneel, valt terug op NL als leeg)

**Eerste prototype getest:** ✅ NL/EN beide HTTP 200, 33 foto's render, lightbox werkt, project nav scrollt beide kolommen synchroon.

## Hervatten

```bash
source ~/.nvm/nvm.sh && nvm use v24.14.1
cd "/mnt/e/Self hosting/website-design/portfolio"
npm run dev
# Open http://localhost:4321/  (NL)  |  http://localhost:4321/en/  (EN)
```

Voor sharing met Axelle (telefoon/extern):
```bash
~/.local/bin/cloudflared tunnel --url http://localhost:4321
# Print een tijdelijke https://*.trycloudflare.com URL
```

## Open feedback-punten voor volgende sessie

- Twee-kolom independent scroll: voelt het natuurlijk?
- Foto-distributie tussen kolommen (nu strict alternerend) → andere logica nodig?
- Project header styling (caps + underline) → matchen met haar smaak?
- Aspect ratios onhandig (bv. 4:5 next to 3:2) — moeten we groeperen of crop strategy bedenken?
- Mobile layout (nu single column stacked) — afgewerkt of needs work?
- Domein keuze (was open beslissing #6)

---

## Belangrijke nuance

Grafisch ontwerp ≠ webdesign. Beide zijn visueel maar verschillen in:

- **Responsiveness** — web schaalt over 320 px → 4K, print niet
- **Interactie & motion** — hover, scroll, transitions, timing
- **Typografie op web** — line-height, font-loading, fallback fonts,
  variable fonts, leesafstand op scherm
- **Performance budget** — elke afbeelding/animatie kost laadtijd
- **Accessibility** — contrast, keyboard nav, reduced-motion
- **Layout systemen** — flexbox/grid in plaats van vrije compositie

Dat betekent: haar smaak en visuele oog zijn een **groot voordeel**, maar
web-specifieke patterns zijn een eigen vakgebied. Dit kleurt welke
workflow het beste past.

---

## Optie A — Designer-driven (zij ontwerpt, Claude codeert)

```
Vriendin → Figma (design)
              ↓ MCP read
           Claude (code)
              ↓
           Cloudflare Pages
```

**Wie doet wat:** zij maakt alle ontwerpkeuzes in Figma; Claude leest via
MCP en zet om naar code (incl. animaties, responsiveness).

- ✅ Authentiek haar portfolio — toont haar smaak
- ✅ Lichte MCP-belasting (read-only) — past binnen Starter limiet?
  Nee, 6 calls/maand is nog steeds te weinig voor iteratie
- ❌ Web-specifieke patterns (responsive, motion timing) ligt bij haar,
  terwijl dat geen kerncompetentie is van een grafisch ontwerper
- ❌ Risico op designs die "niet vertalen" naar web

**Kosten:** $12/mo Dev Seat tijdens bouw

---

## Optie B — AI-driven (Claude ontwerpt in Figma)

```
Vriendin (richting + assets)
   ↓
Jij + Claude prompts
   ↓ MCP write
Figma (Claude tekent)
   ↓
Vriendin reviewt → feedback
   ↓ (loop)
Eindontwerp → Claude codeert → Cloudflare Pages
```

**Wie doet wat:** zij geeft creatieve richting + assets; Claude maakt
varianten in Figma; zij selecteert/stuurt bij; Claude codeert eindresultaat.

- ✅ Web-patterns ingebakken (Claude weet wat werkt op web)
- ✅ Snelle iteratie / veel varianten
- ❌ Minder "haar" portfolio — meer AI gegenereerd
- ❌ Zware MCP-belasting (write calls per iteratie)
- ❌ AI-designs hebben vaak een herkenbare "smooth-but-soulless" look —
  juist wat een grafisch ontwerper *niet* wil tonen

**Kosten:** $12/mo Dev Seat verplicht; mogelijk hogere tier nodig bij veel
iteratie

---

## Optie C — Hybride (aanbevolen)

```
Vriendin: visuele identiteit + key pages in Figma
   (typografie, kleur, branding, hero compositie)
       ↓
Claude: web-specifieke aanvullingen via MCP
   (responsive states, layout varianten, motion specs,
    interactie-details, dark mode indien gewenst)
       ↓
Ping-pong op details — zij stuurt, Claude voert uit
       ↓
Claude implementeert → Cloudflare Pages
```

**Wie doet wat:**
- **Zij** — het *ontwerp*: kleurpalet, typografie-keuze, hero/landing
  compositie, project case-study layouts, beeldselectie. Haar
  competentie, haar smaak.
- **Claude** — het *web-laagje*: hoe het ontwerp ademt op verschillende
  schermen, hoe scroll-animaties timen, hoe hover/interactie voelt,
  responsive behavior, performance.

- ✅ Speelt op haar sterktes
- ✅ Vult web-specifieke gat in
- ✅ Eindproduct is herkenbaar haar werk
- ✅ MCP-belasting matig (meer read dan write)

**Kosten:** $12/mo Dev Seat tijdens bouw (1-2 maanden), daarna opzeggen

---

## Tech-stack (laag 3+4, ongeacht workflow)

| Laag | Voorstel | Alternatief |
|---|---|---|
| Framework | **Astro** (statisch, snel, simpel) | Next.js (als veel dynamiek) |
| Styling | Tailwind CSS | Vanilla CSS modules |
| Animatie | GSAP of Framer Motion | Pure CSS + Web Animations API |
| 3D / WebGL (optioneel) | Three.js / OGL | — |
| Custom cursor | Vanilla JS of `cuberto/mouse-follower` | — |
| Hosting | Cloudflare Pages (gratis) | Vercel, Netlify |
| Domein | Via Cloudflare | — |

## Inspiratie (al geopend in browser)

- awwwards.com/websites/portfolio/
- godly.website/tags/portfolio
- Studios: Studio Mast, Lusion, Active Theory, Locomotive

## Open beslissingen

1. Welke workflow (A / B / C)?
2. Astro vs Next.js?
3. Doelgroep portfolio: stages, klanten, of allebei?
4. Aantal projecten dat getoond wordt?
5. Talen: NL only, of NL + EN?
6. Domein: nieuw registreren, subdomein van bestaand, of `.pages.dev`?

## Volgende stap

Beslissen over workflow → Figma account aanmaken (gratis) → moodboard
in FigJam → eerste design iteratie.
