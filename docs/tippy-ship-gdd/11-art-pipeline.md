# 11 — Art & Audio Pipeline

Pixel art, generated. PixelLab makes everything on screen; Higgsfield makes everything off it; ElevenLabs makes everything you hear.

---

## 1. Tool allocation

| Tool | Owns | Does not touch |
|---|---|---|
| **PixelLab** | Every in-game sprite: hulls, cargo, crane, towns, tilesets, parallax, UI assets, fonts, VFX frames | Marketing, audio |
| **Higgsfield** | Key art, store screenshots, UA video creatives, feature graphics, press kit | Anything inside the build |
| **ElevenLabs** | All SFX, all music stems, all ambience | Visuals |
| **Unity (procedural)** | Water surface shader, foam, wake, palette LUT swapping, particle systems, lighting | Sprite content |

The hard line: **nothing Higgsfield produces ships inside the game.** Generated raster at photographic fidelity next to pixel sprites reads as broken. Higgsfield's job is the storefront and the ad network, where high fidelity is an asset.

## 2. Resolution and pixel discipline

| | |
|---|---|
| Logical resolution | 540 × 960 |
| Nominal pixel size | 1 texel = 1 logical pixel |
| Hull sprite width | 140–300 px depending on archetype |
| Cargo sprite | 22–34 px |
| Palette | 48 colours per region ramp, shared structure |
| Filtering | Point, always |
| Rotation | Free (sub-pixel) for physics bodies; snapped for everything else |

540 × 960 is generous for pixel art — chunky enough to read as pixels, dense enough that a 2° hull rotation moves the rail several pixels. That density is what makes the direction viable. See [10-tech-architecture.md §6](10-tech-architecture.md).

## 3. Palette architecture

One shared palette *structure* across all regions, with per-region colour ramps applied by shader LUT.

```
Palette slots (48):
   00-07   sky ramp          (8 steps, dark → light)
   08-15   water ramp        (8 steps)
   16-19   foam / spray      (4)
   20-27   hull materials    (8)
   28-35   cargo hues        (8 — one anchor per cargo type + shades)
   36-41   town / stone      (6)
   42-45   metal / crane     (4)
   46-47   UI accent, alert  (2)
```

Every sprite is authored against the **index**, not the colour. A single 256×1 LUT texture per region re-colours the entire game. This is what makes eight regions cost eight small textures instead of eight full art passes.

**Cargo hue slots are locked across all regions.** A Barrel is the same colour in the Arctic as in the Monsoon, because cargo colour is gameplay information and must never be reskinned.

### Colour-blind palettes

Three additional LUTs (protan, deutan, tritan) that only remap slots 28–35 and 46–47 — cargo and alerts. The world palette is untouched, so the game still looks like itself. See [08-ux-ftue.md §7](08-ux-ftue.md).

## 4. Cargo silhouette language

Shape carries the information. Colour reinforces it. A player must read mass from silhouette alone at thumbnail size.

| Type | Silhouette | Size | Value read |
|---|---|---|---|
| 📦 **Crate** | Square, banded, warm brown | 26 sq | "ordinary, safe" |
| 🪵 **Timber** | Long, thin, pale, rope-bound | 68 × 13 | "awkward, spans" |
| 🛢️ **Barrel** | Circular, dark, hooped | r 13 | "it will roll" |
| 🥇 **Bullion** | Small, dark, gold-rimmed, dense | 30 × 26 | "small but heavy" |
| 🧊 **Glassware** | Pale, translucent, straw-packed | 27 × 22 | "do not stack on this" |

**The Bullion read is the important one.** It must be visibly *small* and visibly *heavy* — a compact dark shape with a gold rim, noticeably denser-looking than a crate twice its size. That visual contradiction is what teaches density without a tutorial.

Ice overlay: 4 progressive frost states, additive, drawn over any cargo in region 5.

## 5. Hull sprite construction

Each hull is assembled from parts so upgrades are visible without re-authoring the whole ship.

```
  hull_<archetype>_body_<beamTier>.png     ← 3 beam widths per archetype
  hull_<archetype>_deck_<deckTier>.png     ← 5 deck surfaces (rubber colour band)
  hull_<archetype>_keel_<ballastTier>.png  ← 5 keel weights, visible below waterline
  hull_<archetype>_super.png               ← superstructure, cabin, funnels
  crane_trolley_<craneTier>.png            ← 5 winch housings
```

Total: 12 archetypes × (3 + 5 + 5 + 1) = **168 hull part sprites**, plus 5 crane variants. Generated in batches through PixelLab with a shared style reference so the roster reads as one fleet.

**Every upgrade must change the sprite.** A ballast purchase that does not visibly add a keel weight is an upgrade the player does not believe in. See [04-progression.md §4](04-progression.md).

## 6. Town silhouettes

Four archetypes × five tiers, palette-swapped per region.

