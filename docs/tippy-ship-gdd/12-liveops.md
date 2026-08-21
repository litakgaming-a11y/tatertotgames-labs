# 12 — Live Ops

Three engagement layers on top of offline production: a daily habit, a weekly competition, and a monthly season.

---

## 1. Daily Contract

One premium hand-piloted job per UTC day. Its job is to force a manual run every day so the physics stays central.

```
📅  DAILY CONTRACT                      streak ×4  (day 11)

    6× Glassware  →  Nightwatch
    Sea: fog · swell ▓▓▓▓░ · squall risk

    🪙 8,400        💎 15        ⭐ ×1.5 rating weight

              ⚓  ACCEPT
```

### Rules

- Generated server-side by `getDailyContract(playerId, utcDay)` — deterministic from the day and the player's progress band, so it cannot be rerolled by clock manipulation.
- Always a route the player has **already unlocked**, at the top of their difficulty band.
- Cargo requirement is always cargo the player **already owns**; if not, it is substituted down. Never cargo-lock the daily.
- One attempt per day. Capsizing ends it. This is the one place in the game where a run is not repeatable, which is what gives it weight.
- Rating earned counts at ×1.5 weight toward the route's Route Rating — a strong reason to take it seriously.

### Streak

| Streak day | Reward multiplier | Bonus |
|---|---|---|
| 1–2 | ×1.0 | — |
| 3 | ×1.5 | 💎 15 |
| 7 | ×2.0 | 💎 40 |
| 14 | ×3.0 | 💎 100 |
| 21 | ×3.5 | — |
| 30 | ×4.0 | 💎 250 + cosmetic |
| 31+ | ×4.0 | maintained |

Missing a day resets to 1. **Streak Insurance** (rewarded ad, once per week) preserves a broken streak — see [09-monetization.md §2](09-monetization.md).

## 2. Weekly Regatta

**Committed v1.0 scope.** On the never-cut list in [14-milestones-cutlist.md §2](14-milestones-cutlist.md) — the standout feature, and the cheapest one in the plan to author.

```
🏁  WEEKLY REGATTA — Seed #37              2d 14h remaining

    Everyone sails: Clipper T3
    Everyone loads: 5× Barrel + 3× Bullion
    Everyone faces: gale · swell 7.5 · wake at 1.7s

    YOUR BEST   ×6.2      🥇 #2,847 of 184,022
    TOP         ×9.8      ▶ watch the run

    Attempts remaining: 3        🎥 +1 attempt
```

### Why it is nearly free

**One seed per week.** Everything else — hull, upgrades, manifest, sea state, wind timing, wake timing — derives deterministically from it. There is no level to author, no balance pass, no art. The content is the seed.

### Why it is provably fair

Every player gets the **identical** run: same hull at the same tier regardless of what they own, same upgrades, same cargo, same seed. Fleet strength, spending, and account age are all irrelevant. It is a pure test of how well you read a boat.

This matters enormously in a game with an idle economy — it is the one surface where a day-3 player can beat a day-300 player, and that possibility is worth a great deal of engagement.

### Anti-cheat — the client never states a score

**A submission carries the tape and nothing else.** The server re-simulates it headless in Cloud Code and *derives* the score. There is no claimed value, so there is nothing to tolerance-check.

This is a deliberate change from an earlier draft, which had the client submit a tape plus a claimed score validated within a 2% band. Kinfold established the better pattern ([15-lessons-from-prior-builds.md L3](15-lessons-from-prior-builds.md)): *the client names the stage, and the server re-runs the fight from the authoritative save to derive what it was worth.* Applying it here removes two problems at once — the "my score was 0.3% off and got rejected" support ticket disappears, and cross-platform float drift stops being an anti-cheat concern and becomes what it actually is, a display concern.

**Adoption is decided here, not left to a code comment.** The client shows a provisional local score immediately, and **adopts the server's number as authoritative** when the response returns. Kinfold's equivalent issue (P-068) is still open years on, purely because "the client must adopt the returned state" lived in a class comment and was never specified. So, explicitly: **the server's score is the score.** If they disagree, the client is wrong and updates silently.

Rejection reason codes: `MALFORMED_TAPE`, `WRONG_SEED`, `TAPE_TOO_LONG`, `SIM_DIVERGED`, `DUPLICATE_SUBMISSION`. All are surfaced to analytics as `regatta_rejected`.

If schedule pressure forces cut #5, launch validation degrades to the **ceiling heuristic** — the week's seed is simulated once offline to establish a plausible maximum, submissions above it are rejected, the top percentile is flagged for review, and malformed tapes are rejected. Every tape is retained either way, so exact re-simulation lands retroactively in v1.1. The Regatta itself ships regardless. See [14-milestones-cutlist.md §2.1](14-milestones-cutlist.md).

If schedule pressure forces cut #5, launch validation degrades to the **ceiling heuristic** — the week's seed is simulated once offline to establish a plausible maximum, submissions above it are rejected, the top percentile is flagged for review, and malformed tapes are rejected. Every tape is retained either way, so exact re-simulation lands retroactively in v1.1. The Regatta itself ships regardless. See [14-milestones-cutlist.md §2.1](14-milestones-cutlist.md).

Because the top runs are replayable, they are also **watchable** — which turns the leaderboard into content. A player who watches the #1 run learns something, which is the best possible retention outcome from a competitive feature.

