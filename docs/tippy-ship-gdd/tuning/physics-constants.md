# Tuning — Physics Constants

Every value traceable to [`games/tippy-ship/play.html`](../../../games/tippy-ship/play.html). Line references are to that file.

---

## Core simulation

| Constant | Value | Source line | Notes |
|---|---|---|---|
| `G` | 1300 | 528 | Gravity, world u/s² |
| `RHO` | 1.0 | 529 | Water density. Hull at 0.34 floats at ~34% draft |
| `PH` | 1/150 | 530 | Fixed substep. **Do not change** — all tuning assumes it |
| `VEL_ITERS` | 8 | 531 | Prototype solver; Box2D equivalent |
| `POS_ITERS` | 2 → 3 | 531 | Box2D default of 3 is fine |
| `SLOP` | 0.6 | 532 | Contact penetration slop |
| `POS_PCT` | 0.4 | 532 | Positional correction factor |
| `MAX_V` | 1900 | 533 | Linear velocity clamp |
| `MAX_VA` | 9 | 533 | Angular velocity clamp |
| `TERMINAL_FALL` | 640 | 911 | Cargo terminal fall speed — keeps landings thunky |

## Roll thresholds

| Constant | rad | deg | Source line | Effect |
|---|---|---|---|---|
| `SAVED_ANG` | 0.28 | 16.0° | 536 | Recovery latch fires |
| `WARN_ANG` | 0.44 | 25.2° | 535 | `timeScale → 0.55`, heartbeat, "TIPPING!" |
| `CAPSIZE_ANG` | 0.70 | 40.1° | 534 | `timeScale → 0.32`, capsize |

**Hysteresis band: 9.2°.** Do not narrow. See [01-core-loop.md §6](../01-core-loop.md).

| Time scales | Value | Source |
|---|---|---|
| Normal | 1.0 | — |
| Warning | 0.55 | 1404 |
| Capsize | 0.32 | 1256 |
| Release ramp | 0.25 s ease-out | new |

## Hull

| Constant | Value | Source line |
|---|---|---|
| `HULL_DENS` | 0.34 | 537 |
| `HULL_W0` | 184 | 538 |
| `HULL_H` | 52 | 538 |
| `KEEL_INERTIA_MULT` | **2.2** | 557 |
| Hull `mu` | `deckMu()` | 551 |
| Hull `e` | 0.02 | 551 |
| Start draft | `-H/2 + (m/RHO)/(2·halfW)` | 560 |

`KEEL_INERTIA_MULT` is the single most important number in the project. See [02-physics-port.md §4](../02-physics-port.md).

## Hull force coefficients

From `applyHullForces()`, line 845.

| Term | Coefficient | Line |
|---|---|---|
| Water-line samples | 7 | 853 |
| Sample span | `hull.w/2 + 10` | 851 |
| Clip span | ±120 | 863 |
| Buoyant force | `RHO × G × displacedArea` | 867 |
| Roll torque | `-(cb.x − com.x) × Fb` | 871 |
| Linear drag X | `/(1 + 3.0·q·dt)` | 874 |
| Linear drag Y | `/(1 + 6.0·q·dt)` | 875 |
| Angular drag | `/(1 + (6.5·q + 1.0)·dt)` | 876 |
| Wave slope sway | `slope × 40 × q` | 878 |
| Ballast righting | `-sin(a) × (1.2 + 0.6·tier) × 2.6` | 890 |
| Mooring spring | `(-2.2·x − 1.6·vx)` | 892 |
| Wind linear | `gust × 0.16` | 896 |
| Wind torque | `gust × 0.00055` | 897 |
| Gull weight | `gull.w × G` at `halfW − 12` | 901–905 |

## Cargo force coefficients

From `applyCargoForces()`, line 909.

| Term | Coefficient | Line |
|---|---|---|
| Buoyancy | `G × (RHO/dens) × frac` | 919 |
| Linear drag X | `/(1 + 3.0·frac·dt)` | 920 |
| Linear drag Y | `/(1 + 3.4·frac·dt)` | 921 |
| Angular drag | `/(1 + 2.0·frac·dt)` | 922 |
| Wind on airborne | `gust × 0.10` | 926 |
| Settle damping | `/(1 + 1.5·dt)` when touching | 928 |
| Barrel roll resist | `va /(1 + 4.5·dt)`, `vx /(1 + 0.8·dt)` | 930 |

## Cargo types

