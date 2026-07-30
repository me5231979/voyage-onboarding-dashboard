/* =====================================================================
   VOYAGE — onboarding dashboard engine
   Views: welcome → gate (3 questions) → dashboard (days 1–30) → returning.
   Click on a card's primary CTA is the completion signal; API-backed
   items log "Opened" then upgrade to "Verified" (simulated nightly sync).
   State persists in localStorage.
   ===================================================================== */

(function () {
  'use strict';

  var LS = 'voyage_v1';
  var state = load() || { profile: null, status: {}, saved: [], events: [], filter: null };

  function load() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {} }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- audience filter ---------- */
  function myItems() {
    var p = state.profile || {};
    return VOYAGE.items.filter(function (it) {
      if (!it.aud) return true;
      if (it.aud.loc && it.aud.loc.indexOf(p.loc) === -1) return false;
      if (it.aud.role && it.aud.role.indexOf(p.role) === -1) return false;
      return true;
    });
  }
  function statusOf(id) { return state.status[id] || 'todo'; }
  function isDone(id) { var s = statusOf(id); return s === 'done' || s === 'verified'; }
  function itemById(id) { for (var i = 0; i < VOYAGE.items.length; i++) if (VOYAGE.items[i].id === id) return VOYAGE.items[i]; return null; }
  function locName(id) { for (var i = 0; i < VOYAGE.locations.length; i++) if (VOYAGE.locations[i].id === id) return VOYAGE.locations[i].name; return ''; }
  function roleName(id) { for (var i = 0; i < VOYAGE.roles.length; i++) if (VOYAGE.roles[i].id === id) return VOYAGE.roles[i].name; return ''; }
  function myPrograms(role) {
    return VOYAGE.programs.filter(function (pr) {
      if (pr.aud === 'all' || pr.aud === 'esl') return true;
      return role === 'manager' && (pr.aud === 'manager' || pr.aud === 'exec');
    });
  }

  /* ---------- view router ---------- */
  function show(view) {
    $$('.view').forEach(function (v) { v.classList.toggle('active', v.getAttribute('data-view') === view); });
    var hasProfile = !!state.profile;
    $('#navDash').hidden = !hasProfile;
    $('#navReturn').hidden = !hasProfile;
    $('#navCta').textContent = hasProfile ? 'My path' : 'Begin onboarding';
    if (view === 'dashboard') renderDashboard();
    if (view === 'returning') renderReturning();
    window.scrollTo(0, 0);
    reveal();
  }

  /* ---------- greeting ---------- */
  function greeting() {
    var h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }

  /* =====================================================================
     GATE — three-question personalization
     ===================================================================== */
  var draft = { loc: null, family: null, sub: null, role: null };

  function skillsFor(family, sub) {
    return (typeof SBJA !== 'undefined' && SBJA.skills[family + '|' + sub]) || [];
  }
  function skillChips(family, sub, max) {
    var sk = skillsFor(family, sub).slice(0, max || 8);
    if (!sk.length) return '';
    return sk.map(function (s) { return '<span class="skillpill">' + esc(s) + '</span>'; }).join('');
  }

  function gateStep(n) {
    $$('.gate__step').forEach(function (s) { s.hidden = s.getAttribute('data-step') !== String(n); });
    $$('.gate__dots i').forEach(function (d, i) { d.classList.toggle('on', i < n); });
    if (n === 4) {
      $('#summaryPath').innerHTML = 'Here’s your custom path: <b>' + esc(roleName(draft.role)) + '</b> · <b>' + esc(draft.sub) + '</b> (' + esc(draft.family) + ') · <b>' + esc(locName(draft.loc)) + '</b>';
      var mins = VOYAGE.items.filter(function (it) {
        if (!it.aud) return true;
        if (it.aud.loc && it.aud.loc.indexOf(draft.loc) === -1) return false;
        if (it.aud.role && it.aud.role.indexOf(draft.role) === -1) return false;
        return true;
      }).reduce(function (a, it) { return a + it.mins; }, 0);
      $('#summaryHours').innerHTML = 'Approximately <b>' + (Math.round(mins / 30) / 2) + ' hours</b> across your first 30 days.';
      var chips = skillChips(draft.family, draft.sub, 8);
      $('#summarySkills').innerHTML = chips ? '<p class="skillchips__label">Skills that matter in your sub-family</p>' + chips : '';
    }
  }

  function buildGate() {
    var lt = $('#locTiles');
    lt.innerHTML = VOYAGE.locations.map(function (l) {
      return '<button type="button" class="tile" data-loc="' + l.id + '"><span class="tile__kicker">' + esc(l.kicker) + '</span><h3>' + esc(l.name) + '</h3><p>' + esc(l.p) + '</p><div class="tile__detail">' + esc(l.detail) + '</div></button>';
    }).join('');
    lt.addEventListener('click', function (e) {
      var b = e.target.closest('[data-loc]'); if (!b) return;
      draft.loc = b.getAttribute('data-loc');
      $$('[data-loc]', lt).forEach(function (t) { t.classList.toggle('on', t === b); });
      $('#locNext').disabled = false;
    });

    renderDeptList('');
    $('#deptSearch').addEventListener('input', function () { renderDeptList(this.value.trim().toLowerCase()); });
    $('#deptList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sub]'); if (!b) return;
      draft.family = b.getAttribute('data-fam');
      draft.sub = b.getAttribute('data-sub');
      $$('[data-sub]').forEach(function (t) { t.classList.toggle('on', t === b); });
      var pv = $('#deptPreview');
      pv.hidden = false;
      var chips = skillChips(draft.family, draft.sub, 6);
      pv.innerHTML = 'You’ll be joining <b>' + esc(draft.sub) + '</b> in the <b>' + esc(draft.family) + '</b> family. Your area lead is <b>' + esc(VOYAGE.deptStats.lead) + '</b>, and <b>' + VOYAGE.deptStats.recentJoiners + ' colleagues</b> joined in the last 90 days.' +
        (chips ? '<div class="skillchips"><p class="skillchips__label">Skills that matter here</p>' + chips + '</div>' : '');
      $('#deptNext').disabled = false;
    });

    var rt = $('#roleTiles');
    rt.innerHTML = VOYAGE.roles.map(function (r) {
      return '<button type="button" class="tile" data-role="' + r.id + '"><span class="tile__kicker">' + esc(r.kicker) + '</span><h3>' + esc(r.name) + '</h3><p>' + esc(r.p) + '</p></button>';
    }).join('');
    rt.addEventListener('click', function (e) {
      var b = e.target.closest('[data-role]'); if (!b) return;
      draft.role = b.getAttribute('data-role');
      $$('[data-role]', rt).forEach(function (t) { t.classList.toggle('on', t === b); });
      $('#roleNext').disabled = false;
    });

    $('#locNext').addEventListener('click', function () { gateStep(2); });
    $('#deptNext').addEventListener('click', function () { gateStep(3); });
    $('#roleNext').addEventListener('click', function () { gateStep(4); });
    $$('.gate__back').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-back');
        if (t === 'welcome') show('welcome'); else gateStep(parseInt(t, 10));
      });
    });
    $('#gateFinish').addEventListener('click', function () {
      state.profile = { loc: draft.loc, family: draft.family, sub: draft.sub, role: draft.role };
      save();
      show('dashboard');
      toast('Your path is ready, ' + VOYAGE.user.first + '. Welcome aboard.');
    });
  }

  function renderDeptList(q) {
    var fams = (typeof SBJA !== 'undefined' && SBJA.families) || [];
    $('#deptList').innerHTML = fams.map(function (g) {
      var famHit = g.family.toLowerCase().indexOf(q) > -1;
      var hits = g.subs.filter(function (d) { return !q || famHit || d.toLowerCase().indexOf(q) > -1; });
      if (!hits.length) return '';
      return '<li class="group">' + esc(g.family) + '</li>' + hits.map(function (d) {
        return '<li><button type="button" data-fam="' + esc(g.family) + '" data-sub="' + esc(d) + '"' + (draft.sub === d && draft.family === g.family ? ' class="on"' : '') + '>' + esc(d) + '</button></li>';
      }).join('');
    }).join('');
  }

  /* =====================================================================
     ITEM CARDS — shared renderer
     ===================================================================== */
  function pillFor(id, it) {
    var s = statusOf(id);
    if (s === 'verified') return '<span class="pill pill--verified" title="Verified in ' + esc(it.src) + '">✓ Verified</span>';
    if (s === 'done') return '<span class="pill pill--done">Complete</span>';
    if (s === 'opened') return '<span class="pill pill--opened">Opened</span>';
    return '<span class="pill pill--todo">Not started</span>';
  }

  function cardHTML(it) {
    var cat = VOYAGE.cats[it.cat];
    var due = it.due ? '<span class="item__due ' + it.due + '">' + (it.due === 'hard' ? '● ' : '') + esc(it.dueLabel) + '</span>' : '';
    var legal = it.legal ? '<span class="lawchip lawchip--' + it.legal.toLowerCase() + '" title="' + esc(it.cite || '') + '">' + it.legal + '</span>' : '';
    var cad = it.cadence ? '<span>' + esc(it.cadence) + '</span>' : '';
    var cond = it.cond ? '<p class="item__prereq">⚠ ' + esc(it.cond) + '</p>' : '';
    var prereq = '';
    if (it.prereq) {
      var p = itemById(it.prereq);
      prereq = '<p class="item__prereq">Prerequisite: <b>' + esc(p ? p.title : it.prereq) + '</b>' + (isDone(it.prereq) ? ' ✓' : '') + '</p>';
    }
    var saved = state.saved.indexOf(it.id) > -1;
    var done = isDone(it.id);
    return '<article class="item" data-item="' + it.id + '">' +
      '<div class="item__top"><span class="item__cat">' + esc(cat.label) + '</span>' + pillFor(it.id, it) + '</div>' +
      '<h4>' + esc(it.title) + '</h4>' +
      '<div class="item__meta"><span>' + it.mins + ' min</span><span class="srcbadge">' + esc(it.src) + '</span>' + legal + due + cad + '</div>' +
      cond + prereq +
      '<div class="item__actions">' +
        '<a class="btn" data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + (done ? 'Revisit' : 'Open') + '</a>' +
        (done ? '' : '<button type="button" class="item__minor" data-done="' + it.id + '">Mark as done</button>') +
        '<button type="button" class="item__minor" data-save="' + it.id + '">' + (saved ? 'Saved ✓' : 'Save for later') + '</button>' +
      '</div></article>';
  }

  /* Delegated card actions (works in every view) */
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) {
      var id = go.getAttribute('data-go');
      trackClick(id);
      return; // let the link open in a new tab
    }
    var doneBtn = e.target.closest('[data-done]');
    if (doneBtn) { complete(doneBtn.getAttribute('data-done'), true); return; }
    var saveBtn = e.target.closest('[data-save]');
    if (saveBtn) {
      var sid = saveBtn.getAttribute('data-save');
      var i = state.saved.indexOf(sid);
      if (i > -1) state.saved.splice(i, 1); else state.saved.push(sid);
      save(); rerenderActive();
      return;
    }
    var openCat = e.target.closest('[data-open]');
    if (openCat) { e.preventDefault(); state.filter = 'benefits'; save(); show('dashboard'); }
    var nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); show(nav.getAttribute('data-nav')); }
  });

  /* Click-based completion capture: log the event, flip the pill instantly.
     API-backed sources report true completion on the nightly sync — simulated
     here with a short delay upgrading Opened → Verified. */
  function trackClick(id) {
    var it = itemById(id); if (!it) return;
    state.events.push({ id: id, ts: Date.now() });
    if (isDone(id)) { save(); return; }
    if (it.api) {
      state.status[id] = 'opened';
      save(); rerenderActive();
      setTimeout(function () {
        if (statusOf(id) === 'opened') {
          state.status[id] = 'verified';
          save(); rerenderActive();
          toast('“' + it.title + '” verified in ' + it.src + '.');
          if (it.mins > 30) confetti();
        }
      }, 6000);
    } else {
      complete(id, false);
    }
  }

  function complete(id, manual) {
    var it = itemById(id); if (!it) return;
    state.status[id] = 'done';
    if (manual) state.events.push({ id: id, ts: Date.now() });
    save(); rerenderActive();
    if (it.mins > 30) confetti();
    toast('“' + it.title + '” complete.');
  }

  function rerenderActive() {
    var v = $('.view.active');
    if (!v) return;
    var name = v.getAttribute('data-view');
    if (name === 'dashboard') renderDashboard();
    if (name === 'returning') renderReturning();
  }

  /* =====================================================================
     DASHBOARD — days 1–30
     ===================================================================== */
  function renderDashboard() {
    var items = myItems();
    var p = state.profile || {};

    $('#dashGreeting').textContent = greeting() + ', ' + VOYAGE.user.first;
    $('#dashDay').textContent = 'Day ' + VOYAGE.user.startOffsetDays + ' of your first 30 · ' + (p.sub || '') + ' · ' + locName(p.loc);

    var doneCount = items.filter(function (it) { return isDone(it.id); }).length;
    var pct = items.length ? Math.round(doneCount / items.length * 100) : 0;
    $('#ringPct').textContent = pct + '%';
    var C = 295.3;
    $('#ringBar').style.strokeDashoffset = String(C - C * pct / 100);

    $('#benefitDays').textContent = String(30 - VOYAGE.user.startOffsetDays);

    /* six tiles */
    $('#catTiles').innerHTML = VOYAGE.tiles.map(function (t) {
      var mine = items.filter(function (it) { return t.cats.indexOf(it.cat) > -1; });
      if (!mine.length) return '';
      var open = mine.filter(function (it) { return !isDone(it.id); }).length;
      var on = state.filter === t.id;
      return '<button type="button" class="cattile' + (t.hard ? ' cattile--hard' : '') + (on ? ' on' : '') + '" data-tile="' + t.id + '">' +
        (t.hard ? '<span class="cattile__badge">Deadlines</span>' : '') +
        '<h3>' + esc(t.label) + '</h3><span class="cattile__count">' + (open ? open + ' to go · ' : '') + mine.length + ' items</span></button>';
    }).join('');
    $$('#catTiles [data-tile]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-tile');
        state.filter = state.filter === id ? null : id;
        save(); renderDashboard();
      });
    });

    /* lanes */
    var tile = null;
    VOYAGE.tiles.forEach(function (t) { if (t.id === state.filter) tile = t; });
    var visible = tile ? items.filter(function (it) { return tile.cats.indexOf(it.cat) > -1; }) : items;

    $('#lanes').innerHTML = VOYAGE.lanes.map(function (lane) {
      var mine = visible.filter(function (it) { return it.lane === lane.id; });
      var cards = mine.length ? '<div class="lane__cards">' + mine.map(cardHTML).join('') + '</div>'
        : '<div class="lane__empty">Nothing in this lane' + (tile ? ' for ' + esc(tile.label) : '') + '.</div>';
      return '<div class="lane"><div class="lane__title"><h3>' + esc(lane.title) + '</h3><span>' + esc(lane.kicker) + '</span></div>' + cards + '</div>';
    }).join('');

    /* compliance center */
    var comp = items.filter(function (it) { return it.cite; });
    $('#compRows').innerHTML = comp.map(function (it) {
      return '<div class="comprow">' +
        '<div class="comprow__main"><b>' + esc(it.title) + '</b><small>' + esc(it.course || '') + (it.cond ? ' · ⚠ ' + esc(it.cond) : '') + '</small></div>' +
        '<div><span class="lawchip lawchip--' + it.legal.toLowerCase() + '">' + it.legal + '</span><small class="comprow__cite">' + esc(it.cite) + '</small></div>' +
        '<div class="comprow__when"><b>' + esc(it.dueLabel) + '</b><small>' + esc(it.cadence) + '</small></div>' +
        '<div>' + pillFor(it.id, it) + '</div>' +
        '<a class="btn" data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + (isDone(it.id) ? 'Revisit' : 'Start') + '</a></div>';
    }).join('');
    $('#compMeta').textContent = comp.filter(function (it) { return it.legal === 'Legal'; }).length + ' legally required · ' +
      comp.filter(function (it) { return it.legal === 'Advisory'; }).length + ' advisory (policy) · tuned to ' + locName(p.loc) + ' and your role tier';

    /* people */
    $('#people').innerHTML = VOYAGE.people.map(function (pp) {
      return '<div class="person"><span class="avatar">' + esc(pp.init) + '</span><b>' + esc(pp.name) + '</b><span>' + esc(pp.role) + '</span><span class="rel">' + esc(pp.rel) + '</span>' +
        '<a href="mailto:?subject=Intro%3A%20' + encodeURIComponent(pp.name) + '%20%2B%20' + encodeURIComponent(VOYAGE.user.first) + '&body=Scheduling%20a%2030-minute%20intro.">Schedule intro</a></div>';
    }).join('');

    /* up next: hard-dated first, prereqs met, not done */
    var next = items.filter(function (it) {
      if (isDone(it.id)) return false;
      if (it.prereq && !isDone(it.prereq)) return false;
      return true;
    }).sort(function (a, b) {
      var w = function (it) { return (it.due === 'hard' ? 0 : it.due === 'soft' ? 1 : 2); };
      return w(a) - w(b) || a.mins - b.mins;
    }).slice(0, 3);
    $('#upNext').innerHTML = next.length ? next.map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + it.mins + ' min · ' + esc(it.src) + (it.dueLabel ? ' · due ' + esc(it.dueLabel) : '') + '</small></a></li>';
    }).join('') : '<li class="empty">All caught up. Well sailed.</li>';

    /* saved */
    var savedItems = state.saved.map(itemById).filter(Boolean);
    $('#savedList').innerHTML = savedItems.length ? savedItems.map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + it.mins + ' min · ' + esc(it.src) + '</small></a></li>';
    }).join('') : '<li class="empty">Nothing saved yet.</li>';

    $('#announceList').innerHTML = VOYAGE.announcements.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
  }

  /* =====================================================================
     RETURNING — day 31+
     ===================================================================== */
  function renderReturning() {
    var p = state.profile || {};
    var items = myItems();

    $('#returnGreeting').textContent = 'Welcome back, ' + VOYAGE.user.first;
    $('#returnMeta').textContent = roleName(p.role) + ' · ' + (p.sub || '') + ' (' + (p.family || '') + ') · ' + locName(p.loc);
    $('#shelfForYouTitle').innerHTML = 'Because you’re a <em>' + esc(roleName(p.role)) + '</em> in <em>' + esc(p.sub || 'your sub-family') + '</em>';
    var chips = skillChips(p.family, p.sub, 10);
    $('#shelfSkills').innerHTML = chips ? '<p class="skillchips__label">Skills that matter in ' + esc(p.sub || 'your sub-family') + ' — from the Skills-Based Job Architecture</p>' + chips : '';

    /* resume: opened but not complete */
    var resume = items.filter(function (it) { return statusOf(it.id) === 'opened'; }).slice(0, 3);
    $('#shelfResume').innerHTML = resume.length ? resume.map(cardHTML).join('')
      : '<div class="lane__empty" style="grid-column:1/-1">Nothing in progress — everything you opened is complete.</div>';

    /* for you: role/dept-tuned items not yet done, then refreshers */
    var forYou = items.filter(function (it) { return it.aud && !isDone(it.id); }).slice(0, 3);
    if (forYou.length < 3) forYou = forYou.concat(items.filter(function (it) { return it.cat === 'courses' && forYou.indexOf(it) === -1; })).slice(0, 3);
    $('#shelfForYou').innerHTML = forYou.length ? forYou.map(cardHTML).join('')
      : '<div class="lane__empty" style="grid-column:1/-1">You’re fully current. New items land here as they publish.</div>';

    /* renewals */
    $('#shelfRenewals').innerHTML = VOYAGE.renewals.map(function (r) {
      var tone = r.days > 60 ? 'green' : r.days >= 30 ? 'amber' : 'red';
      return '<div class="renewal"><div class="renewal__days renewal__days--' + tone + '"><b>' + r.days + '</b><span>days</span></div>' +
        '<div class="renewal__main"><b>' + esc(r.title) + '</b><small>' + esc(r.src) + '</small></div>' +
        '<a class="btn" href="' + esc(r.href) + '" target="_blank" rel="noopener">Renew</a></div>';
    }).join('');

    /* FLH programs, filtered by role */
    $('#shelfExplore').innerHTML = myPrograms(p.role).map(function (x) {
      return '<article class="item"><div class="item__top"><span class="item__cat">FLH Program</span><span class="srcbadge">' + esc(x.who) + '</span></div>' +
        '<h4>' + esc(x.name) + '</h4><div class="item__meta"><span>' + esc(x.what) + '</span></div>' +
        '<p class="item__prereq">' + esc(x.value) + '</p>' +
        '<div class="item__actions"><a class="btn" href="https://me5231979.github.io/Course_Library/" target="_blank" rel="noopener">Learn more</a></div></article>';
    }).join('');

    /* quick rails */
    $('#quickSystems').innerHTML = VOYAGE.quickSystems.map(function (s) {
      return '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a></li>';
    }).join('');
    $('#quickPeople').innerHTML = VOYAGE.quickPeople.map(function (s) {
      return '<li><button type="button">' + esc(s.name) + '<small>' + esc(s.sub) + '</small></button></li>';
    }).join('');

    /* history */
    var seen = {}, recent = [];
    state.events.slice().reverse().forEach(function (ev) {
      if (seen[ev.id] || recent.length >= 10) return;
      seen[ev.id] = true;
      var it = itemById(ev.id);
      if (it) recent.push({ it: it, ts: ev.ts });
    });
    $('#recentList').innerHTML = recent.length ? recent.slice(0, 6).map(function (r) {
      var d = new Date(r.ts);
      return '<li><a data-go="' + r.it.id + '" href="' + esc(r.it.href) + '" target="_blank" rel="noopener">' + esc(r.it.title) + '<small>Viewed ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</small></a></li>';
    }).join('') : '<li class="empty">Nothing viewed yet.</li>';

    var completed = items.filter(function (it) { return isDone(it.id); });
    $('#completedList').innerHTML = completed.length ? completed.slice(0, 6).map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + (statusOf(it.id) === 'verified' ? 'Verified in ' + esc(it.src) : 'Complete') + '</small></a></li>';
    }).join('') : '<li class="empty">Nothing completed yet.</li>';

    $('#reProfile').onclick = function () { draft = { loc: null, family: null, sub: null, role: null }; show('gate'); gateStep(1); };
  }

  /* search */
  var catalog = null, catalogLoading = false, catalogWaiters = [];
  var OL_PREFIX = 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=';
  function loadCatalog(then) {
    if (catalog) { if (then) then(); return; }
    if (then) catalogWaiters.push(then);
    if (catalogLoading) return;
    catalogLoading = true;
    fetch('assets/data/catalog.json').then(function (r) { return r.json(); })
      .then(function (d) {
        catalog = d;
        catalogWaiters.splice(0).forEach(function (fn) { fn(); });
      })
      .catch(function () { catalogLoading = false; catalogWaiters.length = 0; });
  }
  function buildSearch() {
    var input = $('#bigSearch'), out = $('#searchResults');
    var placeholders = ['Search parking, benefits, HIPAA, Culture Amp…', 'Search pay stubs, badge, Epic, holidays…', 'Search harassment training, W-4, VPN…'];
    var pi = 0;
    setInterval(function () { if (!input.value && document.activeElement !== input) { pi = (pi + 1) % placeholders.length; input.placeholder = placeholders[pi]; } }, 5000);
    input.addEventListener('focus', function () { loadCatalog(); });
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (!q) { out.innerHTML = ''; return; }
      if (!catalog) loadCatalog(function () { input.dispatchEvent(new Event('input')); });
      var pool = myItems().map(function (it) { return { title: it.title, sub: it.src + ' · ' + it.mins + ' min' + (isDone(it.id) ? ' · completed' : ''), href: it.href, id: it.id }; })
        .concat(VOYAGE.programs.map(function (x) { return { title: x.name, sub: 'FLH Program · ' + x.who, href: 'https://me5231979.github.io/Course_Library/' }; }))
        .concat(VOYAGE.renewals.map(function (r) { return { title: r.title, sub: r.src + ' · renews in ' + r.days + ' days', href: r.href }; }));
      var hits = pool.filter(function (r) { return (r.title + ' ' + r.sub).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
      if (catalog && hits.length < 8) {
        var seen = {};
        hits.forEach(function (h) { seen[h.title.toLowerCase()] = 1; });
        for (var i = 0; i < catalog.length && hits.length < 8; i++) {
          var name = catalog[i][0];
          if (name.toLowerCase().indexOf(q) > -1 && !seen[name.toLowerCase()]) {
            seen[name.toLowerCase()] = 1;
            hits.push({ title: name, sub: 'Oracle Learn · active course catalog', href: OL_PREFIX + catalog[i][1] });
          }
        }
      }
      out.innerHTML = hits.length ? hits.map(function (r) {
        return '<div class="result"><div class="result__main"><b>' + esc(r.title) + '</b><small>' + esc(r.sub) + '</small></div>' +
          '<a class="btn"' + (r.id ? ' data-go="' + r.id + '"' : '') + ' href="' + esc(r.href) + '" target="_blank" rel="noopener">Open</a></div>';
      }).join('') : '<div class="result"><div class="result__main"><b>No matches for “' + esc(input.value.trim()) + '”</b><small>Try a system name, a policy, or ask PCB.</small></div><a class="btn" href="mailto:hr@vanderbilt.edu?subject=' + encodeURIComponent('Can’t find: ' + input.value.trim()) + '">Ask PCB</a></div>';
    });
  }

  /* ---------- confetti (respects reduced motion) ---------- */
  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var wrap = document.createElement('div');
    wrap.className = 'confetti';
    var colors = ['#CFAE70', '#FEEEB6', '#B49248', '#ECB748', '#FFFFFF'];
    for (var i = 0; i < 60; i++) {
      var f = document.createElement('i');
      f.style.left = (Math.random() * 100) + 'vw';
      f.style.background = colors[i % colors.length];
      f.style.animationDelay = (Math.random() * .5) + 's';
      f.style.animationDuration = (1.2 + Math.random()) + 's';
      wrap.appendChild(f);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 2600);
  }

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  /* ---------- reveal on scroll (shared idiom) ---------- */
  var obs;
  function reveal() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = $$('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    if (!obs) obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { obs.observe(el); });
    requestAnimationFrame(function () {
      els.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('in'); if (obs) obs.unobserve(el); } });
    });
  }

  /* ---------- boot ---------- */
  buildGate();
  buildSearch();

  $('#beginBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (state.profile) { show('dashboard'); return; }
    show('gate'); gateStep(1);
  });
  $('#navCta').addEventListener('click', function (e) {
    e.preventDefault();
    if (state.profile) show('dashboard'); else { show('gate'); gateStep(1); }
  });

  var nav = $('.nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  var idc = $('#idInitials');
  idc.textContent = VOYAGE.user.first[0] + VOYAGE.user.last[0];
  $('#idName').textContent = VOYAGE.user.first + ' ' + VOYAGE.user.last;
  $('#idMeta').textContent = 'VUnetID ' + VOYAGE.user.vunetid + ' · Manager: ' + VOYAGE.user.manager + ' · Pre-populated from Oracle HCM';

  if (state.profile) show('welcome'); else show('welcome');
  reveal();
})();
