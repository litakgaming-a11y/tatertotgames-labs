# TaterTot Games Labs — Wave 3: 10 Game Concepts (Build Briefs)

Ten original hybrid-casual concepts, ready to hand to a coding model for implementation and
integration. No code here — pure design. Each follows the house formula: **one instantly-readable
hyper-casual hook** (the first 3 seconds of gameplay IS the ad creative) plus a **meta layer**
that carries retention and monetization.

Deliberately avoids the 7 live games (inflate-fit, domino-drawing, gravity slingshot,
freeze-timing, lightning-catch, pendulum demolition, ASMR trimming) and the saturated market
mechanics (screws, block jam, holes, hexa sort, crowd-runner, idle hotel). The ten span ten
different mechanic classes: state-toggle steering, information-reveal, placement physics, flow
routing, record-and-replay, timed spectacle, gesture craft, aim-and-bounce, multi-object traffic
control, and rotate-to-route.

---

## Platform integration contract (applies to every game)

**Where it lives:** one fully self-contained HTML file at `games/<slug>/index.html`. Inline
CSS + JS. The ONLY external request allowed is the site's `/analytics.js` script tag. All art is
canvas-drawn; all SFX are WebAudio-synthesized; favicon is an inline emoji SVG data URI.

**Hard stability rules (each of these has already caused a shipped bug here):**
1. Every array/object the update or render path touches must be fully initialized at declaration
   time — the main loop runs from boot on the TITLE screen, before any level exists.
2. The requestAnimationFrame loop must re-arm in a `finally` block so one bad frame can never
   permanently blank the game.
3. AudioContext creation must be wrapped in try/catch (no-audio-device machines throw on
   construction) and every sound function must silently no-op without a context. Audio
   initializes on first user gesture. Mute toggle, persisted.
4. All localStorage access wrapped in try/catch with schema-repair on load.

**Baseline quality bar:** full-viewport devicePixelRatio-aware canvas with resize handling;
Pointer Events (mouse + touch); portrait-mobile-first but desktop-playable; touch-action none,
no scroll/zoom/select; clamped-delta game loop; guarded `navigator.vibrate` haptics; infinite
procedural levels with rising difficulty; animated title screen with bouncy logo, TAP TO PLAY,
meta view, best-progress readout, and a footer badge linking to `../../` labeled
"TaterTot Games Labs"; win screens with staggered star pops and coin count-ups; juice everywhere
(particles, screen shake, eased floating popups, pulsing buttons, per-level shifting gradient
backgrounds — nothing moves linearly).

**Analytics contract:** include `/analytics.js` (defer) and fire via optional chaining so a
missing library is harmless: `level_start {level}`, `level_complete {level, value}`,
`game_over {level}`, plus the one monetization-proxy event named in each brief. Save key
convention: `ttg_<shortname>`.

**Hub integration:** add a card to the root `index.html` grid (emoji, hook line, 2-sentence
description, NEW badge) and a row to `README.md` and `CONCEPTS.md`.

---

## 1. 🧲 Flip Force

| | |
|---|---|
| **Hook (the ad)** | *One tap flips your magnet's polarity.* A glowing orb drifts through a field of red (repel) and blue (attract) magnet nodes — tap anywhere to swap your pole and watch the force arrows instantly reverse. |
| **Core loop (15–25s)** | The orb moves continuously under magnetic forces from fixed nodes. Same-pole nodes push, opposite-pole pull. Tap = polarity flip (orb color and field lines swap instantly with a satisfying *chunk*). Thread the orb through gates, collect star bits, avoid crash walls and neutralizing static zones. Reach the exit portal. |
| **Escalation** | More nodes, pulsing nodes that change strength, rotating node clusters, timed gates, dead zones where flipping is locked. |
| **Juice** | Visible curved field lines that redraw on every flip; orb trail switches color; near-miss whoosh when skimming a crash wall; slow-mo through gates; magnetic crackle audio pitched by field strength. |
| **Meta** | Star bits buy orb trails and a "Lab" of unlockable orb cores (6+ skins with particle signatures). Monetization-proxy event: `core_unlocked {value}`. |
| **Risk note** | Steering by field-flip needs generous tuning: clamp forces near nodes, forgiving hitboxes. |

