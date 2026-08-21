# 03 — Economy

Three resources, one closed loop, no energy bar.

---

## 1. The closed loop

```
  PORTS ──produce──► TYPED CARGO ──consumed+risked by──► RUNS
    ▲                                                      │
    │                                                      │ delivered
    │                                                      ▼
    └──────────── COINS ◄──────── sale value × multiplier
         (buys port tiers,
          buildings, hulls)
```

The critical property: **cargo is the session pacer**. There is no energy system because the thing that limits play is the thing the player's own towns produce. Running out of cargo is not a wall, it is a signal to go spend Coins on production.

## 2. Resources

### Cargo — physical, typed, consumable

| Type | Icon | Sale value | Card weight | Physics identity |
|---|---|---|---|---|
| **Crate** | 📦 | 10 | 1.0 | Stable cube, stacks flat, forgiving |
| **Timber** | 🪵 | 14 | 1.3 | Long plank, bridges gaps, slides |
| **Barrel** | 🛢️ | 18 | 1.6 | Circle, `mu 0.25` — rolls |
| **Glassware** | 🧊 | 26 | 1.9 | Fragile, must ride on top |
| **Bullion** | 🥇 | 40 | 2.4 | `dens 1.05` — sinks the rail fast |

Sale value and card weight rise together, so the greedier card is always the more valuable card and always the more dangerous one. There is never a dominant choice.

**Warehouse cap** = `200 + 120 × totalPortTiers`, per type. Hitting the cap stops production for that type and shows a nudge to spend or sail. This is the primary re-engagement pressure and it must be surfaced in the offline-return popup.

### Coins 🪙 — the sink

Earned only by delivering cargo. Spent on:

| Sink | Share of lifetime spend (target) |
|---|---|
| Port tiers | 38% |
| Buildings | 17% |
| Hull purchases | 22% |
| Hull upgrade tiers | 20% |
| Cosmetics | 3% |

Coins are **never** produced idly. Idle produces *cargo*; converting cargo to Coins requires a delivery, which requires either a manual run or an assigned auto-route whose rate was set by a manual run. This is the enforcement mechanism for Pillar P5.

### Gems 💎 — hard currency

| Source | Amount |
|---|---|
| IAP | see [09-monetization.md](09-monetization.md) |
| Daily Contract streak milestones (day 3/7/14/30) | 15 / 40 / 100 / 250 |
| Season pass free track | ~180 per season |
| Region first-clear | 50 |
| Weekly Regatta placement | 10–500 |

| Gem sink | Cost |
|---|---|
| Instant port tier completion | tier cost ÷ 240 |
| Hull unlock skip | 15% of Coin price ÷ 100 |
| Extra fleet slot | 350 (first), ×1.6 each |
| Cosmetic hull skins | 250–900 |
| Season pass premium track | 900 (or $9.99) |

**Gems never buy cargo and never buy a run outcome.** Buying cargo would let money bypass the skill faucet and hollow the whole loop.

## 3. Production formulas

```
cargoPerHour(port, building) =
    building.baseRate
  × (1 + 0.35 × (portTier − 1))
  × globalProductionMult
```

| Building | Produces | `baseRate` /hr | Unlock |
|---|---|---|---|
| Warehouse | Crate | 12 | Tier 1 (default) |
| Sawmill | Timber | 9 | Tier 1 |
| Cooperage | Barrel | 7 | Tier 2 |
| Glassworks | Glassware | 5 | Tier 3 |
| Mint | Bullion | 3 | Tier 4 |

Building slots per tier: **T1 → 1, T2 → 2, T3 → 2, T4 → 3, T5 → 4.**

Buildings can be demolished and rebuilt for 40% of build cost, so a player is never permanently locked out of a cargo type by an early mistake. This matters because building choice changes the *physics* the player faces, and that is a decision they should be able to revise once they understand it.

### Offline accrual

```
offlineCargo(type) = cargoPerHour(type) × min(hoursAway, OFFLINE_CAP)
OFFLINE_CAP = 4 h base
            + 2 h per Warehouse building owned
            + 8 h with the Remove Ads IAP
```

Capped at the warehouse limit per type. The offline-return popup shows a per-type breakdown and offers `🎥 ×2 offline` (see [09-monetization.md](09-monetization.md)).

## 4. Idle income formula

```
coinsPerHour(route) =
      route.baseYield
    × routeRating                 // 0 .. 2.5, from best manual run
    × hullSuitability             // 0.6 .. 1.8, see 05-fleet-ports.md
    × (1 + 0.25 × (destPortTier − 1))
    × globalIdleMult              // prestige × IAP × season pass

fleetCoinsPerHour = Σ over ASSIGNED routes
```

