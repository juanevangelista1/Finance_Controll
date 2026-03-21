'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '../../../shared/utils/formatter'

interface Props {
  data: { month: string; balance: number }[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  return (
    <div className="rounded-xl border border-dt-border bg-dt-surface p-3 shadow-xl">
      <p className="text-xs font-semibold text-white">{label}</p>
      <p className={`mt-1 text-xs font-semibold ${value >= 0 ? 'text-dt-green' : 'text-dt-red'}`}>
        {formatCurrency(value)}
      </p>
    </div>
  )
}

export function BalanceLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#2a2a3a" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          dot={{ fill: '#8b5cf6', r: 3 }}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