**Projected stats** — CPI $0.35–0.55 · D1 46% · D7 15% · D30 5.5% · Session 8 min · ARPDAU $0.08–0.13

---

## 2. 📡 Ping Pilot

| | |
|---|---|
| **Hook (the ad)** | *The level is pitch dark — your tap is a sonar ping.* An expanding neon ring sweeps outward and paints the hidden world for two seconds: walls, treasure, and the glowing eyes of something moving. |
| **Core loop (20–35s)** | Guide a tiny submarine by holding a direction (it drifts toward the pointer). The cave is unlit; tapping emits a ping (limited pings per level, recharge slowly) that reveals geometry as fading wireframes. Collect pearls, avoid urchins and a slow-patrolling angler fish that is *attracted to your pings* — the core tension: see more vs. stay hidden. Reach the exit grotto with the pearl quota. |
| **Escalation** | Bigger caves, faster patrols, current jets that push the sub, false-echo crystals that distort pings, one-ping "blackout" levels. |
| **Juice** | The ping itself is the star: expanding ring with chromatic edge, objects lighting up in sequence as the wavefront passes, echo audio delay matching distance, angler-fish heartbeat bass when it's near. |
| **Meta** | Pearls fund the "Reef Vault": submarine upgrades (ping radius, ping count, silent thruster, pearl magnet). Monetization-proxy event: `upgrade_bought {value}`. |
| **Risk note** | Darkness must never feel unfair — keep a faint ambient outline of immediate surroundings. |

**Projected stats** — CPI $0.40–0.65 · D1 44% · D7 16% · D30 6% · Session 10 min · ARPDAU $0.10–0.16

---

## 3. 🤸 Bounce Brigade

| | |
|---|---|
| **Hook (the ad)** | *Drag to place a trampoline; everything that lands on it goes flying.* Citizens leap from a smoking building and you bounce them across the skyline into the rescue net. |
| **Core loop (20–30s)** | Jumpers leave the building at varied arcs and intervals. The player has 1–3 trampolines to place and tilt (drag to position, the trampoline auto-angles toward the drag direction; repositioning is free and instant). Each bounce adds height and a flip animation; chain bounces across rooftops, chimneys, and awnings to deliver every jumper to the ambulance net. A dropped jumper bounces off a comedic bush (lose one heart, not grim). |
| **Escalation** | Multiple simultaneous jumpers, wind gusts, moving nets, bounce-through hoops for bonus coins, cats (bounce differently — extra floaty). |
| **Juice** | Squash-and-stretch on every bounce with pitch-laddering *boing*; flips earn "STYLE +2" popups; perfect net landings trigger crowd-cheer confetti; trampoline fabric ripples. |
| **Meta** | Coins buy trampoline skins and station upgrades (wider net, third trampoline, slow-mo charge). Monetization-proxy event: `upgrade_bought {value}`. |
| **Risk note** | Bounce physics must be deterministic enough to plan; randomize spawn timing, not bounce response. |

**Projected stats** — CPI $0.30–0.50 · D1 49% · D7 17% · D30 6% · Session 8 min · ARPDAU $0.10–0.15

---

## 4. 📦 Parcel Panic

| | |
|---|---|
| **Hook (the ad)** | *Tap the junction, flip the track.* Colored parcels stream along conveyor belts toward forked junctions — one tap toggles each switch, routing every parcel to its color-matched truck. |
| **Core loop (30–45s)** | A warehouse of conveyors with 2–6 tap-toggle junctions (big, satisfying lever flips). Parcels spawn at increasing rate; route each to its truck. Wrong truck = the truck grumbles and you lose one of three strikes. Fragile gold parcels are worth 5x but shatter if they take a junction at high speed — a speed-pad before some junctions adds risk-reward. Clear the shift's parcel quota. |
| **Escalation** | More junctions, belt speed-ups, two-color parcels (either truck accepts), conveyor loops, a mischievous raccoon that occasionally flips a junction back. |
| **Juice** | Chunky lever *ka-chunk* with haptic tick; parcels hop little bumps between belts; trucks fill visibly and drive off with a horn honk when full; combo meter for consecutive correct routings with rising jingle. |
| **Meta** | Wages build your logistics empire: new depots on a map (each a visual milestone), plus upgrades (slower spawn ramp, 4th strike, gold insurance). Monetization-proxy event: `depot_built {value}`. |
| **Risk note** | The flow-control genre lives or dies on readability — parcels must telegraph their path clearly. |

