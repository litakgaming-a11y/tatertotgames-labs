# TaterTot Games Labs — Wave 8: Cairn

One concept, and the arena's **first 3D game**. All 27 existing games are 2D canvas; this one is
raw WebGL in a single self-contained file, because its core mechanic is meaningless without depth.

It is built on the same premise as **Siege Pile** (#23) — *the wreckage of your failures is the
terrain your next attempt climbs* — and then takes that premise somewhere Siege Pile deliberately
does not go: instead of launching an army at a castle, **you are the projectile**, and what you leave
behind is not a heap. It is a *pose*.

New physics class for the portfolio: **frozen-pose lattice geometry.** Not a heightfield (Siege
Pile), not a granular pile (Sandcastle), not verlet rope (Cut Loose) — a structure built from
interlocking rigid bodies that keeps overhangs, holds tension, and can *snap*. The mountain is a
lattice, not a surface, and that distinction is the entire game.

The platform integration contract in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) applies in full, with
the wave-4 file convention: the game is **`games/cairn/play.html`** (no `index.html` — the detail
page is generated separately).

---

## 28. ⛰️ CAIRN — *frozen-pose lattice geometry × endless climb × the useful death*

**Hook (the ad):** *He didn't make it. He helped.* A climber leaps for a ledge, misses, and as he
falls he throws one arm out toward the rock. He freezes there, grey and frosted, arm outstretched.
The next climber grabs that arm and swings past the point where the first one died. Six seconds, no
text needed, and the entire design is on screen.

**The fantasy:** you are one of an endless line of small determined idiots trying to climb an
impossible spire. **You are not going to make it.** Neither is the next one. But the spire is
littered with everyone who tried, frozen exactly where they stopped, and every single one of them is
a handhold. You are not climbing a mountain. You are climbing *everyone who came before you*, and
one day someone will climb you.

### Core loop (a life is 15–40 seconds; there is no menu between them)

You cling to the rock. One input, two beats:

1. **Drag to aim, release to leap.** A short arc preview, a real ragdoll launch — your climber flies.
2. **Tap mid-air to REACH.** Your arms extend toward the direction you're moving. If a hand touches
   a hold — natural rock, or a previous climber's outstretched arm — you **grab and stick**, hard,
   with a screen kick and a *clack*.

Miss, and you fall. And this is where the game actually begins.

### The mechanic: you choose how you die

**When your body comes to rest, it freezes in whatever pose it landed in — permanently — and that
pose becomes solid geometry.** Not a generic lump. The actual shape.

| How you die | What you leave | Value |
|---|---|---|
| **Reaching** — arm thrown out toward the wall as you fall | A **hook**. The best hold in the game: something later climbers can grab *and swing from* | ★★★★★ |
| **Wedged** — jammed between two rocks or two older bodies | A **beam**. Load-bearing, stable, safe to stand on | ★★★★ |
| **Braced** — legs out, back to the rock | A **ledge**. Flat, reliable, boring, excellent | ★★★★ |
| **Sprawled** — flat on a slope | A **step**. Modest gain, but it stacks | ★★ |
| **Curled** — panicked, balled up, arms in | A **lump**. Round, slippery, nearly useless, and *in the way* | ★ |

So the moment you realise you've missed the jump, you stop flailing and **aim your corpse.** Fling an
arm at the wall. Kick your legs into a gap. Dying badly wastes the life; dying well builds the route.

That is the whole hyper concept in one line: **failure is not the end of the attempt, it is the
craft of the attempt.** It converts the single worst emotional beat in a climbing game — falling —
into the beat with the most player agency. Nobody else does this.

### Why 3D is mandatory, not a coat of paint

This mechanic cannot exist in 2D, and the arena has no other game that needs depth:

- **A pose has a direction.** An arm sticking out from the rock face at 40° left is a hook you
  approach from one side and not the other. Flatten that to a plane and it is just a bump. The
  entire value table above collapses to "how tall is the lump."
- **The spire is a tower you orbit**, and route choice around it is the strategy. The easy south
  face fills with bodies — rich in holds, but congested and increasingly unstable. The north face is
  clean rock: harder, safer, empty. Choosing a face is choosing between other people's mistakes and
  your own.
- **Bodies interlock rather than stack.** In 3D they form a lattice with gaps you can climb *into*,
  and overhangs you can hang *under*. A heightfield cannot represent an overhang; that is why this
  game does not use one (see Technical).
