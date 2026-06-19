import { Redis } from '@upstash/redis'

export function isRedisConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  return !!url && !!token && url.startsWith('https://')
}

export function getRedisClient(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}
