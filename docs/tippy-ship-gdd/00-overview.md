# 00 — Overview

> **Tippy Ship** — hybrid-casual mobile game.
> Unity 6 LTS · 2D pixel art · iOS + Android · portrait, one-handed.
>
> Build spec. Written to be executed against, not admired.

---

## 1. Thesis

> **Your idle income is a recording of your best run.**

Every other decision in this document descends from that sentence. It is the joint that welds a twitch-skill buoyancy sim to an idle port-builder economy without either one making the other pointless.

- The **skill layer** (hand-piloted loading) sets a **Route Rating**.
- The **idle layer** (auto-fleet) replays that rating forever as passive income.
- Idle income never invents value the player did not earn by hand.
- Therefore the physics can never become optional. It is the only faucet.

## 2. What already exists

The playable prototype lives at [`games/tippy-ship/play.html`](../../games/tippy-ship/play.html) — 2,439 lines, one self-contained file, zero dependencies. It is not a mockup. It contains a working custom rigid-body solver and a genuine displaced-area buoyancy model, and it is the **authoritative reference for feel**. See [02-physics-port.md](02-physics-port.md).

| Already proven in the prototype | Status for v1 |
|---|---|
| Displaced-area buoyancy, centre-of-buoyancy vs centre-of-mass roll torque | **Port verbatim** |
| Impulse solver, SAT contacts, weld-to-hull sleeping | Box2D for contacts; **port the weld** |
| Warn → slow-mo → heartbeat → `SAVED!` near-miss arc | **Port verbatim**, then amplify |
| Slow-motion capsize as comedy, not punishment | **Port verbatim** |
| Cargo archetypes (cube / plank / barrel / gold / fragile) | Promote to **economy resources** |
| Wake test, wind gusts, seagull weight, night routes | Promote to **region mechanics** |
| Sim-visible upgrades (beam, ballast, deck grip, crane) | Expand into hull archetypes |
| Port map where delivered ports light up | Expand into **the actual economy** |

## 3. Design pillars

**P1 — The boat is legible.**
A player who has never seen the game must be able to look at the screen and know the boat is in trouble. The waterline is the highest-contrast edge on screen at all times. Cargo silhouette encodes mass. The bubble inclinometer states the roll numerically. Nothing may obscure these three.

**P2 — Greed is the game.**
Quota is never the challenge. The challenge is a number the player chooses. Every run is authored by the player's own appetite, so every outcome is their story and not the game's.

**P3 — Feedback moves as one body.**
All continuous feedback derives from a single `Tension` scalar. When tension releases, every channel releases in the same beat. This is why `SAVED!` lands. See [07-juice-audio.md](07-juice-audio.md).

**P4 — Nothing rubber-bands.**
Authored difficulty, permanently. The feeling that a route which once terrified you is now routine *is* the progression. Scaling content to fleet power would delete it.

**P5 — Idle serves skill, never replaces it.**
Every passive system exists to make the next manual run more meaningful — more cargo to risk, a better hull to risk it in, a bigger multiplier to chase.

## 4. The loop, one page

```
                  ┌──────────────────────────────────────────┐
                  │              PORT BUILDER                │
                  │  Coins ──► Port Tier ──► Building Slot   │
                  │                              │           │
                  │                              ▼           │
                  │                    produces TYPED CARGO  │
                  └──────────────┬───────────────────────────┘
                                 │ accrues offline
                                 ▼
                          ┌─────────────┐
                          │  WAREHOUSE  │ ◄── the session pacer
                          └──────┬──────┘      (no energy bar)
                                 │ spend + risk
                                 ▼
        ┌─────────────────────────────────────────────────────┐
        │                     THE RUN                          │
        │                                                      │
        │  contract quota ──► SAIL goes live ×1.0              │
        │                          │                           │
        │                          ▼                           │
        │            ┌──► pick overload card ──┐               │
        │            │    (×1.2 / ×1.5 / ×2.1) │               │
        │            │    hold-to-lower, drop  │               │
        │            └───────────┬─────────────┘               │
        │                        ▼                             │
        │              list rises · TENSION rises               │
        │                        │                             │
        │        ┌───────────────┼───────────────┐             │
        │        ▼               ▼               ▼             │
        │     SAIL NOW    recover → SAVED!    CAPSIZE          │
        │        │               │             │  │            │
        │        │               └─────────────┘  │            │
        │        ▼                                ▼            │
        │   wake test ──► DELIVERED          cargo lost        │
        └────────┬────────────────────────────────┬────────────┘
                 │                                │
                 ▼                                ▼
         Coins + ROUTE RATING              🎥 salvage 40%
                 │
                 ▼
        ┌────────────────────────────────────────┐
        │  FLEET: assign a hull to that route    │
        │  idle/hr = Rating × suitability × tier │
        └────────────────┬───────────────────────┘
                         │
                         └──► Coins ──► back to PORT BUILDER
```

