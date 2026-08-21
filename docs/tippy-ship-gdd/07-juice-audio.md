# 07 — Juice & Audio

One scalar drives everything continuous. Discrete punches layer on top. That is the whole architecture.

---

## 1. Why a bus and not a pile of effects

The prototype triggers effects independently: `sndCreak(roll)` here, `timeScale = 0.55` there, `addShake()` somewhere else. It works, but tension **spikes** rather than **builds**, and forty independently-tuned magic numbers drift out of coherence as the game grows.

A single driving scalar gives three things:

1. **Coherence.** Every channel moves as one body, so the player reads one emotion rather than five effects.
2. **Release.** When tension drops, every channel releases *in the same frame*. That simultaneity is what makes `SAVED!` feel like a physical event rather than a text popup.
3. **One tuning knob.** The drama of the entire game is one response curve, remote-configurable.

## 2. Computing Tension

```csharp
float EvaluateTension(Hull h, RunState run)
{
    // 1. how close is the roll to capsize
    float rollT     = Mathf.Abs(h.a) / Sim.CAPSIZE_ANG;             // 0 .. 1+

    // 2. how fast is it getting worse (predictive — this is what makes it
    //    feel anticipatory rather than reactive)
    float rateT     = Mathf.Clamp01(Mathf.Abs(h.va) * 1.9f);

    // 3. how much freeboard is left before the rail goes under
    float boardT    = 1f - Mathf.Clamp01(h.freeboard / h.freeboard0);

    // 4. how much is at stake — greed makes the same angle scarier
    float stakeT    = Mathf.Clamp01((run.multiplier - 1f) / 4f);

    float raw = rollT  * 0.52f
              + rateT  * 0.20f
              + boardT * 0.18f
              + stakeT * 0.10f;

    // asymmetric smoothing: rises fast, falls slow.
    // Falling slow is what makes the post-SAVED calm feel earned.
    float k = raw > tension ? TENSION_ATTACK : TENSION_RELEASE;
    tension = Mathf.Lerp(tension, raw, 1f - Mathf.Exp(-k * dt));
    return Mathf.Clamp01(tension);
}
```

| Constant | Value | Note |
|---|---|---|
| `TENSION_ATTACK` | 9.0 | Rise reaches ~99% in 0.5 s |
| `TENSION_RELEASE` | 2.2 | Fall takes ~2 s — the exhale |

The `stakeT` term is the subtle one. A 24° list at ×1.2 is mildly worrying; the same 24° at ×4.5 is terrifying. The game *knows* how much the player has to lose and turns up the drama accordingly. Nothing else in the design communicates greed back to the player as feeling.

## 3. Channel table

Every continuous channel is a pure function of `tension`. No channel has its own state machine.

| Channel | 0.0 | 0.35 | 0.62 | 0.85 | 0.95 |
|---|---|---|---|---|---|
| **Heartbeat BPM** | off | 66 | 96 | 132 | 156 |
| **Heartbeat gain** | 0 | 0.15 | 0.35 | 0.60 | 0.75 |
| **Music LPF cutoff** | 20 kHz | 8 kHz | 3 kHz | 900 Hz | 500 Hz |
| **Music stem: strings** | 0.0 | 0.3 | 0.7 | 1.0 | 1.0 |
| **Music stem: low brass** | 0.0 | 0.0 | 0.35 | 0.9 | 1.0 |
| **Music stem: percussion** | 0.2 | 0.4 | 0.8 | 1.0 | 0.4 † |
| **Music stem: melody** | 1.0 | 0.9 | 0.5 | 0.1 | 0.0 |
| **Creak density** | 0 | 0.6/s | 1.8/s | 3.4/s | 4.6/s |
| **Creak pitch** | — | 0.9× | 1.15× | 1.45× | 1.7× |
| **Camera dutch** | 0° | 0.4° | 1.6° | 3.2° | 4.0° |
| **Camera push-in** | 1.00 | 1.01 | 1.045 | 1.09 | 1.12 |
| **Vignette hue** | teal | teal | amber | red | red |
| **Vignette strength** | 0.05 | 0.12 | 0.30 | 0.55 | 0.68 |
| **Rail rim-light** | off | warm | amber | red pulse | red strobe |
| **Inclinometer zone** | green | green | amber | red | red pulse |
| **Haptic pulse rate** | 0 | 0 | 1.5 Hz | 4 Hz | 6 Hz |
| **Ambient gulls** | full | full | thinning | silent | silent |
| **`timeScale`** | 1.0 | 1.0 | 1.0 | 0.55 ‡ | 0.55 |
| **Water darkening** | 0 | 0.05 | 0.18 | 0.35 | 0.45 |

