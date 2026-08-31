# TaterTot Games Labs — Wave 10: the Kinfold Lab

Four probes, not four games.

**Kinfold** (`C:\Users\hp\Documents\GitHub\Kinfold`) is a pixel-art creature-collecting auto-battler
in Unity — 99 sprites, 49 lines, a deterministic battle sim, ~120 ratified design decisions. Four
systems were proposed for it: two that could replace the combat model, two that would add a new
pillar. Building any of them in Unity costs weeks and, in two cases, breaks a ratified decision.

So they were built here first. Each probe is a single self-contained HTML file that isolates **one
mechanic** and answers **one question** with a number. The arena is the cheap place to be wrong.

Shared discipline across all four:

- **Kinfold's locked 40-colour palette** (K-037) and its type rules (K-009/K-044): Ember → Verdant →
  Tide is a one-way cycle; Radiant and Umbral are an opposed pair that answers nothing.
- **Gen-1 staging** (K-002) — your Kinmon front-left and large, the enemy back-right and small, both
  on platform shadows, with a bottom narration box because K-023 is right that the text box is the
  game's voice.
- Rendered to a fixed 270×480 pixel buffer and scaled with nearest-neighbour, so the art is honestly
  chunky rather than smooth-scaled.
- Every probe exposes a **headless test hook** that runs its measurement without the renderer, and
  every measurement below is produced by that hook rather than asserted.

---

## 31. 🔶 Tell — *optional elemental parry*

**The question:** can an optional parry make a watch-only auto-battler active without breaking it?

Kinfold's K-003 makes the capture throw the only input during a battle, and its own justification
names the risk it is trading against: *"a battle you touch zero times is a screensaver and players
skip it by day three, wasting the entire art budget."*

Tell gives every enemy attack a **tell** — a type-coloured glyph and a closing ring during the
wind-up. Tap the element that beats it and your Kinmon interposes for a fraction of the damage and
charges the capture meter. Tap wrong, or never tap, and the battle resolves **exactly** as it does
today. Radiant and Umbral show a grey tell meaning *there is no answer to this one*, which teaches
K-044 better than a tooltip could.

| Measurement (60 seeded runs each) | Result |
|---|---|
| Ladder cleared **never tapping** | 6 / 60 |
| Ladder cleared always tapping correctly | **47 / 60** |
| Average stages reached, never → always | 1.85 → 3.57 |

**A never-tapper still clears.** That is the property that makes it additive rather than mandatory,
and it is the whole proposal.

**What building it taught:** the first version was unclearable under *both* policies — 0/60 each —
because the enemy scaled with the ladder and the party did not. The probe was measuring a stat wall,
not a parry. Worth remembering that a measurement of the wrong thing looks exactly like a
measurement.

**The cost, honestly:** it breaks K-003. And it survives K-023's SKIP rule only while it stays
optional — the moment a stage is balanced around it, SKIP dies and grinding becomes labour.

---

## 32. 🔁 Handoff — *the order is the game*

**The question:** is squad order, made explicit and given consequences, enough to be the whole game?

Kinfold already measured the premise. Its K-045 found stage 5-1 losing **0/10 in one squad order and
averaging 64% across all three** — ordering is worth more than levels, stars or runes, and the game
resolves it on a menu screen before the fight.

Handoff moves that decision to the front and gives it a chain. You drag three Kinmon into order
against a revealed enemy squad, read what each will hand to the next when it falls, and lock in.
There is **no input during the battle at all** — K-003 survives literally.

| Handoff | Earned when | Effect |
|---|---|---|
| **Vengeance** | the next shares the fallen one's type | enters with a charged hit |
| **Momentum** | it fell while the enemy was under half HP | enters a step faster |
| **Shelter** | the next is strong into the enemy that just won | enters behind a shield |

| Measurement | Result |
|---|---|
| Best ordering | up to **24 / 24** wins |
| Worst ordering, same squad and seeds | **0 / 24** |
| Best order with handoffs ON | 32 / 40 |
| Best order with handoffs OFF | 19 / 40 |

**Zero to twenty-four out of twenty-four on the same squad.** That is a wider swing than Kinfold's own
K-045 measurement, and it is the argument for this proposal in one line.

