'use client'

import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react'
import type { InsightDTO } from '../../../application/ai/dtos/AIRequestDTO'
import { cn } from '../../../shared/utils/cn'

const TYPE_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  tip: { border: 'border-dt-green/30', bg: 'bg-dt-green/5', text: 'text-dt-green' },
  warning: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', text: 'text-yellow-400' },
  achievement: { border: 'border-dt-purple/30', bg: 'bg-dt-purple/5', text: 'text-dt-purple-light' },
  pattern: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400' },
}

interface AIInsightsPanelProps {
  insights: InsightDTO[]
  isLoading: boolean
  error: string | null
  onGenerate: () => void
}

export function AIInsightsPanel({ insights, isLoading, error, onGenerate }: AIInsightsPanelProps) {
  return (
    <div className="rounded-xl border border-dt-border bg-dt-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-dt-purple/10 p-2">
            <Sparkles className="h-4 w-4 text-dt-purple" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Insights da IA</h3>
            <p className="text-xs text-dt-muted">Análise inteligente dos seus gastos</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={cn(
            'cursor-pointer flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            isLoading
              ? 'bg-dt-purple/10 text-dt-muted'
              : 'bg-dt-purple/20 text-dt-purple-light hover:bg-dt-purple/30 active:scale-95',
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              {insights.length > 0 ? 'Atualizar' : 'Gerar insights'}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-dt-red/20 bg-dt-red/5 p-3 mb-3">
          <AlertTriangle className="h-4 w-4 text-dt-red flex-shrink-0 mt-0.5" />
          <p className="text-xs text-dt-red">{error}</p>
        </div>
      )}

      {insights.length === 0 && !isLoading && !error && (
        <div className="flex flex-col items-center py-8 text-center">
          <Sparkles className="h-8 w-8 text-dt-border mb-2" />
          <p className="text-sm text-dt-muted">Clique em &ldquo;Gerar insights&rdquo; para a IA analisar seus gastos</p>
          <p className="text-xs text-dt-muted/60 mt-1">A análise leva em conta todas as suas transações do período</p>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-2.5 animate-fade-in">
          {insights.map((insight, index) => {
            const style = TYPE_STYLES[insight.type] || TYPE_STYLES.tip
            return (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-3 transition-all hover:shadow-md',
                  style.border,
                  style.bg,
                )}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg flex-shrink-0">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-semibold', style.text)}>
                      {insight.title}
                    </p>
                    <p className="text-xs text-dt-muted mt-0.5 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
