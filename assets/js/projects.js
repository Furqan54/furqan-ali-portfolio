/* =========================================================
   PROJECTS PAGE — main quests, filterable grid, detail modal
   Loaded after main.js; hooks in through App.pageInit.
   ========================================================= */
(function () {
  'use strict';
  var App = window.App, S = App.S, I = App.icons;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!window.gsap;

  var all = S.projects.slice().sort(function (a, b) { return b.num - a.num; });
  var featured = S.projects.filter(function (p) { return p.featured; }); /* data order: 818 AI first */
  var rest = all.filter(function (p) { return !p.featured; }).sort(function (a, b) { return a.num - b.num; });
  var PHASES = [[1, 'Phase 1 · First steps', 'HTML & CSS basics — my very first pages'], [5, 'Phase 2 · Adding JavaScript & motion', 'Clones, animation and bigger layouts as I levelled up']];
  var CATS = [['all', 'All'], ['fullstack', 'Full-Stack'], ['business', 'Business sites'], ['landing', 'Landing pages'], ['clone', 'Clones'], ['ui', 'UI & animation']];
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var byId = function (id) { return all.filter(function (p) { return p.id === id; })[0]; };
  var repoOf = function (p) { return p.repo || S.social.github; };

  function renderQuests() {
    $('#quests').innerHTML = featured.map(function (p, i) {
      return '<article class="quest ' + (i % 2 ? 'flip-row' : '') + '">' +
        '<div class="quest-visual" data-preview data-open="' + p.id + '" role="button" tabindex="0" aria-label="Open ' + p.title + ' details" data-reveal="' + (i % 2 ? 'right' : 'left') + '">' +
        '<div class="browser" data-tilt="5"><div class="browser-bar"><i></i><i></i><i></i><em>' + p.id + '.preview</em></div>' +
        '<div class="browser-view' + (p.wide ? ' wide' : '') + '"><img src="assets/img/' + p.cover + '.webp" alt="' + p.title + ' screenshot" loading="lazy" decoding="async"></div></div></div>' +
        '<div><div data-reveal><span class="quest-num">' + pad(p.num) + '</span></div>' +
        '<span class="eyebrow left mt-4" data-reveal>Major build' + (p.status ? ' · ' + p.status : '') + '</span>' +
        '<h3 class="font-display text-3xl sm:text-4xl font-bold text-[color:var(--parch)] mt-4 leading-tight" data-reveal>' + p.title + '</h3>' +
        '<p class="lede mt-4" data-reveal>' + p.tagline + '</p>' +
        '<p class="mt-4 text-[#b9b5a3] leading-relaxed" data-reveal>' + p.summary + '</p>' +
        '<div class="tags mb-6" data-reveal>' + p.tags.map(function (t) { return '<span class="tag-pill">' + t + '</span>'; }).join('') + '</div>' +
        '<div class="flex flex-wrap gap-3" data-reveal><button class="btn btn-gold" data-open="' + p.id + '" data-magnetic>Open quest log ' + I.arrow.replace('<svg', '<svg class="arrow"') + '</button>' +
        (p.live ? '<a class="btn btn-ghost" href="' + p.live + '" target="_blank" rel="noopener" data-magnetic>Live site</a>' : '') +
        '<a class="btn btn-ghost" href="' + repoOf(p) + '" target="_blank" rel="noopener" data-magnetic>GitHub</a></div></div></article>';
    }).join('');
  }

  function renderFilters() {
    $('#filters').innerHTML = CATS.map(function (c, i) { return '<button class="filter' + (i ? '' : ' active') + '" data-cat="' + c[0] + '">' + c[1] + '</button>'; }).join('');
    $('#grid').innerHTML = rest.map(function (p) {
      var ph = PHASES.filter(function (x) { return x[0] === p.num; })[0];
      return (ph ? '<div class="phase-head col-span-full" data-reveal><span class="eyebrow left">' + ph[1] + '</span><p class="mt-2 text-sm text-[#9a9886]">' + ph[2] + '</p></div>' : '') + App.projectCard(p);
    }).join('');
    updateCount(rest.length);
    $$('#filters .filter').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#filters .filter').forEach(function (x) { x.classList.toggle('active', x === b); });
        applyFilter(b.getAttribute('data-cat'));
      });
    });
  }
  function updateCount(n) { $('#count').textContent = 'Showing ' + n + ' of ' + rest.length + ' early builds'; }
  function applyFilter(cat) {
    var cards = $$('#grid .proj');
    $$('#grid .phase-head').forEach(function (h) { h.style.display = cat === 'all' ? '' : 'none'; });
    var out = cards.filter(function (c) { return cat === 'all' || c.getAttribute('data-cats').split(' ').indexOf(cat) > -1; });
    updateCount(out.length);
    if (!hasGSAP || reduce) { cards.forEach(function (c) { c.style.display = out.indexOf(c) > -1 ? '' : 'none'; }); return; }
    gsap.to(cards, { opacity: 0, scale: .92, duration: .28, ease: 'power2.in', overwrite: true, onComplete: function () {
      cards.forEach(function (c) { c.style.display = out.indexOf(c) > -1 ? '' : 'none'; });
      gsap.fromTo(out, { opacity: 0, y: 36, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .7, stagger: .06, ease: 'power3.out', onComplete: function () { ScrollTrigger.refresh(); } });
    } });
  }

  /* ---------- modal ---------- */
  var modal, lastFocus = null, current = null;
  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'm-title');
    modal.innerHTML = '<div class="modal-bg" data-close></div><div class="modal-card"><button class="icon-btn modal-close" data-close aria-label="Close project details">' + I.close + '</button>' +
      '<div class="modal-gallery" data-lenis-prevent></div><div class="modal-info" data-lenis-prevent></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
    modal.addEventListener('click', function (e) { var n = e.target.closest('[data-go]'); if (n) swap(n.getAttribute('data-go')); });
    window.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') { // keep focus inside the dialog
        var f = $$('button,a[href]', modal).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  function fill(p) {
    current = p;
    $('.modal-gallery', modal).scrollTop = 0; $('.modal-info', modal).scrollTop = 0;
    $('.modal-gallery', modal).innerHTML = p.gallery.map(function (g, i) {
      return '<div class="browser"><div class="browser-bar"><i></i><i></i><i></i><em>' + p.id + ' · screen ' + (i + 1) + ' of ' + p.gallery.length + '</em></div><img src="assets/img/' + g + '.webp" alt="' + p.title + ' screenshot ' + (i + 1) + '" loading="lazy"></div>';
    }).join('');
    var idx = all.indexOf(p), prev = all[(idx + 1) % all.length], next = all[(idx - 1 + all.length) % all.length];
    $('.modal-info', modal).innerHTML =
      '<div class="flex items-center gap-3"><span class="proj-num">Quest ' + pad(p.num) + '</span>' + (p.status ? '<span class="proj-status" style="position:static">' + p.status + '</span>' : '') + '</div>' +
      '<h2 id="m-title" class="font-display text-3xl sm:text-4xl font-bold title-gold leading-tight">' + p.title + '</h2>' +
      '<p class="lede">' + p.tagline + '</p><p class="text-[#c9c5b5] leading-relaxed">' + p.summary + '</p>' +
      '<div class="meta-row"><div><small>Role</small><span>' + p.role + '</span></div><div><small>Screens</small><span>' + p.gallery.length + ' captured</span></div></div>' +
      '<div><h4 class="eyebrow left mb-3">Highlights</h4><ul class="check">' + p.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ul></div>' +
      '<div><h4 class="eyebrow left mb-3">Tech stack</h4><div class="tags" style="margin-top:0;padding-top:0">' + p.tags.map(function (t) { return '<span class="tag-pill">' + t + '</span>'; }).join('') + '</div></div>' +
      (p.note ? '<p class="text-sm leading-relaxed text-[#b9b5a3] border-l-2 pl-3" style="border-color:var(--gold)"><strong class="text-[color:var(--parch)]">Honest status:</strong> ' + p.note + '</p>' : '') +
      (p.credit ? '<p class="text-xs leading-relaxed text-[#8f8b7a]">' + p.credit + '</p>' : '') +
      '<div class="flex flex-wrap gap-3 pt-2">' + (p.live ? '<a class="btn btn-gold" href="' + p.live + '" target="_blank" rel="noopener">Visit live site</a>' : '') + '<a class="btn ' + (p.live ? 'btn-ghost' : 'btn-gold') + '" href="' + repoOf(p) + '" target="_blank" rel="noopener">View on GitHub</a></div>' +
      '<div class="flex justify-between gap-3 pt-4 mt-auto border-t border-[color:var(--line)]"><button class="filter" data-go="' + prev.id + '">&larr; ' + prev.title.split(' — ')[0] + '</button><button class="filter" data-go="' + next.id + '">' + next.title.split(' — ')[0] + ' &rarr;</button></div>';
  }
  function open(id, fromUrl) {
    var p = byId(id); if (!p) return;
    lastFocus = document.activeElement;
    if (!modal) buildModal();
    fill(p); modal.classList.add('open');
    if (App.lenis) App.lenis.stop(); else document.body.style.overflow = 'hidden';
    try { history.replaceState(null, '', '?open=' + id); } catch (e) {}
    if (hasGSAP && !reduce) {
      gsap.fromTo($('.modal-bg', modal), { opacity: 0 }, { opacity: 1, duration: .5 });
      gsap.fromTo($('.modal-card', modal), { y: 80, scale: .92, opacity: 0, rotationX: 8, transformPerspective: 1200 }, { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: .8, ease: 'power4.out' });
      gsap.fromTo($$('.modal-info > *', modal), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .7, delay: .25, ease: 'power3.out' });
    }
    setTimeout(function () { var c = $('.modal-close', modal); if (c) c.focus(); }, 60);
  }
  function swap(id) {
    var p = byId(id); if (!p) return; fill(p);
    try { history.replaceState(null, '', '?open=' + id); } catch (e) {}
    if (hasGSAP && !reduce) {
      gsap.fromTo($$('.modal-gallery .browser', modal), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .7, ease: 'power3.out' });
      gsap.fromTo($$('.modal-info > *', modal), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .6, ease: 'power3.out' });
    }
  }
  function step(d) { var i = all.indexOf(current); swap(all[(i - d + all.length) % all.length].id); }
  function close() {
    if (!modal || !modal.classList.contains('open')) return;
    var done = function () {
      modal.classList.remove('open');
      if (App.lenis) App.lenis.start(); else document.body.style.overflow = '';
      try { history.replaceState(null, '', location.pathname); } catch (e) {}
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    if (hasGSAP && !reduce) {
      gsap.to($('.modal-card', modal), { y: 50, scale: .95, opacity: 0, duration: .4, ease: 'power3.in' });
      gsap.to($('.modal-bg', modal), { opacity: 0, duration: .4, onComplete: done });
    } else done();
  }

  App.openProject = open;
  App.pageInit = function () {
    renderQuests(); renderFilters();
    var m = /[?&]open=([\w-]+)/.exec(location.search);
    if (m && byId(m[1])) setTimeout(function () { open(m[1], true); }, 1700);
  };
})();
