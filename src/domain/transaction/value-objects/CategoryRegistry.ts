export interface SubcategoryDefinition {
  value: string
  label: string
}

export interface CategoryDefinition {
  value: string
  label: string
  icon: string
  subcategories: SubcategoryDefinition[]
}

// ─── Categorias de SAÍDA ────────────────────────────────────────────────────────

export const OUTCOME_CATEGORY_REGISTRY: CategoryDefinition[] = [
  {
    value: 'alimentacao',
    label: 'Alimentação',
    icon: '🍽️',
    subcategories: [
      { value: 'restaurante', label: 'Restaurante' },
      { value: 'mercado', label: 'Mercado/Supermercado' },
      { value: 'delivery', label: 'Delivery/iFood' },
      { value: 'padaria', label: 'Padaria/Café' },
      { value: 'lanches', label: 'Lanches/Fast Food' },
    ],
  },
  {
    value: 'moradia',
    label: 'Moradia',
    icon: '🏠',
    subcategories: [
      { value: 'aluguel', label: 'Aluguel' },
      { value: 'condominio', label: 'Condomínio' },
      { value: 'energia', label: 'Energia Elétrica' },
      { value: 'agua', label: 'Água' },
      { value: 'gas', label: 'Gás' },
      { value: 'internet', label: 'Internet' },
      { value: 'manutencao', label: 'Manutenção/Reparos' },
      { value: 'moveis', label: 'Móveis/Decoração' },
    ],
  },
  {
    value: 'transporte',
    label: 'Transporte',
    icon: '🚗',
    subcategories: [
      { value: 'combustivel', label: 'Combustível' },
      { value: 'uber_99', label: 'Uber/99' },
      { value: 'estacionamento', label: 'Estacionamento' },
      { value: 'manutencao_veiculo', label: 'Manutenção do Veículo' },
      { value: 'seguro_veiculo', label: 'Seguro Veicular' },
      { value: 'transporte_publico', label: 'Transporte Público' },
    ],
  },
  {
    value: 'saude',
    label: 'Saúde',
    icon: '🏥',
    subcategories: [
      { value: 'consulta', label: 'Consulta Médica' },
      { value: 'farmacia', label: 'Farmácia' },
      { value: 'exames', label: 'Exames' },
      { value: 'plano_saude', label: 'Plano de Saúde' },
      { value: 'academia', label: 'Academia/Esporte' },
    ],
  },
  {
    value: 'educacao',
    label: 'Educação',
    icon: '📚',
    subcategories: [
      { value: 'curso', label: 'Curso/Faculdade' },
      { value: 'livros', label: 'Livros/Material' },
      { value: 'certificacao', label: 'Certificação' },
    ],
  },
  {
    value: 'pets',
    label: 'Pets (Gatos 🐱)',
    icon: '🐾',
    subcategories: [
      { value: 'racao', label: 'Ração' },
      { value: 'areia', label: 'Areia Higiênica' },
      { value: 'petshop', label: 'Pet Shop (banho/acessórios)' },
      { value: 'veterinario', label: 'Veterinário' },
      { value: 'medicamento_pet', label: 'Medicamentos/Vacinas' },
      { value: 'brinquedos_pet', label: 'Brinquedos/Arranhador' },
    ],
  },
  {
    value: 'lazer',
    label: 'Lazer',
    icon: '🎮',
    subcategories: [
      { value: 'entretenimento', label: 'Cinema/Shows/Eventos' },
      { value: 'viagem', label: 'Viagem' },
      { value: 'jogos', label: 'Jogos/Games' },
      { value: 'bar', label: 'Bar/Restaurante (lazer)' },
    ],
  },
  {
    value: 'compras',
    label: 'Compras',
    icon: '🛒',
    subcategories: [
      { value: 'roupas', label: 'Roupas/Calçados' },
      { value: 'eletronicos', label: 'Eletrônicos' },
      { value: 'presentes', label: 'Presentes' },
      { value: 'coisas_casa', label: 'Coisas de Casa' },
      { value: 'higiene', label: 'Higiene/Beleza' },
    ],
  },
  {
    value: 'servicos',
    label: 'Serviços',
    icon: '🔧',
    subcategories: [
      { value: 'streaming', label: 'Streaming (Netflix, Spotify...)' },
      { value: 'assinatura', label: 'Assinaturas Diversas' },
      { value: 'seguro', label: 'Seguros' },
      { value: 'bancario', label: 'Taxas Bancárias' },
      { value: 'servico_profissional', label: 'Serviço Profissional' },
    ],
  },
  {
    value: 'aporte_investimento',
    label: 'Investimentos',
    icon: '📈',
    subcategories: [
      { value: 'previdencia', label: 'Previdência' },
      { value: 'acoes', label: 'Ações/FIIs' },
      { value: 'renda_fixa', label: 'Renda Fixa/CDB/Tesouro' },
      { value: 'poupanca', label: 'Poupança/Reserva' },
      { value: 'cripto', label: 'Criptomoedas' },
    ],
  },
  {
    value: 'outros_saida',
    label: 'Outros',
    icon: '📦',
    subcategories: [
      { value: 'outros', label: 'Não categorizado' },
    ],
  },
]