### Attempts and rewards

| | |
|---|---|
| Base attempts | 3 per week |
| Rewarded extra | +1, up to 3 more |
| Cargo cost | **None** — the Regatta uses provided cargo |

| Placement | Reward |
|---|---|
| Top 0.1% | 💎 500 + exclusive hull flag cosmetic |
| Top 1% | 💎 250 |
| Top 10% | 💎 100 |
| Top 50% | 💎 40 |
| Participated | 💎 10 |

The Regatta costs no cargo deliberately. It must never compete with the core economy for resources, or players will skip it to protect their warehouse.

## 3. Tide Pass — the season

One season per region theme, roughly 4 weeks, 50 tiers.

| Track | Contents |
|---|---|
| **Free** | ~180 gems, Coins, cargo bundles, 1 hull at tier 30, cosmetics |
| **Premium** ($9.99 / 900 💎) | ~600 gems, a themed hull, 2 hull upgrade tiers, exclusive palette, town decorations |

### Earning tiers

```
tierPoints from:
    complete a delivery              +10
    Daily Contract                   +80
    beat a personal best on a route  +40
    Regatta entry                    +60
    port tier-up                     +50
    weekly quests (3 per week)       +150 each
```

Paced so an average player (4 sessions/day) reaches tier 50 in ~26 days without spending, and a light player (1 session/day) reaches ~tier 34. Never gate the last few tiers behind purchase pressure — a season that is unreachable is a season the player disengages from in week two.

### Weekly quests

Three per week, rotating, drawn from a pool:

- Deliver N crates of a specific type
- Complete a run at multiplier ≥ ×X
- Recover from a list above 30° (a SAVED!) N times
- Tier up any port
- Assign a hull to an unassigned route
- Complete a run with zero cargo lost

The "recover from above 30°" quest deliberately pushes players toward the game's best moment. Quest design should always point at the near-miss.

## 4. Event calendar

| Cadence | Event | Cost to run |
|---|---|---|
| Daily | Daily Contract | Automated |
| Weekly | Regatta (new seed) | One integer |
| Weekly | 3 quests rotate | Config |
| Monthly | Tide Pass season | Cosmetics + 1 hull |
| Quarterly | **Limited region** | 2–3 weeks of content |
| Ad hoc | Double Coins weekend | Remote Config flag |
| Ad hoc | Cargo rush (×2 production) | Remote Config flag |

### Limited regions as events

Because a region *is* the content unit ([06-world-content.md](06-world-content.md)), a limited-time region is the highest-value live-ops item available and costs a palette, a parallax set, four music stems, ~10 port defs, and optionally one new mechanic.

Concepts: **Volcanic Run** (ash reduces visibility, thermals gust upward), **Canal Passage** (narrow, no swell, but locks change the waterline in steps), **Salvage Fields** (cargo is pre-placed on the deck badly and must be rearranged before sailing).

## 5. Remote Config surface

Everything below must be tunable without a store submission.

```
econ.*                    // full economy table — see 03-economy.md §9
tension.curve.*           // 9-point samples per channel
ads.freqCap.*             // caps and gaps per 09-monetization.md §2
ads.placements.enabled.*  // kill switch per placement
region.gate.*             // Port Tier thresholds per region
daily.rewardBase, daily.streakMultipliers[]
regatta.seedOverride, regatta.attempts, regatta.rewards[]
season.id, season.tierPoints.*, season.rewards[]
ftue.riggedRunEnabled     // A/B the rigged SAVED!
flags.doubleCoins, flags.cargoRush
```

### A/B tests to run in soft launch, in priority order

1. **Rigged FTUE run 1 on/off** — measures whether the guaranteed SAVED! moves D1.
2. **`GREED_ACCEL` 1.12 / 1.18 / 1.25** — the single biggest lever on session length.
3. **Ad-continue cost: 2 crates / 3 crates / multiplier-lock-only** — validates the dominance argument empirically.
4. **Region 2 gate at 8 / 12 / 16 Port Tiers** — D3 driver.
5. **Fleet pause on/off during manual runs** — validates the deployment decision is texture, not friction.

## 6. Push notifications

Opt-in, capped at one per day. Only these triggers:

| Trigger | Copy tone |
|---|---|
| Warehouse full | "Saltbay's warehouse is full — nothing more will be made." |
| Streak expiring (2 h left) | "Your 11-day streak ends at midnight." |
| Season ending (48 h) | "The Ice Run season closes in two days." |
| Regatta results posted | "You finished #2,847 of 184,022." |

Never loss-framed, never anthropomorphised guilt ("your fleet misses you"), never more than one per day. See [09-monetization.md §7](09-monetization.md).

## 7. Live-ops operating rhythm

| When | Action |
|---|---|
| Every Monday | New Regatta seed, rotate quests |
| Every Monday | Review last week's funnel and ARPDAU |
| Every 4 weeks | Season rollover |
| Every quarter | Limited region |
| Continuous | Remote Config balance passes on soft-launch data |

The Regatta seed should be **chosen, not random**. Pick a seed that produces an interesting run — a manifest with a real decision in it — by simulating candidate seeds headlessly and reviewing the top few. This takes ten minutes a week and is the difference between a compelling weekly event and a dull one.
