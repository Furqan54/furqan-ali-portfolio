/* =========================================================
   MAIN — shared behaviour for every page
   layout injection · smooth scroll · page gates · cursor
   reveals · split text · tilt · magnetic · counters · ring
   ========================================================= */
(function () {
  'use strict';
  var S = window.SITE, page = document.body.getAttribute('data-page');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGSAP = !!window.gsap;
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- icons ---------- */
  var st = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  var ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>',
    arrow: st('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    close: st('<path d="M6 6l12 12M18 6L6 18"/>'),
    lock: st('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3M12 14v3"/>'),
    ball: st('<circle cx="12" cy="12" r="9"/><path d="M12 8l3.5 2.5-1.3 4H9.8l-1.3-4z"/><path d="M12 3v5M15.5 10.5l5-1.5M14.2 14.5l3 4M9.8 14.5l-3 4M8.5 10.5l-5-1.5"/>'),
    pad: st('<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/>'),
    bot: st('<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V5M9 13h.01M15 13h.01M9 16.5h6"/><circle cx="12" cy="3.8" r="1"/>'),
    cube: st('<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12L3 7M12 12v10"/>'),
    shield: st('<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>'),
    gear: st('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>')
  };
  function shieldSvg(uid) {
    return '<svg viewBox="0 0 64 72" aria-hidden="true"><defs><linearGradient id="g' + uid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d98e"/><stop offset=".5" stop-color="#d4a94f"/><stop offset="1" stop-color="#8a6420"/></linearGradient></defs>' +
      '<path d="M32 2L60 12v26c0 17-12 27-28 32C16 65 4 55 4 38V12z" fill="#0b1812" stroke="url(#g' + uid + ')" stroke-width="3"/>' +
      '<path d="M32 9l22 8v21c0 13-9 21-22 26C19 59 10 51 10 38V17z" fill="none" stroke="rgba(243,217,142,.35)" stroke-width="1"/>' +
      '<path d="M32 14v34M25 22h14" stroke="url(#g' + uid + ')" stroke-width="3" stroke-linecap="round"/><path d="M29 48l3 5 3-5z" fill="url(#g' + uid + ')"/>' +
      '<text x="32" y="44" text-anchor="middle" font-family="Cinzel,serif" font-weight="700" font-size="0" fill="#f3d98e">FA</text></svg>';
  }

  /* ---------- layout (nav · footer · gates · cursor) ---------- */
  function buildLayout() {
    var body = document.body;
    // progress + cursor + grain
    body.insertAdjacentHTML('afterbegin',
      '<div class="grain" aria-hidden="true"></div><div class="cursor-ring"></div><div class="cursor-dot"></div>' +
      '<div class="veil" aria-hidden="true"></div>');
    // header
    var links = S.nav.map(function (n) { return '<a class="nav-link' + (n.key === page ? ' active' : '') + '" href="' + n.href + '">' + n.label + '</a>'; }).join('');
    var m = S.nav.map(function (n) { return '<a class="m-link' + (n.key === page ? ' active' : '') + '" href="' + n.href + '">' + n.label + '</a>'; }).join('');
    var hdr = document.createElement('header');
    hdr.id = 'site-header';
    hdr.innerHTML =
      '<nav class="nav-bar glass" aria-label="Primary">' +
      '<a class="brand" href="index.html" aria-label="Furqan Ali — home">' + shieldSvg('b') + '<span><b>FURQAN ALI</b><small>Full-Stack Developer</small></span></a>' +
      '<div class="nav-links">' + links + '</div>' +
      '<div class="flex items-center gap-2">' +
      '<a class="icon-btn hidden sm:inline-grid" href="' + S.social.github + '" target="_blank" rel="noopener" aria-label="GitHub">' + ICONS.github + '</a>' +
      '<a class="icon-btn hidden sm:inline-grid" href="' + S.social.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICONS.linkedin + '</a>' +
      '<button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></nav>';
    body.insertBefore(hdr, $('main'));
    var mm = document.createElement('div');
    mm.className = 'mobile-menu'; mm.innerHTML = m +
      '<div class="flex justify-center gap-3 mt-4"><a class="icon-btn" href="' + S.social.github + '" target="_blank" rel="noopener" aria-label="GitHub">' + ICONS.github + '</a><a class="icon-btn" href="' + S.social.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICONS.linkedin + '</a></div>';
    body.insertBefore(mm, $('main'));

    // footer
    var f = $('#site-footer');
    if (f) {
      f.className = 'site-footer';
      f.innerHTML =
        '<div class="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">' +
        '<div><a class="brand mb-4" href="index.html">' + shieldSvg('f') + '<span><b>FURQAN ALI</b><small>Full-Stack Developer</small></span></a>' +
        '<p class="font-serif italic text-xl text-[color:var(--parch)] max-w-sm leading-snug">“Every great kingdom starts with a single line of code.”</p></div>' +
        '<div><h4 class="eyebrow left mb-4">Explore</h4><ul class="space-y-2">' + S.nav.map(function (n) { return '<li><a class="foot-link" href="' + n.href + '">' + n.label + '</a></li>'; }).join('') + '</ul></div>' +
        '<div><h4 class="eyebrow left mb-4">Send a raven</h4><div class="flex gap-3 mb-3"><a class="icon-btn" href="' + S.social.github + '" target="_blank" rel="noopener" aria-label="GitHub">' + ICONS.github + '</a><a class="icon-btn" href="' + S.social.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + ICONS.linkedin + '</a></div><p class="text-sm text-[#9a9886]">Open to opportunities, collaborations and client projects.</p></div>' +
        '</div><div class="border-t border-[color:var(--line)] py-5 text-center text-xs tracking-widest uppercase text-[#7c7a6a]">© <span id="yr"></span> Furqan Ali · Forged in Islamabad, Pakistan</div>';
      $('#yr').textContent = new Date().getFullYear();
    }
    // gates
    var c = document.createElement('div');
    c.id = 'curtain'; c.innerHTML = '<div class="gate l"></div><div class="gate r"></div><div class="gate-emblem">' + shieldSvg('c') + '</div>';
    body.appendChild(c);
  }

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  function initScroll() {
    if (!window.Lenis || reduce) return;
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = $(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); }
      });
    });
  }

  /* ---------- header behaviour + mobile menu ---------- */
  function initHeader() {
    var h = $('#site-header'), last = 0, burger = $('.burger'), mm = $('.mobile-menu'), open = false;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      h.classList.toggle('scrolled', y > 30);
      if (!open) h.classList.toggle('hide', y > last && y > 240);
      last = y;
    }, { passive: true });
    function toggle(force) {
      open = typeof force === 'boolean' ? force : !open;
      burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); mm.classList.toggle('open', open);
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open && !lenis ? 'hidden' : '';
      if (hasGSAP && !reduce) {
        gsap.to(mm, { clipPath: open ? 'circle(150% at calc(100% - 44px) 44px)' : 'circle(0% at calc(100% - 44px) 44px)', duration: open ? .9 : .6, ease: 'power3.inOut' });
        if (open) gsap.fromTo($$('.m-link,.mobile-menu .icon-btn', mm), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, delay: .25, duration: .8, ease: 'power3.out' });
      } else { mm.style.clipPath = open ? 'none' : ''; }
    }
    burger.addEventListener('click', function () { toggle(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(false); });
    App.closeMenu = function () { if (open) toggle(false); };
  }

  /* ---------- page transition gates ---------- */
  var leaving = false;
  function initGates(onOpen) {
    var cur = $('#curtain'), L = $('.gate.l'), R = $('.gate.r'), em = $('.gate-emblem');
    function openNow() { cur.classList.add('done'); onOpen(); }
    if (!hasGSAP || reduce) { openNow(); return; }
    var started = false;
    function open() {
      if (started) return; started = true;
      var tl = gsap.timeline({ onComplete: function () { cur.classList.add('done'); } });
      tl.to(em, { scale: 1.25, opacity: 0, duration: .5, ease: 'power2.in' }, .15)
        .to(L, { xPercent: -101, duration: 1.05, ease: 'power4.inOut' }, .3)
        .to(R, { xPercent: 101, duration: 1.05, ease: 'power4.inOut' }, .3)
        .add(onOpen, .85);
    }
    gsap.set(em, { opacity: 0 }); gsap.to(em, { opacity: 1, duration: .4 });
    if (document.readyState === 'complete') setTimeout(open, 250); else window.addEventListener('load', function () { setTimeout(open, 250); });
    setTimeout(open, 2600); // never wait forever on slow assets

    window.addEventListener('pageshow', function (e) { if (e.persisted) { leaving = false; gsap.set([L, R], { xPercent: -0 }); gsap.set(L, { xPercent: -101 }); gsap.set(R, { xPercent: 101 }); cur.classList.add('done'); } });

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]'); if (!a || leaving) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      if (!/^(?![a-z]+:|#|\/\/).*\.html([?#].*)?$/i.test(href)) return;
      if (href.split('#')[0].split('?')[0] === location.pathname.split('/').pop() && !/\?/.test(href)) { e.preventDefault(); lenis ? lenis.scrollTo(0) : window.scrollTo(0, 0); return; }
      e.preventDefault(); App.go(href);
    });
  }
  function go(href) {
    if (leaving) return; leaving = true;
    if (App.closeMenu) App.closeMenu();
    if (!hasGSAP || reduce) { location.href = href; return; }
    var cur = $('#curtain'), L = $('.gate.l'), R = $('.gate.r'), em = $('.gate-emblem');
    cur.classList.remove('done'); if (lenis) lenis.stop();
    gsap.timeline({ onComplete: function () { location.href = href; } })
      .to(L, { xPercent: 0, duration: .7, ease: 'power3.inOut' }, 0).to(R, { xPercent: 0, duration: .7, ease: 'power3.inOut' }, 0)
      .to(em, { opacity: 1, scale: 1, duration: .4 }, .3);
  }

  /* ---------- cursor ---------- */
  function initCursor() {
    if (!fine || !hasGSAP) return;
    var dot = $('.cursor-dot'), ring = $('.cursor-ring');
    var rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
    var dx = gsap.quickTo(dot, 'x', { duration: .08 }), dy = gsap.quickTo(dot, 'y', { duration: .08 });
    window.addEventListener('pointermove', function (e) { document.body.classList.add('has-cursor'); rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', function (e) { ring.classList.toggle('hover', !!(e.target.closest && e.target.closest('a,button,[data-open],.filter,.flip,[data-tilt],.ring-stage'))); });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('has-cursor'); });
  }

  /* ---------- text splitting ---------- */
  function splitEl(el, mode) {
    if (el._split) return; el._split = true;
    var label = el.textContent.replace(/\s+/g, ' ').trim(); el.setAttribute('aria-label', label);
    function walk(node, target) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { target.appendChild(document.createTextNode(' ')); return; }
            var wrap = document.createElement('span'); wrap.className = 'split-wrap'; wrap.setAttribute('aria-hidden', 'true');
            if (mode === 'chars') {
              w.split('').forEach(function (ch) { var s = document.createElement('span'); s.className = 'split-char'; s.textContent = ch; wrap.appendChild(s); });
            } else { var s2 = document.createElement('span'); s2.className = 'split-word'; s2.textContent = w; wrap.appendChild(s2); }
            target.appendChild(wrap);
          });
        } else if (n.nodeType === 1) {
          var clone = n.cloneNode(false); walk(n, clone);
          if (n.classList.contains('title-gold')) { clone.classList.remove('title-gold'); $$('.split-word,.split-char', clone).forEach(function (s) { s.classList.add('title-gold'); }); }
          target.appendChild(clone);
        }
      });
    }
    var frag = document.createElement('div'); walk(el, frag); el.innerHTML = frag.innerHTML;
  }
  function partsOf(el) { return $$('.split-char', el).length ? $$('.split-char', el) : $$('.split-word', el); }

  /* ---------- typed text ---------- */
  function initTyped() {
    $$('[data-typed]').forEach(function (el) {
      var words = el.getAttribute('data-typed').split('|'), wi = 0, ci = 0, del = false;
      el.classList.add('caret');
      if (reduce) { el.textContent = words[0]; return; }
      (function tick() {
        var w = words[wi];
        ci += del ? -1 : 1; el.textContent = w.slice(0, ci);
        var d = del ? 28 : 62;
        if (!del && ci === w.length) { d = 1800; del = true; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 380; }
        setTimeout(tick, d);
      })();
    });
  }

  /* ---------- reveals ---------- */
  var REVEAL = {
    '': { y: 50 }, up: { y: 50 }, left: { x: -70 }, right: { x: 70 }, scale: { scale: .88, y: 20 },
    rotate: { y: 60, rotationX: -18, transformPerspective: 800, transformOrigin: '50% 100%' }
  };
  function initReveals(root) {
    root = root || document;
    $$('[data-split]:not([data-intro-split])', root).forEach(function (el) {
      if (el._rv) return; el._rv = true; splitEl(el, el.getAttribute('data-split') || 'words');
      var parts = partsOf(el);
      if (!hasGSAP || reduce) return;
      gsap.set(parts, { yPercent: 115 });
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { gsap.to(parts, { yPercent: 0, duration: 1.1, stagger: parts.length > 20 ? .015 : .07, ease: 'power4.out' }); } });
    });
    $$('[data-reveal]', root).forEach(function (el) {
      if (el._rv) return; el._rv = true;
      if (!hasGSAP || reduce) { el.style.opacity = 1; return; }
      var cfg = REVEAL[el.getAttribute('data-reveal')] || REVEAL[''];
      var delay = parseFloat(el.getAttribute('data-delay') || 0);
      gsap.set(el, Object.assign({}, cfg));
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () {
        gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, rotationX: 0, duration: 1.1, delay: delay, ease: 'power3.out' });
      } });
    });
    $$('[data-stagger]', root).forEach(function (box) {
      if (box._rv) return; box._rv = true;
      var kids = Array.prototype.slice.call(box.children);
      if (!hasGSAP || reduce) { kids.forEach(function (k) { k.style.opacity = 1; }); return; }
      /* experiment: cards rise out of the dark (blur + tilt), then ease away as they leave the top of the screen */
      gsap.set(kids, { y: 90, scale: .94, rotationX: 14, transformPerspective: 900, transformOrigin: '50% 100%', filter: 'blur(8px)' });
      ScrollTrigger.create({ trigger: box, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(kids, { opacity: 1, y: 0, scale: 1, rotationX: 0, filter: 'blur(0px)', duration: 1.2, stagger: .14, ease: 'power3.out',
          onComplete: function () {
            kids.forEach(function (k) {
              k.style.filter = '';
              gsap.fromTo(k, { opacity: 1, y: 0, scale: 1 }, { opacity: .1, y: -70, scale: .95, ease: 'none', immediateRender: false,
                scrollTrigger: { trigger: k, start: 'bottom 32%', end: 'bottom -8%', scrub: .5 } });
            });
          } });
      } });
    });
    $$('[data-parallax]', root).forEach(function (el) {
      if (el._rv || !hasGSAP || reduce) return; el._rv = true;
      var sp = parseFloat(el.getAttribute('data-parallax')) || .2;
      gsap.fromTo(el, { y: sp * 120 }, { y: -sp * 120, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-count]', root).forEach(function (el) {
      if (el._rv) return; el._rv = true;
      var end = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '';
      if (!hasGSAP || reduce) { el.textContent = end + suf; return; }
      var o = { v: 0 }; el.textContent = '0' + suf;
      var tile = el.parentElement, bar = null;
      if (tile && tile.classList.contains('stat')) { bar = document.createElement('i'); bar.className = 'stat-bar'; tile.appendChild(bar); gsap.set(bar, { scaleX: 0 }); gsap.set(tile, { opacity: 0, y: 36, filter: 'blur(6px)' }); }
      ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: function () {
        if (tile && bar) gsap.to(tile, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, ease: 'power3.out', delay: (Array.prototype.indexOf.call(tile.parentElement.children, tile)) * .12, onComplete: function () { tile.style.filter = ''; } });
        if (bar) gsap.to(bar, { scaleX: 1, duration: 2.4, ease: 'expo.out', delay: .1 });
        gsap.to(o, { v: end, duration: 2.6, ease: 'expo.out', delay: .15, onUpdate: function () { el.textContent = Math.round(o.v) + suf; },
          onComplete: function () { gsap.fromTo(el, { scale: 1.14 }, { scale: 1, duration: .6, ease: 'back.out(3)' }); } });
      } });
    });
    $$('.pips', root).forEach(function (p) {
      if (p._rv || !hasGSAP || reduce) return; p._rv = true;
      var on = $$('i.on', p); gsap.set(on, { scaleX: 0, transformOrigin: '0 50%' });
      ScrollTrigger.create({ trigger: p, start: 'top 94%', once: true, onEnter: function () { gsap.to(on, { scaleX: 1, duration: .7, stagger: .12, ease: 'power3.out' }); } });
    });
  }

  /* ---------- tilt + magnetic ---------- */
  function initTilt(root) {
    if (!fine || reduce || !hasGSAP) return;
    $$('[data-tilt]', root).forEach(function (el) {
      if (el._tilt) return; el._tilt = true;
      var max = parseFloat(el.getAttribute('data-tilt')) || 8;
      gsap.set(el, { transformPerspective: 1000 });
      var rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3.out' }), ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3.out' });
      if (!el.querySelector('.glare')) { var g = document.createElement('span'); g.className = 'glare'; el.appendChild(g); }
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 2 * max); rx(-(py - .5) * 2 * max); el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
  }
  function initMagnetic(root) {
    if (!fine || reduce || !hasGSAP) return;
    $$('[data-magnetic]', root).forEach(function (el) {
      if (el._mg) return; el._mg = true;
      var qx = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.5)' }), qy = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.5)' });
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .32); qy((e.clientY - r.top - r.height / 2) * .4); });
      el.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }

  /* ---------- marquee ---------- */
  function initMarquee() {
    var m = $('#marquee'); if (!m) return;
    var items = S.marquee.map(function (t) { return '<span class="marquee-item">' + t + '</span>'; }).join('');
    m.innerHTML = '<div class="marquee-track" aria-hidden="true">' + items + items + items + items + '</div>';
  }

  /* ---------- 3D tech ring ---------- */
  function initRing() {
    var stage = $('#ring-stage'), ring = $('#ring'); if (!stage || !ring) return;
    var n = S.stack.length, small = window.innerWidth < 640, tw = small ? 62 : 96, R = Math.max(small ? 170 : 270, n * (tw + (small ? 6 : 14)) / 6.2832);
    stage.style.setProperty('--tw', tw + 'px'); stage.style.setProperty('--th', (small ? 76 : 112) + 'px');
    var tiles = S.stack.map(function (t, i) {
      var a = 360 / n * i, el = document.createElement('div');
      el.className = 'ring-tile'; el.style.transform = 'rotateY(' + a + 'deg) translateZ(' + R + 'px)';
      el.innerHTML = '<div class="shield-wrap"><div class="shield"><b>' + t.code + '</b><span>' + t.name + '</span></div></div>';
      ring.appendChild(el); return { el: el, a: a };
    });
    var rot = 0, vel = 0, auto = 14, drag = false, lx = 0, hover = false, tiltX = -12, tx = -12;
    stage.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; try { stage.setPointerCapture(e.pointerId); } catch (x) {} });
    stage.addEventListener('pointermove', function (e) {
      if (drag) { var d = e.clientX - lx; lx = e.clientX; rot += d * .4; vel = d * 6; }
      var r = stage.getBoundingClientRect(); tx = -12 + ((e.clientY - r.top) / r.height - .5) * -14;
    });
    stage.addEventListener('pointerup', function () { drag = false; });
    stage.addEventListener('pointercancel', function () { drag = false; });
    stage.addEventListener('pointerenter', function () { hover = true; }); stage.addEventListener('pointerleave', function () { hover = false; drag = false; tx = -12; });
    function frame(dt) {
      if (!drag) { vel += ((hover ? auto * .25 : auto) - vel) * Math.min(1, dt * 1.6); rot += vel * dt; }
      tiltX += (tx - tiltX) * Math.min(1, dt * 4);
      ring.style.transform = 'rotateX(' + tiltX + 'deg) rotateY(' + rot + 'deg)';
      for (var i = 0; i < tiles.length; i++) {
        var c = Math.cos((tiles[i].a + rot) * Math.PI / 180); tiles[i].el.style.opacity = (.3 + .7 * (c + 1) / 2).toFixed(2);
      }
    }
    if (reduce) { frame(0); return; }
    if (hasGSAP) gsap.ticker.add(function (t, d) { frame(Math.min(d / 1000, .05)); });
  }

  /* ---------- timeline ---------- */
  function renderTimeline() {
    var box = $('#timeline'); if (!box) return;
    box.innerHTML = '<div class="tl-line"><div class="tl-fill"></div></div>' + S.timeline.map(function (t) {
      return '<div class="tl-item" ' + (reduce ? '' : 'data-reveal') + '><span class="tl-dot"></span>' +
        '<div class="panel p-6 ' + (t.now ? 'ring-1 ring-[color:var(--gold)]/40' : '') + '" data-tilt="4"><span class="chapter">' + t.ch + (t.now ? ' · <span style="color:#7bd88f">Now</span>' : '') + '</span>' +
        '<h3 class="font-display text-xl text-[color:var(--parch)] mt-2 mb-1 font-semibold">' + t.title + '</h3>' +
        '<p class="text-xs tracking-wider uppercase text-[color:var(--gold)] mb-3">' + t.where + '</p><p class="text-[#b9b5a3] leading-relaxed text-[.95rem]">' + t.text + '</p></div></div>';
    }).join('');
    if (hasGSAP && !reduce) {
      gsap.to($('.tl-fill', box), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: box, start: 'top 65%', end: 'bottom 65%', scrub: .4 } });
    }
    $$('.tl-item', box).forEach(function (it) {
      if (!hasGSAP || reduce) { it.classList.add('lit'); return; }
      ScrollTrigger.create({ trigger: it, start: 'top 65%', onEnter: function () { it.classList.add('lit'); }, onLeaveBack: function () { it.classList.remove('lit'); } });
    });
  }

  /* ---------- skills / interests / experience / vault ---------- */
  function renderSkills() {
    var box = $('#skills'); if (!box) return;
    box.innerHTML = S.skills.map(function (g) {
      return '<div class="panel p-6 sm:p-7" data-tilt="5"><h3 class="font-display text-2xl text-[color:var(--gold-2)] font-semibold">' + g.group + '</h3><p class="text-xs tracking-[.22em] uppercase text-[#8f8d7c] mb-4">' + g.blurb + '</p>' +
        g.items.map(function (s) {
          var pips = [1, 2, 3].map(function (i) { return '<i class="' + (i <= s.t ? 'on' : '') + '"></i>'; }).join('');
          return '<div class="skill-row"><span class="text-[color:var(--parch)] text-[.95rem]">' + s.n + '</span><span class="pips ' + (s.t === 1 ? 'p-explore' : '') + '" title="' + ['', 'Exploring', 'Sharpening', 'Forged'][s.t] + '">' + pips + '</span></div>';
        }).join('') + '</div>';
    }).join('');
  }
  function renderInterests() {
    var box = $('#interests'); if (!box) return;
    box.innerHTML = S.interests.map(function (i) {
      return '<div class="flip" tabindex="0"><div class="flip-inner"><div class="flip-face flip-front panel">' + ICONS[i.icon] + '<h3 class="font-display text-xl text-[color:var(--parch)] font-semibold">' + i.title + '</h3><p class="text-[10px] tracking-[.3em] uppercase text-[color:var(--gold)] mt-2">Hover or tap</p></div>' +
        '<div class="flip-face flip-back"><h3 class="font-display text-lg text-[color:var(--gold-2)] mb-2 font-semibold">' + i.title + '</h3><p class="text-[.9rem] leading-relaxed text-[#cfcab8]">' + i.text + '</p></div></div></div>';
    }).join('');
    $$('.flip', box).forEach(function (f) { f.addEventListener('click', function () { f.classList.toggle('flipped'); }); });
  }
  function renderExperience() {
    var box = $('#experience'); if (!box) return;
    box.innerHTML = S.experience.map(function (e) {
      return '<article class="panel p-7" data-tilt="5"><div class="flex items-center justify-between mb-3"><span class="chapter">' + e.when + '</span>' + (e.now ? '<span class="chip">Current</span>' : '') + '</div>' +
        '<h3 class="font-display text-xl text-[color:var(--parch)] font-semibold">' + e.role + '</h3><p class="text-[color:var(--gold)] text-sm tracking-wider uppercase mb-3">' + e.org + '</p>' +
        '<p class="text-[#b9b5a3] leading-relaxed text-[.95rem]">' + e.text + '</p><div class="tags">' + e.tags.map(function (t) { return '<span class="tag-pill">' + t + '</span>'; }).join('') + '</div></article>';
    }).join('');
  }
  function renderVault() {
    var box = $('#vault'); if (!box) return;
    box.innerHTML = S.vault.map(function (v) { return '<div class="vault">' + ICONS.lock + '<h3 class="font-display text-lg text-[color:var(--parch)] mb-1 font-semibold">' + v.title + '</h3><p class="text-sm text-[#9a9886] mb-3">' + v.text + '</p><span class="chapter">Coming soon</span></div>'; }).join('');
  }

  /* ---------- project cards ---------- */
  var ROMAN = function (n) { return n < 10 ? '0' + n : '' + n; };
  function projectCard(p) {
    return '<article class="proj" data-tilt="7" data-open="' + p.id + '" data-cats="' + p.cats.join(' ') + '" tabindex="0" role="button" aria-label="Open ' + p.title + ' details">' +
      '<div class="proj-shot">' + (p.status ? '<span class="proj-status">' + p.status + '</span>' : '') +
      '<img src="assets/img/' + p.cover + '.webp" alt="' + p.title + ' screenshot" loading="lazy" decoding="async"><span class="proj-hint">Hover to scroll preview</span></div>' +
      '<div class="proj-body"><span class="proj-num">Quest ' + ROMAN(p.num) + '</span><h3>' + p.title + '</h3><p class="tag">' + p.tagline + '</p>' +
      '<div class="tags">' + p.tags.slice(0, 4).map(function (t) { return '<span class="tag-pill">' + t + '</span>'; }).join('') + '</div>' +
      '<span class="proj-more">View quest ' + ICONS.arrow + '</span></div></article>';
  }
  /* hover-to-scroll screenshot preview */
  function attachPreview(root) {
    if (!fine || !hasGSAP || reduce) return;
    $$('.proj, [data-preview]', root).forEach(function (card) {
      if (card._pv) return; card._pv = true;
      var view = card.querySelector('.proj-shot, .browser-view'), img = view && view.querySelector('img'); if (!img) return;
      function dist() { var h = img.naturalWidth ? img.naturalHeight * (view.clientWidth / img.naturalWidth) : img.offsetHeight; return Math.max(0, h - view.clientHeight); }
      card.addEventListener('pointerenter', function () { var d = dist(); if (d > 4) gsap.to(img, { y: -d, duration: Math.min(9, Math.max(1.8, d / 260)), ease: 'power1.inOut', overwrite: true }); });
      card.addEventListener('pointerleave', function () { gsap.to(img, { y: 0, duration: .9, ease: 'power2.out', overwrite: true }); });
    });
  }
  function renderFeatured() {
    var box = $('#featured-grid'); if (!box) return;
    box.innerHTML = S.projects.filter(function (p) { return p.featured; }).map(projectCard).join('');
  }

  /* open a project (projects page overrides App.openProject) */
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-open]'); if (!c) return;
    e.preventDefault(); App.openProject(c.getAttribute('data-open'));
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-open]')) { e.preventDefault(); App.openProject(e.target.getAttribute('data-open')); }
  });

  function refresh(root) {
    initReveals(root); initTilt(root); initMagnetic(root); attachPreview(root);
    if (hasGSAP) ScrollTrigger.refresh();
  }

  /* ---------- intro (runs when the gates open) ---------- */
  function intro() {
    document.documentElement.classList.add('ready');
    var items = $$('[data-intro]');
    if (!hasGSAP || reduce) { items.forEach(function (i) { i.style.opacity = 1; }); return; }
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    var seen = 0;
    items.forEach(function (el) {
      var parts = el.hasAttribute('data-split') ? partsOf(el) : null;
      if (parts && parts.length) {
        gsap.set(el, { opacity: 1 }); gsap.set(parts, { yPercent: 118, rotation: 5 });
        tl.to(parts, { yPercent: 0, rotation: 0, duration: 1.3, stagger: el.getAttribute('data-split') === 'chars' ? .05 : .12 }, .1 + seen * .0);
      } else {
        tl.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .35 + seen * .12);
        seen++;
      }
    });
  }

  /* ---------- boot ---------- */
  var App = window.App = { S: S, icons: ICONS, go: go, refresh: refresh, projectCard: projectCard, attachPreview: attachPreview,
    get lenis() { return lenis; }, openProject: function (id) { go('projects.html?open=' + id); } };

  function boot() {
    buildLayout();
    // split intro headings before first paint of the intro
    $$('[data-intro][data-split]').forEach(function (el) { splitEl(el, el.getAttribute('data-split')); el.setAttribute('data-intro-split', ''); });
    initScroll(); initHeader(); initCursor(); initMarquee(); initRing(); initTyped();
    renderFeatured(); renderSkills(); renderInterests(); renderExperience(); renderVault(); renderTimeline();
    if (App.pageInit) App.pageInit();
    initReveals(); initTilt(); initMagnetic(); attachPreview();
    if (hasGSAP && window.ScrollTrigger) {
    }
    initGates(intro);
    window.addEventListener('load', function () { if (hasGSAP) ScrollTrigger.refresh(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
