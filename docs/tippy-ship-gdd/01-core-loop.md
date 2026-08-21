# 01 — Core Loop

The run is the whole product. Everything else exists to make the next run matter more.

---

## 1. Run anatomy

| Phase | Duration | Player action | State |
|---|---|---|---|
| **Brief** | 1.5 s (skippable) | none | Contract card slides in, hull settles at rest draft |
| **Quota load** | 12–30 s | hold-to-lower each mandated crate | `SAIL` locked, multiplier hidden |
| **Overload** | 0–40 s | pick a card, hold-to-lower, decide again | `SAIL` live, multiplier climbing |
| **Wake test** | 3.4 s | none — watch | Ferry passes, `WAKE` displaces the water |
| **Settle** | 1.2 s | none | Hull rights, payout tallies |
| **Result** | 3–6 s | tap through / rewarded | Coins, Route Rating delta, port growth |

Target total: **45–75 s**. The Brief and Result are the only skippable parts and they must both be skippable by tapping anywhere.

## 2. Input — one continuous touch

This is the single most important interaction in the game. It replaces the prototype's `releaseCrate()` tap.

```
  TOUCH DOWN   → trolley LOCKS at the touched x (clamped to trolleyRange)
               → winch engages, cable begins paying out
               → winch whine starts, pitch falls as the crate descends

  HOLD         → crate descends at CABLE_SPEED (modified by Crane upgrade)
               → crate swings on the cable with pendulum damping
               → the hull is already reacting to nothing yet — no load applied

  DRAG (while holding) → trolley re-positions, cable stays paid out
               → the crate swings; releasing mid-swing imparts lateral velocity

  RELEASE      → crate detaches with its current position and velocity
               → free-fall from wherever it is
```

### Why this and not a tap

The tap tests reflexes. The hold tests *judgement about the sim*, which is the thing worth testing. Drop height maps directly to impact impulse, and impact impulse is what spikes the list on an already-heeling hull.

| Release height above stack | Impact impulse | Typical list spike at 22° |
|---|---|---|
| 4 px (kissed on) | ~0.15 × m·g | +0.4° |
| 40 px | ~0.9 × m·g | +2.1° |
| 160 px (full height) | ~2.6 × m·g | +8.7° |

**Design consequence:** patience under pressure is the skill. The player who calmly lowers at 26° of list beats the player who panics and drops. That is exactly the emotion buoyancy wants.

### Input parameters

| Constant | Value | Notes |
|---|---|---|
| `CABLE_SPEED` | 96 u/s | Base descent rate |
| `CABLE_SPEED` per Crane tier | +14 u/s | 4 tiers → 152 u/s at max |
| `CABLE_MAX_LEN` | 210 u | Cannot lower below deck level + 2 |
| `TROLLEY_SWEEP` | 92 + min(58, difficulty × 3) u/s | Ported from prototype |
| `SWING_DAMP` | 2.4 | Pendulum damping on the cable |
| `TROLLEY_RANGE` | `hullHalfW() + 74` | Ported from prototype |
| Touch slop | 12 px | Below this, a drag is treated as a hold |

### Accessibility variant

**Assisted Lower** (toggle, Settings): the crate auto-descends to 6 px above the highest contact under it, and the player taps once to release. Removes the hold-duration motor demand. Costs a flat −8% payout multiplier so it is a comfort option, not a strategy.

## 3. The greed curve

Quota is the floor. Everything past it is a bet.

```
multiplier(n) = 1.0 + Σ(k=1..n) cardWeight(k) × GREED_STEP × GREED_ACCEL^(k-1)
```

| Constant | Value |
|---|---|
| `GREED_STEP` | 0.20 |
| `GREED_ACCEL` | 1.18 |
| `cardWeight` Crate | 1.0 |
| `cardWeight` Timber | 1.3 |
| `cardWeight` Barrel | 1.6 |
| `cardWeight` Glassware | 1.9 |
| `cardWeight` Bullion | 2.4 |

Worked example, all-Crate overload:

| Overload crates | Multiplier |
|---|---|
| 0 | ×1.00 |
| 1 | ×1.20 |
| 2 | ×1.44 |
| 3 | ×1.72 |
| 4 | ×2.05 |
| 5 | ×2.44 |
| 6 | ×2.90 |
| 8 | ×4.09 |
| 10 | ×5.71 |