`route.baseYield` is authored per port and roughly tracks `routeParScore × 0.6`. See [06-world-content.md](06-world-content.md).

**A route with no assigned hull earns nothing.** This is what makes the fleet a real system rather than a label. See [05-fleet-ports.md §3](05-fleet-ports.md).

**A hull being hand-piloted is off its route for the duration of the run**, including the result screen. Displayed explicitly at the deployment decision.

## 5. Cost curves

### Port tiers

```
portTierCost(port, tier) = round(  port.costBase
                                 × 4.2^(tier − 1)
                                 × (1 + 0.06 × portsOwned) )
```

`port.costBase` runs 400 (Home Coast) to 9,000 (late regions). The `portsOwned` term is a gentle global inflation that keeps late-region ports meaningful without making early ports trivially cheap to max.

Representative Home Coast port (`costBase` 400, 6 ports owned):

| Tier | Cost | Cumulative |
|---|---|---|
| 2 | 1,730 | 1,730 |
| 3 | 7,270 | 9,000 |
| 4 | 30,530 | 39,530 |
| 5 | 128,220 | 167,750 |

### Buildings

```
buildingCost(b) = b.base × (1 + 0.5 × existingBuildingsAtPort)
```

| Building | `base` |
|---|---|
| Warehouse | 600 |
| Sawmill | 1,400 |
| Cooperage | 3,800 |
| Glassworks | 11,000 |
| Mint | 34,000 |

### Hull purchases and upgrades

```
hullUpgradeCost(hull, tier) = hull.basePrice × 0.30 × 3.1^(tier − 1)
```

See [05-fleet-ports.md §2](05-fleet-ports.md) for `basePrice` per archetype.

## 6. Faucet / sink balance

Target: a player at steady state should be able to fund roughly **one meaningful purchase per two sessions** through the mid-game.

| Phase | Sessions | Coins/day (typical) | Primary sink |
|---|---|---|---|
| Onboarding | 1–5 | 800–3k | First port tiers |
| Early | 6–25 | 5k–40k | Second and third hull |
| Mid | 26–90 | 60k–500k | Region unlock tiers, Glassworks |
| Late | 91–250 | 800k–8M | Mint chains, hull tier 5 |
| Prestige | 250+ | reset ×1.35 | Legacy hulls |

**Inflation control.** The economy is deliberately superlinear on both sides — production scales with tiers, costs scale at 4.2^tier. The ratio holds because `routeRating` is bounded at 2.5 and `hullSuitability` at 1.8, so idle income cannot compound without the player continuing to play manually and unlock new regions. If soft-launch data shows runaway growth, the first lever is `portTierCost` exponent, remote-configured.

## 7. The salvage mechanic

On capsize, all cargo aboard is destroyed.

```
🎥 SALVAGE — recover 40% of lost cargo, rounded down, by value
```

Selection is by **highest value first**, so the player recovers the Bullion before the Crates. This makes salvage feel generous and makes the ad worth watching, while still leaving a real loss.

Salvage is offered once per capsize and does not stack with the RIGHT HER! continue — taking the continue means the run did not capsize, so there is nothing to salvage.

## 8. Anti-frustration rules

1. **Never leave a player cargo-locked.** If total warehouse value falls below the cheapest available contract's requirement, a free "Relief Shipment" grants enough Crates for one run, once per 6 h. Silent, no celebration — it should feel like the harbourmaster quietly helping, not a reward.
2. **Never fail a contract for cargo the player owns.** The contract UI must grey out and explain shortfalls before the run starts, never during.
3. **Never destroy cargo outside a run.** Warehouse contents are inviolable.
4. **Cap consecutive capsizes.** After 3 consecutive capsizes on the same route, quietly show a contextual tip about drop height or centre of gravity. Do not reduce difficulty.

## 9. Remote-configurable constants

Everything in this document ships behind Remote Config from day one. At minimum:

```
econ.saleValue.{crate,timber,barrel,glassware,bullion}
econ.cardWeight.{...}
econ.greedStep, econ.greedAccel
econ.portTierCostBase, econ.portTierCostExp, econ.portInflation
econ.buildingBase.{...}
econ.productionBase.{...}, econ.productionTierMult
econ.offlineCapHours, econ.offlineWarehouseBonus
econ.idleRatingCap, econ.suitabilityMin, econ.suitabilityMax
econ.salvageFraction
econ.reliefShipmentCooldownHours
```

Balance changes must never require a store submission. This is the difference between a two-week tuning cycle and a two-day one during soft launch.