- **The camera orbiting a growing tower of frozen reaching figures is the ad creative**, and it is
  genuinely arresting imagery. It sells itself in a scroll.

### The double edge (why this isn't a free ratchet)

If bodies only ever helped, the game would be a slow-motion win. They don't:

- **Holds break.** A hook made of one outstretched arm creaks under load, strains visibly, and can
  **snap** — dropping you, and often tearing loose the bodies below it in a small, catastrophic,
  extremely funny avalanche. Heavier climbers break holds faster. Weight is a real decision.
- **Bodies get in the way.** Dump enough of them in one place and you build a **bulge** — an overhang
  of your own dead that you now have to climb *around*. Your convenience becomes your obstacle.
- **The good line gets crowded.** The obvious route fills first and becomes the least stable.

So the mountain is simultaneously your ladder and your history of bad decisions, and it is legible
as both. You can look at your own cairn and read what kind of player you have been.

### The Smooth (the level that proves the thesis)

Roughly 200m up there is a band of sheer polished stone with **almost no natural holds at all.**

You cannot climb it. Not with skill, not with a perfect leap, not ever. The only way through The
Smooth is to spend lives building through it — to deliberately throw climbers at a blank wall so
their outstretched arms become the only holds that exist.

This is the moment the game stops being a climbing game and becomes what it actually is. Everything
before The Smooth teaches the controls; The Smooth teaches the **point**. Every playtest should be
measured on whether players work this out unprompted, because if they don't, the concept has failed
and no amount of polish saves it.

### Zones (the escalation curve)

| Zone | What it does |
|---|---|
| **The Scree** | Forgiving base. Plentiful rock holds. Teaches leap + reach + grab in ~60 seconds |
| **The Smooth** | Sheer, holdless. Teaches the thesis. The first real wall, and the first real *decision* |
| **The Overhang** | Negative slope. Corpses hang rather than stack; you swing between them. Hooks become the only currency that matters |
| **The Wind Shear** | A crosswind shoves you mid-flight, telegraphed by snow streaming off the ridge. Light climbers get thrown; heavy ones barely notice |
| **The Teeth** | Loose rock that breaks on contact — natural holds now betray you too, so your own dead become *more* trustworthy than the mountain |
| **The Summit** | Visible from the first second of the first life. Always there, always absurdly far. Never moved |

### Climber types (the hybrid meta layer)

Unlocked with **Cairnstones**, earned per metre of new height. Each type is a different set of body
geometry and pose physics, and choosing one is choosing what this life is *for*:

| Climber | Climbs like | Dies like |
|---|---|---|
| **The Reacher** | Long arms, great reach, weak grip — slips off holds others would keep | The best hooks in the game |
| **The Anchor** | Heavy, poor jumper, breaks holds under his own weight | Enormous, immovable, load-bearing beams |
| **The Gymnast** | Superb grip, tight control, the best pure climber | A small, dense, nearly useless lump |
| **The Spindle** | Fragile, floaty, long fall time — lots of air control | Thin lattice struts: fills gaps nothing else can reach |

**The Anchor is the design's thesis made into a unit.** He is bad at climbing and everyone knows it.
You do not send him up to summit; you send him up to *die in a specific place*. Deliberately spending
a life to build is a legitimate, optimal, and completely intentional strategy — and the moment a
player chooses the Anchor on purpose is the moment they have fully understood the game.

### Juice contract (per the wave-3 standard, every beat gets sound + visual + haptic)

- **The freeze:** time stops for ~180ms, a soft granite *chunk*, colour drains to frost-grey, dust
  puffs outward. **A good hold chimes; a lump thuds.** The audio tells you what you built before you
  can see it.
- **The grab:** hard snap-to, screen kick toward the hold, a wooden *clack*, and the climber's cloak
  whips.
- **The break:** creak → sharp crack → the hold tears loose and tumbles, knocking bodies free on the
  way down with escalating clatter. Devastating. Hilarious. Always survivable to watch.
- **Height:** a ticking counter with a rising pitch ladder; a bright chime and a full-screen flash the
  instant you pass your personal best.
- **Every tenth climber**, the camera does a slow orbit of the entire cairn on a held note — your
  monument, and the only "progress bar" the game has.

### Technical (single self-contained file, zero external requests)

