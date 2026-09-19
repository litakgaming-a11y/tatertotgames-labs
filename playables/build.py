"""Build YouTube Playables bundles from the web prototypes.

    python playables/build.py            # every game
    python playables/build.py tippy-ship sandfall

For each games/<slug>/play.html this writes dist/playables/<slug>/ (index.html, bridge.js,
game.js) and dist/playables/<slug>.zip, plus a test copy in dist/playables-dev/<slug>/ that
uses playables/mock-sdk.js instead of the real SDK (drive it with playables/qa.mjs), then validates the bundle against the mechanical
certification rules (see playables/SUBMISSION.txt). Exit code 1 if any bundle fails.
"""
import io, json, os, re, shutil, subprocess, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES = os.path.join(ROOT, 'games')
OUT = os.path.join(ROOT, 'dist', 'playables')
BRIDGE = os.path.join(ROOT, 'playables', 'bridge.js')
SDK_TAG = '<script src="https://www.youtube.com/game_api/v1"></script>'

MUTE_CSS = '\n  /* YouTube owns mute: no in-game mute control next to the Playables buttons */\n' \
           '  [id*="mute" i]{display:none!important}\n'


def rewrite_game_js(js):
    """Route every browser platform API the game touches through the bridge (PB)."""
    js = re.sub(r"document\.addEventListener\(\s*(['\"])visibilitychange\1\s*,", 'PB.onVisibility(', js)
    js = re.sub(r"window\.localStorage\b", 'PB.storage', js)
    js = re.sub(r"(?<![.\w])localStorage\b", 'PB.storage', js)
    js = js.replace('document.hidden', 'PB.hidden').replace('document.visibilityState', 'PB.visibilityState')
    js = js.replace('navigator.vibrate', 'PB.vibrate')
    # Error fallbacks link back to the website; YouTube allows no clickable links.
    js = re.sub(r'<p><a\s[^>]*href="\.\./\.\./"[^>]*>.*?</a></p>', '', js)
    # Canvas-drawn mute icons sit where YouTube draws its own mute button: drop them.
    js = re.sub(r"(function drawMuteBtn\s*\([^)]*\)\s*\{)",
                r"\1 uiRects.mute = { x: -99, y: -99, w: 0, h: 0 }; return;", js)
    return js


def strip_hub_links(html):
    """Remove every link back to the website; keep an inert element where scripts look it up by id."""
    def repl(m):
        ident = re.search(r'\bid="([^"]+)"', m.group(1))
        return '<span id="%s" hidden></span>' % ident.group(1) if ident else ''
    return re.sub(r'<a\b([^>]*)>.*?</a>', repl, html, flags=re.S)


def build(slug):
    src = io.open(os.path.join(GAMES, slug, 'play.html'), encoding='utf-8').read()
    scripts = list(re.finditer(r'<script>(.*?)</script>', src, re.S))
    if len(scripts) != 1:
        raise SystemExit('%s: expected exactly one inline game script, found %d' % (slug, len(scripts)))
    game_js = rewrite_game_js(scripts[0].group(1).strip('\n') + '\n')

    html = src[:scripts[0].start()] + '<script src="bridge.js"></script>' + src[scripts[0].end():]
    html = re.sub(r'\s*<script src="/analytics\.js"[^>]*></script>', '', html)
    # An inline empty icon stops the browser requesting /favicon.ico from outside the bundle.
    html = re.sub(r'<link rel="icon"[^>]*>', '<link rel="icon" href="data:,">', html)
    html = strip_hub_links(html)
    # A lone close glyph in the HUD reads as YouTube's own close button (design 6.4). The ones
    # in these games only go back to the title screen, so say that instead.
    html = re.sub(r'(<button\b[^>]*>)\s*(✖|✕|×)\s*(</button>)', r'\1↩\3', html)
    html = html.replace('</style>', MUTE_CSS + '</style>', 1)
    # The SDK loads first, ahead of any other script.
    html = re.sub(r'(<head>)', r'\1\n' + SDK_TAG, html, count=1)

    d = os.path.join(OUT, slug)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    io.open(os.path.join(d, 'index.html'), 'w', encoding='utf-8', newline='\n').write(html)
    io.open(os.path.join(d, 'game.js'), 'w', encoding='utf-8', newline='\n').write(game_js)
    shutil.copy(BRIDGE, os.path.join(d, 'bridge.js'))

    # Test copy: identical except the mock SDK stands in for the real one.
    dev = os.path.join(ROOT, 'dist', 'playables-dev', slug)
    shutil.rmtree(dev, ignore_errors=True)
    shutil.copytree(d, dev)
    io.open(os.path.join(dev, 'index.html'), 'w', encoding='utf-8', newline='\n').write(
        html.replace(SDK_TAG, '<script src="mock-sdk.js"></script>'))
    shutil.copy(os.path.join(ROOT, 'playables', 'mock-sdk.js'), dev)

    z = os.path.join(OUT, slug + '.zip')
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name in sorted(os.listdir(d)):
            zf.write(os.path.join(d, name), name)
    return d, z


