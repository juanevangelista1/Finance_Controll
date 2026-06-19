import { NextResponse } from 'next/server'
import { getTransactionsFromRedis, saveTransactionsToRedis } from '../../../lib/redis'
import type { Transaction } from '../../../domain/transaction/entities/Transaction'

// GET /api/transactions — retorna todas as transações
export async function GET() {
  try {
    const transactions = await getTransactionsFromRedis()
    return NextResponse.json(transactions)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST /api/transactions — sincroniza o array completo vindo do browser
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Expected array' }, { status: 400 })
    }
    await saveTransactionsToRedis(body as Transaction[])
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
