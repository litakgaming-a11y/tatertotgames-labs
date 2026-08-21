# 08 — UX & FTUE

Portrait, one thumb, 540 × 960 logical. Every system arrives one at a time.

---

## 1. Screen map

```
                    ┌──────────────┐
                    │   WORLD MAP  │ ◄── home
                    └──────┬───────┘
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌────────────┐   ┌──────────┐
    │   PORT   │    │   FLEET    │   │  EVENTS  │
    │  (tiers, │    │ (assign,   │   │ (daily,  │
    │  builds) │    │  upgrade)  │   │ regatta, │
    └──────────┘    └─────┬──────┘   │  pass)   │
          │               │          └──────────┘
          └───────┬───────┘
                  ▼
           ┌─────────────┐
           │  DEPLOY     │  ← the decision
           └──────┬──────┘
                  ▼
           ┌─────────────┐
           │   THE RUN   │
           └──────┬──────┘
                  ▼
           ┌─────────────┐
           │   RESULT    │
           └─────────────┘
```

Maximum depth from home to a run: **3 taps** (map → route → deploy → sail). Repeat run from result: **1 tap**.

## 2. The run HUD

```
┌───────────────────────────────────────────────┐
│ ⛵ Barge "Dogged"          🪙 4,120   ⏸        │  ← 44 px, thumb-safe
├───────────────────────────────────────────────┤
│                                               │
│                  [ crane ]                    │
│                     │                         │
│                    ▢ ← crate on cable         │
│                                               │
│                                               │
│              ╱▔▔▔▔▔▔▔▔▔╲                      │
│  ~~~~~~~~~~~~▏ ▢▢ ▢ ▢▢  ▕~~~~~~~~~~~~~~~      │  ← waterline: MAX CONTRAST
│              ╲_________╱                      │
│                                               │
├───────────────────────────────────────────────┤
│  CONTRACT  5× Bullion → Fogport      ✅ 5/5   │
│                                               │
│   ╭──── LIST ────╮                            │
│   │ 🟢🟢🟡●🟡🔴🔴 │  26°     FREEBOARD ▓▓▓░░  │  ← the inclinometer
│   ╰──────────────╯                            │
│                                               │
│  OVERLOAD                     🎥 reroll (1)   │
│   📦 Crate   ×1.20   🛢️ Barrel ×1.52          │
│   🥇 Bullion ×2.08                            │
│                                               │
│         ⚑  SAIL NOW  ×1.00                    │
└───────────────────────────────────────────────┘
```

### Layout rules

1. **The waterline sits at 62% screen height** (`WATERY = H × 0.62`, ported from the prototype). It is the visual anchor and it never moves.
2. **Nothing UI may overlap the hull or the waterline.** The bottom panel starts below the hull's maximum roll excursion.
3. **All interactive elements sit in the bottom 40%** — thumb-reachable one-handed on a 6.7" phone.
4. **The crane occupies the top 25%.** Touch anywhere in the play area, not just on the crane.
5. Minimum touch target 44 × 44 px.

### Three layout rules that are scar tissue

Street Baron's `BUGS.md` records a UI pass that closed roughly twenty bugs at once by finding one root cause. All three rules below come from that ([15-lessons-from-prior-builds.md L17–L20](15-lessons-from-prior-builds.md)).

**Lock the reference resolution in week one of M1.** SB's `PanelSettings.referenceResolution` was 360×780 while every mockup was authored on a 540×960 canvas, so all UI rendered **~1.37× oversized** — the single root cause behind most of an entire annotated-screenshot bug batch. Set `ScaleWithScreenSize` @ **540×960**, assert it in a test, and author every mockup on that canvas. A one-line setting that costs weeks when wrong.

**Nav clearance is a token, not a per-panel fix.** SB fixed "panel clipped by the bottom nav" three separate times (B10, B39, B55); the third entry reads *"verify ALL panels clear the nav."* Here there is one `--safe-bottom` token derived from nav height plus the device safe-area inset, every overlay derives its bottom from it, no panel hardcodes a value, and a test enumerates every panel asserting its content rect clears the nav.

**A feedback class can go silently invisible.** SB's `.sb-toast` used `align-self: center` on an absolutely-positioned element, giving it zero width — so *every* toast in the game was invisible over open panels, found only incidentally. This design rests entirely on feedback landing, so a PlayMode smoke test fires one of each class — popup, toast, particle burst, coach mark, inclinometer flash — and asserts non-zero resolved bounds and non-zero opacity.

