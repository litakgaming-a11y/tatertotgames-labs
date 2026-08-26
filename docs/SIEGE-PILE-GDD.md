# SIEGE PILE — Game Design Document

**From arena prototype to full mid-core physics siege game**
**v1.3 — "braced" is gone: landed units now hold Defensive Stance (shields up) and form a climbable shield roof.**
**v1.2 — city, world map AND the catapult raid are 3D. The raid conversion is specified, not yet built.**
Version 1.3 · TaterTot Games Labs · Unity 6 URP — 3D throughout

> The arena prototype ([games/siege-pile/](../games/siege-pile/)) proved the core toy: launched
> ragdoll knights that pile into climbable terrain, verified to physical equilibrium (residual
> pile motion 0.000000 u/node, 6/6 climbability, 50k+ soak frames, 0 NaN). This document scales
> that toy into a persistent castle-building siege game with PVE campaign, async PVP, deep unit
> progression, and Might & Magic-inspired economy and spellcraft — while protecting the one thing
> that makes it special: **everything is physics, everything is ragdolls, and everything is
> allowed to go hilariously wrong.**

---

## 1. Vision

**One line:** *Clash-style castle raiding where your army is a catapult-load of ragdoll idiots,
your spells sometimes backfire onto your own head, and the corpse-pile of your failures is the
ladder your next wave climbs.*

### Design pillars (in priority order)

1. **FUNNY.** Comedy is the product. Every system must be able to produce a clip-worthy accident:
   a knight bonking his own ally, a fireball boomeranging onto the mage, a Rocket Man spiralling
   into a tower and taking the whole wall with him. If a mechanic cannot fail funnily, redesign it.
2. **JUICE JUICE JUICE.** Freeze-frames, slow-mo kill-cams, pitched armour clangs, helmets that
   pop off and roll, confetti, dust, screen shake scaled by impact energy. No silent moment,
   no unanimated state change. The juice bible (§13) is a contract, not a wishlist.
3. **HIGH INTENSITY & CHAOS.** Raids are 60–120 seconds of escalating mayhem. Precision is the
   *reward of high-tier units*, never the baseline — low tiers are gloriously unreliable, and the
   spread/friendly-fire model (§6) is tuned for spectacle first, fairness second (but fairness by
   symmetry: chaos hits both sides).
4. **PHYSICS IS TRUTH.** No canned outcomes. Damage, positioning, area effects, oil spread, fire
   propagation — all resolved by the physics sim. If the pile says a knight is a stepping
   stone, he is a stepping stone.
5. **REAL STAKES.** Units die permanently in raids. Upgrades take real time. That weight is what
   makes the comedy land — you are laughing at the deaths of soldiers you spent three days
   training, and that tension is the game.

### Fantasy

You are a petty warlord in a world that takes itself far less seriously than you do. Your castle
is your pride, your army is a collection of enthusiastic morons, and every siege is a coin flip
between a masterstroke and a blooper reel.

---

## 2. The Core Cycle

```
        ┌──────────────────────────────────────────────────────┐
        │                  YOUR CITY  (3D)                      │
        │   collect resources · construct/upgrade buildings     │
        │   recruit & upgrade units · research magic            │
        └───────────────┬──────────────────────────────────────┘
                        │  pick a target
                        ▼
        ┌──────────────────────────────────────────────────────┐
        │                  WORLD MAP  (3D)                      │
        │   pinch out from the city — no screen transition      │
        │   player cities (PVP) · campaign citadels (PVE)      │
        │   resource nodes · marches travel in real time       │
        └───────────────┬──────────────────────────────────────┘
                        │  dispatch march → it arrives
                        ▼
        ┌──────────────────────────────────────────────────────┐
        │                 THE RAID  (3D physics)                │
        │   catapult + army → launch over walls → ragdoll war   │
        │   cast spells · complete objectives · loot or lose    │
        └───────────────┬──────────────────────────────────────┘
                        │  survivors come home, dead stay dead
                        ▼
                  loot → city → repeat
```

**Session shapes:**
- *Snack (2–4 min):* collect, queue one upgrade, dispatch a short march or play one raid.
- *Meal (10–20 min):* campaign push, several raids, unit upgrades, defense re-layout.
- *Idle return:* resources accrued (capped), troops finished training, shield expiring.

**Loop economics:** raids consume units (permadeath) and produce loot; loot feeds buildings and
unit upgrades; better units enable harder targets. Unit loss is the primary sink and the reason
the economy never saturates (§11).

---

## 3. The City (3D)

Your city is a **fully 3D isometric diorama** rendered in URP — the Whiteout Survival presentation.
You look down on a living settlement from a tilted orbit camera, pinch to zoom from rooftop detail
out to the whole city, and drag to pan. Villagers walk between buildings, smoke rises from the
forge, carts trundle from the mine to the storehouse, and weather rolls across it.

**This is the game's shop window.** It is where players spend their idle taps and where production
value is most visible, so it gets the highest art bar in the project.

### Camera & presentation

- **Orbit-locked isometric camera**: fixed pitch band (~40–55°), free yaw within limits, pinch zoom
  across three framing tiers — *Detail* (one building fills the screen, animations legible),
  *City* (default; whole settlement in frame), *Overview* (city + surrounding terrain, the handoff
  frame into the world map).
- **Seamless zoom-out to the world map.** Pinching past Overview does not cut to another screen —
  the camera pulls up and the world streams in around your city, exactly like Whiteout. This
  continuity is what makes the world feel like one place (§9 covers the streaming budget).
