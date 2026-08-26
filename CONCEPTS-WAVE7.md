# TaterTot Games Labs — Wave 7: The Glimmerwild

Three games in one **original creature-collection universe**, each reinventing a different pillar
of the genre. Not a Pokémon derivative — original creatures, original world, original names — so
these are actually shippable and testable. The genre conventions (catch, type, evolve, collect) are
the design language; everything on screen is ours.

| # | Game | Pillar reinvented | The new mechanic |
|---|---|---|---|
| 25 | **Morphforge** | Evolution | You *sculpt* the creature — its body is procedurally generated from what you feed it |
| 26 | **Weatherwright** | Battling | You never command the creature; you command the **arena** |
| 27 | **Snapcatch** | Catching | You catch by **framing the perfect instant**, not by throwing anything |

## The shared universe

**The Glimmerwild** — a world where light pools into living things. Creatures are called **Glims**.
Seven essences: **Ember, Tide, Verdant, Stone, Spark, Gloom, Gale**. Essence relationships form the
type chart, and all three games read from the same seven-essence palette so the universe feels
continuous across the arena.

Art language: chunky, bright, rounded — the portfolio house style. Glims are friendly and
expressive, closer to soft toys than to monsters. **Nothing dies anywhere in this universe**: a
defeated Glim curls up, sparks out and returns to light. Combat is a contest of essence, not
violence. This is a design guardrail, not just a rating concern — it keeps the whole world warm,
which is what makes the collection worth caring about.

The platform integration contract in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) applies in full. Game
files live at **`games/<slug>/play.html`** (no `index.html` — detail pages are generated separately).

---

## 25. 🥚 Morphforge — *you sculpt the evolution*

**Hook (the ad):** *Feed it. Shape it. No two are ever the same.* An egg cracks, and what climbs out
is built from exactly what you poured into it.

**The innovation:** every creature-collector on the market hands you a fixed evolution line — level
15, becomes the pre-drawn thing. Here **the creature's body is procedurally generated from the
player's own input**. Drip Ember into the shell and it grows heat-vents and a flame crest; drown it
in Tide and it grows fins and a translucent hide; mix Stone and Gale and you get something with
slate plating and long glider membranes. The result is a genuine creation, not a lookup.

### Core loop (40–70s hatches)

A Glim egg floats in the forge. Around it sit seven essence spouts.

- **DRAG an essence onto the egg** to pour. A live meter shows the current blend, and the shell
  visibly reacts — veins of colour crawl across it, it pulses, it grows warm or frosts over.
- **The shell has a capacity and a stress limit.** Pour too much too fast and hairline cracks
  appear; keep pouring and it shatters (the Glim hatches early, small and wobbly — a *lesser*
  outcome, never a loss). Push the stress bar to the edge without breaking it and you hatch a
  **Radiant** with a visible shimmer.
- **TAP to knead** — redistributes stress away from a crack, buying you room for one more pour.
  The timing/skill layer on top of the blending.
- Hatch when you choose. The longer and more daringly you push, the rarer the result.

**Procedural morphology:** the essence blend maps onto body parameters — silhouette, limb count,
crest type, texture, eye shape, palette, particle aura. The generator must be built so the mapping
is *legible*: a player who pours mostly Ember should be able to see the Ember in the result and
predict it next time. Discovery, not randomness.

### Escalation

Later forges add: **unstable essences** that fight each other (Ember + Tide crack faster, but a
successful blend makes a rare Steam-lineage Glim), **timed spouts** that only run for a few
seconds, a **resonance meter** that rewards alternating essences in rhythm, and **relic shells**
with pre-existing cracks that demand careful kneading from the first drop.

### Meta layer

**The Menagerie** — every Glim you hatch lives on the title screen, wandering a grove, drawn with
its actual generated body. A **Codex** records discovered *traits* (not species): "Slate Plating",
"Glider Membrane", "Ember Crest" — so collection is about discovering the trait space itself.
Upgrades: Shell Tempering (higher stress limit), Steadier Pour, Knead Window, Essence Purity.
**Breeding**: two hatched Glims can be combined, blending their parameter vectors — infinite
depth for free.

