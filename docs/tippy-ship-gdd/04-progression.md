# 04 — Progression

> *Your idle income is a recording of your best run.*

---

## 1. Route Rating

Every route the player has ever completed carries a **Route Rating** — a float 0 to 2.5.

```
routeRating = clamp(bestRunScore / route.parScore, 0, 2.5)
```

**Best-of, never averaged.** Retrying is always free for progression. Only cargo is at risk. This is deliberate: the player must feel safe experimenting with a bigger overload, because that experiment is the game.

| Rating | Meaning | Player-facing label |
|---|---|---|
| < 0.5 | Barely delivered | Scraped by |
| 0.5–0.9 | Under par | Serviceable |
| 1.0 | Par — clean run, modest overload | **Solid** |
| 1.1–1.5 | Confident overload | Sharp |
| 1.6–2.0 | Expert | Masterful |
| 2.1–2.5 | Ceiling | **Legendary** |

The rating is shown on the route line on the map and on the fleet screen, next to the coins-per-hour it generates. The causal chain must be visible at all times: *this number came from that run, and it is paying you right now.*

## 2. The progression ladder

Six interlocking axes. No single one carries the game.

| Axis | Unit | Depth | Gates |
|---|---|---|---|
| **Route Ratings** | per route, 0–2.5 | ~90 routes | skill only |
| **Port tiers** | 1–5 per port | ~90 ports | Coins |
| **Buildings** | 1–4 slots per port | 5 types | Coins + tier |
| **Hulls owned** | 8–12 archetypes | roster | Coins, some region-gated |
| **Hull tiers** | 1–5 per hull | 5 tiers × roster | Coins |
| **Regions** | 6–8 | ~90 ports | total Port Tiers |
| **Prestige** | Trading Company rank | unbounded | 250 Port Tiers |

**Region gating on total Port Tiers, not linear completion.** A player is never blocked by one hard port; they are blocked by not having invested enough in the world. This keeps the idle layer load-bearing and prevents skill walls from becoming churn events.

| Region | Port Tiers required |
|---|---|
| 1 — Home Coast | 0 |
| 2 — The Shallows | 12 |
| 3 — Ferry Lanes | 28 |
| 4 — Roaring Reach | 45 |
| 5 — Ice Run | 70 |
| 6 — Monsoon Straits | 105 |
| 7 — Nightwatch | 150 |
| 8 — Open Waters | 210 |

## 3. Input tapes — replays as infrastructure

Every run records a deterministic input tape. The best tape per route is retained.

### Format

```
struct RunTape {
    uint      version;        // format version
    uint      seed;           // mulberry32 seed for manifest + hand draws
    ushort    routeId;
    byte      hullId;
    byte      hullTier;
    byte[4]   upgradeTiers;   // hull, ballast, deck, crane
    ushort    frameCount;
    Event[]   events;
}

struct Event {               // 6 bytes
    ushort tick;             // fixed-step tick index
    sbyte  kind;             // 0 = touch, 1 = drag, 2 = release, 3 = card, 4 = sail
    short  x;                // trolley x, fixed-point ×16
    byte   payload;          // card index, or unused
}
```

A typical run: 9–20 crates × ~3 events = **~300 bytes**. A player with 90 rated routes carries ~27 KB of tapes. Trivial to store locally and to sync.

### The five jobs one tape does

**1 — The map is alive.**
Tap any route on the world map and the auto-ship visibly replays your best load in miniature, in a small inset. The idle layer becomes *literally* your past skill, on screen, earning. This is the feature that makes the thesis land emotionally rather than as a spreadsheet.

**2 — Anti-cheat.**
Weekly Regatta submissions carry **the tape only** — the client never states a score. Cloud Code re-simulates the tape against the same deterministic sim and *derives* the result, so there is no claimed value to dispute. See [12-liveops.md §2](12-liveops.md) and [15-lessons-from-prior-builds.md L3](15-lessons-from-prior-builds.md).

**3 — Ghost comparison.**
Race your own best on a route, shown as a translucent overlay hull. Also used for "watch the #1 run" in the Regatta.

**4 — UA creative generation.**
Automatically flag high-drama runs — largest recovered list angle, longest time above `WARN_ANG`, biggest capsize — and export them as 15 s clips. This genre is won on creatives, and you are generating them from real play at zero marginal cost. See [09-monetization.md §6](09-monetization.md).

**5 — Bug reports reproduce.**
Any support ticket ships with the tape. A physics bug becomes a unit test.

### Determinism obligations

