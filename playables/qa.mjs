// Drive every test bundle (dist/playables-dev) in headless Chrome against the mock SDK.
//   node playables/qa.mjs [slug ...]     (needs a static server on :8791 serving the repo root)
// Per game: load in phone portrait, tap into play, resize through 16:9, 32:9 and 9:32
// while playing (screenshots of each), then check pause/resume, mute and the SDK call order.
// Writes dist/qa/<slug>_<w>x<h>.png and dist/qa/report.json.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEV = join(ROOT, 'dist', 'playables-dev');
const OUT = join(ROOT, 'dist', 'qa');
const BASE = process.env.QA_BASE || 'http://localhost:8791/dist/playables-dev/';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = +(process.env.QA_PORT || 9333);
mkdirSync(OUT, { recursive: true });
const REPORT = join(OUT, process.env.QA_REPORT || 'report.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--hide-scrollbars',
  `--user-data-dir=${join(tmpdir(), 'ttg-qa-' + Date.now())}`, 'about:blank'], { stdio: 'ignore' });
process.on('exit', () => chrome.kill());

async function target() {
  for (let i = 0; i < 50; i++) {
    try { return await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json(); }
    catch { await sleep(200); }
  }
  throw new Error('chrome did not start');
}

function session(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map(); const events = [];
  ws.onmessage = m => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) events.push(msg);
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id; pending.set(i, m => m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  return new Promise(r => { ws.onopen = () => r({ send, events, close: () => ws.close() }); });
}

