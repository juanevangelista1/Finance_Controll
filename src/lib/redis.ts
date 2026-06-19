import { isRedisConfigured, getRedisClient } from './redisClient'
import type { Transaction } from '../domain/transaction/entities/Transaction'

const KEY = 'dtmoney:transactions'

export async function getTransactionsFromRedis(): Promise<Transaction[]> {
  if (!isRedisConfigured()) return []
  const data = await getRedisClient().get<Transaction[]>(KEY)
  return Array.isArray(data) ? data : []
}

export async function saveTransactionsToRedis(transactions: Transaction[]): Promise<void> {
  if (!isRedisConfigured()) return
  await getRedisClient().set(KEY, transactions)
}
