# 15 — Lessons From Prior Builds

Mined from seven shipped or in-flight Unity projects in this repo group: **BlockRise, Gloamdelve, Kinfold, Mogul, One Armed Army, Rent Baron (RB), Street Baron (SB)** — all Unity 6000.5.1f1, all by the same hands, all carrying `DECISIONS.md` / `AUDIT.md` / `PATCH.md` / `BUGS.md` logs.

Every entry below is a mistake that **actually happened**, with its source, and the specific thing Tippy Ship does differently because of it. Nothing here is hypothetical.

Several are not analogies. Kinfold already ships the exact architecture this spec calls for — an engine-free deterministic Core, re-simulated ghosts, server-side validation in Cloud Code — and it has already been bitten in the places Tippy Ship is most exposed.

---

## 1. Determinism and the wire

### L1 — A determinism test that does not serialise proves nothing
**Kinfold, `PATCH.md` P-067.**

A ghost was defined as "a squad snapshot + a seed, re-simulated client-side". `OwnedMon.Snapshot()` carried IVs, EVs, nature and runes; `ToJson` wrote **none of them**. Only def, level, stars and skills crossed the wire. Every ghost fetched as JSON therefore re-simulated into *a different fight than the one its owner actually fought*. The runes had been missing for months.

Why nothing caught it: `GhostBattle_ReSimulatesIdentically` re-ran an **in-memory** ghost against itself. It never crossed the JSON boundary — the only place anything can be lost — so it was green throughout and *would have stayed green forever*. As the log puts it, a determinism test that does not serialise is testing that the sim is a pure function, which was never in doubt.

> **The general form, quoted from the log:** *when a thing is defined by surviving a boundary, the test has to cross the boundary.*

**Tippy Ship is the same shape, exactly.** A `RunTape` is a seed plus inputs plus setup, re-simulated elsewhere. If `hullTier`, an upgrade tier, or the seed itself fails to serialise, the Regatta re-sim diverges, the leaderboard rejects honest players, and the parity harness never notices.

**Mitigation — mandatory:**
- The parity harness round-trips through **serialised tape bytes**, never an in-memory struct.
- A reflection test asserts every field on `RunSetup` and `RunTape` appears in the written payload. It fails on any newly added field until that field is written and read.
- One test round-trips a tape through JSON *and* through the Cloud Code path, asserting an identical event log — not just an identical final score.
- Tapes written before a field existed back-fill to a defined default, never to zero. Kinfold's all-zero fallback produced units weaker than anything in the game.

See [02-physics-port.md §10](02-physics-port.md) and [04-progression.md §3](04-progression.md).

### L2 — Hash-container iteration order silently decides simulation outcomes
**Gloamdelve, `Docs/AUDIT.md` C8 — three separate leaks, all in the system its determinism rule exists to protect.**

`Dictionary.Values` was copied to a `List`, weighted, and picked **by index**. Removing an entry permutes the buckets, so the same seed and the same logical pool produced a different enemy, different HP, a different fight. Worse, the save serialiser recompacted the map on reload — *so a save/load changed the answer*. A second leak made two players with an identical loadout produce different loot depending on the order they had equipped things.

**Mitigation:** [02-physics-port.md §10](02-physics-port.md) already bans ordered iteration over hash containers. This lesson upgrades it from a rule to a reviewed failure mode, with the two accepted fixes: sort by a **total order** before use (ids are unique, so ordinal id comparison works), or iterate a **fixed enum order** and `TryGetValue`. Never expose a `Dictionary.Values` from a sim type at all.

### L3 — The client must never state a value the server can derive
**Kinfold, `DECISIONS.md` K-052.**

The client never names a prize. It names a *stage*, and `RewardEngine` re-runs the fight from the authoritative save and derives what the run was worth — the same function running in Cloud Code, which is only possible because Core is engine-free and seeded.

**This spec was weaker than that.** [12-liveops.md §2](12-liveops.md) had the client submit a tape *and a claimed score*, validated within a 2% tolerance band. That tolerance exists only because a claimed number is being compared against.

**Change:** a Regatta submission carries **the tape only**. The server derives the score. There is no claimed value to tolerance-check, so the whole class of "my score was 0.3% off and got rejected" support ticket disappears, and cross-platform float drift stops being an anti-cheat problem — it becomes a display problem, which is what it actually is.

