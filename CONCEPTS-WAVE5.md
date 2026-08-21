# TaterTot Games Labs — Wave 5: Return Fire

One concept, built around a single inversion: **a war game with no weapon.** Every other game in
the war/shooter space hands you a gun. This one hands you a shield and lets the enemy army supply
all the ammunition — you just decide where it goes.

New physics class for the portfolio: **reflection dynamics with momentum transfer.** Not a
bounce-off (Bloom Drop), not a beam (Beam Team), not a swing (Kaboom Crane) — a live angular
deflection where *how fast you swipe* is imparted into what you deflect. The shield is a moving
surface, and momentum is conserved from your hand into the projectile.

The platform integration contract in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) applies in full, with
the wave-4 file convention: the game is **`games/return-fire/play.html`** (no `index.html` — the
detail page is generated separately).

---

## 21. 🛡️ Return Fire — *reflection dynamics + momentum transfer*

**Hook (the ad):** *They brought the ammo. You just aim it back.* A wall of incoming fire, one
shield, and every shot you deflect detonates the machine that fired it. The first three seconds of
play are the entire pitch.

**The fantasy:** you are the last defense core on a scrap-heap horizon, surrounded by a machine
army — drone swarms, turret walls, mortar walkers, siege mechs. They are all made of metal and
bad intentions. **You have no gun and never get one.** Your entire arsenal is their arsenal,
returned with interest.

### Core loop (35–60s waves, escalating to boss phases)

Your **core** sits center-bottom. A **shield** orbits it at a fixed radius, and your finger
controls it directly: drag anywhere and the shield snaps to that angle around the core with a
touch of spring lag (it has weight). Enemies ring the arena and fire inward.

**Deflection is the whole game, and it is real physics:**
- Angle of incidence = angle of reflection off the shield's surface normal.
- **Your swipe velocity is added to the reflected projectile.** A stationary block returns a shot
  softly. A hard flick sends it back *screaming*, glowing hot, with a bigger hit.
- A **PERFECT PARRY** — deflecting within ~120ms of impact while moving *into* the shot — triggers
  a freeze-frame, a white flash, bullet-time, and a 2.5x damage multiplier. This is the skill
  ceiling and the dopamine core.
- Anything you fail to deflect hits your core. Three hits and the wave is lost (retry free).

**Deflected shots damage whatever they hit.** Kill the turret that shot at you with its own shell.
Ricochet a rocket off a drone into the mech behind it — chains pay escalating combo multipliers
with a rising pitch ladder. Some enemies must be killed with *their own* ammo type (armored mechs
only crack to their own mortar rounds), which turns target selection into a real decision.

**Projectile types**, each with distinct physics and its own deflection feel:
- **Bullets** — fast, straight, cheap. The bread and butter.
- **Rockets** — slow, homing-ish, huge blast radius on return. Deflecting one into a cluster is
  the money shot.
- **Saw blades** — bounce off walls and keep going; they ricochet several times, so a deflection
  can pinball through half the arena.
- **Energy orbs** — must be *held* on the shield (hold to charge, release to launch) — the only
  projectile that rewards patience instead of reflex.
- **Mortars** — arc in from off-screen with a telegraphed shadow; deflect at the apex.

### Escalation (the intensity curve)

Waves ramp density and add mechanics, but the tension is engineered rather than merely faster:
1. Waves 1–3: single-side fire, generous timing, teaches angle.
2. Waves 4–8: two-side crossfire, saw blades introduced, first combo chains.
3. Waves 9–15: 360° encirclement, rockets, armored enemies needing matched ammo.
4. Every 5th wave: a **BOSS** — a siege mech with a bullet-hell pattern and an armored core that
   only opens after you return three of its own mortar rounds. Boss phases shift pattern at 66%
   and 33% health, and the arena palette shifts with them.
5. **Overheat:** deflect 8 shots without taking a hit and the shield goes **CRITICAL** — glowing
   white, every deflection is an auto-perfect for 4 seconds, screen saturates, audio filter opens.
   This is the release valve at the top of the intensity curve.

### Juice bar (this is the juice-first concept — spend the budget here)

- **Freeze-frame** (2–3 frames) on every perfect parry, longer on boss hits.
- **Bullet-time** at 0.25x for ~400ms on a perfect parry that kills, with a pitch-drop on the
  whole audio bus and a chromatic-aberration ring.