**The cost:** a mandatory pre-fight puzzle on every grind re-clear is exactly the friction SKIP exists
to remove. A per-stage order memory has to ship *with* the feature, not after it.

---

## 33. 🔥 Crucible — *push your luck on the game's real scarcity*

**The question:** would a player rather play this than tap the recipe it replaces?

Kinfold has no energy system by decree (K-004), which makes capture charms the one resource the whole
free loop bottlenecks on — and they come from tapping a Workshop recipe. Crucible attaches a toy to
that exact scarcity: feed cores one at a time, each raising the tier and the heat, and bank before the
pot cracks. A crack banks the batch at the last tier you passed, so there is **no downside limb** —
you cannot lose what you put in, only fail to gain more (K-018).

| Measurement (500 shifts, 40-core budget) | Value |
|---|---|
| Flat tier-1 recipe — the baseline it replaces | 12.00 |
| Stop-at-the-line policy | **29.53** |
| Reckless greed policy | 21.68 |

**What building it taught — the most useful finding in the wave.** The first version *failed its own
EV gate*: 10.05 against the recipe's 12.00. A tax dressed as a minigame. The cause was not a tuning
mistake, it was a collision with Kinfold's own economy — `WorkshopEngine` prices higher charm tiers to
be per-core **worse** on purpose ("higher tiers are not a better deal, they are insurance"), so value
per core halves as tiers rise: 0.030 → 0.020 → 0.0125. Under that curve *any* toy that pushes toward
higher tiers is EV-negative by construction.

The fix was to change what the pot makes: it now tempers a **batch**, so every committed core becomes
a charm at whatever tier is reached, and per-core value rises with tier. That is the part which would
need a decision in Kinfold — the toy itself breaks nothing.

**The other risk:** it is a second variance system in a game that already has a gacha.

---

## 34. 🫱 Bonds — *squad or job, never both*

**The question:** is exclusive assignment a real decision once something accrues on *both* sides?

K-010 makes assignment exclusive — a Kinmon is on your squad or on a job, never both — and the GDD
calls that the engine of the whole game. But today only one side accrues: jobs pay a resource, and the
squad pays experience the jobs could also have bought.

Bonds puts a second, non-purchasable currency on the squad side. A pair builds Bond only by fighting
side by side, and at ten battles together they unlock a **Duo** — sideways utility (a second hit, a
shield, a cover, an initiative flip), never raw power.

| Sixteen days under each strategy | Stage | Duos | Avg level |
|---|---|---|---|
| All jobs | 2 | **0** | 9.5 |
| All squad | 3 | **3** | 5.0 |
| Mixed | **7** | 3 | 8.0 |

Three genuinely different destinations, and mixing beats both purities — which is what a real decision
looks like. Levels are rented; bonds are earned; neither buys the other.

**The cost, and the argument to have:** a Duo is structurally a two-piece set bonus, and Kinfold's
K-007 rejected rune sets deliberately — *"no sets, no substats, no upgrade rolling"*. The defence is
that a bond is earned by playing rather than acquired, cannot be rolled or gambled for, and pays a
narrated skill rather than a stat line. If the team reads Bonds as sets by the back door, **K-007
should win and this should be dropped.** It also needs the premium-parity test extended to duos, or
bonds become a paywall on the best moves.

---

## What the wave is for

These are instruments, not products, and they are scored differently: a probe succeeds when it
produces a number that changes a decision, including when that number is bad. Crucible's first build
failing its EV gate was worth more than the other three passing, because it found a collision with a
shipped pricing philosophy that no amount of design discussion had surfaced.

**No projected KPIs for this wave.** These do not have retention curves; publishing invented ones
would dress instruments up as products.

**If one system goes into Kinfold first: Crucible.** It breaks nothing ratified, touches no combat
code, and attaches to the resource the loop is gated on.

**If the goal is genuinely to replace the combat system: Handoff, not Tell.** Tell buys engagement by
contradicting the pitch — *"a Pokémon you can watch instead of play"* — and needs an optionality
escape hatch to survive SKIP. Handoff keeps the watching intact and moves the thinking to where the
game's own measurements say it already lives.

---

*Kinfold design authority is `kinfold_gdd.md` + `DECISIONS.md` in that repo. Nothing in this wave is
ratified; the proposals live in `CONCEPTS_COMBAT_AND_SYSTEMS.md` there.*
