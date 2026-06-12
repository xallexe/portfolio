# Dev setup — lokaal draaien en deployen

Voor codewijzigingen aan de portfolio. Doelpubliek: Lode.

## Vereisten

- **Node 20+** (de site gebruikt Astro 5, geen `engines` veld in
  `package.json` maar 20+ is wat Netlify ook gebruikt).
- **npm** (komt mee met Node).
- WSL2 of Linux — Windows direct werkt ook maar paden in scripts gaan
  uit van WSL.

## Eerste keer setup op een nieuwe machine

```bash
cd "/mnt/e/Self hosting/website-design/portfolio"
npm install
```

Geen extra env-files of secrets nodig om lokaal te draaien — de site
is volledig statisch, alle data komt uit `data/*.yml` en
`public/uploads/photos/`.

## Lokaal draaien

```bash
npm run dev
# → http://localhost:4321
```

Astro hot-reload werkt automatisch: edit een `.astro` of `.css` bestand
en de browser ververst.

**Andere commando's:**

```bash
npm run build      # genereert dist/
npm run preview    # serveert dist/ lokaal op :4321 (om de productie-build te testen)
```

## Wijzigen en deployen

Het deploy-mechanisme:

1. Push naar `main` op GitHub.
2. Netlify detecteert de push (webhook), draait `npm run build`,
   publiceert `dist/`. Duurt typisch 15–30 sec.
3. Live op <https://precious-panda-b2809f.netlify.app>.

```bash
git add .
git commit -m "Korte beschrijving"
git push
```

Build-status zie je in de Netlify-badge bovenaan de README, of via
<https://app.netlify.com/projects/precious-panda-b2809f/deploys>.

## Push-credentials (belangrijk)

**Dit repo pusht als `axelle.hostyn`, niet als Lode.** Netlify's free
plan staat maar één "verified contributor" toe per project, en die
plek is Axelle. Pushen als Lode → Netlify weigert de build:
*"Build blocked: Unrecognized Git contributor."*

Hoe het opgelost is (al gedaan, repo-local):

- `git remote -v` toont een URL met Axelle's PAT ingebed:
  `https://axelle.hostyn:<PAT>@github.com/xallexe/portfolio.git`
- `git config user.email = axelle.hostyn@gmail.com`
- `git config user.name = axelle.hostyn`
- Token bewaard in vault als `AXELLE_GH_PAT`.

Dit geldt enkel voor dit repo — andere repo's op dezelfde WSL blijven
Lode's globale PAT gebruiken.

**Wat te doen als de PAT verloopt (volgende: 2026-08-08):**

1. Nieuwe fine-grained PAT genereren op Axelle's GitHub. Permissions:
   Contents R/W, alleen op `xallexe/portfolio`. Looptijd 90 dagen.
2. Vault updaten:
   ```bash
   "/mnt/e/Self hosting/credentials-vault/env-vault.sh" edit
   # vervang AXELLE_GH_PAT
   ```
3. Remote URL herschrijven:
   ```bash
   NEW_PAT=$("/mnt/e/Self hosting/credentials-vault/env-vault.sh" get AXELLE_GH_PAT)
   git remote set-url origin "https://axelle.hostyn:$NEW_PAT@github.com/xallexe/portfolio.git"
   ```
4. Testen met `git push`.

## Een rollback doen

Als een commit een live build breekt:

```bash
git revert <commit-sha>
git push
```

Netlify bouwt en publiceert de revert. Geen handmatige redeploy nodig.

Voor een **snellere terugkeer** (zonder revert-commit) kan je in de
Netlify dashboard onder *Deploys* op een eerdere succesvolle deploy
klikken → **"Publish deploy"**. Maar dat zet alleen wat live is terug;
de `main` branch wijzigt niet en zal bij de volgende push opnieuw
falen tenzij je ook de breekende commit revert.

## Lokale test van Decap CMS

De CMS draait normaal op de live URL (`/admin`), niet lokaal. Reden:
Netlify Identity en Git Gateway zijn server-side van Netlify zelf.
Wil je toch lokaal het CMS testen → dat vereist `netlify-cli` met
`netlify dev`, wat we niet ingericht hebben. Gewoon op productie
testen is simpeler.

Wel lokaal te checken: of het scaffold zelf bestaat:

```bash
ls public/admin/
# config.yml  index.html
```

`config.yml` aanpassen + pushen → na deploy ziet Axelle de nieuwe
velden in het CMS.

## Foto's groot inhalen (buiten CMS om)

Voor het initiële vullen (massa-import) gebruiken we rsync uit
`box:/volume1/Drive/Transfer/pourfoliove/`. Voorbeeld:

```bash
rsync -av --exclude '@eaDir' --exclude 'Thumbs.db' \
  -e "ssh -i ~/.ssh/box -o IdentitiesOnly=yes -p 22114" \
  "boxy@192.168.0.17:/volume1/Drive/Transfer/pourfoliove/" \
  "/mnt/e/Self hosting/website-design/portfolio/assets/photos/"
```

Daarna manueel verplaatsen naar `public/uploads/photos/` en in
`data/projects/*.yml` referenties bijwerken. Voor losse nieuwe foto's
laat je dit aan Axelle via het CMS.

## Build lokaal debuggen

Als de Netlify build faalt en je wil hetzelfde lokaal reproduceren:

```bash
npm run build
# zelfde output als Netlify; faalt als Astro een YAML-validatie probleem ziet
```

Veel voorkomende oorzaak: een project-YAML met onjuiste indent of een
ontbrekend `order:` veld. Open `data/projects/*.yml` en check.

## Joplin-sync van docs

Deze `docs/` map en `README.md` worden automatisch gemirrord naar
Joplin (`notes.rokket.watch`) door
`/mnt/e/Self hosting/joplin-sync/joplin_sync.py`. Edit altijd het
`.md`-bestand hier — Joplin is read-only mirror. Sync gebeurt via een
Windows scheduled task; handmatig forceren kan met
`E:\Self hosting\joplin-sync\run-sync.ps1`.
