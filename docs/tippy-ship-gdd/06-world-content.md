# 06 — World & Content

Eight regions. Roughly 90 authored ports. Then endless water.

---

## 1. Region structure

Each region is three things at once: a **visual identity**, a **mechanic reveal**, and a **live-ops unit**. A limited-time region *is* an event, which is why the content architecture and the events architecture are the same architecture.

| # | Region | Ports | Gate (Port Tiers) | New mechanic | Palette |
|---|---|---|---|---|---|
| 1 | **Home Coast** | 14 | 0 | — teaching | Warm dawn, teal water |
| 2 | **The Shallows** | 12 | 12 | **Tide swing** — waterline drifts mid-run | Pale turquoise, sandbars |
| 3 | **Ferry Lanes** | 12 | 28 | **Wake tests** — scheduled and unscheduled | Grey-blue, industrial |
| 4 | **Roaring Reach** | 12 | 45 | **Sustained wind heel** | Slate, whitecaps |
| 5 | **Ice Run** | 11 | 70 | **Icing** — spray adds mass to top crates | Cold white-blue |
| 6 | **Monsoon Straits** | 11 | 105 | **Squalls** — rain slicks the deck | Green-grey, heavy rain |
| 7 | **Nightwatch** | 10 | 150 | **Fog & lantern** — restricted visibility | Deep indigo, lamp pools |
| 8 | **Open Waters** | ∞ | 210 | procedural, all mechanics | Rotates |

Total authored: **82 ports**, plus infinite procedural.

## 2. Region mechanics in detail

### R2 — Tide swing

The mean waterline drifts over the run on a slow sine.

```
tideOffset(t) = sin(t × TIDE_RATE + port.tidePhase) × port.tideAmp
// applied as a constant added to WaterYAt()
TIDE_RATE = 0.18 rad/s        // ~35 s period
port.tideAmp = 3 .. 9 u
```

A load that was safely above the rail at t=10 s can have the rail underwater at t=30 s. Teaches **freeboard** as a distinct resource from list angle. Must call `WakeAll()` on each meaningful tide step.

Telegraph: a tide gauge post at the quayside with a visibly rising/falling marker, plus the water sound gaining a low swell layer.

### R3 — Wake tests

The prototype's ferry, promoted. Two variants:

- **Scheduled** — a horn sounds 2.5 s before the ferry appears. Skill test: finish loading or brace.
- **Unscheduled** — no horn. Appears during the load phase. Pure hazard.

```
WAKE.amp = 8 + region.wakeBonus        // 8 .. 18
WAKE.env = sin(π × clamp(t / 3.4, 0, 1))
WAKE.ph += dt × 9
```

### R4 — Sustained wind heel

Prototype gusts, extended with a constant background heel.

```
wind.base  = port.windBase           // 0 .. 45, constant heeling force
wind.gust  = 50 + port.gustPeak      // 50 .. 160, 1.3 s bursts
wind.warnT = 0.9                     // telegraph before the gust
```

The base heel means the hull *never sits level*. Every load must be deliberately asymmetric to compensate, which inverts everything the player learned in regions 1–3.

Telegraph: flags, spray direction, a wind arrow at screen edge, and a rising band-passed noise 0.9 s before a gust.

### R5 — Icing

Freezing spray accumulates on exposed cargo.

```
every ICE_TICK (2.0 s):
    for each cargo with no body directly above it:
        b.m    += b.m0 × ICE_RATE        // ICE_RATE = 0.035
        b.iceLayer += 1                  // visual: frost overlay, 4 steps
    hull.m += hull.m0 × ICE_RATE × 0.5
```

Mass grows **at the top of the stack**, which is exactly where it hurts. Raises the centre of mass over time and converts a stable load into an unstable one purely by waiting. The clock becomes an enemy for the first time in the game.

Counterplay: the **Icebreaker** hull is immune, and a Glassware crate on top acts as an ice shield for what is under it — turning the game's most fragile cargo into a deliberate tactical choice.

### R6 — Squalls

```
during squall (4–7 s, telegraphed by darkening sky and rain onset):
    deckMuEffective = deckMu × 0.62
    visibility slightly reduced (rain overlay)
```

Cargo slides. The Rubber Deck upgrade goes from a nice-to-have to essential, which retroactively makes an earlier purchase feel prescient.

### R7 — Fog & lantern

Global visibility is reduced to a lamp-lit pool around the crane and hull. The far parallax is fully obscured; the horizon reference the player has been using to judge list angle **disappears**.

This is the region where the bubble inclinometer stops being a convenience and becomes the primary instrument. That is a deliberate long-arc payoff: a HUD element introduced in session 1 becomes essential 150 hours later.

Counterplay: a **Lamp** hull upgrade (cosmetic tier track, cheap) widens the lit radius.

### R8 — Open Waters

Procedural, endless, leaderboard-attached.

