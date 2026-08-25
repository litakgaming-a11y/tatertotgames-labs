# TaterTot Games Labs — Wave 6: Three Genre-Mashups

Three games in the military / medieval / pirate space, each one a **deliberate collision of genres
that don't normally share a screen**, and each built on a physics idea the portfolio hasn't used.

| # | Game | Theme | Genres fused | New physics |
|---|---|---|---|---|
| 22 | **Broadside Baron** | Pirate | Rhythm + naval artillery + roguelite voyage + crew drafting | Ship roll as a *playable metronome* |
| 23 | **Siege Pile** | Medieval | Ragdoll physics + horde siege + emergent level design | Bodies pile into climbable terrain |
| 24 | **Chopper Drop** | Military | Flight-lite + tethered pendulum load + extraction arcade | Swinging winch cargo with real inertia |

The platform integration contract in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) applies in full. Game
files live at **`games/<slug>/play.html`** (no `index.html` — detail pages are generated separately).

**Tone guardrail across all three:** stylized, chunky, bloodless. Pirates are cartoon rogues,
knights are clanking tin-can armour, soldiers are toy-like. No gore, no blood, no human suffering
— hits are comic *bonks*, *clangs* and *splashes*. Destruction reads as slapstick spectacle, which
is both broadly distributable and a better fit for the portfolio's art language.

---

## 22. 🏴‍☠️ Broadside Baron — *the swell is the metronome*

**Hook (the ad):** *Fire at the top of the swell.* Your ship rolls on the waves, and the roll
physically aims your cannons. Fire at the crest and the whole broadside lands as one devastating
volley; fire off-beat and your shots plough into the sea.

**The innovation:** rhythm games use an abstract beat. Here the beat is **physical and visible** —
the ocean swell rolling your hull. You are not matching a timing bar; you are reading the sea. It
teaches itself in one wave cycle and never needs a tutorial.

### Core loop (40–70s duels)

Side view. Your galleon holds the left, an enemy ship the right, both riding a procedural swell.
Your hull **rolls with the wave**, and cannon elevation follows the roll — up at the crest, down in
the trough.

- **TAP to fire a broadside.** Every cannon on the hull fires in a fast sequence (a physical
  drumroll). Fire near the crest and shots arc far and hit hard; fire in the trough and they fall
  short with a *plop*.
- **PERFECT VOLLEY** — firing within a tight window at the apex — collapses the sequence into a
  single simultaneous roar: massive screen shake, a smoke wall down the whole hull, and doubled
  damage. This is the skill ceiling.
- **HOLD to brace** — trades your next shot for a stabilised hull, letting you fire on your terms
  when the sea gets rough. A real risk/reward valve.
- Enemy ships fire back on their own swell; you can see their gunports run out, so incoming volleys
  are readable and dodgeable by **swiping to change range** (close/far bands) rather than steering
  freely.
- Damage is **positional**: hits to the waterline flood and list the ship, hits to masts drop sails
  and slow it, hits to the deck kill crew. Sink the enemy before they sink you.

### Escalation

Waves become genuinely rougher (bigger amplitude, choppier double-swell) so timing gets harder.
Then: two-ship engagements, a fire-ship that must be sunk before it drifts into you, fog banks that
hide the enemy's gunports (fire on sound alone), a kraken-tentacle hazard that grabs the hull and
holds your roll off-beat, and every 5th battle a **Man-o'-War** with three gun decks and a
staggered volley pattern.

### The roguelite layer (the addictive spine)

Each run is a **voyage across a branching map** — pick your next port: battle, merchant (spend
plunder), storm (risk/reward), or a derelict (free crew, maybe cursed). Between battles you draft
**crew cards** that stack:
- *Powder Monkey* — faster reload, smaller perfect window
- *Bosun* — wider perfect window
- *Chain Shot* — shots that shred masts
- *Carpenter* — repairs between fights
- *Kraken's Luck* — every 5th shot doubles

Runs are 8–12 ports, ~10 minutes, and end in a run summary. **Death is expected** — plunder carries
over into the permanent meta.

### Meta layer

