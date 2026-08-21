# 02 — Physics Port

> **The prototype is the spec.** [`games/tippy-ship/play.html`](../../games/tippy-ship/play.html) is the authoritative reference for feel. Where this document and the prototype disagree, the prototype wins and this document is wrong.

---

## 1. Division of labour

| Concern | Owner | Rationale |
|---|---|---|
| Contacts, manifolds, friction, restitution | **Box2D** (Unity `Rigidbody2D`) | Solved problem. Do not rewrite it. |
| Stacking stability, warm starting | **Box2D** | Battle-tested, better than the prototype's 8/2 iteration solver |
| Buoyancy, displaced area, centre of buoyancy | **Ported** | This is the game. Nobody else's code does this. |
| Roll torque from CoB vs CoM | **Ported** | The core mechanic |
| Water drag, wave slope sway | **Ported** | Tuned feel |
| Ballast righting moment | **Ported** | Upgrade-visible |
| Mooring spring | **Ported** | Keeps the hull under the crane |
| Weld-to-hull sleeping | **Ported** | See §6 — Box2D sleep is not equivalent |
| Wind gust heeling torque | **Ported** | Applied above deck |
| Gull weight at offset | **Ported** | Delightfully literal |

## 2. Constants — port these exactly

From `play.html` lines 505–560. **Do not "clean up" these numbers.** Several are the result of tuning that is not obvious from reading them.

```csharp
public static class Sim
{
    public const float G            = 1300f;   // gravity, world u/s²
    public const float RHO          = 1.0f;    // water density
    public const float PH           = 1f/150f; // fixed physics substep
    public const float MAX_V        = 1900f;
    public const float MAX_VA       = 9f;

    public const float CAPSIZE_ANG  = 0.70f;   // ~40°
    public const float WARN_ANG     = 0.44f;   // ~25°  slow-mo + heartbeat
    public const float SAVED_ANG    = 0.28f;   // ~16°  recovery latch

    public const float HULL_DENS    = 0.34f;
    public const float HULL_W0      = 184f;
    public const float HULL_H       = 52f;

    public const float KEEL_INERTIA_MULT = 2.2f;  // see §4 — critical
    public const float TERMINAL_FALL     = 640f;
}
```

Unity project settings:

| Setting | Value |
|---|---|
| `Time.fixedDeltaTime` | `0.0066667` (1/150) |
| `Physics2D.velocityIterations` | 8 |
| `Physics2D.positionIterations` | 3 |
| `Physics2D.simulationMode` | `Script` — we drive it manually |
| `Physics2D.gravity` | `(0, 0)` — gravity is applied per-body in the sim |
| `Physics2D.autoSyncTransforms` | `false` |

Gravity is zero at the `Physics2D` level because buoyant bodies need gravity applied in the same pass as buoyancy, in a controlled order. See §5.

## 3. Water surface

```csharp
public float WaterYAt(float x)
{
    float y = Mathf.Sin(x * 0.016f + waveT * 1.5f) * wave.a1
            + Mathf.Sin(x * 0.043f - waveT * 2.3f) * wave.a2;
    if (wake.on)
        y += Mathf.Sin(x * 0.045f - wake.ph) * wake.amp * wake.env;
    return y;
}

public float WaterSlopeAt(float x) => (WaterYAt(x + 8f) - WaterYAt(x - 8f)) / 16f;
```

Per-region amplitude, replacing the prototype's `level`-driven ramp:

```csharp
wave.a1 = region.baseSwell;      // 3.0 .. 8.5
wave.a2 = region.chop;           // 1.5 .. 4.3
```

`waveT` advances by `dt * timeScale` — **not raw `dt`**. The water must slow down with the slow-motion, or the capsize sequence looks broken.

## 4. Hull buoyancy — the core port

Port of `applyHullForces()`, `play.html:845`.