**Projected stats** — CPI $0.35–0.55 · D1 50% · D7 18% · D30 7% · Session 9 min · ARPDAU $0.12–0.18

---

## 5. 👻 Ghost Crew

| | |
|---|---|
| **Hook (the ad)** | *Your last run replays as a ghost — team up with yourself.* Run to a pressure plate and stand on it; time rewinds; now your ghost holds the plate while the "new you" walks through the door it opens. |
| **Core loop (30–50s)** | One-touch movement (hold left/right halves of the screen; auto-jump small ledges). Each level needs 2–4 "crew members" to solve (plates, levers, elevator counterweights) — but you're alone: press GO, act, then tap REWIND; your exact run replays as a translucent ghost while you play the next self. All selves must reach the exit door together. Ghosts are faithful recordings — the puzzle is choreographing yourself. |
| **Escalation** | More selves per level, timed plates, one-use levers, moving platforms that require synchronized timing, a "ghost limit" forcing efficient runs. |
| **Juice** | Rewind is the showpiece: full-screen VHS scrub effect with reversed audio whoosh; ghosts shimmer with particle trails; when all selves sync a door, a "TEAMWORK!" burst with every ghost high-fiving. |
| **Meta** | Stars (by rewinds used) unlock character skins and a "Crew Photo" gallery — one silly team photo per completed world of 10 levels. Monetization-proxy event: `skin_unlocked {value}`. |
| **Risk note** | The most design-forward concept of the ten — keep levels tiny (single screen) and the recording model dead simple (positions per frame). Highest wow-factor for creatives. |

**Projected stats** — CPI $0.45–0.75 · D1 42% · D7 16% · D30 6.5% · Session 12 min · ARPDAU $0.10–0.16

---

## 6. 🎆 Sky Bloom

| | |
|---|---|
| **Hook (the ad)** | *Tap to burst the rocket at exactly the right height.* Fireworks streak upward through target rings — a perfectly-timed tap fills the night sky with a bloom that spells out shapes. |
| **Core loop (20–30s)** | Rockets launch themselves in sequence from the barge; each has a visible target ring (or moving ring) at altitude. Tap while the rocket is inside the ring = perfect bloom (full-size firework + crowd "oooh"); early/late = fizzle sparkle (partial credit). Chains: consecutive perfects grow a combo that upgrades bloom size and color complexity. Finale rounds launch 3–5 rockets in rhythm. Score threshold advances the festival night. |
| **Escalation** | Moving/shrinking rings, wind drift, dud rockets to *not* tap (fake-outs), double-tap split rockets, grand-finale button that fires everything banked. |
| **Juice** | This is a juice-first concept: multi-layer particle blooms with gravity and glitter decay, reflections on the water, crowd silhouettes that cheer louder with combos, booms with proper low-end and echo, sky color shifting through the night. |
| **Meta** | Festival earnings unlock new firework types (willow, ring, heart, dragon) and barge upgrades; a "Festival Album" saves a snapshot of your best finale per night. Monetization-proxy event: `firework_unlocked {value}`. |
| **Risk note** | Near-miss timing psychology does the retention work; keep the perfect window generous early (±120ms) and tighten slowly. |

**Projected stats** — CPI $0.25–0.45 · D1 51% · D7 18% · D30 6.5% · Session 8 min · ARPDAU $0.09–0.14

---

## 7. 🦢 Fold Friends

