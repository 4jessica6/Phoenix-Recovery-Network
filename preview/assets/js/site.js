/* Phoenix Recovery Network — shared behaviour (no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal, same timing as the design concept */
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

  /* Hero embers: seven sparks rising from the mark */
  document.querySelectorAll('.mark[data-embers]').forEach(function (m) {
    if (reduce) return;
    [-38, -14, 6, 24, 44, -26, 34].forEach(function (dx, i) {
      var s = document.createElement('span');
      s.className = 'ember';
      s.style.left = 'calc(50% + ' + dx + 'px)';
      s.style.setProperty('--dx', (dx * 0.6) + 'px');
      s.style.animationDuration = (3.2 + (i % 3) * 0.9) + 's';
      s.style.animationDelay = (1.6 + i * 0.55) + 's';
      m.appendChild(s);
    });
  });

  /* Background videos: load only when motion is allowed; otherwise the poster stays */
  document.querySelectorAll('video[data-src]').forEach(function (v) {
    if (reduce) return;
    v.src = v.getAttribute('data-src');
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

  /* Availability form */
  document.querySelectorAll('form[data-inquiry]').forEach(function (form) {
    var card = form.closest('.form-card');
    var thanks = card && card.querySelector('.thanks');
    var auds = {
      self:   { label: 'For myself', name: 'Your name', timing: 'Ideal move-in', help: 'Where you are in recovery and what you’re looking for. Share whatever you’re comfortable with.', nudge: 'Ready to move forward now?' },
      loved:  { label: 'For someone I love', name: 'Your name', timing: 'When they hope to move in', help: 'Tell us a little about your loved one and how we can help.', nudge: 'Your loved one can apply directly when ready.' },
      client: { label: 'For a client', name: 'Your name & organization', timing: 'Discharge or move-in date', help: 'Client first name or initials, current program, and any questions about fit.', nudge: 'Your client can apply directly when ready.' }
    };
    var audInput = form.querySelector('[name="audience"]');
    function setAud(key) {
      var a = auds[key] || auds.self;
      if (audInput) audInput.value = a.label;
      form.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-aud') === key ? 'true' : 'false'); });
      var n = form.querySelector('[data-name-label]'); if (n) n.firstChild.nodeValue = a.name;
      var t = form.querySelector('[data-timing-label]'); if (t) t.firstChild.nodeValue = a.timing;
      var h = form.querySelector('[name="message"]'); if (h) h.placeholder = a.help;
      var g = card && card.querySelector('[data-nudge]'); if (g) g.textContent = a.nudge;
    }
    form.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () { setAud(c.getAttribute('data-aud')); });
    });
    setAud('self');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('data-endpoint');
      var data = new FormData(form);
      function done() { form.hidden = true; if (thanks) thanks.hidden = false; }
      if (endpoint) {
        var btn = form.querySelector('button[type="submit"]'); if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error('send failed'); done(); })
          .catch(function () { if (btn) { btn.disabled = false; btn.textContent = 'Request a call back'; } window.location.href = mailto(data); });
      } else {
        /* No form service connected yet: open a prefilled email instead. */
        window.location.href = mailto(data);
        done();
      }
    });
    function mailto(data) {
      var lines = [];
      data.forEach(function (v, k) { if (String(v).trim()) lines.push(k.replace(/_/g, ' ') + ': ' + v); });
      var home = form.getAttribute('data-home') || 'Phoenix Recovery Network';
      return 'mailto:info@phoenixrecoverynetwork.com?subject=' + encodeURIComponent('Availability inquiry — ' + home) + '&body=' + encodeURIComponent(lines.join('\n'));
    }
    var again = card && card.querySelector('.again');
    if (again) again.addEventListener('click', function () { form.reset(); setAud('self'); form.hidden = false; thanks.hidden = true; });
  });
})();
