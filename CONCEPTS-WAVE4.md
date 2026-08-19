# TaterTot Games Labs — Wave 4: 3 Physics-First Build Briefs

Three concepts where **the physics simulation IS the toy** — chosen because physics toys are
self-demonstrating in ad creatives, endlessly extendable with new materials/objects/rules
(the long-term content runway hybrid-casual needs), and produce the strongest "one more try"
compulsion when failure is physical and comedic rather than arbitrary.

Three physics classes not yet in the portfolio: **granular simulation** (falling sand),
**buoyancy + rigid stacking** (a boat that really floats), and **verlet rope dynamics** (cuttable
soft constraints). No pendulums (Kaboom Crane), no pin-bounce (Bloom Drop), no gravity wells
(Slingshot Salvage), no trampolines (Bounce Brigade).

**The platform integration contract in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) applies in full**
(single self-contained file, stability rules, mobile bar, analytics, juice bar), with one
structural change: since every game now has a detail page, **the game file is
`games/<slug>/play.html`** — builders must NOT create `games/<slug>/index.html` (the detail page
is generated separately). The footer badge in play.html links to `../../`.

---

## 18. 🏜️ Sandfall — *granular simulation*

**Hook (the ad):** *Draw a ledge — a hundred thousand grains obey.* Colored sand pours from
spouts at the top; every line you draw becomes a shelf the sand piles onto, slides down, and
streams off. The toy sells itself: sand behaving like real sand.

**Core loop (25–40s):** 2–4 spouts pour different colored sands. At the bottom sit matching
glass jars. Draw shelf lines with your finger (limited "ink" per level, shown as a meter) to
route each stream into its jar. Drawn shelves **erode** — grains grind them away, so a shelf is
a temporary decision, not a solution. Jar fill % shown per jar; fill all quotas to win. Wrong
color entering a jar contaminates it (ugly brown swirl + womp) — contamination is recoverable
but costs quota. Hazards at higher levels: fans that blow falling grains sideways on a cycle,
acid pools that dissolve grains, narrow chutes, moving jars.

**Physics:** cellular-automata falling sand on a coarse grid (~3px cells): fall, then diagonal
slip, per-material rules. This must be the real thing — piles form 30–40° slopes, streams fork
around obstacles, layers stack visibly in jars (the jar shows strata of whatever fell in).
Budget the grid so a mid-range phone holds 60fps (cap active grains, sleep settled regions,
redraw dirty rows only).

**Juice:** per-grain shimmer on landing zones, jar chime ladder as fill rises (pitch per 10%),
"PERFECT POUR" full-jar burst, sand hiss that scales with active grain count, haptic tick per
10% jar, erosion crumble particles, jars visibly heavier (shelf bows) when full.

**Meta:** completed jars go on the **Terrarium Shelf** on the title screen — a growing wall of
striped sand-art jars (each jar keeps the actual strata pattern the player poured, so every one
is unique — screenshot bait). Unlock materials as levels advance: glow sand (lights the level),
heavy sand (erodes shelves faster, worth 2x), galaxy sand (sparkles). Upgrades: Ink+, Slow
Erosion, Wide Jars, Contamination Filter. Save key `ttg_sandfall`.

**Analytics:** standard trio + `jar_filled {value: fillPct}` and `upgrade_bought {value}`.

**Extension runway:** liquids (water mixes sand to mud), lava (glassifies), magnets, sieves,
color-mixing recipes, daily sand-art challenges — the material system is the live-ops engine.

**Projected stats** — CPI $0.25–0.45 · D1 52% · D7 19% · D30 7% · Session 11 min ·
Sessions/DAU 4.6 · ARPDAU $0.11–0.17 · LTV(90d) $0.80 · Year-1: 10–17M downloads, $6–10M net

---

## 19. ⛵ Tippy Ship — *buoyancy + rigid stacking*

**Hook (the ad):** *Load the boat. Don't tip the boat.* A crane swings crates over a small ship
that genuinely floats — every crate you drop makes it sit lower and list further. Everyone
understands a boat about to tip.

**Core loop (30–50s):** A crane trolley auto-swings left-right above the harbor with the next
crate. TAP to release; the crate falls, lands on the deck (or the stack), and the ship reacts:
buoyancy pushes up on submerged hull, cargo weight and off-center placement roll it. Crates are
mixed sizes/weights/shapes (cubes, long planks, barrels that roll!, gold crates worth 3x that
are HEAVY). Load the manifest quota, then hit SAIL — the ship must survive a 3-second wake test
(a passing ferry's waves) to deliver. Cargo sliding overboard = lost (comedic splash + bobbing
crate); ship rolling past ~40° = capsize, level lost with the whole stack sliding off in
glorious slow-mo. Escalation: choppier water, wind gusts, seagulls that land on one side (!),
manifest items that must go on top (fragile), night levels with a lighthouse sweep.

**Physics:** 2D rigid bodies (crates as boxes, barrels as circles) with friction stacking on a
hull that has real buoyancy: displaced-area upthrust, roll torque from cargo center-of-mass vs
center-of-buoyancy, water drag, wave forcing. Keep the solver simple (positional correction +
impulse, fixed substeps); tune for forgiving stability early — a fresh player should manage 6–8
crates by feel.