// ─── Categorias de ENTRADA ──────────────────────────────────────────────────────

export const INCOME_CATEGORY_REGISTRY: CategoryDefinition[] = [
  {
    value: 'plantao',
    label: 'Plantão',
    icon: '🏥',
    subcategories: [
      { value: 'plantao_12h', label: 'Plantão 12h' },
      { value: 'plantao_24h', label: 'Plantão 24h' },
      { value: 'extra', label: 'Extra' },
    ],
  },
  {
    value: 'samu',
    label: 'SAMU',
    icon: '🚑',
    subcategories: [],
  },
  {
    value: 'aeromedico',
    label: 'AeroMédico',
    icon: '🚁',
    subcategories: [],
  },
  {
    value: 'salario',
    label: 'Salário',
    icon: '💰',
    subcategories: [],
  },
  {
    value: 'freelance',
    label: 'Freelance',
    icon: '💻',
    subcategories: [],
  },
  {
    value: 'investimentos',
    label: 'Investimentos',
    icon: '📈',
    subcategories: [
      { value: 'dividendos', label: 'Dividendos' },
      { value: 'rendimento', label: 'Rendimento' },
      { value: 'venda_ativo', label: 'Venda de Ativo' },
    ],
  },
  {
    value: 'outros_entrada',
    label: 'Outros',
    icon: '📦',
    subcategories: [],
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function getCategoryRegistry(type: 'income' | 'outcome'): CategoryDefinition[] {
  return type === 'income' ? INCOME_CATEGORY_REGISTRY : OUTCOME_CATEGORY_REGISTRY
}

export function findCategory(
  type: 'income' | 'outcome',
  categoryValue: string,
): CategoryDefinition | undefined {
  return getCategoryRegistry(type).find((c) => c.value === categoryValue)
}

export function findSubcategory(
  type: 'income' | 'outcome',
  categoryValue: string,
  subcategoryValue: string,
): SubcategoryDefinition | undefined {
  const cat = findCategory(type, categoryValue)
  return cat?.subcategories.find((s) => s.value === subcategoryValue)
}

/** Returns the display label for a category value */
export function getCategoryLabel(type: 'income' | 'outcome', categoryValue: string): string {
  return findCategory(type, categoryValue)?.label ?? categoryValue
}

/** Returns the display label for a subcategory value */
export function getSubcategoryLabel(
  type: 'income' | 'outcome',
  categoryValue: string,
  subcategoryValue: string,
): string {
  return findSubcategory(type, categoryValue, subcategoryValue)?.label ?? subcategoryValue
}

/** Returns the icon for a category */
export function getCategoryIcon(type: 'income' | 'outcome', categoryValue: string): string {
  return findCategory(type, categoryValue)?.icon ?? '📦'
}