**Juice:** liquid essence with real flow and pooling, veins crawling across the shell, the shell
pulsing to a heartbeat that quickens with stress, cracks propagating with audible snaps, and a
hatch sequence with slow-motion, a light burst, and the new Glim shaking itself off and blinking
at you. Radiant hatches get a full-screen bloom and a chord.

**Analytics:** standard trio + `glim_hatched {value: rarity}`, `trait_discovered {value}`,
`upgrade_bought {value}`. Save key `ttg_morphforge`.

**Projected stats** — CPI $0.30–0.50 · D1 **55%** · D7 **23%** · D30 **10%** · Session **13 min** ·
Sessions/DAU **5.4** · ARPDAU $0.16–0.24 · LTV(90d) **$1.15** · Year-1: **9–15M downloads, $9–15M net**

*Highest projected D30 and LTV in the portfolio: a collection of things the player personally made
is far stickier than a collection of things they were given.*

---

## 26. 🌩️ Weatherwright — *command the arena, not the creature*

**Hook (the ad):** *You don't tell it how to fight. You change the world it fights in.*

**The innovation:** every battler in the genre is a menu of commands. Here your Glim fights on its
own instincts and **your only input is the battlefield**. Call rain and the Tide Glim surges while
the Ember one gutters; crack the ground and Stone gains footing; summon a gale and light creatures
are blown off their line. You are the weather, and the fight reads as a consequence of your choices
rather than a list you picked from.

### Core loop (45–75s duels)

Two Glims auto-battle in an arena. Around the edge sit **weather runes** you can trigger.

- **TAP a rune** to change the arena: Rain, Sun, Gale, Quake, Fog, Nightfall, Bloom. Each has a
  cost from a shared **Sky Meter** that refills over time, so weather is a resource, not a spam.
- Conditions **stack and interact**: Rain + Spark = a conductive field that chains lightning; Sun +
  Verdant = explosive overgrowth; Gale + Fog clears the fog instantly (a counter, not a combo).
  Learning the interaction table is the mastery curve.
- Your Glim's instincts respond visibly — it changes stance, its attacks change shape, it presses
  or retreats. **Reading your own creature is half the skill.**
- The opponent's Wright fights back, calling their own weather, so it's a duel of conditions with a
  visible tug-of-war over which essence currently dominates.
- **DRAG a rune onto the arena** to place it as a localised zone rather than global weather — a
  puddle, a patch of sun — for players who want finer control.

### Escalation

Champions with signature weather that resists yours, arenas with fixed hazards (a volcano vent that
makes Ember permanent), **Sky Meter drought** stages where weather is scarce, dual-Glim battles, and
every 5th fight a **Stormcaller** boss whose weather actively fights yours in real time.

### Meta layer

**The Almanac** — every weather interaction you discover is recorded as an illustrated entry, which
is the real collection here: you are collecting *knowledge*. A team of Glims (imported in spirit
from the Glimmerwild essence palette) each with instincts that suit different conditions, so team
selection is really weather-strategy selection. Upgrades: Sky Meter capacity, refill rate, rune
duration, and a second rune slot.

**Juice:** full-screen weather transitions with palette shifts, rain that actually beads and runs,
lightning that forks along conductive fields, quake screen-shake with ground fracture, sun-shafts,
fog that genuinely occludes, and a slow-motion decisive blow when a weather combo lands perfectly.
The arena is the spectacle.

**Analytics:** standard trio + `interaction_discovered {value}`, `duel_won {value: skyUsed}`,
`upgrade_bought {value}`. Save key `ttg_weatherwright`.

**Projected stats** — CPI $0.40–0.65 · D1 **50%** · D7 **20%** · D30 **8.5%** · Session **12 min** ·
Sessions/DAU **4.7** · ARPDAU $0.15–0.22 · LTV(90d) **$1.00** · Year-1: **6–11M downloads, $7–12M net**

---

## 27. 📸 Snapcatch — *catch the instant, not the creature*

**Hook (the ad):** *You don't throw anything. You just have to be looking at the right moment.*

