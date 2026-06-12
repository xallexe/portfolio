# CMS-handleiding — Axelle

Korte gids om foto's, projecten en site-instellingen aan te passen
zonder code aan te raken.

## 1. Inloggen

1. Open: <https://precious-panda-b2809f.netlify.app/admin>
2. Klik **"Login with Netlify Identity"**.
3. Twee opties:
   - **Email + wachtwoord** (eerste keer: uit de invite-mail die je
     hebt aanvaard).
   - **"Continue with GitHub"** — logt je in via je `xallexe` GitHub
     account.

Eens ingelogd onthoudt je browser het tot je expliciet uitlogt.

## 2. Wat staat er in de zijbalk?

Twee collecties:

| Collectie | Wat erin staat | Wanneer aanraken |
|-----------|----------------|------------------|
| **Site** → "Site instellingen" | Artiestnaam, publiek email, social URLs | Zelden — globale dingen |
| **Projecten** | Eén entry per project op de website | Hier doe je het meeste |

## 3. Een nieuw project toevoegen

1. Klik **Projecten** in de zijbalk → knop **"New Projecten"** rechtsboven.
2. Vul de velden:
   - **Volgorde** — een getal. Bepaalt de positie van het project in
     de linker-navigatie (lager nummer staat hoger). De foto's op de
     home worden willekeurig dooreen geschud, dus dit veld bepaalt
     **niet** meer de homepage-volgorde.
   - **Naam** — kort label dat in de linker-navigatie verschijnt.
   - **Naam — Engels** (optioneel) — als leeg, gebruikt hij de
     Nederlandse naam ook op de Engelse site.
   - **Titel** + **Titel — Engels** (optioneel) — uitgebreidere titel
     boven het project (gebruik je niet altijd).
   - **Medium** — bv. *fotografie*, *print*, *mixed media*.
   - **Klant / opdrachtgever** — leeg laten voor persoonlijk werk.
   - **Info / omschrijving** — markdown veld. Je kan:
     - `**vet**` voor **vet**
     - `*cursief*` voor *cursief*
     - `[linktekst](https://...)` voor links
     - lijstjes met `- item`
   - **Kolom-override** — restveld, niet meer relevant sinds de home
     willekeurig dooreengeschud is. Laat op "Automatisch" staan.
3. **Foto's** sectie — klik **"Add Foto's"** → de file-dialoog opent.
   **Selecteer meerdere bestanden tegelijk** (Ctrl+klik in Windows,
   Cmd+klik op Mac) — elk geselecteerd bestand wordt automatisch een
   aparte foto-entry. Geen captions per foto meer (waren nooit gebruikt).
4. Klik rechtsboven **"Save"** of **"Publish"**:
   - **"Save"** → bewaart als **Draft** (niet zichtbaar op live site).
   - **"Publish now"** → direct live binnen 15–30 sec.

## Draft-modus: hoe het werkt

Sinds we *editorial workflow* hebben aangezet, doorloopt elke entry
vier statussen:

1. **Draft** — werk in uitvoering, niet zichtbaar online.
2. **In Review** — klaar om te bekijken, nog niet beslist.
3. **Ready** — klaar om te publiceren.
4. **Publish** — live op de site.

In de zijbalk staat een **Workflow**-tab. Drie kolommen (Drafts /
In Review / Ready). Sleep een entry tussen kolommen om de status te
wijzigen, of klik 'm open en gebruik de knoppen rechtsboven.

**Drafts krijgen een preview-URL** (Netlify deploy preview). Niet
publiek vindbaar, maar wie de URL heeft kan 'm zien. Voor portfolio
geen probleem; zeg het tegen Lode als je iets écht verborgen wil houden.

## 4. Een bestaand project wijzigen

1. **Projecten** → klik op het project in de lijst.
2. Pas aan wat je wil.
3. **Publish → Publish now**.

## 5. Foto's herordenen of verwijderen

Open het project. In de Foto's-sectie:

- **Herordenen:** sleep de drie-puntjes-handle (≡) naast een foto
  om hem boven of onder een andere te zetten. De volgorde hier = de
  volgorde op de detailpagina.
- **Verwijderen:** klik het kruisje (×) rechts naast de foto-entry.
  De foto zelf blijft in de repo staan — alleen de koppeling met het
  project is weg. Lode kan oude bestanden later opruimen.

## 6. Een project verwijderen

**Projecten** → open project → linksonderaan **"Delete entry"** →
bevestig → **Publish**.

## 7. Site-instellingen aanpassen

**Site** → "Site instellingen". Hier verander je:

- Artiestnaam — verschijnt in de header van elke pagina.
- Publiek email — gebruikt op de contactpagina.
- Instagram / Behance / LinkedIn / eigen-website URLs — verschijnen
  als links op de contactpagina. **Leeg laten = niet tonen.**

Publish → live binnen 30 sec.

## 8. Twee talen

De site bestaat in **Nederlands** (`/`) en **Engels** (`/en/`). Per
project kan je apart een Engelse vertaling invullen (`Naam — Engels`,
`Titel — Engels`, `Info — Engels`). **Laat je een Engels veld leeg →
de Nederlandse versie wordt automatisch gebruikt op de Engelse site.**

## 9. Wat als er iets misgaat?

- **"Build failed" mail van Netlify:** stuur 'm door naar Lode. Niets
  is stuk aan de live site — die blijft op de vorige werkende versie.
- **Foto laadt niet na publish:** wacht 1 minuut, doe hard refresh
  (Ctrl+Shift+R). Build kan tot een minuut duren bij grote bestanden.
- **Per ongeluk iets weggegooid:** alles is versie-beheerd in git
  (`github.com/xallexe/portfolio`). Lode kan elke wijziging terugdraaien.

## 10. Tips

- **Fotoformaten:** JPG of PNG, liefst niet groter dan ~3000px breed
  en onder ~2MB per foto. De site herschaalt automatisch maar grote
  bestanden vertragen de build.
- **Bestandsnamen:** geen spaties, geen accenten. Vervang door
  liggende streepjes. Bv. `zomer_serie_01.jpg`, niet `Zomer Serie 1.jpg`.
- **Eén tabblad tegelijk:** edit niet hetzelfde project in twee
  browser-tabs — laatste publish wint.
