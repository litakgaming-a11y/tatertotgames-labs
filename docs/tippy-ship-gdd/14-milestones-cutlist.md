# 14 — Milestones, Cut List & Risks

Solo/small-team plan with AI-assisted asset generation. Durations assume one full-time developer.

---

## 1. Milestones

### M0 — Feel Parity (3 weeks) · **the gate that de-risks everything**

Nothing else starts until this passes.

| Deliverable | Done when |
|---|---|
| Unity project, assembly wall, banned-API analyzer | Sim assembly compiles headless with no `UnityEngine.Input` |
| `WaterField`, `BuoyancySolver`, `WeldSystem` ported | Code review against `play.html` line by line |
| Box2D contacts wired, inertia set explicitly | Assertion passes that `rb.inertia == base × 2.2` |
| Golden CSV exported from the web prototype | 3 seeds × 30 s of `hull.a`, `hull.y`, `subFrac` |
| **Parity harness green** | max Δ list < 0.5°, capsize and SAVED! agree exactly |
| Headless build runs the harness in CI | Blocking on every sim commit |

**This milestone is the whole project's risk.** If the port does not reproduce the feel, everything downstream is built on sand. Doing it first, with an automated check, means you find out in week 3 instead of month 5.

It also proves the headless sim, which is what Cloud Code tape validation needs — so the largest launch-scope risk in [10-tech-architecture.md §5](10-tech-architecture.md) is retired early.

### M1 — Vertical Slice (4 weeks)

One playable route, end to end, at shipping quality.

- Hold-to-lower input with full cable and swing behaviour
- Overload hand, greed curve, SAIL, wake test
- Capsize, ad-continue (stubbed ad), salvage
- Tension Bus with all channels, placeholder audio
- Bubble inclinometer, freeboard meter, run HUD
- Tugboat + Clipper, cargo types Crate / Timber / Barrel
- Result screen with rating

**Exit criterion:** ten external playtesters complete a run, and at least eight of them experience a `SAVED!` unprompted and comment on it.

### M2 — Core Loop (5 weeks)

- Tape recording and playback; ghost overlay
- Warehouse, typed cargo economy, all five types
- Route Rating, world map, Region 1 (14 ports)
- Port tiers 1–3, building slots, town silhouettes with tier-up celebration
- Fleet: 4 hulls, assignment, deployment screen, idle income
- Save schema with repair, local only
- FTUE sessions 1–4 including the rigged run

**Exit criterion:** a fresh player plays five sessions across three days without guidance and reaches Region 2.

### M3 — Meta & Content (6 weeks)

- Regions 2–5, ~50 ports authored
- Full hull roster (10 non-prestige), all upgrade tracks with visible art
- Port tiers 4–5, all buildings
- Prestige system
- Full art pass: PixelLab batches, palette LUTs, all towns
- Full audio: ElevenLabs SFX library, 5 region stem sets
- Settings, accessibility, localisation scaffolding

### M4 — Services & Live Ops (4 weeks)

- Full UGS: Auth, Cloud Save with conflict merge, Remote Config, Analytics, Leaderboards, Cloud Code
- Cloud Code tape validation against the headless sim
- LevelPlay mediation, all 8 rewarded placements, interstitial rules
- Unity IAP, full catalogue, receipt validation
- Daily Contract, Weekly Regatta, Tide Pass season 1
- Push notifications
- Full event instrumentation

### M5 — Polish & Soft Launch (4 weeks)

- Regions 6–7, remaining ports
- Open Waters procgen
- Device-floor performance pass
- UA creative harvesting pipeline; playable ad from the web build
- Store listings, Higgsfield key art and screenshots
- Soft launch: PH, ID, BR

### M6 — Tune & Scale (6+ weeks)

- Remote Config balance passes on live data
- A/B tests in the priority order from [12-liveops.md §5](12-liveops.md)
- Decision gates per [13-analytics-kpi.md §5](13-analytics-kpi.md)
- CA/UK monetization signal, then US scale

**Total to soft launch: ~26 weeks.**

## 2. Cut list

In cut order. Each line states what breaks and what does not.

