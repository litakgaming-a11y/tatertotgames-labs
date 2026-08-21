# ⛵ Tippy Ship — Game Design Document

**Hybrid-casual mobile game.** Unity 6 LTS · 2D pixel art · iOS + Android · portrait, one-handed.

> **Thesis:** *Your idle income is a recording of your best run.*

This is a **build spec**, not a pitch deck. It contains real coefficients, class contracts, a line-referenced physics port from the existing prototype, and an explicit cut list.

Source prototype: [`games/tippy-ship/play.html`](../../games/tippy-ship/play.html) — 2,439 lines, zero dependencies, and the authoritative reference for feel.

---

## Read in this order

| # | Document | What it settles |
|---|---|---|
| 00 | [Overview](00-overview.md) | Thesis, pillars, loop diagram, KPIs, assumptions |
| 01 | [Core Loop](01-core-loop.md) | Run anatomy, hold-to-lower input, greed curve, capsize, ad-continue |
| 02 | [Physics Port](02-physics-port.md) | Buoyancy port from `play.html`, constants, weld system, parity harness |
| 03 | [Economy](03-economy.md) | Typed cargo, coins, gems, formulas, faucets and sinks |
| 04 | [Progression](04-progression.md) | Route Rating, input tapes, upgrades, prestige, mastery curve |
| 05 | [Fleet & Ports](05-fleet-ports.md) | Hull archetypes, assignment, port tiers, building slots |
| 06 | [World & Content](06-world-content.md) | 8 regions, port authoring schema, Open Waters procgen |
| 07 | [Juice & Audio](07-juice-audio.md) | Tension Bus, channel table, the SAVED! release, ElevenLabs manifest |
| 08 | [UX & FTUE](08-ux-ftue.md) | Screens, HUD, bubble inclinometer, session-1 script, accessibility |
| 09 | [Monetization](09-monetization.md) | Ad placements, IAP catalogue, revenue model, UA creative |
| 10 | [Tech Architecture](10-tech-architecture.md) | Assembly wall, class contracts, determinism, UGS, save schema |
| 11 | [Art Pipeline](11-art-pipeline.md) | PixelLab / Higgsfield / ElevenLabs allocation, palette LUTs |
| 12 | [Live Ops](12-liveops.md) | Daily Contract, Weekly Regatta, Tide Pass, Remote Config surface |
| 13 | [Analytics & KPIs](13-analytics-kpi.md) | Event taxonomy, the five questions, soft-launch gates |
| 14 | [Milestones & Cut List](14-milestones-cutlist.md) | 27-week plan, cut order with blast radius, risk register |
| 15 | [Lessons From Prior Builds](15-lessons-from-prior-builds.md) | 28 mistakes already made in BlockRise / Gloamdelve / Kinfold / Mogul / One Armed Army / Rent Baron / Street Baron — and what changed here because of them |

**Tuning tables:** [physics-constants](tuning/physics-constants.md) · [economy-tables](tuning/economy-tables.md)

---

## The design in one page

```
PORTS produce TYPED CARGO ──► cargo is spent and RISKED on RUNS
  ▲                                          │
  │                                          ▼
  │              contract quota ──► SAIL live ×1.0 ──► push your luck
  │                                          │
  │                          ┌───────────────┼───────────────┐
  │                          ▼               ▼               ▼
  │                     bank clean     recover→SAVED!    CAPSIZE
  │                          │               │               │
  │                          └───────┬───────┘        cargo lost
  │                                  ▼
  │                     COINS + ROUTE RATING
  │                                  │
  │                                  ▼
  │              assign a hull ──► idle/hr = rating × suitability × tier
  └──────────────────────────────────┘
```

## The ten decisions that define this game

1. **Idle income is gated by manual skill.** Route Rating comes from your best hand-piloted run; the auto-fleet replays it. Physics can never become optional.
2. **Quota is the floor, not the challenge.** Every crate past it raises payout on a superlinear curve and raises the list. The player authors the difficulty.
3. **Cargo is real inventory, not an energy bar.** Your towns produce it; a capsize destroys it. The pacer is the economy.
4. **Cargo types are physics types.** Which buildings you place decides what you'll be stacking — and barrels roll.
5. **One touch does everything.** Touch locks the trolley, hold pays out the cable, release drops. Drop height is impact impulse; patience is the skill.
6. **The rewarded continue costs two crates and ends loading.** Stopping cleanly always dominates — proven in [01 §7](01-core-loop.md).
7. **Ships are archetypes with tradeoffs, and piloting one takes it off its earning route.** Every session opens with a deployment decision.
8. **Difficulty never rubber-bands.** A route that terrified you becoming routine *is* the progression.
9. **One Tension scalar drives every continuous feedback channel**, so the SAVED! moment releases as one body.
10. **Runs are deterministic input tapes.** They power live map replays, leaderboard validation, ghost races, and auto-generated UA creatives — for ~300 bytes each.

## Build order

Do not start anything until the parity harness is green. See [14 §5](14-milestones-cutlist.md).

```
1.  Unity 6 LTS, 2D URP, portrait, 540×960
2.  Assembly definitions + Roslyn analyzer banning Time/Random/DateTime/Input in Sim
3.  Port Mulberry32                        play.html:246
4.  Port WaterField                        play.html:563
5.  Port ClipBelowWater, PolyAreaCentroid  play.html:581, 596
6.  Port BuoyancySolver.ApplyHullForces    play.html:845
7.  Instrument play.html → golden CSV, seed 4471
8.  Write the parity test. Watch it fail. Fix until green.
9.  Only then: everything else.
```
