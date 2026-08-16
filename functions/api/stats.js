/**
 * GET /api/stats — aggregate-only KPI dashboard.
 *
 * Query params:
 *   ?days=30   window for the volume metrics (1..90, default 30)
 *   ?game=slug restrict everything to a single whitelisted game
 *
 * Everything returned is a GROUP BY aggregate. There is no code path in this
 * file that can return an individual event row, a visitor hash, or a cohort id.
 */

import { CORS, GAME_SET, MONETIZATION_EVENTS, jsonResponse, utcDay } from '../_shared.js';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 90;
const MAX_FUNNEL_LEVEL = 60;

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  const days = clampInt(url.searchParams.get('days'), 1, MAX_DAYS, DEFAULT_DAYS);
  const gameParam = (url.searchParams.get('game') || '').toLowerCase();
  const game = GAME_SET.has(gameParam) ? gameParam : null;

  const now = Date.now();
  const today = utcDay(now);
  const since = utcDay(now - (days - 1) * 86400000);

  if (!env || !env.DB) {
    return jsonResponse({ ok: false, error: 'analytics_unavailable' }, 503);
  }

  // `gameFilter` is a bound parameter pair: either restrict to one slug, or
  // match everything. Never string-interpolated into SQL.
  const gf = 'AND (? IS NULL OR game = ?)';
  const gb = [game, game];

  try {
    const results = await env.DB.batch([
      // 0. headline totals for the window
      env.DB.prepare(
        `SELECT COUNT(*) AS events,
                COUNT(DISTINCT session_id) AS sessions,
                COUNT(DISTINCT visitor_hash) AS visitor_days,
                COUNT(DISTINCT cohort_id) AS visitors,
                COUNT(DISTINCT day) AS active_days,
                MIN(day) AS first_day,
                MAX(day) AS last_day
         FROM events WHERE day >= ? ${gf}`
      ).bind(since, ...gb),

      // 1. daily active visitors / sessions / events, per game per day
      env.DB.prepare(
        `SELECT game, day,
                COUNT(DISTINCT visitor_hash) AS dau,
                COUNT(DISTINCT session_id)   AS sessions,
                COUNT(*)                     AS events
         FROM events WHERE day >= ? ${gf}
         GROUP BY game, day ORDER BY day DESC, game ASC`
      ).bind(since, ...gb),

      // 2. new vs returning per game per day (cohort-anchored)
      env.DB.prepare(
        `WITH first_seen AS (
           SELECT game, cohort_id, MIN(day) AS first_day
           FROM events WHERE cohort_id IS NOT NULL GROUP BY game, cohort_id
         ), active AS (
           SELECT DISTINCT game, cohort_id, day
           FROM events WHERE cohort_id IS NOT NULL AND day >= ? ${gf}
         )
         SELECT a.game AS game, a.day AS day,
                SUM(CASE WHEN a.day =  f.first_day THEN 1 ELSE 0 END) AS new_visitors,
                SUM(CASE WHEN a.day >  f.first_day THEN 1 ELSE 0 END) AS returning_visitors
         FROM active a
         JOIN first_seen f ON f.game = a.game AND f.cohort_id = a.cohort_id
         GROUP BY a.game, a.day ORDER BY a.day DESC, a.game ASC`
      ).bind(since, ...gb),

      // 3. retention denominators — cohort members old enough to be measurable
      env.DB.prepare(
        `WITH first_seen AS (
           SELECT game, cohort_id, MIN(day) AS first_day
           FROM events WHERE cohort_id IS NOT NULL GROUP BY game, cohort_id
         )
         SELECT game,
                COUNT(*) AS cohort_total,
                SUM(CASE WHEN julianday(?) - julianday(first_day) >= 1  THEN 1 ELSE 0 END) AS eligible_d1,
                SUM(CASE WHEN julianday(?) - julianday(first_day) >= 7  THEN 1 ELSE 0 END) AS eligible_d7,
                SUM(CASE WHEN julianday(?) - julianday(first_day) >= 30 THEN 1 ELSE 0 END) AS eligible_d30
         FROM first_seen WHERE 1 = 1 ${gf}
         GROUP BY game`
      ).bind(today, today, today, ...gb),

      // 4. retention numerators — cohort members seen again on exactly D+N
      env.DB.prepare(
        `WITH first_seen AS (
           SELECT game, cohort_id, MIN(day) AS first_day
           FROM events WHERE cohort_id IS NOT NULL GROUP BY game, cohort_id
         ), active AS (
           SELECT DISTINCT game, cohort_id, day
           FROM events WHERE cohort_id IS NOT NULL
         )
         SELECT f.game AS game,
                COUNT(DISTINCT CASE WHEN a.day = date(f.first_day, '+1 day')  THEN a.cohort_id END) AS returned_d1,
                COUNT(DISTINCT CASE WHEN a.day = date(f.first_day, '+7 day')  THEN a.cohort_id END) AS returned_d7,
                COUNT(DISTINCT CASE WHEN a.day = date(f.first_day, '+30 day') THEN a.cohort_id END) AS returned_d30
         FROM first_seen f
         LEFT JOIN active a ON a.game = f.game AND a.cohort_id = f.cohort_id
         WHERE 1 = 1 ${gf.replace('game =', 'f.game =')}
         GROUP BY f.game`
      ).bind(...gb),

      // 5. session counts + average length
      env.DB.prepare(
        `SELECT game,
                COUNT(*) AS sessions,
                ROUND(AVG(duration_seconds), 1) AS avg_session_seconds,
                ROUND(MAX(duration_seconds), 1) AS max_session_seconds,
                ROUND(AVG(event_count), 1)      AS avg_events_per_session
         FROM v_sessions WHERE day >= ? ${gf} GROUP BY game`
      ).bind(since, ...gb),

      // 6. median session length (window function, aggregate output only)
      env.DB.prepare(
        `WITH ranked AS (
           SELECT game, duration_seconds AS d,
                  ROW_NUMBER() OVER (PARTITION BY game ORDER BY duration_seconds) AS rn,
                  COUNT(*)     OVER (PARTITION BY game)                           AS c
           FROM v_sessions WHERE day >= ? ${gf}
         )
         SELECT game, ROUND(AVG(d), 1) AS median_session_seconds
         FROM ranked WHERE rn IN ((c + 1) / 2, (c + 2) / 2) GROUP BY game`
      ).bind(since, ...gb),

      // 7. sessions per visitor
      env.DB.prepare(
        `SELECT game,
                COUNT(DISTINCT session_id) AS sessions,
                COUNT(DISTINCT COALESCE(cohort_id, visitor_hash)) AS visitors,
                ROUND(COUNT(DISTINCT session_id) * 1.0 /
                      NULLIF(COUNT(DISTINCT COALESCE(cohort_id, visitor_hash)), 0), 2)
                  AS sessions_per_visitor
         FROM events WHERE day >= ? ${gf} GROUP BY game`
      ).bind(since, ...gb),

      // 8. level funnel — reached vs completed vs failed, per level
      env.DB.prepare(
        `SELECT game, level,
                COUNT(DISTINCT CASE WHEN event = 'level_start'    THEN COALESCE(cohort_id, visitor_hash) END) AS players_reached,
                SUM(CASE WHEN event = 'level_start'    THEN 1 ELSE 0 END) AS starts,
                SUM(CASE WHEN event = 'level_complete' THEN 1 ELSE 0 END) AS completes,
                SUM(CASE WHEN event IN ('level_fail', 'game_over') THEN 1 ELSE 0 END) AS fails
         FROM events
         WHERE day >= ? AND level IS NOT NULL AND level <= ?
           AND event IN ('level_start', 'level_complete', 'level_fail', 'game_over') ${gf}
         GROUP BY game, level ORDER BY game ASC, level ASC`
      ).bind(since, MAX_FUNNEL_LEVEL, ...gb),

      // 9. raw event counts
      env.DB.prepare(
        `SELECT game, event,
                COUNT(*) AS count,
                COUNT(DISTINCT session_id) AS sessions,
                ROUND(AVG(value), 2) AS avg_value
         FROM events WHERE day >= ? ${gf}
         GROUP BY game, event ORDER BY game ASC, count DESC`
      ).bind(since, ...gb),

      // 10. coarse geography
      env.DB.prepare(
        `SELECT COALESCE(country, 'XX') AS country,
                COUNT(DISTINCT visitor_hash) AS visitor_days,
                COUNT(*) AS events
         FROM events WHERE day >= ? ${gf}
         GROUP BY country ORDER BY visitor_days DESC LIMIT 25`
      ).bind(since, ...gb),

      // 11. device mix
      env.DB.prepare(
        `SELECT COALESCE(ua_class, 'other') AS ua_class,
                COUNT(DISTINCT session_id) AS sessions
         FROM events WHERE day >= ? ${gf} GROUP BY ua_class ORDER BY sessions DESC`
      ).bind(since, ...gb),
    ]);

    const rows = (i) => (results[i] && Array.isArray(results[i].results) ? results[i].results : []);
    const totals = rows(0)[0] || {};

    const retention = mergeRetention(rows(3), rows(4));
    const sessions = mergeSessions(rows(5), rows(6), rows(7));
    const eventCounts = rows(9);

    return jsonResponse(
      {
        ok: true,
        generated_at: new Date(now).toISOString(),
        window: { days, since, today, game: game || 'all' },
        totals: {
          events: totals.events || 0,
          sessions: totals.sessions || 0,
          visitors: totals.visitors || 0,
          visitor_days: totals.visitor_days || 0,
          active_days: totals.active_days || 0,
          first_day: totals.first_day || null,
          last_day: totals.last_day || null,
        },
        dau: rows(1),
        new_vs_returning: rows(2),
        retention,
        sessions,
        level_funnel: groupFunnel(rows(8)),
        event_counts: eventCounts,
        monetization_proxy: eventCounts.filter((r) => MONETIZATION_EVENTS.includes(r.event)),
        countries: rows(10),
        devices: rows(11),
        notes: {
          dau: 'Distinct daily-rotating visitor hashes. Cannot be linked across days by design.',
          retention: 'Cohort-anchored on a random first-party token (localStorage). Denominators exclude cohorts too young to have had the chance to return.',
          session_seconds: 'Client-reported elapsed seconds from heartbeat/session_end, floored by the server timestamp spread.',
        },
      },
      200,
      { 'Cache-Control': 'public, max-age=60' }
    );
  } catch (err) {
    console.error('stats: query failed', err && err.message);
    return jsonResponse({ ok: false, error: 'stats_unavailable' }, 500);
  }
}

