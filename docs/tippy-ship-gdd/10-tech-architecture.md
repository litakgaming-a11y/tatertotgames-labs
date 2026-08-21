# 10 — Technical Architecture

Unity 6 LTS · 2D URP · full UGS at launch · deterministic sim behind an assembly wall.

---

## 1. Assembly layout

The single most important architectural decision is the wall around the simulation.

```
TippyShip.Sim            ← NO UnityEngine.Input, NO Time, NO Random
   ├─ deterministic, fixed-step, seeded
   ├─ references: UnityEngine.Physics2D, Unity.Mathematics only
   └─ compiles and runs headless (server validation, CI parity harness)

TippyShip.Game           ← game systems, state machines, economy
   └─ references: Sim

TippyShip.Presentation   ← rendering, VFX, audio, Tension Bus channels
   └─ references: Sim (read-only), Game

TippyShip.UI             ← screens, HUD
   └─ references: Game

TippyShip.Services       ← UGS, ads, IAP, analytics
   └─ references: Game

TippyShip.Tests          ← parity harness, economy sims, replay tests
```

`TippyShip.Sim` must compile into a headless build with no Unity runtime dependencies beyond Physics2D. This is what lets Cloud Code re-simulate submitted tapes. Enforce with an assembly definition and a Roslyn analyzer banning the forbidden API list in [02-physics-port.md §10](02-physics-port.md).

## 2. Core class contracts

### Sim layer

```csharp
namespace TippyShip.Sim
{
    // Owns the world. Advances only via Step(). Knows nothing about frames.
    public sealed class RunSimulation
    {
        public RunSimulation(RunSetup setup);      // seed, hull, port, upgrades
        public void   Step(InputSample input);      // exactly one PH substep
        public RunSnapshot Snapshot { get; }        // read-only view for presentation
        public RunOutcome  Outcome  { get; }        // null until resolved
        public uint   Tick { get; }
    }

    public readonly struct InputSample
    {
        public readonly bool  touching;
        public readonly float trolleyX;
        public readonly bool  releaseThisTick;
        public readonly sbyte cardChoice;           // -1 = none
        public readonly bool  sailPressed;
    }

    public sealed class BuoyancySolver     // §4 of 02-physics-port.md
    {
        public void ApplyHullForces(Hull h, WaterField w, float dt);
        public void ApplyCargoForces(Body b, WaterField w, float dt);
    }

    public sealed class WaterField          // WaterYAt / WaterSlopeAt, wave + wake + tide
    public sealed class WeldSystem          // TrySleep / SyncSleeper / WakeAll
    public sealed class Mulberry32          // ported seeded RNG
    public sealed class TensionEvaluator    // pure function → float
}
```

### Game layer

```csharp
namespace TippyShip.Game
{
    public sealed class RunDirector          // drives RunSimulation from live input
    public sealed class TapeRecorder         // captures InputSample deltas → RunTape
    public sealed class TapePlayer           // replays a RunTape into RunSimulation
    public sealed class EconomyService       // cargo, coins, gems, all formulas
    public sealed class PortService          // tiers, buildings, production
    public sealed class FleetService         // ownership, assignment, suitability
    public sealed class IdleService          // offline accrual, coins/hr
    public sealed class ProgressionService   // route ratings, unlocks, prestige
    public sealed class ContractService      // contract generation, overload hands
    public sealed class SaveService          // schema, migration, UGS Cloud Save
}
```

### Presentation layer

```csharp
namespace TippyShip.Presentation
{
    public sealed class TensionBus           // one scalar → all channels
    public interface  ITensionChannel { void Apply(float tension, float dt); }
    // implementations: MusicStemChannel, CreakChannel, HeartbeatChannel,
    //   CameraChannel, VignetteChannel, HapticChannel, AmbienceChannel,
    //   RimLightChannel, InclinometerChannel, WaterTintChannel
    public sealed class PunchDirector        // discrete one-shots
    public sealed class HullRenderer         // sub-pixel rotation, sprite assembly
}
```

## 3. Determinism enforcement