**Juice:** water line clings to the hull, wake ripples, creak audio that pitches with roll
angle (the *tension* instrument), slow-mo + heartbeat when roll passes warning angle then
"SAVED!" if it recovers, splash fountains, cargo thunk pitch by weight, seagull squawks,
sunset palette per route.

**Meta:** a **shipping route map** — each level is a port on a winding route; delivered ports
light up with little animated towns. Ship upgrades that visibly change the sim: Wider Hull
(stability), Ballast (lower CoM), Rubber Deck (friction), Crane Brake (slows the trolley near
tap). Ship skins (tug, junk, paddle steamer). Save key `ttg_tippy`.

**Analytics:** standard trio + `port_delivered {value: cratesAboard}` and `upgrade_bought {value}`.

**Extension runway:** new cargo physics (ice slides, animals walk!, magnets, bouncy cargo),
storms, rival ships' wakes, canal locks, dock-to-dock transfer levels — every new object type
is a content drop.

**Projected stats** — CPI $0.30–0.50 · D1 50% · D7 18% · D30 7% · Session 10 min ·
Sessions/DAU 4.4 · ARPDAU $0.12–0.18 · LTV(90d) $0.82 · Year-1: 8–14M downloads, $6–10M net

---

## 20. ✂️ Cut Loose — *verlet rope dynamics*

**Hook (the ad):** *One snip — physics does the rest.* Packages hang in a web of taut ropes;
swipe through the right rope and the whole system swings, drops and lands the package on the
truck. Wrong rope first? Comedy.

**Core loop (20–35s):** A warehouse scene: 1–3 packages suspended by rope networks (anchors,
pulleys, balloons pulling up, springs). Swipe anywhere to cut ropes (finger = blade, satisfying
fray-then-snap). The puzzle is ORDER and TIMING: cut the left rope and the package pendulums
right — cut the second rope at the swing's apex to fling it onto the conveyor. Balloons lift
when ballast is cut away; springs launch; some ropes are bundled (two swipes). Package must
land in the truck/conveyor zone intact — hard landings on the floor dent it (2 dents = broken,
retry free). Escalation: moving trucks, fans, spike strips, bomb crates to NOT disturb,
multi-package chains where one package's landing platform is another's counterweight.

**Physics:** verlet particle ropes (8–14 segments each) with distance constraints, packages as
point-mass + rotation driven by attachment points, balloons as inverse gravity. Rope render
with sag, tension whitening near snap, and a real fray animation at the cut point. Cutting =
segment removal where the swipe crosses. This is proven, cheap, and spectacular.

**Juice:** slow-mo on the final cut of each package, rope twang + recoil whip on snap, tension
creak when a rope bears full weight, package face (worried eyes while swinging, relieved on
landing), confetti cannon on truck landing, dent stars on hard impacts, combo popup for
one-swipe multi-rope cuts ("DOUBLE SNIP!").

**Meta:** the courier company: delivered packages fill a **shelf of curiosities** — each level's
package is themed (piano, aquarium, wedding cake, grandfather clock) and lands on the title
screen shelf as a collectable with a one-line gag description. Upgrades: Sharper Blade (cut
through 2 ropes in one swipe), Bubble Wrap (+1 dent), Slow-Mo Charge, Magnet Truck. Save key
`ttg_cutloose`.

**Analytics:** standard trio + `package_delivered {value: dents}` and `upgrade_bought {value}`.

**Extension runway:** chains (uncuttable, reroute instead), elastic bungees, cats that sit on
packages, water levels where packages float, co-op-style double-truck levels — rope systems
compose combinatorially, so level variety is near-free.

**Projected stats** — CPI $0.30–0.55 · D1 49% · D7 18% · D30 6.5% · Session 9 min ·
Sessions/DAU 4.5 · ARPDAU $0.10–0.16 · LTV(90d) $0.70 · Year-1: 7–13M downloads, $5–8M net

---

## Why physics-first is the wave-4 bet

1. **Self-demonstrating creatives** — a sand pile forming, a boat listing, a rope snapping need
   zero explanation; the research's 3-second rule is satisfied by the simulation itself.
2. **Failure is the content** — capsizes, contaminated jars and dropped pianos are funny, and
   fail-forward comedy is the retry engine the research ties to near-miss compulsion.
3. **Material systems are live-ops engines** — every new grain type, cargo shape or rope
   variant is a content drop that composes with everything already shipped, which is the
   cheapest long-term retention runway in the genre.
4. **Juice ceiling** — physics reacts to *everything*, so polish compounds: the same creak,
   shimmer and wobble systems deepen every level instead of being spent on one setpiece.

Verification bar (all three): the wave-3 test battery (hostile boot, 180-frame pump, canvas
sizing, mobile checks) **plus a physics soak test** — sand must never leak through shelves,
the ship must reach equilibrium from any legal cargo state, ropes must never explode (constraint
solver stays bounded) — and a winnability sim across 20+ levels.