```csharp
void ApplyHullForces(Hull h, float dt)
{
    // 1. gravity
    h.vy += Sim.G * dt;

    // 2. least-squares water line across 7 samples spanning the hull.
    //    CRITICAL: sampling a single point aliases short chop into huge fake
    //    tilts. The fit averages chop out. Do not reduce the sample count.
    var verts = BoxVerts(h);
    float hw2 = h.w * 0.5f + 10f;
    const int NS = 7;
    float sxs = 0, sys = 0, sxx = 0, sxy = 0;
    for (int i = 0; i < NS; i++)
    {
        float xi = -hw2 + (2f * hw2) * i / (NS - 1);
        float yi = WaterYAt(h.x + xi);
        sxs += xi; sys += yi; sxx += xi * xi; sxy += xi * yi;
    }
    float den   = NS * sxx - sxs * sxs;
    float slope = den != 0 ? (NS * sxy - sxs * sys) / den : 0;
    float icpt  = (sys - slope * sxs) / NS;

    // 3. clip the hull polygon below that line → displaced area + centroid
    var sub = ClipBelowWater(verts,
                             h.x - 120f, icpt + slope * -120f,
                             h.x + 120f, icpt + slope *  120f);
    var pc  = PolyAreaCentroid(sub);
    h.subFrac = Mathf.Clamp01(pc.area / h.area);

    if (pc.area > 0f)
    {
        float Fb = Sim.RHO * Sim.G * pc.area;

        // 4. buoyant force at the centre of buoyancy
        h.vy -= Fb * h.invM * dt;

        // 5. THE MECHANIC: roll torque = horizontal offset between the
        //    centre of buoyancy and the centre of mass, times buoyant force.
        h.va += (-(pc.cx - h.x) * Fb) * h.invI * dt;

        // 6. water drag, scaling with submersion
        float q = h.subFrac;
        h.vx /= 1f + 3.0f * q * dt;
        h.vy /= 1f + 6.0f * q * dt;
        h.va /= 1f + (6.5f * q + 1.0f) * dt;

        // 7. wave slope sways the hull laterally
        h.vx += WaterSlopeAt(h.x) * 40f * q * dt;
    }

    // 8. welded sleepers still weigh on the ship — see §6
    foreach (var sb in weldedCargo)
    {
        float Fw = sb.m * Sim.G;
        h.vy += Fw * h.invM * dt;
        h.va += ((sb.x - h.x) * Fw) * h.invI * dt;
    }

    // 9. ballast keel — explicit righting moment, upgrade-scaled
    h.va += -Mathf.Sin(h.a) * (1.2f + 0.6f * ballastTier) * dt * 2.6f;

    // 10. mooring spring keeps her under the crane
    h.vx += (-2.2f * h.x - 1.6f * h.vx) * dt;

    // 11. wind gust — horizontal force above the deck → heeling torque
    if (wind.gustT > 0f)
    {
        float f = wind.gust * wind.dir;
        h.vx += f * 0.16f   * dt;
        h.va += f * 0.00055f * dt;
    }

    // 12. seagull standing on one rail — real weight at a real offset
    if (gull.state == GullState.Landed)
    {
        float ca = Mathf.Cos(h.a), sa = Mathf.Sin(h.a);
        float lx = gull.side * (h.w * 0.5f - 12f);
        float rx = ca * lx - sa * (-h.h * 0.5f);
        h.vy += gull.w * Sim.G * h.invM * dt;
        h.va += (rx * gull.w * Sim.G) * h.invI * dt;
    }
}
```

### The keel inertia trick — do not lose this

```csharp
// makeHull(), play.html:548
hull.I    *= 2.2f;
hull.invI /= 2.2f;
```

Extra rotational inertia representing keel and machinery low in the hull. It **slows roll build-up without changing the buoyancy equilibrium**, which is what makes the game forgiving early and readable late. It is the single most important tuning knob in the project and it is invisible in the equations above.

In Unity, set this explicitly:

```csharp
rb.inertia = baseInertia * Sim.KEEL_INERTIA_MULT;
```

`Rigidbody2D.inertia` is only settable after `useAutoMass` is disabled and mass is assigned. Verify with an assertion in `Awake` — a silent revert to auto-inertia will change the entire game's feel and it will not be obvious why.

### Starting draft

```csharp
hull.y = -HULL_H / 2f + (hull.m / RHO) / (hullHalfW * 2f);
```

Places the hull at approximately its equilibrium draft on spawn, so it does not visibly bob into place at the start of every run.

## 5. Cargo buoyancy

Port of `applyCargoForces()`, `play.html:909`.

```csharp
void ApplyCargoForces(Body b, float dt)
{
    b.vy += Sim.G * dt;
    if (b.vy > Sim.TERMINAL_FALL) b.vy = Sim.TERMINAL_FALL;  // thunky, not explosive

    float wy    = WaterYAt(b.x);
    float half  = b.isCircle ? b.r : b.h * 0.5f;
    float depth = b.y - wy;

    if (depth > -half)
    {
        float frac = Mathf.Clamp01(0.5f + depth / (2f * half));
        b.vy -= Sim.G * (Sim.RHO / b.dens) * frac * dt;
        b.vx /= 1f + 3.0f * frac * dt;
        b.vy /= 1f + 3.4f * frac * dt;
        b.va /= 1f + 2.0f * frac * dt;
    }

    if (wind.gustT > 0f && b.y < WaterYAt(b.x) - 4f)
        b.vx += wind.gust * wind.dir * 0.10f * dt;

    if (b.touching) b.vx /= 1f + 1.5f * dt;   // settles instead of surfing

    if (b.isCircle && b.touching)             // barrel rolling resistance
    {
        b.va /= 1f + 4.5f * dt;
        b.vx /= 1f + 0.8f * dt;
    }
}
```

