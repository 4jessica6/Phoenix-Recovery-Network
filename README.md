# Phoenix Recovery Network — website

Static site for https://www.phoenixrecoverynetwork.com/, hosted on GitHub Pages from the `main` branch root.
Design: Claude Design handoff v8 (October 2026). No frameworks, no build dependencies beyond Node.

## Layout

- `index.html`, `homes/`, `404.html`, `sitemap.xml` — generated pages (do not edit by hand)
- `assets/` — stylesheet, script, fonts, logos, per-home photos and walkthrough reels, the homepage header reel
- `tools/site-data.js` — **all copy and per-home details live here** (names, cities, capacity, nearby distances, photos, phone, Sobriety Hub links, feature flags)
- `tools/build-site.js` — generator
- `tools/indiana-path.txt` — SVG outline used by the map
- `CNAME`, `robots.txt` — hosting

## Editing

1. Change `tools/site-data.js`.
2. Run `node tools/build-site.js --launch` to regenerate the live pages at the repo root, then commit and push. GitHub Pages rebuilds in about a minute.
3. For a client preview before going live, run `node tools/build-site.js` (no flag). That writes a `noindex` copy with a preview bar into `preview/`; delete the folder again before committing, or keep it out of the commit.

## Feature flags (in `site-data.js`)

- `SHOW_BEDS` — Sobriety Hub live-occupancy widgets on the homepage and house pages
- `SHOW_FOUNDERS` — "Our founders" block on house pages (needs the story and portrait)

## Adding a home

Add an entry to `homes` in `site-data.js`, put its photos and `walkthrough.mp4` under `assets/homes/<slug>/`, rebuild. Counts, the map, the footer and the sitemap update automatically. Street addresses are never published; slugs use house names only.

## Walkthrough reels

Made with the `listing-walkthrough` skill (OpenArt image-to-video + ffmpeg). Working files and the header-reel master live outside the repo in `Downloads\Phoenix Recovery Network Design\walkthrough-videos\`.
