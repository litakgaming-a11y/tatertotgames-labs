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

#### Owner-blocked checklist — opened in M0, not at build audit

Rent Baron reached a submittable tree and *then* discovered six blockers that no amount of engineering could clear ([15-lessons-from-prior-builds.md L22](15-lessons-from-prior-builds.md)). None of these are development work, and every one can stop a submission, so they go in flight in week one and are reviewed at every milestone boundary:

- [ ] Apple Developer + Google Play accounts, app records created
- [ ] Keystore generated, **backed up off-machine**, passwords recorded in a password manager (L23 — keystore passwords are not serialised and must be re-entered per build)
- [ ] Privacy policy, terms and support pages **hosted at live URLs**
- [ ] LevelPlay / mediation app ids for both platforms
- [ ] UGS project linked; Cloud Save and Leaderboards enabled on the dashboard
- [ ] Store IAP products created, matching the SKU table in [09-monetization.md §4](09-monetization.md)
- [ ] **Store keys for server-side receipt validation** (L25 — without them, `VerifyReceipt` accepts any well-shaped receipt; a test asserts an unsigned receipt is rejected)
- [ ] Physical device-floor handset acquired
- [ ] Push / APNs / Firebase projects created

#### Project logs, from day one

Adopt the convention every mature project in this group converged on ([L27](15-lessons-from-prior-builds.md)): `DECISIONS.md` (`T-001…`) for *why*, `PATCH.md` (`P-001…`) for *what broke and how the fix was verified*, `AUDIT.md` for *the shape of the system now*. Commits cite the id — `fix(P-014): …`. Take the next free id **by script, never by eye** ([L28](15-lessons-from-prior-builds.md)); Kinfold carries a permanent renumbering table because four ids came to name two things each.

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

### M3 — Meta & Content (7 weeks)

- Regions 2–5, ~50 ports authored
- Full hull roster (10 non-prestige), all upgrade tracks with visible art
- Port tiers 4–5, all buildings
- Prestige system
- Full art pass: PixelLab batches, palette LUTs, all towns
- Full audio: ElevenLabs SFX library, 5 region stem sets
- Settings, accessibility, localisation scaffolding
- **Regatta infrastructure spike (1 wk)** — leaderboard write path plus the headless re-sim harness proven end to end on a real submitted tape

The spike is deliberately pulled forward out of M4. The Weekly Regatta is committed v1.0 scope, so its riskiest dependency must be proven while there is still schedule ahead of it rather than four weeks before soft launch. M0 already delivers the headless sim; this spike proves it can be driven from Cloud Code.

### M4 — Services & Live Ops (4 weeks)

- Full UGS: Auth, Cloud Save with conflict merge, Remote Config, Analytics, Leaderboards, Cloud Code
- Cloud Code tape validation productionised on the M3 spike
- LevelPlay mediation, all 8 rewarded placements, interstitial rules
- Unity IAP, full catalogue, receipt validation
- Daily Contract, **Weekly Regatta (v1.0 scope)**, Tide Pass season 1
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

**Total to soft launch: ~27 weeks.**

## 2. Cut list

In cut order. Each line states what breaks and what does not.

| # | Cut | Saves | Breaks | Does not break |
|---|---|---|---|---|
| 1 | **Region 7 (Nightwatch)** | 2 wk | Late-game variety, the inclinometer payoff | Anything before ~day 150 |
| 2 | **Open Waters procgen** | 1.5 wk | The endless tail | Regions 1–7; the Regatta runs on its own fixed seed |
| 3 | **Region 6 (Monsoon)** | 2 wk | Squall mechanic | Everything before ~day 105 |
| 4 | **Prestige** | 1.5 wk | The 100 h+ retention answer | Everything before day 110 |
| 5 | **Per-submission tape re-sim → v1.1** | 2 wk | Exact anti-cheat at launch | **The Regatta itself ships.** See §2.1 |
| 6 | **Ghost overlay** | 0.5 wk | Self-comparison feature | Tapes, map replays, validation |
| 7 | **Hulls 9–10** | 1 wk | Late roster depth | Assignment, suitability, collection |
| 8 | **Map replay insets** | 1 wk | The most literal expression of the thesis | The thesis itself, which the result screen still states |
| 9 | **Region 5 (Ice Run)** | 2 wk | Icing mechanic, Icebreaker hull's reason to exist | Everything before ~day 70 |
| 10 | **Tide Pass premium track** | 1 wk | The recurring IAP; ship the free track only | Season progression, quests, rewards |

**Never cut:** the parity harness, the rigged FTUE run, the bubble inclinometer, the Tension Bus, Regions 1–3, the hold-to-lower input, the ad-continue cost structure, or **the Weekly Regatta**. Each is load-bearing for a pillar or a committed v1.0 feature.

If the schedule requires cuts 1–5, soft launch moves in at ~18 weeks with the core and the Regatta intact.

### 2.1 Graceful degradation of Regatta validation

The Regatta is committed to v1.0. Its *validation* is not — and that separation is what makes the commitment safe.

| | v1.0 (if cut 5 is taken) | v1.1 |
|---|---|---|
| Leaderboard | Live | Live |
| Competition, replays, rewards | Live | Live |
| Tape captured and retained | Yes, every submission | Yes |
| Validation | **Ceiling + outlier heuristic** | Per-submission headless re-sim |
| Cloud Code cost | One offline run per week | Per submission |

**The ceiling heuristic.** Because every player sails the identical seed, you can simulate that seed once, offline, before the week opens — an automated agent playing near-optimally establishes a plausible maximum. Any submission above it is rejected outright; submissions in the top percentile are flagged for manual review; malformed or absent tapes are rejected. This costs one headless run per week instead of per-submission infrastructure, and it catches the crude cheating that actually happens on a week-one leaderboard.