Note `RHO / b.dens` — cargo denser than water sinks, less dense floats. Bullion at `dens 1.05` sinks; a Barrel at `0.62` bobs. This falls out of the physics rather than being special-cased, which is why the cargo types feel coherent.

## 6. Weld-to-hull sleeping — port this, do not use Box2D sleep

Port of `trySleep()` / `syncSleeper()`, `play.html:932`.

Box2D's sleep puts a body to rest in *world* space. That is wrong here: a stack of crates on a rolling hull is at rest relative to the **hull**, not the world. Using Box2D sleep produces jitter, drift, and stacks that shear apart under roll.

```csharp
void TrySleep(Body b, Hull h, float dt)
{
    float rvx = b.vx - h.vx, rvy = b.vy - h.vy;
    bool calm = b.touching
             && rvx * rvx + rvy * rvy < 36f
             && Mathf.Abs(b.va - h.va) < 0.25f
             && Mathf.Abs(h.va) < 0.15f
             && Mathf.Abs(h.a)  < 0.35f;

    if (!calm) { b.sleepT = 0f; return; }

    b.sleepT += dt;
    if (b.sleepT <= 0.4f) return;

    b.sleeping = true;
    b.invM = 0f; b.invI = 0f;              // kinematic: supports neighbours, no jitter
    float c = Mathf.Cos(-h.a), s = Mathf.Sin(-h.a);
    float dx = b.x - h.x, dy = b.y - h.y;
    b.lx = c * dx - s * dy;                 // store the pose in HULL LOCAL SPACE
    b.ly = s * dx + c * dy;
    b.la = b.a - h.a;
}

void SyncSleeper(Body b, Hull h)
{
    float c = Mathf.Cos(h.a), s = Mathf.Sin(h.a);
    b.x = h.x + c * b.lx - s * b.ly;
    b.y = h.y + s * b.lx + c * b.ly;
    b.a = h.a + b.la;
    float rx = b.x - h.x, ry = b.y - h.y;
    b.vx = h.vx - h.va * ry;               // rigid-body velocity, so contacts stay sane
    b.vy = h.vy + h.va * rx;
    b.va = h.va;
}
```

**Sleepers still weigh.** A kinematic body contributes nothing to the solver, so its load would vanish from the hull. Step 8 of `ApplyHullForces` re-applies each sleeper's weight and moment explicitly. Losing this makes a fully-loaded ship float *higher* than an empty one — a catastrophic and very confusing bug.

### `WakeAll()` — mandatory call sites

Every event that changes the world under a sleeping stack must wake everything:

| Event | Call site |
|---|---|
| Wake test begins | `BeginSail()` |
| Wind gust fires | `UpdateWind()` when `gustT` is set |
| Gull lands | `UpdateGull()` on transition to `Landed` |
| Capsize begins | `StartCapsize()` |
| Ad-continue rights the hull | `AdContinueResolve()` |
| Region tide swing steps | `UpdateTide()` |

Missing one produces cargo frozen in mid-air relative to a hull that has moved. Add a debug assertion that no sleeper's world position differs from `SyncSleeper`'s prediction by more than 0.5 u.

## 7. Update order — this order is load-bearing

```
for each substep of PH:
    1. waveT += PH * timeScale
    2. ApplyHullForces(hull, PH)
    3. for each awake cargo: ApplyCargoForces(b, PH)
    4. Physics2D.Simulate(PH)               // Box2D: contacts, friction
    5. for each cargo: TrySleep(b, hull, PH)
    6. for each sleeper: SyncSleeper(b, hull)
    7. ClampVelocities(MAX_V, MAX_VA)
    8. CheckOverboardAndFragile(PH)
    9. CheckFailStates()
   10. TensionBus.Evaluate()
```

Applying forces *before* `Simulate` and syncing sleepers *after* is not interchangeable. Reversing 5 and 6 causes sleepers to be welded to a stale hull pose.

Substep count per frame: `ceil(frameDt * timeScale / PH)`, clamped to 6 to prevent a spiral of death on a hitching device.

## 8. Cargo physics properties