| # | Cut | Saves | Breaks | Does not break |
|---|---|---|---|---|
| 1 | **Region 7 (Nightwatch)** | 2 wk | Late-game variety, the inclinometer payoff | Anything before ~day 150 |
| 2 | **Open Waters procgen** | 1.5 wk | The endless tail, Regatta thematic tie | Regions 1–7; Regatta still works on a fixed seed |
| 3 | **Region 6 (Monsoon)** | 2 wk | Squall mechanic | Everything before ~day 105 |
| 4 | **Prestige** | 1.5 wk | The 100 h+ retention answer | Everything before day 110 |
| 5 | **Weekly Regatta → v1.1** | 3 wk | Competitive layer, leaderboards, Cloud Code validation | Core loop, idle, dailies, season. **Tapes still recorded** so nothing is lost |
| 6 | **Ghost overlay** | 0.5 wk | Self-comparison feature | Tapes, map replays, validation |
| 7 | **Hulls 9–10** | 1 wk | Late roster depth | Assignment, suitability, collection |
| 8 | **Map replay insets** | 1 wk | The most literal expression of the thesis | The thesis itself, which the result screen still states |

**Never cut:** the parity harness, the rigged FTUE run, the bubble inclinometer, the Tension Bus, Regions 1–3, the hold-to-lower input, or the ad-continue cost structure. Each of those is load-bearing for a pillar.

If the schedule requires cuts 1–5, soft launch moves in at ~16 weeks with the core intact.

## 3. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Physics port loses the feel** | Medium | **Fatal** | M0 parity harness, blocking in CI, before any other work |
| R2 | `Rigidbody2D.inertia` silently reverting to auto | High | Severe | Explicit assertion in `Awake`; first item checked on any parity failure |
| R3 | Cross-platform float drift breaks tape validation | Medium | Moderate | 2% tolerance band, Burst strict float mode; fixed-point fallback for buoyancy only |
| R4 | Full UGS at launch overruns M4 | **High** | Severe | Headless sim proven in M0; Regatta is cut #5 and slips cleanly to 1.1 |
| R5 | Ad-continue flattens the greed decision | Medium | Severe | Cost structure in [01-core-loop.md §7](01-core-loop.md) makes clean stopping dominant; A/B test #3 validates empirically; stop-distribution chart is the tripwire |
| R6 | Pixel art hides fine list angles | Low | Severe | 540×960, sub-pixel physics rotation, bubble inclinometer. Verify on a 720p device in M1 |
| R7 | Generated pixel art drifts in style across batches | High | Moderate | Style anchor (Tugboat) locked first; batch by category; mandatory cleanup pass |
| R8 | Idle income makes manual play optional | Medium | Severe | Route Rating coupling is structural, not tuned. Watch `idleShareOfIncome` and `manualRunsPerSession` |
| R9 | Fleet pause reads as friction, not texture | Medium | Moderate | A/B test #5; fallback is to pause only during the run, excluding menus |
| R10 | Cargo economy leaves players locked out | Medium | Moderate | Relief Shipment; contract cargo substitution; warehouse-full analytics |
| R11 | Economy runs away in the late game | Medium | Moderate | Bounded rating (2.5) and suitability (1.8); 500-day economy sim in CI; `portTierCost` exponent is the first remote lever |
| R12 | Device-floor performance | Low | Moderate | Body count ≤ 24, 2 post passes, substep clamp at 6. Profile on the floor device from M1 |
| R13 | Solo-dev scope overrun | **High** | Severe | The cut list exists precisely for this. Review it at every milestone boundary, not at the end |

## 4. Definition of done, per feature

A feature is done when all of these are true:

1. It works on the device floor at 30 fps minimum.
2. It has analytics events serving a question in [13-analytics-kpi.md §2](13-analytics-kpi.md).
3. Its tunable constants are in Remote Config.
4. It respects reduced-motion, haptics-off, and the CVD palettes.
5. If it touches the sim, the parity harness is green.
6. If it touches save data, the schema migrates forward from the previous version.
7. Its strings are externalised.

## 5. What to build first, concretely

If you sit down tomorrow:

```
1.  Unity 6 LTS project, 2D URP, portrait, 540×960
2.  Assembly definitions: Sim / Game / Presentation / UI / Services / Tests
3.  Roslyn analyzer banning Time, Random, DateTime, Input inside Sim
4.  Port Mulberry32 from play.html:246
5.  Port WaterField (WaterYAt, WaterSlopeAt) from play.html:563
6.  Port ClipBelowWater + PolyAreaCentroid from play.html:581, 596
7.  Port BuoyancySolver.ApplyHullForces from play.html:845
8.  Instrument play.html to dump the golden CSV for seed 4471
9.  Write the parity test. Watch it fail. Fix until green.
10. Only then: everything else.
```

Step 8 before step 10 is the whole discipline of this project.