† Percussion *drops out* at the extreme. Removing an element at peak tension is more frightening than adding one — the floor falls away.
‡ `timeScale` is driven by the `WARN_ANG` latch, not by tension directly, so it stays crisp and binary. See §4.

### Curve shape

Channels are not linear in tension. Each has an authored `AnimationCurve` asset so the curve is tunable in-editor without code, and each curve is exported to Remote Config as a 9-point sample so it is tunable in production.

Default shape for most channels: `ease-in-quad` — nothing happens for the first third, then it accelerates. This keeps calm loading genuinely calm and makes the onset of danger feel sudden.

## 4. The near-miss arc — the money moment

The latch is separate from the bus and stays binary, because its readability depends on being unambiguous.

```
        roll crosses WARN_ANG (0.44 rad ≈ 25°)
                    │
                    ├─► timeScale = 0.55
                    ├─► "⚠ TIPPING!" popup
                    ├─► haptic 25 ms
                    ├─► savedPending = TRUE          ← latch arms
                    └─► tension already ~0.75 from the bus
                    │
        ... player fights it, or does nothing ...
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
  roll < SAVED_ANG          roll > CAPSIZE_ANG
  (0.28 rad ≈ 16°)          (0.70 rad ≈ 40°)
        │                        │
        ▼                        ▼
   ★ THE RELEASE ★           CAPSIZE
```

### The release — every channel, one frame

```
  timeScale        0.55 ──► 1.0        over 0.25 s, ease-out
  music LPF        900 Hz ──► 20 kHz   over 0.4 s
  music stems      swell: melody 0 ──► 1.0, brass 0.9 ──► 0.2
  heartbeat        fade out over 0.6 s
  camera dutch     3.2° ──► 0°         over 0.35 s, slight overshoot
  camera push      1.09 ──► 1.00       over 0.35 s
  vignette         red ──► teal        over 0.3 s
  particles        gold burst, 24, radial from the hull centreline
  popup            "SAVED!" 26 px, teal, 1.2 s, scale-punch 1.4 ──► 1.0
  sfx              two-tone rising triangle (520→780, then 780→1040 +0.1 s)
  haptic           15 ms crisp pop
  ambient          gulls fade back in over 1.2 s
  inclinometer     bubble zone snaps green with a bright flash
```

The **0.25 s ease-out on `timeScale`** is critical. An instant snap back to 1.0 feels like a bug; a slow ramp feels mushy. Quarter of a second reads as the world exhaling.

### Hysteresis — do not narrow it

The 9° band between `SAVED_ANG` (16°) and `WARN_ANG` (25°) exists so that chop cannot spam the message. `SAVED!` must remain rare enough to mean something. **Do not reduce this band for any reason**, including playtest feedback that it "doesn't fire often enough". If it fires often, it stops working.

## 5. Discrete punches

Layered on top of the bus. Each is a one-shot.

| Event | Visual | Audio | Haptic | Shake |
|---|---|---|---|---|
| Crate lands | 6 dust particles at contact | thunk, pitch ∝ 1/mass | 6 ms | `clamp(m/300, 1, 5)` if speed > 90 |
| Crate lands hard | 14 particles, deck flex 2 px | thunk + low thud | 12 ms | scaled |
| Barrel starts rolling | — | wooden rumble loop, gain ∝ `va` | — | — |
| Glassware crunch | 16 white shards, flash | glass break noise burst | 20 ms | 3 |
| Overboard | splash column, 5 ripples | splash, pitch ∝ mass | 12 ms | 3 |
| Card chosen | card scales 1.15 → 0, trails to crane | soft click | 4 ms | — |
| Quota met | quota bar fills gold, `SAIL` slides up | rising two-tone | 10 ms | — |
| Multiplier tick | number scale-punch 1.3 → 1.0 | pitch rises with each step | 3 ms | — |
| Wake incoming | horn, bow wave visible | ferry horn (174/262 Hz) | 15 ms | — |
| Gull lands | feather puff, weight popup | gull cry ×2 | 8 ms | 1 |
| Wind gust | spray streaks, flag snap | band-passed noise sweep | 10 ms | 2 |
| `SAVED!` | see §4 | see §4 | 15 ms | — |
| Capsize | slow-mo, stack slides, huge splash | groan + crash + water | 60 ms | 9 for 0.8 s |
| Delivered | coins arc to counter, port lights | coin cascade, pitch-rising | 30 ms | — |
| Port tier up | camera pan, buildings rise, lamps sequence | ambient layer + fanfare | 40 ms | — |

