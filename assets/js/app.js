/* =====================================================================
   VOYAGE — onboarding dashboard engine
   Views: welcome → gate (3 questions) → dashboard (days 1–30) → returning.
   Click on a card's primary CTA is the completion signal; API-backed
   items log "Opened" then upgrade to "Verified" (simulated nightly sync).
   State persists in localStorage.
   ===================================================================== */

(function () {
  'use strict';

  var T = window.VoyageT;

  var LS = 'voyage_v1';
  var state = load() || { profile: null, status: {}, saved: [], events: [], filter: null, optout: {} };
  if (!state.optout) state.optout = {};
  if (!state.doneTs) state.doneTs = {};

  function load() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function firstName() { return (state.name && state.name.split(' ')[0]) || VOYAGE.user.first; }
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {}
    var sc = window.VoyageSCORM;
    if (sc && sc.connected && sc.setData) {
      sc.setData({ s: state.start, p: state.profile, st: state.status, n: state.name, o: state.optout, dn: state.scoDone, dt: state.doneTs, iv: state.introSeen ? 1 : 0 });
    }
  }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- audience filter ---------- */
  function meetItems() {
    return VOYAGE.people.map(function (pp, i) {
      return { id: 'meet-' + i, type: 'meet', rec: !!pp.rec, title: 'Meet ' + pp.who + ' — 30-minute introduction',
        cat: 'people', lane: VOYAGE.peopleLanes[i] || 'w1', mins: 30, src: 'You + Outlook', api: false,
        due: 'soft', dueLabel: (VOYAGE.peopleLanes[i] === 'w24' ? 'Day 21' : 'Week 1'),
        href: 'assets/docs/intro-meetings-guide.pdf' };
    });
  }
  function myItems() {
    var p = state.profile || {};
    return VOYAGE.items.filter(function (it) {
      if (!it.aud) return true;
      if (it.aud.loc && it.aud.loc.indexOf(p.loc) === -1) return false;
      if (it.aud.family && it.aud.family.indexOf(p.family) === -1) return false;
      if (it.aud.sub && it.aud.sub.indexOf(p.sub) === -1) return false;
      if (it.aud.student) return !!p.student;
      if (it.aud.role && it.aud.role.indexOf(p.role) === -1) return false;
      return true;
    }).concat(meetItems());
  }
  function statusOf(id) { return state.status[id] || 'todo'; }
  function isDone(id) { var s = statusOf(id); return s === 'done' || s === 'verified'; }
  function isOut(id) { return Object.prototype.hasOwnProperty.call(state.optout, id); }
  function itemById(id) {
    for (var i = 0; i < VOYAGE.items.length; i++) if (VOYAGE.items[i].id === id) return VOYAGE.items[i];
    if (id.indexOf('meet-') === 0) { var m = meetItems(); for (var j = 0; j < m.length; j++) if (m[j].id === id) return m[j]; }
    return null;
  }
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
    $('#navCta').textContent = hasProfile ? T('My path') : T('Begin onboarding');
    $('#beginBtn').textContent = hasProfile ? T('Continue your voyage') : T("Let's tailor your first weeks");
    paintHeroLead(hasProfile);
    document.body.classList.toggle('view-light', view === 'dashboard' || view === 'returning' || view === 'engage');
    if (view === 'dashboard') renderDashboard();
    if (view === 'returning') renderReturning();
    if (view === 'engage') renderEngage();
    introGate(view === 'dashboard');
    window.scrollTo(0, 0);
    reveal();
  }

  /* ---------- 90-day intro video gate ----------
     Blocks the dashboard until the intro video has been watched to the
     end, exactly once per learner (persisted locally and in SCORM
     suspend_data). Seeking ahead is prevented; pausing is allowed.
     Fails open: if the video file is absent (e.g., the lean SCORM
     package excludes assets/video) the dashboard is never blocked. */
  var introUnavailable = false;
  var introWired = false;
  var introMax = 0;
  function introGate(active) {
    var m = $('#introModal');
    if (!m) return;
    var v = $('#introVideo');
    if (!active || state.introSeen || introUnavailable) {
      m.hidden = true;
      document.body.classList.remove('vmodal-open');
      if (v && !v.paused) v.pause();
      return;
    }
    if (!introWired) {
      introWired = true;
      var playBtn = $('#introPlayBtn');
      v.addEventListener('error', function () { introUnavailable = true; introGate(false); });
      v.addEventListener('timeupdate', function () {
        if (v.currentTime > introMax) introMax = v.currentTime;
        if (v.duration) $('#introBar').style.width = Math.min(100, (v.currentTime / v.duration) * 100) + '%';
      });
      v.addEventListener('seeking', function () {
        if (v.currentTime > introMax + 0.5) v.currentTime = introMax;
      });
      v.addEventListener('ended', function () {
        state.introSeen = true;
        save();
        introGate(false);
      });
      v.addEventListener('click', function () {
        if (!v.paused) { v.pause(); playBtn.classList.remove('hide'); }
      });
      playBtn.addEventListener('click', function () {
        v.play();
        playBtn.classList.add('hide');
      });
      v.src = 'assets/video/intro-90day.mp4';
    }
    m.hidden = false;
    document.body.classList.add('vmodal-open');
    $('#introPlayBtn').focus();
  }

  /* ---------- start date: anchored at first launch ---------- */
  function ensureStart() {
    var sc = window.VoyageSCORM;
    if (sc && sc.connected) {
      var d = sc.getData();
      if (d.s || d.start) {
        state.start = d.s || d.start;
        if (d.p && !state.profile) state.profile = d.p;
        if (d.st) state.status = d.st;
        if (d.o) state.optout = d.o;
        if (d.dn) state.scoDone = true;
        if (d.dt) state.doneTs = d.dt;
        if (d.iv) state.introSeen = true;
        if (d.n && !state.name) state.name = d.n;
        save(); return;
      }
      if (!state.start) state.start = Date.now();
      save(); return;
    }
    if (!state.start) { state.start = Date.now(); save(); }
  }
  function dayOfPath() {
    if (!state.start) return 1;
    var d = Math.floor((Date.now() - state.start) / 86400000) + 1;
    return Math.max(1, Math.min(90, d));
  }

  /* ---------- greeting ---------- */
  function greeting() {
    var h = new Date().getHours();
    return T(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }

  /* =====================================================================
     GATE — three-question personalization
     ===================================================================== */
  var draft = { loc: null, family: null, sub: null, role: null, student: false, studentAns: null };
  var optDraftId = null;

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
      $('#summaryPath').innerHTML = 'Here’s your custom path: <b>' + esc(roleName(draft.role)) + (draft.student ? ' · student/minor-facing' + (draft.studentAns === 'unsure' ? ' (enrolled to be safe)' : '') : '') + '</b> · <b>' + esc(draft.sub) + '</b> (' + esc(draft.family) + ') · <b>' + esc(locName(draft.loc)) + '</b>';
      var mins = VOYAGE.items.filter(function (it) {
        if (!it.aud) return true;
        if (it.aud.loc && it.aud.loc.indexOf(draft.loc) === -1) return false;
        if (it.aud.family && it.aud.family.indexOf(draft.family) === -1) return false;
        if (it.aud.sub && it.aud.sub.indexOf(draft.sub) === -1) return false;
        if (it.aud.student) return draft.student;
        if (it.aud.role && it.aud.role.indexOf(draft.role) === -1) return false;
        return true;
      }).reduce(function (a, it) { return a + it.mins; }, 0);
      $('#summaryHours').innerHTML = 'Approximately <b>' + (Math.round(mins / 30) / 2) + ' hours</b> across your first 90 days.';
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
      $$('[data-loc]', lt).forEach(function (t) { t.classList.toggle('on', t === b); t.setAttribute('aria-pressed', String(t === b)); });
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
      pv.innerHTML = 'You’ll be joining <b>' + esc(draft.sub) + '</b> in the <b>' + esc(draft.family) + '</b> family.' +
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
      $$('[data-role]', rt).forEach(function (t) { t.classList.toggle('on', t === b); t.setAttribute('aria-pressed', String(t === b)); });
      $('#roleNext').disabled = !(draft.role && draft.studentAns);
    });
    function gateRoleReady() { $('#roleNext').disabled = !(draft.role && draft.studentAns); }
    $$('.studentopts button').forEach(function (b) {
      b.addEventListener('click', function () {
        draft.studentAns = b.getAttribute('data-student');
        draft.student = draft.studentAns !== 'no';   // unsure enrolls as a precaution
        $$('.studentopts button').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        gateRoleReady();
      });
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
      state.profile = { loc: draft.loc, family: draft.family, sub: draft.sub, role: draft.role, student: draft.student };
      save();
      show('dashboard');
      toast('Your path is ready, ' + firstName() + '. Welcome aboard.');
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
    if (s === 'verified') return '<span class="pill pill--verified" title="' + esc(it.src) + '">' + T('✓ Verified') + '</span>';
    if (s === 'done') return '<span class="pill pill--done">' + T('Complete') + '</span>';
    if (s === 'opened') return '<span class="pill pill--opened">' + T('Opened') + '</span>';
    return '<span class="pill pill--todo">' + T('Not started') + '</span>';
  }

  var CTA_BY_TYPE = { meet: 'How-to guide (PDF)', survey: 'Take survey', read: 'Open', task: 'Start', course: 'Start', compliance: 'Start' };
  function isManagerOnly(it) {
    return !!(it.aud && it.aud.role && it.aud.role.length === 1 && it.aud.role[0] === 'manager');
  }
  function mvBadge(it) {
    return isManagerOnly(it) ? '<span class="mvbadge">' + T('⚓ Manager’s Voyage') + '</span>' : '';
  }
  function ctaFor(it, done) {
    if (done) return T('Revisit');
    if (it.lane === 'pre') return T('Verify');
    return T(CTA_BY_TYPE[it.type] || 'Start');
  }
  function typeChip(it) {
    var t = VOYAGE.typeDefs[it.type] || VOYAGE.typeDefs.task;
    return '<span class="typechip typechip--' + (it.type || 'task') + '">' + T(t.label) + '</span>';
  }
  function rowHTML(it) {
    var done = isDone(it.id);
    var saved = state.saved.indexOf(it.id) > -1;
    var due = it.due ? '<span class="item__due ' + it.due + '">' + (it.due === 'hard' ? '● ' : '') + esc(it.dueLabel) + '</span>' : '';
    var prereq = '';
    if (it.prereq && !isDone(it.prereq)) {
      var pr = itemById(it.prereq);
      prereq = '<span class="item__prereq">needs: ' + esc(pr ? pr.title : it.prereq) + '</span>';
    }
    var rec = it.rec ? '<span class="recbadge">' + T('★ Recommended') + '</span>' : '';
    var cond = it.cond ? '<span class="item__prereq">⚠ ' + esc(it.cond) + '</span>' : '';
    if (isOut(it.id)) {
      return '<article class="item item--row item--out item--' + (it.type || 'task') + '" data-item="' + it.id + '">' +
        typeChip(it) +
        '<div class="row__main"><h4>' + esc(it.title) + '</h4>' +
          '<div class="item__meta"><span class="pill pill--out">' + T('Opted out') + '</span></div>' +
          '<p class="optreason">“' + esc(state.optout[it.id] || '') + '”</p></div>' +
        '<span></span>' +
        '<div class="item__actions"><button type="button" class="item__minor item__minor--text" data-reinstate="' + it.id + '">' + T('Reinstate') + '</button></div></article>';
    }
    if (optDraftId === it.id) {
      return '<article class="item item--row item--optform item--' + (it.type || 'task') + '" data-item="' + it.id + '">' +
        typeChip(it) +
        '<div class="row__main"><h4>' + esc(it.title) + '</h4>' +
          '<div class="optform"><label for="optText">' + T('Opt out — write a brief justification. It is recorded and reportable, like a quiz response.') + '</label>' +
          '<textarea id="optText" rows="2" maxlength="250" placeholder="' + T('e.g., Completed equivalent training at my previous employer in May 2026.') + '"></textarea>' +
          '<div class="optform__actions"><button type="button" class="btn" data-optconfirm="' + it.id + '">' + T('Record opt-out') + '</button>' +
          '<button type="button" class="item__minor item__minor--text" data-optcancel="' + it.id + '">' + T('Cancel') + '</button></div></div></div></article>';
    }
    return '<article class="item item--row item--' + (it.type || 'task') + '" data-item="' + it.id + '">' +
      '<div class="row__chips">' + typeChip(it) + mvBadge(it) + rec + '</div>' +
      '<div class="row__main"><h4>' + esc(it.title) + '</h4>' +
        '<div class="item__meta"><span>' + it.mins + ' min</span><span class="srcbadge">' + esc(it.src) + '</span>' + due +
        (it.cadence ? '<span>' + esc(it.cadence) + '</span>' : '') + prereq + cond + '</div></div>' +
      pillFor(it.id, it) +
      '<div class="item__actions">' +
        '<a class="btn" data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + ctaFor(it, done) + '</a>' +
        (done ? '<button type="button" class="item__minor item__minor--text" data-reopen="' + it.id + '">' + T('Reopen') + '</button>'
              : '<button type="button" class="item__minor" data-done="' + it.id + '" title="' + T(it.lane === 'pre' ? 'Confirm complete' : 'Mark as done') + '" aria-label="' + T(it.lane === 'pre' ? 'Confirm complete' : 'Mark as done') + '">✓</button>') +
        '<button type="button" class="item__minor" data-save="' + it.id + '" title="' + T('Save for later') + '" aria-label="' + T('Save for later') + '">' + (saved ? '♥' : '♡') + '</button>' +
        '<button type="button" class="item__minor item__minor--text" data-optout="' + it.id + '">' + T('Opt out') + '</button>' +
        (it.info ? '<a class="item__minor" href="' + esc(it.info) + '" target="_blank" rel="noopener" title="' + T('About') + '" aria-label="' + T('About') + '">ⓘ</a>' : '') +
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
    var outBtn = e.target.closest('[data-optout]');
    if (outBtn) {
      optDraftId = outBtn.getAttribute('data-optout');
      rerenderActive();
      var ta = $('#optText'); if (ta) ta.focus();
      return;
    }
    var confirmBtn = e.target.closest('[data-optconfirm]');
    if (confirmBtn) {
      var oid = confirmBtn.getAttribute('data-optconfirm');
      var ta2 = $('#optText');
      var reason = (ta2 ? ta2.value : '').trim();
      if (!reason) { toast(T('Opt-out needs a written justification.')); if (ta2) ta2.focus(); return; }
      optDraftId = null;
      state.optout[oid] = reason;
      delete state.status[oid];
      save();
      if (window.VoyageSCORM && window.VoyageSCORM.connected) window.VoyageSCORM.recordOptOut(oid, reason);
      rerenderActive();
      toast(T('Opted out — justification recorded.'));
      maybeReportPathComplete();
      return;
    }
    var cancelBtn = e.target.closest('[data-optcancel]');
    if (cancelBtn) { optDraftId = null; rerenderActive(); return; }
    var reBtn = e.target.closest('[data-reinstate]');
    if (reBtn) {
      delete state.optout[reBtn.getAttribute('data-reinstate')];
      save(); rerenderActive();
      toast(T('Reinstated — back on your path.'));
      return;
    }
    var roBtn = e.target.closest('[data-reopen]');
    if (roBtn) {
      var rid = roBtn.getAttribute('data-reopen');
      delete state.status[rid];
      delete state.doneTs[rid];
      save(); rerenderActive();
      toast(T('Reopened — status reset to Not started.'));
      return;
    }
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
    if (it.type === 'meet') {
      if (statusOf(id) === 'todo') { state.status[id] = 'opened'; save(); rerenderActive(); }
      toast(T('Guide opened — schedule the meeting, then mark it complete with the ✓.'));
    } else if (it.api) {
      state.status[id] = 'opened';
      save(); rerenderActive();
      toast('Opened in ' + it.src + ' — completion syncs overnight in production. Mark it done here when you finish.');
    } else {
      complete(id, false);
    }
  }

  function maybeReportPathComplete() {
    if (state.scoDone || !state.profile) return;
    var counted = myItems().filter(function (it) { return !isOut(it.id); });
    if (!counted.length || !counted.every(function (it) { return isDone(it.id); })) return;
    state.scoDone = true;
    save();
    if (window.VoyageSCORM && window.VoyageSCORM.connected) window.VoyageSCORM.complete();
    confetti();
    toast(T('Your first 90 days are complete — recorded in Oracle Learning. Well sailed.'));
  }

  function complete(id, manual) {
    var it = itemById(id); if (!it) return;
    state.status[id] = 'done';
    state.doneTs[id] = Date.now();
    if (manual) state.events.push({ id: id, ts: Date.now() });
    if (manual && !it.api && window.VoyageSCORM && window.VoyageSCORM.connected) {
      window.VoyageSCORM.recordAttestation(id, 'Self-attested complete on ' + new Date().toISOString().slice(0, 10) + ' — course delivered outside Oracle Learning');
    }
    maybeReportPathComplete();
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
    if (name === 'engage') renderEngage();
    $('#navCta').textContent = state.profile ? T('My path') : T('Begin onboarding');
    $('#beginBtn').textContent = state.profile ? T('Continue your voyage') : T("Let's tailor your first weeks");
    paintHeroLead(!!state.profile);
  }
  function paintHeroLead(hasProfile) {
    $('#heroLead').textContent = hasProfile
      ? T('Welcome back. Your dashboard is right where you left it — your path, your progress, and your people, all in one place. Step in and pick up where you left off.')
      : T("You've finished Vanderbilt Voyage (Classroom) — this is what comes next. A few quick questions tune your first 90 days to your campus, your department, and your role, then every task, course, and contact lives on one dashboard. We know you. We're ready for you.");
  }

  /* =====================================================================
     DASHBOARD — days 1–30
     ===================================================================== */
  function renderDashboard() {
    var items = myItems();
    var p = state.profile || {};

    $('#dashGreeting').textContent = greeting() + ', ' + firstName();
    $('#dashDay').textContent = T('DAY_LINE').replace('{n}', dayOfPath()) + ' · ' + (p.sub || '') + ' · ' + locName(p.loc);
    $('.ring').setAttribute('aria-label', T('Onboarding progress'));

    var counted = items.filter(function (it) { return !isOut(it.id); });
    var totalMins = counted.reduce(function (acc, it) { return acc + it.mins; }, 0);
    var doneMins = counted.reduce(function (acc, it) { return acc + (isDone(it.id) ? it.mins : 0); }, 0);
    var pct = totalMins ? Math.round(doneMins / totalMins * 100) : 0;
    if (doneMins > 0 && pct === 0) pct = 1;
    $('#ringPct').textContent = pct + '%';
    var C = 295.3;
    $('#ringBar').style.strokeDashoffset = String(C - C * pct / 100);

    $('#benefitDays').textContent = String(Math.max(0, 30 - dayOfPath()));

    /* six tiles */
    $('#catTiles').innerHTML = VOYAGE.tiles.map(function (t) {
      var mine = items.filter(function (it) { return t.cats.indexOf(it.cat) > -1; });
      if (!mine.length) return '';
      var open = mine.filter(function (it) { return !isDone(it.id); }).length;
      var on = state.filter === t.id;
      var typeCounts = {};
      mine.forEach(function (it) { var k = it.type || 'task'; typeCounts[k] = (typeCounts[k] || 0) + 1; });
      var dominant = Object.keys(typeCounts).sort(function (x, y) { return typeCounts[y] - typeCounts[x]; })[0];
      var edge = (VOYAGE.typeDefs[dominant] || {}).edge || 'var(--vu-gold-flat)';
      var dots = Object.keys(VOYAGE.typeDefs).filter(function (k) { return typeCounts[k]; }).map(function (k) {
        return '<i class="cattile__dot" style="background:' + VOYAGE.typeDefs[k].edge + '" title="' + VOYAGE.typeDefs[k].label + ' · ' + typeCounts[k] + '"></i>';
      }).join('');
      return '<button type="button" aria-pressed="' + on + '" class="cattile' + (on ? ' on' : '') + '" data-tile="' + t.id + '" style="border-top-color:' + edge + '">' +
        (t.hard ? '<span class="cattile__badge">' + T('Deadlines') + '</span>' : '') +
        '<h3>' + esc(t.label) + '</h3><span class="cattile__count">' + (open ? open + ' ' + T('to go') + ' · ' : '') + mine.length + ' ' + T('items') + '</span>' +
        '<span class="cattile__dots" aria-hidden="true">' + dots + '</span></button>';
    }).join('');
    $$('#catTiles [data-tile]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-tile');
        state.filter = state.filter === id ? null : id;
        save(); renderDashboard();
      });
    });
    $('#typeLegend').innerHTML = Object.keys(VOYAGE.typeDefs).map(function (k) {
      return '<span class="legend__key legend__key--' + k + '">' + T(VOYAGE.typeDefs[k].label) + '</span>';
    }).join('');
    var fc = $('#filterClear');
    fc.classList.toggle('show', !!(state.filter || state.mvOnly));
    fc.onclick = function () { state.filter = null; state.mvOnly = false; save(); renderDashboard(); };
    var mf = $('#mvFilter');
    mf.hidden = p.role !== 'manager';
    mf.classList.toggle('on', !!state.mvOnly);
    mf.setAttribute('aria-pressed', String(!!state.mvOnly));
    mf.onclick = function () { state.mvOnly = !state.mvOnly; save(); renderDashboard(); };

    /* lanes */
    var tile = null;
    VOYAGE.tiles.forEach(function (t) { if (t.id === state.filter) tile = t; });
    var visible = tile ? items.filter(function (it) { return tile.cats.indexOf(it.cat) > -1; }) : items;
    if (state.mvOnly) visible = visible.filter(isManagerOnly);

    $('#lanes').innerHTML = VOYAGE.lanes.map(function (lane) {
      var mine = visible.filter(function (it) { return it.lane === lane.id; });
      var laneIn = mine.filter(function (it) { return !isOut(it.id); });
      var laneDone = laneIn.filter(function (it) { return isDone(it.id); }).length;
      var count = mine.length ? '<span class="lane__count">' + T('LANE_COUNT').replace('{done}', laneDone).replace('{total}', laneIn.length) + '</span>' : '';
      var cards = mine.length ? '<div class="lane__rows">' + mine.map(rowHTML).join('') + '</div>'
        : '<div class="lane__empty">' + (tile ? T('LANE_EMPTY_FOR').replace('{cat}', esc(tile.label)) : T('LANE_EMPTY')) + '</div>';
      var note = lane.note ? '<p class="lane__note">' + esc(T(lane.note)) + '</p>' : '';
      return '<div class="lane"><div class="lane__title"><h3>' + esc(T(lane.title)) + '</h3><span>' + esc(T(lane.kicker)) + '</span>' + count + '</div>' + note + cards + '</div>';
    }).join('') + '<div class="daybeyond"><div>' + T('DAY_BEYOND') + '</div><button type="button" class="btn btn--ghost-dark" data-nav="returning">' + T('Preview it now →') + '</button></div>';

    /* up next: hard-dated first, prereqs met, not done */
    var today = dayOfPath();
    function dueDay(it) {
      if (!it.dueLabel) return 99;
      var m = /Day (\d+)/.exec(it.dueLabel);
      if (m) return parseInt(m[1], 10);
      var w = /Within (\d+) (day|month)/.exec(it.dueLabel);
      if (w) return parseInt(w[1], 10) * (w[2] === 'month' ? 30 : 1);
      if (/On hire/.test(it.dueLabel)) return 7;
      if (/Week 1/.test(it.dueLabel)) return 7;
      if (/Verify/.test(it.dueLabel)) return 1;
      return 60;
    }
    var next = items.filter(function (it) {
      if (isDone(it.id) || isOut(it.id)) return false;
      if (it.prereq && !isDone(it.prereq)) return false;
      return true;
    }).sort(function (a, b) {
      var da = dueDay(a) - today, db = dueDay(b) - today;
      var wa = (a.due === 'hard' ? 0 : 1), wb = (b.due === 'hard' ? 0 : 1);
      return da - db || wa - wb || a.mins - b.mins;
    }).slice(0, 3);
    $('#upNext').innerHTML = next.length ? next.map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + it.mins + ' min · ' + esc(it.src) + (it.dueLabel ? ' · due ' + esc(it.dueLabel) : '') + '</small></a></li>';
    }).join('') : '<li class="empty">' + T('All caught up. Well sailed.') + '</li>';

    /* saved */
    var savedItems = state.saved.map(itemById).filter(Boolean);
    $('#savedList').innerHTML = savedItems.length ? savedItems.map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + it.mins + ' min · ' + esc(it.src) + '</small></a></li>';
    }).join('') : '<li class="empty">' + T('Nothing saved yet.') + '</li>';

    $('#announceList').innerHTML = VOYAGE.announcements.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
  }

  /* =====================================================================
     RETURNING — day 31+
     ===================================================================== */
  function cadenceDays(c) {
    if (!c) return 0;
    if (/every 2 years|biennial/i.test(c)) return 730;
    if (/annual/i.test(c)) return 365;
    return 0;
  }
  function myRenewals() {
    var out = [];
    myItems().forEach(function (it) {
      if (isOut(it.id) || !isDone(it.id)) return;
      var period = cadenceDays(it.cadence);
      if (!period || !state.doneTs[it.id]) return;
      var daysLeft = Math.ceil(period - (Date.now() - state.doneTs[it.id]) / 86400000);
      out.push({ it: it, days: daysLeft });
    });
    return out.sort(function (x, y) { return x.days - y.days; });
  }
  function growRow(g, label, mv) {
    return '<article class="item item--row item--course">' +
      '<div class="row__chips"><span class="typechip typechip--course">' + esc(label) + '</span>' +
      (mv ? '<span class="mvbadge" title="Part of the Manager Voyage — manager-only development">⚓ Manager’s Voyage</span>' : '') + '</div>' +
      '<div class="row__main"><h4>' + esc(g.name) + '</h4>' +
      '<div class="item__meta"><span>' + g.mins + ' min</span><span class="srcbadge">Oracle Learn</span></div></div>' +
      '<span></span>' +
      '<div class="item__actions"><a class="btn" href="' + esc(g.href) + '" target="_blank" rel="noopener">Start</a>' +
      (g.info ? '<a class="item__minor" href="' + esc(g.info) + '" target="_blank" rel="noopener" title="About">ⓘ</a>' : '') + '</div></article>';
  }
  function renderReturning() {
    var p = state.profile || {};
    var items = myItems();

    $('#returnGreeting').textContent = 'Welcome back, ' + firstName();
    $('#returnMeta').textContent = roleName(p.role) + ' · ' + (p.sub || '') + ' (' + (p.family || '') + ') · ' + locName(p.loc);
    var rn = roleName(p.role);
    $('#shelfForYouTitle').innerHTML = 'Because you’re ' + (/^[aeiou]/i.test(rn) ? 'an' : 'a') + ' <em>' + esc(rn) + '</em> in <em>' + esc(p.sub || 'your sub-family') + '</em>';
    var chips = skillChips(p.family, p.sub, 10);
    $('#shelfSkills').innerHTML = chips ? '<p class="skillchips__label">Skills that matter in ' + esc(p.sub || 'your sub-family') + ' — from the Skills-Based Job Architecture</p>' + chips : '';

    /* grow my career: marketplace + deeper AI + role-tuned development */
    var dev = (p.role === 'manager') ? VOYAGE.growth.manager : VOYAGE.growth.staff;
    $('#growShelf').innerHTML =
      '<div class="growgroup">' + VOYAGE.growth.marketplace.map(function (g) { return growRow(g, 'Talent Marketplace'); }).join('') + '</div>' +
      '<div class="growgroup">' + VOYAGE.growth.ai.map(function (g) { return growRow(g, T('AI — deeper dive')); }).join('') + '</div>' +
      '<div class="growgroup">' + dev.map(function (g) { return growRow(g, T(p.role === 'manager' ? 'Manager development' : 'Professional development'), p.role === 'manager'); }).join('') + '</div>';

    /* resume: opened but not complete */
    var resume = items.filter(function (it) { return statusOf(it.id) === 'opened'; }).slice(0, 3);
    $('#shelfResume').innerHTML = resume.length ? resume.map(rowHTML).join('')
      : '<div class="lane__empty">' + T('Nothing in progress — everything you opened is complete.') + '</div>';

    /* for you: role/dept-tuned items not yet done, then refreshers */
    var forYou = items.filter(function (it) { return it.aud && !isDone(it.id); }).slice(0, 3);
    if (forYou.length < 3) forYou = forYou.concat(items.filter(function (it) { return it.cat === 'courses' && forYou.indexOf(it) === -1; })).slice(0, 3);
    $('#shelfForYou').innerHTML = forYou.length ? forYou.map(rowHTML).join('')
      : '<div class="lane__empty">' + T('You’re fully current. New items land here as they publish.') + '</div>';

    /* renewals — derived from completed items with a recurring cadence */
    var ren = myRenewals();
    $('#shelfRenewals').innerHTML = ren.length ? ren.map(function (r) {
      var tone = r.days > 60 ? 'green' : r.days >= 30 ? 'amber' : 'red';
      return '<div class="renewal"><div class="renewal__days renewal__days--' + tone + '"><b>' + Math.max(0, r.days) + '</b><span>' + T('days') + '</span></div>' +
        '<div class="renewal__main"><b>' + esc(r.it.title) + '</b><small>' + esc(r.it.cadence) + ' · ' + esc(r.it.src) + '</small></div>' +
        '<a class="btn" data-go="' + r.it.id + '" href="' + esc(r.it.href) + '" target="_blank" rel="noopener">' + T('Renew') + '</a></div>';
    }).join('') :
    '<div class="renewempty"><b>' + T('Nothing to renew yet.') + '</b> ' + T('RENEW_EMPTY_BODY') + '</div>';

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
    }).join('') : '<li class="empty">' + T('Nothing viewed yet.') + '</li>';

    var completed = items.filter(function (it) { return isDone(it.id); });
    $('#completedList').innerHTML = completed.length ? completed.slice(0, 6).map(function (it) {
      return '<li><a data-go="' + it.id + '" href="' + esc(it.href) + '" target="_blank" rel="noopener">' + esc(it.title) + '<small>' + (statusOf(it.id) === 'verified' ? 'Verified in ' + esc(it.src) : 'Complete') + '</small></a></li>';
    }).join('') : '<li class="empty">' + T('Nothing completed yet.') + '</li>';

    $('#reProfile').onclick = startReprofile;
  }

  /* =====================================================================
     ENGAGE — programs, events & partnerships (available at any point)
     ===================================================================== */
  function renderEngage() {
    var p = state.profile || {};
    $('#engageGroups').innerHTML = VOYAGE.groups.map(function (g) {
      return '<article class="item"><div class="item__top"><span class="item__cat">Staff community</span><span class="srcbadge">' + esc(g.who) + '</span></div>' +
        '<h4>' + esc(g.name) + '</h4><div class="item__meta"><span>' + esc(g.what) + '</span></div>' +
        '<p class="item__prereq">' + esc(g.value) + '</p>' +
        '<div class="item__actions"><a class="btn" href="' + esc(g.href) + '" target="_blank" rel="noopener">Visit</a></div></article>';
    }).join('');
    $('#engagePrograms').innerHTML = myPrograms(p.role).map(function (x) {
      return '<article class="item"><div class="item__top"><span class="item__cat">FLH Program</span><span class="srcbadge">' + esc(x.who) + '</span></div>' +
        '<h4>' + esc(x.name) + '</h4><div class="item__meta"><span>' + esc(x.what) + '</span></div>' +
        '<p class="item__prereq">' + esc(x.value) + '</p>' +
        '<div class="item__actions"><a class="btn" href="' + esc(x.href || 'https://www.vanderbilt.edu/pcb/') + '" target="_blank" rel="noopener">Learn more</a></div></article>';
    }).join('');
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
        .concat(VOYAGE.programs.map(function (x) { return { title: x.name, sub: 'FLH Program · ' + x.who, href: x.href || 'https://www.vanderbilt.edu/pcb/' }; }))
        .concat(myRenewals().map(function (r) { return { title: r.it.title, sub: T('RENEWS_IN').replace('{n}', Math.max(0, r.days)) + ' · ' + r.it.src, href: r.it.href, id: r.it.id }; }));
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

  function startReprofile() {
    draft = { loc: null, family: null, sub: null, role: null, student: false, studentAns: null };
    $$('.studentopts button').forEach(function (x) { x.classList.remove('on'); });
    show('gate'); gateStep(1);
    toast('Transferred or changed roles? Answer the three questions again — your completed items stay completed.');
  }

  /* ---------- boot ---------- */
  buildGate();
  buildSearch();

  $('#beginBtn').addEventListener('click', function (e) {
    e.preventDefault();
    if (state.profile) { show('dashboard'); return; }
    show('gate'); gateStep(1);
  });
  $('#profileBtn').addEventListener('click', startReprofile);
  $('#navCta').addEventListener('click', function (e) {
    e.preventDefault();
    if (state.profile) show('dashboard'); else { show('gate'); gateStep(1); }
  });

  var nav = $('.nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
  function setLanguage(next) {
    VoyageLang.set(next);
    next = VoyageLang.get();
    state.lang = next; save();
    $('#navLang').value = next;
    rerenderActive();
  }
  if (state.lang) setLanguage(state.lang);
  else $('#navLang').value = 'en';
  $('#navLang').addEventListener('change', function () { setLanguage(this.value); });
  var burger = $('#navBurger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $('#navLinks').addEventListener('click', function (e) {
    if (e.target.closest('.nav__lang')) return; /* choosing a language keeps the menu open */
    nav.classList.remove('nav--open');
    burger.setAttribute('aria-expanded', 'false');
  });
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  function paintIdentity() {
    var full = state.name || (VOYAGE.user.first + ' ' + VOYAGE.user.last);
    var parts = full.trim().split(/\s+/);
    $('#idInitials').textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    $('#idName').textContent = full;
  }
  ensureStart();
  function adoptScorm() {
    var sc = window.VoyageSCORM;
    if (!sc || !sc.connected) return;
    ensureStart();                         /* merge suspend_data (start date, profile, statuses, opt-outs) */
    if (sc.name && !state.name) { state.name = sc.name; save(); }
    $('#idMeta').textContent = 'Signed in via Oracle Learning' + (sc.id ? ' · Learner ID ' + sc.id : '') + ' — pulled live from the LMS';
    $('#renameBtn').hidden = true;
    paintIdentity();
    var av = $('.view.active');
    if (av) {
      rerenderActive();
      introGate(av.getAttribute('data-view') === 'dashboard');
    }
  }
  adoptScorm();
  window.addEventListener('voyage-scorm-connected', adoptScorm);
  paintIdentity();
  $('#renameBtn').addEventListener('click', function () {
    var n = window.prompt('What should we call you?', state.name || '');
    if (n && n.trim()) { state.name = n.trim(); save(); paintIdentity(); rerenderActive(); }
  });

  if (state.profile) show('welcome'); else show('welcome');
  reveal();
})();