- **Raw WebGL, no libraries.** The zero-external-request rule means no three.js from a CDN, so the
  renderer is hand-written: one instanced draw call for the whole frozen mountain, one for the live
  climber, one for terrain.
- **Ragdolls reuse the Siege Pile prototype's proven approach** — verlet particles with distance
  constraints, 7 nodes and 13 links — extended to 3D. That solver is already verified to 50k+ frames
  with 0 NaN.
- **Frozen bodies convert to static capsules** in a spatial hash for collision, and merge into the
  instanced mesh for rendering. This is Siege Pile's freeze-and-retire performance strategy exactly:
  a settled body costs nothing to simulate.
- **NOT a heightfield.** Siege Pile rasterises its pile into a height grid, which is fast and correct
  for a heap — and structurally incapable of representing an overhang, a gap, or an arm sticking out
  into space. All three are load-bearing here. The cost is that collision is a spatial-hash capsule
  query rather than a surface lookup, and the budget must be measured before the body cap is set.
- **The cairn persists in localStorage.** It is the save file. Nothing else is stored, and coming back
  a week later shows your tower exactly as you left it.
- **WebAudio synthesis** for all SFX — granite, cloth, wind, chimes — as with every other game.

### What it shares with Siege Pile, and what it deliberately does not

**Shares:** failure is productive; settled bodies freeze and become terrain; a crosswind you must
read; weight as a real variable; comedy from ragdolls doing their honest best.

**Deliberately does not:** no army, no launcher, no meta-economy, no permadeath *stakes* (a life
costs nothing but time — the opposite of Siege Pile's whole point). Where Siege Pile is about
commanding a crowd and losing them, Cairn is about being one of the crowd. **One is a siege. This is
a pilgrimage.**

### MVP cut

**Ship first:** the leap → reach → grab → freeze loop, three pose classes (hook / ledge / lump), The
Scree and The Smooth, one climber type, height scoring, the persistent cairn. That is enough to test
the only question that matters — *do players work out The Smooth on their own?*

**Second:** hold breakage and avalanches, the remaining zones, the other three climber types.

**Third:** Cairnstones, cosmetics, the orbit replay share-out.

**The riskiest assumption is that players notice their pose matters at all.** It is a subtle,
unusual idea and hyper-casual players are not primed to look for it. Mitigations, all cheap: the
distinct freeze audio, a faint ghost outline during the fall previewing what your corpse will become,
and The Smooth arriving early enough (~90 seconds in) to force the lesson while attention is still
high. If ≥60% of first-session players deliberately reach toward the wall while falling, the concept
works. If they don't, it is a beautiful idea that failed to teach itself, and it should be cut rather
than polished.

**Projected stats** — CPI **$0.22–0.40** · D1 **49%** · D7 **19%** · D30 **8%** · Session **9 min** ·
Sessions/DAU **4.4** · ARPDAU **$0.09–0.15** · LTV(90d) **$0.70** · Year-1 at scale:
**9–16M downloads, $6–11M net**

*Why the lowest CPI projection in the portfolio and a mid-pack LTV:* the creative is unusually
strong — a frozen figure with an outstretched arm being grabbed by the next climber is a hook that
survives being scrolled past, and it needs no text in any language, which is what actually drives
CPI down. Against that, this is a contemplative game rather than a combat one: fewer natural
rewarded-video moments than Return Fire (no continue-after-death — dying is *the mechanic* and must
never be sold back), and no consumable economy. Revenue is interstitials between lives plus climber
unlocks, and the honest read is high install volume on modest per-user monetisation. **The persistent
cairn is the retention asset**: it is a monument the player built that lives on their device, and
that is a far stronger reason to reopen an app than a daily-reward popup.

### Verification bar

The wave-3 battery (hostile boot, 180-frame pump, canvas sizing, mobile checks) **plus a lattice
soak**: 500 frozen bodies with no NaN positions, frame time measured and the body cap set from that
measurement rather than assumed; every frozen body is reachable-or-removed (no orphan geometry
floating in space); a hold that breaks always drops its dependents rather than leaving them hanging
on nothing; the cairn round-trips through localStorage byte-identically; and — the one that matters —
**a reference bot that only ever leaps and never reaches must eventually clear The Smooth**, proving
the wall is passable by accumulation alone and is not secretly a skill gate.

---

*Premise shared with [Siege Pile](CONCEPTS-WAVE6.md) (#23). Same discovery, different pilgrim.*