**Screen shake budget.** Never exceed magnitude 9. Never shake during the load phase except on hard landings — a shaking camera while the player is judging a 2° list is actively hostile. All shake is disabled in reduced-motion mode.

## 6. Audio production — ElevenLabs

All audio is generated through ElevenLabs and shipped as compressed assets. No runtime synthesis (the prototype's WebAudio approach does not survive the move to Unity, and generated audio is dramatically better).

### Music — 4 stems × 8 regions

| Stem | Content | Driven by |
|---|---|---|
| **Melody** | Lead line — accordion, whistle, or strings per region | Inverse tension |
| **Strings** | Sustained pad, tension harmony | Tension |
| **Low brass** | Sub-bass swells, dread | Tension, high threshold |
| **Percussion** | Rhythmic bed | Tension, drops at peak |

Each region gets a distinct instrumentation while sharing a harmonic framework so cross-fades between regions on the map do not clash. Loop length 60–90 s, seamless, at 128 kbps Vorbis. Total music budget: 32 stems ≈ 45 MB.

Generation brief per region, via `compose_music`: specify BPM, key, instrumentation, and mood, then request the four stems separately at identical BPM and length. Verify phase alignment before shipping — stems that drift make the mix wander.

### SFX library

| Group | Count | Notes |
|---|---|---|
| Creaks | 12 variants | Pitched at runtime ±0.7×–1.7× |
| Thunks | 8 (by mass class) | Pitched by mass |
| Splashes | 6 (by mass) | Plus 4 ripple tails |
| Water ambience | 8 (per region) | Layered loops |
| Wind | 6 | Base, gust, squall |
| Gulls | 5 | Cry, flutter, land, flee |
| Ferry horns | 3 | Distance-mixed |
| Winch | 3 loops | Pitched by cable speed |
| UI | 14 | Clicks, coins, stars, purchase, error |
| Voice-ish stingers | 6 | "SAVED!", "CAPSIZED!", etc — stylised, wordless |
| Town ambience | 4 × 5 tiers | Layered as the port grows |

Total ≈ 90 SFX assets, ~18 MB.

### Mix rules

- **The creak is the tension instrument.** It sits in a dedicated 400 Hz–2 kHz band and everything else ducks around it. When the boat is in trouble, the creak is the loudest thing in the mix.
- **Music ducks 6 dB** under any discrete punch, 120 ms release.
- **Heartbeat is sub-bass**, 50–70 Hz, felt more than heard, with a matched haptic pulse on the same beat. On devices without haptics, raise its gain by 3 dB.
- **Master limiter** at −1 dBTP. Mobile speakers are the target, not headphones — check the mix on a phone speaker at 50% volume before shipping.

## 7. Haptics

| Pattern | Use |
|---|---|
| 3–6 ms tick | Card select, multiplier tick, crate land |
| 12 ms bump | Overboard, hard landing |
| 15 ms pop | `SAVED!` |
| 20 ms sharp | Glassware crunch |
| 25 ms rumble | `WARN_ANG` crossing |
| 60 ms long | Capsize |
| Continuous pulse train | Tension ≥ 0.62, rate from the channel table |

Use `Handheld.Vibrate` fallback on Android below API 26, and the Taptic Engine via a native plugin on iOS. **Always provide a toggle.** Haptics are the most commonly disabled feature in mobile games and forcing them costs reviews.

## 8. Reduced-motion mode

A single toggle in Settings that disables:

- Camera dutch and push-in
- All screen shake
- Vignette pulsing (static strength instead)
- Particle counts reduced 70%
- `timeScale` changes retained — slow-motion is information, not decoration, and removing it would make the near-miss unreadable

Everything else — audio, haptics, colour, the inclinometer — is unchanged, so the game remains fully playable and the tension still communicates.

## 9. Performance budget

| Item | Device floor budget |
|---|---|
| Active particles | ≤ 220 |
| Audio voices | ≤ 24 |
| Post-process passes | 2 (vignette + colour grade), single full-screen blit |
| Tension evaluation | once per fixed step, < 0.05 ms |
| Channel application | once per render frame, not per fixed step |

Channels apply at render rate, not sim rate. Applying a vignette 150 times a second is pure waste.
