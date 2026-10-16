#!/usr/bin/env node
// Builds the static site into preview/ from tools/site-data.js. No dependencies.
//   node tools/build-site.js            → preview build (noindex, preview bar, [placeholders] tinted)
//   node tools/build-site.js --launch   → launch build (no preview bar, hero video paths at site root)
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('./site-data.js');

const LAUNCH = process.argv.includes('--launch');
const REPO = path.join(__dirname, '..');
const OUT = path.join(REPO, 'preview');
const HERO = LAUNCH ? '' : '../';   // the teaser's hero video files live at the repo root

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Escape, then tint [placeholders] in the preview build so the client can spot what is still TBC.
const t = s => esc(s).replace(/\[([^\]]+)\]/g, LAUNCH ? '[$1]' : '<span class="tbc">[$1]</span>');
const raw = s => String(s); // trusted HTML from site-data (e.g. <em>)

function status(h) {
  if (h.beds === 0) return { cls: '', text: 'Waitlist open' };
  if (typeof h.beds === 'number') return { cls: 'open', text: 'Beds available' };
  return { cls: '', text: 'Ask about openings' };
}
function bedsText(h) {
  if (h.beds === 0) return 'Waitlist open';
  if (h.beds === 1) return '1 bed available now';
  if (typeof h.beds === 'number') return h.beds + ' beds available now';
  return 'Call for current availability';
}
const homeUrl = (base, h) => `${base}homes/${h.slug}/`;
const homeImg = (base, h, i) => h.photos[i] ? `${base}assets/homes/${h.slug}/${h.photos[i][0]}` : null;

