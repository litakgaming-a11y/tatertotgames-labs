# 13 — Analytics & KPIs

Instrument the decisions, not the taps. Every event below exists to answer a specific question.

---

## 1. Event taxonomy

### Session

| Event | Params | Question it answers |
|---|---|---|
| `session_start` | `sessionIndex`, `hoursAway`, `offlineCargo` | Is offline production pulling people back? |
| `session_end` | `durationSec`, `runsPlayed`, `screensVisited` | Are sessions the right length? |
| `offline_collect` | `cargoByType`, `doubled` | Is the ×2 offer converting? |

### The run — the heart of the instrumentation

| Event | Params | Question |
|---|---|---|
| `run_start` | `routeId`, `hullId`, `hullTier`, `quota`, `cargoMix`, `pausedIdleRate` | What are people actually sailing? |
| `quota_met` | `elapsedSec`, `listAtQuota`, `freeboardAtQuota` | How long is the mandatory phase? |
| `overload_offered` | `index`, `handTypes[3]`, `multiplierNow`, `listNow` | What is the decision context? |
| `overload_taken` | `index`, `cardType`, `cardWeight`, `multiplierAfter`, `listBefore`, `listAfter` | **The greed decision.** The single most important event. |
| `overload_declined` | `index`, `multiplierBanked`, `listAtStop` | Where do people stop? |
| `crate_dropped` | `heightAboveStack`, `impactImpulse`, `listDelta` | Are people learning to lower gently? |
| `warn_entered` | `list`, `multiplier`, `overloadCount` | How often does danger happen? |
| `saved` | `peakList`, `durationAboveWarn`, `multiplier` | **The money moment.** How often does it fire? |
| `capsize` | `peakList`, `multiplier`, `overloadCount`, `cause` | What kills people? |
| `ad_continue_offered` / `_taken` / `_declined` | `multiplier`, `cratesAboard` | Is the continue balanced? |
| `cargo_overboard` | `cargoType`, `listAtLoss`, `cause` | Which cargo is too punishing? |
| `glass_broken` | `crush`, `impulseFromAbove` | Is Glassware fair? |
| `wake_survived` / `wake_capsized` | `multiplier`, `listPeak` | Is the wake test too swingy? |
| `run_complete` | `delivered`, `lost`, `multiplier`, `coins`, `rating`, `ratingDelta`, `isNewBest`, `durationSec` | The outcome |
| `run_failed` | `reason`, `elapsedSec`, `multiplierAtFail` | The other outcome |

### Economy

| Event | Params |
|---|---|
| `coins_earned` | `amount`, `source`, `balanceAfter` |
| `coins_spent` | `amount`, `sink`, `itemId`, `balanceAfter` |
| `cargo_produced` | `type`, `amount`, `portId`, `offline` |
| `cargo_consumed` | `type`, `amount`, `routeId` |
| `cargo_lost` | `type`, `amount`, `cause` |
| `warehouse_full` | `type`, `hoursAtCap` |
| `relief_shipment` | `cargoGranted` |
| `gems_earned` / `gems_spent` | `amount`, `source`/`sink`, `balanceAfter` |

### Progression

| Event | Params |
|---|---|
| `route_rating_improved` | `routeId`, `from`, `to`, `idleRateFrom`, `idleRateTo` |
| `port_tier_up` | `portId`, `tier`, `costPaid`, `totalPortTiers` |
| `building_built` / `_demolished` | `portId`, `buildingType`, `slot` |
| `hull_purchased` | `hullId`, `costPaid`, `fleetSize` |
| `hull_upgraded` | `hullId`, `track`, `tier`, `costPaid` |
| `hull_assigned` / `_unassigned` | `hullId`, `routeId`, `idleRateDelta` |
| `region_unlocked` | `regionId`, `sessionIndex`, `daysSinceInstall` |
| `prestige` | `rank`, `portTiersAtReset`, `hoursPlayed` |

### FTUE

| Event | Params |
|---|---|
| `ftue_step` | `stepId`, `elapsedSec`, `skipped` |
| `ftue_run1_saved_fired` | `peakList` — **did the rigged moment work?** |
| `ftue_complete` | `totalSec` |
| `system_unlocked` | `systemId`, `sessionIndex` |

### Monetization

| Event | Params |
|---|---|
| `ad_offered` | `placement`, `context` |
| `ad_started` / `ad_completed` / `ad_abandoned` | `placement`, `network`, `eCPM` |
| `interstitial_shown` | `transition`, `sessionSecond` |
| `iap_viewed` / `iap_purchased` / `iap_failed` | `sku`, `price`, `currency`, `sessionIndex` |
| `season_tier_up` | `tier`, `track` |

### Live ops

| Event | Params |
|---|---|
| `daily_accepted` / `_completed` / `_failed` | `streak`, `multiplier` |
| `streak_broken` / `streak_insured` | `streakLost` |
| `regatta_entered` | `seed`, `attemptIndex` |
| `regatta_submitted` | `seed`, `score`, `rank`, `percentile` |
| `regatta_replay_watched` | `seed`, `rankWatched` |
| `regatta_rejected` | `reason` — **cheat detection signal** |