async function runGame(s, slug) {
  const eval_ = async expr => (await s.send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
  const size = (w, h) => s.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < h });
  const shot = async (w, h) => {
    const { data } = await s.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT, `${slug}_${w}x${h}.png`.replace(/[^\w.-]/g, '_')), Buffer.from(data, 'base64'));
  };
  const tap = async (x, y) => {
    for (const type of ['mousePressed', 'mouseReleased'])
      await s.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
  };
  const r = { slug, issues: [], should: [] };
  // Any visible, enabled control whose box is cut off by the viewport cannot be reliably used.
  const offscreen = async (w, h, where) => {
    const bad = await eval_(`[...document.querySelectorAll('button, [role=button].btn')].filter(b => {
      const cs = getComputedStyle(b); if (!b.offsetParent && cs.position !== 'fixed') return false;
      if (b.disabled) return false;
      // Hidden screens (faded out, invisible, or not clickable) do not count.
      for (let e = b; e && e !== document.documentElement; e = e.parentElement) {
        const s = getComputedStyle(e);
        if (s.visibility === 'hidden' || +s.opacity === 0 || s.pointerEvents === 'none' || s.display === 'none') return false;
      }
      const r = b.getBoundingClientRect(); if (!r.width || !r.height) return false;
      const out = x => x.bottom > innerHeight + 1 || x.top < -1 || x.right > innerWidth + 1 || x.left < -1;
      if (!out(r)) return false;
      // Reachable by scrolling an on-screen scroll container.
      for (let e = b.parentElement; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e);
        if (/(auto|scroll)/.test(s.overflowY + s.overflowX) && (e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth))
          return out(e.getBoundingClientRect());
      }
      return true;
    }).map(b => (b.id || b.textContent.trim().slice(0, 24)))`);
    if (bad.length) r.issues.push(`${w}x${h} ${where}: controls off screen: ${[...new Set(bad)].join(', ')}`);
    const lookalike = await eval_(`[...document.querySelectorAll('button.btn, [role=button]')].filter(b => {
      if (!/^\\s*(🔊|🔇|🔈|🔉|✖|✕|×|☰|⋮)\\s*$/u.test(b.textContent)) return false;
      for (let e = b; e && e !== document.documentElement; e = e.parentElement) {
        const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0 || e.inert) return false; }
      const r = b.getBoundingClientRect(); return r.width > 0;
    }).map(b => b.id + ' ' + b.textContent.trim())`);
    if (lookalike.length) r.issues.push(`${w}x${h} ${where}: controls look like YouTube's own buttons: ${lookalike.join(', ')}`);
  };
  // Nothing invisible may catch a tap: sample a grid and flag hits inside faded-out screens.
  const ghosts = async (w, h, where) => {
    const hits = await eval_(`(() => { const out = new Set();
      for (let gx = 1; gx < 12; gx++) for (let gy = 1; gy < 9; gy++) {
        const el = document.elementFromPoint(innerWidth * gx / 12, innerHeight * gy / 9);
        for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (+s.opacity === 0 || s.visibility === 'hidden') { out.add(el.id || el.className || el.tagName); break; }
        }
      } return [...out]; })()`);
    if (hits.length) r.issues.push(`${w}x${h} ${where}: invisible elements catch taps: ${hits.join(', ')}`);
  };
  // A scrollable menu must actually scroll under a finger (games cancel touchmove globally).
  const touchScroll = async (w, h, where) => {
    const boxes = await eval_(`[...document.querySelectorAll('body *')].filter(e => {
      const s = getComputedStyle(e);
      if (!/(auto|scroll)/.test(s.overflowY) || e.scrollHeight <= e.clientHeight + 1 || !e.offsetParent) return false;
      for (let a = e; a && a !== document.documentElement; a = a.parentElement) {
        const t = getComputedStyle(a); if (+t.opacity === 0 || t.visibility === 'hidden' || t.pointerEvents === 'none') return false;
      }
      return true;
    }).map((e, i) => { e.dataset.qaScroll = i; e.scrollTop = 0; const r = e.getBoundingClientRect();
      return { i, x: r.left + r.width / 2, y: r.top + Math.min(r.height, innerHeight - r.top) / 2, top: e.scrollTop }; })`);
    for (const b of boxes) {
      if (b.x < 0 || b.y < 0 || b.x > w || b.y > h) continue;
      const x = Math.round(b.x), y0 = Math.round(Math.min(b.y + 60, h - 5));
      await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
      for (let k = 1; k <= 10; k++) {
        await s.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - k * 12 }] });
        await sleep(16);
      }
      await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(350);
      const after = await eval_(`document.querySelector('[data-qa-scroll="${b.i}"]').scrollTop`);
      if (after <= b.top) r.issues.push(`${w}x${h} ${where}: scrollable menu does not scroll by touch`);
    }
  };
  s.events.length = 0;

  await size(390, 844);
  await s.send('Page.navigate', { url: BASE + slug + '/index.html' });
  await sleep(1800);
  r.log = await eval_('__yt.log.slice()');
  const ff = r.log.indexOf('firstFrameReady'), gr = r.log.indexOf('gameReady'), ld = r.log.indexOf('loadData');
  if (ff < 0) r.issues.push('firstFrameReady never called');
  if (gr < 0) r.issues.push('gameReady never called');
  if (gr >= 0 && ff > gr) r.issues.push('gameReady before firstFrameReady');
  if (ld < 0) r.issues.push('loadData never called');

  // Tap into play: centre, then a little lower (most title screens put Play there).
  await tap(195, 422); await sleep(700);
  await tap(195, 520); await sleep(700);
  await tap(195, 422); await sleep(1500);
  await shot(390, 844);

  for (const [w, h] of [[1280, 720], [1920, 540], [405, 1440], [900, 900]]) {
    await size(w, h); await sleep(900);
    await tap(w / 2, h / 2); await sleep(900);
    await shot(w, h);
    await offscreen(w, h, 'play');
    await ghosts(w, h, 'play');
  }

  // Every menu must open with a real tap, keep its controls on screen at the shortest and
  // narrowest sizes, and close again with a real tap on its own Back button.
  await s.send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__qaKey = b => b.id ? '#' + b.id : 'label:' + b.textContent.trim();
    window.__qaGet = key => key.startsWith('#') ? document.getElementById(key.slice(1))
      : [...document.querySelectorAll('button.btn, [role=button]')].find(b => !b.id && 'label:' + b.textContent.trim() === key) || null;
    window.__qaShown = id => { const b = __qaGet(id); if (!b) return false;
      for (let a = b; a && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a);
        if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0 || a.inert) return false; }
      const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    window.__qaHit = id => { const b = __qaGet(id); if (!b) return null; const r = b.getBoundingClientRect();
      if (!r.width) return null; const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return null;
      const h = document.elementFromPoint(x, y); return h && (h === b || b.contains(h)) ? [x, y] : null; };
    window.__qaBack = () => { const bs = [...document.querySelectorAll('button.btn, [role=button]')].reverse();
      for (const b of bs) { if (!/back|close|done|✕|×/i.test((b.id || '') + ' ' + b.textContent)) continue;
        b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); if (!r.width) continue;
        const x = r.left + r.width / 2, y = r.top + r.height / 2; const h = document.elementFromPoint(x, y);
        if (h && (h === b || b.contains(h))) return [x, y, b.id || b.textContent.trim().slice(0, 16)]; }
      return null; };` });
  await s.send('Page.navigate', { url: BASE + slug + '/index.html' }); await sleep(1500);
  const menus = await eval_(`([...document.querySelectorAll('button.btn, [role=button]')]
    .filter(b => /shop|upg|\\bup(btn)?\\b|upgrade|office|garage|base|bastion|vault|album|menag|\\bmen(btn)?\\b|cdx|codex|almanac|team|crew|meta|forge|park|shed|station|armou?ry|conquest|dock|sky|lab|shipwright|salon|found|how|help|info/i.test(b.id + ' ' + b.textContent))
    .filter(b => !/play|start|tap to|again|retry|next|expedition|\\bgo\\b/i.test(b.id + ' ' + b.textContent))
    .map(b => __qaKey(b)))`);
  r.menus = menus;
  for (const [w, h] of [[844, 390], [1920, 540], [360, 800]]) {
    await size(w, h); await sleep(500);
    await offscreen(w, h, 'title');
    await ghosts(w, h, 'title');
    for (const id of menus) {
      // Only menus a player can see from here; win/lose-screen buttons are tested when shown.
      const shown = await eval_(`__qaShown(${JSON.stringify(id)})`);
      if (!shown) continue;
      const at = await eval_(`__qaHit(${JSON.stringify(id)})`);
      if (!at) { r.issues.push(`${w}x${h} title: ${id} is visible but a tap does not reach it`); continue; }
      await tap(at[0], at[1]); await sleep(550);
      if (await eval_(`__qaHit(${JSON.stringify(id)})`)) { r.issues.push(`${w}x${h} tapping ${id} did not open anything`); continue; }
      await offscreen(w, h, id);
      await ghosts(w, h, id);
      await touchScroll(w, h, id);
      if (w === 844) await shot(w, h + '_' + id);
      // Leave by tapping the menu's own Back / Close / Done.
      const back = await eval_(`__qaBack()`);
      if (!back) { r.issues.push(`${w}x${h} ${id}: no Back/Close/Done a tap can reach`); await s.send('Page.reload'); await sleep(1300); continue; }
      await tap(back[0], back[1]); await sleep(550);
      if (!(await eval_(`__qaHit(${JSON.stringify(id)})`))) { r.issues.push(`${w}x${h} ${id}: tapping ${back[2]} did not return`); await s.send('Page.reload'); await sleep(1300); continue; }
      // Esc should close it too (SHOULD, design 2.6).
      await tap(at[0], at[1]); await sleep(550);
      for (const type of ['keyDown', 'keyUp'])
        await s.send('Input.dispatchKeyEvent', { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await sleep(550);
      if (!(await eval_(`__qaHit(${JSON.stringify(id)})`))) { r.should.push(`${w}x${h} ${id}: Esc did not close it`); await s.send('Page.reload'); await sleep(1300); }
    }
  }
  await size(390, 844); await sleep(600);

  // Pause: rendering, timers and audio must stop; resume must bring them back.
  const f0 = await eval_('__yt.frames');
  await sleep(400);
  const running = (await eval_('__yt.frames')) - f0;
  await eval_('__yt.pause()'); await sleep(250);
  const p0 = await eval_('__yt.frames'); await sleep(700);
  const pausedFrames = (await eval_('__yt.frames')) - p0;
  const ctxPaused = await eval_('__yt.contexts.map(c => c.state)');
  await eval_('__yt.resume()'); await sleep(600);
  const p1 = await eval_('__yt.frames'); await sleep(400);
  const resumedFrames = (await eval_('__yt.frames')) - p1;
  r.frames = { running, pausedFrames, resumedFrames };
  if (running > 3 && pausedFrames > 1) r.issues.push(`rendered ${pausedFrames} frames while paused`);
  if (running > 3 && resumedFrames < 2) r.issues.push('did not resume rendering');
  if (ctxPaused.some(st => st === 'running')) r.issues.push('audio kept running while paused');

  // YouTube mute.
  await eval_('__yt.setAudio(false)'); await sleep(300);
  const ctxMuted = await eval_('__yt.contexts.map(c => c.state)');
  if (ctxMuted.some(st => st === 'running')) r.issues.push('audio kept running while YouTube is muted');
  await tap(195, 422); await sleep(300);   // a tap must not un-mute
  const ctxAfterTap = await eval_('__yt.contexts.map(c => c.state)');
  if (ctxAfterTap.some(st => st === 'running')) r.issues.push('a tap re-enabled audio while YouTube is muted');
  await eval_('__yt.setAudio(true)'); await sleep(300);
  r.audio = { contexts: ctxMuted.length, paused: ctxPaused, muted: ctxMuted };

  r.saves = (await eval_('__yt.log.filter(x => x.startsWith("saveData")).length'));
  r.errors = await eval_('__yt.errors.slice()');
  for (const e of s.events) {
    if (e.method === 'Runtime.exceptionThrown') r.errors.push(e.params.exceptionDetails.exception?.description?.split('\n')[0] || e.params.exceptionDetails.text);
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error' && !/favicon/.test(e.params.entry.url || '')) r.errors.push('console: ' + e.params.entry.text);
    if (e.method === 'Network.requestWillBeSent') {
      const u = e.params.request.url;
      if (!u.startsWith(BASE + slug + '/') && !u.startsWith('data:') && !u.startsWith('blob:')) r.issues.push('network request outside the bundle: ' + u);
    }
  }
  if (r.errors.length) r.issues.push(...[...new Set(r.errors)].map(e => 'error: ' + e));
  return r;
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(DEV).filter(d => existsSync(join(DEV, d, 'index.html')));
const t = await target();
const s = await session(t.webSocketDebuggerUrl);
await s.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await s.send('Page.enable'); await s.send('Runtime.enable'); await s.send('Log.enable'); await s.send('Network.enable');
const report = {};
for (const slug of slugs) {
  try { report[slug] = await runGame(s, slug); }
  catch (e) { report[slug] = { slug, issues: ['qa crashed: ' + e.message] }; }
  const r = report[slug];
  console.log(`${slug.padEnd(20)} ${r.issues.length ? 'ISSUES' : 'ok'}  frames=${JSON.stringify(r.frames)} saves=${r.saves}`);
  for (const i of r.issues) console.log('    - ' + i);
  for (const i of r.should || []) console.log('    ~ (SHOULD) ' + i);
}
writeFileSync(REPORT, JSON.stringify(report, null, 2));
s.close(); chrome.kill();
process.exit(0);
