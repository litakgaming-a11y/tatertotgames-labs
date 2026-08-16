/* TaterTot Games Labs analytics — anonymous, batched, fail-silent. No deps.
   Opt out: ?noanalytics=1, or browser Do-Not-Track. window.TTG.track(name,{level,value}) */
(function () { try {
  var API = '/api/collect', IDLE = 18e5, HB = 3e4, FLUSH = 1e4, CAP = 45;
  var m = location.pathname.match(/\/games\/([a-z0-9-]+)/i), G = m ? m[1].toLowerCase() : 'hub';
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes' || /[?&]noanalytics=1/.test(location.search)) {
    window.TTG = { track: function () {}, disabled: true }; return;
  }
  function S(s, k, v) { try { if (v === undefined) return s.getItem(k); s.setItem(k, v); return v; } catch (e) { return null; } }
  function R() {
    try { return crypto.randomUUID().replace(/-/g, '').slice(0, 24); } catch (e) {}
    return (Date.now().toString(36) + Math.random().toString(36).slice(2) + 'zzzzzz').slice(0, 24);
  }
  var LS = window.localStorage, SS = window.sessionStorage;
  var VID = S(LS, 'ttg_vid') || S(LS, 'ttg_vid', R()) || R();
  var t0 = Date.now(), last = +S(SS, 'ttg_seen') || 0, SID = S(SS, 'ttg_sid');
  var fresh = !SID || t0 - last > IDLE;
  if (fresh) { SID = R(); S(SS, 'ttg_sid', SID); }
  SID = SID || R(); S(SS, 'ttg_seen', '' + t0);

  var start = t0, q = [];
  function secs() { return Math.round((Date.now() - start) / 1000); }
  function flush(beacon) {
    if (!q.length) return;
    var n = Date.now(), batch = q; q = [];
    try {
      var body = JSON.stringify({ sid: SID, vid: VID, game: G, events: batch.map(function (e) {
        return { n: e.n, g: e.g, lvl: e.l, val: e.v, to: n - e.t };
      }) });
      if (beacon && navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: 'text/plain' }))) return;
      fetch(API, { method: 'POST', body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  function track(name, o) {
    try {
      if (typeof name !== 'string') return;
      o = o || {};
      var L = +o.level, V = +o.value;
      q.push({ n: name, g: typeof o.game === 'string' ? o.game : G,
               l: isFinite(L) ? Math.round(L) : null, v: isFinite(V) ? V : null, t: Date.now() });
      S(SS, 'ttg_seen', '' + Date.now());
      if (q.length >= CAP) flush(false);
    } catch (e) {}
  }
  window.TTG = { track: track, game: G, session: SID };

  track('page_view');
  if (fresh) track('session_start');
  if (G !== 'hub') track('game_launch');

  setInterval(function () { try { if (!document.hidden) track('heartbeat', { value: secs() }); flush(false); } catch (e) {} }, HB);
  setInterval(function () { try { flush(false); } catch (e) {} }, FLUSH);
  function end() { try { track('session_end', { value: secs() }); flush(true); } catch (e) {} }
  addEventListener('pagehide', end);
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') end(); });
} catch (e) {} })();