```
port = generate(seed = baseSeed + index):
    swell        = lerp(6.0, 9.5,  clamp(index / 200, 0, 1)) ± rand
    chop         = lerp(2.5, 4.3,  clamp(index / 200, 0, 1)) ± rand
    mechanics    = weighted pick 1..3 from all region mechanics
    cargoMix     = weighted by player's warehouse composition
    quota        = 5 + floor(index / 25), capped 12
    parScore     = fitted from the above
```

Cargo mix weighted by the player's own warehouse means Open Waters always uses cargo the player actually has, which prevents the endless tail from becoming cargo-locked.

## 3. Port authoring schema

Every authored port is a ScriptableObject with exactly these fields. Nothing else. Anything that cannot be expressed here needs a design conversation, not a new field.

```csharp
[CreateAssetMenu]
public class PortDef : ScriptableObject
{
    public ushort   id;
    public byte     regionId;
    public Vector2  mapPos;
    public string   nameOverride;      // empty = procedural namer

    // economy
    public int      costBase;          // port tier cost base
    public int      baseYield;         // idle coins/hr at rating 1.0
    public int      parScore;          // rating denominator

    // contract
    public byte     quota;             // 3 .. 12
    public CargoMix contractMix;       // required cargo composition

    // sea state
    public float    baseSwell;         // WAVE.a1   3.0 .. 9.5
    public float    chop;              // WAVE.a2   1.5 .. 4.3
    public float    tideAmp;           // 0 = off
    public float    tidePhase;
    public float    windBase;          // 0 = off
    public float    gustPeak;          // 0 = off
    public byte     wakeBonus;         // 0 = off
    public bool     icing;
    public bool     squalls;
    public bool     fog;
    public bool     gulls;

    // presentation
    public TownSilhouette silhouette;  // fishing / trading / industrial / city
    public byte     ambientSet;
}
```

## 4. Difficulty axes and their curve

Difficulty is authored per port, never scaled to player power. These are the only levers.

| Axis | Range | Effect on the run |
|---|---|---|
| Quota | 3–12 | Baseline load before greed begins |
| Swell `a1` | 3.0–9.5 | Continuous roll perturbation |
| Chop `a2` | 1.5–4.3 | High-frequency noise; averaged by the 7-sample fit |
| Cargo mix | — | Bullion-heavy = low freeboard; Barrel-heavy = chaos |
| Tide amp | 0–9 | Freeboard drains over time |
| Wind base | 0–45 | Permanent asymmetry |
| Gust peak | 0–160 | Discrete shocks |
| Wake bonus | 0–10 | Sail-phase danger spike |
| Icing | on/off | Top-heavy over time |
| Squalls | on/off | Reduced deck friction |
| Fog | on/off | Removes visual horizon reference |
| Gulls | on/off | Random one-sided weight |

**Authoring rule: never more than 3 non-baseline axes active on a single port.** Four or more becomes unreadable and the player cannot attribute a capsize to a cause. An unattributable failure is a churn event.

## 5. Difficulty curve across the world

```
  parScore
     │                                              ╭─ Open Waters (∞)
 40k │                                        ╭─────╯
     │                                  ╭─────╯  Nightwatch
 20k │                          ╭───────╯ Monsoon
     │                  ╭───────╯ Ice Run
 10k │           ╭──────╯ Roaring Reach
     │      ╭────╯ Ferry Lanes
  4k │  ╭───╯ Shallows
     │──╯ Home Coast
     └────────────────────────────────────────────────► port index
        14    26    38    50    61    72    82
```

Within each region, difficulty rises across its ports, then **drops slightly at the start of the next region** before climbing past the previous peak. That sawtooth gives the player a competence beat immediately after each unlock, which is where the reveal moment needs to land.

## 6. Content production cost

| Asset | Count | Notes |
|---|---|---|
| Region palettes | 8 | Palette swap on shared tilesets |
| Town silhouettes | 4 archetypes × 5 tiers | Reskinned per region palette = 160 visual states, 20 authored |
| Sky / parallax sets | 8 | Per region |
| Weather overlays | 4 | Rain, fog, snow, spray |
| Port defs | 82 | Data only, ~20 min each to author and tune |
| Hull sprites | 12 × 5 tiers | See [11-art-pipeline.md](11-art-pipeline.md) |
| Cargo sprites | 5 types × ~4 variants | Plus 4 ice-layer overlays |
| Ambient audio sets | 8 | See [07-juice-audio.md](07-juice-audio.md) |
| Music stems | 4 × 8 regions = 32 | ElevenLabs |

A new region post-launch costs roughly: 1 palette, 1 parallax set, 1 ambient set, 4 music stems, 10–12 port defs, and 0–1 new mechanics. **Two to three weeks.** That is the live-ops content cadence the architecture is designed to sustain.

## 7. Cut candidates

If the schedule bites, cut in this order — see [14-milestones-cutlist.md](14-milestones-cutlist.md):

1. **Region 7 (Nightwatch)** — the fog mechanic is the most expensive rendering work for the fewest ports.
2. **Region 6 (Monsoon)** — squalls are a single friction multiplier; the weather VFX is the cost.
3. **Open Waters procgen** — ship without the endless tail; it only matters to players 200 hours in.

Never cut: regions 1–3. Those carry D1 through D7.