Beyond the banned-API analyzer:

| Mechanism | Purpose |
|---|---|
| `Physics2D.simulationMode = Script` | We control exactly when Box2D steps |
| `Physics2D.autoSyncTransforms = false` | No implicit transform writes |
| Fixed substep, no variable path | One code path only |
| Single `Mulberry32` threaded explicitly | No ambient RNG |
| `double` accumulators in the least-squares fit | Reduces float-order drift |
| CI parity test on every sim commit | Catches drift the day it happens |
| Tape version bump on any sim change | Old tapes marked stale, never invalidated |

**Cross-platform float determinism.** Box2D on ARM vs x86 can differ in the last bits. This is a *display* concern, not a validation one, because the server derives the authoritative score from the tape and the client adopts it — see [15-lessons-from-prior-builds.md L3](15-lessons-from-prior-builds.md). Mitigations, in order:

1. `Unity.Mathematics` with `[BurstCompile(FloatMode = FloatMode.Strict)]` on the sim hot path.
2. The client's local score is provisional and visually replaced by the server's on response.
3. If drift ever becomes visible to players, fall back to fixed-point for the buoyancy accumulation only.

Do not attempt bit-exact cross-platform determinism as a v1 requirement.

### The serialisation boundary is where determinism actually dies

Kinfold's re-simulation feature broke for months with a green determinism test, because the test never crossed JSON ([15-lessons-from-prior-builds.md L1](15-lessons-from-prior-builds.md)). Required here:

| Test | Asserts |
|---|---|
| `Tape_RoundTripsThroughBytes` | Replay from serialised bytes matches replay from memory, event for event |
| `Tape_FieldCoverage` | Reflection over `RunSetup` and `RunTape`: every field appears in the written payload. **Fails on any new field** until written and read |
| `Tape_RoundTripsThroughCloudCode` | Identical **event log**, not merely an identical score |
| `Tape_LegacyBackfills` | A tape missing a since-added field loads to a defined default, never zero |

## 4. Save schema

```csharp
[Serializable] public class SaveData
{
    public int      schemaVersion;         // migrate forward, never break
    public long     lastSeenUtcTicks;

    public long     coins;
    public int      gems;
    public int[]    cargo;                 // indexed by CargoType

    public PortSave[]  ports;              // tier, buildings[], storage
    public HullSave[]  hulls;              // id, name, tiers[4], assignedRouteId
    public RouteSave[] routes;             // id, bestScore, rating, tapeRef

    public int      prestigeRank;
    public int      fleetSlots;
    public byte     regionsUnlocked;

    public int      dailyStreak;
    public long     dailyLastUtcTicks;
    public SeasonSave season;

    public Settings settings;              // haptics, reducedMotion, cvdPalette, assistedLower
}
```

### Version discipline — read it, reject newer, migrate older

Gloamdelve wrote a save version field and **never read it**, with a comment promising it was "available for migrations". The consequence: renaming a key silently loaded that field empty and re-saved it empty, and an older client reading a newer cloud mirror truncated it and **wrote it back down** ([15-lessons-from-prior-builds.md L5](15-lessons-from-prior-builds.md)). On a 200-hour idle account that is the worst bug this project can ship.

```csharp
int v = root.GetInt("schemaVersion", 0);

if (v > SaveData.Version)          // an OLD client must never truncate a NEW save
    throw new SaveTooNewException();   // → "Update Tippy Ship to continue"

for (int step = v; step < SaveData.Version; step++)
    Migrations[step].Apply(root);   // ordered, individually tested
```

- `v > Version` → **reject outright**, prompt to update. Never load, never re-upload.
- `v < Version` → explicit ordered migration steps, one per version.
- A fixture save for **every historical schema version** lives in the test assets and is loaded in CI.

### Enums serialise by name, never by ordinal