| | |
|---|---|
| **Hook (the ad)** | *Swipe to fold the paper — it comes alive.* Three clean swipes fold a sheet into a crane; it blinks, flaps, and waddles off to join your paper zoo. |
| **Core loop (25–40s)** | A patterned sheet sits center-screen with dashed fold lines appearing one at a time. Swipe across a fold line in the indicated direction to execute the fold — the paper animates the crease in 3D-ish perspective with a crisp *snap*. Fold accuracy (swipe angle vs. line) scores each crease; finish all folds to bring the origami animal to life with a reveal animation. Wrong-direction swipes crumple comically and undo (no fail state — zen like Buzzcut Buddies). |
| **Escalation** | More folds per animal (3 → 9), timed "speed-fold" bonus rounds, special papers (foil = stricter accuracy for 2x, patterned = hidden color reveal), two-sheet animals. |
| **Juice** | Paper physics feel: page-turn audio per crease, corner flutter, accuracy sparkles along the fold, the birth moment (eyes pop open, a chirp, a hop) lands as the reward every single time. |
| **Meta** | Every completed animal wanders a growing "Paper Park" diorama on the title screen (the collection IS the meta, Buzzcut-salon-style); park biomes unlock every 12 animals (pond → meadow → bamboo grove → snow field). Monetization-proxy event: `animal_completed {value: accuracyPct}`. |
| **Risk note** | Fold rendering can be faked with two-polygon flips — do not attempt real paper simulation. |

**Projected stats** — CPI $0.25–0.45 · D1 50% · D7 17% · D30 6.5% · Session 10 min · ARPDAU $0.08–0.13

---

## 8. 🌻 Bloom Drop

| | |
|---|---|
| **Hook (the ad)** | *Drop the seed, watch it plink.* A seed bounces down through a pin-field with escalating dings — where it lands, a flower erupts, and the garden fills in real time. |
| **Core loop (15–25s per drop)** | Aim a seed cannon at the top (drag to set angle, release to drop) into a Pachinko-style pin field. Pins light up and chime on every hit (pitch ladders with consecutive hits — the Peggle dopamine). The bottom is a row of soil pockets of different rarity (common daisy → rare orchid → jackpot golden rose). Special pins: bumpers (big launch), multiplier pins (2x pocket value), split pins (seed becomes two). Each level = limited seeds, target garden value. |
| **Escalation** | Moving pockets, rotating pin clusters, fog rows hiding pins, "last seed slow-mo" when a jackpot is reachable. |
| **Juice** | Every pin hit is an audiovisual reward (ding + light + tiny particle); the landing flower BLOOMS with a burst matched to rarity; the garden strip visibly fills flower by flower; jackpot = full-screen petal storm. |
| **Meta** | The garden persists and grows across levels (a scrolling flowerbed you can admire on the title screen); seed upgrades (heavier seeds, +1 seed, rarity luck, split chance). Monetization-proxy event: `upgrade_bought {value}`. |
| **Risk note** | RNG must feel generous: bias late bounces subtly toward pockets, never away. |

**Projected stats** — CPI $0.30–0.50 · D1 52% · D7 19% · D30 7% · Session 11 min · ARPDAU $0.12–0.19

---

## 9. ⛴️ Harbor Hustle

| | |
|---|---|
| **Hook (the ad)** | *Tap a boat to stop it; tap again to go.* Ferries, tankers, and jet-skis crisscross a busy harbor on visible routes — one brain, six boats, zero collisions. |
| **Core loop (30–50s)** | Boats enter on fixed drawn routes toward their color-matched docks. Each boat has two states — cruise and hold — toggled by tapping it (big tap targets, satisfying horn per state change). Manage crossings so nobody collides; a near-miss makes both captains yell comedically (and pays a "CLOSE CALL" bonus — rewarding brave play, the near-miss engine again). Dock the shift's quota. Collision = cartoon bonk, one of three strikes. |
| **Escalation** | More simultaneous boats, speed differences (jet-skis dart), fog banks hiding a route segment, a drawbridge on a timer, VIP yacht worth 3x that must never wait long (impatience meter). |
| **Juice** | Wakes and foam trails, seagulls scatter on near-misses, dock cranes animate loading, sunset palette progression across a shift, foghorn audio depth. |
| **Meta** | Harbor town builds out with earnings (lighthouse, market, ferris wheel — visible from the play field, Topple-Town-style); upgrades (4th strike, patience+, close-call bonus+). Monetization-proxy event: `building_built {value}`. |
| **Risk note** | The genre's classic failure is overwhelm cliffs — ramp spawn count slowly and cap simultaneous boats at 7. |

