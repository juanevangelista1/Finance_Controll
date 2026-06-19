import { isRedisConfigured, getRedisClient } from './redisClient'

/**
 * Janela deslizante simples baseada em INCR + EXPIRE.
 * Sem Redis configurado, falha aberto (não bloqueia login) — preferimos
 * degradar a proteção contra força bruta a derrubar o app inteiro.
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  if (!isRedisConfigured()) return true

  const client = getRedisClient()
  const count = await client.incr(key)
  if (count === 1) {
    await client.expire(key, windowSeconds)
  }
  return count <= limit
}