| Archetype | Regions | Tier 1 → Tier 5 |
|---|---|---|
| Fishing village | 1, 2, 5 | Huts → jetty → quay → cranes → harbour town |
| Trading town | 1, 3, 7 | Market → warehouses → stone quay → gantries → old city |
| Industrial port | 3, 4, 6 | Sheds → chimneys → rail spur → docks → works |
| City | 6, 7, 8 | Terrace → blocks → towers → skyline → lit metropolis |

Authored: **20 silhouettes**. Delivered: 160 visual states via palette LUT. Each carries animated micro-elements on a shared 8-frame loop — smoke, cart wheels, tiny figures, ferry, lamp flicker.

**The tier-up animation is the game's second-most-repeated emotional beat.** Buildings rise in sequence with individual eases, lamps light one by one, the ambient audio gains a layer. Budget real time for this — it is worth more than any single gameplay feature outside the run.

## 7. Water — procedural, not sprites

The water surface is the one thing that must **not** be a sprite, because it is driven by `WaterYAt(x)` which the physics also reads. Any divergence between the drawn water and the simulated water is a correctness bug the player can see.

```
Shader: water surface
  input: WaterYAt sampled at N=64 columns across the view
  output: filled polygon below the line, with:
      - a 2 px high-contrast crest band          ← THE most important edge on screen
      - 3 parallax sub-surface bands (palette slots 08-15)
      - foam scatter where |slope| is high
      - wake ripple overlay when WAKE.on
      - tint darkened by TensionBus water channel
```

The 2 px crest band is non-negotiable and must be the highest-contrast edge in the frame at all times. It is Pillar P1.

Foam, spray and splash particles use VFX Graph with pixel-snapped quads so they read as part of the pixel world rather than floating above it.

## 8. Generation workflow

### PixelLab

```
1. Establish a style anchor: generate the Tugboat first, iterate until it is right.
   Everything else references it. Do not generate broadly before the anchor is locked.
2. Batch by category (all cargo, all keels, all towns) so style stays consistent
   within a batch — cross-batch drift is the main failure mode.
3. Author against the palette index, then quantise every output to the 48-slot ramp.
   A quantisation pass is mandatory; generated output will not respect the palette.
4. Every sprite gets a manual cleanup pass. Generated pixel art is 85% there;
   the last 15% is silhouette clarity, and silhouette clarity is the whole design.
5. Version every asset with its generation prompt in a sidecar .txt so it can
   be regenerated consistently later.
```

### Higgsfield

```
Key art     — one hero image per region for the store and season pass
Screenshots — 6 per store listing, composited over real gameplay captures
UA video    — see 09-monetization.md §6; combine generated establishing shots
              with real tape-rendered gameplay clips
```

Never generate gameplay footage. The real clips harvested from tapes are better, more honest, and they convert better because they show the actual game.

### ElevenLabs

```
Music:  compose_music per region — specify BPM, key, instrumentation, mood.
        Request the 4 stems separately at identical BPM and length.
        VERIFY PHASE ALIGNMENT before shipping; drifting stems wander the mix.

SFX:    text_to_sound_effects for the ~90 asset library.
        Creaks and thunks are generated at a neutral pitch and shifted at
        runtime, so generate ONE good creak family rather than 40 variants.
```

Per-region instrumentation brief:

| Region | Instrumentation | Mood |
|---|---|---|
| Home Coast | Accordion, light strings, whistle | Warm, unhurried |
| The Shallows | Marimba, flute, soft percussion | Curious, shifting |
| Ferry Lanes | Upright bass, brushed kit, muted trumpet | Working, busy |
| Roaring Reach | Low strings, timpani, wind | Grim, driving |
| Ice Run | Glass harmonica, sparse piano, sub drone | Cold, exposed |
| Monsoon Straits | Gamelan, rain percussion, cello | Heavy, humid |
| Nightwatch | Solo cello, distant bell, deep pad | Lonely, watchful |
| Open Waters | Rotating — reuses region kits | Varies |

## 9. Asset budget

| Category | Count | Est. size |
|---|---|---|
| Hull parts | 168 | 4 MB |
| Crane parts | 5 | 0.2 MB |
| Cargo + ice | 24 | 0.6 MB |
| Town silhouettes | 20 × animated | 6 MB |
| Parallax / tilesets | 8 regions | 9 MB |
| Weather overlays | 4 | 1.5 MB |
| UI + fonts | ~90 | 2 MB |
| Palette LUTs | 11 | 0.05 MB |
| Music stems | 32 | 45 MB |
| SFX | ~90 | 18 MB |
| **Total** | | **~87 MB** |

Comfortably inside the 150 MB install target with room for region additions post-launch.

## 10. Style guardrails

1. **Silhouette before detail.** If a sprite is unreadable as a black shape at 50% size, it fails.
2. **The waterline is sacred.** Nothing may reduce its contrast — not weather, not fog, not vignette, not UI.
3. **Cargo colour is gameplay data.** Never reskin cargo for a season, an event, or a region.
4. **Chunky over fine.** When in doubt, fewer, larger pixels. Fine detail vanishes on a 720p phone in sunlight and costs generation iterations.
5. **One style anchor.** Every asset traces back to the Tugboat. A batch that does not match the anchor gets regenerated, not accepted.