# ---------------- validation ----------------
BANNED = [
    (r'\blocalStorage\b|sessionStorage|indexedDB|document\.cookie', 'browser storage (saves must use saveData/loadData)'),
    (r'visibilitychange|document\.hidden|document\.visibilityState', 'Page Visibility API (use onPause/onResume)'),
    (r'navigator\.languages?\b', 'navigator.language (use getLanguage)'),
    (r'navigator\.vibrate', 'haptics without an on/off toggle'),
    (r'navigator\.share|clipboard', 'sharing / clipboard'),
    (r'\beval\s*\(|new Function\s*\(|new (Shared)?Worker\b|WebAssembly', 'eval / workers / wasm (may be declined)'),
    (r'\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource', 'network calls'),
    (r'window\.open\s*\(|location\.(href|assign|replace)\b', 'navigation away from the game'),
    (r'<a\s[^>]*href', 'clickable link'),
    (r'\b(alert|confirm|prompt)\s*\(', 'modal dialogs (blocked by the Playables sandbox)'),
    (r'orientation\.lock', 'orientation lock'),
    (r'(src|href)\s*=\s*["\']/|url\(\s*["\']?/', 'absolute path'),
]


def validate(d):
    problems = []
    files = sorted(os.listdir(d))
    if len(files) > 8000:
        problems.append('more than 8000 files')
    total = 0
    for name in files:
        p = os.path.join(d, name)
        size = os.path.getsize(p)
        total += size
        if not re.fullmatch(r'[A-Za-z0-9_.\-]+', name):
            problems.append('%s: file name has characters outside [A-Za-z0-9_.-]' % name)
        if size >= 30 * 1024 * 1024:
            problems.append('%s: file is 30 MiB or larger' % name)
        elif size >= 512 * 1024:
            problems.append('%s: file is over the recommended 512 KiB (SHOULD)' % name)
        if name == 'bridge.js':
            continue
        text = io.open(p, encoding='utf-8').read()
        for pat, why in BANNED:
            m = re.search(pat, text)
            if m:
                line = text.count('\n', 0, m.start()) + 1
                problems.append('%s:%d: %s (%r)' % (name, line, why, m.group(0)))
        for url in re.findall(r'https?://[^\s"\'<>)]+', text):
            if url.startswith('https://www.youtube.com/game_api/') or url.startswith('http://www.w3.org/'):
                continue
            problems.append('%s: external URL %s' % (name, url))
    if total >= 15 * 1024 * 1024:
        problems.append('bundle is %.1f MiB, over the recommended 15 MiB initial size' % (total / 2**20))

    html = io.open(os.path.join(d, 'index.html'), encoding='utf-8').read()
    first = re.search(r'<script\b[^>]*>', html)
    if not first or 'youtube.com/game_api/v1' not in first.group(0):
        problems.append('index.html: the Playables SDK is not the first script')
    if html.find('bridge.js') < html.find('game_api/v1'):
        problems.append('index.html: bridge loads before the SDK')

    node = shutil.which('node')
    if node:
        for name in ('game.js', 'bridge.js'):
            r = subprocess.run([node, '--check', os.path.join(d, name)], capture_output=True, text=True)
            if r.returncode:
                problems.append('%s: syntax error\n%s' % (name, r.stderr.strip()))
    return problems, total


def main():
    slugs = sys.argv[1:] or sorted(s for s in os.listdir(GAMES) if os.path.isfile(os.path.join(GAMES, s, 'play.html')))
    os.makedirs(OUT, exist_ok=True)
    failed = 0
    report = {}
    for slug in slugs:
        d, z = build(slug)
        problems, total = validate(d)
        hard = [p for p in problems if 'SHOULD' not in p and 'recommended' not in p]
        failed += bool(hard)
        report[slug] = {'bytes': total, 'zip_bytes': os.path.getsize(z), 'problems': problems}
        print('%-20s %7.1f KiB  %s' % (slug, total / 1024, 'PASS' if not hard else 'FAIL'))
        for p in problems:
            print('    - ' + p)
    io.open(os.path.join(OUT, 'report.json'), 'w', encoding='utf-8').write(json.dumps(report, indent=2))
    print('\n%d built, %d failing' % (len(slugs), failed))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