The client shows a provisional local score and adopts the server's number when it returns. Kinfold's P-068 is still **open** precisely because adoption semantics were never decided up front: *"the client must adopt the returned state"* has been in a class comment since the beginning and was never implemented. Decide it now, in the spec: **the server's score is the score.**

### L4 — Do not mint ids before identity is known
**Gloamdelve, `Docs/AUDIT.md`.**

Ids were minted as `$"{PlayerId}:{counter++}"` with `PlayerId` defaulting to `local`. Every player produced `local:1`, `local:2`… so ids collided across accounts in a shared pool, and the ownership test reported every imported record as the player's own. The game's **headline hook silently corrupted on first cloud sync**.

**Mitigation:** Tippy Ship mints nothing identity-scoped — tape ids, hull names, Regatta entries — before UGS sign-in resolves. Offline fallback is a **persisted per-install GUID**, never a literal. Assert at first cloud sync that no id carries the fallback prefix once a real identity exists.

---

## 2. Save format

### L5 — A version field that is written but never read is not a migration plan
**Gloamdelve, `Docs/AUDIT.md` M3.**

`SaveSerializer` wrote `root["v"]` and a comment said *"v is available for migrations when Version increments"*. That was the entire treatment — `Load` never read it. The consequence: rename a key in v2 and a v1 save loads with that field **empty**, then re-saves it empty. Silent data loss. And a v1 client reading a v2 cloud mirror truncates the newer save and **writes it back down**.

**Mitigation, written into [10-tech-architecture.md §4](10-tech-architecture.md):**
1. `Load` reads `schemaVersion` as its first act.
2. `v > Version` is **rejected outright** — an older client must refuse a newer cloud save and tell the player to update. It must never truncate and re-upload.
3. `v < Version` routes through explicit, ordered, individually-tested migration steps.
4. A test loads a fixture save of every historical schema version and asserts a complete, correct result.

For an idle game with 200-hour accounts, this is the highest-consequence class of bug in the project.

### L6 — Serialise enums by name, never by ordinal
**Gloamdelve, `Docs/AUDIT.md` M3.**

Three enums were written as `(int)`. Insert a new member in the middle and every existing save's `"5"` rehydrates as the wrong thing. One enum in the same file was correctly written by name, and a code comment claimed the project serialised by name "where forward-compat matters" — true of exactly that one.

**Mitigation:** `CargoType`, `HullId`, `BuildingType`, `UpgradeTrack`, `RegionId` all serialise by `ToString()` and read with `Enum.TryParse` plus an explicit fallback. Enforced by a test that round-trips every enum member and by an analyzer rule banning `(int)` casts of these types in serialisation code.

---

## 3. Economy simulation

### L7 — A day-granularity sim cannot see a first-session lull
**Street Baron, `BUGS.md` B9 and B28 — two separate P1 economy bugs from one blind spot.**

B9: "the game must hold a new player engaged ~30 min without a lull." Fixed by widening a guarantee — but the log admits *"a real 30-min device playtest is the final validation; the existing sim harness is day-level, not minute-level."* B28 then found the lull was still there: real wall-clock time plus hour-long cooldowns meant the phone "genuinely died for ~an hour" after the guarantee expired. Two rounds of the same bug, because the harness could not see minutes.

**This spec had the same hole.** [10-tech-architecture.md §8](10-tech-architecture.md) specified "500 simulated player-days" in CI — which would miss a first-session lull completely.

**Change:** two sims, answering different questions.

| Harness | Granularity | Horizon | Question |
|---|---|---|---|
| `FirstArcSim` | **per-minute** | first 45 min | Is there ever a gap with nothing to do? |
| `LongArcSim` | per-day | 500 days | Does the economy run away or stall? |

`FirstArcSim` asserts **no idle gap longer than 40 s** in the first 45 minutes — no moment where the player has no cargo, no runnable contract, and no affordable purchase. That is the metric SB needed and did not have.

Both SB and Rent Baron keep timestamped `sim_reports/` committed to the repo; Tippy Ship adopts the same, so a balance change's effect is a diff rather than a memory.

### L8 — A harness holding a copy measures the copy
**Kinfold, `PATCH.md` P-076.**

