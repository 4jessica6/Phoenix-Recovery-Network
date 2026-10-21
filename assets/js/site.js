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

  /* Videos: load lazily; smaller file on phones; skip heavy background videos on phones entirely */
  document.querySelectorAll('video[data-src]').forEach(function (v) {
    if (reduce) return;
    var narrow = window.innerWidth < 768;
    if (narrow && v.hasAttribute('data-desktop-only')) return;
    var mobile = v.getAttribute('data-src-mobile');
    v.src = (mobile && narrow) ? mobile : v.getAttribute('data-src');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.load();
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  });

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
