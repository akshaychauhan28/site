/* =========================================================
   Akshay Chauhan — portfolio interactions
   1. custom cursor   2. scroll reveals
   3. hero dot lattice   4. card tilt   5. contact form
   Motion is disabled automatically on touch devices.
   ========================================================= */

(function () {
  'use strict';

  var TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointer = null;

  /* ---------- 1. custom cursor ---------- */
  function initCursor() {
    var ring = document.getElementById('cursorRing');
    if (!ring || TOUCH) return;

    var target = { x: -200, y: -200 };
    var pos = { x: -200, y: -200 };
    var big = false;

    window.addEventListener('pointermove', function (e) {
      target.x = e.clientX;
      target.y = e.clientY;
      pointer = { x: e.clientX, y: e.clientY };
      big = !!(e.target.closest && e.target.closest('[data-magnet]'));
    }, { passive: true });

    (function tick() {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      ring.style.transform =
        'translate3d(' + pos.x + 'px,' + pos.y + 'px,0) translate(-50%,-50%) scale(' + (big ? 2.5 : 1) + ')';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- 2. scroll reveals ---------- */
  function initReveals() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (REDUCED || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        en.target.style.transitionDelay = (i * 70) + 'ms';
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 3. hero dot lattice ---------- */
  function initLattice() {
    var cv = document.getElementById('lattice');
    if (!cv || TOUCH || REDUCED) return;

    var ctx = cv.getContext('2d');
    var w = 0, h = 0, dots = [];

    function build() {
      var r = cv.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var gap = w < 700 ? 42 : 54;
      dots = [];
      for (var y = gap / 2; y < h; y += gap) {
        for (var x = gap / 2; x < w; x += gap) {
          dots.push({ x: x, y: y, ox: x, oy: y, ph: Math.random() * Math.PI * 2, alt: Math.random() > 0.72 });
        }
      }
    }
    build();
    window.addEventListener('resize', build);

    (function draw(t) {
      ctx.clearRect(0, 0, w, h);
      var rect = cv.getBoundingClientRect();
      var px = pointer ? pointer.x - rect.left : -9999;
      var py = pointer ? pointer.y - rect.top : -9999;

      dots.forEach(function (d) {
        var wob = Math.sin(t / 1600 + d.ph) * 3;
        var x = d.ox, y = d.oy + wob, size = 1.3, alpha = 0.16;
        var dx = x - px, dy = y - py;
        var dist = Math.hypot(dx, dy);

        if (dist < 190) {
          var f = 1 - dist / 190;
          x += (dx / (dist || 1)) * f * 34;
          y += (dy / (dist || 1)) * f * 34;
          size = 1.3 + f * 2.6;
          alpha = 0.16 + f * 0.8;
          ctx.fillStyle = d.alt ? 'rgba(167,155,224,' + alpha + ')' : 'rgba(224,131,76,' + alpha + ')';
        } else {
          ctx.fillStyle = 'rgba(240,231,220,' + (alpha * 0.8) + ')';
        }
        d.x = x; d.y = y;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (px > -1000) {
        ctx.strokeStyle = 'rgba(224,131,76,0.14)';
        ctx.lineWidth = 0.6;
        var near = dots.filter(function (d) { return Math.hypot(d.x - px, d.y - py) < 150; });
        for (var i = 0; i < near.length; i++) {
          for (var j = i + 1; j < near.length; j++) {
            if (Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y) < 74) {
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(draw);
    })(0);
  }

  /* ---------- 4. card tilt ---------- */
  function initTilt() {
    if (TOUCH || REDUCED) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        card.style.borderColor = 'rgba(224,131,76,0.45)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
        card.style.borderColor = '';
      });
    });
  }

  /* ---------- 5. copy buttons ---------- */
  function initCopy() {
    var CHECK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10.5l4 4 8-9"/></svg>';

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      var original = btn.innerHTML;
      var timer = null;
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        var done = function () {
          btn.innerHTML = CHECK;
          btn.classList.add('is-copied');
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.innerHTML = original;
            btn.classList.remove('is-copied');
          }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text);
          done();
        }
      });
    });
  }

  initCursor();
  initReveals();
  initLattice();
  initTilt();
  initCopy();
})();
