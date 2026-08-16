# TaterTot Games Labs — Playtest Analytics

A privacy-friendly, first-party analytics backend for the playtest site. No third
party ever sees a request. No cookies. No IP addresses stored. No PII, ever.

It exists to answer one question: **do these hybrid-casual prototypes hold up on
the KPIs that decide whether a prototype graduates?** — retention (D1/D7/D30),
session length, sessions per user, level funnel drop-off, and monetization intent.

- **Stack:** Cloudflare Pages Functions + D1 (SQLite). Ships with the same Pages
  project as the site — there is no separate Worker to deploy or keep in sync.
- **Database:** `tatertot-analytics` (`dba5d10d-a59b-4c7e-b334-b3135bf149d1`),
  bound to the Pages project as `DB`.
- **Client:** `/analytics.js`, 2.9 KB, zero dependencies.

---

## 1. Endpoints

### `POST /api/collect`

Ingests a batch of events. Always answers `204 No Content` on success and never
returns a body the client has to parse.

**Request body**

```json
{
  "sid": "b1f0c9e2a4d7...",          // session id, client-generated
  "vid": "9a2e77c1b0f4...",          // random first-party token (optional)
  "game": "puff-puff-fit",           // batch-level default slug
  "events": [
    { "n": "level_start",    "lvl": 3,               "to": 8000 },
    { "n": "level_complete", "lvl": 3, "val": 55,    "to": 6000 },
    { "n": "game_launch",    "g": "volt-rush",       "to": 400  }
  ]
}
```

| Field | Meaning |
|---|---|
| `n`   | event name (must be in the taxonomy below) |
| `g`   | per-event game slug override; falls back to the batch `game` |
| `lvl` | integer level / wave |
| `val` | numeric payload — seconds, coins, combo, whatever the event means |
| `to`  | **t**ime **o**ffset: milliseconds *before the batch was sent*. The server computes `ts = now - to`, so ordering inside a batch survives without trusting the client's wall clock. Clamped to 6 hours. |

**Validation** — every one of these returns `400` with a short JSON reason:

| Condition | Reason |
|---|---|
| Body > 32 KB (measured in bytes, not characters) | `payload_too_large` |
| More than 50 events in a batch | `too_many_events` |
| Unparseable JSON | `invalid_json` |
| `events` missing or empty | `no_events` |
| `sid` missing or not `[A-Za-z0-9_-]{6,64}` | `invalid_session` |

Unknown **game slugs** and unknown **event names** are not an error — those
individual events are silently dropped and the rest of the batch is written.
A batch where nothing survives still returns `204`. This is deliberate: a stale
cached copy of `analytics.js` must never generate client-visible errors.

D1 write failures are caught, logged server-side, and reported to the client as
`204`. Internal errors (SQL text, binding names, stack traces) are never returned.

`OPTIONS /api/collect` → `204` with permissive CORS.
`GET /api/collect` → `405` with a one-line hint.

### `GET /api/stats`

Returns the whole KPI dashboard as aggregate JSON. **Every field is a `GROUP BY`
result.** There is no code path in this endpoint that can emit an individual
event row, a visitor hash, or a cohort id.

| Param | Default | Notes |
|---|---|---|
| `days` | `30` | window for volume metrics, clamped to 1–90 |
| `game` | all | restrict to one whitelisted slug |

```
https://tatertotgames-labs.pages.dev/api/stats?days=7&game=volt-rush
```

Cached for 60 seconds at the edge.

---

## 2. Event taxonomy

Both the client and the server whitelist these. Anything else is dropped.

### Lifecycle
| Event | Fired when | `val` |
|---|---|---|
| `page_view` | every page load | — |
| `session_start` | new session (first load, or 30 min inactivity) | — |
| `session_end` | `pagehide` / tab hidden | elapsed seconds |
| `heartbeat` | every 30 s while visible | elapsed seconds |
| `game_launch` | game page opened, or a hub card clicked | — |

`session_end` fires on *every* hide, not just the final one — that is how mobile
session length stays accurate. Stats takes `MAX(value)` per session, so repeats
are harmless.

### Progression / funnel
| Event | `lvl` | `val` |
|---|---|---|
| `level_start` | level / wave entered | — |
| `level_complete` | level cleared | reward earned |
| `level_fail` | level lost (reserved) | — |
| `game_over` | run ended | score / progress |

### Monetization proxies
There is no real money in these prototypes, so intent is measured with the
soft-currency equivalents.

| Game | Events |
|---|---|
| Puff Puff Fit | `shop_open`, `purchase` (skin bought, `val` = price) |
| Topple Party | `building_built` (`val` = buildings owned) |
| Slingshot Salvage | `shop_open`, `upgrade_bought` (`val` = scrap cost) |
| Freeze Frame! | `village_levelup` (`val` = new village level) |
| Volt Rush | `shop_open`, `upgrade_bought`, `offline_claim` (`val` = coins claimed) |