- **Time of day + weather** on a real clock: dawn/day/dusk/night lighting, rain that beads on
  rooftops, snow that accumulates on the north region's cities. Night cities glow with window
  lights and torches (URP additive lights).

### Plot-based layout

The city is a **fixed plot grid** on 3D terrain (Whiteout model, not free-placement). Buildings
occupy plots; new plots unlock with Keep level; players choose *which* building goes where among
available plots and can relocate for a fee. Decorations and paving occupy cosmetic plots.

**Crucially, the city layout is not the defense layout.** Raids are fought on a siege field (§7)
generated *from* your 3D city — wall level, tower count and their order are derived from your build,
so what you construct genuinely shapes how you are besieged. §8 details the projection.

### Buildings

Every building is a 3D model with **visible upgrade states** — silhouette, materials and animated
props change as it levels, so progress reads at a glance from the City framing.

| Building | Function | Visible progression (3D) |
|---|---|---|
| **Keep** | Account level gate; unlocks everything else | Wooden fort → stone keep → marble citadel with banners |
| **Gold Mine / Sawmill / Quarry** | Produce Gold / Timber / Stone | More wheels, carts, workers; deeper excavation in the terrain |
| **Crystal Spire / Sulfur Pit / Gem Grotto** | Rare resources (from Keep 8) | Emissive glow, smoke plumes, floating shards |
| **Barracks** | Recruit & upgrade Melee | Training yard fills with dummies, progressively destroyed |
| **Archery Range** | Recruit & upgrade Ranged | Targets with arrows in everything except the bullseye |
| **Mage Tower** | Recruit casters; research magic schools | Grows taller; orbiting rune rings per school unlocked |
| **Beast Pens → Mythic Roost** | Late-game creatures | Cage → paddock → mountaintop nest with a visible sleeping dragon |
| **Workshop** | Specialists (Rocket Man line); catapult upgrades | Increasingly unsafe-looking contraptions, test-fire smoke |
| **Walls & Towers** | Defense HP, tower slots | Palisade → stone → crenellated with hoardings and pennants |
| **Trap Forge** | Defensive traps (§8) | Oil cauldrons bubbling, bear traps stacked outside |
| **Vault** | Protects a % of loot from raids | Buried → reinforced → vault door with a comedy number of locks |
| **Tavern** | Daily quests, rumour texts, event board | Patrons multiply; a brawl animation at max level |

**Build rules:** two parallel build queues (third via premium). High-tier upgrades run hours → days.
Construction is **visibly staged in 3D** — scaffolding goes up, workers swarm it, the new silhouette
is revealed with a dust puff and a fanfare.

### Idle life (the thing that sells the city)

