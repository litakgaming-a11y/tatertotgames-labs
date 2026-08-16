# TaterTot Games Labs — 7 Hybrid-Casual MVP Concepts

Five original hybrid-casual concepts, deliberately **not** clones of the current top-grossing pack
(no screws, no color-block boards, no hole-swallowing, no hexa-sorting). Each follows the proven
hybrid-casual formula: **one instantly-readable hyper-casual mechanic as the hook** (the "game
feature as ad" — the first 3 seconds of gameplay *is* the creative), plus a **meta layer** that
carries retention and monetization.

All five are live and playable in this repo (`games/<slug>/`), each as a single self-contained
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

**Test plan:** ship all five to Cloudflare, run $200–500 creative probes per concept on TikTok/Meta
targeting CPI + 3-day retention; kill or double-down at 2 weeks; the winner gets live-ops
(daily storms/events, seasonal skins, leaderboards) and a native wrapper for store launch.