| Type | Shape | Dims | `dens` | `mu` | `e` | Sale | Card wt |
|---|---|---|---|---|---|---|---|
| Crate | box | 23–33 sq | 0.50–0.64 | 0.65 | 0.04 | 10 | 1.0 |
| Timber | box | 62–74 × 13 | 0.50 | 0.50 | 0.04 | 14 | 1.3 |
| Barrel | circle | r 12–15 | 0.62 | **0.25** | 0.12 | 18 | 1.6 |
| Bullion | box | 30 × 26 | **1.05** | 0.60 | 0.04 | 40 | 2.4 |
| Glassware | box | 27 × 22 | 0.38 | 0.60 | 0.02 | 26 | 1.9 |

Glassware break: `crush > 0.35 || impulseFromAbove > m × 150`. Decay `× 0.7`/frame (line 1372).

## Weld / sleep

From `trySleep()`, line 932.

| Condition | Threshold |
|---|---|
| Relative linear speed² | < 36 |
| Relative angular speed | < 0.25 |
| Hull angular speed | < 0.15 |
| Hull absolute angle | < 0.35 rad |
| Dwell before welding | 0.4 s |

## Water surface

| Term | Value | Line |
|---|---|---|
| Wave 1 | `sin(x·0.016 + t·1.5) × a1` | 564 |
| Wave 2 | `sin(x·0.043 − t·2.3) × a2` | 565 |
| Wake | `sin(x·0.045 − ph) × amp × env` | 566 |
| `a1` range | 3.0 – 9.5 | per region |
| `a2` range | 1.5 – 4.3 | per region |
| `WAKE.amp` | 8 + regionBonus (0–10) | 1191 |
| `WAKE.env` | `sin(π · clamp(t/3.4, 0, 1))` | 1435 |
| `WAKE.ph` rate | `dt × 9` | 1436 |
| Sail duration | 3.4 s | 1438 |

## Input

| Constant | Value |
|---|---|
| `CABLE_SPEED` base | 96 u/s |
| `CABLE_SPEED` per Crane tier | +14 u/s |
| `CABLE_MAX_LEN` | 210 u |
| `TROLLEY_SWEEP` | `92 + min(58, difficulty × 3)` |
| Sweep reduction per Crane tier | ×(1 − 0.07·tier) |
| `TROLLEY_RANGE` | `hullHalfW() + 74` |
| `SWING_DAMP` | 2.4 |
| Touch slop | 12 px |
| Assisted Lower penalty | −8% multiplier |

## Upgrade tracks

| Track | Formula | Tier 0 | Tier 5 |
|---|---|---|---|
| Beam | `halfW = base × (1 + 0.06·tier)` | 1.00× | 1.30× |
| Ballast | `1.2 + 0.6·tier` | 1.2 | 4.2 |
| Deck | `deckMu = 0.72 + 0.06·tier` | 0.72 | 1.02 |
| Crane | `96 + 14·tier` | 96 | 166 |

## Wind

| Constant | Value | Line |
|---|---|---|
| Gust interval | `6 + rand·4` s | 1300 |
| Warning lead | 0.9 s | 1301 |
| Gust duration | 1.3 s | 1292 |
| Gust magnitude | `50 + port.gustPeak` (≤ 160) | 1293 |
| Base heel | `port.windBase` 0–45 | new |

## Gull

| Constant | Value | Line |
|---|---|---|
| First appearance | region ≥ 2 | 1306 |
| Approach lerp | 2.4/s | 1318 |
| Landed duration | `2.5 + rand·2` s | 1322 |
| Flees at roll | > 0.22 rad | 1332 |
| Perch offset | `halfW − 12` | 1329 |
| Reappear delay | `9 + rand·7` s | 1339 |

## Icing (region 5)

| Constant | Value |
|---|---|
| `ICE_TICK` | 2.0 s |
| `ICE_RATE` | 0.035 of base mass per tick |
| Hull ice rate | `ICE_RATE × 0.5` |
| Visual layers | 4 |
| Applies to | cargo with nothing directly above |

## Tension Bus

| Constant | Value |
|---|---|
| `rollT` weight | 0.52 |
| `rateT` weight | 0.20 |
| `boardT` weight | 0.18 |
| `stakeT` weight | 0.10 |
| `rateT` scale | `abs(va) × 1.9` |
| `stakeT` scale | `(mult − 1) / 4` |
| `TENSION_ATTACK` | 9.0 |
| `TENSION_RELEASE` | 2.2 |

## Greed curve

| Constant | Value |
|---|---|
| `GREED_STEP` | 0.20 |
| `GREED_ACCEL` | 1.18 |
| Clean bonus | ×1.15 |
| Rating cap | 2.5 |
| Ad-continue crates shed | 2 |