## 5. Audience & positioning

**Primary.** 25–45, plays hybrid-casual idle/tycoon (*My Perfect Hotel*, *Idle Arks*, *Hexa Sort*). Wants a game that respects a five-minute window but rewards a long account.

**Secondary.** The physics-toy audience (*Poly Bridge*, *Human Fall Flat*) who come for the sim and stay for the sadistic pleasure of over-loading a barge.

**Positioning line.** *"A boat that really floats, and an economy that runs on how well you load it."*

**Why it converts to installs.** Everyone on earth understands a boat about to tip. No tutorial is required for the hook. The creative writes itself: a list angle, a heartbeat, a recovery. See [09-monetization.md §6](09-monetization.md).

## 6. KPI targets (soft-launch gates)

| Metric | Target | Kill-gate |
|---|---|---|
| D1 retention | 45% | < 35% |
| D7 retention | 18% | < 12% |
| D30 retention | 6% | < 3.5% |
| Session length | 5–7 min | < 3 min |
| Sessions / DAU / day | 4–6 | < 2.5 |
| ARPDAU (blended) | $0.06–0.12 | < $0.03 |
| Rewarded views / DAU | 4–7 | < 2 |
| IAP conversion | 1.8–3% | < 0.8% |
| Tutorial completion | > 85% | < 70% |
| Crash-free sessions | > 99.5% | < 99% |

Soft-launch markets: **PH, ID, BR** for retention and funnel, then **CA, UK** for monetization signal before US scale.

## 7. Platform & performance targets

| | |
|---|---|
| Engine | Unity 6 LTS, 2D, URP-2D |
| Orientation | Portrait only, one-handed reachable |
| Logical resolution | 540 × 960, point-filtered |
| Device floor | 2018-era Android, 3 GB RAM, Snapdragon 660-class |
| Frame target | 60 fps; 30 fps hard floor on the device floor |
| Physics step | Fixed 1/150 s — see [02-physics-port.md](02-physics-port.md) |
| Install size | < 150 MB |
| Cold start to first input | < 4 s |

## 8. Document map

| File | Contents |
|---|---|
| [01-core-loop.md](01-core-loop.md) | Run anatomy, input, greed curve, capsize, ad-continue |
| [02-physics-port.md](02-physics-port.md) | Buoyancy port from `play.html`, constants, parity harness |
| [03-economy.md](03-economy.md) | Cargo types, currencies, formulas, faucets and sinks |
| [04-progression.md](04-progression.md) | Route Rating, input tapes, upgrades, prestige |
| [05-fleet-ports.md](05-fleet-ports.md) | Hull archetypes, assignment, port tiers, buildings |
| [06-world-content.md](06-world-content.md) | Regions, port authoring, Open Waters procgen |
| [07-juice-audio.md](07-juice-audio.md) | Tension Bus, feedback channels, adaptive score |
| [08-ux-ftue.md](08-ux-ftue.md) | Screens, HUD, session-1 script, unlock ladder, a11y |
| [09-monetization.md](09-monetization.md) | Ad placements, IAP, pricing, UA creative |
| [10-tech-architecture.md](10-tech-architecture.md) | Class contracts, determinism, UGS, save schema |
| [11-art-pipeline.md](11-art-pipeline.md) | PixelLab / Higgsfield / ElevenLabs pipeline |
| [12-liveops.md](12-liveops.md) | Daily contract, Weekly Regatta, season pass, remote config |
| [13-analytics-kpi.md](13-analytics-kpi.md) | Event taxonomy, funnels, dashboards |
| [14-milestones-cutlist.md](14-milestones-cutlist.md) | Phases, cut list, risk register |
| [tuning/](tuning/) | Raw constant tables |

## 9. Assumptions of record

Decided by the author of this spec rather than resolved in review. Overturn them explicitly if wrong.

1. Session target ~5–7 min, 4–6 sessions/day, individual runs 45–75 s.
2. Device floor as §7. No support below 3 GB RAM.
3. Portrait-only. No tablet-specific layout in v1 (scale and letterbox).
4. Soft-launch markets as §6.
5. Accessibility baseline: colour-blind-safe cargo palette with shape redundancy, haptics toggle, reduced-motion mode disabling camera dutch and screen shake. See [08-ux-ftue.md §7](08-ux-ftue.md).
6. English-only at soft launch; localisation-ready strings from day one.
