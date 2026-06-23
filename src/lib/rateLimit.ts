/**
 * Best-effort in-memory rate limiter (fixed window).
 *
 * This is a BASELINE guard, not a distributed one. State lives in the process
 * memory of a single server instance, so on a multi-instance / serverless host
 * (e.g. Vercel) each instance counts independently and a limit is effectively
 * multiplied by the instance count. It still meaningfully blunts bursts and
 * single-client abuse, costs nothing, and adds no external dependency.
 *
 * For durable, cross-instance limiting at launch, back this with an external
 * store (Upstash Redis / Vercel KV) keyed by IP / user. That is an OWNER action
 * because it adds an external service (see PLAN.md "Security hardening").
 */

interface Window {
  count: number;
  resetAt: number; // epoch ms when the current window ends
}

const buckets = new Map<string, Window>();

// Prune expired entries when the map grows past this, so memory stays bounded
// even under a spray of unique keys (e.g. many distinct IPs).
const PRUNE_THRESHOLD = 10_000;

function prune(now: number) {
  for (const [key, win] of buckets) {
    if (win.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Requests remaining in the current window (0 when blocked). */
  remaining: number;
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfter: number;
}

/**
 * Records one hit for `key` and reports whether it is within `limit` per
 * `windowMs`. Call once per request.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  if (buckets.size > PRUNE_THRESHOLD) prune(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > opts.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { ok: true, remaining: opts.limit - existing.count, retryAfter: 0 };
}

/**
 * Best-effort client IP from proxy headers. On Vercel/most proxies the real
 * client is the first entry in `x-forwarded-for`. Falls back to a constant so
 * the limiter still degrades to a global cap rather than failing open per-key.
 */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Standard 429 headers for a blocked request. */
export function rateLimitHeaders(retryAfter: number): Record<string, string> {
  return { "Retry-After": String(retryAfter) };
}
