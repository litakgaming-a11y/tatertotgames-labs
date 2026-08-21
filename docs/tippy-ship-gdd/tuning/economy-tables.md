# Tuning — Economy Tables

All values Remote Config driven. See [03-economy.md §9](../03-economy.md).

---

## Cargo

| Type | Sale | Card weight | Produced by | `baseRate`/hr |
|---|---|---|---|---|
| Crate | 10 | 1.0 | Warehouse | 12 |
| Timber | 14 | 1.3 | Sawmill | 9 |
| Barrel | 18 | 1.6 | Cooperage | 7 |
| Glassware | 26 | 1.9 | Glassworks | 5 |
| Bullion | 40 | 2.4 | Mint | 3 |

## Greed multiplier — all-Crate reference

```
mult(n) = 1.0 + Σ(k=1..n) weight(k) × 0.20 × 1.18^(k−1)
```

| n | Crate only | Mixed (avg wt 1.5) | Bullion only |
|---|---|---|---|
| 0 | ×1.00 | ×1.00 | ×1.00 |
| 1 | ×1.20 | ×1.30 | ×1.48 |
| 2 | ×1.44 | ×1.65 | ×2.05 |
| 3 | ×1.72 | ×2.08 | ×2.72 |
| 4 | ×2.05 | ×2.58 | ×3.51 |
| 5 | ×2.44 | ×3.19 | ×4.44 |
| 6 | ×2.90 | ×3.88 | ×5.54 |
| 7 | ×3.44 | ×4.71 | ×6.84 |
| 8 | ×4.09 | ×5.68 | ×8.37 |
| 9 | ×4.85 | ×6.83 | ×10.17 |
| 10 | ×5.71 | ×8.18 | ×12.31 |

## Production

```
cargoPerHour = baseRate × (1 + 0.35 × (portTier − 1)) × globalProductionMult
```

| Port tier | Multiplier | Building slots | Storage bonus |
|---|---|---|---|
| 1 | 1.00 | 1 | +0 |
| 2 | 1.35 | 2 | +120 |
| 3 | 1.70 | 2 | +240 |
| 4 | 2.05 | 3 | +360 |
| 5 | 2.40 | 4 | +480 |

Warehouse cap per type: `200 + 120 × totalPortTiers`.

## Offline accrual

```
offlineCargo = cargoPerHour × min(hoursAway, OFFLINE_CAP)
OFFLINE_CAP  = 4 + 2 × warehousesOwned  (+8 with Harbourmaster IAP)
```

## Idle income

```
coinsPerHour(route) = baseYield
                    × routeRating          [0 .. 2.5]
                    × hullSuitability      [0.6 .. 1.8]
                    × (1 + 0.25 × (destPortTier − 1))
                    × globalIdleMult
```

`globalIdleMult = (1 + 0.35 × prestigeRank) × iapIdleMult × seasonBonus`

## Port tier costs

```
cost(tier) = costBase × 4.2^(tier−1) × (1 + 0.06 × portsOwned)
```

Home Coast (`costBase` 400, 6 ports owned):

| Tier | Cost | Cumulative |
|---|---|---|
| 2 | 1,730 | 1,730 |
| 3 | 7,270 | 9,000 |
| 4 | 30,530 | 39,530 |
| 5 | 128,220 | 167,750 |

Region 5 (`costBase` 4,200, 40 ports owned):

| Tier | Cost | Cumulative |
|---|---|---|
| 2 | 29,660 | 29,660 |
| 3 | 124,570 | 154,230 |
| 4 | 523,190 | 677,420 |
| 5 | 2,197,400 | 2,874,820 |

`costBase` by region: 400 / 700 / 1,200 / 2,300 / 4,200 / 6,000 / 7,500 / 9,000.

## Buildings

```
cost = base × (1 + 0.5 × existingBuildingsAtPort)
```

| Building | `base` | Unlock tier |
|---|---|---|
| Warehouse | 600 | 1 |
| Sawmill | 1,400 | 1 |
| Cooperage | 3,800 | 2 |
| Glassworks | 11,000 | 3 |
| Mint | 34,000 | 4 |

Demolition refund: 40%.

## Hulls