- **Screen shake** scaled by impact energy; **directional shake** away from the impact point.
- Shield **impact flash** with a hexagonal ripple that propagates around the shield surface.
- Deflected projectiles are visibly **hotter** than incoming ones: brighter core, longer trail,
  heat-haze wobble, and a rising whistle whose pitch tracks the speed you gave it.
- **Combo ladder** with rising pitch per link, a growing screen vignette, and a counter that
  physically shakes at high combos.
- Enemy deaths: metal shriek, spinning scrap chunks with gravity, secondary explosions, and a
  brief silhouette flash of the enemy before it comes apart.
- **CRITICAL mode**: full-screen bloom, white shield trail, audio low-pass sweeping open, haptic
  pulse train.
- Kill-cam: the final enemy of a wave dies in slow motion with the camera pushing in slightly.

**Audio is half the juice** and must be fully synthesized: metallic shield clang whose timbre
varies with impact angle, a pitch-rising whistle per deflected shot, layered explosion (noise
burst + low sine drop), combo pitch ladder, a bass drone that rises with wave intensity, and the
low-pass filter sweep for CRITICAL.

### Meta layer (the hybrid runway)

**The Bastion** — a fortress on the title screen that rebuilds as you progress. Scrap salvaged
from destroyed enemies raises walls, towers, banners and beacons across ~12 build stages, and the
scene shows the machine army wreckage piled outside the walls.

Four upgrade tracks × 5 levels, each visibly changing the simulation:
- **Shield Arc** — a wider shield (easier deflections, but blocks your view of one flank).
- **Kinetic Gain** — more of your swipe velocity transfers into the reflection.
- **Core Plating** — a fourth hit before the wave is lost.
- **Overheat Charge** — CRITICAL triggers at 6 deflections instead of 8.

**Shield skins** unlocked by milestones (Riot, Aegis, Scrapplate, Solar, Mirror), each with its own
particle signature and clang timbre.

**Extension runway (why this can carry a long-term hybrid):** the deflection verb composes with
*any* new projectile or enemy — elemental rounds (fire rounds ignite the shooter, ice rounds
freeze it in place), shield modules (concave shield focuses a returned shot into a laser, sticky
shield catches and throws), boss roster expansion, endless "siege" mode with leaderboards, daily
assault contracts, and a prestige loop that resets waves for permanent Bastion bonuses. Every one
of those is a content drop that composes with everything already shipped — the same live-ops
economics that make the wave-4 material systems attractive, applied to a combat verb.

**Tone guardrail:** every enemy is a **machine** — drones, turrets, walkers, mechs. No human
figures, no gore; deaths are scrap explosions and spinning bolts. This keeps it broadly
distributable, matches the portfolio's chunky bright art language, and makes destruction read as
comedic spectacle rather than violence.

**Analytics:** standard trio (`level_start`, `level_complete{level,value:wave}`, `game_over{level}`)
plus `wave_cleared {value: combo}` and `upgrade_bought {value}`. Save key `ttg_returnfire`.

**Projected stats** — CPI $0.35–0.60 · D1 **54%** · D7 **21%** · D30 **8.5%** · Session **13 min** ·
Sessions/DAU **5.2** · ARPDAU **$0.16–0.24** · LTV(90d) **$1.10** · Year-1 at scale:
**7–13M downloads, $8–14M net**

*Why the highest LTV projection in the portfolio:* combat games monetize rewarded video harder than
puzzle games (continue-after-death, 2x scrap, boss retry), the boss cadence creates natural
session bookends, and the prestige loop gives whales somewhere to go — while the deflection hook
keeps CPI in casual territory rather than midcore.

### Verification bar

The wave-3 battery (hostile boot, 180-frame pump, canvas sizing, mobile checks) **plus a combat
soak**: with hundreds of projectiles across many waves, assert no NaN positions, projectile count
stays bounded (pooling holds under boss patterns), deflection reflection is physically correct
(outgoing angle mirrors incoming across the surface normal within tolerance), no projectile
tunnels through the shield at maximum speed (swept collision, not point sampling), and every wave
1–25 is survivable by a reference auto-parry bot.
