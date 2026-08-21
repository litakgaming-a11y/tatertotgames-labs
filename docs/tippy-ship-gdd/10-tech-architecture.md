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

**Cross-platform float determinism.** Box2D on ARM vs x86 can differ in the last bits. Mitigations, in order:

1. Server validation uses a **tolerance band** (score within 2%) rather than exact equality.
2. `Unity.Mathematics` with `[BurstCompile(FloatMode = FloatMode.Strict)]` on the sim hot path.
3. If drift proves material, fall back to fixed-point for the buoyancy accumulation only.

Do not attempt bit-exact cross-platform determinism as a v1 requirement. Tolerance-band validation is sufficient for anti-cheat and vastly cheaper.

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
validateRegattaSubmission(tape, claimedScore)
    → re-simulate headless, compare within 2% tolerance
    → reject with reason code on mismatch
    → write to leaderboard on pass

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

**Mitigation:** build the headless sim and the parity harness in Milestone 1, not Milestone 4. If it works in week 3, everything downstream is safe. If it does not, the cut list in [14-milestones-cutlist.md](14-milestones-cutlist.md) lets the Regatta slip to 1.1 without disturbing anything else.

## 6. Rendering

| Setting | Value |
|---|---|
| Pipeline | URP 2D Renderer |
| Reference resolution | 540 × 960 |
| Filter mode | Point (no filter) on all sprites |
| Compression | Crunch off for pixel art; RGBA32 for small atlases |
| Pixel Perfect Camera | **Off** — see below |
| Sorting | Explicit sorting layers: BG, Town, Water, Hull, Cargo, Crane, FX, UI |

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
    economy simulation — 500 simulated player-days, assert no runaway
    headless sim build — must compile without UnityEngine.Input

on tag:
    Android AAB + iOS archive
    upload symbols to Crashlytics
    upload build to internal test track
```

The parity harness failing is a **build blocker**. Everything else can warn.

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