**Volt Rush has no fail state.** Its `game_over` fires when the player returns to
the title, and is sent *without* a `level` so it is excluded from funnel drop-off
counts rather than being miscounted as a loss.

---

## 3. Privacy model

### What is never stored
Raw IP addresses. Raw User-Agent strings. Cookies. Screen/canvas/font
fingerprints. City-level geography. Referrers. Query strings. Anything typed by
a player. There is no field in the schema that could hold personal data.

### `visitor_hash` — anonymous, daily-rotating

```
visitor_hash = SHA-256(ip + "|" + user-agent + "|" + UTC-date + "|" + SECRET_SALT)
```

The IP and User-Agent are read from the request, folded into a one-way hash, and
discarded. Because the UTC date is an input, **the hash for the same person is a
completely different value tomorrow.** It cannot be reversed to a person and
cannot be linked across days. It is used for one thing: counting unique visitors
*within* a day (DAU).

### `cohort_id` — the honest tradeoff

A daily-rotating hash mathematically *cannot* express retention: measuring
whether someone came back on day 7 requires linking two different days.

So retention is anchored on a separate identifier: a **random token generated by
the browser** and kept in `localStorage`, which the server stores only as
`SHA-256(SECRET_SALT + token)`.

What that means in practice:

- It is **random** — not derived from the IP, the device, or anything about the
  person. It identifies a *browser profile*, not a human.
- It carries **no information**. On its own it is 24 hex characters.
- The user can **erase it at any time** by clearing site data, and it is never
  set at all under DNT or `?noanalytics=1`.
- It never leaves this origin and is never joined to anything else.

If you would rather have no cross-day identifier at all, delete the `vid` field
from `analytics.js`. Everything else keeps working; only the `retention` block
goes empty.

### Coarse geo and device
`country` comes from `request.cf.country` (a two-letter code Cloudflare provides
without any lookup on our side). `ua_class` is bucketed to
`mobile | tablet | desktop | bot | other` and the original string is thrown away.

### Opt-out
Analytics disables itself completely — no identifiers generated, no storage
written, no requests sent — when **either**:

- the browser sends Do-Not-Track (`navigator.doNotTrack === '1'`), or
- the URL contains `?noanalytics=1`.

In that state `window.TTG.track()` is a no-op function and `window.TTG.disabled`
is `true`. Verified live: calling `track()` under opt-out produces zero network
requests.

### Never breaking a game
`analytics.js` is wrapped in `try/catch` end to end, every storage access is
guarded, and `fetch` failures are swallowed. If the endpoint is down, storage is
blocked (Safari private mode, embedded webviews), or `crypto` is unavailable, the
library goes quiet and the game is unaffected. In-game calls use
`window.TTG?.track(...)`, so a missing or blocked library is a no-op.

### ⚠️ Required follow-up: set the salt

The salt currently falls back to a constant compiled into the Worker. Set a real
one so the daily hash cannot be recomputed by anyone who has read the source:

```powershell
# Generate a random salt and set it non-interactively.
$salt = [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
$salt | npx wrangler pages secret put SECRET_SALT --project-name tatertotgames-labs
```

Rotating the salt resets all hashes: DAU is unaffected going forward, but
existing retention cohorts are orphaned. Set it **once**, early, then leave it.

Source files (`functions/*.js`, `wrangler.toml`, `schema.sql`) are blocked from
public serving by `functions/_middleware.js` + `_routes.json`, because the site
deploys from the repo root and would otherwise expose them.

---

## 4. Reading the KPI dashboard

```powershell
$s = (Invoke-WebRequest 'https://tatertotgames-labs.pages.dev/api/stats?days=30' -UseBasicParsing).Content | ConvertFrom-Json
```

| Block | What to look at | Hybrid-casual benchmark |
|---|---|---|
| `totals` | events, sessions, visitors in the window | sanity check |
| `dau[]` | `{game, day, dau, sessions, events}` | is any prototype pulling ahead? |
| `new_vs_returning[]` | `{game, day, new_visitors, returning_visitors}` | returning share should climb |
| `retention[]` | `d1/d7/d30 → {eligible, returned, rate}` | **D1 ≥ 35%, D7 ≥ 15%, D30 ≥ 6%** |
| `sessions[]` | median/avg seconds, sessions per visitor | **3–6 min median, 3+ sessions/day** |
| `level_funnel[]` | per level: reached, completes, `completion_rate`, `pct_of_level_1` | find the wall |
| `monetization_proxy[]` | shop opens, purchases, upgrades, claims | intent depth |
| `countries[]`, `devices[]` | coarse mix | traffic sanity |

