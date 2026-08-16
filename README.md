# 🥔 TaterTot Games Labs

### ▶ Play now: **https://tatertotgames-labs.pages.dev**

Seven original **hybrid-casual** game prototypes — playable instantly in the browser, hosted on
Cloudflare. Each game is one self-contained HTML file: zero dependencies, mobile-first one-hand
controls, WebAudio-synthesized sound, haptics, particles everywhere, and persistent meta
progression in localStorage.

## The games

| Game | Hook | Meta | Play |
|---|---|---|---|
| 🎈 **Puff Puff Fit** | Hold to inflate, release before the pop | Blob skin collection | [play](https://tatertotgames-labs.pages.dev/games/puff-puff-fit/) |
| 🁢 **Topple Party** | Draw domino chains, watch them cascade | Build Topple Town | [play](https://tatertotgames-labs.pages.dev/games/topple-party/) |
| 🛰️ **Slingshot Salvage** | One-drag gravity slingshot | Upgrade garage | [play](https://tatertotgames-labs.pages.dev/games/slingshot-salvage/) |
| 🧊 **Freeze Frame!** | Tap water to freeze melting bridges | Snow village grows per rescue | [play](https://tatertotgames-labs.pages.dev/games/freeze-frame/) |
| ⚡ **Volt Rush** | Drag the rod, catch the lightning | Idle city with offline earnings | [play](https://tatertotgames-labs.pages.dev/games/volt-rush/) |
| 🏗️ **Kaboom Crane** | Rhythm-tap the swing, release to wreck | Demolition contracts + upgrades | [play](https://tatertotgames-labs.pages.dev/games/kaboom-crane/) |
| ✂️ **Buzzcut Buddies** | ASMR fuzz-trim reveal | Groomed-buddy salon collection | [play](https://tatertotgames-labs.pages.dev/games/buzzcut-buddies/) |

### Wave 3 — ten new mechanic classes

| Game | Hook | Meta | Play |
|---|---|---|---|
| 🧲 **Flip Force** | Tap flips your magnet polarity | Orb core lab | [play](https://tatertotgames-labs.pages.dev/games/flip-force/) |
| 📡 **Ping Pilot** | Sonar-ping a pitch-dark cave | Reef Vault upgrades | [play](https://tatertotgames-labs.pages.dev/games/ping-pilot/) |
| 🤸 **Bounce Brigade** | Place trampolines, bounce the rescue | Station upgrades | [play](https://tatertotgames-labs.pages.dev/games/bounce-brigade/) |
| 📦 **Parcel Panic** | Tap junctions to route parcels | Logistics depots | [play](https://tatertotgames-labs.pages.dev/games/parcel-panic/) |
| 👻 **Ghost Crew** | Your last run replays as a ghost | Skins + crew photos | [play](https://tatertotgames-labs.pages.dev/games/ghost-crew/) |
| 🎆 **Sky Bloom** | Burst fireworks at perfect altitude | Firework types + album | [play](https://tatertotgames-labs.pages.dev/games/sky-bloom/) |
| 🦢 **Fold Friends** | Swipe to fold origami alive | Paper Park collection | [play](https://tatertotgames-labs.pages.dev/games/fold-friends/) |
| 🌻 **Bloom Drop** | Drop seeds down a pin field | Persistent garden | [play](https://tatertotgames-labs.pages.dev/games/bloom-drop/) |
| ⛴️ **Harbor Hustle** | Tap boats to stop and go | Harbor town build-out | [play](https://tatertotgames-labs.pages.dev/games/harbor-hustle/) |
| 🔦 **Beam Team** | Tap mirrors to reroute the beam | Lighthouse Village | [play](https://tatertotgames-labs.pages.dev/games/beam-team/) |

## Docs

- [CONCEPTS.md](CONCEPTS.md) — the 7 shipped MVP concepts with hooks, meta design, and projected KPIs
- [CONCEPTS-WAVE3.md](CONCEPTS-WAVE3.md) — 10 build-ready briefs for the next wave (design only,
  no code), including the platform integration contract and stability rules a coding model must follow
- [RESEARCH.md](RESEARCH.md) — deep research on top-grossing hybrid-casual games (Color Block Jam,
  Screwdom, Mob Control, Hexa Sort, My Perfect Hotel, …) and market benchmarks

## Tech constraints (deliberate)

Every game is **one HTML file with zero external requests** — no libraries, no CDN, no image or
audio files, no web fonts. All art is drawn to canvas; all SFX are synthesized live with WebAudio;
favicons are inline SVG data URIs. That means instant cold loads on mobile data (46–57 KB per game),
which is the whole point for a playable-ad / instant-playtest funnel.

## Run locally

Any static server works:

```bash
npx serve .
```

## Deploy (Cloudflare)

```bash
npx wrangler pages deploy . --project-name tatertotgames-labs
```

---

Prototype playtest builds — © 2026 TaterTot Games Labs.