The city must feel inhabited when nothing is happening: villagers pathfinding between buildings,
a blacksmith hammering, guards patrolling walls, the pig from the raid objectives wandering loose,
birds, laundry, chimney smoke. Tapping a villager makes them wave and say something stupid.
This ambient layer is cheap (GPU-instanced, LOD'd, capped) and disproportionately effective.

---

## 4. Resources (Might & Magic DNA)

Seven resources, deliberately echoing the M&M economy shape (one currency, two bulk, four rare):

| Resource | Source | Primary use |
|---|---|---|
| **Gold** 🪙 | Mine, raids, quests | Everything; recruit fodder tiers |
| **Timber** 🪵 | Sawmill, map nodes | Buildings, catapult, siege gear |
| **Stone** 🪨 | Quarry, map nodes | Walls, towers, buildings |
| **Crystal** 💎 | Spire, contested map nodes | Magic research, caster recruitment |
| **Sulfur** 🌋 | Pit, contested map nodes | Specialists (rockets, fire), traps |
| **Moonsilver** 🌙 | Contested nodes, PVP only | Mythic creatures, top-tier upgrades |
| **Trophies** 🏆 | PVP victories | Leaderboard seasons, cosmetic exchange |

Rare resources are deliberately scarce at home — the **map is where they live** (§9), which is the
engine that pushes players out of their castles and into conflict.

---

## 5. Units

### Categories & the tier ladder

Every unit exists on a tier ladder (T1 ragged → T5 elite → Mythic). **Upgrading a unit type is a
research action** (long timer + resources) that permanently improves all future recruits of that
type; individual units are consumable soldiers. Losing them in raids is forever.

**The chaos rule of tiers:** accuracy, discipline and self-preservation all scale with tier.
T1 units are catastrophically stupid (and cheap, and hilarious). T5 units are honed. Mythics are
walking calamities with their own problems (§5.4). Numbers in §6.

#### 5.1 Melee (Barracks)

| Tier | Unit | Gimmick |
|---|---|---|
| T1 | **Ragged Lad** | A peasant with a plank and no shield. Swings wide; hits allies ~as often as enemies. In Defensive Stance he holds the plank over his head, which helps nobody. |
| T2 | **Rusty Knight** | **Shielded** (badly). The prototype's knight: bonks, tumbles, helmet pops off, holds a roof that visibly sags. |
| T3 | **Man-at-Arms** | **Shielded.** Actually blocks sometimes; his shield deflects friendly arrows (emergent!) and anchors a shield roof. |
| T4 | **Berserker** | Windmill attack hits everything in a circle — devastating AND a war crime against his own side. |
| T5 | **Paladin** | **Shielded.** Disciplined, heavy, damage aura — and the sturdiest roof-holder in the game. |
| Special | **Climber** | Grapnel + suction cups; scales walls solo, no catapult needed. |
| Special | **Grappler** | Fires a grapple line others can climb — turns one unit into a ladder. |

#### 5.2 Ranged (Archery Range)

| Tier | Unit | Gimmick |
|---|---|---|
| T1 | **Rock Lobber** | Throws rocks. At everything. Including birds, walls, and friends. |
| T2 | **Peasant Archer** | Massive cone spread; arrows rain *somewhere*. |
| T3 | **Crossbowman** | Tighter spread, slow reload, occasionally shoots his own foot (trip animation). |
| T4 | **Longbowman** | Arcs over walls; volley mode. |
| T5 | **Ballista Team** | Two-man crew, bolt pins ragdolls to walls (physics joint on hit!). |

Ranged units fire **from where they land** — a well-launched archer on a tower is artillery; one
in the moat is a very wet spectator.

#### 5.3 Magic (Mage Tower) — casters as units

| Tier | Unit | Gimmick |
|---|---|---|
| T2 | **Hedge Wizard** | Tiny sparks; 25% total misfire rate (fizzle, wrong target, self-zap). |
| T3 | **Adept** | One school specialization; misfire 15%. |
| T4 | **Warlock** | Two schools; misfire 8% — but misfires are BIGGER now. |
| T5 | **Archmage** | Battlefield-scale casts; 4% misfire; a misfire is a catastrophe worth filming. |

**The Fireball Rule:** a missed offensive spell doesn't vanish — it goes *somewhere*. Overshoots,
bounces off a tower, or (signature moment) **arcs back down onto the caster** with full physics.
Misfire outcomes are weighted: 50% overshoot, 30% wrong target, 20% return-to-sender.

#### 5.4 Specialists (Workshop) — the launchable stars

These are the ad units. Each is a physics payload first, soldier second.

| Unit | Effect |
|---|---|
| **Rocket Man** 🚀 | Strapped to a visible rocket. Launch him and the rocket IGNITES mid-flight — he accelerates, spirals with slight guidance toward the biggest cluster, and detonates like a missile on impact. Upgrade: bigger blast, drunker spiral (yes, drunker — it's funnier and it's in the patch notes). |
| **Swamp Man** 🛢️ | A barrel-bodied lad who EXPLODES INTO OIL on landing, slicking everything in radius. Oiled units slip (friction ≈ 0, comedy ≈ 1) and take 3x fire damage. Oil flows downhill and pools — real fluid-lite sim. |
| **Burning Man** 🔥 | Permanently on fire, deeply committed. Ignites an area on landing; fire **propagates through oil** (the Swamp Man combo is the game's first taught synergy), spreads to wooden structures, and burns ragdolls into blackened-but-alive crisps (bloodless: they end up soot-faced and indignant). |
| **Bouncer** 🎈 | Inflated armour; bounces three times before settling, knocking enemies aside each bounce. Aim him at a courtyard like a bowling ball. |
| **Anvil Head** ⚒️ | Dense as sin. Terrible arc, but lands like a meteor — cracks walls, launches nearby ragdolls. The pile's premium foundation. |
| **Plague Piper** 🐀 | Releases physics rats on landing. Rats are tiny ragdolls that swarm and trip defenders. Rats. Everywhere. |

#### 5.5 Mythic creatures (Beast Pens → Mythic Roost, late game)

Mythics are **not launched** (they laugh at your catapult). Each arrives its own way — an entrance
IS the spectacle — and each has a drawback that keeps the chaos pillar honest:

| Mythic | Arrival | Power | Drawback |
|---|---|---|---|
| **Dragon** 🐉 | Flies in, shadow first | Strafing fire-breath runs (ignites oil!) | Preens after each pass — vulnerable window; ballistas can pin its wing |
| **Cyclops** 👁️ | Walks through the wall. The wall. | Throws rubble (and occasionally your own units — recycles the pile as ammo) | One eye = terrible depth perception; ~20% of throws miss absurdly |
| **Minotaur** 🐂 | Catapulted. Yes. He insists. He is technically a launchable. | Charge attack that ping-pongs off walls, bowling through everything | Gets dizzy after 3 wall-bounces; wanders in a circle seeing stars |
| **Stone Golem** 🗿 | Assembles itself from castle rubble ON ARRIVAL | Tanks tower fire; slow, unstoppable, IS climbable terrain | Rebuild cost; picks up ragdolls gently and sets them aside (pacifist streak — must be enraged by damage) |
| **Roc** 🦅 | Dive from off-screen | Grabs a defender OR one of your units (it does not care) and drops them from height | It genuinely does not care |

### Recruitment & loss

- Units train in building queues over real time; higher tiers take much longer.
- **Every unit that dies in a raid is gone.** Survivors return. There is no free retreat: you may
  sound the retreat horn at any time, but units already inside the walls must fight their way back
  to the breach (usually funny, rarely successful).
- A raid report replays your casualties with tombstone-cam highlights of the funniest deaths —
  losses are turned into content, softening the sting while keeping the stakes.

---

## 6. The Chaos-Accuracy Model (core system)

Chaos is systemic and tuned, not random noise sprinkled on top. Every acting unit rolls its
behaviour through one shared model:

```
effective_spread   = base_spread(unit) × tier_mult × morale_mult × surface_mult
friendly_fire_p    = ff_base(unit) × tier_mult × density_mult
derp_p             = derp_base(unit) × tier_mult          // trip, wrong way, hesitate, sneeze
```

| Tier | tier_mult | What it looks like |
|---|---|---|
| T1 | 2.0 | Arrows at 45° off-axis; melee windups that spin 270°; casters a public hazard |
| T2 | 1.5 | The prototype's beloved incompetence |
| T3 | 1.0 | Baseline chaos — still visibly loose |
| T4 | 0.6 | Professional, with occasional lapses |
| T5 | 0.35 | Precise. Misses are now *notable events* |
| Mythic | n/a | Bespoke drawbacks instead (see table) |

**Design guardrails:**
- Friendly fire deals **50% damage** and full ragdoll knockback — maximum comedy, softened cost.
- Chaos is symmetric: defender units use the same model. Your wall archers are exactly as likely
  to shoot their own oil barrels.
- `surface_mult`: units standing on piles, oil, or rubble get worse; on towers/flat ground better.
  Positioning (i.e., launch quality) therefore *is* the accuracy system — see §7.
- Derp events are **animation-first**: a trip is a real ragdoll stumble that can knock a neighbour
  off the wall. Derps feed physics; physics feeds comedy.

---

## 7. The Raid (moment-to-moment) — 3D

> **Status:** the shipped raid is 2D. The 3D conversion is specified in
> [RAID-3D-MIGRATION.md](RAID-3D-MIGRATION.md), which also lists what it breaks. This section is the
> target design.

### Why 3D

In 2D a launch can be wrong in one way: short or long — a *line* of failure. In 3D it can be wrong in
three: short/long, left/right, and spinning on an axis you did not intend — a *volume* of failure.
Every extra axis is a new way for a knight to end up somewhere stupid, and they compound. Precision
remains a reward of tier, never a baseline (§6); 3D simply gives the chaos model more room.

### Setup

The attacker arrives at the defender's castle, rendered in 3D. Your **catapult sits on a turntable**
with your army in a staging pen behind it; the castle stands ahead in depth — moat, outer wall,
courtyard, inner defenses, objective.

### Launching — three axes of wrongness

- **Drag any unit into the catapult cup**, then aim and release.
- **Azimuth** (drag horizontally) swings the turntable — and the turntable has **backlash**, so fine
  adjustments overshoot and wobble back. Higher catapult tiers reduce it.
- **Elevation** (drag vertically) sets the arc: flat and fast, or lofted and slow.
- **Power** winds the arm, which creaks and shudders under tension and judders on release if overwound.
- **Every catapult has a persistent aim bias** — a fraction of a degree of drift, seeded from that
  catapult's own ID, so it is consistent. Players learn "mine pulls left" and compensate. Upgrades
  reduce it. It is a character trait, not noise.
- **Crosswind**, telegraphed by a wind sock and drifting banners, shoves bodies laterally at the top of
  the arc. A Ragged Lad gets thrown noticeably; Anvil Head barely notices. It changes between launches.
- **Release imparts spin on all three axes.** A clean launch lands a knight upright with a grunt; a bad
  one arrives headfirst, sideways or corkscrewing, and the landing pose drives both damage and the
  comedy of the recovery.
- **Launch quality is still the skill:** a clean arc lands the unit on its feet, in position, with zero
  landing damage. A botched one means damage, scatter, and a stunned wobble — and a worse unit fights
  worse from a worse spot (§6 `surface_mult`).
- **Tuck (tap mid-flight)** now does double duty: less drag and a higher bounce, *and* it stabilises
  spin — so a skilled player converts a tumbling disaster into a clean landing. That is a real skill
  ceiling 2D did not have.
- **Climbers and Grapplers** still walk from the pen and scale walls unaided. **Ranged units** fire from
  where they land. **Mythics** arrive their own way.

### Defensive Stance and the shield roof

When a landed unit comes to rest and survives, it does **not** lie there and it does not adopt some
vague propping pose. It gets up and goes into **Defensive Stance — shield raised overhead.**

- **Shield-bearers lock together into a shield roof** (a testudo). Shoulder to shoulder, shields up,
  a wobbling armoured ceiling. **That roof is the climbable surface** — later knights land on it and
  run across it, so failed waves still build the route for the next one.
- **Unshielded units** — archers, mages, Rocket Man, anyone whose job is not standing still — hunker
  down instead, arms over their heads, making themselves as small and as pathetic as possible. They
  still form a surface, just a worse and much funnier one. A mage cowering under his own hat holds
  roughly no weight at all.
- **Shields up means damage down.** A unit in Defensive Stance takes heavily reduced damage from
  above: arrow volleys, boiling oil, dropped rocks. This is what makes the stance a real tactical
  state rather than set dressing.
- **The roof can collapse.** Land something heavy on it — an Anvil Head, a Mythic, a badly-aimed
  Minotaur — and it caves in, dumping everyone underneath into a heap and briefly opening the route
  you were building. Weight is a resource you have to spend carefully, and getting it wrong is one
  of the best accidents in the game.
- **The player can command Defensive Stance** on units already in the field: hold position, shields
  up, take far less damage, deal none. The correct answer to an incoming volley, and the wrong answer
  if you needed those units to be attacking the banner.

**Loadout consequence:** shield-bearers make better ramps *and* better cover, so who you launch first
is a real decision. Send the Man-at-Arms and Paladins early to build a solid, damage-resistant roof;
send the mages first and you get a lumpy, cowering, structurally embarrassing one.

### The pile, in three dimensions

The pile is now a **mound with a shape**. Angle-of-repose relaxation runs in two dimensions, so a heap
slumps outward into a proper cone rather than a triangle. You can orbit it and read it. Players
deliberately build a mound on the *left* to reach a left tower, which turns pile-building from a
running total into a spatial plan — and dumping too much weight on one side sloughs the whole thing
sideways, taking your careful route with it.

Piles can still be shoved over by defenders and burned by fire — and a shield roof under fire is a
roof full of people rapidly reconsidering their commitment to holding formation.

### Camera

Behind-and-above during aiming so azimuth reads naturally; a **deliberately drunken follow** in flight
that overshoots on landing and settles; freeze-frame and a short orbit on spectacular impacts; free
orbit during the raid because the pile is now worth looking at. The camera never takes control away
mid-aim.

### Spellcasting

Unchanged in design (§10 for schools): three equipped slots and a mana pool that refills during the
raid. Spells are physics events, and in 3D they get an axis too — a Meteor's whistling shadow now
tracks across the ground toward where it will actually land, which is both fairer and funnier.
Player-cast spells use your Mage Tower's accuracy tier, so early on your own meteors are a danger to
everyone you love.

### Objectives

Every raid has a **primary objective** (destroy the Keep banner) plus **2 bonus objectives** drawn from
a pool — and defenders **customize their own bonus objectives** as taunts:

- Ring the giant bell three times (it's guarded and it's LOUD)
- Steal the defender's prize pig (a ragdoll pig that does NOT cooperate)
- Land a unit in the lord's bathtub (top of the highest tower — and now you can miss it in two axes)
- Topple the ancestral statue so it crushes the gatehouse
- Have a unit survive 20 seconds sitting on the throne
- Deliver a pie to the enemy lord (the pie is a physics object; good luck)

Bonus objectives multiply loot (1.25x / 1.5x) and award Trophies. They exist to force attackers into
gloriously stupid tactical decisions.

### Victory / defeat

- **Win:** primary objective destroyed before your army is spent → loot a % of the defender's unvaulted
  resources, plus objective bonuses.
- **Loss:** army spent first → walk of shame, partial loot for damage done (25% scale).
- Either way: dead units stay dead, tombstone-cam plays the top 3 funniest moments, and one-tap
  **share clip** exports the auto-captured highlight (the UA engine).

---

## 8. Defense (the other half of PVP)

Defenses run **asynchronously**: attackers raid a live snapshot of your layout with AI-controlled
defenders (Clash model — no realtime sync needed, §15).

### From 3D city to 2D siege: the projection

Your city is built in 3D on a plot grid, but raids are fought on a 2D side-view cross-section. The
translation is **explicit and player-visible**, because "does my building actually matter?" is the
question that decides whether the city layer feels real.

| 3D city property | Becomes, in the 2D raid |
|---|---|
| Wall building level | Wall height and HP |
| Number of Tower plots built | Number of wall-top firing positions |
| Left-to-right plot order of towers | Their left-to-right order along the wall |
| Keep level & position | Objective banner height and depth into the castle |
| Trap Forge level | Number of trap slots available to place |
| Terrain the city sits on | Approach: moat (river tile), slope (hill tile), flat (plain tile) |
| Garrison assignment | Which units stand where on the cross-section |

A **Defense Preview** screen renders the exact 2D cross-section your current city produces and lets
you play a practice raid against yourself. This is the feedback loop that makes 3D building
decisions legible in 2D combat terms — without it, players cannot tell why a raid went badly.

**Defender toolkit:**
- **Wall shape is yours:** wall heights and tower positions per slot — a tall thin castle vs a
  wide low one produce different siege problems.
- **Garrison:** assign trained units to posts (wall-top archers, courtyard melee, a mage in the
  tower). Garrison units killed defending are ALSO lost — defense has stakes too — but defenders
  auto-recruit a free militia baseline so raided players are never left naked.
- **Traps (Trap Forge):** oil cauldrons (tip onto the pile — counters pile-climbing!), bear traps,
  trebuchet counter-battery that lobs rocks at the attacker's catapult, decoy hay bales, a greased
  wall section (climbers slide off in despair), spring platforms that launch landing attackers
  right back over the wall (the ultimate disrespect).
- **Pile management:** defenders can station a **Shover** on walls whose whole job is pushing piles
  over. Attackers hate him. He has a little broom.

**Balance lever:** defense strength is capped relative to Keep level so whales cannot become
unraidable; the Vault protects a floor of resources so losses never feel total.

---

## 9. The World Map (3D)

A **continuous 3D terrain world**, streamed and zoomable — the Whiteout Survival model. There is no
"open the map" screen transition: you pinch out from your city and the world grows around it.

### Presentation

- **3D terrain** with real elevation, biomes per region (grassland, marsh, volcanic ash, snowfield,
  blighted waste), rivers and roads that armies actually follow.
- **Tile grid overlaid on the terrain.** Cities occupy a footprint of tiles; resource nodes, monster
  dens and campaign citadels each own tiles. The grid is visible on hover/selection, invisible
  otherwise, so the world reads as a place rather than a spreadsheet.
- **Zoom tiers:** *Local* (your city + immediate neighbours, buildings visible), *Regional*
  (dozens of cities, icons take over from models), *Continental* (alliance territories as coloured
  regions, march lines as arcs).
- Every player city on the map is a **real 3D city model** reflecting that player's actual Keep
  level and wall tier at Local zoom — scouting is partly visual.

### March system (Whiteout fidelity)

Attacks are not instant. You dispatch a **march**: a visible column of troops that physically walks
the terrain, following roads, with a real travel timer based on distance and slowest unit speed.

- Marches are **visible to everyone** — you can watch an army crawl toward your city and see its
  banner, size and estimated arrival. Counterplay: shield, reinforce, recall your own gatherers,
  or intercept.
- **Recall** is possible mid-march (troops walk home).
- **Rally attacks:** alliance members contribute troops to a shared march against a big target;
  the rally leader plays the raid.

**Design decision — where the physics raid fits.** When a march arrives, the 2D raid launches:

| Situation | Behaviour |
|---|---|
| You are online | Push notification → tap → **you play the raid yourself** |
| You are offline | An AI commander auto-resolves at **reduced efficiency** (worse launches, no player spells) — you still get loot, just less |
| You set "Auto-raid" | Deliberately auto-resolve for grind targets, at the same AI penalty |

This preserves the map metagame (travel time, interception, visible threat) *and* keeps the action
game intact, while making presence rewarded rather than mandatory. Short-range targets have short
marches specifically so the action loop stays tight for active sessions.

### What lives on the map

| Element | Role |
|---|---|
| **Player cities** | PVP targets in your matchmaking band. Scout to reveal garrison estimate, wall tier, and last-raid gossip ("Bob's pig remains unstolen") |
| **Campaign citadels** | The PVE spine: 120+ authored raids across 8 regions, escalating gimmicks, star-rated (win / +1 bonus / +both). Fixed positions — the campaign is a *journey across the map* |
| **Resource nodes** | Timber camps, quarries, crystal geodes, sulfur vents, **Moonsilver shrines**. Send a gathering march; troops occupy the tile and harvest over time — and can be raided while there |
| **Monster dens** | PVE mini-raids vs creature nests; drop unit-upgrade materials |
| **Alliance territory** | Claimed regions with buffs; territory war events; alliance HQ structures placed on the map |
| **Events** | Weekend beacons: boss citadels (co-op damage leaderboard), goblin caravans that march across the world and can be ambushed, "Full Moon" (Mythic costs halved) |

The map is the *reason to fight*: rare resources live in contested nodes, campaign progress gates
new unit types, and alliance territory is the late-game pressure system.

---

## 10. Schools of Magic (Might & Magic inspired)

Five schools researched at the Mage Tower. Research unlocks spells for **both** your casters (auto)
and your player-cast spell bar (chosen loadout). Each school has 6 spells across 3 circles.

| School | Identity | Signature spells (circle 1 → 3) |
|---|---|---|
| **Pyromancy** 🔥 | Damage, propagation | Firebolt → Meteor (huge, slow, announced by a whistling shadow — dodgeable, hilarious when not) → Inferno (mass ignite; ALL oil on screen lights) |
| **Hydromancy** 🌊 | Control, cleanup | Grease Tide (oil-slick a zone) → Tidal Slap (wave shoves ragdolls) → Monsoon (extinguishes fire, floods moat, floats ragdolls) |
| **Geomancy** 🪨 | Terrain, defense | Stone Step (raise a platform — instant pile!) → Tremor (shake wall-top units off) → Fist of the Mountain (a giant stone fist punches up from the ground) |
| **Aeromancy** 🌪️ | Mobility, redirection | Gust (mid-flight course-correct a launched unit — the skill-expression spell) → Updraft (float a cluster helplessly) → Tornado (roaming ragdoll blender that does not check allegiances) |
| **Vitamancy** ✨ | Heal, buff, revive | Mend (heal cluster) → Battle Hymn (attack speed + tighter spread — chaos reducer!) → Second Wind (revive the freshest corpses in a zone as woozy fighters — they get up from the pile) |

**School rules:**
- Spells are physics events, not stat changes: Tidal Slap applies real impulses; Tornado is a
  moving force field; Stone Step is collidable terrain.
- Tornado and Meteor **do not check allegiances**. Aeromancy mains know what they signed up for.
- Counterplay matrix is taught by play: Monsoon kills Inferno; Gust saves a bad launch; Tremor
  counters wall-top garrisons; Vitamancy turns the enemy's kills into your reinforcements.

---

## 11. Progression & Economy Pacing

| Phase | Days | Player state |
|---|---|---|
| **Onboarding** | 1 | Campaign region 1, T1–T2 units, first Rocket Man moment scripted at raid 3, first PVP raid vs a "abandoned castle" (bot) |
| **Establishing** | 2–14 | All resource buildings, T3 research, first magic school, real PVP band, first node wars |
| **Mid-game** | 2–8 wks | T4, second/third school, specialists rounded out, campaign regions 4–6, alliance features |
| **Late game** | 2 mo+ | T5 + Mythics (Moonsilver-gated), seasonal Trophy ladders, defense meta-game |

- **Time model:** honest long timers (T5 research measured in days), accelerated by raid-earned
  speedups — playing hard is the primary accelerator, paying is the secondary one.
- **Permadeath economics:** unit loss keeps demand for recruitment permanently high; the fun-cost
  of losses is offset by tombstone-cam comedy, cheap T1 fodder always being viable filler, and
  loss-shield mechanics (below).
- **Anti-frustration:** attack shields after being raided (8h, breaks on your own attack), Vault
  floor, militia baseline, and matchmaking by *effective army value* not just Keep level.
- **Monetization (light-touch, mid-core standard):** build queue slot, cosmetic castle themes &
  unit skins (a top hat on a Ragged Lad is worth $2.99 of pure joy), battle pass on raid play,
  speedups. **No paid units, no paid accuracy** — chaos is sacred and cannot be bought off.

---

## 12. Multiplayer Architecture (async-first)

- **PVP = asynchronous snapshot raids** (Clash model) layered on a **march timing system**
  (Whiteout model). The march is server-authoritative — dispatch, travel, arrival and recall are
  all resolved server-side, so a client cannot fake arrival or teleport an army.
- On arrival the defender's layout + garrison is **serialized into a 2D raid snapshot** (§8
  projection). The attacker's raid is simulated client-side and **verified by replaying the input
  log server-side** with the deterministic sim (fixed-timestep physics, seeded RNG — the arena
  prototype already runs fixed 1/120s substeps; this is the same discipline with a fixed seed).
- Determinism contract: no `Time.deltaTime` in sim code, integer tick counts, seeded chaos rolls,
  no cross-platform float traps (conservative math, verified by replay tests in CI).
- **The 3D layers are not simulated.** City and world map are presentation + server state; only the
  2D raid is a physics sim. This is deliberate — it keeps the determinism surface small and means
  3D art quality can rise indefinitely without touching gameplay verification.
- Raid replays are free by construction: every raid is shareable and scrubbable — this is the
  anti-cheat, the clip-export pipeline, and the offline auto-resolve record all at once.
- Alliances (v1.1): chat, resource gifting, rally marches, territory war, co-op event bosses,
  revenge board.

---

## 13. The Juice Bible (contract, not wishlist)

**Physics comedy (the foundation)**
- Full ragdolls per unit (prototype's 7-node PBD bodies), helmets as separate pop-off bodies,
  weapons that go flying and stick in the ground/walls/other helmets.
- Pile settle "clatter" with angle-of-repose slump (prototype-proven); pile groans as it grows.
- Freeze-frame (2–3 frames) + zoom-punch on: wall breaches, Mythic arrivals, spell impacts,
  objective completions, and any friendly-fire kill (a shame-bell rings — DING).

**Cameras**
- Launch-follow cam with slight drunk lag; slow-mo (0.3x) on the wall-clearing unit of each wave.
- Tombstone-cam replay of the raid's 3 funniest moments (scored by: friendly-fire, distance
  travelled post-mortem, number of allies knocked over, style of failure).
- Kill-cam on the objective banner falling, with confetti + the defender lord's outraged bark.

**Feedback rules**
- Every impact: pitched clang by material + impact energy, dust, screen shake (energy-scaled,
  directional), controller-style haptic on mobile.
- Every state change animated: build scaffolds up, upgrades physically bolt on, research floats
  glyphs to the tower.
- Numbers are events: loot counts up with coin ticks, damage popups bounce with squash-stretch.

**Sound design personality**
- Armour is *slapstick metal* — cookware, not war. Fire is eager. Oil glorps. Rats are a tiny
  stampede. The catapult creaks like it's uninsured.

---

## 14. Production Pipelines (mandated stack)

### Engine — **Unity URP (3D city & world map + 2D physics raids)**

A single URP project running **two presentation modes**:

| Layer | Rendering | Physics |
|---|---|---|
| **City** | 3D URP, orbit-iso camera, real-time lights, weather | none (presentation + server state) |
| **World map** | 3D URP, streamed terrain tiles, LOD'd city models | none (marches are server-timed) |
| **Raid** | Orthographic side-view, 2D sprites + 3D set dressing behind | **Physics2D** — the ragdoll sim |

- URP with both Renderer assets configured: a 3D forward renderer for City/World, and a
  raid renderer profile tuned for the 2D scene. Camera stacking for UI overlays.
- **Physics2D works in a 3D project** — Unity supports both physics systems simultaneously. The raid
  scene uses Rigidbody2D ragdolls (HingeJoint2D chains) with the prototype's discipline: fixed
  substeps, sleep-and-freeze settled bodies into composite pile colliders, hard body budget
  (~120 live ragdolls, then oldest-settled freeze to static). Burst jobs for oil/fire propagation.
- **Depth in raids without 3D combat:** the raid keeps 2D physics but is *presented* with 3D
  parallax — the besieged city's 3D geometry renders as background/foreground layers behind the
  2D action plane, so raids look continuous with the rest of the game while remaining a 2D sim.
- Scenes: `Boot → City → WorldMap → Raid` with additive loading; City and WorldMap share a
  camera rig for the seamless zoom handoff. Raid is an isolated physics scene.
- Save/state: server-authoritative economy and marches; the client is a view. Raid sim deterministic (§12).

### Art — 3D city/world + 2D raid units

The 3D shift splits the art pipeline in two. **Both halves must share one palette and silhouette
language** so a knight on the 2D raid plane reads as the same world as the 3D city he came from.

**3D — city buildings, world terrain, props (NEW)**
- **Tripo AI** for base mesh generation: `text_to_3d` for building concepts and props,
  `image_to_3d` to convert approved Higgsfield concept art into meshes, then `refine_model` /
  `texture_model`. Output GLB → Unity.
- **Every mesh gets a human retopo/optimisation pass** before shipping — generated meshes are
  concept accelerators, not final assets. Budget: buildings ≤ 3k tris at City zoom with LOD1/LOD2.
- Buildings authored as **modular upgrade states** (one mesh set per tier) so progression swaps
  cleanly; shared trim-sheet atlas across all buildings to keep draw calls down.
- Terrain: heightmap regions per biome, GPU-instanced foliage/rocks, roads as splines.

**2D — raid units, ragdoll sprites, VFX (PixelLab, unchanged)**
- **PixelLab** for characters via `create_character` (4-direction views) + `animate_character`
  for walk, wind-up, swing, trip, ragdoll-recover, celebrate.
- **Critical:** generate characters with **separable head / torso / limb layers** so sprites map
  onto the physics ragdoll body parts. A flat sprite cannot ragdoll.
- Siege props, pile debris, oil/fire VFX sheets, and the 2D raid foreground/background bands.

**Marketing (Higgsfield, unchanged)**
- Key art, store screenshots, UA video concepts (the Rocket Man ad, the fireball-return ad), and
  concept exploration that feeds Tripo's `image_to_3d`. Never in the runtime build.

### UI — **Claude Design pass → Unity UI Toolkit (UXML/USS)**
- Every screen gets a **Claude Design canvas pass first**: city HUD, building info/upgrade panels,
  world map HUD, march dispatch and scouting screens, raid HUD, unit cards, research trees,
  raid report / tombstone-cam.
- Approved designs are **transcribed to UI Toolkit**: UXML documents per screen, USS stylesheets
  mirroring the design tokens (USS is Unity's CSS dialect, so the translation is near-direct).
  Design tokens (palette, radii, type ramp) live in one shared USS root so design and runtime
  cannot drift.
- **3D-specific UI work:** world-space building nameplates and upgrade badges that stay legible
  across zoom tiers, march banners on the map, and tap-target scaling — these need explicit design
  attention because they float over a moving 3D camera rather than sitting on a flat canvas.
- Exception: the raid HUD is performance-critical. Profile the spell bar and launch meter; if UI
  Toolkit costs frames under ragdoll load, drop those elements to direct mesh UI.

### Audio — **ElevenLabs**
- **SFX pipeline:** `text_to_sound_effects` for the slapstick library (clangs, glorps,
  rocket-fizzles, pig outrage) → `sfx_<category>_<variant>.wav` → Unity Addressables audio bank
  per category. Target 300+ SFX at 3–5 variants each for round-robin anti-repetition.
- **City ambience is now its own category:** the 3D city needs a living soundscape — hammering,
  cart wheels, crowd murmur, weather, and a day/night ambience crossfade.
- **Voice barks:** a voice per unit tier (T1 lads enthusiastic and dim; Archmages weary; the
  defender lord's outrage barks on objective loss). Batch-generated per language.
- **Music:** castle/city themes (cozy medieval), world map exploration bed, and intensity-stacked
  raid stems mixed by combat state.

---

## 15. Technical Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Hybrid 2D/3D complexity** (two presentation modes, two physics mindsets) | Hard separation: only the raid scene has a sim. City/World are presentation over server state. One URP project, two renderer profiles, no shared physics |
| **3D asset cost blowing the budget** (the big new risk) | Tripo-generated base meshes + mandatory retopo pass; modular upgrade-state kits; shared trim-sheet atlas; strict tri budgets with LODs. Art is the long pole — schedule it as such |
| **Mobile perf: 3D city + world streaming** | GPU instancing for villagers/foliage, aggressive LOD, occlusion, capped ambient agent count, terrain tile streaming with a memory ceiling; target 60fps on a 3-year-old mid-range device at City zoom, 30fps floor at Continental |
| **Seamless city↔map zoom** (easy to get janky) | Shared camera rig, async tile prefetch triggered at the Overview threshold, and a designed "cloud wipe" fallback if streaming stalls — never a hard loading screen |
| Ragdoll count at scale (armies + garrisons + rats) | Prototype's sleep→freeze→composite pipeline; rats use simplified 3-node bodies; hard cap with oldest-freeze |
| Determinism for server replay verification | Fixed-tick sim, seeded RNG, no frame-dependent math; CI replays 1,000 recorded raids nightly and diffs outcomes. **3D layers are excluded from the determinism surface by design** |
| **City→raid projection fidelity** (players must feel their build matters) | Projection rules are explicit and shown in a "Defense Preview" that renders the actual 2D cross-section your city produces (§8) |
| Oil/fire propagation cost | Cellular grid (Sandfall-style), not per-particle; Burst job |
| Chaos frustration (RNG rage) | Chaos is symmetric, friendly fire is half-damage, tombstone-cam converts loss to laughs; tier ladder is a visible "buy out of chaos with effort" promise |
| Async PVP griefing | Shields, Vault, matchmaking by army value, militia floor, visible incoming marches give reaction time |
| Physics divergence across devices | Deterministic math for gameplay-critical checks; visual-only physics (helmets, confetti) may diverge freely |

---

## 16. MVP Cut & Milestones

**M1 — Raid Vertical Slice (6 wks):** one authored castle, catapult + T1–T3 melee/ranged, Rocket
Man + Swamp Man + Burning Man (the synergy ad), pile mechanic ported from prototype, chaos model,
2 spells (Firebolt, Mend), tombstone-cam, full juice bible on everything present.
**Gate:** 30 people playtest; ≥70% laugh out loud at least once (filmed); session ≥8 min unprompted.

**M2 — Core Loop (12 wks):** castle building (8 buildings), resources, recruitment timers,
campaign region 1 (15 raids), unit research T1→T3, ElevenLabs SFX bank v1, Claude Design UI pass
for castle + raid screens.

**M3 — PVP Alpha (20 wks):** async snapshot raids, defense editor + garrison + 4 traps, world map
with nodes, deterministic replay verification, matchmaking v1, shields/vault.

**M4 — Soft Launch (28 wks):** all 5 schools, T4–T5, first 2 Mythics (Dragon, Minotaur), campaign
regions 1–4, battle pass, clip export, LiveOps events v1.
**Gates (per RESEARCH.md benchmarks):** D1 ≥ 35%, D7 ≥ 15%, CPI ≤ $1.50 on the Rocket Man and
fireball-return creatives, ARPDAU ≥ $0.15 before global.

**Post-launch runway:** remaining Mythics, alliance wars (multi-catapult co-op raids), seasonal
Trophy ladders, castle biomes, and the infinite specialist pipeline (every new launchable is a
content drop AND an ad creative).

---

*The prototype proved people will fling ragdoll knights at a wall and laugh. This document is the
plan for making them log in tomorrow to do it again — because this time, their knights are wearing
top hats, their mage finally hit something, and Bob's pig is STILL unstolen.*
