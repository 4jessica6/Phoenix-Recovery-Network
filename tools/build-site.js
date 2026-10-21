#!/usr/bin/env node
// Builds the static site into preview/ from tools/site-data.js. No dependencies.
//   node tools/build-site.js            → preview build (noindex, preview bar, [placeholders] tinted)
//   node tools/build-site.js --launch   → launch build written to the repo root (no bar, indexable, sitemap.xml, 404.html)
// Layout and copy follow the Claude Design handoff v8 (2026-10-21).
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('./site-data.js');

const LAUNCH = process.argv.includes('--launch');
const REPO = path.join(__dirname, '..');
const OUT = LAUNCH ? REPO : path.join(REPO, 'preview');
const SITE = 'https://www.phoenixrecoverynetwork.com';
const INDIANA_PATH = fs.readFileSync(path.join(__dirname, 'indiana-path.txt'), 'utf8').trim();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Escape, then tint [placeholders] in the preview build so the client can spot what is still TBC.
const t = s => esc(s).replace(/\[([^\]]+)\]/g, LAUNCH ? '[$1]' : '<span class="tbc">[$1]</span>');
const plain = s => String(s).replace(/[\[\]]/g, '');
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const word = n => WORDS[n] || String(n);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- derived data ---------- */
const people = h => (plain(h.serves).toLowerCase() === 'women' ? 'women' : 'men');
const servesLabel = h => plain(h.serves).toLowerCase() === 'women' ? 'Women' : 'Men';
const cities = [...new Set(D.homes.map(h => h.city))];
const byCity = c => D.homes.filter(h => h.city === c);
const cityCounts = c => {
  const hs = byCity(c), m = hs.filter(h => people(h) === 'men').length, w = hs.length - m;
  const parts = [];
  if (m) parts.push(`${m} men’s home${m === 1 ? '' : 's'}`);
  if (w) parts.push(`${w} women’s home${w === 1 ? '' : 's'}`);
  return parts.join(' · ');
};
const nearLine = h => {
  const find = k => (h.nearby.find(n => n[0].toLowerCase().includes(k)) || [])[1];
  return [['Meetings', find('aa')], ['Bus', find('bus')], ['Grocery', find('grocery')]].filter(x => x[1]).map(x => `${x[0]} ${x[1]}`).join(' · ');
};
const residents = h => `${h.capacity} residents`;
const homeUrl = (base, h) => `${base}homes/${h.slug}/`;
const homeImg = (base, h, i) => h.photos[i] ? `${base}assets/homes/${h.slug}/${h.photos[i][0]}` : null;
const homeVideo = (base, h) => h.video ? `${base}assets/homes/${h.slug}/${h.video}` : null;
const total = D.homes.length;