Also: **UITK scroll views are dead on touch without drag-scroll.** Add it to the shared scroll component once, before building any scrolling screen.

### The bubble inclinometer

A real ship's clinometer. It is the single most important HUD element and it is why pixel art works for this game.

```
   ╭─────────────────────────────╮
   │  🟢  🟢  🟡  ●  🟡  🔴  🔴  │   26°
   ╰─────────────────────────────╯
      0°  12° 20° ▲  30° 38° 45°
                  bubble
```

- **Bubble position** = `hull.a`, smoothly interpolated, sub-pixel.
- **Zone bands** are coloured by the actual constants: green to 20°, amber `WARN_ANG` (25°) to 30°, red from 32° toward `CAPSIZE_ANG` (40°).
- **Numeric readout** to whole degrees, because at low resolution a number beats a shape.
- **Zones pulse with the Tension Bus** — the amber and red bands breathe as tension rises.
- Mirrors on the left/right for symmetric roll.

This solves the one genuine risk of the pixel art direction: a 2° change might be a few pixels of hull rotation, but it is an unmissable bubble slide and a changed number.

### Freeboard meter

A vertical 5-segment bar showing `hull.freeboard / hull.freeboard0`. Distinct from list, because on a Barge you drown before you tip and the player needs a separate instrument for a separate failure mode.

## 3. Session 1 — the scripted FTUE

**No map. No warehouse. No currency UI. No shop.** Three runs, roughly 90 seconds, core loop only.

### Run 1 — the rigged SAVED!

This run is authored, not seeded. The manifest, the crate order, and a single timed gull landing are set so the hull is *guaranteed* to swing past `WARN_ANG` and recover.

```
  t=0.0   Hull sits level. Text: "Load the boat."
  t=1.5   Crate 1 available. Ghost hand shows HOLD gesture.
  t=4.0   Crate 1 placed anywhere → lands. First thunk, first haptic.
  t=6.0   Crate 2. Text: "Hold to lower her down gently."
  t=11.0  Crate 3.
  t=14.0  ── SCRIPTED ── gull lands on the low rail, adding weight.
          Combined with the authored crate mass, list crosses 25°.
  t=14.2  ⚠ TIPPING!  ·  timeScale 0.55  ·  heartbeat  ·  creak
          Everything slows. The player has ~1.4 real seconds of dread.
  t=15.1  Ballast righting brings her back under 16° on its own.
  t=15.3  ★ SAVED! ★  full multi-channel release.
  t=17.0  Text: "That's the game."
  t=18.0  SAIL → wake test → delivered.
```

**The player feels the entire emotional product inside 45 seconds without needing luck.** This is the highest-value 20 lines of code in the project.

The rigging is invisible: the gull is a real game entity doing a real thing, and the physics is genuine. Nothing is faked; the *setup* is chosen. If a player replays run 1 later it behaves identically, which preserves trust.

### Run 2 — teaching the hold

```
  Manifest is Bullion-heavy and the hull is narrow.
  Crate 1: the tutorial deliberately releases it from full height
           (ghost hand demonstrates a fast release) → visible list spike.
  Text: "Dropped from up high, she takes it hard."
  Crate 2: ghost hand demonstrates lowering to 4 px → soft settle.
  Text: "Lower her down. Patience beats speed."
  Remaining crates: player's choice, no guidance.
```

Teaching by contrast, within one run, with the player's own eyes on the inclinometer.

### Run 3 — teaching greed

```
  Quota is 4 and easily met.
  On quota, SAIL slides up with a loud stinger and ×1.00 appears.
  The 3-card hand contains a deliberately gorgeous Bullion at ×2.08.
  Text: "You can stop now... or push your luck."
  No further guidance. Whatever happens, happens.
```

Whether the player banks or capsizes, they have authored the outcome. That is the last thing the tutorial needs to teach.

## 4. Unlock ladder — one system per session

| Session | Unlocks | Framing |
|---|---|---|
| 1 | Core loop | Three runs, no UI |
| 2 | **Warehouse + cargo types** | "Your holds are filling up" |
| 3 | **Port tiers** — first town lights up | The camera pans, buildings rise |
| 4 | **Second hull + fleet assignment** | "She'll run that route while you sleep" |
| 5 | **Daily Contract** | Streak begins |
| 6 | **Region 2 + building slots** | The map opens west |
| 7 | **Weekly Regatta** | "Same boat, same sea, everyone" |
| 10 | **Prestige preview** (locked, visible) | A distant goal made real early |