Tapes are worthless if the sim drifts. All rules in [02-physics-port.md §10](02-physics-port.md) are hard requirements, enforced by an assembly boundary and a banned-API analyzer.

Tape version is bumped on **any** sim change. Old tapes are retained but marked `stale` — they still display their recorded score and still pay idle income, they simply cannot be re-simulated. Never invalidate a player's Route Rating because of a patch.

## 4. Hull upgrades

Four sim-visible tracks per hull, 5 tiers each, ported and extended from the prototype's `UPGRADES` table.

| Track | Icon | Effect | Formula |
|---|---|---|---|
| **Beam** | 🛳️ | Wider hull, flatter, carries more | `halfW = base × (1 + 0.06 × tier)` |
| **Ballast** | ⚖️ | Keel weight rights her faster | righting `= 1.2 + 0.6 × tier` |
| **Deck** | 🟩 | Grippy decking, less sliding | `deckMu = 0.72 + 0.06 × tier` |
| **Crane** | 🪝 | Faster winch, slower sweep over deck | `cableSpeed = 96 + 14 × tier`, sweep ×`(1 − 0.07 × tier)` |

**Every upgrade must be visible in the simulation and in the art.** A wider beam is a wider sprite. Ballast adds a visible keel weight and lowers the resting waterline by a pixel. Rubber decking changes the deck's colour band. Crane tier changes the winch housing. An upgrade the player cannot see is an upgrade they do not believe in.

Upgrades are **per hull**, not global. This is what makes the archetype roster a real collection rather than a skin selector — a maxed Barge and a stock Clipper are genuinely different tools.

## 5. Mastery curve

Difficulty is authored and never scales. Progression is the changing relationship between a fixed challenge and a growing player.

```
  Fogport — authored: quota 5 · swell 6.0 · gusts · Bullion mix
  parScore 4,200 · never changes

  Week 1   Tug T1        best ×1.8   capsized 4×    rating 0.61
  Week 2   Tug T3        best ×3.1   capsized 1×    rating 0.94
  Week 4   Barge T3      best ×6.2   clean          rating 1.42
  Week 9   Barge T5      best ×8.7   clean          rating 1.88
           ▲
           └── that delta IS the progression
```

Three things grew: the hull, the player's read of the sim, and the player's nerve. Only one of them was bought.

### Surfacing mastery

The game must make the player's own improvement legible, because self-perceived growth is the retention mechanism:

- **Route line:** `Best ×6.2 · Rating 1.42 · was ×1.8 four weeks ago`
- **Fleet record:** `Fleet-wide record: ×9.8 — Barge "Dogged" at Kelp Quay`
- **Personal bests feed a notification** when beaten, with the delta.
- **Season recap** at the end of each season pass: total delivered, best save, worst capsize, most-improved route.

## 6. Prestige — Found a New Trading Company

Unlocks at **250 total Port Tiers**, typically 90–150 hours in.

| Reset | Kept |
|---|---|
| All port tiers | **All Route Ratings** |
| All buildings | **All input tapes** |
| Coins | Hulls owned |
| Warehouse cargo | Hull upgrade tiers |
| Region unlocks | Gems, cosmetics, season progress |

```
prestigeMult = 1 + 0.35 × prestigeRank        // global idle × production
```

Plus a **Legacy Hull** per rank — archetypes unavailable any other way, with a distinctive silhouette. Rank 1 grants the *Ironclad*: enormous beam, terrible freeboard, unique to prestige players.

**Route Ratings survive prestige.** This is the critical design choice. The player's skill record is theirs permanently; only their *investment* resets. It also means a prestiged player's idle income restarts strong the moment they re-tier a port, which prevents the post-reset trough that kills prestige systems.

Prestige requires a two-step confirmation with an explicit, itemised list of what is lost, and cannot be triggered accidentally from a stray tap.

## 7. Progression pacing targets

| Milestone | Target session | Target elapsed |
|---|---|---|
| First port tier | 3 | 15 min |
| Second hull owned | 7 | day 2 |
| Region 2 unlocked | 9 | day 2 |
| First building choice | 12 | day 3 |
| Region 3 unlocked | 22 | day 5 |
| Fleet of 4 hulls | 35 | day 9 |
| First Regatta entry | 40 | day 10 |
| Region 5 unlocked | 90 | day 24 |
| Hull at tier 5 | 130 | day 38 |
| Prestige available | 400 | day 110 |

If soft-launch data shows Region 2 landing later than day 3, the first lever is its Port Tier gate, remote-configured. Region 2 arriving on day 2 is a D3 retention driver and should be protected aggressively.
