/* Phoenix Recovery Network — shared behaviour (no dependencies). Ported from the Claude Design handoff v8. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal, same timing as the design */
  var els = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'none'; io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.transition = 'opacity 1.2s ease, transform 1.2s cubic-bezier(.2,.7,.2,1)';
      el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
      io.observe(el);
    });
  }

  /* Hero mark: rising embers, plus sparks the phoenix carries to the "Apply now" button */
  var mark = document.querySelector('.mark[data-embers]');
  var cta = document.querySelector('[data-apply-cta]');
  if (mark && !reduce) {
    [-38, -14, 6, 24, 44, -26, 34].forEach(function (dx, i) {
      var s = document.createElement('span');
      s.className = 'ember' + (i % 2 ? ' odd' : '');
      s.style.left = 'calc(50% + ' + dx + 'px)';
      s.style.setProperty('--dx', (dx * 0.6) + 'px');
      s.style.animationDuration = (3.2 + (i % 3) * 0.9) + 's';
      s.style.animationDelay = (1.6 + i * 0.55) + 's';
      mark.appendChild(s);
    });
    var carries = [];
    if (cta) {
      [-30, -12, 0, 14, 28, -22, 20, 6, -6].forEach(function (ox, i) {
        var c = document.createElement('span');
        c.className = 'carry' + (i % 3 ? ' sm' : '');
        c.style.setProperty('--ox', ox + 'px');
        c.style.animationDelay = (2.4 + 0.35 + i * 0.07).toFixed(2) + 's';
        c.dataset.ox = ox;
        mark.appendChild(c);
        carries.push(c);
      });
    }
    function measure() {
      if (!carries.length) return;
      var r1 = mark.getBoundingClientRect(), r2 = cta.getBoundingClientRect();
      var x = Math.round((r2.left + r2.width / 2) - (r1.left + r1.width / 2));
      var y = Math.round((r2.top + r2.height / 2) - (r1.top + r1.height / 2));
      carries.forEach(function (c) {
        c.style.setProperty('--tx', (x + Number(c.dataset.ox) * 1.6) + 'px');
        c.style.setProperty('--ty', y + 'px');
      });
    }
    setTimeout(measure, 400); setTimeout(measure, 1600);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
  }

  /* Videos: one thing moves at a time.
     On landing only the hero film plays. Videos further down stay paused until the visitor
     scrolls and they come into view; once scrolled away from the top, the hero pauses. */
  var narrow = window.innerWidth < 768;
  var vids = Array.prototype.slice.call(document.querySelectorAll('video[data-src]')).filter(function (v) {
    if (reduce) return false;
    if (narrow && v.hasAttribute('data-desktop-only')) return false;
    var mobile = v.getAttribute('data-src-mobile');
    v.src = (mobile && narrow) ? mobile : v.getAttribute('data-src');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.load();
    return true;
  });
  var heroVids = vids.filter(function (v) { return v.classList.contains('hero-bg'); });
  var otherVids = vids.filter(function (v) { return !v.classList.contains('hero-bg'); });
  var seen = {};
  otherVids.forEach(function (v, i) { v.dataset.vid = String(i); });
  function play(v) { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
  function pause(v) { if (!v.paused) v.pause(); }
  function update() {
    var atTop = (window.scrollY || window.pageYOffset) < 120;
    heroVids.forEach(function (v) { atTop ? play(v) : pause(v); });
    otherVids.forEach(function (v) { (!atTop && seen[v.dataset.vid]) ? play(v) : pause(v); });
  }
  if (otherVids.length && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.dataset.vid] = en.isIntersecting && en.intersectionRatio >= 0.25; });
      update();
    }, { threshold: [0, 0.25, 0.5, 0.75] });
    otherVids.forEach(function (v) { vio.observe(v); });
  } else {
    otherVids.forEach(function (v) { seen[v.dataset.vid] = true; });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* FAQ: one open at a time */
  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        faq.querySelectorAll('details[open]').forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });
})();