Each unlock is a **celebration**, not a menu appearing: camera move, sound, a single sentence, one tap to dismiss. Never two unlocks in one session — the player must have a clear answer to "what's new today".

## 5. The deployment screen

The one screen where the fleet layer earns its keep.

```
┌──────────────────────────────────────────────┐
│  FOGPORT ← SALTBAY                           │
│  CONTRACT  5× Bullion         par 4,200      │
│  SEA  swell ▓▓▓▓░  gusts  ·  wake            │
│  YOUR BEST  ×6.2  ·  rating 1.42             │
├──────────────────────────────────────────────┤
│  SEND                                        │
│                                              │
│  ● 🚢 Barge "Dogged"    T3   Bullion ★★★     │
│      ⚠ pauses 🪙 1,240/hr for ~90 s          │
│                                              │
│  ○ 🛥️ Tugboat "Nub"     T2   Bullion ★       │
│      idle — costs you nothing                │
│                                              │
│  ○ ⛵ Clipper "Wisp"    T3   Bullion ★       │
│      ⚠ pauses 🪙 680/hr                      │
├──────────────────────────────────────────────┤
│  CARGO  5× 🥇 required   (you have 22)       │
│                                              │
│              ⚓  SET SAIL                     │
└──────────────────────────────────────────────┘
```

The opportunity cost is stated in Coins per hour, in the same units the player has been watching accumulate. That is what makes it a real decision rather than a menu.

## 6. Result screen

```
┌──────────────────────────────────────────────┐
│              ⚓ DELIVERED                     │
│                                              │
│         9 crates  ×  ×2.44  =  🪙 1,180      │
│                                              │
│    ⭐ ROUTE RATING  1.08 → 1.42   ▲ NEW BEST │
│    🪙 Fogport idle  680/hr → 1,240/hr        │
│                                              │
│    🏘️ SALTBAY reached Tier 3                 │
│                                              │
│    🎥  DOUBLE IT  →  🪙 2,360                │
│                                              │
│    [ SAIL AGAIN ]            [ MAP ]         │
└──────────────────────────────────────────────┘
```

**The causal chain is on one screen**: what you did → your rating → what it now pays you, forever. That is the thesis, restated after every single run.

`SAIL AGAIN` is the primary action and it re-enters the same route with one tap. Never make the player navigate back to repeat.

## 7. Accessibility

| Provision | Implementation |
|---|---|
| **Colour-blind safe** | Cargo distinguished by silhouette first, colour second. Inclinometer zones use position and a numeric readout, never colour alone. Three CVD palettes (protan/deutan/tritan) in Settings. |
| **Reduced motion** | Toggle disabling camera dutch, push-in, and all shake. `timeScale` retained — it is information. See [07-juice-audio.md §8](07-juice-audio.md). |
| **Haptics toggle** | On by default, one tap to disable. |
| **Assisted Lower** | Auto-descent + single tap release, −8% multiplier. See [01-core-loop.md §2](01-core-loop.md). |
| **Text scale** | 100% / 125% / 150%, all layouts tested at 150%. |
| **Hold duration** | No input requires a hold longer than 2.2 s. Assisted Lower removes holds entirely. |
| **No timed failure in menus** | Only the 4 s ad-continue window is timed, and declining is safe. |
| **Sound-independent** | Every audio cue has a visual counterpart. The creak has the inclinometer; the heartbeat has the vignette pulse. |

## 8. Onboarding failure modes to avoid

1. **Never show a number the player cannot yet act on.** Coins do not appear until session 2.
2. **Never present two currencies in the same beat.**
3. **Never tutorialise the physics.** No text explains buoyancy. The player learns it by watching the boat, which is the entire appeal.
4. **Never block on a tutorial the player has already figured out.** Every guided step has a 3 s timeout after which the player's own input takes over.
5. **Never open with a rewarded ad offer.** First ad impression is no earlier than session 2.

## 9. Localisation

All strings externalised from day one. Note that the game is unusually localisation-light — the core loop communicates through physics, not text. Total string count target: **< 400**, which makes adding a language a one-day job.

The exception is port names, which are procedurally assembled from `PORT_A`/`PORT_B`. For non-English locales, ship per-locale word lists rather than translating assembled names.
