# Phoenix Recovery Network — Coming Soon page

Single-file teaser page for https://www.phoenixrecoverynetwork.com/, served from the site root.

## Files

- `index.html` — the page (inline CSS and JS, no build step; Google Fonts Cormorant Garamond + Inter)
- `Phoenix_Hero_Video_Web.mp4` — 1080p desktop background video
- `Phoenix_Hero_Video_Mobile_720p.mp4` — served under 768px wide
- `Phoenix_Hero_Video_Poster.jpg` — video poster, reduced-motion fallback, and OG/Twitter image
- `PRN_White_web.png` — logo
- `favicon.png`, `favicon-32.png` — icons

All assets are referenced by relative path, so they must stay next to `index.html`.

## Editing

- **Launch time**: `LAUNCH_DATE` at the top of the script in `index.html`
  (currently `2026-10-23T00:01:00-04:00`, 12:01 AM Indianapolis time).
- **Preview the "We're live" view**: add `?test=10` to the URL to count down from 10 seconds.
- **Colors**: CSS variables in `:root`.
- **Phone number**: commented block marked `PHONE NUMBER PLACEHOLDER`.
- **Post-launch button**: marked `POST-LAUNCH BUTTON LINK` (href is `/` for now).
- The OG/Twitter image tags use the absolute URL
  `https://www.phoenixrecoverynetwork.com/Phoenix_Hero_Video_Poster.jpg`, so the poster must be
  published at the site root (or those tags updated).

## Hosting notes

The host must serve the `.mp4` files as `video/mp4` with HTTP byte-range support, or iPhones
will not play the background video.
