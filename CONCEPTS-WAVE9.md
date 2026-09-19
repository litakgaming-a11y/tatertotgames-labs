# TaterTot Games Labs, Wave 9: Overwind & Rabble

Two games on one engine: **Overwind**, where you operate the machine, and **Rabble**, where you
command the army that goes in it.

The arena's **first 3D game**, and a playable cut of the reconceived catapult from the Siege Pile
design work (`docs/SIEGE-PILE-GDD.md` §7 and the `siege-pile` repo's `docs/CATAPULT-3D.md`).

That document's argument is that a catapult with three sliders and a clean parabola is dishonest:
the ragdolls in Siege Pile are simulated and the machine throwing them was not. **Overwind is the M1
cut of the fix**, the machine, the cone of doubt, and single-vs-multi payloads. Siting on an open
ring and counter-battery fire are deliberately out of scope here.

New physics class for the portfolio: **a simulated siege engine**. Not a launcher that resolves
(angle, power) to a curve, a rig with tension, recoil, ground settling and a rope that breaks, where
every bit of scatter is a consequence of machine state rather than a random number added afterwards.

Rendered in raw WebGL, no libraries, single self-contained file, as with every other game here.

---

## 29. ⚙️ Overwind, *simulated siege engine × emergent terrain × the honest preview*

**Hook (the ad):** *The machine is the mistake.* A crew winds a catapult, the rope creaks, the frame
lifts at the front, and snaps. The arm flails, the crew scatter, and the knight is dumped three
metres in front of his own machine, where he stands up and looks at the camera.

**The fantasy:** you are not an artillery officer with a firing solution. You are a person operating
a large wooden object that is doing its best.

### Core loop (a siege is 30–60s)

**One continuous gesture does everything.** Hold anywhere to wind; the ratchet clicks accelerate, the
rope creaks, the frame strains. Drag while holding to swing the turntable and set the arc. Release to
fire. That single gesture carries the whole risk curve: more tension throws further, widens the
landing ellipse, and brings you closer to the rope.

- **No power slider.** Muzzle speed comes out of the rig's actual tension, and the launch angle out
  of how far the frame has settled into the ground.
- **The cone of doubt** is the aiming preview: a translucent ellipse laid on the ground, not a dotted
  arc. It widens with tension, crosswind, soft ground and payload count. **It is computed by the same
  integrator that flies the lad**, same fixed 1/120 step, same drag, same wind.
- **Overwind and the rope snaps.** Machine down for a couple of seconds, crew launched, payload
  dumped at your feet. You are not damaged, you are embarrassed.
- **Lads who fall short heap up.** They freeze, rasterise into a heightfield, and the heap slumps by
  angle-of-repose relaxation into a ramp at the foot of the wall.
- **One lad or three.** A single body is a precision slug; three are grapeshot that tumble together
  and collide with each other in flight.
- **Three emplacements** rotate by siege, turf is honest, mud sinks the frame a little further with
  every shot so your range quietly shortens, rock is rigid and recoils hard.

### What was measured, not asserted

The premise of this whole family of games is that failure is productive. That is a claim, so it was
tested in a headless browser rather than believed:

| Measurement | Result |
|---|---|
| Lowest tension that clears the wall on **virgin ground** | **0.80** |
| Same measurement with a **1.95 m heap** of your own casualties at the wall foot | **0.68** |
| Soak: 6,000 frames with firing and rope snaps | 0 NaN, 0 negative cells, 0 frame errors |
| Skill curve | below ~0.80 always falls short; over-lofting past ~1.0 rad always falls short |

**A 15% cut in the power you need, bought with the bodies of the lads who failed.** That number is
the game.

Two real bugs were caught by that harness and would not have been caught by playing:

- The landing preview integrated a drag-free point at 1/60 while the sim ran damped verlet at 1/120,
  so it **predicted 40.6 where the lad actually reached 25.4**. The preview may be vague; it may not
  lie. It now walks the same arithmetic the lad walks.
- The crosswind term was applied to a displacement-per-substep with a stray ×60, making the wind
  roughly **five times heavier than gravity**. Every lad was quietly blown into the far corner of the
  map, which is where the entire pile was living.

### Juice

Ratchet clicks that accelerate with tension, rope creak past 72%, a bark on release, body thuds
scaled by impact speed, armour clang against masonry, and a sharp crack plus a descending groan when
the rope goes. Camera shake is energy-scaled. The tension bar has a hazard-striped red zone you can
watch yourself entering.

### Meta layer (what a full build would add)

Siege depth is the score. A full version adds the Workshop upgrade tracks from the design doc, frame
(survives counter-battery), windlass (winds faster), sling (tightens the ellipse core), wheels and
chocks (less settling, fewer slips), rope (raises the safe tension ceiling) and crew tier, plus the
two cut systems: **siting** anywhere on an approach ring, and **counter-battery** fire that ranges in
on you over successive shots and turns deliberation into a cost.

### MVP status

**Built and playable.** The machine, the cone, the payloads, the pile-as-terrain, three emplacements,
endless escalating sieges, persistent best. Cut for now: siting, counter-battery, the upgrade tracks.

**Projected stats**, CPI **$0.30–0.55** · D1 **47%** · D7 **18%** · D30 **7%** · Session **8 min** ·
Sessions/DAU **4.1** · ARPDAU **$0.11–0.17** · LTV(90d) **$0.72** · Year-1 at scale:
**5–10M downloads, $4–8M net**

*Why a mid-pack projection:* the rope-snap creative is strong and reads without text, but this is a
more deliberate game than the arena's reflex titles, sessions are shorter and the natural
rewarded-video moments are fewer. The upside is the upgrade meta, which has an unusually clear job:
every track visibly fixes one failure the player has personally suffered.

### Verification bar

The wave-3 battery (hostile boot, frame pump, canvas sizing, mobile checks) **plus a siege soak**:
the landing preview must agree with the actual flight within roughly a metre across the whole tension
band, the pile must measurably lower the clearing threshold, no NaN or negative cells across the
heightfield after thousands of frames of firing and snapping, and the angle-of-repose relaxation must
terminate rather than leaving the grid permanently dirty.

---

## 30. 🏹 Rabble, *warband siege × friendly fire × the useless survivor*

**Hook (the ad):** *You lead them. Loosely.* An archer looses at the castle, hits the man next to him,
and the pair of them go down in a heap while the banner flies on untouched.

Same machine as Overwind, different game. There you were an operator with a payload; here you are in
charge of **an army**, and the only order available is *you, get in the catapult*.

### What changes

- **You drag a unit out of the pen and drop it in the cup.** Nothing launches itself; the roster is
  the resource and loading is a deliberate act per shot.
- **NO BRACING, and no pile.** A body that lands is a person, not construction material. Nobody forms
  up, nobody props anybody, nothing rasterises into terrain.
- **A unit only storms the castle if it lands on the other side of the wall.** Land short and it
  stands up, mills about outside, and contributes nothing for the rest of the assault, a wasted shot
  is a man wandering in a field where you can watch him not helping.
- **Ranged units keep shooting each other.** An arrow hits whoever it touches with no side check, and
  an archer picks a friendly *on purpose* between a fifth and half the time depending on tier. Both
  halves matter: the deliberate mistake makes it frequent, the spread makes it feel like an accident.
- **The objective is capture, not breach.** Hold the banner circle against a garrison that defends the
  courtyard and cannot be baited out of it.

| Unit | Climbs the wall like | Is a hazard like |
|---|---|---|
| **Lad** | Cheap and plentiful | Shoots a friend one time in three |
| **Spear** | The nearest thing to a professional | Occasionally |
| **Archer** | Slow, fires constantly | Picks a friendly on purpose about half the time |
| **Bruiser** | Slow, enormous, flies truer than anyone | Rarely, he has no ranged weapon to misuse |

### Measured

| Test | Result |
|---|---|
| Four shots deliberately short | **4 mill, 0 storm** |
| Four shots deliberately long | **4 get inside** |
| Six archers in the courtyard | a steady stream of hits on their own side |
| Castle taken | **~2 attempts in 3** |
| Soak: 7,000 frames of loading, firing and rope snaps | 0 non-finite, 0 frame errors, bounded unit count |

The balance pass that mattered: units originally had 3–7 hp against a garrison dealing ~2.8 damage a
second, so an arrival died in about a second, faster than anyone can drag, wind and fire. Nobody
could ever have two men alive inside at once, which made *leading an army* arithmetically impossible.
Two other bugs the harness caught: the derp wobble read the rAF timestamp instead of a sim clock, so
units walked at one fixed angle off-target forever whenever the loop was driven any other way; and
the garrison spawned partly inside the wall slab, got squeezed out through the outer face, and spent
the assault stranded in the field.

**Projected stats**, CPI **$0.28–0.50** · D1 **48%** · D7 **18%** · D30 **7%** · Session **9 min** ·
Sessions/DAU **4.3** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.74** · Year-1 at scale:
**6–11M downloads, $4–9M net**

*Why close to Overwind's numbers:* same creative family and the same deliberate pace, with a slightly
better hook, friendly fire is legible in two seconds of footage and needs no setup, offset by a
longer session before the first win.

---

*Design lineage: [Siege Pile](CONCEPTS-WAVE6.md) (#23) proved failure-as-terrain in 2D;
[Cairn](CONCEPTS-WAVE8.md) (#28) takes the same premise somewhere else and is not yet built.*
