# PrizeWire — Sports Prize Money Database

The definitive source for sports prize money, player salaries, and tournament payout data.
Built for Vercel static deployment. No framework. No build step. Push to GitHub → live in seconds.

---

## File Structure

```
prizewire/
├── index.html                  ← Homepage (don't edit often)
├── vercel.json                 ← Deployment config (set once, forget)
├── css/
│   └── style.css               ← All styles (edit for design changes)
├── js/
│   └── app.js                  ← Loads payouts.json, renders dynamic content
├── data/
│   └── payouts.json            ← ⭐ THE MAIN FILE YOU UPDATE
└── articles/
    ├── _template.html          ← Copy this for every new payout article
    ├── pga-championship-2026-payout.html
    ├── nba-finals-2026-payout.html
    └── ...
```

---

## ⚡ Update Workflow (when new payout data drops)

### Option A — Homepage data only (fastest)
New tournament ends, you want the homepage to reflect it immediately:

1. Open `data/payouts.json`
2. Edit the relevant arrays:
   - `ticker[]` — add a ticker item
   - `featured[]` — add/update a card (or replace an old one)
   - `leaderboard[]` — add if it's a top prize pool
   - `articles[]` — add the article entry
3. Commit & push → Vercel deploys in ~15 seconds

### Option B — Full article + homepage update (standard)
Tournament ends, you want a standalone SEO article AND updated homepage:

**File 1:** `articles/[event-slug].html`
1. Copy `articles/_template.html`
2. Rename it: `articles/pga-championship-2026-payout.html`
3. Find & replace all `{{PLACEHOLDERS}}` with real data (see template header for reference)
4. Write the article body sections

**File 2:** `data/payouts.json`
1. Add entry to `ticker[]`
2. Add entry to `featured[]` (or update existing)
3. Add entry to `articles[]`
4. Add entry to `leaderboard[]` if applicable

**Commit both files → push → done.**

---

## Initial Setup (one-time)

### 1. GitHub
```bash
git init
git add .
git commit -m "Initial PrizeWire launch"
git remote add origin https://github.com/YOUR_USERNAME/prizewire.git
git push -u origin main
```

### 2. Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework Preset: **Other** (static site, no framework)
4. Root Directory: `/` (leave default)
5. Click Deploy
6. Add your custom domain under Project → Settings → Domains

### 3. Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Domain or URL prefix
3. Choose HTML tag verification
4. Copy the `content="..."` value
5. Replace `REPLACE_WITH_YOUR_GSC_VERIFICATION_CODE` in:
   - `index.html` (line 13)
   - `articles/_template.html` (line ~48)
6. Push → verify

### 4. Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com) → create GA4 property
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. In `index.html`, uncomment the GA4 block (~line 66) and replace `GA_MEASUREMENT_ID`
4. Do the same in `articles/_template.html`
5. Push

### 5. Ads Setup
The site has labeled ad slots ready to fill:
- **728×90 Leaderboard** — top of homepage (high visibility)
- **300×250 Rectangle** — sidebar / inline
- **300×600 Half Page** — article sidebar
- **Affiliate slot** — homepage sponsor block

For Google AdSense: replace the `<!-- INSERT AD CODE -->` comments with your AdSense `<ins>` tags.
For direct ads / affiliate: replace the `.ad-slot` divs with your partner code.

Recommended ad partners for this audience (male 25–45):
- Google AdSense (easiest start)
- Sports betting affiliates: DraftKings, FanDuel, BetMGM
- Financial: Fidelity, E*TRADE, SoFi
- Sports gear: Nike, Fanatics

---

## SEO Checklist (first 30 days)

- [ ] Submit sitemap to Google Search Console: `https://prizewire.com/sitemap.xml`
- [ ] Create `sitemap.xml` listing all article URLs
- [ ] Submit to Bing Webmaster Tools (separate from Google)
- [ ] Get backlinks: post payout data on Reddit (r/golf, r/formula1, r/nfl) linking back
- [ ] Each article should target one specific query, e.g.:
  - "PGA Championship 2026 payout"
  - "how much does Super Bowl winner get"
  - "F1 prize money 2026 breakdown"
- [ ] Add `sitemap.xml` to `vercel.json` static routes if needed

---

## Adding a New Sport Category

1. Add sport tab in `index.html` (`.sport-tab` button)
2. Add sport panel content in `index.html` (`.sport-panel` div)
3. Add sport to the nav in `index.html` and `articles/_template.html`
4. Add sport color in `js/app.js` → `SPORT_COLORS` object
5. Create `/sport-name/` folder with an `index.html` category page (copy from homepage, filter by sport)

---

## Contacts / Business

- **Ads & partnerships:** ads@prizewire.com
- **Data corrections:** corrections@prizewire.com
- **Press:** press@prizewire.com

---

## Data Sources by Sport

| Sport  | Primary Source                          |
|--------|-----------------------------------------|
| PGA    | pgatour.com official press releases     |
| NFL    | nfl.com / NFLPA disclosures             |
| NBA    | nba.com / Basketball Reference          |
| F1     | fia.com / motorsport.com FOM reports    |
| Tennis | atptour.com / wtatennis.com             |
| UFC    | State athletic commission disclosures   |
| MLB    | mlb.com / MLBPA                         |
| NHL    | nhl.com / NHLPA                         |

---

*Built with vanilla HTML/CSS/JS. Zero dependencies. Zero build tools. Deploys in seconds.*
