# Architectuur — hoe content stroomt

Overzicht voor wanneer je weken later terugkomt en niet meer weet
welk stukje waar zit. Doelpubliek: Lode.

## Stack in één regel

**Astro 5** static site, **Decap CMS** voor editing, gehost op
**Netlify** met automatische builds bij elke push naar `main`.

## De content pipeline

```
┌─ Axelle in Decap CMS UI (browser, /admin)
│      │
│      │  Publish → Netlify Identity verifieert sessie
│      ▼
├─ Git Gateway commit'et naar GitHub (github.com/xallexe/portfolio)
│      │     (commit author = axelle.hostyn)
│      │
│      ▼
├─ GitHub webhook pingt Netlify
│      │
│      ▼
├─ Netlify checkout → npm install → npm run build → dist/
│      │
│      ▼
└─ dist/ wordt op het CDN gepubliceerd → live binnen ~15-30 sec
```

Dezelfde pipeline geldt voor code-pushes: jij commit lokaal, push naar
`main`, Netlify bouwt en deployt.

## Waar staat wat

```
data/
  site.yml              ─ globale site-instellingen
  projects/<id>.yml     ─ één YAML per project (filename = project-id)

public/
  admin/                ─ Decap CMS scaffold
    index.html          ─ statische pagina die de CMS JS laadt
    config.yml          ─ velden, collecties, backend-config
  uploads/photos/       ─ upload-target voor Decap
                         (Decap zet hier alles wat ze via /admin uploadt)

src/
  pages/
    index.astro         ─ NL home (twee-koloms foto-overzicht)
    en/index.astro      ─ EN home
    work/[id].astro     ─ NL project-detail (horizontale foto-strip)
    en/work/[id].astro  ─ EN project-detail
    contact.astro       ─ NL contact
    en/contact.astro    ─ EN contact
  components/
    LeftNav.astro       ─ fixed linker-nav
    PhotoCard.astro     ─ foto-wrapper + lightbox-trigger
    Lightbox.astro      ─ fullscreen overlay
  layouts/
    Base.astro          ─ HTML shell, Typekit cursor injectie
  lib/
    projects.ts         ─ leest site.yml + projects/*.yml @ build time
    i18n.ts             ─ vertalingen, pad-helpers
  styles/
    global.css          ─ alle styling, boxy minimalistisch zwart-wit
```

## Hoe Astro de YAML inleest

`src/lib/projects.ts` doet het werk:

1. Op build-time leest `readdirSync('data/projects')` alle `.yml`
   bestanden.
2. Per bestand: `yaml.load()` parst het naar een `Project` object.
3. De filename (zonder extensie) wordt de `id` — dat is ook het URL-pad:
   `data/projects/zomer-serie.yml` → `/work/zomer-serie`.
4. Astro's `getStaticPaths` in `src/pages/work/[id].astro` genereert
   één HTML-pagina per project.

**Gevolg:** alles is build-time. Een wijziging in een YAML triggert een
build; runtime is er geen server, alleen statische bestanden op CDN.

## Hoe de twee-koloms home werkt

Op `src/pages/index.astro` (en `en/index.astro`):

- **Server-side:** alle foto's van alle projecten worden platgeslagen
  tot één lijst (`projects.flatMap(p => p.photos...)`). Helft wordt in
  `col-a` gerenderd, helft in `col-b`. Geen project-niveau sortering meer.
- **Client-side (bij elke load):** Fisher-Yates shuffle herordent de
  DOM-children van beide kolommen. Daarna scrollt elke kolom naar een
  willekeurige foto (bestaande "land op iets anders"-UX).
- **Restore-pad:** als er een `sessionStorage` scrollTop staat (na
  detail → back), wordt er **niet** geshuffeld en wordt de scroll
  hersteld zodat de bezoeker exact dezelfde view terugziet.
  SessionStorage reset bij tab-sluit.
- **Deep-linking:** elke `<PhotoCard>` heeft
  `linkTo=/work/{p.id}#p{idx}` zodat klik → projectpagina met die foto
  gefocust via de hash-anchor.

`order` en `column` in de YAML bepalen **niet meer** de home-layout.
`order` blijft wel de volgorde van projecten in de `LeftNav`.

## Tweetaligheid

`src/lib/i18n.ts` bevat een `pathFor(lang, slug)` helper en UI-strings
(`ui.contact`, `ui.work`, enz.). Pagina's onder `src/pages/en/` zijn
gewoon parallelle Astro-componenten die `lang='en'` doorgeven.

Voor projectvelden:
- Alle inhoudelijke velden hebben een `_en` tegenhanger (`name_en`,
  `title_en`, `info_en`).
