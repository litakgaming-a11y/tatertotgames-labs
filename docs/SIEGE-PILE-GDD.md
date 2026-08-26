# SIEGE PILE — Game Design Document

**From arena prototype to full mid-core physics siege game**
Version 1.0 · TaterTot Games Labs · Unity 2D URP

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
   propagation — all resolved by the 2D physics sim. If the pile says a knight is a stepping
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
        │                     YOUR CASTLE                       │
        │   collect resources · construct/upgrade buildings     │
        │   recruit & upgrade units · research magic            │
        └───────────────┬──────────────────────────────────────┘
                        │  pick a target
                        ▼
        ┌──────────────────────────────────────────────────────┐
        │                     WORLD MAP                         │
        │   nearby player castles (PVP) · campaign nodes (PVE)  │
        │   resource collection points · events                 │
        └───────────────┬──────────────────────────────────────┘
                        │  launch raid
                        ▼
        ┌──────────────────────────────────────────────────────┐
        │                      THE RAID                         │
        │   catapult + army → launch over walls → ragdoll war   │
        │   cast spells · complete objectives · loot or lose    │
        └───────────────┬──────────────────────────────────────┘
                        │  survivors come home, dead stay dead
                        ▼
                 loot → castle → repeat
```

**Session shapes:**
- *Snack (2–4 min):* collect, queue one upgrade, one raid.
- *Meal (10–20 min):* campaign push, several raids, unit upgrades, defense re-layout.
- *Idle return:* resources accrued (capped), troops finished training, shield expiring.

**Loop economics:** raids consume units (permadeath) and produce loot; loot feeds buildings and
unit upgrades; better units enable harder targets. Unit loss is the primary sink and the reason
the economy never saturates (§11).

---

## 3. The Castle

A single side-view diorama (matching the raid presentation) — your castle IS your defense layout.
What you build is literally what attackers besiege. Every upgrade is **visible on the building**.

### Buildings

| Building | Function | Visible progression |
|---|---|---|
| **Keep** | Account level gate; unlocks everything else | Wooden fort → stone keep → marble citadel |
| **Gold Mine / Sawmill / Quarry** | Produce Gold / Timber / Stone | Bigger wheels, more carts, busier workers |
| **Crystal Spire / Sulfur Pit / Gem Grotto** | Rare resources (from Keep 8) | Glow intensity, smoke, sparkle |
| **Barracks** | Recruit & upgrade Melee | Training dummies get progressively destroyed |
| **Archery Range** | Recruit & upgrade Ranged | Targets with arrows everywhere BUT the bullseye |
| **Mage Tower** | Recruit casters; research magic schools | Orbiting runes per school unlocked |
| **Beast Pens → Mythic Roost** | Late-game creatures | Cage → paddock → mountaintop nest with dragon |
| **Workshop** | Specialists (Rocket Man line etc.); catapult upgrades | Increasingly unsafe-looking contraptions |
| **Walls & Towers** | Defense HP, tower slots | Palisade → stone → crenellated with hoardings |
| **Trap Forge** | Defensive traps (§8) | — |
| **Vault** | Protects a % of loot from raids | — |
| **Tavern** | Daily quests, funny rumour texts, event board | Patrons multiply |

**Build rules:** two parallel build queues (third via premium). Upgrades are long at high tiers
(hours → days) per the mid-core standard. Buildings can be **placed** along the castle cross-section
(left-to-right slots) — placement matters because attackers enter from one side (§8).

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
| T1 | **Ragged Lad** | A peasant with a plank. Swings wide; hits allies ~as often as enemies. |
| T2 | **Rusty Knight** | The prototype's knight. Bonks, tumbles, helmet pops off. |
| T3 | **Man-at-Arms** | Actually blocks sometimes. Shield can deflect friendly arrows (emergent!). |
| T4 | **Berserker** | Windmill attack hits everything in a circle — devastating AND a war crime against his own side. |
| T5 | **Paladin** | Disciplined, heavy, damage aura; the pile's best foundation block. |
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

## 7. The Raid (moment-to-moment)

### Setup

Attacker arrives at the defender's castle cross-section. On the left: **your catapult** (upgradeable:
range, HP, reload speed, double-cup) and your brought army arranged in a staging pen. The defender's
castle spans rightward: moat → outer wall → courtyard → inner defenses → **objective**.

### Launching

- **Drag any unit into the catapult cup**, then drag-back-and-release to launch (the prototype's
  proven input, unchanged). Trajectory preview is deliberately vague at low catapult tiers.
- **Launch quality is the skill:** a clean arc over the wall lands the unit on its feet with an
  intact formation position and **zero landing damage**. A botched launch means face-first landing
  damage, scattered positioning, and a stunned wobble — the unit fights worse from a worse spot
  (§6 surface_mult). Great launches are the mastery loop.
- **Tuck (tap mid-flight)** returns from the prototype: reduces drag, raises bounce — skilled
  players skip units off the pile or off rooftops deeper into the castle.
- **Climbers/Grapplers** walk from the pen and scale walls without the catapult. **Ranged units**
  can be deployed to the staging ground to fire over walls from outside (at maximum spread) or
  launched inside for accuracy. Mythics trigger their own arrival.
- The **pile mechanic is preserved globally:** every fallen unit (yours or theirs) becomes settled
  climbable terrain. Failed waves literally build the ramp for the next one. Piles can be shoved
  over by defenders and burned by fire.

### Spellcasting (player-cast, §10 for schools)

A spell bar (3 equipped slots + mana pool that refills slowly during the raid) lets YOU cast
directly: heal a cluster, drop a meteor, slick a rampart with grease, enrage your minotaur.
Player-cast spells use *your Mage Tower's* accuracy tier — early on, your own meteors are a
danger to everyone you love.

### Objectives (over-the-top by design)

Every raid has a **primary objective** (destroy the Keep banner) plus **2 bonus objectives** drawn
from a pool — and defenders **customize their own bonus objectives** as taunts (pick which
absurdity attackers must attempt for full loot):

- Ring the giant bell three times (it's guarded and it's LOUD)
- Steal the defender's prize pig (a ragdoll pig that does NOT cooperate)
- Land a unit in the lord's bathtub (top of the highest tower)
- Topple the ancestral statue so it crushes the gatehouse
- Have a unit survive 20 seconds sitting on the throne
- Deliver a pie to the enemy lord (the pie is a physics object; good luck)

Bonus objectives multiply loot (1.25x / 1.5x) and award Trophies. They exist to force attackers
into gloriously stupid tactical decisions.

### Victory / defeat

- **Win:** primary objective destroyed before your army is spent → loot % of defender's unvaulted
  resources + objective bonuses.
- **Loss:** army spent first → walk of shame, partial loot for damage done (25% scale).
- Either way: dead units stay dead, tombstone-cam plays the top 3 funniest moments, and one-tap
  **share clip** exports the auto-captured highlight (the UA engine).

---

## 8. Defense (the other half of PVP)

Defenses run **asynchronously**: attackers raid a live snapshot of your layout with AI-controlled
defenders (Clash model — no realtime sync needed, §15).

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

## 9. The World Map

Presentation: zoomable region map (Whiteout Survival-style density) rendered in the game's chunky
2D style — castles of nearby players, PVE sites, and resource nodes scattered between.

| Map element | What it is |
|---|---|
| **Player castles** | Raidable neighbours (matchmade band). Scouting shows wall silhouette + last-raid gossip ("Bob's pig remains unstolen") |
| **Campaign citadels** | The PVE spine: 120+ authored raids across 8 regions, escalating gimmicks (undead garrisons, clockwork defenses, a rival warlord's recurring taunts), each with star ratings (win / win+1 bonus / win+both) |
| **Resource nodes** | Timber camps, quarries, crystal geodes, sulfur vents, **Moonsilver shrines** — occupy with a small garrison to harvest over time; other players can raid your harvesters (world PvP pressure) |
| **Monster dens** | PVE mini-raids vs creature nests; drop unit-upgrade materials |
| **Events** | Weekend beacons: boss castles (co-op damage leaderboard), goblin caravans, "Full Moon" (Mythic costs halved) |

The map is the *reason to fight*: rare resources live in contested nodes, and campaign progress
gates new unit types (the first Rocket Man is a campaign reward — taught before bought).

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

- **PVP = asynchronous snapshot raids** (Clash model). The defender's layout + garrison AI is
  serialized; the attacker's raid is simulated client-side and **verified by replaying the input
  log server-side** with the deterministic sim (fixed-timestep physics, seeded RNG — the arena
  prototype already runs fixed 1/120s substeps, this is the same discipline with a fixed seed).
- Determinism contract: no `Time.deltaTime` in sim code, integer tick counts, seeded chaos rolls,
  no cross-platform float traps (use conservative math, verified by replay tests in CI).
- Raid replays are therefore free: every raid is a shareable, scrubbabale replay by construction —
  this is also the anti-cheat AND the clip-export pipeline.
- Alliances (v1.1): chat, resource gifting, co-op event bosses, "revenge board".

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

### Audio — **ElevenLabs**
- **SFX pipeline:** `text_to_sound_effects` for the full slapstick library (clangs, glorps,
  rocket-fizzles, pig outrage) → normalized to a naming convention `sfx_<category>_<variant>.wav`
  → imported to Unity with an addressables audio bank per category. Target: 300+ SFX at 3–5
  variants each for anti-repetition round-robin.
- **Voice barks:** ElevenLabs voices for unit personalities — each tier gets a voice (T1 lads
  are enthusiastic and dim; Archmages weary; the defender lord's outrage barks are procedural
  triggers on objective loss). Localized bark scripts, batch-generated per language.
- **Music:** ElevenLabs music composition for castle themes (cozy medieval) and raid escalation
  layers (intensity-stacked stems mixed by combat state).

### UI — **Claude Design pass → UI Toolkit (UXML/USS)**
- Every screen gets a **Claude Design canvas pass first** (design skill + UI skills): castle HUD,
  world map, raid HUD, unit cards, research trees, raid report / tombstone-cam frame.
- Approved designs are **transcribed to Unity UI Toolkit**: UXML documents per screen, USS
  stylesheets mirroring the design tokens (the CSS-like workflow requested — USS is Unity's CSS).
  Design tokens (palette, radii, type ramp) live in one shared USS root so the Claude Design
  system and the runtime UI cannot drift.
- Raid HUD is the exception: performance-critical elements (spell bar cooldown wheels, launch
  meter) get profiled and may drop to direct mesh UI if UI Toolkit costs frames.

### Art — **PixelLab + Higgsfield**
- **PixelLab (in-game art):** characters via `create_character` with 4-direction views +
  `animate_character` for the core sets (walk, wind-up, swing, trip, ragdoll-recover, celebrate);
  siege props and buildings via object/tileset generation; castle building progression states as
  object states. Chunky readable silhouettes at 2x pixel density to match ragdoll physics scale.
  Ragdoll segmentation: characters generated with separable head/torso/limbs layers so PixelLab
  sprites map onto the physics body parts.
- **Higgsfield (marketing & concept):** key art, store screenshots, UA video concepts (the
  Rocket Man ad, the fireball-return ad), and mood/concept exploration before PixelLab
  production passes. Never in the runtime build.

### Engine — **Unity 2D URP**
- URP 2D renderer with 2D lights (torchlight on night raids, fire glow as Light2D, bloom on
  magic), shadow-caster walls.
- Physics: Rigidbody2D ragdolls (HingeJoint2D chains) with the prototype's discipline — fixed
  substeps, sleep-and-freeze settled bodies into composite pile colliders, hard body budget
  (~120 live ragdolls, then oldest-settled freeze to static). Burst-jobs for oil/fire cellular
  propagation grid.
- Scenes: `Boot → Castle → WorldMap → Raid` (additive loading, raid is its own physics scene).
- Save/state: server-authoritative economy; client is a view. Raid sim deterministic (§12).

---

## 15. Technical Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Ragdoll count at scale (armies + garrisons + rats) | Prototype's sleep→freeze→composite pipeline; rats use simplified 3-node bodies; hard cap with oldest-freeze |
| Determinism for server replay verification | Fixed-tick sim, seeded RNG, no frame-dependent math; CI test replays 1,000 recorded raids nightly and diffs outcomes |
| Oil/fire propagation cost | Cellular grid (prototype Sandfall-style), not per-particle; Burst job |
| Chaos frustration (RNG rage) | Chaos is symmetric, friendly fire is half-damage, tombstone-cam converts loss to laughs; tier ladder is a visible "buy out of chaos with effort" promise |
| Async PVP griefing | Shields, Vault, matchmaking by army value, militia floor |
| Physics divergence across devices | Sim uses deterministic fixed-point-adjacent math for gameplay-critical checks; visual-only physics (helmets, confetti) can diverge freely |

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
