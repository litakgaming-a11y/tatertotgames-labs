/**
 * POST /api/collect — anonymous event collector.
 *
 * Accepts a small JSON batch from analytics.js and writes validated rows to D1.
 * Everything is best-effort: the client never learns anything about internal
 * failures and never gets a body it has to parse.
 *
 * Request shape:
 *   {
 *     "sid":   "<session id, client-generated>",
 *     "vid":   "<random first-party token, client-generated>",   // optional
 *     "game":  "<whitelisted slug>",                             // batch default
 *     "events": [ { "n": "level_start", "lvl": 3, "val": 12.5, "to": 4210 } ]
 *   }
 * `to` is "milliseconds ago relative to the moment this batch was sent", so
 * ordering inside a batch survives without trusting the client's wall clock.
 */

import {
  GAME_SET,
  EVENT_SET,
  MAX_BODY_BYTES,
  MAX_EVENTS_PER_BATCH,
  CORS,
  resolveSalt,
  sha256Hex,
  utcDay,
  classifyUserAgent,
} from '../_shared.js';

/** How far into the past a client is allowed to backdate an event. */
const MAX_BACKDATE_MS = 6 * 60 * 60 * 1000; // 6h
const ID_PATTERN = /^[A-Za-z0-9_-]{6,64}$/;

const noContent = () => new Response(null, { status: 204, headers: CORS });
const badRequest = (reason) =>
  new Response(JSON.stringify({ ok: false, error: reason }), {
    status: 400,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

/** GET: say what this endpoint is without leaking anything about it. */
export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, endpoint: 'collect', method: 'POST' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json; charset=utf-8', Allow: 'POST, OPTIONS', ...CORS },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // ---- size guard, cheap path first -------------------------------------
  const declared = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return badRequest('payload_too_large');
  }

  let raw;
  try {
    raw = await request.text();
  } catch (err) {
    return badRequest('unreadable_body');
  }
  // Byte length, not character length — multi-byte payloads must not slip past.
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return badRequest('payload_too_large');
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    return badRequest('invalid_json');
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return badRequest('invalid_payload');
  }

  const list = payload.events;
  if (!Array.isArray(list) || list.length === 0) {
    return badRequest('no_events');
  }
  if (list.length > MAX_EVENTS_PER_BATCH) {
    return badRequest('too_many_events');
  }

  const sessionId = typeof payload.sid === 'string' && ID_PATTERN.test(payload.sid) ? payload.sid : null;
  if (!sessionId) {
    return badRequest('invalid_session');
  }
  const batchGame = typeof payload.game === 'string' ? payload.game.toLowerCase() : '';

  // ---- anonymous identifiers -------------------------------------------
  const now = Date.now();
  const day = utcDay(now);
  const salt = resolveSalt(env);
  const ua = request.headers.get('user-agent') || '';
  // Raw IP is read here and immediately folded into a one-way hash. It is never
  // stored, logged, or returned.
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'noip';

  let visitorHash;
  let cohortId = null;
  try {
    visitorHash = await sha256Hex(`${ip}|${ua}|${day}|${salt}`, 32);
    const vid = typeof payload.vid === 'string' && ID_PATTERN.test(payload.vid) ? payload.vid : null;
    if (vid) cohortId = await sha256Hex(`${salt}|cohort|${vid}`, 24);
  } catch (err) {
    return noContent(); // crypto unavailable: silently drop rather than 500
  }

  const country = (request.cf && typeof request.cf.country === 'string' ? request.cf.country : '')
    .slice(0, 2)
    .toUpperCase() || null;
  const uaClass = classifyUserAgent(ua);

  // ---- validate + normalise each event ----------------------------------
  const rows = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;

    const name = typeof item.n === 'string' ? item.n.toLowerCase() : '';
    if (!EVENT_SET.has(name)) continue;

    const game = (typeof item.g === 'string' ? item.g.toLowerCase() : batchGame);
    if (!GAME_SET.has(game)) continue;

    const level = toBoundedInt(item.lvl, 0, 100000);
    const value = toBoundedFloat(item.val, -1e9, 1e9);

    const backdate = toBoundedInt(item.to, 0, MAX_BACKDATE_MS) ?? 0;
    const ts = now - backdate;

    rows.push({ ts, day, visitorHash, cohortId, game, name, level, value, sessionId, country, uaClass });
  }

  if (rows.length === 0) {
    // Nothing survived validation. Not a client error worth surfacing.
    return noContent();
  }

  // ---- write -------------------------------------------------------------
  try {
    if (!env || !env.DB) return noContent();

    const stmt = env.DB.prepare(
      `INSERT INTO events
         (ts, day, visitor_hash, cohort_id, game, event, level, value, session_id, country, ua_class)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    await env.DB.batch(
      rows.map((r) =>
        stmt.bind(
          r.ts,
          r.day,
          r.visitorHash,
          r.cohortId,
          r.game,
          r.name,
          r.level,
          r.value,
          r.sessionId,
          r.country,
          r.uaClass
        )
      )
    );
  } catch (err) {
    // Never leak internal errors (SQL text, binding names, stack) to a client.
    console.error('collect: d1 write failed', err && err.message);
    return noContent();
  }

  return noContent();
}

function toBoundedInt(raw, min, max) {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  const v = Math.round(n);
  if (v < min || v > max) return null;
  return v;
}

function toBoundedFloat(raw, min, max) {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n < min || n > max) return null;
  return n;
}