Gloamdelve wrote three enums as `(int)`; inserting a member mid-enum rehydrates every existing save's `"5"` as the wrong thing ([15-lessons-from-prior-builds.md L6](15-lessons-from-prior-builds.md)). `CargoType`, `HullId`, `BuildingType`, `UpgradeTrack` and `RegionId` are written with `ToString()` and read with `Enum.TryParse` plus an explicit fallback. Note that `SaveData.cargo` above is therefore a **name-keyed map**, not an array indexed by enum value.

### Identity before id-minting

Gloamdelve minted ids as `local:1`, `local:2` before sign-in resolved; they collided across accounts in a shared pool and the game's headline hook silently corrupted on first cloud sync ([15-lessons-from-prior-builds.md L4](15-lessons-from-prior-builds.md)). Nothing identity-scoped here — tape ids, hull names, Regatta entries — is minted before UGS sign-in resolves. Offline fallback is a **persisted per-install GUID**, never a literal. On first successful sync, assert no id carries the fallback prefix.

### Schema repair — port the prototype's discipline

`play.html:285` coerces and clamps every field on load and discards unknown shapes. **Keep this.** It is why the prototype never corrupts. Every field on load:

```csharp
save.coins = Clamp(ParseOrDefault(o.coins, 0L), 0L, 1_000_000_000_000L);
```

Never trust the deserialiser. Never trust the cloud. Never trust yesterday's build.

### Cloud Save conflict policy

Last-write-wins is wrong for an idle game — a player who plays on two devices loses progress. Policy:

```
on conflict:
    take the save with the higher (totalPortTiers, coinsEarnedLifetime) tuple
    merge routes: take the max rating per route from BOTH saves
    merge hulls owned: union
    warn the player, offer to view the discarded save's summary
```

Route ratings merge by max because they represent skill records, and losing one is the most painful possible bug in this design.

## 5. UGS integration — full stack at launch

| Service | Use |
|---|---|
| **Authentication** | Anonymous by default; optional Apple/Google link for cross-device |
| **Cloud Save** | `SaveData` blob, conflict policy per §4 |
| **Remote Config** | Every constant in [03-economy.md §9](03-economy.md), Tension curves, ad frequency caps, region gates |
| **Analytics** | Event taxonomy per [13-analytics-kpi.md](13-analytics-kpi.md) |
| **Leaderboards** | Weekly Regatta, per-seed |
| **Cloud Code** | Tape validation, Regatta submission, daily/season state |
| **Economy** | **NOT USED** — see below |
| **LevelPlay** | Ad mediation |
| **IAP** | Unity IAP with server receipt validation |

### Why UGS Economy is excluded

The game is offline-first and idle. Server-authoritative currency would add latency to every transaction and break the loop entirely without signal. Currency lives client-side with server-side *validation* on suspicious deltas rather than server-side *authority*.

Anti-cheat posture: this is a single-player idle game with one competitive surface (the Regatta). Cheating the economy harms nobody. Cheating the leaderboard is prevented by tape re-simulation. That is the right allocation of effort.

### Cloud Code functions

```
validateRegattaSubmission(tape)          // NO claimed score — see L3
    → verify tape is well-formed and matches the week's seed
    → re-simulate headless, DERIVE the score
    → reject with reason code on malformed/wrong-seed/divergent
    → write the derived score to the leaderboard
    → return the derived score; the CLIENT ADOPTS IT as authoritative

getDailyContract(playerId, utcDay)
    → deterministic from (utcDay, playerProgressBand)
    → prevents client clock manipulation

getRegattaSeed(weekIndex)
    → the same seed for every player worldwide

claimSeasonReward(tier)
    → server-validated season progress
```

### Launch-scope risk

Full UGS at launch is the largest engineering item in the plan and it front-loads the hardest work — Cloud Code tape validation in particular requires the sim to compile and run headless, which is the assembly wall's first real test.

**The Weekly Regatta is committed v1.0 scope** and is on the never-cut list. That commitment is only safe because the feature and its validation are separable:

| Layer | Cost | v1.0 posture |
|---|---|---|
| Leaderboard write + read | Low | Ships |
| Deterministic seed distribution | Trivial — one integer per week | Ships |
| Tape capture and retention | Already built for map replays | Ships |
| Replay viewing | Low | Ships |
| **Per-submission headless re-sim** | **High** | Degradable — see below |