## 2. The five questions that matter

Everything above exists to answer these. If an event does not serve one of them, cut it.

### Q1 — Do people feel the near-miss?

```
savedRate = count(saved) / count(warn_entered)
ftueSavedRate = count(ftue_run1_saved_fired) / count(ftue_step where stepId=run1)
```

Targets: `ftueSavedRate` > 0.97 (the rig should essentially always work). `savedRate` in normal play 0.35–0.55 — high enough to be a real part of the game, low enough that it still means something.

If `savedRate` > 0.7, `WARN_ANG` is too low and the game is crying wolf.

### Q2 — Is greed working?

```
overloadDepth      = mean(overloadCount) by session index
stopDistribution   = histogram(multiplier at overload_declined)
pushToCapsizeRate  = count(capsize) / count(run_start)
```

Targets: mean overload depth 3–6 crates, rising with player experience. Capsize rate 18–28% — a game where you rarely capsize has no stakes, and a game where you usually capsize is punishing.

**The critical chart** is the stop distribution. A healthy one is broad and roughly bell-shaped. A spike at exactly the quota means nobody is engaging with greed; a spike at the capsize point means the ad-continue is dominating and §1 rule 1 has failed.

### Q3 — Are people learning the sim?

```
dropHeightTrend = mean(crate_dropped.heightAboveStack) by session index
listDeltaTrend  = mean(abs(crate_dropped.listDelta)) by session index
```

Both should **fall** over the first ten sessions. If drop height does not fall, the hold-to-lower mechanic is not being taught and the FTUE run 2 script needs work. This is the clearest single measure of whether the input design succeeded.

### Q4 — Does the idle/skill coupling land?

```
ratingImprovementRate = count(route_rating_improved) / count(run_complete)
idleShareOfIncome     = sum(coins_earned where source=idle)
                      / sum(coins_earned)
manualRunsPerSession  = count(run_start) / count(session_start)
```

Target `idleShareOfIncome` 0.45–0.60. Below 0.4 the idle layer is not carrying its weight; above 0.7 the manual game is becoming optional and Pillar P5 is failing.

`manualRunsPerSession` must stay above 2. If it falls, check whether the fleet-pause opportunity cost is discouraging manual play — that is the A/B test in [12-liveops.md §5](12-liveops.md).

### Q5 — Where do people leave?

Standard funnels plus a run-level exit analysis:

```
churnByLastEvent = count(distinct users whose final event was X) / total churned
```

The specific worry: users whose last event is `capsize` or `run_failed`. If capsize-adjacent churn exceeds 12% of total churn, the loss is landing too hard and the salvage rate or the relief shipment cooldown needs loosening.

## 3. Dashboards

| Dashboard | Refresh | Contents |
|---|---|---|
| **Daily health** | hourly | DAU, D1/D7/D30, sessions/DAU, ARPDAU, crash-free % |
| **Run economics** | daily | Overload depth, stop distribution, capsize rate, saved rate |
| **Learning curve** | daily | Drop height and list-delta by session index cohort |
| **Economy flow** | daily | Faucet/sink by source, coin balance distribution, warehouse-full incidence |
| **Progression pacing** | weekly | Region unlock day, hull count, port tiers, vs targets in [04-progression.md §7](04-progression.md) |
| **Monetization** | daily | Impressions/DAU by placement, eCPM, IAP conversion by SKU and session index |
| **Live ops** | weekly | Daily completion, streak distribution, Regatta participation, rejection rate |
| **A/B** | per test | Per [12-liveops.md §5](12-liveops.md) |

## 4. Instrumentation discipline

1. **Every event carries `sessionIndex` and `daysSinceInstall`.** Almost every question is a cohort question.
2. **Never log per-frame.** The run emits ~40 events; that is the budget.
3. **Batch and send on session end** plus every 60 s, with local persistence so a crash does not lose the session.
4. **Sample the heavy events.** `crate_dropped` fires 9–20 times per run; sample at 25% beyond session 20.
5. **Version the schema.** Add fields, never repurpose them.
6. **No PII, ever.** Anonymous UGS auth id only. No device identifiers beyond what the ad SDK requires, and respect ATT and Play consent fully.

## 5. Soft-launch decision gates

| Week | Gate | Pass | Action if fail |
|---|---|---|---|
| 1 | Tutorial completion | > 85% | Rework FTUE before anything else |
| 1 | Crash-free | > 99% | Stop; stabilise |
| 2 | D1 | > 40% | Investigate first-session length and the rigged SAVED! |
| 3 | D7 | > 15% | Check Region 2 gate timing; check overload depth trend |
| 4 | Sessions/DAU | > 3.5 | Check offline cap and warehouse-full incidence |
| 6 | D30 | > 5% | Check idle share and prestige visibility |
| 6 | ARPDAU | > $0.05 | Ad frequency caps, then IAP placement |
| 8 | LTV/CPI | > 1.0 at d90 projection | Do not scale UA |

**Do not scale UA before week 8.** The whole economic case rests on D30, and D30 cannot be measured in week 3.