**The innovation:** catching is universally a throw plus a dice roll. Here you catch by
**photographing a Glim at the peak of a spectacular action** — mid-leap, mid-flare, mid-splash. The
catch strength is the *quality of the shot*: how centred, how close, how well-timed to the peak
instant, and whether you caught a rare behaviour. It converts a slot-machine into a skill.

### Core loop (30–50s expeditions)

A living scene — a glade, a tide pool, a stormy ridge — with Glims going about their business.

- **DRAG to pan** the viewfinder across the scene; **PINCH or tap-hold to zoom**.
- Glims perform **telegraphed actions**: a Tide Glim gathers itself, then breaches. A Spark Glim
  crackles, then discharges. Each has a *peak frame* — a few tenths of a second where the action is
  at its most spectacular.
- **TAP THE SHUTTER** at the peak. The game grades the shot live: **Framing** (centred, filling the
  frame), **Timing** (distance from the peak instant), **Rarity** (was it a rare behaviour?), and
  **Composition bonuses** (two Glims in frame, a reflection, a silhouette against lightning).
- Score maps to catch strength — a great photo befriends the Glim on the spot; a poor one just
  spooks it. **You are never punished with failure, only with a worse photograph.**
- **Lures** placed with a drag can provoke specific behaviours, so a patient player can set up a
  shot rather than wait for one.

### Escalation

Weather that changes behaviour, nocturnal Glims that need the flash (which startles others), skittish
species that flee if you zoom too fast, **legendary Glims that appear once per expedition with a
single peak frame**, and photo *contracts* ("bring back a Gale Glim mid-flight, in silhouette").

### Meta layer

**The Album** — the actual photographs you took, saved and re-rendered, with their grades and
captions. This is the strongest collection artifact in the portfolio: it is not a list of what you
own, it is a gallery of things **you personally captured well**. Filling a species' page requires
photographing each of its behaviours. Upgrades: Zoom Range, Shutter Window, Lure Potency, Film
(more shots per expedition).

**Juice:** viewfinder overlays with focus rings and a live grade readout, bullet-time on the peak
frame as the shutter fires, a real shutter *clack* and film advance, the developed photo sliding
into frame with its grade stamped on, confetti for a first-ever perfect shot, and Glims that react
to being photographed — some pose, some flee, some come closer.

**Analytics:** standard trio + `photo_taken {value: grade}`, `species_completed {value}`,
`upgrade_bought {value}`. Save key `ttg_snapcatch`.

**Projected stats** — CPI $0.30–0.50 · D1 **52%** · D7 **21%** · D30 **9%** · Session **12 min** ·
Sessions/DAU **4.9** · ARPDAU $0.13–0.20 · LTV(90d) **$0.98** · Year-1: **8–14M downloads, $7–12M net**

---

## Why these three

1. **Each reinvents a pillar rather than reskinning one.** Evolution becomes sculpting, battling
   becomes environmental control, catching becomes photography. None has a direct competitor.
2. **All three make the collection personal.** A Glim you shaped, a weather interaction you
   discovered, a photograph you framed — these are player-authored artifacts, which is a materially
   stronger retention hook than a list of acquired items. That is why Morphforge carries the
   portfolio's highest D30 and LTV projections.
3. **They share a universe.** Seven essences, one art language, one tone — so the three read as a
   world rather than three unrelated prototypes, and any one that wins can absorb the others'
   systems as features.
4. **Infinite content for free.** Procedural morphology, an interaction table, and behaviour-based
   photo targets all generate their own long tail without new art per item.

### Verification bar

Standard battery (hostile boot, 180-frame pump, canvas sizing, mobile checks) **plus**:
*Morphforge* — the essence→body mapping is deterministic and legible (same blend gives the same
creature; neighbouring blends give visibly related creatures), the stress model never soft-locks,
and no blend produces a degenerate/invisible body. *Weatherwright* — the interaction table is
consistent and every duel 1–25 is winnable with correct weather play; auto-battle never stalls.
*Snapcatch* — grading is deterministic for a given frame, peak windows are always reachable, and
every species' behaviours are all photographable.