**Your Port** — a home harbour on the title screen that rebuilds with plunder across ~12 stages
(docks, tavern, shipwright, cathedral, lighthouse). Permanent upgrades: Hull Timbers, Powder
Quality (perfect-window width), Crew Quarters (start every run with an extra card), Spyglass
(telegraph enemy volleys earlier). Ship skins unlocked by voyage milestones.

**Juice:** cannon smoke that rolls down the hull in sequence, muzzle-flash lighting the sails,
splintering hull planks, sails that tear and flap, water columns from near-misses, a rising *creak*
that pitches with your roll angle, and a slow-motion final broadside on the killing blow with the
camera pushing in as the enemy ship breaks its back and slides under.

**Analytics:** standard trio + `port_reached {value: portIndex}`, `run_ended {value: portsCleared}`,
`upgrade_bought {value}`. Save key `ttg_broadside`.

**Projected stats** — CPI $0.40–0.65 · D1 **51%** · D7 **20%** · D30 **8%** · Session **14 min** ·
Sessions/DAU **4.8** · ARPDAU $0.15–0.23 · LTV(90d) **$1.05** · Year-1: **6–11M downloads, $7–12M net**

---

## 23. ⚔️ Siege Pile — *your own army becomes the ramp*

**Hook (the ad):** *Fling knights at the wall. They pile up. The pile becomes the ladder.*

**The innovation:** most siege games give you a ladder. Here **the terrain is emergent** — every
knight you launch that fails to make it over lands, tumbles, and *stays*, forming a physical heap
of armour. The heap is climbable. So a "failed" throw is never wasted: it is construction material
for the next one. The level literally builds itself out of your mistakes.

### Core loop (30–50s assaults)

Side view. Your catapult sits left; a castle wall stands right, with the gate objective on top.

- **DRAG BACK AND RELEASE** to launch a knight — a proper articulated ragdoll (torso, limbs,
  helmet) that tumbles, clangs and bounces.
- Knights that clear the wall land inside and count toward the capture quota.
- Knights that fall short **pile at the base** — ragdolls settle into a heap, and the heap is solid
  collision. Launch into the heap and later knights *skip off it*, gaining height.
- **Landed knights get up.** After a beat, a piled knight stands, braces, and becomes a stable step
  — so the pile visibly organises itself into a ramp with little armoured figures bracing under
  each other. Comic, not grim.
- **TAP mid-flight** for a *tuck* — the knight balls up, reducing drag and bouncing higher off the
  pile. The timing skill on top of the aiming skill.
- Limited knights per assault. Capture the quota before you run out.

### Escalation

Defenders appear on the battlements and **shove piles over** (your ramp is not safe), boiling oil
makes a section of wall slippery, archers knock knights mid-flight (tuck to dodge), a moat swallows
short throws entirely (no pile forms — real punishment), drawbridges open and shut, and every 5th
castle is a **keep** with a portcullis that only opens when three knights land on a pressure plate
simultaneously — which forces you to build a pile *and* time a burst.

### Meta layer

**The Warband** — your roster on the title screen. Knights come in types drafted between sieges:
*Heavy* (poor arc, huge pile mass), *Tumbler* (bounces further), *Grappler* (sticks to walls,
becomes a permanent step), *Standard-Bearer* (nearby piled knights stand up faster). Upgrades:
Catapult Tension, Tuck Window, Extra Knight, Pile Stability. Captured castles fill a **conquest
map** that fills in as you advance.

**Juice:** armour clangs pitched by impact energy, helmets that pop off and roll, dust plumes on
landing, a *huzzah* chorus that swells with the pile height, slow-motion on the knight that clears
the wall, banners unfurling on capture, and a satisfying settling *clatter* as a pile compacts.

**Analytics:** standard trio + `castle_captured {value: knightsUsed}`, `upgrade_bought {value}`.
Save key `ttg_siegepile`.

**Projected stats** — CPI $0.28–0.48 · D1 **53%** · D7 **19%** · D30 **7.5%** · Session **11 min** ·
Sessions/DAU **5** · ARPDAU $0.13–0.19 · LTV(90d) **$0.88** · Year-1: **9–16M downloads, $6–11M net**

---

## 24. 🚁 Chopper Drop — *everything you carry fights you*