| Hull | `basePrice` | Unlock |
|---|---|---|
| Tugboat | — | start |
| Clipper | 4,500 | Coins |
| Barge | 12,000 | Coins |
| Tanker | 38,000 | Coins |
| Cutter | 55,000 | Coins |
| Coaster | 140,000 | Coins |
| Hopper | 420,000 | Coins, region 4 |
| Junk | 900,000 | Coins, region 5 |
| Paddle Steamer | 2,400,000 | Coins, region 6 |
| Icebreaker | 6,000,000 | Coins, region 5 |
| Ironclad | — | Prestige 1 |
| Windjammer | — | Prestige 3 |

```
hullUpgradeCost(tier) = basePrice × 0.30 × 3.1^(tier−1)
```

Clipper (`basePrice` 4,500), per track:

| Tier | Cost | Cumulative (one track) |
|---|---|---|
| 1 | 1,350 | 1,350 |
| 2 | 4,185 | 5,535 |
| 3 | 12,974 | 18,509 |
| 4 | 40,218 | 58,727 |
| 5 | 124,675 | 183,402 |

Four tracks → ~733k to fully max a Clipper.

## Hull suitability matrix

| Hull | Crate | Timber | Barrel | Glass | Bullion |
|---|---|---|---|---|---|
| Tugboat | 1.0 | 0.9 | 0.9 | 0.8 | 0.7 |
| Clipper | 1.1 | 1.6 | 0.8 | 1.2 | 0.6 |
| Barge | 1.2 | 1.4 | 1.1 | 0.9 | 0.6 |
| Tanker | 1.0 | 0.9 | 1.7 | 0.7 | 1.3 |
| Cutter | 1.3 | 0.8 | 0.9 | 1.6 | 0.6 |
| Coaster | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
| Hopper | 0.9 | 0.7 | 1.2 | 0.6 | 1.8 |
| Junk | 1.3 | 1.1 | 1.0 | 1.4 | 0.8 |
| Paddle Steamer | 1.4 | 1.3 | 1.4 | 1.1 | 1.4 |
| Icebreaker | 1.2 | 1.1 | 1.3 | 1.0 | 1.5 |
| Ironclad | 1.5 | 1.4 | 1.5 | 1.0 | 1.6 |
| Windjammer | 1.3 | 1.8 | 1.1 | 1.5 | 0.9 |

## Region gates

| Region | Port Tiers required | Target unlock day |
|---|---|---|
| 1 Home Coast | 0 | 0 |
| 2 The Shallows | 12 | 2 |
| 3 Ferry Lanes | 28 | 5 |
| 4 Roaring Reach | 45 | 11 |
| 5 Ice Run | 70 | 24 |
| 6 Monsoon Straits | 105 | 42 |
| 7 Nightwatch | 150 | 68 |
| 8 Open Waters | 210 | 95 |

## Fleet slots

| Source | Slots |
|---|---|
| Start | 3 |
| Per region unlocked | +1 (max +7) |
| Gems | 350, then ×1.6 each |

## Gems

| Source | Amount |
|---|---|
| Daily streak day 3 / 7 / 14 / 30 | 15 / 40 / 100 / 250 |
| Season free track | ~180 |
| Season premium track | ~600 |
| Region first clear | 50 |
| Regatta top 0.1% / 1% / 10% / 50% / entry | 500 / 250 / 100 / 40 / 10 |

| Sink | Cost |
|---|---|
| Instant port tier | `tierCost / 240` |
| Hull unlock skip | `coinPrice × 0.15 / 100` |
| Fleet slot | 350 × 1.6^n |
| Cosmetic skin | 250–900 |
| Tide Pass premium | 900 |

## Salvage & relief

| | |
|---|---|
| Salvage fraction | 40% by value, highest first |
| Relief Shipment cooldown | 6 h |
| Relief Shipment grant | enough Crates for one cheapest contract |

## Prestige

```
globalMult = 1 + 0.35 × prestigeRank
```

| Rank | Multiplier | Legacy hull |
|---|---|---|
| 1 | ×1.35 | Ironclad |
| 2 | ×1.70 | — |
| 3 | ×2.05 | Windjammer |
| 4 | ×2.40 | — |
| 5 | ×2.75 | — |

Unlock: 250 total Port Tiers.

## Target income by phase

| Phase | Sessions | Coins/day | Primary sink |
|---|---|---|---|
| Onboarding | 1–5 | 800–3k | First port tiers |
| Early | 6–25 | 5k–40k | 2nd and 3rd hull |
| Mid | 26–90 | 60k–500k | Region tiers, Glassworks |
| Late | 91–250 | 800k–8M | Mint chains, hull tier 5 |
| Prestige | 250+ | reset | Legacy hulls |
