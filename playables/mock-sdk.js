/* Local stand-in for https://www.youtube.com/game_api/v1, for testing only. Never shipped:
 * build.py --dev swaps it in for the real SDK tag under dist/playables-dev/.
 *   __yt.pause() / __yt.resume() / __yt.setAudio(bool)  drive the game like YouTube would
 *   __yt.log      every SDK call in order          __yt.frames  game frames rendered
 *   __yt.errors   uncaught errors                  __yt.saved   last saveData payload
 */
(function () {
  var log = [], pauseCbs = [], resumeCbs = [], audioCbs = [], audio = true;
  var KEY = 'ytmock:' + location.pathname;
  var loadResolved = false;
  var mock = window.__yt = { log: log, frames: 0, errors: [], saved: null,
    pause: function () { log.push('onPause'); pauseCbs.forEach(function (f) { f(); }); },
    resume: function () { log.push('onResume'); resumeCbs.forEach(function (f) { f(); }); },
    setAudio: function (on) { audio = !!on; log.push('audio:' + audio); audioCbs.forEach(function (f) { f(audio); }); },
    contexts: []
  };
  window.addEventListener('error', function (e) { mock.errors.push(String(e.message)); });
  window.addEventListener('unhandledrejection', function (e) { mock.errors.push('rejection: ' + e.reason); });

  // Count game frames underneath the bridge's own requestAnimationFrame wrapper.
  var raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    return raf(function (t) { mock.frames++; cb(t); });
  };
  var RealAC = window.AudioContext;
  if (RealAC) {
    window.AudioContext = function (o) { var c = o === undefined ? new RealAC() : new RealAC(o); mock.contexts.push(c); return c; };
    window.AudioContext.prototype = RealAC.prototype;
  }

  window.ytgame = {
    IN_PLAYABLES_ENV: true,
    SDK_VERSION: 'mock',
    game: {
      firstFrameReady: function () { log.push('firstFrameReady'); },
      gameReady: function () { log.push('gameReady'); },
      loadData: function () {
        log.push('loadData');
        return new Promise(function (r) { setTimeout(function () { loadResolved = true; r(sessionStorage.getItem(KEY) || ''); }, 30); });
      },
      saveData: function (s) {
        if (!loadResolved) mock.errors.push('saveData called before loadData resolved');
        if (typeof s !== 'string') mock.errors.push('saveData payload is not a string');
        log.push('saveData:' + s.length);
        mock.saved = s;
        sessionStorage.setItem(KEY, s);
        return Promise.resolve();
      }
    },
    system: {
      isAudioEnabled: function () { return audio; },
      onAudioEnabledChange: function (f) { audioCbs.push(f); return function () {}; },
      onPause: function (f) { pauseCbs.push(f); return function () {}; },
      onResume: function (f) { resumeCbs.push(f); return function () {}; },
      getLanguage: function () { return Promise.resolve('en'); }
    },
    engagement: { sendScore: function (s) { log.push('sendScore:' + s.value); return Promise.resolve(); } },
    health: { logError: function () { log.push('logError'); }, logWarning: function () { log.push('logWarning'); } }
  };
})();
