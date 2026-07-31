/* =====================================================================
   VOYAGE — SCORM adapter (SCORM 1.2 and SCORM 2004)
   When this page is launched as a SCO inside an LMS (Oracle Learning
   plays SCORM 1.2 / 2004 packages), the LMS exposes a JS API object on
   an ancestor window. We discover it, initialize the session, and read
   the real learner name + id — no demo persona needed. We also report
   the SCO as completed once the learner finishes the personalization
   gate, so Oracle records a genuine completion for the Voyage module.

   Standalone (GitHub Pages, local file) there is no API to find, and
   window.VoyageSCORM.connected stays false — the app falls back to the
   labeled demo profile.
   ===================================================================== */

(function () {
  'use strict';

  /* ADL-standard API discovery: walk the parent chain of this window,
     then the parent chain of the opener (players like SCORM Cloud can
     launch content in a popup whose player frames hold the API). Each
     hop is guarded individually so one cross-origin ancestor doesn't
     abort the rest of the search. */
  function scanChain(start, name) {
    var win = start, hops = 0;
    while (win && hops < 12) {
      try { if (win[name]) return win[name]; } catch (e) { /* cross-origin hop */ }
      var parent = null;
      try { parent = (win.parent && win.parent !== win) ? win.parent : null; } catch (e2) { parent = null; }
      if (!parent) break;
      win = parent; hops++;
    }
    return null;
  }
  function findAPI(name) {
    var api = scanChain(window, name);
    if (api) return api;
    var opener = null;
    try { opener = window.opener; } catch (e) { opener = null; }
    if (opener) api = scanChain(opener, name);
    return api || null;
  }

  var api12 = null;
  var api2004 = null;
  var scorm = { connected: false, version: null, name: null, id: null };

  function toFirstLast(n) {
    if (!n) return null;
    n = String(n).trim();
    if (n.indexOf(',') > -1) {           // SCORM convention: "Last, First"
      var parts = n.split(',');
      return (parts[1] || '').trim() + ' ' + parts[0].trim();
    }
    return n;
  }

  /* Some players return boolean true instead of the spec string 'true'. */
  function ok(r) { return r === 'true' || r === true; }

  function envReport() {
    var lines = [];
    try { lines.push('location=' + window.location.href); } catch (e) { lines.push('location=?'); }
    var win = window, hops = 0;
    while (hops < 12) {
      var tag;
      try {
        tag = 'depth ' + hops + ': API=' + (typeof win.API) + ' API_1484_11=' + (typeof win.API_1484_11) +
          (win === window.top ? ' (top)' : '');
      } catch (e) { tag = 'depth ' + hops + ': cross-origin'; }
      lines.push(tag);
      var parent = null;
      try { parent = (win.parent && win.parent !== win) ? win.parent : null; } catch (e2) { parent = null; }
      if (!parent) break;
      win = parent; hops++;
    }
    try { lines.push('opener=' + (window.opener ? 'present' : 'none')); } catch (e) { lines.push('opener=?'); }
    return lines.join(' | ');
  }

  function tryConnect() {
    if (scorm.connected) return true;
    try {
      var a2004 = findAPI('API_1484_11');
      if (a2004) {
        var r2 = a2004.Initialize('');
        if (ok(r2) || String(a2004.GetLastError && a2004.GetLastError()) === '103') { // 103: already initialized
          api2004 = a2004;
          scorm.connected = true; scorm.version = '2004';
          scorm.name = toFirstLast(a2004.GetValue('cmi.learner_name'));
          scorm.id = a2004.GetValue('cmi.learner_id') || null;
          return true;
        }
        try { console.info('[Voyage] found 2004 API but Initialize returned', r2, 'err', a2004.GetLastError && a2004.GetLastError()); } catch (e) {}
      }
      var a12 = findAPI('API');
      if (a12) {
        var r1 = a12.LMSInitialize('');
        if (ok(r1) || String(a12.LMSGetLastError && a12.LMSGetLastError()) === '101') { // 101: already initialized (1.2)
          api12 = a12;
          scorm.connected = true; scorm.version = '1.2';
          scorm.name = toFirstLast(a12.LMSGetValue('cmi.core.student_name'));
          scorm.id = a12.LMSGetValue('cmi.core.student_id') || null;
          return true;
        }
        try { console.info('[Voyage] found 1.2 API but LMSInitialize returned', r1, 'err', a12.LMSGetLastError && a12.LMSGetLastError()); } catch (e) {}
      }
    } catch (e) { try { console.info('[Voyage] connect attempt threw:', e && e.message); } catch (e2) {} }
    return false;
  }

  /* The LMS is only required to expose the API before the SCO's load
     event — trying once at parse time is too early for some players.
     Retry for ~6 seconds, then settle into standalone mode. */
  var BUILD = (function () {
    try { return (document.currentScript.src.match(/v=([0-9a-f]+)/) || [])[1] || 'dev'; } catch (e) { return 'dev'; }
  })();
  var attempts = 0;
  function connectLoop() {
    attempts++;
    if (tryConnect()) {
      try { console.info('[Voyage build ' + BUILD + '] SCORM ' + scorm.version + ' API connected (attempt ' + attempts + ') — learner: ' + (scorm.name || 'unnamed') + ' id=' + scorm.id); } catch (e) {}
      window.dispatchEvent(new Event('voyage-scorm-connected'));
      return;
    }
    if (attempts === 1 || attempts === 24) {
      try { console.info('[Voyage build ' + BUILD + '] SCORM API not found (attempt ' + attempts + '). ' + envReport()); } catch (e) {}
    }
    if (attempts < 24) setTimeout(connectLoop, 250);
    else { try { console.info('[Voyage build ' + BUILD + '] no SCORM API after 6s — running standalone with demo profile'); } catch (e) {} }
  }
  connectLoop();

  /* suspend_data: Oracle stores this per learner, server-side — we keep
     the first-launch timestamp there so the day counter follows the
     learner across devices. */
  scorm.getData = function () {
    try {
      var raw = scorm.version === '2004' ? api2004.GetValue('cmi.suspend_data')
              : scorm.version === '1.2' ? api12.LMSGetValue('cmi.suspend_data') : '';
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  };
  scorm.setData = function (obj) {
    try {
      var raw = JSON.stringify(obj);
      if (scorm.version === '2004') { api2004.SetValue('cmi.suspend_data', raw); api2004.Commit(''); }
      else if (scorm.version === '1.2') { api12.LMSSetValue('cmi.suspend_data', raw); api12.LMSCommit(''); }
    } catch (e) { /* keep local copy only */ }
  };

  /* Opt-outs are reportable records: each one is written as a SCORM
     interaction (the same channel quiz answers use), carrying the item id
     and the written justification, so Oracle can report on them. */
  scorm.recordOptOut = function (itemId, reason) {
    try {
      if (scorm.version === '2004') {
        var n = parseInt(api2004.GetValue('cmi.interactions._count'), 10) || 0;
        api2004.SetValue('cmi.interactions.' + n + '.id', 'optout-' + itemId);
        api2004.SetValue('cmi.interactions.' + n + '.type', 'fill-in');
        api2004.SetValue('cmi.interactions.' + n + '.learner_response', String(reason).slice(0, 250));
        api2004.SetValue('cmi.interactions.' + n + '.result', 'neutral');
        api2004.Commit('');
      } else if (scorm.version === '1.2') {
        var m = parseInt(api12.LMSGetValue('cmi.interactions._count'), 10) || 0;
        api12.LMSSetValue('cmi.interactions.' + m + '.id', 'optout-' + itemId);
        api12.LMSSetValue('cmi.interactions.' + m + '.type', 'fill-in');
        api12.LMSSetValue('cmi.interactions.' + m + '.student_response', String(reason).slice(0, 250));
        api12.LMSSetValue('cmi.interactions.' + m + '.result', 'neutral');
        api12.LMSCommit('');
      }
    } catch (e) { /* justification still lives in suspend_data */ }
  };

  /* Manual completions of courses that live OUTSIDE Oracle (external cyber
     vendor, SharePoint reads, meetings) are recorded as attestations on the
     same reportable interactions channel as opt-outs. */
  scorm.recordAttestation = function (itemId, note) {
    try {
      if (scorm.version === '2004') {
        var n = parseInt(api2004.GetValue('cmi.interactions._count'), 10) || 0;
        api2004.SetValue('cmi.interactions.' + n + '.id', 'attest-' + itemId);
        api2004.SetValue('cmi.interactions.' + n + '.type', 'true-false');
        api2004.SetValue('cmi.interactions.' + n + '.learner_response', 'true');
        api2004.SetValue('cmi.interactions.' + n + '.result', 'correct');
        api2004.SetValue('cmi.interactions.' + n + '.description', String(note || '').slice(0, 250));
        api2004.Commit('');
      } else if (scorm.version === '1.2') {
        var m = parseInt(api12.LMSGetValue('cmi.interactions._count'), 10) || 0;
        api12.LMSSetValue('cmi.interactions.' + m + '.id', 'attest-' + itemId);
        api12.LMSSetValue('cmi.interactions.' + m + '.type', 'true-false');
        api12.LMSSetValue('cmi.interactions.' + m + '.student_response', 't');
        api12.LMSSetValue('cmi.interactions.' + m + '.result', 'correct');
        api12.LMSCommit('');
      }
    } catch (e) { /* completion still recorded in suspend_data */ }
  };

  scorm.complete = function () {
    try {
      if (scorm.version === '2004') {
        api2004.SetValue('cmi.completion_status', 'completed');
        api2004.SetValue('cmi.success_status', 'passed');
        api2004.Commit('');
      } else if (scorm.version === '1.2') {
        api12.LMSSetValue('cmi.core.lesson_status', 'completed');
        api12.LMSCommit('');
      }
    } catch (e) { /* completion write failed; LMS keeps last state */ }
  };

  window.addEventListener('beforeunload', function () {
    try {
      if (scorm.version === '2004') api2004.Terminate('');
      else if (scorm.version === '1.2') api12.LMSFinish('');
    } catch (e) { /* session already closed */ }
  });

  window.VoyageSCORM = scorm;
})();
