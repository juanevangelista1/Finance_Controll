'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { CategoryData } from '../../hooks/useReports'
import { formatCurrency } from '../../../shared/utils/formatter'

interface Props {
  data: CategoryData[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: CategoryData }[] }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-xl border border-dt-border bg-dt-surface p-3 shadow-xl">
      <p className="text-xs font-semibold text-white">{item.name}</p>
      <p className="mt-1 text-xs text-dt-muted">{formatCurrency(item.value)}</p>
    </div>
  )
}

export function CategoryPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-dt-muted">Sem dados de despesas</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
