# TaterTot Games Labs — 27 Hybrid-Casual MVP Concepts

Twenty-seven original hybrid-casual concepts, deliberately **not** clones of the current top-grossing
pack (no screws, no color-block boards, no hole-swallowing, no hexa-sorting), spanning twenty-seven
distinct mechanic classes. Each follows the proven
hybrid-casual formula: **one instantly-readable hyper-casual mechanic as the hook** (the "game
feature as ad" — the first 3 seconds of gameplay *is* the creative), plus a **meta layer** that
carries retention and monetization.

All twenty-seven are live and playable in this repo (`games/<slug>/`), each as a single self-contained
HTML5 file: mobile-first, one-hand controls, WebAudio-synthesized SFX, haptics, and localStorage
progression. Hosted on Cloudflare so every build is instantly testable online.

> Projected stats are pre-launch estimates benchmarked against 2024–2026 hybrid-casual market data
> (see [RESEARCH.md](RESEARCH.md)). Targets assume soft-launch tuning on Android, ad-first
> monetization (rewarded + interstitial) with light IAP (skins/upgrades/no-ads).

---

## 1. 🎈 Puff Puff Fit

| | |
|---|---|
| **Genre** | Inflate-to-fit puzzle (risk-vs-greed timing) |
| **Hyper-casual hook** | *Hold to inflate, release before the pop.* One input, one rule, instant tension — reads perfectly in a 3-second ad clip. |
| **Concept** | A squishy blob sits in a spiked chamber. Hold anywhere to inflate it; release to lock. Fill the target % of the chamber without touching a spike. Overfill greed = pop. ≥92% = PERFECT with confetti cannons. |
| **Meta layer** | Coin economy → blob skin collection (Lemon, Bubblegum, Galaxy…); infinite procedural levels with orbiting spike balls and rising fill targets. |
| **MVP scope (built)** | 3-round levels, 3 hearts, procedural chambers, fill meter, perfect bonus, skin shop, squash-and-stretch blob with reactive face. |
| **Why it can win** | Same "near-miss greed" dopamine as All in Hole's RPD driver; failure is comedic (pop), retry is instant. Perfect-fill clips are natively shareable. |

**Projected stats** — CPI **$0.25–0.45** · D1 **48%** · D7 **16%** · D30 **6%** · Session **7 min** ·
Sessions/DAU **4.5** · ARPDAU **$0.09–0.14** · LTV(90d) **$0.55** · Year-1 at scale: **8–15M downloads, $4–7M net**

---

## 2. 🁢 Topple Party

| | |
|---|---|
| **Genre** | Draw-and-watch chain-reaction puzzle |
| **Hyper-casual hook** | *Draw a line → it becomes dominoes → everything cascades.* The payoff moment (slow-mo topple into an exploding target) is a ready-made viral ad. |
| **Concept** | Draw paths with your finger; dominoes auto-place along them under a budget. Hit GO: the chain ripples domino-to-domino, jumps between nearby strokes, and detonates firecracker targets. All targets down = win. |
| **Meta layer** | Coins construct **Topple Town** — a persistent skyline that builds itself one building per 200 coins, visible on the title screen (Screw Jam-style builder meta). |
| **MVP scope (built)** | Freehand domino drawing with budget, undo/clear, sequential topple sim with stroke-jumping, slow-mo kill-cam, 8-building town meta. |
| **Why it can win** | ASMR domino audio + planning agency. UGC potential ("draw your own Rube Goldberg") mirrors what made Mob Control creatives evergreen: the mechanic demos itself. |

**Projected stats** — CPI **$0.35–0.60** · D1 **45%** · D7 **15%** · D30 **5.5%** · Session **9 min** ·
Sessions/DAU **4** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.65** · Year-1 at scale: **6–12M downloads, $4–8M net**

---

## 3. 🛰️ Slingshot Salvage

| | |
|---|---|
| **Genre** | One-drag physics collector + upgrade garage |
| **Hyper-casual hook** | *Drag back, watch the dotted arc bend around planets, release.* The live gravity-bending trajectory preview is the ad: everyone "gets" a slingshot instantly. |
| **Concept** | Launch a salvage pod from your station through planetary gravity wells to hoover up space junk. Close fly-bys grant GRAVITY ASSIST bonuses; crashing into a planet costs a launch. Collect the quota within limited launches. |
| **Meta layer** | Scrap currency → 4-track garage (Magnet Radius, Launch Power, +1 Launch, Lucky Star), each visibly changing gameplay — the Pocket Champs-style "number goes up, game feels different" loop. |
| **MVP scope (built)** | Gravity sim shared by preview and flight, magnet suction, combo pitch-ladder collection, procedural levels with orbiting planets, full upgrade garage. |
| **Why it can win** | Skill expression (bank-shot slingshots) + upgrade compulsion = the classic hybrid-casual long-tail. Rewarded-ad slots map naturally (+1 launch, 2x scrap). |

**Projected stats** — CPI **$0.40–0.70** · D1 **44%** · D7 **17%** · D30 **7%** · Session **11 min** ·
Sessions/DAU **3.8** · ARPDAU **$0.12–0.20** · LTV(90d) **$0.85** · Year-1 at scale: **5–9M downloads, $5–9M net**

---

## 4. 🧊 Freeze Frame!

| | |
|---|---|
| **Genre** | Tap-timing rescue / traffic-control |
| **Hyper-casual hook** | *Tap water → it flash-freezes → the ice melts on a timer.* A single tap with a visible countdown creates instant, legible panic-management. |
| **Concept** | Critters auto-march toward the exit across platforms split by water gaps. Tap a gap to freeze an ice bridge (~2.6s before it shatters, short refreeze cooldown). Juggle multiple gaps, jumping fish and geysers to save the quota. |
| **Meta layer** | Every rescued critter permanently joins your **Snow Village** on the title screen; the village levels up with decorations every 15 rescues (collection/nurture meta, My Perfect Hotel warmth). |
| **MVP scope (built)** | Per-gap freeze timers, melt-crack visuals, hazard fish, rescue combo chirps, persistent village with wandering critters and 7 decoration tiers. |
| **Why it can win** | "Saving cute things under time pressure" is one of the most durable ad hooks in casual; near-miss saves generate strong emotional spikes and session re-entry. |

**Projected stats** — CPI **$0.30–0.50** · D1 **50%** · D7 **18%** · D30 **6.5%** · Session **8 min** ·
Sessions/DAU **5** · ARPDAU **$0.08–0.13** · LTV(90d) **$0.60** · Year-1 at scale: **10–18M downloads, $5–8M net**

---

## 5. ⚡ Volt Rush

| | |
|---|---|
| **Genre** | Drag-reflex arcade + idle city tycoon |
| **Hyper-casual hook** | *Slide the rod under the lightning before it strikes.* Telegraph → strike → catch is a 1-second readable skill loop with spectacular VFX for creatives. |
| **Concept** | Drag a lightning-rod cart along a rail beneath a drifting storm. Catch telegraphed strikes to bank volts and build combos to x8; golden bolts pay 5x; misses scorch the ground and reset the chain. Waves escalate with multi-strikes and fake-outs. |
| **Meta layer** | Volts light up a 14-building city; **lit buildings generate coins per second including offline earnings** (capped 8h, claim popup on return) → upgrades (Wider Rod, Volt Value, Storm Frequency, Battery). Full idle-arcade hybrid. |
| **MVP scope (built)** | Wave system with combo meter, golden bolts, idle city with offline accrual, 4 upgrade tracks, electric bolt rendering with flash frames and haptics. |
| **Why it can win** | The idle meta drives the highest re-engagement of the five (My Perfect Hotel pattern: come back, claim, upgrade, play one wave). Skill loop keeps sessions active, idle loop keeps DAU alive. |

**Projected stats** — CPI **$0.35–0.55** · D1 **52%** · D7 **20%** · D30 **8%** · Session **10 min** ·
Sessions/DAU **6** · ARPDAU **$0.14–0.22** · LTV(90d) **$1.00** · Year-1 at scale: **6–10M downloads, $6–12M net**

---

## 6. 🏗️ Kaboom Crane *(wave 2 — research-driven)*

| | |
|---|---|
| **Genre** | Rhythm-timing demolition + upgrade meta |
| **Hyper-casual hook** | *Tap in rhythm to push the wrecking ball like a playground swing, then release to smash.* Everyone on Earth already knows how to push a swing — zero tutorial, instant mastery curve. The demolition payoff (slow-mo impact, crumbling tower) is the ad creative. |
| **Concept** | Time your taps to the pendulum to build amplitude ("PERFECT PUSH!" ladders pitch), release at the right point in the arc, and the ball flies off tangentially into a procedurally-built tower: glass shatters, bricks crack, unsupported blocks collapse, TNT chains, gold piñata blocks pay out. Hit the demolition % target within your ball budget. |
| **Meta layer** | Contract progression with silly names + 4 upgrade tracks that visibly change the sim (Heavier Ball, Chain Length, +1 Ball, TNT Luck). |
| **Research grounding** | Destruction moments are among the highest-CTR ad creatives in paid UA; near-miss framing ("94% demolished!") drives the retry compulsion the research flags as All in Hole's RPD engine; the timing micro-skill adds the Pop-the-Lock-style mastery loop that pure tap-to-win demolition clones lack. |
| **Why it can win** | Two dopamine spikes per loop (perfect-push chain + destruction payoff) instead of one; skill expression gives it depth headroom clones can't fast-follow. |

**Projected stats** — CPI **$0.30–0.50** · D1 **50%** · D7 **18%** · D30 **7%** · Session **9 min** ·
Sessions/DAU **5** · ARPDAU **$0.12–0.18** · LTV(90d) **$0.80** · Year-1 at scale: **8–14M downloads, $6–10M net**

---

## 7. ✂️ Buzzcut Buddies *(wave 2 — research-driven)*

| | |
|---|---|
| **Genre** | ASMR grooming/reveal + creature-collection salon |
| **Hyper-casual hook** | *Drag to buzz the fuzz off and reveal the cutie underneath.* The satisfying-reveal mechanic (mow/powerwash/shave lineage) is a proven low-CPI creative machine — the before/after IS the ad. |
| **Concept** | Hundreds of physical fuzz strands with crunchy per-strand ASMR audio that pitch-shifts with stroke speed. Skill layer: style requests ("leave the mohawk!") with keep-zones, golden strands, hidden accessories that sparkle when uncovered, ticklish spots that make the buddy giggle-wiggle, and a FLOW combo for unbroken strokes. Finish ≥95% for the reveal celebration and a procedurally-named buddy ("BARNABY the Wombler"). |
| **Meta layer** | Every groomed buddy joins your salon (visible, wandering, wearing their found accessories); salon decor levels up every 10 buddies; a 4h-cooldown VIP client pays 2x (the re-engagement hook); 4 upgrade tracks. |
| **Research grounding** | ASMR/cleaning genre shows exceptional CTR and sub-$0.30 CPIs in market data; collection/nurture metas are the highest-retention layer in the report (My Perfect Hotel pattern); the VIP timer imports the idle re-engagement mechanic that drives Volt Rush-style D30. |
| **Why it can win** | Zen sessions with zero fail-state remove churn pressure while the collection + VIP timer pull players back; broadest demographic reach of the seven (ASMR audience skews wide). |

**Projected stats** — CPI **$0.20–0.40** (lowest of the portfolio) · D1 **52%** · D7 **19%** · D30 **7.5%** · Session **11 min** ·
Sessions/DAU **4.5** · ARPDAU **$0.10–0.15** · LTV(90d) **$0.75** · Year-1 at scale: **12–20M downloads, $6–11M net**

---

## 8. 🧲 Flip Force *(wave 3 — state-toggle steering)*

| | |
|---|---|
| **Genre** | One-button field steering + cosmetic collection |
| **Hyper-casual hook** | *One tap flips your magnet's polarity.* Every node that was pulling you now pushes, and every field line on screen reverses at once — a physics idea everyone already understands, reduced to a single button. |
| **Concept** | An orb drifts through a field of fixed magnet nodes; you never steer it directly. Same-pole nodes repel, opposite-pole attract, and your only input flips which is which. Thread the gates, collect star bits, avoid crash walls and neutralising dead zones. |
| **Meta layer** | Star bits buy orb trails and a lab of unlockable cores (6+), each with its own particle signature. |
| **Research grounding** | The report's "one readable rule, escalating layouts" pattern — the same structure that lets Tower War and Mob Control run hundreds of levels off one verb. Field lines that redraw on every tap make the mechanic self-demonstrating in a 3-second creative. |
| **Why it can win** | Skill expression sits entirely in reading the field ahead rather than reaction speed, which gives it a mastery curve clones can't shortcut. |

**Projected stats** — CPI **$0.35–0.55** · D1 **46%** · D7 **15%** · D30 **5.5%** · Session **8 min** ·
Sessions/DAU **4.2** · ARPDAU **$0.08–0.13** · LTV(90d) **$0.50** · Year-1 at scale: **6–11M downloads, $3–6M net**

---

## 9. 📡 Ping Pilot *(wave 3 — information reveal)*

| | |
|---|---|
| **Genre** | Dark-cave exploration + upgrade vault |
| **Hyper-casual hook** | *The level is pitch dark — your tap is a sonar ping.* An expanding ring paints the cave for two seconds, then it fades back to black. |
| **Concept** | Pilot a salvage sub through an unlit cave. Pings are limited and recharge slowly, revealing walls, pearls and hazards as fading wireframes. The anglerfish patrolling the cave is drawn to your pings, so buying information also gives away your position. |
| **Meta layer** | Pearls fund the Reef Vault: ping radius, ping count, silent thruster, pearl magnet. |
| **Research grounding** | Reveal mechanics are the cheapest-CPI creative class in the addendum (ASMR Slicing lineage) — this applies the reveal to *space* rather than surface, and the risk layer imports the near-miss tension the research ties to ventral-striatum activation. |
| **Why it can win** | The information-vs-exposure trade is genuinely novel in casual and produces long sessions; the darkness itself is the ad creative. |

**Projected stats** — CPI **$0.40–0.65** · D1 **44%** · D7 **16%** · D30 **6%** · Session **10 min** ·
Sessions/DAU **3.6** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.65** · Year-1 at scale: **4–8M downloads, $3–6M net**

---

## 10. 🤸 Bounce Brigade *(wave 3 — placement physics)*

| | |
|---|---|
| **Genre** | Trampoline-placement rescue + station upgrades |
| **Hyper-casual hook** | *Drag to place a trampoline; everything that lands on it goes flying.* Citizens leap from a smoking building and you bounce them across the skyline into the rescue net. |
| **Concept** | Jumpers leave at varied arcs and intervals. Place and tilt 1–3 trampolines (repositioning is free and instant), chaining bounces across rooftops, chimneys and awnings. Bounce response is fully deterministic — only spawn timing varies — so a plan that works keeps working. |
| **Meta layer** | Coins buy trampoline skins and station upgrades: wider net, third trampoline, slow-motion charge. |
| **Research grounding** | "Cute things in peril" is the durable hook the report credits for My Perfect Hotel-class D1; deterministic physics keeps the failure comedic rather than random, which the research flags as the difference between retry and churn. |
| **Why it can win** | Free repositioning turns the loop into pure experimentation, and flips generate style-point clips ideal for UGC. |

**Projected stats** — CPI **$0.30–0.50** · D1 **49%** · D7 **17%** · D30 **6%** · Session **8 min** ·
Sessions/DAU **4.6** · ARPDAU **$0.10–0.15** · LTV(90d) **$0.60** · Year-1 at scale: **8–14M downloads, $4–7M net**

---

## 11. 📦 Parcel Panic *(wave 3 — flow routing)*

| | |
|---|---|
| **Genre** | Conveyor throughput + logistics-empire meta |
| **Hyper-casual hook** | *Tap the junction, flip the track.* Colour-coded parcels stream toward forked junctions and one tap each routes them home. |
| **Concept** | A warehouse of conveyors with 2–6 tap-toggle junctions. Parcels spawn at rising rate; wrong truck costs one of three strikes. Gold parcels pay 5x but shatter if they take a junction at speed, and a raccoon occasionally flips a junction back. |
| **Meta layer** | Wages build a logistics empire of depots across a map, plus upgrades for spawn ramp, a fourth strike and gold insurance. |
| **Research grounding** | Pure-throughput escalation is the structure behind the report's longest-tail performers: difficulty rises through *speed*, not new rules, so the tutorial never repeats and D7 mastery curves stay smooth. |
| **Why it can win** | Highest skill ceiling per unit of explanation in the wave — the chunky lever feedback makes routing feel physical rather than administrative. |

**Projected stats** — CPI **$0.35–0.55** · D1 **50%** · D7 **18%** · D30 **7%** · Session **9 min** ·
Sessions/DAU **5** · ARPDAU **$0.12–0.18** · LTV(90d) **$0.80** · Year-1 at scale: **7–12M downloads, $5–9M net**

---

## 12. 👻 Ghost Crew *(wave 3 — record-and-replay)*

| | |
|---|---|
| **Genre** | Self-cooperative puzzle platformer + collection |
| **Hyper-casual hook** | *Your last run replays as a ghost — team up with yourself.* Stand on the plate, rewind, and your ghost holds it open while the new you walks through. |
| **Concept** | Single-screen levels needing 2–4 crew members that you play one at a time. Press GO, act, tap REWIND; your exact run replays as a translucent ghost while you play the next self. All selves must reach the exit together — the puzzle is choreographing yourself. |
| **Meta layer** | Stars (by rewinds used) unlock character skins and a Crew Photo gallery — one silly team photo per completed world of ten levels. |
| **Research grounding** | The report's clearest gap: no charting hybrid-casual title uses a time-replay mechanic. It is the highest-variance bet here — the payoff is an ad creative nobody can fast-follow in a quarter, the risk is that "rewind" needs more than 3 seconds to land. |
| **Why it can win** | Strongest wow-factor creative in the portfolio; the VHS-scrub rewind is a signature moment rather than a transition. |

**Projected stats** — CPI **$0.45–0.75** (highest — most explanation needed) · D1 **42%** · D7 **16%** · D30 **6.5%** · Session **12 min** ·
Sessions/DAU **3.2** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.70** · Year-1 at scale: **3–7M downloads, $3–6M net**

---

## 13. 🎆 Sky Bloom *(wave 3 — timed spectacle)*

| | |
|---|---|
| **Genre** | One-tap timing + festival collection |
| **Hyper-casual hook** | *Tap to burst the rocket at exactly the right height.* A perfectly-timed tap fills the sky with a bloom; the payoff is the ad. |
| **Concept** | Rockets launch themselves toward target rings. Tap inside the ring for a perfect bloom, early or late for a fizzle. Consecutive perfects grow bloom size and colour complexity; finale rounds fire 3–5 rockets in rhythm, with duds you must *not* tap. |
| **Meta layer** | Festival earnings unlock firework types (willow, ring, heart, dragon) and a Festival Album saving your best finale each night. |
| **Research grounding** | Directly applies the peer-reviewed near-miss finding from the addendum: a generous early window (±120ms) tightening slowly makes escalation read as the player's own improvement. Spectacle-per-tap is the lowest-CPI creative shape in the report. |
| **Why it can win** | Almost nothing to learn and the largest visual payoff of the seventeen — the best pure-CPI bet in the wave. |

**Projected stats** — CPI **$0.25–0.45** (joint-lowest of the wave) · D1 **51%** · D7 **18%** · D30 **6.5%** · Session **8 min** ·
Sessions/DAU **5.2** · ARPDAU **$0.09–0.14** · LTV(90d) **$0.60** · Year-1 at scale: **11–19M downloads, $5–9M net**

---

## 14. 🦢 Fold Friends *(wave 3 — gesture craft)*

| | |
|---|---|
| **Genre** | Origami gesture puzzle + park collection |
| **Hyper-casual hook** | *Swipe to fold the paper — it comes alive.* Three clean swipes fold a sheet into a crane; it blinks, flaps and waddles off. |
| **Concept** | Dashed fold lines appear one at a time; swipe across in the indicated direction and the crease executes with a snap. Accuracy scores each fold. There is no fail state — a wrong swipe crumples comically and undoes. |
| **Meta layer** | Every completed animal wanders a growing Paper Park diorama, unlocking a new biome every twelve animals (pond, meadow, bamboo grove, snow field). |
| **Research grounding** | The zero-fail zen structure the addendum credits for ASMR-genre reach, married to the collection/nurture meta the report identifies as the highest-retention layer available to a hyper-casual hook. |
| **Why it can win** | Broadest demographic reach alongside Buzzcut Buddies; the birth moment at the end of every fold is a reliable, repeatable reward. |

**Projected stats** — CPI **$0.25–0.45** (joint-lowest of the wave) · D1 **50%** · D7 **17%** · D30 **6.5%** · Session **10 min** ·
Sessions/DAU **4** · ARPDAU **$0.08–0.13** · LTV(90d) **$0.58** · Year-1 at scale: **11–18M downloads, $5–8M net**

---

## 15. 🌻 Bloom Drop *(wave 3 — aim-and-bounce)*

| | |
|---|---|
| **Genre** | Pachinko collector + persistent garden |
| **Hyper-casual hook** | *Drop the seed, watch it plink.* A seed bounces down a pin field with escalating dings, and wherever it lands a flower erupts. |
| **Concept** | Aim a seed cannon into a pin field; every pin hit rings a note higher than the last. Bottom pockets vary by rarity from common daisy to jackpot golden rose, with bumper, multiplier and split pins in between. Limited seeds, target garden value. |
| **Meta layer** | The garden persists and grows across every level, plus seed upgrades for weight, extra seeds, rarity luck and split chance. |
| **Research grounding** | The purest expression of the report's near-miss engine: outcome leaves your hands at release, so every drop is anticipation with an audio ladder pulling through it. Late bounces are biased *toward* pockets, never away — generosity tuning the research ties to retry rates. |
| **Why it can win** | Best D30 bet of wave 3 — the permanent garden converts a luck loop into visible long-term progress. |

**Projected stats** — CPI **$0.30–0.50** · D1 **52%** · D7 **19%** · D30 **7%** · Session **11 min** ·
Sessions/DAU **4.8** · ARPDAU **$0.12–0.19** · LTV(90d) **$0.85** · Year-1 at scale: **8–14M downloads, $6–10M net**

---

## 16. ⛴️ Harbor Hustle *(wave 3 — traffic control)*

| | |
|---|---|
| **Genre** | Multi-object traffic management + town builder |
| **Hyper-casual hook** | *Tap a boat to stop it; tap again to go.* Six hulls crossing one harbour, one brain, zero collisions. |
| **Concept** | Ferries, tankers and jet-skis enter on fixed routes toward colour-matched piers. You cannot steer — only hold and release. Near-misses pay a CLOSE CALL bonus, so the game rewards cutting it fine; three collisions end the shift. Fog banks, a timed drawbridge and an impatient VIP yacht escalate. |
| **Meta layer** | Earnings build a harbour town along the shore — lighthouse, market, ferris wheel — visible from inside the play field, plus strike and patience upgrades. |
| **Research grounding** | Traffic control is a proven casual staple, but the report's near-miss finding suggests the standard version under-monetises caution; paying for close calls inverts it into risk-seeking play, which lengthens sessions. |
| **Why it can win** | Rewarding bravery rather than safety is the differentiator — balance-tested across 20 shifts with no difficulty cliffs. |

**Projected stats** — CPI **$0.35–0.55** · D1 **48%** · D7 **17%** · D30 **6.5%** · Session **10 min** ·
Sessions/DAU **4.4** · ARPDAU **$0.11–0.17** · LTV(90d) **$0.72** · Year-1 at scale: **7–12M downloads, $4–8M net**

---

## 17. 🔦 Beam Team *(wave 3 — rotate-to-route)*

| | |
|---|---|
| **Genre** | Light-routing puzzle + village meta |
| **Hyper-casual hook** | *Tap a mirror, the light bends.* One golden beam snakes across a dark level and every mirror you rotate reroutes it live. |
| **Concept** | A lighthouse emits a continuous beam; tapping a mirror rotates it 45° and the beam re-traces instantly — watching it whip to a new path is the toy. Route through prisms and colour filters to light every lantern, and the level blooms out of darkness into full colour. |
| **Meta layer** | Glow currency lights a Lighthouse Village on the title screen and buys beam cosmetics including an aurora beam and rainbow prisms. |
| **Research grounding** | Live re-tracing rather than turn-based resolution is what separates this from the dormant light-puzzle genre: it converts a think-first puzzle into a fiddle-first toy, which the report identifies as the key adaptation when porting puzzle depth into hyper-casual pacing. |
| **Why it can win** | The full-colour reveal is the most screenshot-shareable moment in the portfolio, and puzzle depth gives it the longest content runway. |

**Projected stats** — CPI **$0.35–0.60** · D1 **47%** · D7 **16%** · D30 **6%** · Session **9 min** ·
Sessions/DAU **4** · ARPDAU **$0.09–0.14** · LTV(90d) **$0.60** · Year-1 at scale: **5–10M downloads, $3–6M net**

---

## 18. 🏜️ Sandfall *(wave 4 — granular simulation)*

| | |
|---|---|
| **Genre** | Falling-sand routing puzzle + sand-art collection |
| **Hyper-casual hook** | *Draw a ledge — a hundred thousand grains obey.* Real falling-sand simulation: piles form true slopes, streams fork around obstacles, and every shelf you draw redirects the flow. The simulation is the ad. |
| **Concept** | Colored sand pours from spouts; draw eroding shelf lines with limited ink to route each stream into its matching jar. Wrong color contaminates (recoverable, costs quota). Fans, acid pools and moving jars escalate. Jars visibly fill in strata. |
| **Meta layer** | Completed jars keep their actual poured strata pattern and join a Terrarium Shelf — every jar is unique, which makes the collection screenshot bait. Material unlocks (glow, heavy, galaxy sand) and four upgrade tracks. |
| **Research grounding** | Merges the two cheapest-CPI creative classes in the report: satisfying-reveal ASMR (the sand hiss and pile) and zero-explanation physics. The material system is the live-ops engine the report says separates hits from clones. |
| **Why it can win** | Erosion makes every shelf a temporary decision, so mastery is continuous re-routing rather than solved-once puzzles — the highest replay density of the physics wave. |

**Projected stats** — CPI **$0.25–0.45** · D1 **52%** · D7 **19%** · D30 **7%** · Session **11 min** ·
Sessions/DAU **4.6** · ARPDAU **$0.11–0.17** · LTV(90d) **$0.80** · Year-1 at scale: **10–17M downloads, $6–10M net**

---

## 19. ⛵ Tippy Ship *(wave 4 — buoyancy + rigid stacking)*

| | |
|---|---|
| **Genre** | Physics cargo-loading + shipping-route builder |
| **Hyper-casual hook** | *Load the boat. Don't tip the boat.* The ship genuinely floats — every crate makes it sit lower and list further, and everyone on Earth understands a boat about to tip. |
| **Concept** | Tap to drop crates from an auto-swinging crane onto a floating hull with real buoyancy and roll torque. Mixed cargo (rolling barrels, heavy gold, fragile top-only crates), then a wake test before the ship sails. Capsizes are slow-mo comedy. |
| **Meta layer** | A shipping-route map where delivered ports light up with animated towns, plus sim-visible upgrades (Wider Hull, Ballast, Rubber Deck, Crane Brake) and ship skins. |
| **Research grounding** | The near-capsize recovery ("SAVED!") is the purest near-miss moment in the portfolio — the exact ventral-striatum trigger from the research addendum — and fail-forward comedy keeps retries frictionless. |
| **Why it can win** | Stacking + buoyancy doubles the tension of either alone; every new cargo type (ice, animals, magnets) is a composable content drop, giving it the longest live-ops runway of the wave. |

**Projected stats** — CPI **$0.30–0.50** · D1 **50%** · D7 **18%** · D30 **7%** · Session **10 min** ·
Sessions/DAU **4.4** · ARPDAU **$0.12–0.18** · LTV(90d) **$0.82** · Year-1 at scale: **8–14M downloads, $6–10M net**

---

## 20. ✂️ Cut Loose *(wave 4 — verlet rope dynamics)*

| | |
|---|---|
| **Genre** | Rope-cutting order/timing puzzle + curiosity collection |
| **Hyper-casual hook** | *One snip — physics does the rest.* Packages hang in webs of taut rope; swipe the right rope at the right moment and the swing lands them on the truck. |
| **Concept** | Verlet ropes with pulleys, balloons and springs suspend faced packages. The puzzle is cut ORDER and TIMING — cut at the pendulum's apex to fling. Bundled ropes, moving trucks, fans, bomb crates and counterweight chains escalate. Two dents breaks a package; retries are free. |
| **Meta layer** | Every delivered package is themed (piano, aquarium, wedding cake…) and joins a shelf of curiosities with a one-line gag. Upgrades: Sharper Blade, Bubble Wrap, Slow-Mo Charge, Magnet Truck. |
| **Research grounding** | Cut-the-Rope proved the input's decade-long durability; this rebuilds it around flinging rather than feeding, adding the timing micro-skill the research ties to Pop-the-Lock-style mastery loops. |
| **Why it can win** | Rope systems compose combinatorially so level variety is near-free, and the slow-mo final cut gives every level a clip-worthy money shot. |

**Projected stats** — CPI **$0.30–0.55** · D1 **49%** · D7 **18%** · D30 **6.5%** · Session **9 min** ·
Sessions/DAU **4.5** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.70** · Year-1 at scale: **7–13M downloads, $5–8M net**

---

## 21. 🛡️ Return Fire *(wave 5 — reflection dynamics + momentum transfer)*

| | |
|---|---|
| **Genre** | Deflection combat + fortress rebuild meta |
| **Hyper-casual hook** | *They brought the ammo. You just aim it back.* A war game with **no weapon**: one shield, a wall of incoming fire, and every shot you deflect detonates the machine that fired it. |
| **Concept** | Drag to swing a shield around your core. Reflection is real — angle of incidence mirrors across the surface normal, and your swipe velocity is *added* to the returned shot, so a hard flick sends it back screaming. Perfect parries freeze the frame and pay 2.5x. Five projectile types (bullets, rockets, ricocheting saw blades, chargeable energy orbs, arcing mortars), armored enemies that only crack to their own ammo, and a boss every fifth wave. |
| **Meta layer** | The Bastion — a fortress on the title screen rebuilt across 12 stages from salvaged scrap — plus four sim-visible upgrade tracks (Shield Arc, Kinetic Gain, Core Plating, Overheat Charge) and milestone shield skins. |
| **Research grounding** | Combat monetizes rewarded video far harder than puzzle (continue-after-death, 2x scrap, boss retry) while the one-verb deflection hook keeps CPI in casual rather than midcore territory. The boss cadence creates natural session bookends; OVERHEAT is the engineered release valve at the top of the intensity curve. |
| **Why it can win** | The inversion is the moat: every competitor hands you a gun. Here the enemy army supplies all the ammunition and destroys itself — instantly readable in a 3-second creative, and the deflection verb composes with any future projectile, element or shield module, giving it the longest live-ops runway in the portfolio. |

**Projected stats** — CPI **$0.35–0.60** · D1 **54%** · D7 **21%** · D30 **8.5%** · Session **13 min** ·
Sessions/DAU **5.2** · ARPDAU **$0.16–0.24** · LTV(90d) **$1.10** (highest in the portfolio) ·
Year-1 at scale: **7–13M downloads, $8–14M net**

---

## 22. 🏴‍☠️ Broadside Baron *(wave 6 — rhythm × artillery × roguelite)*

| | |
|---|---|
| **Genre** | Naval gunnery duel with a roguelite voyage spine |
| **Hyper-casual hook** | *Fire at the top of the swell.* The ocean rolls your hull, the roll aims your cannons — so the rhythm is **physical and visible** rather than an abstract timing bar. |
| **Concept** | Tap to fire a broadside: every cannon fires in sequence like a drumroll, each using its own elevation at its own instant. Hit the roll apex and the sequence collapses into one simultaneous roar at double damage. Hold to brace, swipe to change range band, and dodge readable incoming volleys. Damage is positional — waterline floods, masts drop sails, decks lose crew. |
| **Meta layer** | Runs are branching voyages (battle / merchant / storm / derelict) with stacking crew-card drafts; plunder carries into a home Port rebuilt across 12 stages plus permanent upgrades and ship skins. |
| **Research grounding** | Adds the portfolio's first **roguelite run structure** — the strongest known session-length and return-rate driver in mid-core hybrid — while the swell hook keeps the first 3 seconds readable enough for casual CPI. |
| **Why it can win** | Nobody has made the metronome a physical object you can see. It teaches itself in one wave cycle, and crew cards give it a content runway that composes indefinitely. |

**Projected stats** — CPI **$0.40–0.65** · D1 **51%** · D7 **20%** · D30 **8%** · Session **14 min** ·
Sessions/DAU **4.8** · ARPDAU **$0.15–0.23** · LTV(90d) **$1.05** · Year-1 at scale: **6–11M downloads, $7–12M net**

---

## 23. ⚔️ Siege Pile *(wave 6 — ragdoll physics × horde siege × emergent terrain)*

| | |
|---|---|
| **Genre** | Catapult siege where your own army becomes the level |
| **Hyper-casual hook** | *Fling knights at the wall. They pile up. The pile becomes the ladder.* |
| **Concept** | Drag-and-release launches an articulated ragdoll knight. Those that clear the wall count toward capture; those that fall short **pile at the base as solid collision** — then stand up and brace, organising themselves into a climbable ramp. Tap mid-flight to tuck for a higher bounce off the heap. Defenders shove piles over, moats swallow short throws entirely, and keeps demand three knights on a plate at once. |
| **Meta layer** | The Warband roster with drafted knight types (Heavy, Tumbler, wall-sticking Grappler, Standard-Bearer), four upgrade tracks, and a conquest map that fills in as you advance. |
| **Research grounding** | Failure-arc creatives drive +65–78% IPM per the research addendum, and here **failure is literally productive** — a short throw is construction material, so the fail state is both funny and useful, which is the retry engine. |
| **Why it can win** | Emergent terrain nobody else is doing: the level builds itself out of your mistakes, so no two assaults look alike and every run generates its own screenshot. |

**Projected stats** — CPI **$0.28–0.48** · D1 **53%** · D7 **19%** · D30 **7.5%** · Session **11 min** ·
Sessions/DAU **5** · ARPDAU **$0.13–0.19** · LTV(90d) **$0.88** · Year-1 at scale: **9–16M downloads, $6–11M net**

---

## 24. 🚁 Chopper Drop *(wave 6 — flight-lite × tethered pendulum × extraction arcade)*

| | |
|---|---|
| **Genre** | Rescue-under-fire where your own cargo is the antagonist |
| **Hyper-casual hook** | *The load swings. The clock runs. Fly anyway.* One-finger flight with a winch cable underneath, and the thing dangling from it has real inertia. |
| **Concept** | Drag to steer; a hooked squad member becomes a genuine pendulum whose reaction force fights you. Damping is the skill — fly into the swing to kill it, with it to amplify, and advanced players deliberately pendulum a load over an obstacle. Tap to winch in or out, trading control against reach. Cargo changes the physics: a medic swings fast, a crate drags you down, a fuel drum explodes on impact, a stretcher on two cables refuses to rotate. |
| **Meta layer** | Forward Base rebuilt across 12 stages, four sim-changing upgrades, and a persistent roster of **named rescued personnel** — the nurture hook that makes losing one sting. |
| **Research grounding** | The tension source is unusual and entirely player-authored: you are fighting your own momentum, not an enemy, which makes near-misses feel earned rather than dealt. Collection/nurture metas are the highest-retention layer in the report. |
| **Why it can win** | Nothing in the casual space makes the *payload* the opponent. The skill ceiling (deliberate pendulum swings) is deep, while the floor stays one-finger simple. |

**Projected stats** — CPI **$0.38–0.60** · D1 **49%** · D7 **19%** · D30 **7.5%** · Session **12 min** ·
Sessions/DAU **4.6** · ARPDAU **$0.14–0.21** · LTV(90d) **$0.92** · Year-1 at scale: **6–11M downloads, $6–10M net**

---

## 25. 🥚 Morphforge *(wave 7 — the Glimmerwild: evolution reinvented)*

| | |
|---|---|
| **Genre** | Creature-collection where you sculpt the creature yourself |
| **Hyper-casual hook** | *Feed it. Shape it. No two are ever the same.* Drip essence onto an egg and the thing that hatches is procedurally built from exactly what you poured in. |
| **Concept** | Seven essence spouts around a floating egg. Pouring adds stress — too fast and hairline cracks spread, then the shell shatters into an early, lesser hatch; ride the stress bar to its edge without breaking it and you get a Radiant. Tap to knead stress away from a crack and buy room for one more pour. The blend maps to silhouette, limbs, crest, texture, eyes and aura, deterministically and legibly, so pouring Ember visibly produces Ember. |
| **Meta layer** | The Menagerie — every Glim you hatched wandering the title screen, drawn from its actual generated parameters. A Codex of discovered *traits* rather than species, four upgrade tracks, and breeding that blends two creatures' parameter vectors. |
| **Research grounding** | Collection/nurture metas are the highest-retention layer in the report, and this pushes further: a collection of things the player personally made is materially stickier than a collection of things they were handed. |
| **Why it can win** | Every competitor gives you a fixed evolution line. Here the creature is genuinely authored by the player, which makes it screenshot-worthy and unrepeatable — and the trait space generates its own content forever. |

**Projected stats** — CPI **$0.30–0.50** · D1 **55%** · D7 **23%** · D30 **10%** · Session **13 min** ·
Sessions/DAU **5.4** · ARPDAU **$0.16–0.24** · LTV(90d) **$1.15** (highest in the portfolio) ·
Year-1 at scale: **9–15M downloads, $9–15M net**

---

## 26. 🌩️ Weatherwright *(wave 7 — the Glimmerwild: battling reinvented)*

| | |
|---|---|
| **Genre** | Creature duels fought by controlling the environment |
| **Hyper-casual hook** | *You don't tell it how to fight — you change the world it fights in.* |
| **Concept** | Two Glims auto-battle on instinct; your only input is weather. Tap runes for Rain, Sun, Gale, Quake, Fog, Nightfall or Bloom, paid for from a shared Sky Meter. Conditions stack and interact — Rain plus Spark makes a conductive field that chains lightning, Gale clears Fog instantly as a counter — and learning that table is the mastery curve. Your Glim's stance and attacks visibly change with conditions, and the rival Wright calls weather back at you. |
| **Meta layer** | The Almanac: every interaction you discover becomes an illustrated entry, so the collection is *knowledge*. Team picks are really weather-strategy picks, plus Sky Meter upgrades and a second rune slot. |
| **Research grounding** | Turns a genre whose battles are menu lookups into a real-time spectacle, which is what makes it legible in a 3-second creative — the arena, not the stat line, is the thing you watch. |
| **Why it can win** | Nobody else takes the commands away. Removing direct control makes reading your own creature a skill, and the weather VFX carry the juice budget on their own. |

**Projected stats** — CPI **$0.40–0.65** · D1 **50%** · D7 **20%** · D30 **8.5%** · Session **12 min** ·
Sessions/DAU **4.7** · ARPDAU **$0.15–0.22** · LTV(90d) **$1.00** · Year-1 at scale: **6–11M downloads, $7–12M net**

---

## 27. 📸 Snapcatch *(wave 7 — the Glimmerwild: catching reinvented)*

| | |
|---|---|
| **Genre** | Creature-collection by photography |
| **Hyper-casual hook** | *You don't throw anything. You just have to be looking at the right moment.* |
| **Concept** | Pan and zoom a viewfinder across a living scene while Glims behave autonomously. Each telegraphs a spectacular action with a peak frame a few tenths of a second wide — a breach, a discharge, a leap. Tap the shutter at the peak and the shot is graded live on framing, timing, rarity and composition; that grade *is* the catch strength. Lures let a patient player provoke a behaviour and set the shot up rather than wait for it. |
| **Meta layer** | The Album — the actual photographs you took, re-rendered from stored capture parameters with their grades and captions. Completing a species page means photographing every one of its behaviours. |
| **Research grounding** | Converts the genre's slot-machine catch into a skill act with no fail state — you are never punished, only given a worse photograph, which removes churn pressure while keeping mastery. |
| **Why it can win** | The Album is the strongest collection artifact in the portfolio: not a list of what you own, but a gallery of things you personally captured well — inherently shareable and impossible to duplicate. |

**Projected stats** — CPI **$0.30–0.50** · D1 **52%** · D7 **21%** · D30 **9%** · Session **12 min** ·
Sessions/DAU **4.9** · ARPDAU **$0.13–0.20** · LTV(90d) **$0.98** · Year-1 at scale: **8–14M downloads, $7–12M net**

---

## 28. ⛰️ Cairn *(wave 8 — CONCEPT ONLY, not built: the useful death)*

| | |
|---|---|
| **Genre** | Endless 3D climb / physics roguelite |
| **Hyper-casual hook** | *He didn't make it. He helped.* |
| **Concept** | You are one of an endless line of climbers on an impossible spire, and you are not going to make it. Leap, tap to reach, grab a hold — or fall. **When you come to rest you freeze in whatever pose you landed in, permanently, and that pose becomes solid geometry.** An arm thrown out toward the wall as you fall is a hook the next climber swings from; a panicked ball is a useless lump. So you learn to aim your corpse. Roughly 200m up, a band of sheer holdless stone can only be passed by deliberately throwing climbers at it until their outstretched arms become the route. |
| **Meta layer** | The cairn itself — persisted locally, never reset. It is the save file, a monument you built, and a readable history of your own bad decisions. Four climber types trade climbing ability against corpse quality; the Anchor is a terrible climber whose job is to die somewhere specific. |
| **Research grounding** | Inverts the worst emotional beat in the genre. Falling is normally dead time the player is punished with; here it is the beat with the most agency, which removes churn pressure at the exact moment competitors create it. |
| **Why it can win** | The creative needs no text in any language — a frozen figure with an outstretched arm being grabbed by the next climber reads instantly in a scroll, which is what actually drives CPI down. Shares Siege Pile's load-bearing discovery (failure is construction) with none of its complexity. |
| **Status** | **Design only — there is nothing to play.** The built wave-8-era 3D game is Overwind (#29). |

**Projected stats** — CPI **$0.22–0.40** · D1 **49%** · D7 **19%** · D30 **8%** · Session **9 min** ·
Sessions/DAU **4.4** · ARPDAU **$0.09–0.15** · LTV(90d) **$0.70** · Year-1 at scale: **9–16M downloads, $6–11M net**

Full concept: **[CONCEPTS-WAVE8.md](CONCEPTS-WAVE8.md)**

---

## 29. ⚙️ Overwind *(wave 9 — the arena's first 3D game: the machine is the mistake)*

| | |
|---|---|
| **Genre** | Simulated siege engine / physics artillery |
| **Hyper-casual hook** | *The machine is the mistake.* |
| **Concept** | There is no power slider — there is a machine. Hold to wind and the ratchet clicks faster, the rope creaks, the frame lifts at the front; drag while holding to swing the turntable and set the arc; release to fling a ragdoll at the wall. Wind into the red and the rope snaps: the arm flails, the crew scatter, and your lad is dumped three metres in front of his own catapult. Every bit of scatter comes from real machine state — tension, how far the frame has sunk into the mud, the crosswind — and the landing preview is an **ellipse of doubt** computed by the same integrator that flies the lad, so it can be vague but never dishonest. |
| **Meta layer** | Endless escalating sieges with a persistent best. A full build adds the Workshop upgrade tracks (frame, windlass, sling, wheels, rope, crew) plus the two cut systems: free siting on an approach ring, and counter-battery fire that ranges in on you. |
| **Research grounding** | Playable M1 cut of the reconceived catapult from the Siege Pile design work. The argument there: the ragdolls were simulated and the machine throwing them was not, which made the one dishonest object in the game the one the player touches most. |
| **Why it can win** | Failure-as-terrain, measured rather than claimed: the lowest tension that clears the wall is **0.80** on bare ground and **0.68** with a 1.95 m heap of your own casualties banked against it. A 15% discount bought with the bodies of the lads who failed — and the rope-snap creative reads in a scroll with no text in any language. |

**Projected stats** — CPI **$0.30–0.55** · D1 **47%** · D7 **18%** · D30 **7%** · Session **8 min** ·
Sessions/DAU **4.1** · ARPDAU **$0.11–0.17** · LTV(90d) **$0.72** · Year-1 at scale: **5–10M downloads, $4–8M net**

Full brief: **[CONCEPTS-WAVE9.md](CONCEPTS-WAVE9.md)**

---

## 30. 🏹 Rabble *(wave 9 — the warband version: you lead them, loosely)*

| | |
|---|---|
| **Genre** | Warband siege / physics comedy |
| **Hyper-casual hook** | *You lead them. Loosely.* |
| **Concept** | Same catapult as Overwind, but you command an army and the only order available is *you, get in the catapult*. **Drag a unit out of the pen and drop it in the cup**, then wind and fling. There is no bracing and no pile — a body that lands is a person, not building material. A unit storms the castle **only if it lands on the other side of the wall**; land it short and it stands up and mills about outside for the rest of the assault, visibly not helping. Hold the banner circle to capture, against a garrison that defends the courtyard and will not be baited out. |
| **Meta layer** | Escalating assaults with a bigger warband each time — and proportionally more archers, which is worse. |
| **Research grounding** | The chaos-accuracy idea taken to its end: an arrow hits whoever it touches with no side check, and archers pick a friendly on purpose between a fifth and half the time. The deliberate mistake makes it frequent; the spread makes it feel like an accident. |
| **Why it can win** | Friendly fire reads in two seconds of footage with no setup and no text, and the wasted-shot fantasy is unusually legible: the men you failed to get over the wall are still on screen, wandering about, for the whole assault. |

**Projected stats** — CPI **$0.28–0.50** · D1 **48%** · D7 **18%** · D30 **7%** · Session **9 min** ·
Sessions/DAU **4.3** · ARPDAU **$0.10–0.16** · LTV(90d) **$0.74** · Year-1 at scale: **6–11M downloads, $4–9M net**

Full brief: **[CONCEPTS-WAVE9.md](CONCEPTS-WAVE9.md)**

---

## Portfolio strategy

| Game | Primary KPI bet | Monetization center of gravity |
|---|---|---|
| Puff Puff Fit | Low CPI (broad hook) | Interstitials + skin IAP |
| Topple Party | Shareability / UGC virality | Rewarded (extra dominoes) + no-ads IAP |
| Slingshot Salvage | Highest skill-based retention | Rewarded (+launch, 2x scrap) + upgrade IAP |
| Freeze Frame! | Best D1 (cute + panic) | Interstitials + rewarded (slow-melt boost) |
| Volt Rush | Best D30 / LTV (idle layer) | Rewarded (2x offline) + battery IAP |
| Kaboom Crane | Ad-creative CTR (destruction payoff) | Rewarded (+1 ball, 2x gold) + upgrade IAP |
| Buzzcut Buddies | Lowest CPI (ASMR reveal) + broadest reach | Interstitials between buddies + VIP/cosmetic IAP |
| Flip Force | Skill retention | Rewarded (retry) + core skins |
| Ping Pilot | Session length | Rewarded (+pings) + vault upgrades |
| Bounce Brigade | Low CPI (cute rescue) | Interstitials + station upgrades |
| Parcel Panic | D7 (mastery curve) | Rewarded (4th strike) + depot IAP |
| Ghost Crew | Ad-creative wow factor | No-ads IAP + skins |
| Sky Bloom | Lowest CPI (pure spectacle) | Interstitials + firework IAP |
| Fold Friends | Broadest demo (zen + collection) | Interstitials + paper IAP |
| Bloom Drop | Best D30 (Peggle loop + garden) | Rewarded (+seed) + luck IAP |
| Harbor Hustle | D7 (mastery curve) | Rewarded (strike) + town IAP |
| Beam Team | Screenshot virality | No-ads IAP + beam cosmetics |
| Sandfall | Lowest CPI (ASMR physics) + replay density | Interstitials + material/ink IAP |
| Tippy Ship | Near-miss compulsion + live-ops runway | Rewarded (retry sail) + hull IAP |
| Cut Loose | Clip virality (slow-mo money shot) | Rewarded (slow-mo) + blade IAP |
| Return Fire | Highest LTV (combat rewarded-video) | Rewarded (continue, 2x scrap) + skin IAP |
| Broadside Baron | Session length (roguelite runs) | Rewarded (revive run) + crew/ship IAP |
| Siege Pile | Failure-arc creative IPM | Rewarded (+knights) + warband IAP |
| Chopper Drop | Nurture retention (named roster) | Rewarded (+fuel) + base IAP |
| Morphforge | Highest D30/LTV (player-authored collection) | Rewarded (2nd knead) + essence IAP |
| Weatherwright | Creative-legibility (arena spectacle) | Rewarded (Sky refill) + rune IAP |
| Snapcatch | Shareability (the Album) | Rewarded (extra film) + lens IAP |
| Cairn *(concept)* | Lowest CPI (wordless creative) + persistent-monument return rate | Interstitials between lives + climber unlocks (never sell a retry) |
| Overwind | Ad-creative CTR (rope snap) + upgrade-meta depth | Interstitials between sieges + Workshop upgrade tracks |
| Rabble | Ad-creative CTR (friendly fire) + session length | Interstitials between assaults + warband roster expansion |

**Test plan:** all twenty-seven are shipped to Cloudflare and instrumented. Run $200–500 creative probes
per concept on TikTok/Meta targeting CPI + 3-day retention; kill or double-down at 2 weeks; winners
get live-ops (daily events, seasonal skins, leaderboards) and a native wrapper for store launch.

With seventeen concepts the portfolio is now wide enough to test by *mechanic class* rather than by
title — probe one representative per class first (Sky Bloom for spectacle, Bloom Drop for
aim-and-bounce, Parcel Panic for routing, Fold Friends for zen-collection), then fund siblings of
whichever class clears the greenlight gate. The research gate is unchanged and applies to all
twenty-seven: **D1 ≥ 30%, D7 ≥ 15%, CPI ≤ $1.50** before any further meta investment. Wave 4 adds a
physics-class probe (Sandfall for granular ASMR, Tippy Ship for buoyancy comedy, Cut Loose for
rope timing) — see [CONCEPTS-WAVE4.md](CONCEPTS-WAVE4.md) for the full physics-first thesis.

> Wave-3 stats extend the abbreviated projections in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) with
> Sessions/DAU, LTV and year-1 estimates, derived from each concept's D30 and ARPDAU on the same
> basis as waves 1–2. They are pre-launch estimates, not measurements — the live analytics funnel
> exists precisely to replace them.
