import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

import "dotenv/config";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '60s'),
})

export default ratelimit;