function clampInt(raw, min, max, fallback) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function mergeRetention(eligibleRows, returnedRows) {
  const byGame = new Map();
  for (const r of eligibleRows) {
    byGame.set(r.game, {
      game: r.game,
      cohort_total: r.cohort_total || 0,
      d1: { eligible: r.eligible_d1 || 0, returned: 0, rate: null },
      d7: { eligible: r.eligible_d7 || 0, returned: 0, rate: null },
      d30: { eligible: r.eligible_d30 || 0, returned: 0, rate: null },
    });
  }
  for (const r of returnedRows) {
    const entry = byGame.get(r.game);
    if (!entry) continue;
    entry.d1.returned = r.returned_d1 || 0;
    entry.d7.returned = r.returned_d7 || 0;
    entry.d30.returned = r.returned_d30 || 0;
  }
  for (const entry of byGame.values()) {
    for (const key of ['d1', 'd7', 'd30']) {
      const b = entry[key];
      b.rate = b.eligible > 0 ? Math.round((b.returned / b.eligible) * 1000) / 10 : null;
    }
  }
  return [...byGame.values()];
}

function mergeSessions(countRows, medianRows, perVisitorRows) {
  const medians = new Map(medianRows.map((r) => [r.game, r.median_session_seconds]));
  const perVisitor = new Map(perVisitorRows.map((r) => [r.game, r]));
  return countRows.map((r) => {
    const pv = perVisitor.get(r.game) || {};
    return {
      game: r.game,
      sessions: r.sessions || 0,
      visitors: pv.visitors || 0,
      sessions_per_visitor: pv.sessions_per_visitor ?? null,
      avg_session_seconds: r.avg_session_seconds ?? null,
      median_session_seconds: medians.get(r.game) ?? null,
      max_session_seconds: r.max_session_seconds ?? null,
      avg_events_per_session: r.avg_events_per_session ?? null,
    };
  });
}

/** Turn the flat funnel rows into per-game arrays with drop-off percentages. */
function groupFunnel(funnelRows) {
  const byGame = new Map();
  for (const r of funnelRows) {
    if (!byGame.has(r.game)) byGame.set(r.game, []);
    byGame.get(r.game).push({
      level: r.level,
      players_reached: r.players_reached || 0,
      starts: r.starts || 0,
      completes: r.completes || 0,
      fails: r.fails || 0,
      completion_rate:
        r.starts > 0 ? Math.round(((r.completes || 0) / r.starts) * 1000) / 10 : null,
    });
  }
  const out = [];
  for (const [game, levels] of byGame) {
    const top = levels.length ? levels[0].players_reached : 0;
    out.push({
      game,
      levels: levels.map((l) => ({
        ...l,
        pct_of_level_1: top > 0 ? Math.round((l.players_reached / top) * 1000) / 10 : null,
      })),
    });
  }
  return out;
}
