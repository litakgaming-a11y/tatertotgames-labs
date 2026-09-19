"""Generate 16:9 key art for each game with Codex's built-in image tool, using the real gameplay
screenshot as the reference so the art matches what players get.
    python playables/art.py [slug ...]
Writes dist/art/<slug>-16x9.png, then re-saves it pixel-only (no embedded metadata)."""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODEX = os.path.expandvars(r'%LOCALAPPDATA%\OpenAI\Codex\bin\cdef5aaf3e41ab53\codex.exe')
META = json.load(open(os.path.join(ROOT, 'playables', 'metadata.json'), encoding='utf-8'))['games']
OUT = os.path.join(ROOT, 'dist', 'art')
os.makedirs(OUT, exist_ok=True)


def make(slug):
    dest = os.path.join(OUT, slug + '-16x9.png')
    if os.path.exists(dest):
        return slug, 'exists'
    m = META[slug]
    prompt = (
        "Use your built-in image generation tool (image_gen) to create ONE 16:9 key art image for the mobile game "
        f"'{m['title']}'. Use the attached gameplay screenshot as the reference for its look, characters, objects and colours, "
        f"and show the game's real mechanic: {m['short_description']} "
        "Keep the same art style as the screenshot, cleaner and more polished, one clear focal moment of play. "
        "No text, no letters, no numbers, no logos, no UI, no watermark. "
        f"Then copy the final PNG to dist/art/{slug}-16x9.png and reply with just the saved path.")
    log = open(os.path.join(OUT, slug + '.log'), 'w', encoding='utf-8')
    subprocess.run([CODEX, 'exec', '--skip-git-repo-check', '-s', 'workspace-write',
                    '-i', os.path.join('assets', 'shots', slug + '.png'), '-'],
                   input=prompt, text=True, encoding='utf-8', cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, timeout=900)
    if not os.path.exists(dest):
        return slug, 'FAILED (see dist/art/%s.log)' % slug
    im = Image.open(dest).convert('RGB')          # drop any embedded metadata/provenance chunks
    clean = Image.new('RGB', im.size); clean.paste(im)
    clean.save(dest, 'PNG', optimize=True)
    return slug, '%dx%d' % im.size


slugs = sys.argv[1:] or sorted(META)
with ThreadPoolExecutor(max_workers=3) as ex:
    for slug, status in ex.map(make, slugs):
        print(slug.ljust(20), status, flush=True)