/* ---------- shared chrome ---------- */
function previewBar(base, current) {
  if (LAUNCH) return '';
  const link = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<div class="preview-bar"><span><b>PREVIEW</b> · Working build for review. Anything in <span class="tbc">[brackets]</span> is a placeholder still to be confirmed.</span>
<nav>${link(base || './', 'Network site', 'network')}${link(base + 'homes/', 'All homes', 'homes')}</nav></div>`;
}

function header(base, kind, home) {
  const home_ = base || './';
  if (kind === 'house') {
    return `<header class="site-header"><div class="inner">
  <a class="brand" href="#top"><img src="${base}assets/img/phoenix-mark.png" alt="${esc(home.name)}"><span class="lockup"><span class="l1">PHOENIX HOUSE</span><span class="l2">A PHOENIX RECOVERY NETWORK HOME</span></span></a>
  <nav class="site-nav" aria-label="This house"><a href="#house">The house</a><a href="#life">Daily life</a><a href="#area">Neighborhood</a><a href="#questions">Questions</a><a class="pill-outline" href="#availability">Check availability</a></nav>
</div></header>`;
  }
  const onHome = kind === 'network';
  const l = h => (onHome ? h : home_ + h);
  return `<header class="site-header"><div class="inner">
  <a class="brand" href="${home_}"><img src="${base}assets/img/phoenix-mark.png" alt="Phoenix Recovery Network"><span class="lockup"><span class="l1">PHOENIX</span><span class="l2">RECOVERY NETWORK</span></span></a>
  <nav class="site-nav" aria-label="Site"><a href="${base}homes/">Homes</a><a href="${l('#approach')}">Our approach</a><a href="${l('#families')}">Families &amp; referrals</a><a class="pill-outline" href="${l('#availability')}">Check availability</a></nav>
</div></header>`;
}

function footer(base, kind, home) {
  const home_ = base || './';
  const homesLinks = D.homes.map(h => `<a href="${homeUrl(base, h)}">${t(h.name)}, ${t(h.city)}</a>`).join('');
  const first = kind === 'house'
    ? `<div class="logos"><img src="${base}assets/img/phoenix-house-white.png" alt="Phoenix House"><div class="sep"></div><img src="${base}assets/img/prn-white.png" alt="Phoenix Recovery Network"></div>`
    : `<div class="brandcol"><img src="${base}assets/img/prn-white.png" alt="Phoenix Recovery Network"><div>Structured sober living homes for men across Indiana.</div></div>`;
  const second = kind === 'house'
    ? `<div class="col"><div class="k">This house</div><a href="#house">The house</a><a href="#life">Daily life</a><a href="#questions">Questions</a><a href="#availability">Check availability</a></div>
<div class="col"><div class="k">The network</div><a href="${home_}">Phoenix Recovery Network</a><a href="${home_}#approach">Our approach</a><a href="${base}homes/">All homes</a></div>`
    : `<div class="col"><div class="k">Explore</div><a href="${base}homes/">Our homes</a><a href="${home_}#approach">Our approach</a><a href="${home_}#families">Families &amp; referrals</a><a href="${home_}#availability">Check availability</a></div>
<div class="col"><div class="k">Homes</div>${homesLinks}</div>`;
  return `<footer class="site-footer">
<div class="cols">${first}${second}
<div class="col"><div class="k">Contact</div><span>${t(D.PHONE)}</span><a href="mailto:${D.EMAIL}">${D.EMAIL}</a></div></div>
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
<meta name="theme-color" content="#0D0D3F">
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
${footer(base, kind, home)}
</body>
</html>
`;
}

/* ---------- pieces ---------- */
function mark(base, size) {
  return `<div class="mark${size === 'sm' ? ' sm' : ''}" data-embers><div class="halo"></div><div class="float"><img src="${base}assets/img/phoenix-mark.png" alt=""></div></div>`;
}
const emptyTile = (label, cls = 'tile') => `<div class="${cls} empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-7 7"/></svg><span>${esc(label)}</span></div>`;

function gallery(base, h) {
  const tiles = [];
  const p = h.photos;
  if (p[0]) {
    const front = homeImg(base, h, 0);
    tiles.push(h.video
      ? `<div class="tile big"><video muted loop playsinline preload="none" poster="${front}" data-src="${base}assets/homes/${h.slug}/${h.video}" aria-label="Walkthrough of ${esc(h.name)}"></video><span class="tag">Walkthrough</span></div>`
      : `<div class="tile big"><img src="${front}" alt="${esc(p[0][1])}, ${esc(h.name)}"></div>`);
  } else tiles.push(emptyTile('Front of the house · photo coming soon', 'tile big'));
  const labels = ['Living room', 'Kitchen', 'Bedroom', 'Porch or backyard'];
  for (let i = 1; i <= 4; i++) {
    tiles.push(p[i] ? `<div class="tile"><img src="${homeImg(base, h, i)}" alt="${esc(p[i][1])}, ${esc(h.name)}" loading="lazy"></div>` : emptyTile(labels[i - 1] + ' · photo coming soon'));
  }
  return `<section class="gallery" aria-label="Photos"><div class="grid">${tiles.join('')}</div></section>`;
}

function homeCard(base, h) {
  const s = status(h);
  const thumb = h.photos[0] ? `<img src="${homeImg(base, h, 0)}" alt="${esc(h.name)}" loading="lazy">` : '';
  return `<a class="home-card" href="${homeUrl(base, h)}"><div class="thumb">${thumb}</div><div><div class="city">${t(h.city)}, Indiana</div><div class="name">${t(h.name)}</div><div class="status ${s.cls}">${s.text}</div></div></a>`;
}

function homeFeature(base, h) {
  const s = status(h);
  const photo = h.photos[0] ? `<div class="photo"><img src="${homeImg(base, h, 0)}" alt="${esc(h.photos[0][1])}, ${esc(h.name)}" loading="lazy"></div>` : `<div class="photo empty">Photos coming soon</div>`;
  return `<a class="home-feature" href="${homeUrl(base, h)}" data-reveal>${photo}
<div class="meta"><div><div class="city">${t(h.city)}, Indiana</div><div class="name">${t(h.name)}</div></div><div class="status ${s.cls}">${s.text}</div></div>
<div class="go">Explore the house<span>→</span></div></a>`;
}

function inquiryForm(base, homeName) {
  return `<div class="form-card" data-reveal>
<form data-inquiry${D.FORM_ENDPOINT ? ` data-endpoint="${esc(D.FORM_ENDPOINT)}"` : ''}${homeName ? ` data-home="${esc(homeName)}"` : ''} novalidate>
  <input type="hidden" name="audience" value="For myself"><input type="hidden" name="home" value="${esc(homeName || '')}">
  <div class="lbl">I'm reaching out</div>
  <div class="chips"><button type="button" class="chip" data-aud="self" aria-pressed="true">For myself</button><button type="button" class="chip" data-aud="loved" aria-pressed="false">For someone I love</button><button type="button" class="chip" data-aud="client" aria-pressed="false">For a client</button></div>
  <div class="fields">
    <label class="field" data-name-label>Your name<input name="name" placeholder="First and last name" autocomplete="name"></label>
    <label class="field">Phone<input name="phone" type="tel" placeholder="(000) 000-0000" autocomplete="tel"></label>
    <label class="field">Email<input name="email" type="email" placeholder="you@example.com" autocomplete="email"></label>
    <label class="field" data-timing-label>Ideal move-in<select name="timing"><option>As soon as possible</option><option>Within 2 weeks</option><option>Within a month</option><option>Just exploring</option></select></label>
  </div>
  <label class="field full">How can we help?<textarea name="message" rows="3" placeholder="Where you are in recovery and what you’re looking for. Share whatever you’re comfortable with."></textarea></label>
  <div class="form-note">Please don't include detailed medical information.</div>
  <button type="submit" class="btn">Request a call back</button>
  <div class="apply">Already ready to move in? <a href="${D.APPLY_URL}">Apply online</a></div>
</form>
<div class="thanks" hidden>
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <div class="t">Thank you. We'll call you soon.</div>
  <div class="b">Someone from Phoenix will reach out personally, usually within one business day.</div>
  <div class="row"><span data-nudge>Ready to move forward now?</span><a class="btn navy" href="${D.APPLY_URL}">Start your application</a></div>
  <button type="button" class="again">Send another request</button>
</div>
</div>`;
}

/* ---------- pages ---------- */
function networkPage() {
  const base = '';
  const N = D.network;
  const featured = D.homes.filter(h => h.photos.length).slice(0, 4);
  const body = `
<section class="hero network"><div class="glow"></div><div class="inner">
  ${mark(base, 'sm')}
  <div class="eyebrow">${t(N.heroEyebrow)}</div>
  <h1>${raw(N.heroTitle)}</h1>
  <p class="lede">${t(N.heroLede)}</p>
  <div class="actions"><a class="btn" href="#availability">Check availability</a><span class="or-call">or call <strong>${t(D.PHONE)}</strong></span></div>
</div></section>

<section class="wrap" aria-label="A Phoenix home"><div class="hero-media">
  <video muted loop playsinline preload="none" poster="${HERO}Phoenix_Hero_Video_Poster.jpg" data-src="${HERO}Phoenix_Hero_Video_Web.mp4" aria-label="A phoenix with glowing ember wings flying over a city skyline at sunset"></video>
</div></section>

<section class="wrap-md section" aria-label="Why Phoenix">
  <p class="statement" data-reveal>${t(N.statement)} <span>${t(N.statementMuted)}</span></p>
  <div class="proofs" data-reveal>${N.proofs.map(p => `<div><div class="t">${t(p.title)}</div><div class="b">${t(p.body)}</div></div>`).join('')}</div>
</section>

<section id="homes" class="section cream2"><div class="wrap">
  <div class="section-head" data-reveal><h2 class="h-display-lg">Our homes</h2><p class="lede" style="margin:0;max-width:380px;font-size:15px">${t(N.homesLede)}</p></div>
  <div class="homes-grid">${featured.map(h => homeFeature(base, h)).join('')}</div>
  <p style="margin-top:40px"><a class="ul-link" href="${base}homes/">See all ${D.homes.length} homes</a></p>
</div></section>

<section id="approach" class="section cream"><div class="wrap">
  <div class="two-col end" data-reveal><h2 class="h-display-lg">${t(N.approachTitle)}</h2><p class="lede" style="margin:0;color:var(--ink2)">${t(N.approachLede)}</p></div>
  <div class="pillars">${N.pillars.map(p => `<div class="pillar" data-reveal><div class="n">${t(p.n)}</div><div class="t">${t(p.title)}</div><div class="b">${t(p.body)}</div></div>`).join('')}</div>
</div></section>

<section class="section"><div class="wrap standards-wrap">
  <div class="photo-trio" data-reveal>${N.lifePhotos.map(p => `<div class="tile"><img src="${base}${p.src}" alt="${esc(p.alt)}" loading="lazy"></div>`).join('')}</div>
  <div data-reveal>
    <h2 style="font-size:clamp(36px,4.4vw,58px);line-height:1.02">${t(N.standardsTitle)}</h2>
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

<section id="availability" class="avail"><div class="glow"></div><div class="inner">
  <div data-reveal>
    <h2>${t(N.availTitle)}</h2>
    <p class="lede">${t(N.availLede)}</p>
    <div class="contact-lines">
      <div><div class="k">Call or text</div><div class="phone">${t(D.PHONE)}</div></div>
      <div><div class="k">Email</div><a href="mailto:${D.EMAIL}">${D.EMAIL}</a></div>
    </div>
  </div>
  ${inquiryForm(base, '')}
</div></section>`;
  return page({ base, kind: 'network', title: N.title, description: N.description, ogImage: 'https://www.phoenixrecoverynetwork.com/Phoenix_Hero_Video_Poster.jpg', body, current: 'network' });
}

function homesIndexPage() {
  const base = '../';
  const body = `
<section class="section cream2"><div class="wrap">
  <div class="section-head"><h2 class="h-display-lg">Our homes</h2><p class="lede" style="margin:0;max-width:380px;font-size:15px">${t(D.network.homesLede)}</p></div>
  <div class="homes-grid compact">${D.homes.map(h => homeFeature(base, h)).join('')}</div>
</div></section>
<section class="cta"><div class="glow"></div><div class="inner" data-reveal>
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <h2>Not sure which home?</h2>
  <p class="lede">Tell us where you are and what you need. We'll point you to the right house and check openings across the network.</p>
  <div class="actions"><a class="btn" href="${base}#availability">Request a call back</a><span class="or-call">or call <strong>${t(D.PHONE)}</strong></span></div>
</div></section>`;
  return page({ base, kind: 'index', title: 'Our Homes | Phoenix Recovery Network', description: 'Every Phoenix home in Indiana, each with its own page: photos, daily life, neighborhood, cost and current openings.', body, current: 'homes' });
}

function homePage(h) {
  const base = '../../';
  const H = Object.assign({}, D.homeDefaults, h);
  const name = H.name;
  const others = D.homes.filter(o => o.slug !== h.slug).slice(0, 3);
  const bt = bedsText(H);
  const front = homeImg(base, H, 0);
  const body = `
<section class="hero"><div class="glow"></div><div class="inner">
  ${mark(base)}
  <div class="eyebrow">Sober living for men · ${t(H.city)}, Indiana</div>
  <h1>${t(name)}</h1>
  <p class="lede">${t(H.lede)}</p>
  <div class="beds${typeof H.beds === 'number' ? '' : ' tbc'}"><span class="dot"></span>${esc(bt)}</div>
</div></section>

${gallery(base, H)}

<section id="house" class="wrap" style="padding-top:clamp(48px,6vw,80px)"><div class="glance">
  ${H.glance.map(g => `<div><div class="k">${t(g.k)}</div><div class="v">${t(g.v)}</div><div class="sub">${t(g.sub)}</div></div>`).join('')}
</div></section>

<section class="wrap section"><div class="two-col">
  <div data-reveal><h2 class="h-display">${t(H.insideTitle)}</h2><p class="lede" style="max-width:460px">${t(H.insideBody)}</p></div>
  <div class="list-grid" data-reveal>${H.amenities.map(a => `<div>${t(a)}</div>`).join('')}</div>
</div></section>

<section id="life" class="section cream"><div class="wrap">
  <div class="two-col end" data-reveal><h2 class="h-display">A week at ${t(name)}.</h2><p class="lede" style="margin:0;color:var(--ink2)">Every Phoenix home follows the same network standards. Here's how they show up in an ordinary week.</p></div>
  <div class="rhythm">${H.rhythm.map(r => `<div class="row" data-reveal><div class="when">${t(r.when)}</div><div><div class="t">${t(r.title)}</div><div class="b">${t(r.body)}</div></div></div>`).join('')}</div>
  <p style="margin-top:32px"><a class="ul-link accent" href="${base}#approach">How Phoenix homes work</a></p>
</div></section>

<section class="wrap-md section"><div class="manager" data-reveal>
  <div class="portrait">${H.manager.photo ? `<img src="${base}assets/homes/${h.slug}/${H.manager.photo}" alt="${esc(H.manager.name)}, house manager" loading="lazy">` : emptyTile('House manager portrait')}</div>
  <div class="quote"><blockquote>“${t(H.manager.quote)}”</blockquote><div class="by"><strong>${t(H.manager.name)}</strong><span> · House manager</span></div></div>
</div></section>

<section id="area" class="section cream2"><div class="wrap two-col center">
  <div data-reveal>
    <h2 class="h-display">Close to what recovery runs on.</h2>
    <p class="lede">${t(H.areaBody)}</p>
    <div class="nearby">${H.nearby.map(n => `<div><span>${t(n.what)}</span><span>${t(n.dist)}</span></div>`).join('')}</div>
  </div>
  <div class="map" data-reveal>Neighborhood map · general area only, no pin · coming soon</div>
</div></section>

<section class="wrap section"><div class="two-col" data-reveal>
  <div>
    <div class="eyebrow">What it costs</div>
    <div class="price"><span class="amt">${t(H.rent)}</span><span class="per">per week</span></div>
    <p class="lede" style="font-size:15.5px;max-width:440px">${t(H.rentBody)}</p>
  </div>
  <div>
    <div class="eyebrow muted">Rent includes</div>
    <div class="list-grid under">${H.includes.map(i => `<div>${t(i)}</div>`).join('')}</div>
  </div>
</div></section>

<section id="questions" class="wrap" style="padding-bottom:var(--section)"><div class="two-col" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:32px clamp(48px,6vw,112px)">
  <h2 class="h-display" data-reveal>Good to know.</h2>
  <div class="faq" data-reveal>${H.faqs.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="q">${t(f.q.replace('{name}', name))}</span></summary><div class="a">${t(f.a)}</div></details>`).join('')}</div>
</div></section>

<section id="availability" class="cta"><div class="glow"></div><div class="inner" data-reveal>
  <img src="${base}assets/img/phoenix-mark.png" alt="">
  <h2>Check availability at ${t(name)}.</h2>
  <p class="lede">Confidential and no obligation. Family members and referring professionals are welcome to reach out on someone's behalf.</p>
  <div class="actions"><a class="btn" href="${base}#availability">Request a call back</a><span class="or-call">or call <strong>${t(D.PHONE)}</strong></span></div>
  <div class="apply">Already ready to move in? <a href="${D.APPLY_URL}">Apply online</a></div>
</div></section>

<section class="wrap" style="padding:clamp(56px,7vw,96px) var(--gutter)">
  <div class="section-head"><h2 style="font-size:clamp(30px,3.4vw,44px);line-height:1">Other Phoenix homes</h2><a class="ul-link" href="${base}homes/">See the whole network</a></div>
  <div class="home-cards">${others.map(o => homeCard(base, o)).join('')}</div>
</section>`;
  const title = `${name.replace(/[\[\]]/g, '')} | Sober Living for Men in ${H.city.replace(/[\[\]]/g, '')}, Indiana`;
  const description = `${name.replace(/[\[\]]/g, '')} is a structured sober living home for men in ${H.city.replace(/[\[\]]/g, '')}, Indiana. Furnished rooms, house leadership and peer support. Check bed availability.`;
  return page({ base, kind: 'house', home: H, title, description, ogImage: front ? `https://www.phoenixrecoverynetwork.com/assets/homes/${h.slug}/${H.photos[0][0]}` : null, body, current: h.slug });
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
write('index.html', networkPage());
write('homes/index.html', homesIndexPage());
for (const h of D.homes) write(`homes/${h.slug}/index.html`, homePage(h));
// Warn about photos referenced but missing on disk
for (const h of D.homes) for (const [f] of h.photos) {
  const p = path.join(OUT, 'assets', 'homes', h.slug, f);
  if (!fs.existsSync(p)) console.warn('MISSING photo:', path.relative(REPO, p));
}