- In de templates: `project.name_en ?? project.name`. Engelse versie
  leeg → val terug op Nederlands.

Dat verklaart waarom in het CMS de `_en` velden allemaal optioneel zijn.

## Markdown rendering

Het `info` veld in `data/projects/*.yml` is markdown. In de Astro
template wordt het door `marked` (npm dep) door HTML gerenderd voor de
detail-paneel. Daarom kan Axelle bold/italic/links/lijstjes gebruiken in
het CMS.

## Photo upload-pad

Decap config (`public/admin/config.yml`):

```yaml
media_folder: "public/uploads/photos"   # waar bestanden landen in de repo
public_folder: "/uploads/photos"        # URL-prefix die in YAML wordt gezet
```

Dus een upload `voorbeeld.jpg` via CMS:
- Bestand commit'et naar `public/uploads/photos/voorbeeld.jpg`
- YAML krijgt een string-entry `/uploads/photos/voorbeeld.jpg` onder
  `photos:` (zie hieronder voor het schema).
- Astro serveert `public/` aan de root → `/uploads/photos/voorbeeld.jpg`
  is publiek bereikbaar.

## Photo schema in YAML

Sinds we multi-select hebben ingeschakeld is `photos:` een platte lijst
van strings:

```yaml
photos:
  - /uploads/photos/foo.jpg
  - /uploads/photos/bar.jpg
```

`projects.ts` normaliseert ook het oude object-formaat
(`- file: ...` met optionele `info`/`info_en`) voor
backwards-compatibility — als oude YAML ooit terugkomt door een revert,
breekt niets. Captions zijn weg uit het CMS (waren nooit gebruikt). Wil
je ze ooit terug → schema-extensie nodig, kan in een aparte sidecar
map per project zonder de multi-select te breken.

## Decap modus: editorial workflow

In `config.yml` staat `publish_mode: editorial_workflow`. Elke "Publish"
maakt een PR op een branch `cms/<collection>/<slug>`. Statussen Draft →
In Review → Ready → Publish. Pas bij Publish wordt de PR gemerged naar
`main` en bouwt Netlify de productie-site.

Drafts krijgen automatisch een Netlify deploy-preview. Niet publiek
vindbaar, maar wie de preview-URL heeft kan 'm zien.

## Auth & permissies

**Netlify Identity** = de account-laag. Geconfigureerd op:
- Instance ID: `6a00c6251f09b14132a3e583`
- Invite-only registratie (Axelle is uitgenodigd, kan niet zomaar
  iemand zich registreren).
- External provider: GitHub OAuth (`Continue with GitHub` knop in CMS).

**Git Gateway** = de laag die voor Decap commits maakt zonder dat
Axelle ooit een GitHub PAT ziet. Netlify houdt server-side een token
en commit'et namens haar.

## Custom font

`Base.astro` injecteert Typekit:
```html
<link rel="stylesheet" href="https://use.typekit.net/qyw6yte.css">
```
Kit `qyw6yte` op Axelle's Adobe Fonts subscription. Wordt gebruikt voor
de `q`-glyph cursor. Als haar subscription vervalt → cursor valt terug
op default, geen build-failure.

## Niet-evidente keuzes

- **Lode pusht als Axelle:** zie `dev-setup.md` sectie "Push-credentials".
  Netlify free plan staat één contributor toe, dat is zij.
- **Geen `engines` veld in package.json:** Netlify bepaalt zelf de
  Node-versie (default = recente LTS, momenteel 20.x). Lokaal idem:
  20+ werkt.
- **`label_singular: "Project"` in CMS-config:** zorgt dat de "New X"
  knop "New Project" toont in plaats van "New Projecten".
- **Photo bestandsnaam-bestendigheid:** Decap rewrite niet
  automatisch — naamconflicten kunnen leiden tot overschrijven. Daarom
  in de handleiding aan Axelle gevraagd: geen spaties, geen accenten.

## Wat is er bewust NIET in deze stack?

- Geen backend / API server — alles static.
- Geen database — content = YAML in git.
- Geen CDN op afbeeldingen — Netlify serveert `public/` direct. Voor
  groei naar veel verkeer zou je `astro:assets` of een image-CDN
  kunnen overwegen, maar dat is overkill voor een portfolio.
- Geen i18n-routing van Astro zelf — handgeschreven `/en/`
  parallelpagina's. Makkelijker te begrijpen voor twee talen + weinig
  pagina's; bij meer talen → switch naar `@astrolicious/i18n` of Astro
  v5 native i18n.
