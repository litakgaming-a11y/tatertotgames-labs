# 09 — Monetization

Ad-led hybrid. Rewarded video drives volume, IAP drives depth.

---

## 1. Governing rules

1. **No ad ever reverses a run outcome without cost.** The RIGHT HER! continue sheds two crates and closes loading — see [01-core-loop.md §7](01-core-loop.md) for the dominance proof that stopping cleanly always beats it.
2. **No interstitial between a capsize and a retry.** That gap is where rage-quit lives. Interstitials fire only on map and menu transitions.
3. **Gems never buy cargo and never buy a run outcome.** Money must not bypass the skill faucet.
4. **First ad impression no earlier than session 2.**
5. **Every rewarded offer is declinable with a visible, non-dark-pattern button.**

## 2. Rewarded placements

| # | Placement | Trigger | Reward | Est. impressions / DAU |
|---|---|---|---|---|
| R1 | **×2 Offline** | Return popup | Double accrued offline cargo | 1.0 |
| R2 | **Double It** | Result screen | ×2 Coin payout | 1.4 |
| R3 | **RIGHT HER!** | Capsize, 4 s window | Righted, −2 crates, loading closes | 0.7 |
| R4 | **Salvage** | Capsize declined | Recover 40% of lost cargo by value | 0.5 |
| R5 | **Rush Production** | Port screen | +2 h of one port's output | 0.8 |
| R6 | **Reroll Hand** | In-run, once per run | Redraw the 3-card overload hand | 0.6 |
| R7 | **Free Ship Trial** | Deployment screen | One run in an unowned hull | 0.3 |
| R8 | **Streak Insurance** | Daily missed | Preserve a broken streak, once/week | 0.1 |
| | **Total** | | | **5.4** |

Target 4–7 rewarded views per DAU. At a $12 eCPM in tier-1 markets, 5.4 views ≈ **$0.065 ARPDAU from rewarded alone**.

### Placement design notes

**R3 — RIGHT HER!** is the highest-engagement placement and the most dangerous. Its 4 s window runs during the slow-motion capsize, so the player watches their ship falling over while deciding. The urgency is real and diegetic rather than manufactured. The cost structure (§1) is what keeps it honest.

**R1 — ×2 Offline** is the return-trigger reinforcement. It must appear *after* the collection animation, never before — the player should feel the base reward first, then be offered more.

**R7 — Free Ship Trial** is a merchandising placement disguised as a reward. A player who runs a Hopper once and feels how it eats Bullion is dramatically more likely to buy it. Show the Coin price on the result screen of the trial run.

### Frequency caps

| Rule | Value |
|---|---|
| Max rewarded per session | 8 |
| Min gap between rewarded | 25 s |
| Max interstitials per session | 4 |
| Min gap between interstitials | 180 s |
| No interstitial in first 3 sessions | hard |
| No interstitial within 60 s of a rewarded | hard |

## 3. Interstitials

Only on these transitions:

- Map → Port (after 3+ minute session)
- Result → Map (not Result → Sail Again)
- Fleet → Map
- App resume after > 30 min away

**Never** on: run start, run end, capsize, retry, unlock celebration, tier-up.

Suppressed entirely for Remove Ads purchasers and for the first 3 sessions.

## 4. IAP catalogue

| SKU | Price | Contents | Role |
|---|---|---|---|
| **Harbourmaster** | $6.99 | Remove Ads + permanent ×2 idle + offline cap 12 h | **Anchor.** The single most important SKU |
| Starter Pack | $4.99 | 400 gems + Clipper + 5k Coins, first 72 h only | Conversion opener |
| Gems — Handful | $1.99 | 250 | |
| Gems — Crate | $4.99 | 700 (+12%) | |
| Gems — Hold | $9.99 | 1,600 (+28%) | |
| Gems — Cargo Ship | $24.99 | 4,500 (+44%) | |
| Gems — Fleet | $49.99 | 10,000 (+60%) | Whale tier |
| Tide Pass | $9.99 | Season premium track | Recurring, per region season |
| Hopper Bundle | $12.99 | Hopper hull + 2 tiers + 800 gems | Merchandising |
| Icebreaker Bundle | $19.99 | Icebreaker + 3 tiers + 1,500 gems | Region 5 tie-in |