The balance harness's reference squad kept its own copy of the evolution rules instead of asking `EvolutionEngine`. It therefore validated the copy, not the game. Fixed by having the harness call the real engine.

**Mitigation:** neither `FirstArcSim`, `LongArcSim`, nor the parity harness may reimplement a formula. They call `EconomyService`, `IdleService` and `RunSimulation` directly. Any duplicated coefficient in test code is a review blocker.

### L9 — Assert invariants, not values
**Rent Baron / One Armed Army, `DECISIONS.md`.**

After a full economy re-derivation, the regression tests were rewritten to assert the *invariant* — per-unit ordering `hand > corner > fence` — rather than specific numbers. Invariants survive rebalancing; hardcoded values break on every tuning pass and get deleted.

**Tippy Ship invariants to assert in CI:**

| Invariant | Why it matters |
|---|---|
| `mult(n) > mult(n−2)` for all n | **The ad-continue dominance proof** in [01-core-loop.md §7](01-core-loop.md). If this ever breaks, greed is dead |
| `idleCoinsPerHour ≤ bestManualRunRate` | Pillar P5 — idle never out-earns hand-piloting |
| `0 ≤ routeRating ≤ 2.5` | Bounds the compounding loop |
| `0.6 ≤ hullSuitability ≤ 1.8` | Bounds assignment power |
| cargo sale value strictly increases with card weight | No dominant overload card |
| every region reachable at its gate with achievable income | No progression walls |

These are the tests that must not be deleted when numbers change.

### L10 — Run the balance model outside Unity
**Kinfold, `tools/BalanceCli` — the whole balance model runs "outside Unity in three seconds".**

Only possible because Core touches no engine type. The `AUDIT.md` is explicit that this is not hygiene: engine-free Core is what enables EditMode tests without a scene, ghost re-simulation, server-side validation, *and* the CLI.

**Mitigation:** Tippy Ship ships `tools/TippySim` — `TippyShip.Sim` plus the economy services under plain .NET, runnable from the command line. The assembly wall in [10-tech-architecture.md §1](10-tech-architecture.md) already makes this possible; this lesson makes it **required**, because a three-second balance loop and a three-minute one produce different amounts of balancing.

---

## 4. Unity rendering and performance

### L11 — Audio import settings, or 32 stems will not fit in memory
**Rent Baron, `PERF_REPORT.md`.**

Six music clips at `DecompressOnLoad` sat at **≈140 MB resident**. Switching to streaming Vorbis q0.7 brought it to **<1 MB**.

That is ~23 MB resident per clip. **Tippy Ship specifies 32 stems** ([07-juice-audio.md §6](07-juice-audio.md)). At Rent Baron's rate that is roughly **750 MB resident** on a device with a 3 GB floor. This is not a performance regression; it is an instant out-of-memory kill, and it would arrive late, on device, in M5.

**Mitigation, now specified in [07-juice-audio.md](07-juice-audio.md):**

| Asset class | Load type | Compression |
|---|---|---|
| Music stems | **Streaming** | Vorbis q0.7 |
| Ambience loops | Streaming | Vorbis q0.6 |
| SFX (short, frequent) | Decompress On Load | Vorbis q0.5 |
| Creak / thunk families | Decompress On Load | Vorbis q0.5 |

Only the **4 stems of the current region** are loaded. Region transitions cross-fade and unload. A CI check fails the build if any clip over 5 s is not set to Streaming.

### L12 — Atlas the sprites or pay a bind per renderer
**Rent Baron, `PERF_REPORT.md`.**

384 `SpriteRenderer`s with no atlases, up to one bind each. Fixed with 4 `SpriteAtlas`es — point-filtered, uncompressed, 4096 max — after which the panorama batched by atlas page. The report also notes that **uncompressed is correct for point-filtered pixel art**; texture memory was left alone deliberately because pixel art is inherently cheap.

**Mitigation:** Tippy Ship has 168 hull part sprites plus cargo, towns and parallax ([11-art-pipeline.md §9](11-art-pipeline.md)). Atlas by category — Hulls / Cargo / Towns / Parallax / UI — point-filtered, uncompressed, 4096 max. Draw calls bounded by atlas pages, not by object count.

### L13 — `raycastTarget` defaults on for every Graphic
**Mogul, `CLAUDE_HANDOFF.md`.**