**Mitigation, in order:**

1. Build the headless sim and parity harness in **M0**, not M4. If it works in week 3, everything downstream is safe.
2. Prove the leaderboard write path plus a real end-to-end re-sim in the **M3 spike**, four weeks before it is needed rather than during the milestone that needs it.
3. If M4 still overruns, degrade validation to the **ceiling heuristic** — simulate the week's seed once offline to establish a plausible maximum, reject submissions above it, flag the top percentile for review, reject malformed tapes. One headless run per week instead of per-submission infrastructure.
4. Because every tape is retained regardless, exact re-simulation in v1.1 runs retroactively over the archive and retro-corrects the boards.

Full detail in [14-milestones-cutlist.md §2.1](14-milestones-cutlist.md). The general pattern: **degrade the expensive component, never the committed feature.**

## 6. Rendering

| Setting | Value |
|---|---|
| Pipeline | URP 2D Renderer |
| Reference resolution | 540 × 960 |
| Filter mode | Point (no filter) on all sprites |
| Compression | Crunch off for pixel art; RGBA32 for small atlases |
| Pixel Perfect Camera | **Off** — see below |
| Sorting | Explicit sorting layers: BG, Town, Water, Hull, Cargo, Crane, FX, UI |
| `raycastTarget` | **Off by default** — see below |

### Three Unity gotchas already paid for by sibling projects

**`raycastTarget` defaults on for every Graphic.** Mogul found **437 of 437** Graphics with it enabled, so every screen tap rect-tested all of them ([15-lessons-from-prior-builds.md L13](15-lessons-from-prior-builds.md)). It matters more here than usual because the core input is a continuous hold-and-drag sampled every frame. Default off; enable only on elements that receive pointer events; an editor validation pass reports violations.

**`Shader.Find("Standard")` renders solid pink under URP, with no error or warning.** Mogul hit it project-wide ([L15](15-lessons-from-prior-builds.md)). Any runtime-created material must resolve a URP shader, and a startup assertion fails loudly on a null or non-URP result rather than shipping pink.

**Two renderers sharing a sorting layer *and* order draw in an unstable sequence.** Street Baron had a background fill and a room sprite both at order −16; the flat box intermittently painted over the art, presenting as "the background sometimes doesn't load" ([L16](15-lessons-from-prior-builds.md)). No two renderers may share a layer and an order — checked by an editor validation pass. The waterline especially must never be occluded; it is Pillar P1.

### Sub-pixel rotation

Unity's Pixel Perfect Camera snaps positions to the pixel grid, which would stair-step the hull's rotation and destroy the game's primary information channel. Instead:

- **Camera** renders to a 540 × 960 RenderTexture with point filtering, upscaled to the device resolution with integer-or-nearest scaling.
- **Hull, cargo, crane, cable** render with free rotation and sub-pixel position into that target. Point filtering keeps the pixel *texel size* consistent; only the rotation is smooth.
- **Backgrounds, towns, UI** are snapped to the grid so they stay rock-solid.

The result reads as pixel art with honest continuous motion — the same technique used by modern pixel games with physics. Verify on a 720p device: the hull must rotate smoothly and the town must not shimmer.

## 7. Content pipeline

| Asset type | Source | Import |
|---|---|---|
| Hull sprites | PixelLab | Sprite atlas per hull, 5 tier variants |
| Cargo sprites | PixelLab | One atlas, all types + 4 ice overlays |
| Town silhouettes | PixelLab | Per archetype × tier, palette-swapped at runtime |
| Tilesets, parallax | PixelLab | Per region |
| UI assets, fonts | PixelLab | `create_ui_asset`, `create_font` |
| Key art, UA creatives | Higgsfield | Not shipped in the build |
| Music stems | ElevenLabs | 4 stems × 8 regions, Vorbis 128 kbps |
| SFX | ElevenLabs | ~90 assets, Vorbis 96 kbps |

