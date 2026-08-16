-- TaterTot Games Labs — privacy-friendly analytics schema (Cloudflare D1 / SQLite)
--
-- Privacy model:
--   visitor_hash : SHA-256(ip + user-agent + UTC date + server salt), truncated.
--                  Rotates every UTC day, so it can never be linked across days
--                  and can never be reversed to an IP or a person. Used for DAU
--                  and per-day unique counting only.
--   cohort_id    : SHA-256(server salt + a random, client-generated first-party
--                  token held in localStorage). No PII, no fingerprinting, user
--                  can clear it at any time. This is the ONLY cross-day identifier
--                  and it exists purely so D1/D7/D30 retention cohorts are possible
--                  (a daily-rotating hash mathematically cannot express retention).
--   country      : coarse country code from request.cf.country. No city, no IP.
--   ua_class     : coarse device bucket only (mobile/tablet/desktop/other).
--
-- Nothing else about the request is persisted. Raw IP and raw User-Agent are used
-- transiently to compute the daily hash and are never written to disk.

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  ts           INTEGER NOT NULL,          -- server-assigned epoch milliseconds
  day          TEXT    NOT NULL,          -- 'YYYY-MM-DD' (UTC), server-assigned
  visitor_hash TEXT    NOT NULL,          -- daily-rotating anonymous hash
  cohort_id    TEXT,                      -- salted hash of first-party random token
  game         TEXT    NOT NULL,          -- whitelisted slug, or 'hub'
  event        TEXT    NOT NULL,          -- whitelisted event name
  level        INTEGER,                   -- progression level, nullable
  value        REAL,                      -- numeric payload (seconds, coins, combo…)
  session_id   TEXT    NOT NULL,
  country      TEXT,                      -- ISO-3166 alpha-2, coarse geo only
  ua_class     TEXT                       -- 'mobile' | 'tablet' | 'desktop' | 'other'
);

CREATE INDEX IF NOT EXISTS idx_events_day          ON events(day);
CREATE INDEX IF NOT EXISTS idx_events_game_day     ON events(game, day);
CREATE INDEX IF NOT EXISTS idx_events_visitor_day  ON events(visitor_hash, day);
CREATE INDEX IF NOT EXISTS idx_events_cohort_day   ON events(cohort_id, day);
CREATE INDEX IF NOT EXISTS idx_events_event_day    ON events(event, day);
CREATE INDEX IF NOT EXISTS idx_events_session      ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_funnel       ON events(game, event, level);

-- ---------------------------------------------------------------------------
-- Views used by /api/stats. All of them are aggregate-shaped; none of them
-- expose a raw row to a caller.
-- ---------------------------------------------------------------------------

-- One row per (game, session): reconstructed session boundaries and duration.
-- Duration prefers the client-reported elapsed seconds carried on heartbeat /
-- session_end (accurate even when a batch is lost), and falls back to the
-- server-side timestamp spread.
DROP VIEW IF EXISTS v_sessions;
CREATE VIEW v_sessions AS
SELECT
  session_id,
  game,
  MIN(day)                                       AS day,
  MIN(ts)                                        AS first_ts,
  MAX(ts)                                        AS last_ts,
  MAX(COALESCE(cohort_id, visitor_hash))         AS actor,
  COUNT(*)                                       AS event_count,
  MAX(
    MAX(CASE WHEN event IN ('session_end', 'heartbeat')
             THEN COALESCE(value, 0) ELSE 0 END),
    (MAX(ts) - MIN(ts)) / 1000.0
  )                                              AS duration_seconds
FROM events
GROUP BY session_id, game;

-- One row per (game, cohort_id): the day that cohort member was first seen.
-- This is the anchor for D1/D7/D30 retention.
DROP VIEW IF EXISTS v_cohort_first_day;
CREATE VIEW v_cohort_first_day AS
SELECT game, cohort_id, MIN(day) AS first_day
FROM events
WHERE cohort_id IS NOT NULL
GROUP BY game, cohort_id;

-- Distinct (game, cohort_id, day) activity grid — joined against the view above
-- to answer "did this cohort member come back on day N?".
DROP VIEW IF EXISTS v_cohort_active_days;
CREATE VIEW v_cohort_active_days AS
SELECT DISTINCT game, cohort_id, day
FROM events
WHERE cohort_id IS NOT NULL;

-- Daily active visitors per game, using the daily-rotating hash.
DROP VIEW IF EXISTS v_daily;
CREATE VIEW v_daily AS
SELECT
  game,
  day,
  COUNT(DISTINCT visitor_hash) AS dau,
  COUNT(DISTINCT session_id)   AS sessions,
  COUNT(*)                     AS events
FROM events
GROUP BY game, day;
