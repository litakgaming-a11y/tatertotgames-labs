# 🥔 TaterTot Games Labs

Five original **hybrid-casual** game prototypes — playable instantly in the browser, hosted on
Cloudflare. Each game is one self-contained HTML file: zero dependencies, mobile-first one-hand
controls, WebAudio-synthesized sound, haptics, particles everywhere, and persistent meta
progression in localStorage.

## The games

| Game | Hook | Meta | Play |
|---|---|---|---|
| 🎈 **Puff Puff Fit** | Hold to inflate, release before the pop | Blob skin collection | [`games/puff-puff-fit/`](games/puff-puff-fit/) |
| 🁢 **Topple Party** | Draw domino chains, watch them cascade | Build Topple Town | [`games/topple-party/`](games/topple-party/) |
| 🛰️ **Slingshot Salvage** | One-drag gravity slingshot | Upgrade garage | [`games/slingshot-salvage/`](games/slingshot-salvage/) |
| 🧊 **Freeze Frame!** | Tap water to freeze melting bridges | Snow village grows per rescue | [`games/freeze-frame/`](games/freeze-frame/) |
| ⚡ **Volt Rush** | Drag the rod, catch the lightning | Idle city with offline earnings | [`games/volt-rush/`](games/volt-rush/) |

## Docs

- [CONCEPTS.md](CONCEPTS.md) — the 5 MVP concepts with hooks, meta design, and projected KPIs
- [RESEARCH.md](RESEARCH.md) — deep research on top-grossing hybrid-casual games (Color Block Jam,
  Screwdom, Mob Control, Hexa Sort, My Perfect Hotel, …) and market benchmarks

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
