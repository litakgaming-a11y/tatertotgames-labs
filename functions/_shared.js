/**
 * Shared constants + helpers for the TaterTot analytics Pages Functions.
 * Kept dependency-free so it runs on the Workers runtime with no bundling.
 */

/** Whitelisted game slugs. Anything else is dropped. */
export const GAMES = Object.freeze([
  'puff-puff-fit',
  'topple-party',
  'slingshot-salvage',
  'freeze-frame',
  'volt-rush',
  'hub',
]);

/**
 * Whitelisted event taxonomy. Grouped by KPI so it is obvious what each
 * event is validating.
 */
export const EVENTS = Object.freeze([
  // --- lifecycle / session ---
  'page_view',
  'session_start',
  'session_end',
  'heartbeat',
  // --- progression / funnel ---
  'level_start',
  'level_complete',
  'level_fail',
  'game_over',
  // --- monetization proxies ---
  'shop_open',
  'purchase',
  'building_built',
  'upgrade_bought',
  'village_levelup',
  'offline_claim',
  // --- engagement ---
  'game_launch',
]);

/** Events that stand in for monetization intent / depth. */
export const MONETIZATION_EVENTS = Object.freeze([
  'shop_open',
  'purchase',
  'building_built',
  'upgrade_bought',
  'village_levelup',
  'offline_claim',
]);

export const GAME_SET = new Set(GAMES);
export const EVENT_SET = new Set(EVENTS);

export const MAX_BODY_BYTES = 32 * 1024; // 32KB
export const MAX_EVENTS_PER_BATCH = 50;

/** Permissive CORS — the collector accepts anonymous beacons from anywhere. */
export const CORS = Object.freeze({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
});

/**
 * Fallback salt. A real secret should be set as the SECRET_SALT environment
 * binding on the Pages project; this only exists so the collector degrades to
 * "still anonymous, just with a publicly known salt" instead of crashing.
 */
const FALLBACK_SALT = 'ttg-labs-fallback-salt-v1-rotate-me';

export function resolveSalt(env) {
  const salt = env && typeof env.SECRET_SALT === 'string' ? env.SECRET_SALT.trim() : '';
  return salt.length >= 8 ? salt : FALLBACK_SALT;
}

/** SHA-256 hex digest, truncated. Never reversible back to the input. */
export async function sha256Hex(input, chars = 32) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const view = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < view.length; i += 1) {
    hex += view[i].toString(16).padStart(2, '0');
  }
  return hex.slice(0, chars);
}

/** 'YYYY-MM-DD' in UTC for a given epoch-ms timestamp. */
export function utcDay(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Coarse device bucket. Deliberately lossy — no fingerprinting value. */
export function classifyUserAgent(ua) {
  const s = (ua || '').toLowerCase();
  if (!s) return 'other';
  if (/bot|crawler|spider|crawling|headless|preview|monitor/.test(s)) return 'bot';
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s)) return 'mobile';
  return 'desktop';
}

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS,
      ...extraHeaders,
    },
  });
}
