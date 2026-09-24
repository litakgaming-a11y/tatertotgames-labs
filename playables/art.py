"""Generate game art with Codex's built-in image tool, anchored to each game's real look.
    python playables/art.py key    [slug ...]  16:9 key art from the gameplay screenshot (no text)
    python playables/art.py titled [slug ...]  the 16:9 key art with a bold, colourful game-title logo
    python playables/art.py square [slug ...]  1:1 listing thumbnail from the key art (no text)
    python playables/art.py tall   [slug ...]  5:7 listing thumbnail from the key art (no text)
Writes dist/art/<slug>-<kind>.png and re-saves it pixel-only (no embedded metadata).
YouTube Playables thumbnails must carry no logos or branding: use key/square/tall there,
and the titled set only on the website."""
import glob, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Codex updates itself into a new hashed folder, so take the newest codex.exe, not a fixed path.
CODEX = max(glob.glob(os.path.expandvars(r'%LOCALAPPDATA%\OpenAI\Codex\bin\*\codex.exe')), key=os.path.getmtime)
META = json.load(open(os.path.join(ROOT, 'playables', 'metadata.json'), encoding='utf-8'))['games']
OUT = os.path.join(ROOT, 'dist', 'art')
NO_TEXT = "No text, no letters, no numbers, no logos, no UI, no watermark."
KINDS = {
    'key': ('16x9', 'screenshot', lambda m: (
        f"create ONE 16:9 key art image for the mobile game '{m['title']}'. Use the attached gameplay screenshot as the "
        "reference for its look, characters, objects and colours, and show the game's real mechanic: "
        f"{m['short_description']} Keep the same art style as the screenshot, cleaner and more polished, one clear "
        f"focal moment of play. {NO_TEXT}")),
    'titled': ('16x9-title', 'key', lambda m: (
        "edit the attached 16:9 key art: keep the scene exactly as it is and add the game's title as a big, bold, "
        f"playful game logo that reads exactly \"{m['title']}\" (spell it exactly like that, same letters, nothing else). "
        "Chunky rounded display lettering with bright colours taken from the scene, a thick dark outline and a soft "
        "drop shadow, like a mobile game title screen. Place it where it covers no important action. No other text, "
        "no watermark, no studio name.")),
    'square': ('1x1', 'key', lambda m: (
        f"create ONE 1:1 square thumbnail for the mobile game '{m['title']}' based on the attached key art: same scene, "
        f"characters and style, recomposed so the main action fills a square frame. {NO_TEXT}")),
    'tall': ('5x7', 'key', lambda m: (
        f"create ONE portrait 5:7 thumbnail for the mobile game '{m['title']}' based on the attached key art: same scene, "
        f"characters and style, recomposed so the main action fills a tall 5:7 frame. {NO_TEXT}")),
}


def make(kind, slug):
    suffix, source, brief = KINDS[kind]
    dest_rel = f'dist/art/{slug}-{suffix}.png'
    dest = os.path.join(ROOT, dest_rel)
    if os.path.exists(dest):
        return slug, 'exists'
    ref = (os.path.join('assets', 'shots', slug + '.png') if source == 'screenshot'
           else os.path.join('dist', 'art', slug + '-16x9.png'))
    if not os.path.exists(os.path.join(ROOT, ref)):
        return slug, 'missing reference ' + ref
    prompt = (f"Use your built-in image generation tool (image_gen) to {brief(META[slug])} "
              f"Then copy the final PNG to {dest_rel} and reply with just the saved path.")
    with open(os.path.join(OUT, f'{slug}-{suffix}.log'), 'w', encoding='utf-8') as log:
        subprocess.run([CODEX, 'exec', '--skip-git-repo-check', '-s', 'workspace-write', '-i', ref, '-'],
                       input=prompt, text=True, encoding='utf-8', cwd=ROOT, stdout=log,
                       stderr=subprocess.STDOUT, timeout=900)
    if not os.path.exists(dest):
        return slug, f'FAILED (see dist/art/{slug}-{suffix}.log)'
    im = Image.open(dest).convert('RGB')          # drop any embedded metadata/provenance chunks
    clean = Image.new('RGB', im.size); clean.paste(im)
    clean.save(dest, 'PNG', optimize=True)
    return slug, '%dx%d' % im.size


if __name__ == '__main__':
    kind = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in KINDS else 'key'
    slugs = [s for s in sys.argv[1:] if s in META] or sorted(META)
    os.makedirs(OUT, exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as ex:
        for slug, status in ex.map(lambda s: make(kind, s), slugs):
            print(kind.ljust(7), slug.ljust(20), status, flush=True)
