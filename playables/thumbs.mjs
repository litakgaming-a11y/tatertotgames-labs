// Draft listing thumbnails: tap each game into play and capture it at the three ratios the
// Developer Portal asks for (16:9, 1:1, 5:7) at 2x density, straight from the real bundle.
//   node playables/thumbs.mjs [slug ...]   (static server on :8791 serving the repo root)
// Writes dist/submission/<slug>/thumb-16x9.png, thumb-1x1.png, thumb-5x7.png.
// These are drafts for a person to choose from: check each has no logo, wordmark or menu.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEV = join(ROOT, 'dist', 'playables-dev');
const BASE = process.env.QA_BASE || 'http://localhost:8791/dist/playables-dev/';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9355;
const RATIOS = [['16x9', 960, 540], ['1x1', 600, 600], ['5x7', 600, 840]];
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--mute-audio',
  '--hide-scrollbars', `--user-data-dir=${join(tmpdir(), 'ttg-thumbs-' + Date.now())}`, 'about:blank'], { stdio: 'ignore' });
process.on('exit', () => chrome.kill());

let t;
for (let i = 0; i < 50 && !t; i++) {
  try { t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json(); }
  catch { await sleep(200); }
}
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.onmessage = m => { const x = JSON.parse(m.data); if (pending.has(x.id)) { pending.get(x.id)(x); pending.delete(x.id); } };
await new Promise(r => { ws.onopen = r; });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const tap = async (x, y) => {
  for (const type of ['mousePressed', 'mouseReleased'])
    await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
};

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(DEV).filter(d => existsSync(join(DEV, d, 'index.html')));
for (const slug of slugs) {
  const out = join(ROOT, 'dist', 'submission', slug);
  mkdirSync(out, { recursive: true });
  for (const [name, w, h] of RATIOS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
    await send('Page.navigate', { url: BASE + slug + '/index.html' });
    await sleep(1600);
    // Into play, then let a few seconds of action build up on screen.
    await tap(w / 2, h / 2); await sleep(600);
    await tap(w / 2, h * 0.62); await sleep(600);
    await tap(w / 2, h / 2); await sleep(2600);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(out, `thumb-${name}.png`), Buffer.from(shot.result.data, 'base64'));
  }
  console.log(slug);
}
ws.close();
process.exit(0);