/* ---------- shared chrome ---------- */
function previewBar(base, current) {
  if (LAUNCH) return '';
  const link = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<div class="preview-bar"><span><b>PREVIEW</b> · Working build for review. Anything in <span class="tbc">[brackets]</span> is a placeholder still to be confirmed.</span>
<nav>${link(base || './', 'Network site', 'network')}${link(base + 'homes/', 'All homes', 'homes')}</nav></div>`;
}

function header(base, kind, home) {
  const root = base || './';
  if (kind === 'house') {
    return `<header class="site-header"><div class="inner">
  <a class="brand" href="${root}" title="Phoenix Recovery Network"><img src="${base}assets/img/phoenix-mark.png" alt="${esc(home.name)}"><span class="lockup"><span class="l1">${esc(home.name.toUpperCase())}</span><span class="l2">A PHOENIX RECOVERY NETWORK HOME</span></span></a>
  <nav class="site-nav" aria-label="This house"><a href="${root}">Network home</a><a href="#house">The house</a><a href="#life">Daily life</a><a href="#area">Neighborhood</a><a href="#questions">Questions</a><a class="pill-cta" data-apply-cta href="#availability">Apply now</a></nav>
</div></header>`;
  }
  const l = h => (kind === 'network' ? h : root + h);
  return `<header class="site-header"><div class="inner">
  <a class="brand" href="${root}"><img src="${base}assets/img/phoenix-mark.png" alt="Phoenix Recovery Network"><span class="lockup"><span class="l1">PHOENIX</span><span class="l2">RECOVERY NETWORK</span></span></a>
  <nav class="site-nav" aria-label="Site"><a href="${base}homes/">Homes</a><a href="${l('#approach')}">Our approach</a><a href="${l('#families')}">Families &amp; referrals</a><a class="pill-cta" data-apply-cta href="${l('#availability')}">Apply now</a></nav>
</div></header>`;
}

function footer(base, kind) {
  const root = base || './';
  const first = kind === 'house'
    ? `<div class="logos"><img src="${base}assets/img/phoenix-house-white.png" alt="Phoenix House"><div class="sep"></div><img src="${base}assets/img/prn-white.png" alt="Phoenix Recovery Network"></div>`
    : `<div class="brandcol"><img src="${base}assets/img/prn-white.png" alt="Phoenix Recovery Network"><div>Structured sober living homes for men and women across Indiana.</div></div>`;
  const second = kind === 'house'
    ? `<div class="col"><div class="k">This house</div><a href="#house">The house</a><a href="#life">Daily life</a><a href="#questions">Questions</a><a href="#availability">Apply now</a></div>
<div class="col"><div class="k">The network</div><a href="${root}">Phoenix Recovery Network</a><a href="${root}#approach">Our approach</a><a href="${base}homes/">All homes</a></div>`
    : `<div class="col"><div class="k">Explore</div><a href="${base}homes/">Our homes</a><a href="${root}#mission">Mission &amp; vision</a><a href="${root}#approach">Our approach</a><a href="${root}#families">Families &amp; referrals</a><a href="${root}#availability">Apply now</a></div>
<div class="col"><div class="k">Homes</div>${cities.map(c => `<a href="${base}homes/#${c.toLowerCase()}">${esc(c)} · ${byCity(c).length} homes</a>`).join('')}</div>`;
  return `<footer class="site-footer">
<div class="cols">${first}${second}
<div class="col"><div class="k">Contact</div><a href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a><a href="mailto:${D.EMAIL}">${D.EMAIL}</a></div></div>
<div class="legal"><div><span><strong>In crisis?</strong> Call or text <a href="tel:988">988</a>. In an emergency, call <a href="tel:911">911</a>.</span><span>© 2026 Phoenix Recovery Network · Indiana</span></div></div>
</footer>`;
}

function page({ base, kind, home, title, description, ogImage, body, current }) {
  const noindex = LAUNCH ? '' : '\n<meta name="robots" content="noindex, nofollow">';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">${noindex}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:site_name" content="Phoenix Recovery Network">${ogImage ? `\n<meta property="og:image" content="${esc(ogImage)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B0B26">
<link rel="icon" type="image/png" sizes="32x32" href="${base}assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="${base}assets/img/favicon.png">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/fonts/newsreader-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/fonts/montserrat-latin.woff2">
<link rel="stylesheet" href="${base}assets/css/site.css">
<script defer src="${base}assets/js/site.js"></script>
</head>
<body>
${previewBar(base, current)}
${header(base, kind, home)}
<main id="top">
${body}
</main>
${footer(base, kind)}
</body>
</html>
`;
}

/* ---------- pieces ---------- */
function mark(base, size) {
  return `<div class="mark${size === 'lg' ? ' lg' : ''}" data-phx-mark data-embers><div class="halo"></div><div class="float"><div class="flap"><img src="${base}assets/img/phoenix-mark.png" alt=""></div></div></div>`;
}
const emptyTile = (label, cls = 'tile') => `<div class="${cls} empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-7 7"/></svg><span>${esc(label)}</span></div>`;
const applyFrame = (title) => `<div class="apply-card">
  <iframe src="${esc(D.APPLY_URL)}" title="${esc(title)}" loading="lazy"></iframe>
  <div class="apply-note"><span>Secure application powered by Sobriety Hub.</span><a href="${esc(D.APPLY_URL)}" target="_blank" rel="noopener">Open in a new tab ↗</a></div>
</div>`;

function gallery(base, h) {
  const tiles = [];
  const front = homeImg(base, h, 0), video = homeVideo(base, h);
  if (video) tiles.push(`<div class="tile big"><video muted loop playsinline preload="none" poster="${front || ''}" data-src="${video}" aria-label="Walkthrough of ${esc(h.name)}"></video><span class="tag">Walkthrough</span></div>`);
  else if (front) tiles.push(`<div class="tile big"><img src="${front}" alt="${esc(h.photos[0][1])}, ${esc(h.name)}"></div>`);
  else tiles.push(emptyTile('Front of the house · photo coming soon', 'tile big'));
  const labels = ['Living room', 'Kitchen', 'Bedroom', 'Porch or backyard'];
  for (let i = 1; i <= 4; i++) {
    tiles.push(h.photos[i] ? `<div class="tile"><img src="${homeImg(base, h, i)}" alt="${esc(h.photos[i][1])}, ${esc(h.name)}" loading="lazy"></div>` : emptyTile(labels[i - 1] + ' · photo coming soon'));
  }
  return `<section class="gallery" aria-label="Photos"><div class="grid">${tiles.join('')}</div></section>`;
}

function homeCard(base, h) {
  const media = h.photos[0] ? `<img src="${homeImg(base, h, 0)}" alt="${esc(h.photos[0][1])}, ${esc(h.name)}" loading="lazy">` : `<span class="ph">Exterior photo</span>`;
  return `<a class="home-card" href="${homeUrl(base, h)}">
  <div class="media">${media}<span class="learn">LEARN MORE<span>→</span></span></div>
  <div class="eyebrow-sm">${t(servesLabel(h).toUpperCase() + ' · ' + h.city.toUpperCase())}</div>
  <div class="name">${t(h.name)}</div>
  <div class="meta">${t(residents(h))}</div>
  <div class="near">${t(nearLine(h))}</div>
</a>`;
}

function homesByCity(base, opts = {}) {
  return cities.map(c => `<div class="city-group" id="${c.toLowerCase()}" data-reveal>
  <div class="city-head"><h3>${esc(c)}</h3><span>${byCity(c).length} HOMES</span></div>
  <div class="home-cards">${byCity(c).map(h => homeCard(base, h)).join('')}</div>
</div>`).join('');
}

function otherCard(base, h) {
  const thumb = h.photos[0] ? `<img src="${homeImg(base, h, 0)}" alt="${esc(h.name)}" loading="lazy">` : '';
  return `<a class="other-card" href="${homeUrl(base, h)}"><div class="thumb">${thumb}</div><div><div class="eyebrow-sm">${t(servesLabel(h).toUpperCase() + ' · ' + h.city.toUpperCase())}</div><div class="name">${t(h.name)}</div><div class="meta">${t(residents(h))}</div></div></a>`;
}

function mapSvg() {
  const pos = {
    Indianapolis: [[250.6, 318.4], [248.8, 318.2], [245.9, 311.1], [253.4, 312.0], [243.0, 320.5]],
    Anderson: [[297.2, 277.5], [305.6, 270.5], [307.8, 274.2], [294.1, 275.6], [301.0, 281.6], [299.5, 268.8]]
  };
  let i = 0, orbs = '';
  for (const c of cities) {
    byCity(c).forEach((h, k) => {
      const [x, y] = (pos[c] || pos.Anderson)[k % (pos[c] || pos.Anderson).length];
      orbs += `<circle cx="${x}" cy="${y}" r="14" fill="url(#phxOrb)" class="orb" style="animation-delay:${(i * 0.45).toFixed(2)}s"></circle><circle cx="${x}" cy="${y}" r="2.6" fill="#FFE2BF"></circle>`;
      i++;
    });
  }
  const indy = byCity('Indianapolis').length, and = byCity('Anderson').length;
  return `<svg viewBox="0 0 455 640" role="img" aria-label="Map of Indiana showing approximate locations of Phoenix homes in Indianapolis and Anderson" class="map-svg">
  <defs><radialGradient id="phxOrb"><stop offset="0" stop-color="#FFD3A1" stop-opacity="1"/><stop offset=".35" stop-color="#F2A65A" stop-opacity=".75"/><stop offset="1" stop-color="#F2A65A" stop-opacity="0"/></radialGradient><radialGradient id="phxArea"><stop offset="0" stop-color="#F2A65A" stop-opacity=".28"/><stop offset="1" stop-color="#F2A65A" stop-opacity="0"/></radialGradient></defs>
  <path d="${INDIANA_PATH}" fill="#13133A" stroke="rgba(255,255,255,.22)" stroke-width="1.2" stroke-linejoin="round"/>
  <circle cx="272.4" cy="297.9" r="90" fill="url(#phxArea)"/>
  ${orbs}
  <g font-family="Montserrat, sans-serif">
    <line x1="235.8" y1="328.2" x2="183.8" y2="364.2" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
    <text x="179.8" y="380.2" text-anchor="end" font-size="13" font-weight="600" letter-spacing="2" fill="#F5F1EA">INDIANAPOLIS</text>
    <text x="179.8" y="398.2" text-anchor="end" font-size="11.5" fill="#9C9AB8">${indy} homes</text>
    <line x1="312.9" y1="265.7" x2="348.9" y2="227.7" stroke="rgba(255,255,255,.22)" stroke-width="1"/>
    <text x="352.9" y="213.7" font-size="13" font-weight="600" letter-spacing="2" fill="#F5F1EA">ANDERSON</text>
    <text x="352.9" y="231.7" font-size="11.5" fill="#9C9AB8">${and} homes</text>
  </g>
</svg>`;
}

/* ---------- pages ---------- */
function networkPage() {
  const base = '';
  const N = D.network;
  const body = `
<section class="hero dark network">
  <video class="hero-bg" muted loop playsinline preload="none" poster="${base}assets/network-reel-poster.jpg" data-src="${base}assets/network-reel.mp4" data-src-mobile="${base}assets/network-reel-mobile.mp4" aria-hidden="true"></video><div class="hero-shade"></div>
  <div class="glow"></div><div class="inner">
  ${mark(base, 'lg')}
  <div class="eyebrow light">${t(N.heroEyebrow)}</div>
  <h1>${t(N.heroTitle)}</h1>
  <p class="lede">${t(N.heroLede)}</p>
  <div class="actions"><a class="btn" href="#availability">Apply now</a><span class="or-call">or call <a href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a></span></div>
</div></section>


<section class="wrap-md section" aria-label="Why Phoenix">
  <p class="statement" data-reveal>${t(N.statement)} <span>${t(N.statementMuted)}</span></p>
  <div class="proofs" data-reveal>${N.proofs.map(p => `<div><div class="t">${t(p.title)}</div><div class="b">${t(p.body)}</div></div>`).join('')}</div>
</section>

<section id="mission" class="wrap mission" aria-label="Mission and vision">
  <div class="mv" data-reveal><div class="eyebrow">Our mission</div><p>${t(N.mission)}</p></div>
  <div class="mv" data-reveal><div class="eyebrow">Our vision</div><p>${t(N.vision)}</p></div>
</section>

<section id="map" class="section dark"><div class="wrap map-wrap">
  <div data-reveal>
    <div class="eyebrow light">Where we are</div>
    <h2 class="h-display-lg">${cap(word(total))} homes across central Indiana.</h2>
    <p class="lede dim">${t(N.mapLede)}</p>
    <div class="city-list">${cities.map(c => `<div><span class="serif">${esc(c)}</span><span>${esc(cityCounts(c))}</span></div>`).join('')}</div>
  </div>
  <div class="map-art" data-reveal>${mapSvg()}</div>
</div></section>

<section id="homes" class="section cream2"><div class="wrap">
  <div class="section-head" data-reveal><h2 class="h-display-lg">Our homes</h2><p class="side-note">${cap(word(total))} homes in ${cities.join(' and ')}. ${t(N.homesLede)}</p></div>
  ${homesByCity(base)}
  ${D.SHOW_BEDS ? `<div class="beds-row" data-reveal><div><div class="eyebrow">Live bed availability</div><div class="serif beds-title">${t(N.bedsTitle)}</div></div><iframe src="${esc(D.BEDS_EMBED)}" title="Bed availability" width="320" height="242" loading="lazy"></iframe></div>` : ''}
</div></section>

<section id="approach" class="section dark"><div class="wrap">
  <div class="two-col end" data-reveal><h2 class="h-display-lg">${t(N.approachTitle)}</h2><p class="lede dim" style="margin:0">${t(N.approachLede)}</p></div>
  <div class="pillars">${N.pillars.map(p => `<div class="pillar" data-reveal><div class="n">${t(p.n)}</div><div class="t">${t(p.title)}</div><div class="b">${t(p.body)}</div></div>`).join('')}</div>
</div></section>

<section class="section"><div class="wrap standards-wrap">
  <div class="photo-trio" data-reveal>${N.lifePhotos.map(p => `<div class="tile"><img src="${base}${p.src}" alt="${esc(p.alt)}" loading="lazy"></div>`).join('')}</div>
  <div data-reveal>
    <h2 class="h-standards">${t(N.standardsTitle)}</h2>
    <p class="lede" style="margin-top:20px;max-width:500px">${t(N.standardsLede)}</p>
    <div class="standards">${N.standards.map(s => `<div><b>${t(s.title)}</b><span>${t(s.body)}</span></div>`).join('')}</div>
  </div>
</div></section>

<section id="families" class="section cream2"><div class="wrap aud">
  <div data-reveal><div class="eyebrow">${t(N.families.eyebrow)}</div><h3>${t(N.families.title)}</h3><p>${t(N.families.body)}</p><a class="ul-link" href="#availability">${t(N.families.link)}</a></div>
  <div data-reveal><div class="eyebrow">${t(N.professionals.eyebrow)}</div><h3>${t(N.professionals.title)}</h3><p>${t(N.professionals.body)}</p><a class="ul-link" href="#availability">${t(N.professionals.link)}</a></div>
</div></section>

<section class="section"><div class="wrap">
  <h2 class="h-display-lg" data-reveal style="max-width:760px">${t(N.stepsTitle)}</h2>
  <div class="steps">${N.steps.map(s => `<div class="step" data-reveal><div class="n">${t(s.n)}</div><div class="t">${t(s.title)}</div><div class="b">${t(s.body)}</div></div>`).join('')}</div>
</div></section>

<section id="availability" class="avail dark"><div class="glow"></div><div class="inner">
  <div data-reveal>
    <h2>${t(N.applyTitle)}</h2>
    <p class="lede dim">${t(N.applyLede)}</p>
    <div class="contact-lines">
      <div><div class="k">Call or text</div><a class="phone" href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a></div>
      <div><div class="k">Email</div><a href="mailto:${D.EMAIL}">${D.EMAIL}</a></div>
    </div>
  </div>
  <div data-reveal>${applyFrame('Phoenix Recovery Network application')}</div>
</div></section>`;
  const og = LAUNCH ? `${SITE}/assets/network-reel-poster.jpg` : `${SITE}/Phoenix_Hero_Video_Poster.jpg`;
  return page({ base, kind: 'network', title: N.title, description: N.description, ogImage: og, body, current: 'network' });
}

function homesIndexPage() {
  const base = '../';
  const body = `
<section class="section cream2"><div class="wrap">
  <div class="section-head"><h2 class="h-display-lg">Our homes</h2><p class="side-note">${cap(word(total))} homes in ${cities.join(' and ')}. ${t(D.network.homesLede)}</p></div>
  ${homesByCity(base)}
</div></section>
<section class="cta dark"><div class="glow"></div><div class="inner" data-reveal>
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <h2>Not sure which home?</h2>
  <p class="lede dim">Tell us where you are and what you need. We’ll point you to the right house and check openings across the network.</p>
  <div class="actions"><a class="btn" href="${base}#availability">Apply now</a><span class="or-call">or call <a href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a></span></div>
</div></section>`;
  return page({ base, kind: 'index', title: 'Our Homes | Phoenix Recovery Network', description: `Every Phoenix home in Indiana, each with its own page: photos, daily life, neighborhood and current openings.`, body, current: 'homes' });
}

function homePage(h) {
  const base = '../../';
  const H = Object.assign({}, D.homeDefaults, h);
  const ppl = people(h), name = h.name;
  const fill = s => String(s).replace(/\{name\}/g, name).replace(/\{people\}/g, ppl);
  const sameCity = D.homes.filter(o => o.slug !== h.slug && o.city === h.city);
  const others = sameCity.concat(D.homes.filter(o => o.slug !== h.slug && o.city !== h.city)).slice(0, 3);
  const front = homeImg(base, H, 0), video = homeVideo(base, H);
  const body = `
<section class="hero dark house"><div class="glow"></div>
  ${video ? `<video class="hero-bg" muted loop playsinline preload="none" poster="${front || ''}" data-src="${video}" data-desktop-only aria-hidden="true"></video><div class="hero-shade"></div>` : ''}
  <div class="inner">
  ${mark(base)}
  <div class="eyebrow light">${t(`Sober living for ${servesLabel(h).toLowerCase()} · ${h.city}, Indiana`)}</div>
  <h1>${t(name)}</h1>
  <p class="lede">${t(fill(H.lede))}</p>
  ${D.SHOW_BEDS && h.bedsHouseId ? `<iframe class="beds-frame" src="${esc(D.BEDS_EMBED)}?houseId=${esc(h.bedsHouseId)}" title="Bed availability at ${esc(name)}" width="320" height="94" loading="lazy"></iframe>` : ''}
</div></section>

${gallery(base, H)}

<section id="house" class="wrap glance-wrap"><div class="glance">
  <div><div class="k">Serves</div><div class="v">${t(servesLabel(h) === 'Women' ? plain(h.serves) === 'Women' ? 'Women in recovery' : h.serves + ' in recovery' : h.serves + ' in recovery')}</div><div class="sub">Adults 18 and over</div></div>
  <div><div class="k">Home type</div><div class="v">Structured sober living</div><div class="sub">Monitored residence</div></div>
  <div><div class="k">Capacity</div><div class="v">${t(residents(h))}</div><div class="sub">Shared and single rooms</div></div>
</div></section>

<section class="wrap section"><div class="two-col">
  <div data-reveal><h2 class="h-display">${t(H.insideTitle)}</h2><p class="lede" style="max-width:460px">${t(H.insideBody)}</p></div>
  <div class="list-grid" data-reveal>${H.amenities.map(a => `<div>${t(a)}</div>`).join('')}</div>
</div></section>

<section id="life" class="section dark"><div class="wrap">
  <div class="two-col end" data-reveal><h2 class="h-display">A week at ${t(name)}.</h2><p class="lede dim" style="margin:0">Every Phoenix home follows the same network standards. Here’s how they show up in an ordinary week.</p></div>
  <div class="rhythm">${H.rhythm.map(r => `<div class="row" data-reveal><div class="when">${t(r.when)}</div><div><div class="t">${t(r.title)}</div><div class="b">${t(r.body)}</div></div></div>`).join('')}</div>
  <p style="margin-top:32px"><a class="ul-link light" href="${base}#approach">How Phoenix homes work</a></p>
</div></section>

${D.SHOW_FOUNDERS ? `<section id="founders" class="wrap-md section"><div class="founders" data-reveal>
  <div class="portrait">${H.founders.photo ? `<img src="${base}assets/img/${H.founders.photo}" alt="${esc(H.founders.names)}">` : emptyTile('Darrell and Chad, black and white portrait')}</div>
  <div><div class="eyebrow">Our founders</div><h2>${t(H.founders.headline)}</h2><p class="lede">${t(H.founders.body)}</p><div class="by"><strong>${t(H.founders.names)}</strong><span> · Founders, Phoenix Recovery Network</span></div></div>
</div></section>` : ''}

<section id="area" class="section cream2"><div class="wrap">
  <div data-reveal>
    <h2 class="h-display">Close to what recovery runs on.</h2>
    <p class="lede">${t(H.area)} The exact address is shared after your phone screening. Times are estimates.</p>
    <div class="nearby">${H.nearby.map(n => `<div><span>${t(n[0])}</span><span>${t(n[1])}</span></div>`).join('')}</div>
  </div>
</div></section>

<section id="questions" class="wrap section"><div class="two-col faq-wrap">
  <h2 class="h-display" data-reveal>Good to know.</h2>
  <div class="faq" data-reveal>${H.faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="q">${t(fill(f.q))}</span></summary><div class="a">${t(fill(f.a))}</div></details>`).join('')}</div>
</div></section>

<section id="availability" class="cta dark apply"><div class="glow"></div><div class="inner" data-reveal>
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <h2>Apply to ${t(name)}.</h2>
  <p class="lede dim">${t(H.applyLede)}</p>
  ${applyFrame(`${name} application`)}
  <div class="talk">Prefer to talk first? Call <a href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a> or email <a class="accent" href="mailto:${D.EMAIL}">${D.EMAIL}</a></div>
</div></section>

<section class="wrap others-wrap">
  <div class="section-head"><h2 class="h-others">Other Phoenix homes</h2><a class="ul-link" href="${base}homes/">See the whole network</a></div>
  <div class="other-cards">${others.map(o => otherCard(base, o)).join('')}</div>
</section>`;
  const title = `${name} | Sober Living for ${servesLabel(h)} in ${h.city}, Indiana`;
  const description = `${name} is a structured sober living home for ${ppl} in ${h.city}, Indiana. Furnished rooms, house leadership and peer support. Apply online or call ${D.PHONE}.`;
  return page({ base, kind: 'house', home: H, title, description, ogImage: front ? `${SITE}/assets/homes/${h.slug}/${H.photos[0][0]}` : null, body, current: h.slug });
}

function notFoundPage() {
  const base = '/';
  const body = `
<section class="cta dark"><div class="glow"></div><div class="inner">
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <h2>That page isn’t here.</h2>
  <p class="lede dim">The link may be out of date. Every Phoenix home has its own page, and the application is one click away.</p>
  <div class="actions"><a class="btn" href="${base}homes/">See our homes</a><span class="or-call">or call <a href="tel:${D.PHONE_TEL}">${esc(D.PHONE)}</a></span></div>
</div></section>`;
  const html = page({ base, kind: 'index', title: 'Page not found | Phoenix Recovery Network', description: 'That page isn’t here. Find every Phoenix home or apply online.', body, current: '' });
  return LAUNCH ? html.replace('</title>', '</title>\n<meta name="robots" content="noindex">') : html;
}
function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ['/', '/homes/'].concat(D.homes.map(h => '/homes/' + h.slug + '/'));
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => '  <url><loc>' + SITE + u + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') + '\n</urlset>\n';
}

