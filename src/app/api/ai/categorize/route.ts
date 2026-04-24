import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  OUTCOME_CATEGORY_REGISTRY,
  INCOME_CATEGORY_REGISTRY,
} from '../../../../domain/transaction/value-objects/CategoryRegistry'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

function buildCategoryList(type: 'income' | 'outcome'): string {
  const registry = type === 'income' ? INCOME_CATEGORY_REGISTRY : OUTCOME_CATEGORY_REGISTRY
  return registry
    .map((cat) => {
      const subs = cat.subcategories.map((s) => s.value).join(', ')
      return `- ${cat.value}: [${subs || 'sem subcategorias'}]`
    })
    .join('\n')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { description, amount, type } = body

    if (!description || !type) {
      return NextResponse.json({ error: 'Missing description or type' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
    }

    const categoryList = buildCategoryList(type)

    const prompt = `Você é um assistente financeiro brasileiro. Analise a descrição de uma transação e categorize-a.

TIPO DA TRANSAÇÃO: ${type === 'income' ? 'ENTRADA (receita)' : 'SAÍDA (despesa)'}
DESCRIÇÃO: "${description}"
VALOR: R$ ${amount?.toFixed(2) || 'não informado'}

CATEGORIAS E SUBCATEGORIAS VÁLIDAS (use APENAS estas):
${categoryList}

CONTEXTO IMPORTANTE: O usuário tem 3 gatos. Qualquer despesa relacionada a animais de estimação deve ir para a categoria "pets".

Responda APENAS com um JSON válido no formato:
{"category": "valor_da_categoria", "subcategory": "valor_da_subcategoria", "confidence": 0.95}

Se não houver subcategoria aplicável, use string vazia. A confidence deve ser entre 0.0 e 1.0.
Não inclua explicações, apenas o JSON.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Extract JSON from possible markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { category: type === 'income' ? 'outros_entrada' : 'outros_saida', subcategory: '', confidence: 0.3 },
      )
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({
      category: parsed.category || (type === 'income' ? 'outros_entrada' : 'outros_saida'),
      subcategory: parsed.subcategory || '',
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
    })
  } catch (error) {
    console.error('AI categorize error:', error)
    return NextResponse.json(
      { error: 'Failed to categorize transaction' },
      { status: 500 },
    )
  }
}