The curve is **superlinear on purpose**. Each additional crate is worth more than the last, so the marginal temptation grows exactly as the marginal risk grows. That is the engine of the decision.

## 4. The overload hand

After quota is met, a **3-card hand** is drawn from the warehouse.

```
┌─────────────────────────────────────────────────┐
│  CONTRACT  5× Bullion → Fogport      ✅ 5 / 5   │
│  LIST 14°   FREEBOARD 62%    ⚓ ×1.00           │
├─────────────────────────────────────────────────┤
│  OVERLOAD — choose one                          │
│                                                 │
│   📦 Crate      ×1.20   light · stacks flat     │
│   🛢️ Barrel     ×1.52   ⚠ rolls                 │
│   🥇 Bullion    ×2.08   ⚠⚠ heavy · sits low     │
│                                                 │
│                         🎥 reroll (1 left)      │
├─────────────────────────────────────────────────┤
│              ⚑  SAIL NOW  ×1.00                 │
└─────────────────────────────────────────────────┘
```

**Draw rules**

1. Cards are drawn without replacement from warehouse stock, weighted by quantity held.
2. The hand is guaranteed to contain **at least one card of weight ≤ 1.3** — the player is never forced into a reckless choice.
3. The hand is guaranteed to contain **at least one card of weight ≥ 1.6** if any such stock exists — the temptation is always present.
4. Draw uses the run's seeded RNG so the hand is reproducible from the input tape.
5. One free reroll per run via rewarded ad. See [09-monetization.md](09-monetization.md).

**Why cards and not a menu.** A pre-run loadout screen buries the physics behind UI and kills pick-up-and-play. A 3-card hand puts the entire strategic decision inside the run, at the exact moment the tension is highest, and costs one thumb-tap.

## 5. Failure states

| State | Trigger | Consequence |
|---|---|---|
| **Overboard** | Cargo centre crosses the waterline outside `hull.w/2 + 26` | That crate is lost. Run continues. `lost++` |
| **Crunch** | Glassware with `crush > 0.35` or `impulseFromAbove > m × 150` | That crate is destroyed. Run continues. `lost++` |
| **Quota broken** | Aboard count falls below quota with no stock left | Run fails. Cargo consumed, no payout |
| **Capsize** | `abs(hull.a) > CAPSIZE_ANG` (0.70 rad ≈ 40°) | Entire load lost unless the player takes the continue |

Note the asymmetry: losing *some* cargo is survivable and merely reduces the payout, while capsizing loses *everything*. This is what makes the marginal crate a genuine bet rather than a graded score.

## 6. The near-miss arc — the crown jewel

Ported verbatim from the prototype, then amplified by the Tension Bus.

| Threshold | Constant | Radians | Degrees | Effect |
|---|---|---|---|---|
| Warn | `WARN_ANG` | 0.44 | ≈ 25° | `timeScale → 0.55`, heartbeat begins, "⚠ TIPPING!" |
| Saved | `SAVED_ANG` | 0.28 | ≈ 16° | Recovery latch fires → "SAVED!" |
| Capsize | `CAPSIZE_ANG` | 0.70 | ≈ 40° | `timeScale → 0.32`, slow-motion capsize |

**The latch.** `savedPending` arms on crossing `WARN_ANG` and only fires on falling back below `SAVED_ANG`. The 9° hysteresis band is deliberate — without it, chop would spam the message and destroy its meaning. **Do not narrow this band.**

The `SAVED!` beat is the emotional product. When it fires, every Tension Bus channel releases in the same frame: music swells, low-pass opens, gulls return, camera un-dutches, vignette snaps to teal, a gold particle burst, a 15 ms haptic pop. See [07-juice-audio.md §4](07-juice-audio.md).

## 7. Capsize and the rewarded continue

