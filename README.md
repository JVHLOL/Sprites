# Sprite Locker — Fortnite Sprite Collection Tracker

Fan-made checklist for Fortnite Sprites (Chapter 7 Season 3).  
~25 base sprites / ~117 variants. Progress saved in `localStorage`.

**Live (when published):** https://jvhlol.github.io/Sprites/

## Features

- Full grid: Normal · Gold · Gummy · Galaxy · Gem · Holofoil · Cube · Quack
- States: Missing → Owned → Mastered → Lost (click to cycle)
- Collection + Mastery progress bars
- Per-rarity breakdown
- Filters (owned / missing / mastered / rarity / variant)
- Show levels toggle
- Rarest still missing list
- Export JSON backup / Reset

## Run locally

```bash
# any static server
npx serve .
# or
python -m http.server 5500
```

Open `http://localhost:5500` (modules require a server; `file://` will fail).

## Structure

```
index.html
css/styles.css
js/data.js      # roster + variant availability
js/app.js       # state, stats, render
```

## Deploy to GitHub Pages

1. Push this folder to the `JVHLOL/Sprites` repo (or set Pages source to `/` on `main`).
2. Enable Pages → Deploy from branch `main` / root.

## Notes

- Sprite images are placeholders (emoji). Swap in real assets under `assets/` and update `cardHTML` in `app.js` if desired.
- Dust costs and exact release flags are community approximations.
- Not affiliated with Epic Games.