**437 of 437** Graphics had `raycastTarget` on. Every screen tap rect-tested all of them. Fixed by a scene-wide pass disabling it on everything except graphics that actually receive pointer events.

**Mitigation:** default off; enable only on interactive elements. An editor validation pass reports any non-interactive Graphic with it on. This matters more than usual here — the run's core input is a continuous hold-and-drag sampled every frame ([01-core-loop.md §2](01-core-loop.md)).

### L14 — Linear colour space lifts every colour assigned from code
**Mogul, `CLAUDE_HANDOFF.md` — logged as a "CRITICAL GOTCHA (cost 3 debug loops)".**

The project renders in linear colour space, so colours assigned from code display **gamma-lifted** — a 0.075 navy showed as roughly 0.3 washed grey. Low-alpha white overlays were noted as far worse, because they blend in linear.

**This will bite Tippy Ship precisely where it hurts.** The Tension Bus assigns colours from code *every frame* — vignette hue teal→amber→red, the rail rim-light, the inclinometer zone bands ([07-juice-audio.md §3](07-juice-audio.md)). Getting this wrong makes the game's primary danger signal wash out.

**Mitigation:** a single `Srgb()` helper applies `.linear`, and every Tension Bus channel routes colour through it. Never assign a literal `Color` to a material or `VisualElement` from sim code. The vignette is validated against reference screenshots in both themes during M1.

### L15 — `Shader.Find("Standard")` renders solid pink under URP, with no error
**Mogul, `CLAUDE_HANDOFF.md` — hit and fixed project-wide.**

No error, no warning; the material's colour is stored correctly but is invisible. Tippy Ship is URP-2D, so any runtime-created material must reference a URP shader. A startup assertion fails loudly if a null or non-URP shader is resolved, rather than shipping pink.

### L16 — Two things at the same sorting order draw in an unstable order
**Street Baron, `BUGS.md` B68.**

A flat background fill and the room sprite shared sorting order −16, so their draw order was unstable and the flat box **intermittently painted over the art** — a bug that looks like "the background sometimes doesn't load."

**Mitigation:** [10-tech-architecture.md §6](10-tech-architecture.md) already names explicit sorting layers (BG, Town, Water, Hull, Cargo, Crane, FX, UI). This lesson adds the rule that **no two renderers may share a layer *and* an order**, checked by an editor validation pass. The waterline in particular must never be occluded — it is Pillar P1.

---

## 5. UI, systemically

All from Street Baron, whose `BUGS.md` records a UI transcription pass that fixed roughly twenty bugs at once by finding a single root cause.

### L17 — Lock the UI reference resolution to the mockup resolution on day one
**SB `BUGS.md`, 2026-07-19 pass.**

The panel `referenceResolution` was 360×780 while every mockup was a 540×960 canvas, so **all UI rendered ~1.37× oversized**. That single mismatch was the root cause behind most of an entire annotated-screenshot bug batch — a dozen individually-filed bugs that were one bug.

**Tippy Ship is specified at 540×960** ([08-ux-ftue.md](08-ux-ftue.md), [11-art-pipeline.md §2](11-art-pipeline.md)). Set `PanelSettings` to `ScaleWithScreenSize` @ **540×960** in the first week of M1, assert it in a test, and author every mockup on that canvas. This is a one-line setting that costs weeks if it is wrong.

### L18 — Nav clearance is a systemic rule, not a per-panel fix
**SB `BUGS.md` B10, B39, B55 — the same bug three times.**

"Panels covered by the bottom nav" was fixed for some panels (B10), found again on the phone view (B39), and found *again* on the runners panel (B55), whose entry literally reads *"verify ALL panels clear the nav."*

**Mitigation:** one `--safe-bottom` token derived from nav height plus the device safe-area inset. Every overlay's bottom derives from it; no panel hardcodes a bottom value. A test enumerates every panel and asserts its content rect clears the nav. Fix the class, never the instance.

### L19 — One layout mistake can silently disable an entire feedback class
**SB `BUGS.md` B15.**

`.sb-toast` used `align-self: center` on an absolutely-positioned element, giving it **zero width** — so *every* toast in the game was invisible over open panels. It was found incidentally while fixing an unrelated affordability bug.

