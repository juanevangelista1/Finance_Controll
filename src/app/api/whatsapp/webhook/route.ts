import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getTransactionsFromRedis, saveTransactionsToRedis } from '../../../../lib/redis'
import type { Transaction } from '../../../../domain/transaction/entities/Transaction'

// ── helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return `wa-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Valida que a requisição realmente veio da Meta (HMAC-SHA256 sobre o corpo bruto)
function isValidSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret || !signatureHeader) return false

  const expected = `sha256=${crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')}`
  const sigBuf = Buffer.from(signatureHeader)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length) return false
  return crypto.timingSafeEqual(sigBuf, expBuf)
}

// Restringe quem pode interagir com o bot, mesmo com assinatura válida da Meta
function isAllowedNumber(phone: string): boolean {
  const allowed = process.env.WHATSAPP_ALLOWED_NUMBERS
  if (!allowed) return false
  return allowed.split(',').map((n) => n.trim()).includes(phone)
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function currentMonthSummary(transactions: Transaction[]) {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const monthTx = transactions.filter((t) => {
    const d = new Date(t.createdAt)
    return d.getMonth() === month && d.getFullYear() === year
  })
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const outcome = monthTx.filter((t) => t.type === 'outcome').reduce((s, t) => s + t.amount, 0)
  return { income, outcome, balance: income - outcome, count: monthTx.length, monthTx }
}

// ── GET — verificação do webhook pela Meta ───────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// ── POST — recebe mensagens do WhatsApp ──────────────────────────────────────

export async function POST(request: Request) {
  const rawBody = await request.text()

  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    console.error('WhatsApp webhook: assinatura inválida ou ausente')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(rawBody)

  // Extrai a mensagem de texto recebida
  const entry = body?.entry?.[0]
  const change = entry?.changes?.[0]
  const message = change?.value?.messages?.[0]

  if (!message || message.type !== 'text') {
    return NextResponse.json({ ok: true }) // ignora mensagens não-texto
  }

  const fromNumber = message.from as string

  if (!isAllowedNumber(fromNumber)) {
    console.error('WhatsApp webhook: número não autorizado tentou interagir:', fromNumber)
    return NextResponse.json({ ok: true }) // ignora silenciosamente, sem dar pistas
  }

  const userText = message.text.body as string
  const phoneNumberId = change.value.metadata.phone_number_id as string

  try {
    const transactions = await getTransactionsFromRedis()
    const summary = currentMonthSummary(transactions)

    const responseText = await processWithAI(userText, transactions, summary)

    // Se o AI retornou uma nova transação para criar
    if (responseText.startsWith('CREATE_TRANSACTION:')) {
      const json = responseText.replace('CREATE_TRANSACTION:', '').trim()
      const newTx: Transaction = JSON.parse(json)
      newTx.id = generateId()
      await saveTransactionsToRedis([...transactions, newTx])
      const confirmText = buildCreationConfirmation(newTx)
      await sendWhatsAppMessage(phoneNumberId, fromNumber, confirmText)
    } else {
      await sendWhatsAppMessage(phoneNumberId, fromNumber, responseText)
    }
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    await sendWhatsAppMessage(
      phoneNumberId,
      fromNumber,
      '❌ Ocorreu um erro ao processar sua solicitação. Tente novamente.',
    )
  }

  return NextResponse.json({ ok: true })
}

// ── AI ───────────────────────────────────────────────────────────────────────

async function processWithAI(
  userText: string,
  transactions: Transaction[],
  summary: ReturnType<typeof currentMonthSummary>,
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return 'IA não configurada.'

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const now = new Date()
  const monthNames = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ]
  const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`

  const recentTx = transactions
    .slice(-30)
    .map(
      (t) =>
        `${t.type === 'income' ? '💚' : '🔴'} R$${t.amount.toFixed(2)} | ${t.category} | "${t.description}" | ${new Date(t.createdAt).toLocaleDateString('pt-BR')}`,
    )
    .join('\n')

  const prompt = `Você é um assistente financeiro pessoal do aplicativo DT Money, respondendo via WhatsApp.
O casal usa a regra 50/30/20: 50% Necessidades Fixas, 30% Pessoal & Casal, 20% Investimentos.

RESUMO DE ${currentMonth.toUpperCase()}:
- Entradas: ${formatCurrency(summary.income)}
- Saídas: ${formatCurrency(summary.outcome)}
- Saldo: ${formatCurrency(summary.balance)}
- Transações: ${summary.count}

ÚLTIMAS 30 TRANSAÇÕES:
${recentTx || 'Nenhuma transação registrada'}

CATEGORIAS DISPONÍVEIS PARA SAÍDA: moradia, saude, educacao, transporte, servicos, alimentacao, lazer, compras, pets, aporte_investimento, outros_saida
CATEGORIAS DISPONÍVEIS PARA ENTRADA: salario, freelance, investimento_retorno, outros_entrada

MENSAGEM DO USUÁRIO: "${userText}"

INSTRUÇÕES:
1. Se o usuário quiser ADICIONAR uma transação (ex: "gastei R$50 no almoço", "recebi R$3000 de salário"), responda APENAS com:
CREATE_TRANSACTION:{"description":"...","amount":valor_numerico,"type":"income"|"outcome","category":"categoria_válida","date":"${now.toISOString().split('T')[0]}","createdAt":"${now.toISOString()}"}

2. Para CONSULTAS (saldo, gastos, resumo, relatório), responda em português com no máximo 5 linhas, seja objetivo e use emojis.

3. Para outras perguntas, responda normalmente e brevemente.

Não adicione explicações extras no caso de CREATE_TRANSACTION. Responda em português.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

function buildCreationConfirmation(tx: Transaction): string {
  const type = tx.type === 'income' ? '💚 Entrada' : '🔴 Saída'
  return `✅ Transação registrada!\n\n${type}: *${tx.description}*\nValor: *R$ ${tx.amount.toFixed(2).replace('.', ',')}*\nCategoria: ${tx.category}\nData: ${new Date(tx.createdAt).toLocaleDateString('pt-BR')}`
}

// ── WhatsApp send ────────────────────────────────────────────────────────────

async function sendWhatsAppMessage(phoneNumberId: string, to: string, text: string) {
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })
}