**Remove Ads keeps the rewarded placements available.** Purchasers can still opt into R1–R8; the ad is simply skipped and the reward granted. This is unusual and it is correct: the rewards are game systems, not ad payloads, and removing them would make the anchor SKU *worse* than free play.

### Pricing philosophy

The anchor SKU is deliberately mid-priced and enormously generous. Its job is to convert the 2% who will ever pay into paying *once*, early, and feeling good about it. Gem packs then monetise depth for the small fraction who go further.

Expected mix at steady state: Harbourmaster 46% of revenue, gem packs 31%, Tide Pass 15%, bundles 8%.

## 5. Revenue model

Assumptions at 100k DAU, blended tier-1/tier-3:

| Line | Value |
|---|---|
| Rewarded views / DAU | 5.4 |
| Blended rewarded eCPM | $9.50 |
| Rewarded ARPDAU | $0.051 |
| Interstitial impressions / DAU | 2.1 |
| Blended interstitial eCPM | $6.00 |
| Interstitial ARPDAU | $0.013 |
| IAP conversion (monthly) | 2.2% |
| Average transaction | $8.40 |
| IAP ARPDAU | $0.033 |
| **Blended ARPDAU** | **$0.097** |

Against a target CPI of $0.85 and D30 of 6%, payback lands around day 42 — acceptable for hybrid-casual but not comfortable. **The lever that matters most is D7**, because it moves both ad volume and IAP conversion. Every design decision in this spec that looks like it costs monetization (no ad-continue without cost, no gems-for-cargo) is protecting D7.

## 6. UA creative strategy

This game's creatives write themselves, and [04-progression.md §3](04-progression.md) generates them from real play.

### Automatic clip harvesting

Tag runs meeting any of these and export a 15 s clip:

| Tag | Condition |
|---|---|
| `big_save` | Recovered from > 35° |
| `long_dread` | > 4 s continuously above `WARN_ANG` |
| `mega_load` | Multiplier > ×6 delivered clean |
| `catastrophe` | Capsize with > 12 crates aboard |
| `last_crate` | Capsized on the final overload crate |

Clips are rendered from the deterministic tape at high quality offline, with the HUD stripped and the inclinometer enlarged. Zero marginal cost, unlimited supply, and every clip is a genuine gameplay moment rather than a fabricated one.

### Creative concepts

1. **"One more crate."** — Multiplier climbing, list rising, the hand hovering. Cut at the decision. High-intent, tests the core hook directly.
2. **"SAVED!"** — Pure near-miss. Slow-motion, heartbeat, recovery, release. Sound-on winner.
3. **"Don't do it."** — A catastrophe clip played straight, comedy timing. Broad-appeal, low-intent, cheap installs.
4. **Playable ad** — The existing web build is *already* a playable ad. Strip it to run 1, wire the CTA. This is a near-zero-cost, high-performing asset that most competitors cannot produce.

The web prototype at [`games/tippy-ship/play.html`](../../games/tippy-ship/play.html) being a single zero-dependency file is a genuine UA advantage. Ship it as the playable.

## 7. Ethical floor

- No countdown timers designed to induce panic purchases.
- No loot boxes, no randomised paid rewards, no gacha.
- No "your fleet is starving" style loss-framing push notifications.
- Push notifications are opt-in, capped at 1/day, and only fire for: warehouse full, streak expiring, season ending, Regatta results.
- Ad-continue window is 4 s and declining is a large, clearly-labelled button — never a small ✕.
- Full purchase history and a restore-purchases path on every store.

These are not just ethics; they are D30 protection. Every dark pattern in this genre trades week-one revenue for month-two churn, and this game's whole economic case rests on long accounts.