**Tippy Ship's entire design rests on feedback landing** ([07-juice-audio.md](07-juice-audio.md)). A silently-invisible popup class would gut the game while every system reported success.

**Mitigation:** a PlayMode smoke test fires one of each feedback class — popup, toast, particle burst, coach mark, inclinometer flash — and asserts non-zero resolved bounds and non-zero opacity. Cheap, and it catches the whole family.

### L20 — UITK scroll views are dead on touch without drag-scroll
**SB `BUGS.md` B71: "Scrolling doesn't work. Vertical scroll is dead on every panel."**

Add drag-scroll to the shared scroll component once, at the framework level, before building any scrolling screen.

---

## 6. The art pipeline is a hard external dependency

### L21 — An art service outage can block shipping
**Street Baron, `BUGS.md` B23 / B35 / B53 / B54.**

PixelLab access failed — `list_projects` returned 0 projects and no org — and stayed failed. The consequence, in the log's own words: the **single most important art slot, the gacha pull image, was "a blank purple square."** Four separate bugs were marked art-blocked and could not be closed at all.

**Tippy Ship gives PixelLab *everything on screen*** ([11-art-pipeline.md §1](11-art-pipeline.md)). That is a larger exposure than SB had.

**Mitigation:**
1. Generate and **commit** the style anchor plus every gameplay-critical sprite — hulls, all five cargo types, crane, UI core — during **M1**, not M5. Art generation front-loads; art *polish* can trail.
2. No gameplay-critical slot may depend on future generation. If it is on screen during a run, it exists in the repo.
3. Placeholders are **designed placeholders** — a legible grey silhouette with the correct footprint — never a blank coloured square. A designed placeholder ships without embarrassment; a blank square does not.
4. Cargo silhouettes are gameplay information ([11-art-pipeline.md §4](11-art-pipeline.md)); they are the first assets generated and the last permitted to change.

---

## 7. Build, release, and things only the owner can do

### L22 — Identify owner-blocked items at kickoff, not at build audit
**Rent Baron, `BUILD_AUDIT.md` — a "Red — blocked on you, cannot be done from here" section listing six items.**

Payment-provider go-live, privacy-policy hosting, ad mediation app ids, push/Firebase projects, store credentials, and device testing. All discovered as blockers *at build-audit time*, when the code was otherwise submittable.

**Mitigation:** [14-milestones-cutlist.md](14-milestones-cutlist.md) gains an **owner-blocked checklist opened in M0**, so these are in flight from week one:

- [ ] Apple Developer + Google Play accounts, app records created
- [ ] Keystore generated and backed up (see L23)
- [ ] Privacy policy, terms and support pages **hosted at live URLs**
- [ ] LevelPlay / mediation app ids for both platforms
- [ ] UGS project linked; Cloud Save and Leaderboards enabled on the dashboard
- [ ] Store IAP products created and matching the SKU table in [09-monetization.md §4](09-monetization.md)
- [ ] Physical device-floor handset acquired for testing
- [ ] Push/APNs and Firebase projects created

None of these are engineering work, and every one of them can stop a submission.

### L23 — Keystore passwords are not serialised
**BlockRise, `AUDIT.md`: "must be re-set from `store/keystore_info.txt` before each build (gotcha logged)."**

Document it in the release runbook, back the keystore up off-machine, and never discover it during a release.

### L24 — Version numbers do not bump themselves
**SB `BUGS.md` B31 ("version number never updates"), then B63 again one release later.**

Wire the boot footer to `Application.version` so it always tracks the real build, and bump both `bundleVersion` and `AndroidBundleVersionCode` as an explicit, checklisted release step.

### L25 — Receipt validation without store keys validates nothing
**Rent Baron, `BUILD_AUDIT.md`: `VerifyReceipt` "still accepts any well-shaped receipt because there are no store keys to check signatures against."**

Tippy Ship uses Unity IAP with server-side receipt validation ([10-tech-architecture.md §5](10-tech-architecture.md)). The store keys are on the M0 owner-blocked checklist, and a test asserts that a well-shaped but unsigned receipt is **rejected** — proving the path is real rather than shaped.

### L26 — Progress documents drift from the code
**Rent Baron, `BUILD_AUDIT.md` opens: "Checked against the code and ProjectSettings, not against `PROGRESS.md`'s claims."**

