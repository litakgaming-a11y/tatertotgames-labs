# TaterTot Games Labs — 17 Hybrid-Casual MVP Concepts

Seventeen original hybrid-casual concepts, deliberately **not** clones of the current top-grossing
pack (no screws, no color-block boards, no hole-swallowing, no hexa-sorting), spanning seventeen
distinct mechanic classes. Each follows the proven
hybrid-casual formula: **one instantly-readable hyper-casual mechanic as the hook** (the "game
feature as ad" — the first 3 seconds of gameplay *is* the creative), plus a **meta layer** that
carries retention and monetization.

All seventeen are live and playable in this repo (`games/<slug>/`), each as a single self-contained
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

**Test plan:** all seventeen are shipped to Cloudflare and instrumented. Run $200–500 creative probes
per concept on TikTok/Meta targeting CPI + 3-day retention; kill or double-down at 2 weeks; winners
get live-ops (daily events, seasonal skins, leaderboards) and a native wrapper for store launch.

With seventeen concepts the portfolio is now wide enough to test by *mechanic class* rather than by
title — probe one representative per class first (Sky Bloom for spectacle, Bloom Drop for
aim-and-bounce, Parcel Panic for routing, Fold Friends for zen-collection), then fund siblings of
whichever class clears the greenlight gate. The research gate is unchanged and applies to all
seventeen: **D1 ≥ 30%, D7 ≥ 15%, CPI ≤ $1.50** before any further meta investment.

> Wave-3 stats extend the abbreviated projections in [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) with
> Sessions/DAU, LTV and year-1 estimates, derived from each concept's D30 and ARPDAU on the same
> basis as waves 1–2. They are pre-launch estimates, not measurements — the live analytics funnel
> exists precisely to replace them.
