/**
 * The site is deployed straight from the repo root, so source and config files
 * (functions/*.js, wrangler.toml, schema.sql) land in the Pages asset tree next
 * to the game pages. Serving them is not acceptable: the collector source
 * carries the fallback hashing salt, and a known salt would let someone test
 * whether a specific IP + User-Agent visited on a given day.
 *
 * _routes.json narrows Function invocation to /api/* plus exactly these paths,
 * so this middleware costs nothing on game page loads.
 */

const BLOCKED = /^\/(functions\/|wrangler\.toml$|schema\.sql$|_routes\.json$)/;

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (BLOCKED.test(path)) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return context.next();
}