**Retention denominators are honest.** `eligible` counts only cohort members who
have *had the chance* to return — someone who first played today is not counted
in the D7 denominator. A `rate` of `null` means nobody is eligible yet, which is
different from 0% and is shown as such.

**Where the funnel breaks** is `level_funnel[].levels[]`. `pct_of_level_1` is the
share of level-1 players who ever reached level N — the level where that falls
off a cliff is the one to retune. `completion_rate` (completes ÷ starts) tells
you whether they're bouncing off difficulty or just leaving.

**Session length** prefers the client-reported elapsed seconds carried on
`heartbeat`/`session_end`, floored by the server timestamp spread — so a lost
final beacon undercounts rather than losing the session entirely.

### Sample shape

```json
{
  "ok": true,
  "window": { "days": 30, "since": "2026-07-17", "today": "2026-08-15", "game": "all" },
  "retention": [
    { "game": "volt-rush", "cohort_total": 5,
      "d1":  { "eligible": 4, "returned": 1, "rate": 25 },
      "d7":  { "eligible": 2, "returned": 1, "rate": 50 },
      "d30": { "eligible": 1, "returned": 1, "rate": 100 } }
  ],
  "sessions": [
    { "game": "puff-puff-fit", "sessions": 2, "visitors": 2,
      "sessions_per_visitor": 1, "avg_session_seconds": 71,
      "median_session_seconds": 71, "avg_events_per_session": 7 }
  ],
  "level_funnel": [
    { "game": "puff-puff-fit", "levels": [
      { "level": 1, "players_reached": 1, "starts": 1, "completes": 1, "completion_rate": 100, "pct_of_level_1": 100 },
      { "level": 3, "players_reached": 1, "starts": 1, "completes": 0, "fails": 1, "completion_rate": 0, "pct_of_level_1": 100 }
    ] }
  ]
}
```

---

## 5. Querying D1 from the CLI

All commands run from the repo root. `--remote` hits the real database;
without it you get a local dev copy.

```powershell
# Row count and date range
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="SELECT COUNT(*) rows, MIN(day) first, MAX(day) last FROM events;"

# DAU per game for the last 14 days
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="SELECT game, day, COUNT(DISTINCT visitor_hash) dau FROM events WHERE day >= date('now','-14 day') GROUP BY game, day ORDER BY day DESC;"

# Where players stop — funnel by level
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="SELECT game, level, COUNT(*) starts FROM events WHERE event='level_start' GROUP BY game, level ORDER BY game, level;"

# Session length distribution (uses the v_sessions view)
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="SELECT game, COUNT(*) n, ROUND(AVG(duration_seconds),1) avg_s, ROUND(MAX(duration_seconds),1) max_s FROM v_sessions GROUP BY game;"

# Monetization intent
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="SELECT game, event, COUNT(*) n, ROUND(AVG(value),1) avg_val FROM events WHERE event IN ('shop_open','purchase','upgrade_bought','building_built','village_levelup','offline_claim') GROUP BY game, event;"

# Re-apply the schema (idempotent — CREATE TABLE/INDEX IF NOT EXISTS)
npx wrangler d1 execute tatertot-analytics --remote -y --file=schema.sql
```

### Schema at a glance

`events(id, ts, day, visitor_hash, cohort_id, game, event, level, value, session_id, country, ua_class)`

Indexed on `(day)`, `(game, day)`, `(visitor_hash, day)`, `(cohort_id, day)`,
`(event, day)`, `(session_id)`, and `(game, event, level)` for the funnel.

Views: `v_sessions` (reconstructed sessions + duration), `v_cohort_first_day`
and `v_cohort_active_days` (retention anchors), `v_daily` (DAU rollup).

### Housekeeping

```powershell
# Drop the synthetic rows left by endpoint verification
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="DELETE FROM events WHERE session_id LIKE 'verifysession%' OR session_id LIKE 'postguardcheck%';"

# Retention only needs ~90 days of history
npx wrangler d1 execute tatertot-analytics --remote -y `
  --command="DELETE FROM events WHERE day < date('now','-180 day');"
```

---

## 6. Deploying

```powershell
npx wrangler pages deploy . --project-name tatertotgames-labs --branch main --commit-dirty=true
```

The D1 binding comes from `wrangler.toml` (`binding = "DB"`) and is applied on
every deploy — there is nothing to configure in the dashboard.

## 7. Adding tracking to new code

```js
window.TTG?.track('level_complete', { level: 7, value: coinsEarned });
window.TTG?.track('game_launch',    { game: 'volt-rush' });   // slug override
```

Always use `?.` so a blocked or missing library is harmless. To add a new event
name, add it to `EVENTS` in `functions/_shared.js` — the server drops anything
not on that list.
