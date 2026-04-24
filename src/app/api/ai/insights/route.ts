import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactions, period } = body

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json([])
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
    }

    // Build summary of transactions for context
    const totalIncome = transactions
      .filter((t: { type: string }) => t.type === 'income')
      .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)

    const totalOutcome = transactions
      .filter((t: { type: string }) => t.type === 'outcome')
      .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)

    const categoryBreakdown = transactions
      .filter((t: { type: string }) => t.type === 'outcome')
      .reduce((acc: Record<string, number>, t: { category: string; amount: number }) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    const subcategoryBreakdown = transactions
      .filter((t: { type: string; subcategory?: string }) => t.type === 'outcome' && t.subcategory)
      .reduce((acc: Record<string, number>, t: { category: string; subcategory?: string; amount: number }) => {
        const key = `${t.category}/${t.subcategory}`
        acc[key] = (acc[key] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    const transactionList = transactions
      .slice(0, 50) // Limit context size
      .map((t: { description: string; amount: number; type: string; category: string; subcategory?: string }) =>
        `- ${t.type === 'income' ? '💚' : '🔴'} R$${t.amount.toFixed(2)} | ${t.category}${t.subcategory ? '/' + t.subcategory : ''} | "${t.description}"`,
      )
      .join('\n')

    const prompt = `Você é um consultor financeiro pessoal brasileiro, inteligente e objetivo. Analise os dados financeiros do período "${period}" e gere insights acionáveis.

RESUMO DO PERÍODO:
- Total de Entradas: R$ ${totalIncome.toFixed(2)}
- Total de Saídas: R$ ${totalOutcome.toFixed(2)}
- Saldo: R$ ${(totalIncome - totalOutcome).toFixed(2)}
- Total de transações: ${transactions.length}

GASTOS POR CATEGORIA:
${Object.entries(categoryBreakdown).map(([cat, val]) => `- ${cat}: R$ ${(val as number).toFixed(2)}`).join('\n')}

GASTOS POR SUBCATEGORIA:
${Object.entries(subcategoryBreakdown).map(([sub, val]) => `- ${sub}: R$ ${(val as number).toFixed(2)}`).join('\n')}

TRANSAÇÕES:
${transactionList}

CONTEXTO: O usuário tem 3 gatos. Seja específico quando mencionar gastos com pets.

Gere exatamente entre 3 e 5 insights no formato JSON. Cada insight deve ser:
- Prático e específico (com valores em R$)
- Curto e direto (máximo 2 frases no message)
- Relevante para o período analisado

Tipos permitidos: "tip" (dica de economia), "warning" (alerta de gasto alto), "achievement" (conquista/elogio), "pattern" (padrão detectado)

Responda APENAS com um JSON array válido:
[{"type": "tip", "icon": "💡", "title": "título curto", "message": "mensagem breve e específica com valores"},...]

Ícones sugeridos por tipo: tip=💡, warning=⚠️, achievement=🏆, pattern=📊
Não inclua explicações, apenas o JSON array.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Extract JSON array from possible markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json([])
    }

    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed)) {
      return NextResponse.json([])
    }

    // Validate and sanitize each insight
    const insights = parsed
      .filter(
        (item: Record<string, unknown>) =>
          item.type && item.title && item.message,
      )
      .slice(0, 5)
      .map((item: Record<string, unknown>) => ({
        type: ['tip', 'warning', 'achievement', 'pattern'].includes(item.type as string) ? item.type : 'tip',
        icon: (item.icon as string) || '💡',
        title: String(item.title),
        message: String(item.message),
      }))

    return NextResponse.json(insights)
  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 },
    )
  }
}