Because every tape is **retained regardless**, v1.1's exact re-simulation can be run retroactively over the archive and boards retro-corrected. Nothing is lost by deferring it — only precision is, and only temporarily.

This is the pattern to reach for whenever a committed feature has an expensive component: degrade the component, never the feature.

## 3. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Physics port loses the feel** | Medium | **Fatal** | M0 parity harness, blocking in CI, before any other work |
| R2 | `Rigidbody2D.inertia` silently reverting to auto | High | Severe | Explicit assertion in `Awake`; first item checked on any parity failure |
| R3 | Cross-platform float drift makes the client's local score differ from the server's | Medium | **Low** — downgraded | Since the server derives the score and the client adopts it (L3), drift is a display concern, not a validation one. Burst strict float mode keeps the gap small; fixed-point fallback for buoyancy only if it ever becomes visible |
| R4 | Full UGS at launch overruns M4 | **High** | Severe | Headless sim proven in M0; Regatta write path proven by the M3 spike. The Regatta no longer slips — cut #5 degrades its *validation* to the ceiling heuristic (§2.1) while the feature ships |
| R4b | **Regatta ships with weak anti-cheat and the board is visibly gamed** | Medium | Moderate | Ceiling heuristic rejects the crude cases; every tape is retained so v1.1 re-simulates retroactively and retro-corrects. Watch `regatta_rejected` rate and top-percentile score distribution weekly |
| R5 | Ad-continue flattens the greed decision | Medium | Severe | Cost structure in [01-core-loop.md §7](01-core-loop.md) makes clean stopping dominant; A/B test #3 validates empirically; stop-distribution chart is the tripwire |
| R6 | Pixel art hides fine list angles | Low | Severe | 540×960, sub-pixel physics rotation, bubble inclinometer. Verify on a 720p device in M1 |
| R7 | Generated pixel art drifts in style across batches | High | Moderate | Style anchor (Tugboat) locked first; batch by category; mandatory cleanup pass |
| R8 | Idle income makes manual play optional | Medium | Severe | Route Rating coupling is structural, not tuned. Watch `idleShareOfIncome` and `manualRunsPerSession` |
| R9 | Fleet pause reads as friction, not texture | Medium | Moderate | A/B test #5; fallback is to pause only during the run, excluding menus |
| R10 | Cargo economy leaves players locked out | Medium | Moderate | Relief Shipment; contract cargo substitution; warehouse-full analytics |
| R11 | Economy runs away in the late game | Medium | Moderate | Bounded rating (2.5) and suitability (1.8); 500-day economy sim in CI; `portTierCost` exponent is the first remote lever |
| R12 | Device-floor performance | Low | Moderate | Body count ≤ 24, 2 post passes, substep clamp at 6. Profile on the floor device from M1 |
| R13 | Solo-dev scope overrun | **High** | Severe | The cut list exists precisely for this. Review it at every milestone boundary, not at the end |
| R14 | **Tape serialisation silently drops a field; re-sim diverges; the determinism test stays green** | **High** | Severe | Bitten Kinfold for months ([L1](15-lessons-from-prior-builds.md)). Parity harness replays from serialised bytes; `Tape_FieldCoverage` reflection test fails on any unwritten field |
| R15 | **Save migration data loss on a 200-hour account** | Medium | **Fatal to trust** | Bitten Gloamdelve ([L5](15-lessons-from-prior-builds.md)). Read version first, reject newer outright, ordered migrations, fixture save per historical version in CI |
| R16 | **32 music stems at DecompressOnLoad → OOM on the device floor** | **High** if unspecified | Severe | Rent Baron measured 6 clips at ≈140 MB ([L11](15-lessons-from-prior-builds.md)). Streaming Vorbis; only the current region's 4 stems resident; CI check on import settings |
| R17 | **First-session lull invisible to a day-granularity sim** | **High** | Severe | Street Baron shipped the same bug twice ([L7](15-lessons-from-prior-builds.md)). `FirstArcSim` at per-minute granularity asserts no gap > 40 s |
| R18 | **Art service access lost; a gameplay-critical slot ships blank** | Medium | Severe | Street Baron's most important art slot shipped as a blank purple square ([L21](15-lessons-from-prior-builds.md)). All gameplay-critical sprites generated and committed in M1; designed placeholders only |
| R19 | Linear colour space washes out the Tension Bus vignette | Medium | Moderate | Mogul lost three debug loops to this ([L14](15-lessons-from-prior-builds.md)). Single `Srgb()` helper on every colour channel; reference-screenshot check in M1 |

## 4. Definition of done, per feature

A feature is done when all of these are true:

1. It works on the device floor at 30 fps minimum.
2. It has analytics events serving a question in [13-analytics-kpi.md §2](13-analytics-kpi.md).
3. Its tunable constants are in Remote Config.
4. It respects reduced-motion, haptics-off, and the CVD palettes.
5. If it touches the sim, the parity harness is green.
6. If it touches save data, the schema migrates forward from the previous version.
7. Its strings are externalised.
8. If it serialises anything, a test round-trips it **through the wire format**, not in memory ([L1](15-lessons-from-prior-builds.md)).

Note that every clause is machine-checkable or device-observable. Rent Baron's build audit opens by stating it checked the code and project settings "not against `PROGRESS.md`'s claims" ([L26](15-lessons-from-prior-builds.md)) — a milestone is exited by a green suite and a device, never by a document asserting completion.

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