Palette swapping is done in a shader with a 256×1 palette LUT per region, so one silhouette set serves all eight regions. See [11-art-pipeline.md](11-art-pipeline.md).

## 8. Build and CI

```
on every push:
    dotnet format / Unity code analysis
    TippyShip.Tests — unit tests
    PARITY HARNESS — seeds 4471, 9102, 31337 vs golden CSV   ← BLOCKING
      · replays from SERIALISED TAPE BYTES, not memory       ← see §3
      · Tape_FieldCoverage reflection test                   ← see §3
    FirstArcSim  — per-MINUTE, first 45 min, no gap > 40 s   ← see below
    LongArcSim   — per-day, 500 player-days, no runaway
    INVARIANTS   — the six economic invariants below         ← BLOCKING
    audio import check — no clip > 5 s set to DecompressOnLoad
    headless sim build — must compile without UnityEngine.Input

on tag:
    Android AAB + iOS archive
    upload symbols to Crashlytics
    upload build to internal test track
```

The parity harness and the invariant suite failing are **build blockers**. Everything else can warn.

### Two economy sims, because one granularity cannot answer both questions

Street Baron shipped the *same* first-session pacing bug twice, because its harness was day-level and the lull was minute-level — its own log says so ([15-lessons-from-prior-builds.md L7](15-lessons-from-prior-builds.md)). A 500-day sim would miss it here too.

| Harness | Granularity | Horizon | Question |
|---|---|---|---|
| `FirstArcSim` | **per-minute** | first 45 min | Is there ever a gap with nothing to do? |
| `LongArcSim` | per-day | 500 days | Does the economy run away or stall? |

`FirstArcSim` asserts **no idle gap longer than 40 s** — no moment where the player has no cargo, no runnable contract, and no affordable purchase.

Both write timestamped reports to a committed `sim_reports/` directory, as Rent Baron and Street Baron both do, so a balance change's effect is a diff rather than a memory.

### Harnesses call the real engines

Kinfold's balance harness kept its own copy of the evolution rules and therefore validated the copy ([L8](15-lessons-from-prior-builds.md)). Neither sim nor the parity harness may reimplement a formula — they call `EconomyService`, `IdleService` and `RunSimulation` directly. A duplicated coefficient in test code is a review blocker.

### Assert invariants, not values

Rent Baron rewrote its economy tests to assert orderings rather than numbers, because values die on every tuning pass ([L9](15-lessons-from-prior-builds.md)). These six are asserted in CI and are **not** to be deleted when numbers change:

| Invariant | Protects |
|---|---|
| `mult(n) > mult(n−2)` for all n | The ad-continue dominance proof, [01-core-loop.md §7](01-core-loop.md). If this breaks, greed is dead |
| `idleCoinsPerHour ≤ bestManualRunRate` | Pillar P5 — idle never out-earns hand-piloting |
| `0 ≤ routeRating ≤ 2.5` | Bounds the compounding loop |
| `0.6 ≤ hullSuitability ≤ 1.8` | Bounds assignment power |
| cargo sale value strictly increases with card weight | No dominant overload card |
| every region reachable at its gate on achievable income | No progression walls |

### `tools/TippySim` — the balance model outside Unity

Kinfold runs its whole balance model under plain .NET **in three seconds**, and its audit is explicit that engine-free Core is what makes that possible ([L10](15-lessons-from-prior-builds.md)). The assembly wall in §1 already permits it; this makes it required. A three-second balance loop and a three-minute one produce different amounts of balancing.

## 9. Third-party dependencies

Keep this list short. Every dependency is a future migration.

| Package | Purpose | Justification |
|---|---|---|
| Unity Gaming Services | Backend | Chosen; see §5 |
| LevelPlay | Ad mediation | Part of UGS |
| Unity IAP | Purchases | Part of UGS |
| Unity.Mathematics + Burst | Sim performance and float mode | Required for determinism control |
| DOTween | UI tweening only | Never used in the sim |

Explicitly **not** used: any third-party physics, any ECS framework, any save-system asset, any UI framework beyond UGUI.