**Projected stats** — CPI $0.35–0.55 · D1 48% · D7 17% · D30 6.5% · Session 10 min · ARPDAU $0.11–0.17

---

## 10. 🔦 Beam Team

| | |
|---|---|
| **Hook (the ad)** | *Tap a mirror, the light bends.* One golden beam snakes across a dark level, and every mirror you rotate reroutes it live — light all the lanterns and the whole screen glows. |
| **Core loop (20–35s)** | A lighthouse emits a continuous beam. Mirrors sit on grid points; tapping one rotates it 45° with a weighty clockwork *click*, and the beam re-traces instantly (live, not turn-based — watching the beam whip to its new path is the toy). Route the beam through prisms (split into colors), color filters, and portals to light every lantern. Fireflies gather along lit beam segments. All lanterns lit = the level blooms into full color from its dark state. |
| **Escalation** | Color-matched lanterns (route the right split through the right filter), rotating obstacle fans, mirror budget (some mirrors locked), dual-lighthouse levels, timed dimming lanterns. |
| **Juice** | The beam is rendered thick and alive — glow, dust motes drifting through it, heat shimmer; each lantern ignition is a warm whump + radial light bloom; the final full-color reveal is the screenshot moment. |
| **Meta** | Lit lanterns earn "glow" currency → the Lighthouse Village on the title screen gains lit windows, string lights, and festivals per milestone; beam cosmetics (aurora beam, rainbow prisms). Monetization-proxy event: `cosmetic_unlocked {value}`. |
| **Risk note** | Beam tracing is straightforward ray reflection on a grid — keep mirror count ≤ 10 so solutions stay readable on a phone. |

**Projected stats** — CPI $0.35–0.60 · D1 47% · D7 16% · D30 6% · Session 9 min · ARPDAU $0.09–0.14

---

## Portfolio view — wave 3

| # | Game | Mechanic class | Primary KPI bet | Best-fit monetization |
|---|---|---|---|---|
| 1 | Flip Force | State-toggle steering | Skill retention | Rewarded (retry), skins |
| 2 | Ping Pilot | Information reveal | Session length | Rewarded (+pings), upgrades |
| 3 | Bounce Brigade | Placement physics | Low CPI (cute rescue) | Interstitials, upgrades |
| 4 | Parcel Panic | Flow routing | D7 (mastery curve) | Rewarded (4th strike), depots |
| 5 | Ghost Crew | Record-and-replay | Ad-creative wow factor | No-ads IAP, skins |
| 6 | Sky Bloom | Timed spectacle | Lowest CPI (pure spectacle) | Interstitials, firework IAP |
| 7 | Fold Friends | Gesture craft | Broadest demo (zen + collection) | Interstitials, paper IAP |
| 8 | Bloom Drop | Aim-and-bounce | D30 (Peggle compulsion + garden) | Rewarded (+seed), luck IAP |
| 9 | Harbor Hustle | Traffic control | D7 (mastery curve) | Rewarded (strike), town IAP |
| 10 | Beam Team | Rotate-to-route | Screenshot virality | No-ads IAP, cosmetics |

**Suggested build order for a coding model:** start with the juice-first, low-physics-risk trio
(Sky Bloom, Bloom Drop, Fold Friends), then the routing pair (Parcel Panic, Beam Team), then
physics (Bounce Brigade, Flip Force), then the ambitious ones (Ping Pilot, Harbor Hustle,
Ghost Crew last — it has the most novel state model).

Every build must pass the existing test battery before deploy: syntax check, hostile-environment
boot (throwing AudioContext + blocked storage), and the 180-frame title+gameplay pump with zero
frame errors.