The audit deliberately distrusted the project's own status document. Tippy Ship's milestone exits are defined by **tests and device checks**, never by a document asserting completion. Where [14-milestones-cutlist.md §4](14-milestones-cutlist.md) defines "done", every clause is machine-checkable or device-observable.

---

## 8. Process artifacts worth copying

### L27 — Three logs, three questions
**Kinfold, `AUDIT.md`:** *"`DECISIONS.md` (K-001…K-122) is the authority on why; `PATCH.md` (P-001…P-086) on what broke; this file is the shape."*

Every mature project in this group carries the same convention, and it is the reason this document could be written at all. Tippy Ship adopts it from day one:

| File | Answers | ID prefix |
|---|---|---|
| `DECISIONS.md` | Why is it like this? | `T-001…` |
| `PATCH.md` | What broke, and how was the fix verified? | `P-001…` |
| `AUDIT.md` | What is the shape of the system now? | — |
| `docs/tippy-ship-gdd/` | What are we building? | this spec |

Commits reference the id: `fix(P-014): …`.

### L28 — Take the next free id by script, not by eye
**Kinfold, `PATCH.md`** carries a renumbering table because **four ids came to name two things each**. The file's own instruction:

```bash
grep -o "^#\+ P-0[0-9][0-9]" PATCH.md | grep -o "P-0[0-9][0-9]" | sort -u | tail -1
```

> *"Do not scan for the first number that 'looks free' — this file is not in ID order and new entries are appended at the bottom, so eyeballing it is exactly how four numbers came to name two things each."*

Trivial, and it cost a renumbering pass plus permanently ambiguous commit history.

---

## 9. What changed in this spec because of the above

| Lesson | Document changed | Change |
|---|---|---|
| L1 | [02-physics-port.md](02-physics-port.md), [04-progression.md](04-progression.md) | Parity harness crosses the serialisation boundary; field-coverage reflection test |
| L2 | [02-physics-port.md](02-physics-port.md) | Hash-order ban upgraded to a reviewed failure mode with two accepted fixes |
| L3 | [12-liveops.md](12-liveops.md) | **Regatta submissions carry the tape only.** Server derives the score; no claimed value, no tolerance band |
| L4 | [10-tech-architecture.md](10-tech-architecture.md) | No identity-scoped id minted before sign-in; persisted per-install GUID fallback |
| L5 | [10-tech-architecture.md](10-tech-architecture.md) | Read / reject-newer / migrate discipline, with fixture saves per version |
| L6 | [10-tech-architecture.md](10-tech-architecture.md) | Enums serialise by name |
| L7 | [10-tech-architecture.md](10-tech-architecture.md) | **`FirstArcSim` at per-minute granularity** alongside the 500-day sim |
| L8 | [10-tech-architecture.md](10-tech-architecture.md) | Harnesses call the real engines; no duplicated coefficients |
| L9 | [10-tech-architecture.md](10-tech-architecture.md) | Six invariants asserted in CI, including the ad-continue dominance property |
| L10 | [10-tech-architecture.md](10-tech-architecture.md) | `tools/TippySim` required, not optional |
| L11 | [07-juice-audio.md](07-juice-audio.md) | **Audio import table; only the current region's 4 stems resident** |
| L12 | [11-art-pipeline.md](11-art-pipeline.md) | Sprite atlases by category, point-filtered, uncompressed |
| L13 | [10-tech-architecture.md](10-tech-architecture.md) | `raycastTarget` off by default |
| L14 | [07-juice-audio.md](07-juice-audio.md) | `Srgb()` helper on every Tension Bus colour channel |
| L15, L16 | [10-tech-architecture.md](10-tech-architecture.md) | URP shader assertion; no shared sorting layer + order |
| L17–L20 | [08-ux-ftue.md](08-ux-ftue.md) | Reference resolution locked; `--safe-bottom`; feedback smoke test; drag-scroll |
| L21 | [11-art-pipeline.md](11-art-pipeline.md) | Gameplay-critical art committed in M1; designed placeholders only |
| L22–L26 | [14-milestones-cutlist.md](14-milestones-cutlist.md) | Owner-blocked checklist opened in M0; release runbook |
| L27, L28 | this file | `DECISIONS.md` / `PATCH.md` / `AUDIT.md` from day one |
