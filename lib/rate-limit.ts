import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Default: 60 requests per minute per IP per endpoint
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "cc:rl",
    })
  : null;

export async function enforceRateLimit(key: string) {
  if (!ratelimit) {
    // In local dev without Upstash configured, allow requests.
    return { ok: true as const };
  }
  const res = await ratelimit.limit(key);
  return {
    ok: res.success,
    limit: res.limit,
    remaining: res.remaining,
    reset: res.reset,
  };
}