/* ---------- write ---------- */
function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log('wrote', path.relative(REPO, file), html.length, 'chars');
}
for (const f of ['favicon-32.png', 'favicon.png']) {
  const src = path.join(REPO, f), dst = path.join(OUT, 'assets', 'img', f);
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
}
// Remove generated home pages that no longer match a slug (e.g. after a rename).
const homesDir = path.join(OUT, 'homes');
if (fs.existsSync(homesDir)) for (const d of fs.readdirSync(homesDir)) {
  const p = path.join(homesDir, d);
  if (fs.statSync(p).isDirectory() && !D.homes.some(h => h.slug === d)) { fs.rmSync(p, { recursive: true }); console.log('removed stale', path.relative(REPO, p)); }
}
write('index.html', networkPage());
write('404.html', notFoundPage());
if (LAUNCH) write('sitemap.xml', sitemap());
write('homes/index.html', homesIndexPage());
for (const h of D.homes) write(`homes/${h.slug}/index.html`, homePage(h));
for (const h of D.homes) for (const [f] of h.photos.concat(h.video ? [[h.video]] : [])) {
  const p = path.join(OUT, 'assets', 'homes', h.slug, f);
  if (!fs.existsSync(p)) console.warn('MISSING asset:', path.relative(REPO, p));
}