```
  abs(hull.a) > CAPSIZE_ANG
        │
        ▼
  timeScale = 0.32 · screen shake 9 · "CAPSIZE!!"
        │
        ▼
  ┌──────────────────────────────────────┐
  │   🎥  RIGHT HER!          ⏱ 4 s      │   ← once per run
  │       [ WATCH ]    [ LET HER GO ]    │
  └──────────────────────────────────────┘
        │                       │
     watched                  declined
        │                       │
        ▼                       ▼
  hull heaves upright      full capsize
  top 2 overload crates    ALL cargo lost
  visibly tumble 🌊🌊       │
  multiplier recomputed         ▼
  LOADING CLOSES           🎥 SALVAGE 40%
        │
        ▼
  ⚑ SAILING immediately
```

### Why the continue does not break the game

The continue is only reached by capsizing, and capsizing always costs the top two overload crates plus all further loading. Therefore:

```
value(stop cleanly at n)      = base × mult(n)
value(push to capsize, saved) = base × mult(n − 2)      [and the run ends]
```

Since `mult` is strictly increasing, `mult(n) > mult(n−2)` for all n. **Stopping cleanly always dominates.** The continue is a loss-mitigation tool, never a strategy. This is the property that had to hold, and it holds by construction.

Worked example from the mock: a player at ×2.44 (5 overload crates) who pushes to 6, capsizes, and takes the continue lands at `mult(4)` = ×2.05. They lose 16% versus having stopped, plus an ad view. A player who stops at ×2.90 beats both.

**Hard rules**
- Once per run. No gem purchase to reset it. No second continue at any price.
- The two shed crates must be **visibly animated overboard**, not silently deducted. The player must see what greed cost.
- Never offered on quota-break failure, only on capsize.

## 8. Wake test

Ported from the prototype. A ferry crosses over 3.4 s while `WAKE` adds a travelling sine to the water surface.

```
waterYAt(x) += sin(x × 0.045 − WAKE.ph) × WAKE.amp × WAKE.env
WAKE.env     = sin(π × clamp(sailT / 3.4, 0, 1))       // rises then falls
WAKE.amp     = 8 + regionWakeBonus                      // authored per region
WAKE.ph     += dt × 9
```

The envelope means the wake builds and subsides — the peak danger is at `sailT ≈ 1.7 s`. A load that was stable at rest can still capsize here, which is why the player's stopping decision must account for a margin they cannot see. That uncertainty is a feature: it is what makes the safe multiplier a *judgement* rather than a calculation.

**Critical:** `wakeAll()` must be called on wake start so no welded sleeper misses the event. See [02-physics-port.md §6](02-physics-port.md).

## 9. Scoring and Route Rating

```
runValue   = Σ(surviving cargo saleValue) × multiplier × hullBonus
cleanBonus = lost == 0 ? 1.15 : 1.0
runScore   = runValue × cleanBonus

routeRating = clamp(runScore / routeParScore, 0, 2.5)
```

`routeParScore` is authored per port (see [06-world-content.md](06-world-content.md)) and represents a competent clean run with a modest overload. A rating of 1.0 is "solid". Ratings above 1.0 are available to good players and feed directly into idle income.

Route Rating is **best-of-all-attempts, never averaged**. Retrying is always safe for progression; only cargo is at risk. See [04-progression.md](04-progression.md).

## 10. Session shape

A representative 6-minute session:

```
  0:00  open → offline cargo collection popup   🎥 ×2 offline
  0:20  fleet screen → is my Barge free?
  0:35  deployment decision: pull the Barge or take the Tug
  0:50  RUN 1  (Daily Contract, streak ×4)          75 s
  2:05  result → 🎥 ×2 payout → port tier up → town animates
  2:35  RUN 2  (Fogport, chasing a better rating)   60 s
  3:35  capsize → 🎥 RIGHT HER! → sails at ×1.6
  4:10  RUN 3  (Saltbay, safe bank run)             55 s
  5:05  spend Coins: Cooperage at Saltbay
  5:30  reassign Barge to the Bullion route
  5:50  close
```

Four ad impressions, three runs, two economy decisions, one deployment decision, one visible town growth beat. That is the target texture.

## 11. Open questions for tuning

- `GREED_ACCEL` at 1.18 may prove too aggressive past 10 crates; the curve should be remote-config driven from day one.
- Wake-test peak danger at 1.7 s may need a telegraph (a horn, a visible bow wave) for readability on the device floor.
- Whether the 3-card hand should ever contain a **duplicate** of the contract cargo type is unresolved; it makes the hand more thematic but reduces variety.
