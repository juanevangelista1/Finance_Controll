import { Redis } from '@upstash/redis'
import type { Transaction } from '../domain/transaction/entities/Transaction'

const KEY = 'dtmoney:transactions'

function isConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  return !!url && !!token && url.startsWith('https://')
}

function getClient(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

export async function getTransactionsFromRedis(): Promise<Transaction[]> {
  if (!isConfigured()) return []
  const data = await getClient().get<Transaction[]>(KEY)
  return Array.isArray(data) ? data : []
}

export async function saveTransactionsToRedis(transactions: Transaction[]): Promise<void> {
  if (!isConfigured()) return
  await getClient().set(KEY, transactions)
}
