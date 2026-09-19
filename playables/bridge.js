/* TaterTot Games Labs -> YouTube Playables bridge.
 *
 * Loaded after the Playables SDK and before the game. The build step rewrites each
 * game so every platform touch point goes through PB instead of a browser API:
 *   localStorage                     -> PB.storage   (cloud save via ytgame.game.saveData/loadData)
 *   document.addEventListener('visibilitychange', f) -> PB.onVisibility(f)  (ytgame.system.onPause/onResume)
 *   document.hidden / visibilityState -> PB.hidden / PB.visibilityState
 *   navigator.vibrate                -> PB.vibrate (null: no haptics, so no haptics toggle is needed)
 * Audio follows ytgame.system.isAudioEnabled/onAudioEnabledChange and pauses with the game.
 * The game script (game.js) is only started after loadData resolves, so it reads its real save.
 */
(function () {
  'use strict';
  var yt = window.ytgame || null;
  var IN_YT = !!(yt && yt.IN_PLAYABLES_ENV);
  var SAVE_DEBOUNCE_MS = 750;
  var SAVE_LIMIT = 3 * 1024 * 1024;   // hard limit from the SDK
  var FLUSH_LIMIT = 64 * 1024;        // best-effort final flush limit

  function warn() { try { if (yt && yt.health) yt.health.logWarning(); } catch (e) {} }
  function fail() { try { if (yt && yt.health) yt.health.logError(); } catch (e) {} }

  /* ---------------- cloud save ---------------- */
  var data = Object.create(null);
  var loaded = false;          // saveData must never run before loadData has resolved
  var lastSaved = null;
  var saveTimer = 0;

  function serialize() { return JSON.stringify(data); }

  function saveNow() {
    if (!loaded) return Promise.resolve();
    clearTimeout(saveTimer); saveTimer = 0;
    var s = serialize();
    if (s === lastSaved) return Promise.resolve();
    if (s.length * 2 > SAVE_LIMIT) { warn(); return Promise.resolve(); }
    lastSaved = s;
    if (!IN_YT) return Promise.resolve();
    return yt.game.saveData(s).catch(function () { lastSaved = null; warn(); });
  }
  function scheduleSave() {
    if (!loaded) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, SAVE_DEBOUNCE_MS);
  }

  var storage = {
    getItem: function (k) { k = String(k); return k in data ? data[k] : null; },
    setItem: function (k, v) { data[String(k)] = String(v); scheduleSave(); },
    removeItem: function (k) { delete data[String(k)]; scheduleSave(); },
    clear: function () { data = Object.create(null); scheduleSave(); },
    key: function (i) { return Object.keys(data)[i] || null; }
  };
  Object.defineProperty(storage, 'length', { get: function () { return Object.keys(data).length; } });

  /* ---------------- pause / resume ---------------- */
  var paused = false;
  var visHandlers = [];
  var rafQueue = [];
  var realRAF = window.requestAnimationFrame.bind(window);
  var realSetTimeout = window.setTimeout.bind(window);

  // Rendering stops while paused: frames requested during a pause are held until resume.
  window.requestAnimationFrame = function (cb) {
    if (paused) { rafQueue.push(cb); return -1; }
    return realRAF(cb);
  };
  // Timers that come due during a pause wait for resume instead of advancing the game.
  window.setTimeout = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (typeof fn !== 'function') return realSetTimeout(fn, ms);
    return realSetTimeout(function run() {
      if (paused) { holdQueue.push(run); return; }
      fn.apply(window, args);
    }, ms);
  };
  var holdQueue = [];
  var realSetInterval = window.setInterval.bind(window);
  window.setInterval = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (typeof fn !== 'function') return realSetInterval(fn, ms);
    return realSetInterval(function () { if (!paused) fn.apply(window, args); }, ms);
  };

  // Input is ignored while paused.
  ['pointerdown', 'pointermove', 'pointerup', 'touchstart', 'touchmove', 'touchend',
   'mousedown', 'mousemove', 'mouseup', 'click', 'keydown', 'keyup', 'wheel'].forEach(function (t) {
    window.addEventListener(t, function (e) {
      if (paused && !(e.type === 'keydown' && e.key === 'Escape')) { e.stopImmediatePropagation(); }
    }, { capture: true, passive: true });
  });

  function fireVisibility() {
    for (var i = 0; i < visHandlers.length; i++) {
      try { visHandlers[i].call(document, { type: 'visibilitychange' }); } catch (e) { fail(); }
    }
  }

  function pause() {
    if (paused) return;
    PB.hidden = true; PB.visibilityState = 'hidden';
    fireVisibility();            // let the game run its own pause logic first
    paused = true;
    applyAudio();
    saveNow();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    PB.hidden = false; PB.visibilityState = 'visible';
    applyAudio();
    var q = rafQueue; rafQueue = [];
    for (var i = 0; i < q.length; i++) realRAF(q[i]);
    var h = holdQueue; holdQueue = [];
    for (var j = 0; j < h.length; j++) realSetTimeout(h[j], 0);
    fireVisibility();
  }

  /* ---------------- audio ---------------- */
  var contexts = [];
  var audioEnabled = true;
  function audioAllowed() { return audioEnabled && !paused; }
  function applyAudio() {
    for (var i = 0; i < contexts.length; i++) {
      var c = contexts[i];
      try {
        if (audioAllowed()) { if (c.state === 'suspended') c.__pbResume(); }
        else if (c.state === 'running') c.suspend();
      } catch (e) {}
    }
  }
  ['AudioContext', 'webkitAudioContext'].forEach(function (name) {
    var Real = window[name];
    if (!Real) return;
    function Wrapped(opts) {
      var ctx = opts === undefined ? new Real() : new Real(opts);
      ctx.__pbResume = ctx.resume.bind(ctx);
      // The game may try to resume audio on a tap; YouTube's mute always wins.
      ctx.resume = function () { return audioAllowed() ? ctx.__pbResume() : Promise.resolve(); };
      contexts.push(ctx);
      if (!audioAllowed()) { try { ctx.suspend(); } catch (e) {} }
      return ctx;
    }
    Wrapped.prototype = Real.prototype;
    window[name] = Wrapped;
  });

  /* ---------------- touch scrolling inside menus ----------------
   * The games cancel touchmove on the whole document so a drag never scrolls the page. That
   * also freezes the scrollable shop lists, which only overflow on short (landscape) screens,
   * leaving their Back buttons out of reach on a phone. Drags that start inside a scrollable
   * element are exempted; every other touchmove still reaches the game unchanged.
   */
  function inScroller(el) {
    for (var e = el; e && e.nodeType === 1 && e !== document.body; e = e.parentElement) {
      var s = getComputedStyle(e);
      if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 1) return true;
      if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 1) return true;
    }
    return false;
  }
  var realAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if ((type === 'touchmove' || type === 'wheel') && typeof fn === 'function' &&
        (this === document || this === window || this === document.body || this === document.documentElement)) {
      var inner = fn;
      fn = function (e) { if (inScroller(e.target)) return; return inner.call(this, e); };
    }
    return realAdd.call(this, type, fn, opts);
  };

  /* ---------------- Esc closes the open menu ----------------
   * Presses the visible Back / Close / Done control of whatever menu is showing. The event is
   * never cancelled: YouTube needs Esc too (design requirement 2.7).
   */
  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || paused) return;
    var btns = document.querySelectorAll('button.btn, [role=button]');
    for (var i = btns.length - 1; i >= 0; i--) {
      var b = btns[i];
      var label = (b.id || '') + ' ' + (b.textContent || '');
      if (!/back|close|done|✕|×/i.test(label) || b.disabled) continue;
      var r = b.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      var hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit && (hit === b || b.contains(hit))) { b.click(); return; }
    }
  });

  /* ---------------- hidden screens stay untouchable ----------------
   * Several games hide a screen by fading it (opacity:0; pointer-events:none) while a global
   * rule such as .btn{pointer-events:auto} switches its buttons back on. The result is an
   * invisible Game Over or Win button lying over whatever screen is showing, stealing taps.
   * Any element a "hidden screen" rule in the game's own stylesheets can apply to is made
   * `inert` exactly while it is switched off (computed pointer-events: none), so its whole
   * subtree drops out of hit testing and comes back the moment the screen is shown again.
   * (A stylesheet-only fix is wrong: in some games the base .screen rule *is* the hidden state
   * and a .show class turns it on.)
   */
  var fadeScreens = [];
  function findFadeScreens() {
    var sels = [];
    for (var i = 0; i < document.styleSheets.length; i++) {
      var rules;
      try { rules = document.styleSheets[i].cssRules; } catch (e) { continue; }
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.style && r.style.opacity === '0' && r.style.pointerEvents === 'none' && r.selectorText) {
          r.selectorText.split(',').forEach(function (s) { sels.push(s.trim()); });
        }
      }
    }
    fadeScreens = [];
    sels.forEach(function (s) {
      // The rule names a screen *in its hidden state* (".screen.hidden", "#lose.off"), so it
      // matches nothing that is showing right now. Track every element carrying the rule's id
      // or any one of its classes; syncInert only acts while pointer-events really is none.
      var last = s.split(/[\s>+~]+/).pop() || '';
      var parts = last.match(/[#.][A-Za-z0-9_-]+/g) || [];
      parts.forEach(function (p) {
        var found = [];
        try { found = document.querySelectorAll(p); } catch (e) {}
        for (var k = 0; k < found.length; k++) if (fadeScreens.indexOf(found[k]) < 0) fadeScreens.push(found[k]);
      });
    });
  }
  function syncInert() {
    for (var i = 0; i < fadeScreens.length; i++) {
      var off = getComputedStyle(fadeScreens[i]).pointerEvents === 'none';
      if (fadeScreens[i].inert !== off) fadeScreens[i].inert = off;
    }
  }

  /* ---------------- fit menus to short and narrow viewports ----------------
   * The games were laid out for phones held upright. YouTube runs them anywhere from 9:32 to
   * 32:9, and a phone on its side leaves ~390px of height, so a shop or title screen can spill
   * past the bottom edge with its Back button unreachable. Full-screen overlays whose content
   * overflows are scaled down with CSS zoom (real layout, so text stays sharp and taps land),
   * never below MIN_ZOOM; past that they scroll from the top instead of clipping.
   */
  var MIN_ZOOM = 0.6;
  var overlays = [];
  function findOverlays() {
    overlays = [];
    var els = document.body.getElementsByTagName('*');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.tagName === 'SCRIPT' || e.tagName === 'CANVAS') continue;
      var cs = getComputedStyle(e);
      if (cs.position === 'fixed' && cs.top === '0px' && cs.bottom === '0px' && e.children.length) overlays.push(e);
    }
  }
  function fitOverlays() {
    for (var i = 0; i < overlays.length; i++) {
      var o = overlays[i];
      if (!o.offsetWidth || !o.offsetHeight) continue;
      var kids = o.children;
      var z = 1;
      for (var k = 0; k < kids.length; k++) kids[k].style.zoom = '';
      o.style.overflowY = ''; o.style.justifyContent = ''; o.style.touchAction = '';
      // Measure the children's real extent: a centred flex column overflows off the top as
      // well as the bottom, and scrollHeight only counts the bottom half.
      var cs = getComputedStyle(o), top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
      for (var m = 0; m < kids.length; m++) {
        var r = kids[m].getBoundingClientRect();
        if (!r.width && !r.height) continue;
        var km = getComputedStyle(kids[m]);
        top = Math.min(top, r.top - parseFloat(km.marginTop));
        bottom = Math.max(bottom, r.bottom + parseFloat(km.marginBottom));
        left = Math.min(left, r.left); right = Math.max(right, r.right);
      }
      if (top === Infinity) continue;
      var have = o.clientHeight, haveW = o.clientWidth;
      var need = bottom - top + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      var needW = right - left;
      if (need > have + 2) z = Math.min(z, have / need);
      if (needW > haveW + 2) z = Math.min(z, haveW / needW);
      if (z >= 0.999) continue;
      z *= 0.98;
      var tooTall = z < MIN_ZOOM;
      z = Math.max(MIN_ZOOM, z);
      for (var j = 0; j < kids.length; j++) kids[j].style.zoom = String(z);
      if (tooTall) {
        o.style.overflowY = 'auto';
        o.style.justifyContent = 'flex-start';
        o.style.touchAction = 'pan-y';
      }
    }
  }
  var fitQueued = false, watcher = null;
  function queueFit() {
    if (fitQueued) return;
    fitQueued = true;
    realRAF(function () {
      fitQueued = false;
      syncInert();
      fitOverlays();
      if (watcher) watcher.takeRecords();   // our own zoom/overflow/inert writes are not screen changes
    });
  }
  // Screens open and close by class, style or hidden changes on the overlay itself or on
  // <body> (e.g. body[data-ui]); watching only those keeps per-frame HUD updates out of it.
  function watchOverlays() {
    watcher = new MutationObserver(queueFit);
    // childList: some games redraw a screen by replacing its innerHTML (Snapcatch's Album).
    var opts = { attributes: true, attributeFilter: ['class', 'style', 'hidden'], childList: true };
    watcher.observe(document.body, { attributes: true, childList: true });
    for (var i = 0; i < overlays.length; i++) watcher.observe(overlays[i], opts);
    for (var j = 0; j < fadeScreens.length; j++) watcher.observe(fadeScreens[j], opts);
    syncInert();
    fitOverlays();
    watcher.takeRecords();
  }

  /* ---------------- public surface for the rewritten game ---------------- */
  var PB = window.PB = {
    storage: storage,
    hidden: false,
    visibilityState: 'visible',
    vibrate: null,
    onVisibility: function (fn) { if (typeof fn === 'function') visHandlers.push(fn); },
    save: saveNow
  };

  /* ---------------- boot ---------------- */
  function start() {
    try {
      if (yt) {
        audioEnabled = yt.system.isAudioEnabled();
        yt.system.onAudioEnabledChange(function (on) { audioEnabled = !!on; applyAudio(); });
        yt.system.onPause(pause);
        yt.system.onResume(resume);
      }
    } catch (e) { fail(); }

    var s = document.createElement('script');
    s.src = 'game.js';
    s.onload = function () {
      // The game draws its title screen on the next frames; that screen is interactive.
      realRAF(function () { realRAF(function () {
        findFadeScreens();
        findOverlays();
        watchOverlays();
        window.addEventListener('resize', queueFit);
        try { if (yt) yt.game.gameReady(); } catch (e) { fail(); }
      }); });
    };
    s.onerror = fail;
    document.body.appendChild(s);
  }

  try { if (yt) yt.game.firstFrameReady(); } catch (e) { fail(); }

  var load = yt ? yt.game.loadData() : Promise.resolve('');
  Promise.resolve(load).then(function (raw) {
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') for (var k in parsed) data[k] = String(parsed[k]);
      } catch (e) { warn(); }
    }
    lastSaved = raw || null;
  }, warn).then(function () {
    loaded = true;
    start();
  });

  // Keep the last-flush payload inside the best-effort size limit.
  PB.flushFits = function () { return serialize().length * 2 <= FLUSH_LIMIT; };
})();
