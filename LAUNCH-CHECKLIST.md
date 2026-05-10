# Launch checklist — Axelle's portfolio

Operationeel plan om de site live te zetten. **Stack:** custom Astro-code
(reeds gebouwd) + Decap CMS + Netlify hosting + GitHub repo + apart
geregistreerd domein.

**Doel:** zo min mogelijk permanente Lode-dependency. Alles op Axelle's
naam, jij blijft enkel als optionele code-collaborator.

---

## 1. Wat Axelle moet (laten) aanmaken

> Geef haar dit lijstje door. Totaal ~20 minuten klikwerk + ~€12-15 voor
> het domein. Bewaar **alle wachtwoorden in een password manager**
> (Bitwarden is gratis en NL-talig). Vooral het GitHub-wachtwoord, want
> dat ga ze nooit gebruiken — als ze het verliest is recovery rotzooi.

### 1.1. GitHub-account
- [ ] Naar [github.com/signup](https://github.com/signup), email + sterk wachtwoord
- [ ] 2FA aanzetten (verplicht voor private repos zonder gedoe — gebruik authenticator app)
- [ ] Bewaar credentials + 2FA recovery codes in password manager
- **Wat ze hierna doet met dit account:** niets. Alleen 1× collaborator-uitnodiging accepteren als jij erop wijst.

### 1.2. Netlify-account
- [ ] Naar [app.netlify.com/signup](https://app.netlify.com/signup)
- [ ] **"Sign up with email"** kiezen (niet GitHub-koppeling — accounts gescheiden houden)
- [ ] Email + sterk wachtwoord, bewaar in password manager
- **Wat ze hierna doet met dit account:** dit wordt haar dagelijkse login om de site te beheren via `axellehostyn.be/admin`.

### 1.3. Domein registreren

**Naamopties** (oplopend in formaliteit):
- `axellehostyn.be` — meest direct, naam = brand
- `axelle-hostyn.be` — leesbaarder met streepje
- `ahostyn.be` — korter
- `studioaxelle.be` of vergelijkbaar — alleen als ze later een studio-naam wil

**Registrar vergelijking** (voor `.be`):

| Registrar | Prijs `.be`/jaar | Pluspunten | Minpunten |
|---|---|---|---|
| **TransIP** | ~€11 | NL-vriendelijke UX, no-nonsense, eenvoudige DNS-tab | NL-talig (geen Vlaams) |
| **Combell** | ~€15 | Belgisch, Vlaamse support, kantoor in Hasselt | Iets duurder, UX iets bloated |
| **Hostinger** | ~€10 | Goedkoopste, jij hebt al credentials | EN-only support |
| **Cloudflare Registrar** | at-cost (~€9) | Goedkoopst | Vereist eigen CF-account, alleen voor reeds-bij-CF beheerde domeinen |

**Aanrader voor Axelle:** TransIP. Goede balans NL-UX en prijs, en een goede DNS-interface die we later nog nodig hebben.

- [ ] Domein gekozen + besteld op haar naam
- [ ] Login + DNS-toegang bewaard in password manager

---

## 2. Wat Lode alvast voorbereidt in de codebase

Kan je doen voor zij accounts heeft — verandert niks aan haar pad.

- [ ] **Decap CMS scaffold** — `public/admin/index.html` + `public/admin/config.yml` met schema voor alle huidige `data/projects.yaml` velden + sociale links + markdown widget op `info`
- [ ] **`netlify.toml`** in repo-root met build config (`astro build`, output `dist/`)
- [ ] **README.md** in repo-root: hoe lokaal draaien, schema-overzicht, deploy-flow — onboarding voor toekomstige devs
- [ ] **`@netlify/plugin-astro`** (of standaard Astro detection — Netlify ondersteunt Astro out-of-box)
- [ ] **Renovate/Dependabot config** — automatische dependency-updates via PRs, drukt jouw onderhoudslast
- [ ] **Test lokaal:** Decap admin-route opent in dev-mode, schema werkt

---

## 3. Setup-sequentie wanneer Axelle's accounts klaar zijn

Volgorde is belangrijk — elke stap heeft de vorige nodig.

1. **Axelle maakt empty private repo** op haar GitHub: bv. `portfolio` (private + GitHub Pages off)
2. **Axelle voegt Lode toe als collaborator** — Settings → Collaborators → Add → jouw GitHub-username
3. **Lode pusht de huidige codebase** naar haar repo:
   ```bash
   cd "/mnt/e/Self hosting/website-design/portfolio"
   git init && git add . && git commit -m "Initial portfolio scaffold"
   git remote add origin https://github.com/<axelle-username>/portfolio.git
   git push -u origin main
   ```
4. **Axelle logt in op Netlify** → "Add new site" → "Import from Git" → GitHub-repo selecteren (vraagt OAuth-permissie eenmaal)
5. **Netlify detecteert Astro** automatisch, builds, deploy-URL `<random>.netlify.app` werkt
6. **Domein binden:**
   - In Netlify dashboard → Domain settings → Add custom domain → `axellehostyn.be`
   - In TransIP DNS-tab: 2 records toevoegen (Netlify wizard geeft exact welke)
   - SSL automatisch via Let's Encrypt (~5 min)
7. **Netlify Identity activeren** voor Decap-auth:
   - Netlify dashboard → Identity → Enable
   - Settings → Registration: "Invite only"
   - Invite Axelle's email → ze klikt link → kiest wachtwoord
8. **Git Gateway activeren** (zodat Decap kan committen zonder GitHub-account voor haar):
   - Identity → Services → Git Gateway → Enable (vraagt opnieuw GitHub-OAuth, gebruikt jouw collab-toegang)
9. **Test:**
   - Axelle gaat naar `axellehostyn.be/admin`
   - Login met haar Netlify Identity wachtwoord
   - Wijzigt iets simpels (bv. project-titel "Project 1" → "Test")
   - Save → wacht ~30s → refresh site → wijziging zichtbaar
   - Rollback de test-wijziging via Decap

---

## 4. Wat Axelle daarna kan in `/admin`

**Per project:**
- Naam (NL + EN)
- Titel, medium, klant, info-tekst (markdown: bold/italic/links/lijsten)
- Volgorde, kolom-override (a/b)
- Foto's drag-and-drop uploaden, herorderen, captions
- Project verwijderen of toevoegen

**Site-breed:**
- Artiestnaam, contactgegevens, sociale links (Instagram, Behance, etc.)
- About-tekst (als we die sectie toevoegen)

**Wat enkel via code wijzigt** (collaborator-toegang nodig):
- Layout (kolom-logica, scroll-gedrag, cursor)
- Nieuwe pagina-types of velden in schema
- Astro/dependency-updates

---

## 5. Onderhoud na launch

| Taak | Wie | Frequentie | Tijd |
|---|---|---|---|
| Content-edits | Axelle | Doorlopend | minuten |
| Astro/dependencies bumpen | Lode (Claude) of Renovate auto | 2× per jaar | 30 min |
| Domein verlengen | Axelle | 1× per jaar | 5 min (auto-renew aanzetten op TransIP) |
| Adobe CC-abo (Typekit-cursor) | Axelle | Doorlopend | n.v.t. |
| Backup | Geen actie nodig | Auto | — git is de backup |

---

## 6. Wat als Lode er ooit uit moet

- Axelle → Settings → Collaborators → "Remove access" naast jouw username
- Vervangen door nieuwe dev: zij voegt die toe als collaborator
- Geen migratie van content, accounts of domein nodig — alles staat al op haar naam

---

## Open vragen voor jou (Lode) voordat we live gaan

1. Domein-naam definitief vastleggen?
2. Wil je een About/Bio-sectie toevoegen aan het schema, of pas later?
3. Sociale media — welke platforms wil ze? (Instagram zeker; Behance? LinkedIn?)
4. Privacy/cookie-banner nodig? (Voor pure portfolio met geen tracking: nee)
5. Analytics? (Plausible self-hosted, Cloudflare Web Analytics, of niets — privacy-vriendelijke opties als ze later wil weten of er bezoekers zijn)
