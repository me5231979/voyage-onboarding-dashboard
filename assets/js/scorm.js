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

  function findAPI(name) {
    var win = window, hops = 0;
    try {
      while (win && hops < 12) {
        if (win[name]) return win[name];
        if (win.parent && win.parent !== win) { win = win.parent; hops++; continue; }
        break;
      }
      if (window.opener && window.opener[name]) return window.opener[name];
    } catch (e) { /* cross-origin ancestor — no API reachable */ }
    return null;
  }

  var api12 = findAPI('API');
  var api2004 = findAPI('API_1484_11');
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

  try {
    if (api2004 && api2004.Initialize('') === 'true') {
      scorm.connected = true; scorm.version = '2004';
      scorm.name = toFirstLast(api2004.GetValue('cmi.learner_name'));
      scorm.id = api2004.GetValue('cmi.learner_id') || null;
    } else if (api12 && api12.LMSInitialize('') === 'true') {
      scorm.connected = true; scorm.version = '1.2';
      scorm.name = toFirstLast(api12.LMSGetValue('cmi.core.student_name'));
      scorm.id = api12.LMSGetValue('cmi.core.student_id') || null;
    }
  } catch (e) { scorm.connected = false; }

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
