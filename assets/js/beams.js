/* ==========================================================================
   beams.js — five ribbons of light that start at the sword's spark in the
   hero and flow down the whole page, converging on the contact card.
   Canvas 2D, drawn in document space so the ribbons scroll with the page.
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  var cv = document.createElement('canvas');
  cv.id = 'beams'; cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d'); if (!ctx) return;

  var N = mobile ? 3 : 5, M = mobile ? 6 : 12;          // beams, strands per beam
  var dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
  var W = 0, H = 0, docTop = 0, y0 = 0, x0 = 0, yT = 1, xT = 0, t0 = performance.now(), raf = 0;
  var COLORS = [[236, 196, 104], [226, 150, 72], [255, 240, 196], [236, 196, 104], [150, 214, 186]];
  var PH = [0.4, 2.1, 3.9, 5.2, 1.3];

  function ease(t) { return t * t * (3 - 2 * t); }
  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var sy = window.pageYOffset || 0;
    var s = window.Forest && window.Forest.swordScreen && window.Forest.swordScreen();
    if (s && sy < 4) { x0 = s.x; y0 = s.y; }              // the sword's spark
    else if (!x0) { x0 = W * (mobile ? 0.5 : 0.72); y0 = H * (mobile ? 0.3 : 0.5); }
    var cta = document.querySelector('main section:last-of-type .panel');
    if (cta) { var r = cta.getBoundingClientRect(); xT = r.left + r.width / 2; yT = r.top + sy - 6; }
    else { xT = W / 2; yT = document.documentElement.scrollHeight - H; }
    if (yT < y0 + H) yT = y0 + H;
  }

  /* x position of strand j of beam i at progress t (0 = spark, 1 = contact card), document y, time s.
     The whole bundle follows a big letter-S wave that travels down the page; the beams are phase-shifted
     copies of it, so they fan and cross like one flowing sheet of light. Ends taper into the spark / card. */
  function xAt(i, j, t, y, s) {
    var env = Math.min(1, t / 0.1, (1 - t) / 0.1); env = Math.max(0, env); env = env * env * (3 - 2 * env);
    var base = x0 + (xT - x0) * ease(t);
    var lam = mobile ? 1000 : 1300, amp = W * (mobile ? 0.27 : 0.3) * (0.92 + 0.08 * Math.sin(i * 2.3));
    var wave = -Math.sin(((y - y0) / lam) * 6.2832 - s * 0.55 + i * 0.34);          // minus: first sweep goes left, away from the sword
    var lane = (i - (N - 1) / 2) / ((N - 1) / 2);
    var off = (j - (M - 1) / 2) / ((M - 1) / 2);
    var width = W * (mobile ? 0.06 : 0.05) * (0.35 + 0.65 * env) * Math.cos(y / 330 + i * 1.7 + s * 0.45);   // twisting ribbon
    return base + amp * env * wave + lane * W * 0.035 * env + off * width;
  }

  function draw(now) {
    var s = reduce ? 0 : (now - t0) / 1000, sy = window.pageYOffset || 0;
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
    var span = Math.max(1, yT - y0);
    var grow = reduce ? 1 : Math.min(1, Math.max(0, (s - 1.0) / 3.2)); grow = 1 - Math.pow(1 - grow, 3);
    var front = y0 + span * grow;                          // beams grow down from the spark on load
    var yA = Math.max(y0, sy - 30), yB = Math.min(yT, sy + H + 30, front);
    if (yB <= yA) return;
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = mobile ? 1 : 1.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    var step = 10, CH = 5;
    for (var i = 0; i < N; i++) {
      var c = COLORS[i], rgb = c[0] + ',' + c[1] + ',' + c[2], pulse = reduce ? -1 : ((s * 0.085 + i * 0.21) % 1);
      /* silky body: a translucent band between the two outer strands */
      var ys = [], L = [], R = [];
      for (var y = yA; y <= yB; y += step) { var tt = (y - y0) / span; ys.push(y); L.push(xAt(i, 0, tt, y, s)); R.push(xAt(i, M - 1, tt, y, s)); }
      ctx.beginPath();
      for (var k = 0; k < ys.length; k++) { if (k) ctx.lineTo(L[k], ys[k] - sy); else ctx.moveTo(L[k], ys[k] - sy); }
      for (k = ys.length - 1; k >= 0; k--) ctx.lineTo(R[k], ys[k] - sy);
      ctx.closePath(); ctx.fillStyle = 'rgba(' + rgb + ',0.06)'; ctx.fill();
      /* hairline strands */
      for (var j = 0; j < M; j++) {
        var jm = Math.abs(j - (M - 1) / 2) / ((M - 1) / 2);      // centre strands are brighter
        var n = 0, ct = 0, started = false;
        ctx.beginPath();
        for (y = yA; y <= yB; y += step) {
          var t = (y - y0) / span, x = xAt(i, j, t, y, s);
          if (!started) { ctx.moveTo(x, y - sy); started = true; ct = t; n = 0; continue; }
          ctx.lineTo(x, y - sy); n++;
          if (n >= CH) {
            var tm = (t + ct) / 2, al = 0.1 + 0.1 * (1 - jm);
            if (pulse >= 0) { var d = (tm - pulse) / 0.07; al += 0.42 * Math.exp(-d * d) * (1 - jm * 0.6); }
            al *= 0.4 + 0.6 * Math.pow(Math.sin(Math.PI * Math.min(1, tm * 1.1 + 0.03)), 0.35);
            ctx.strokeStyle = 'rgba(' + rgb + ',' + Math.min(0.85, al).toFixed(3) + ')'; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y - sy); n = 0; ct = t;
          }
        }
      }
    }
    /* the light the ribbons gather into, at the top of the contact card */
    var gy = yT - sy;
    if (gy > -200 && gy < H + 200 && grow > 0.98) {
      var rg = ctx.createRadialGradient(xT, gy, 0, xT, gy, Math.min(W * 0.28, 260));
      rg.addColorStop(0, 'rgba(240,205,120,0.22)'); rg.addColorStop(1, 'rgba(240,205,120,0)');
      ctx.fillStyle = rg; ctx.fillRect(xT - 300, gy - 300, 600, 600);
    }
    /* soft fade at the top and bottom of the screen so ribbons do not end abruptly */
    ctx.globalCompositeOperation = 'destination-in';
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.1, 'rgba(0,0,0,1)'); g.addColorStop(0.9, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }
  function start() { cancelAnimationFrame(raf); if (reduce) { draw(performance.now()); } else raf = requestAnimationFrame(loop); }

  measure(); start();
  window.addEventListener('resize', function () { x0 = 0; measure(); start(); });
  window.addEventListener('scroll', function () { if (reduce) draw(0); }, { passive: true });
  window.addEventListener('load', function () { setTimeout(function () { measure(); }, 600); });
  setInterval(function () {                                // layout shifts (images, reveals) move the contact card
    var cta = document.querySelector('main section:last-of-type .panel');
    if (cta) { var r = cta.getBoundingClientRect(), ny = r.top + (window.pageYOffset || 0) - 6; if (Math.abs(ny - yT) > 8) measure(); }
  }, 1500);
  document.addEventListener('visibilitychange', function () { if (document.hidden) cancelAnimationFrame(raf); else start(); });
})();
