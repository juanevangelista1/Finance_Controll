import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

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

    const necessidadesCategories = ['moradia', 'saude', 'educacao', 'transporte', 'servicos']
    const pessoalCategories = ['alimentacao', 'lazer', 'compras', 'pets', 'outros_saida']
    const investimentosCategories = ['aporte_investimento']

    const necessidadesSpent = transactions
      .filter((t: { type: string; category: string }) => t.type === 'outcome' && necessidadesCategories.includes(t.category))
      .reduce((s: number, t: { amount: number }) => s + t.amount, 0)
    const pessoalSpent = transactions
      .filter((t: { type: string; category: string }) => t.type === 'outcome' && pessoalCategories.includes(t.category))
      .reduce((s: number, t: { amount: number }) => s + t.amount, 0)
    const investimentosSpent = transactions
      .filter((t: { type: string; category: string }) => t.type === 'outcome' && investimentosCategories.includes(t.category))
      .reduce((s: number, t: { amount: number }) => s + t.amount, 0)

    const budgetSection = totalIncome > 0 ? `
CONTROLE ORÇAMENTÁRIO (Regra 50/30/20):
- Necessidades Fixas (meta 50% = R$ ${(totalIncome * 0.5).toFixed(2)}): gasto R$ ${necessidadesSpent.toFixed(2)} (${((necessidadesSpent / totalIncome) * 100).toFixed(1)}%)
- Pessoal & Casal (meta 30% = R$ ${(totalIncome * 0.3).toFixed(2)}): gasto R$ ${pessoalSpent.toFixed(2)} (${((pessoalSpent / totalIncome) * 100).toFixed(1)}%)
- Investimentos (meta 20% = R$ ${(totalIncome * 0.2).toFixed(2)}): aportado R$ ${investimentosSpent.toFixed(2)} (${((investimentosSpent / totalIncome) * 100).toFixed(1)}%)
- Orçamento total: ${((totalOutcome / totalIncome) * 100).toFixed(1)}% da renda utilizado
` : ''

    const prompt = `Você é um consultor financeiro pessoal brasileiro, inteligente e objetivo. Analise os dados financeiros do período "${period}" e gere insights acionáveis.

RESUMO DO PERÍODO:
- Total de Entradas: R$ ${totalIncome.toFixed(2)}
- Total de Saídas: R$ ${totalOutcome.toFixed(2)}
- Saldo: R$ ${(totalIncome - totalOutcome).toFixed(2)}
- Total de transações: ${transactions.length}
${budgetSection}
GASTOS POR CATEGORIA:
${Object.entries(categoryBreakdown).map(([cat, val]) => `- ${cat}: R$ ${(val as number).toFixed(2)}`).join('\n')}

GASTOS POR SUBCATEGORIA:
${Object.entries(subcategoryBreakdown).map(([sub, val]) => `- ${sub}: R$ ${(val as number).toFixed(2)}`).join('\n')}

TRANSAÇÕES:
${transactionList}

CONTEXTO: O casal usa a regra 50/30/20 para controle financeiro. Eles têm 3 gatos. Priorize insights sobre desvios do orçamento 50/30/20 e gastos que podem impactar negativamente as finanças. Seja específico quando mencionar gastos com pets.

Gere exatamente entre 3 e 5 insights no formato JSON. Cada insight deve ser:
- Prático e específico (com valores em R$)
- Curto e direto (máximo 2 frases no message)
- Relevante para o período analisado
- Quando houver desvio do orçamento 50/30/20, mencione o bucket afetado

Tipos permitidos: "tip" (dica de economia), "warning" (alerta de gasto alto ou desvio do orçamento), "achievement" (conquista/elogio quando meta atingida), "pattern" (padrão detectado)

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
    const message = error instanceof Error ? error.message : String(error)
    console.error('AI insights error:', message)
    return NextResponse.json(
      { error: 'Failed to generate insights', detail: message },
      { status: 500 },
    )
  }
}