| Type | Shape | Size | `dens` | `mu` | `e` | Behaviour |
|---|---|---|---|---|---|---|
| Crate | box | 23–33 sq | 0.50–0.64 | 0.65 | 0.04 | Stacks flat, forgiving |
| Timber | box | 62–74 × 13 | 0.50 | 0.50 | 0.04 | Long, bridges gaps, slides |
| Barrel | circle | r 12–15 | 0.62 | **0.25** | 0.12 | **Rolls.** The chaos agent |
| Bullion | box | 30 × 26 | **1.05** | 0.60 | 0.04 | Heavy, sinks the rail |
| Glassware | box | 27 × 22 | 0.38 | 0.60 | 0.02 | Breaks under load or impact |

Deck friction: `deckMu = 0.72 + 0.08 × deckTier` (4 tiers → 0.96 at max). Applied as the hull's `PhysicsMaterial2D.friction`; Box2D combines contact friction as `sqrt(muA × muB)`, which matches the prototype's behaviour closely enough. **Verify this in the parity harness** — if it drifts, override the friction combine with a custom contact callback.

### Glassware break conditions

```csharp
if (b.kind == Fragile && (b.crush > 0.35f || b.impulseFromAbove > b.m * 150f))
    Break(b);

b.impulseFromAbove *= 0.7f;   // decay per frame
```

`impulseFromAbove` accumulates normal impulse from contacts whose normal points downward into the body. `crush` is the sustained normal force from above, normalised by the body's own weight.

## 9. The parity harness — non-negotiable

Without this, tuning silently drifts during the port and the game's feel is lost with no way to detect it.

**Build a headless test scene** that:

1. Loads a fixed seed (start with `4471`, `9102`, `31337`).
2. Replays a canned input tape — trolley x, hold durations, card choices.
3. Records `hull.a`, `hull.y`, `hull.subFrac` at 30 Hz for 30 simulated seconds.
4. Compares against a golden CSV exported from the prototype.

**Export the golden data from `play.html`** by adding a temporary instrumentation block that logs the same three values at the same rate under the same seed, then dumps CSV to the console.

**Assertions**

| Metric | Tolerance |
|---|---|
| `max abs(Δ hull.a)` over 30 s | < 0.5° (0.0087 rad) |
| `max abs(Δ hull.y)` | < 1.5 u |
| `mean abs(Δ subFrac)` | < 0.02 |
| Capsize occurs in both or neither | exact |
| `SAVED!` fires in both or neither | exact |

Run in CI on every commit touching the sim. A failure is a **build blocker**, not a warning.

### Expected divergence sources, in order of likelihood

1. `Rigidbody2D.inertia` silently reverting to auto — check first, always.
2. Friction combine mode differing from the prototype's `mu` handling.
3. `waveT` advancing on raw `dt` instead of `dt * timeScale`.
4. Substep count differing under frame-rate variation.
5. Float accumulation order in the least-squares fit — use `double` for the accumulators if this bites.

## 10. Determinism rules

Replays, the Weekly Regatta and server-side validation all depend on the sim being bit-reproducible. See [04-progression.md §3](04-progression.md) and [12-liveops.md §3](12-liveops.md).

**Forbidden inside the sim assembly:**

- `Time.deltaTime`, `Time.time`, `Time.realtimeSinceStartup`
- `UnityEngine.Random`, `System.Random` without an explicit seed
- `DateTime.Now`
- Iteration over `Dictionary` or `HashSet` where order affects results
- Any physics query returning results in unspecified order
- `float` parsing from localised strings

**Required:**

- All RNG through a single seeded `Mulberry32` instance, ported from `play.html:246`, threaded explicitly.
- Fixed substep only. No variable-step fallback path, ever.
- The sim assembly compiles with `[assembly: DisableRuntimeInitializeOnLoad]` style isolation and has **no reference to UnityEngine.Input** — input arrives as a value type from the tape or the live capture layer.
- Enforce with an assembly-definition boundary and a Roslyn analyzer banning the forbidden APIs. This is cheap and it will save the project.

## 11. Performance budget

| Item | Budget on device floor |
|---|---|
| Substeps / frame | ≤ 6 (typically 2–3 at 60 fps) |
| Active rigid bodies | ≤ 24 (quota 9 + overload 12 + debris 3) |
| Buoyancy polygon clip | 1 per substep (hull only) |
| Sleeper syncs | ≤ 20 per substep, transform-only |
| Sim time / frame | < 4 ms |

Cargo bodies that have gone overboard drift for 6 s then despawn (`obT > 6`). Never let debris accumulate.