**Hook (the ad):** *The load swings. The clock runs. Fly anyway.* A rescue chopper on a winch
cable, and the thing dangling underneath has real inertia — it swings, it pendulums, and it will
absolutely drag you into a rock face if you fly like an idiot.

**The innovation:** the tension isn't the enemy fire, it's **the physics of your own cargo**.
Tethered-load dynamics turn every course correction into a negotiation with momentum. Nothing else
in the casual space makes the *payload* the antagonist.

### Core loop (40–60s extractions)

Side-scrolling canyon/base. You fly a chopper with simple one-finger control: **drag to steer**
(the chopper tilts toward your drag and accelerates — no throttle to manage).

- A **winch cable** hangs below with a hook. Fly over a stranded squad member and they grab on;
  now their mass swings under you as a real pendulum.
- **Damping is a skill**: fly *into* the swing to kill it, fly with it to amplify. Advanced players
  deliberately pendulum a load to swing it over an obstacle — the skill expression ceiling.
- **TAP to winch in/out** — a shorter cable is stiffer and easier to control but hangs lower for
  pickups. Constant tactical adjustment.
- Extract the quota and reach the LZ before the fuel gauge empties. Ground fire (tracer arcs, not
  gore) damages the hull; three hits and you autorotate down.
- **Cargo variety changes the physics**: a light medic swings fast, a heavy crate barely moves but
  drags you down, a fuel drum *explodes* if slammed into terrain, and a stretcher hangs from two
  cables and refuses to rotate.

### Escalation

Narrow canyons where the swing arc barely fits, crosswinds that push the load, night extractions
lit only by your searchlight, collapsing structures, a rising flood, and every 5th mission a
**convoy escort** — a long run where you ferry loads back and forth under sustained pressure while
the fuel clock never stops.

### Meta layer

**Forward Base** — rebuilt across ~12 stages with salvage (helipad, hangar, radar, fuel depot,
barracks). Upgrades that change the sim: Cable Damping (tames the swing), Fuel Cell, Hull Plating,
Winch Speed. **Rescued personnel** persist as a roster on the base — named, with a rescue count —
which is the nurture hook that makes losing one sting.

**Juice:** rotor wash that flattens grass and kicks dust, the cable visibly taut vs slack, load
shadow on the ground for depth, a rotor thrum that pitches with tilt, warning klaxon as fuel runs
low, screen-edge vignette under fire, slow-motion on the LZ touchdown, and rescued figures giving a
thumbs-up as they pile out.

**Analytics:** standard trio + `extraction_complete {value: rescued}`, `upgrade_bought {value}`.
Save key `ttg_chopper`.

**Projected stats** — CPI $0.38–0.60 · D1 **49%** · D7 **19%** · D30 **7.5%** · Session **12 min** ·
Sessions/DAU **4.6** · ARPDAU $0.14–0.21 · LTV(90d) **$0.92** · Year-1: **6–11M downloads, $6–10M net**

---

## Why these three

1. **Each fuses genres that don't normally coexist**, so none of them has a direct competitor to be
   compared against — the portfolio's core anti-clone strategy.
2. **Each has a physical hook that is self-demonstrating** in three seconds: a ship rolling on a
   wave, knights piling into a ramp, a load swinging under a chopper.
3. **Each has a built-in content runway** — crew cards, knight types, cargo types. New content
   composes with everything already shipped rather than requiring new systems.
4. **Broadside Baron adds the portfolio's first roguelite run structure**, which is the strongest
   known session-length and return-rate driver in mid-core hybrid — worth testing once in the arena.

### Verification bar (all three)

The standard battery (hostile boot, 180-frame pump, canvas sizing, mobile checks) **plus a physics
soak** appropriate to each: *Broadside* — swell phase stays bounded and the perfect window is
reachable at every sea state; *Siege Pile* — ragdoll piles reach stable equilibrium (no jitter,
no sinking through terrain, bounded joint forces) and piles are reliably climbable; *Chopper Drop*
— tether never explodes under any flight input, load can always be damped to rest, and fuel/quota
tuning leaves every mission winnable. Plus a winnability sim across 20+ levels for each.
